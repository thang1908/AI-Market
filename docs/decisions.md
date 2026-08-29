# Nhật ký quyết định kiến trúc

## 1. Quy ước

- Mọi ADR (Architecture Decision Record - Nhật ký quyết định kiến trúc) trong tài liệu này đang ở trạng thái **Proposed** (Đề xuất).
- Chưa có quyết định nào là authorization (sự cho phép) để viết application code (mã ứng dụng).
- Sau review, trạng thái hợp lệ: `Accepted` (Chấp nhận), `Rejected` (Từ chối), `Superseded` (Bị thay thế); ghi người duyệt/ngày/lý do.
- Khi assumption (giả định) hoặc open question (câu hỏi mở) thay đổi, cập nhật ADR liên quan thay vì chỉ sửa implementation (phần cài đặt).

## 2. Danh mục

| ADR | Quyết định đề xuất | Trạng thái | Open question/trigger chính |
|---|---|---|---|
| ADR-001 | Modular monolith + worker | Proposed | OQ-001 (Câu hỏi mở), OQ-004, OQ-044 |
| ADR-002 | PostgreSQL là nguồn sự thật | Proposed | OQ-009..013, OQ-045 |
| ADR-003 | Giữ SPA và chuyển đổi theo lát dọc | Proposed | OQ-001, OQ-051 |
| ADR-004 | REST JSON + SSE cho AI | Proposed | OQ-031, OQ-044 |
| ADR-005 | PostgreSQL filters/full-text trước search/vector riêng | Proposed | OQ-015, OQ-044, OQ-050 |
| ADR-006 | Managed LLM qua adapter provider-neutral | Proposed | OQ-026, OQ-028, OQ-035, OQ-046 |
| ADR-007 | Hold/booking transaction trong PostgreSQL | Proposed | OQ-009..011, OQ-019..020 |
| ADR-008 | DB-backed jobs + transactional outbox trước broker | Proposed | OQ-044, OQ-047, OQ-050 |
| ADR-009 | Không dùng Redis trong baseline | Proposed | OQ-044, OQ-050 |
| ADR-010 | Object storage + CDN cho media | Proposed | OQ-031, OQ-040, OQ-043 |
| ADR-011 | AI run/version/trust tier/citation bắt buộc | Proposed | OQ-027..030, OQ-033..035 |
| ADR-012 | Chưa triển khai STT/TTS/self-hosted model | Proposed | OQ-026, OQ-032 |
| ADR-013 | Tiền VND integer và timestamp UTC | Proposed | OQ-012, OQ-017 |
| ADR-014 | Hoãn chốt IdP/role/tenant, giữ boundary | Proposed | OQ-002..004 |

---

## ADR-001 — Modular monolith với background worker

### Bối cảnh

Sản phẩm chưa có backend (hệ thống xử lý phía sau), chưa có số tải, team ownership (đội ngũ chịu trách nhiệm) hoặc SLO (Cam kết chất lượng dịch vụ). Domain (Lĩnh vực nghiệp vụ) có nhiều module khác nhau. Tuy nhiên, các nghiệp vụ đặt chỗ, kho hàng, lưu trữ và khách hàng tiềm năng cần transaction (giao dịch) để đảm bảo consistency (tính nhất quán). Tại sao chọn monolith ban đầu? Vì tách thành nhiều microservice (dịch vụ nhỏ) sớm sẽ tăng độ phức tạp: phải quản lý giao tiếp phân tán giữa các service, triển khai nhiều nơi, và cần nhiều người trực vận hành (on-call).

### Quyết định đề xuất

Xây dựng một API (Giao diện lập trình ứng dụng) Python FastAPI theo kiến trúc modular monolith (khối thống nhất chia module rõ ràng) và một background worker (luồng xử lý nền) được triển khai riêng biệt. Cả hai sẽ dùng chung các hợp đồng module và mã nguồn. Ranh giới giữa các module được đảm bảo nghiêm ngặt bằng quy tắc phụ thuộc. Chúng ta dùng public application API (API ứng dụng công khai), event (sự kiện) và việc sở hữu bảng dữ liệu để kiểm soát.

### Phương án cân nhắc

- Áp dụng microservices theo AI/market/social ngay từ đầu.
- Dùng Backend-as-a-Service (Backend như một dịch vụ) hoặc serverless functions (hàm không máy chủ) rời rạc theo từng màn hình.
- Xây dựng một monolith nguyên khối không có ranh giới module rõ ràng.

### Hệ quả

- Ưu: Quản lý transaction đơn giản. Tốc độ bàn giao tính năng nhanh chóng. Yêu cầu ít hạ tầng hơn. Khi cần refactor (cấu trúc lại mã) hoặc tách service sau này sẽ có định hướng rõ ràng.
- Đổi lại: Yêu cầu tính kỷ luật cao để giữ đúng ranh giới các module. Việc triển khai (deploy) API phải thực hiện chung. Nếu xảy ra lỗi ở một phần, vùng ảnh hưởng (blast radius) có thể lớn hơn nếu không cách ly tốt. Background worker giúp giảm tải cho request chính, nhưng cơ sở dữ liệu vẫn là nguồn tài nguyên chung cần được theo dõi kỹ.

### Xem xét lại khi

Một module có nhu cầu scale (mở rộng quy mô), triển khai độc lập, tuân thủ tiêu chuẩn riêng, hoặc cần có đội ngũ quản lý riêng. Hoặc khi việc dùng chung cơ sở dữ liệu/triển khai gây nghẽn cổ chai liên tục mà không thể khắc phục bằng cách tối ưu hóa hay cách ly trong monolith.

---

## ADR-002 — PostgreSQL là nguồn sự thật nghiệp vụ

### Bối cảnh

Dữ liệu của hệ thống chủ yếu có tính chất quan hệ: phân cấp dự án, đơn vị chuẩn, báo giá, trạng thái đặt chỗ, hội thoại, bài đăng và nhật ký hệ thống. Đặc biệt, nghiệp vụ giữ chỗ cần những quy tắc bất biến (invariant) rất chặt chẽ. Tại sao chọn giải pháp này? Hiện tại, chúng ta chưa có đủ dữ liệu để chứng minh rằng hệ thống cần nhiều loại cơ sở dữ liệu (database) chuyên biệt khác nhau.

### Quyết định đề xuất

Sử dụng managed PostgreSQL (Dịch vụ PostgreSQL được quản lý sẵn) làm nguồn dữ liệu chính yếu (source of truth). Các thành phần khác như cache (bộ nhớ đệm), full-text/vector index (chỉ mục tìm kiếm toàn văn/vector), CDN (Mạng phân phối nội dung) và queue projection (dữ liệu hàng đợi) đều có thể được tái tạo. Chúng có thể được đối chiếu từ cơ sở dữ liệu chính, hộp thư đi (outbox) hoặc các bản ghi gốc.

### Phương án cân nhắc

- Dùng document database (cơ sở dữ liệu hướng tài liệu) làm nơi lưu trữ chính.
- Ngay từ đầu thiết kế mỗi module sử dụng một loại cơ sở dữ liệu riêng.
- Sử dụng Redis làm nơi lưu trữ trạng thái kho hàng và việc giữ chỗ đòi hỏi tốc độ cao.

### Hệ quả

- Ưu: Hỗ trợ tốt khóa ngoại (FK), các ràng buộc (constraint) và transaction. Việc truy vấn dữ liệu rất linh hoạt. Quá trình vận hành và sao lưu (backup) đơn giản.
- Đổi lại: Phải quản lý connection (kết nối), index (chỉ mục) và quá trình vacuum (dọn dẹp) cẩn thận. Cần bảo vệ hệ thống xử lý giao dịch (OLTP) khỏi các truy vấn phân tích hoặc công việc nặng. Ranh giới sở hữu cấu trúc dữ liệu (schema) giữa các module phải được thực thi nghiêm ngặt dù dùng chung một cơ sở dữ liệu.

### Xem xét lại khi

Có những luồng công việc cụ thể không còn phù hợp với PostgreSQL. Đồng thời, các chỉ số (metric) cho thấy việc dùng một cơ sở dữ liệu chuyên biệt mang lại lợi ích lớn hơn chi phí vận hành và quản lý tính nhất quán.

---

## ADR-003 — Giữ SPA hiện tại, chuyển đổi theo lát dọc

### Bối cảnh

Giao diện người dùng (UI) xây dựng bằng React/Vite đã thể hiện tốt phần lớn trải nghiệm cần thiết. Vấn đề chính hiện tại là việc sử dụng dữ liệu giả (mock data), Context quá lớn và thiếu router (bộ định tuyến), API, xác thực. Tại sao không viết lại? Việc viết lại toàn bộ frontend (giao diện) không giải quyết trực tiếp các vấn đề về domain hay backend (máy chủ). Hơn nữa, điều này rất dễ làm sai lệch trải nghiệm người dùng (UX) hiện có.

### Quyết định đề xuất

Giữ nguyên SPA (Single Page Application - Ứng dụng trang đơn) hiện tại. Thêm router, typed client (client có định kiểu) và server state (trạng thái máy chủ) sau khi các API contract (giao kèo API) được duyệt. Chuyển đổi từng tính năng từ dữ liệu giả sang dùng API theo lát dọc (phát triển hoàn thiện từ frontend xuống backend cho từng tính năng). Chỉ xóa các mã giả trên môi trường production (thực tế) sau khi đã kiểm chứng thành công.

### Phương án cân nhắc

- Viết lại toàn bộ frontend và framework trước khi làm backend.
- Giữ toàn bộ trạng thái hệ thống trong Context toàn cục và chỉ thay thế mock data bằng lệnh fetch.
- Chuyển sang SSR (Server-Side Rendering - Kết xuất phía máy chủ) ngay lập tức để giải quyết vấn đề chia sẻ link sâu và tối ưu hóa tìm kiếm (SEO).

### Hệ quả

- Ưu: Bảo toàn được giao diện hiện tại. Giảm thiểu rủi ro khi thay đổi toàn bộ hệ thống cùng lúc (big-bang risk). Cho phép kiểm thử giao kèo API theo từng tính năng cụ thể.
- Đổi lại: Trong giai đoạn chuyển tiếp, hệ thống sẽ tồn tại song song cả mã giả và đường dẫn API thật. Cần sử dụng các cờ báo (flag) và chú ý tránh tình trạng có hai nguồn dữ liệu không đồng nhất. Việc áp dụng SSR để cải thiện SEO cần được đánh giá riêng nếu câu hỏi OQ-051 cho thấy đây là yêu cầu bắt buộc.

### Xem xét lại khi

Các yêu cầu về SEO, hiệu suất (performance) hoặc nội dung công khai đòi hỏi phải dùng SSR/SSG (Static Site Generation - Tạo trang tĩnh) một cách rõ ràng. Hoặc khi framework hiện tại không còn đáp ứng được các yêu cầu phi chức năng (NFR) đã được đo lường.

---

## ADR-004 — REST JSON và SSE cho streaming AI

### Bối cảnh

Phần lớn các chức năng trong hệ thống là các thao tác CRUD (Tạo, Đọc, Cập nhật, Xóa), lọc và phân trang dữ liệu. Chức năng chat cần máy chủ gửi các thông tin như token (chuỗi mã hóa), trạng thái, và citation (trích dẫn) theo một chiều. Tại sao chọn giao thức đơn giản? Hiện tại, giao diện người dùng chưa yêu cầu các tính năng cộng tác thời gian thực (collaborative realtime) phức tạp cần dùng đến WebSocket (giao thức giao tiếp hai chiều).

### Quyết định đề xuất

Sử dụng REST JSON (giao thức truyền tải dữ liệu định dạng JSON) có phân bản tại đường dẫn `/api/v1`. Chạy các tiến trình AI bằng lệnh POST. Dữ liệu stream (truyền liên tục) sẽ được đọc qua SSE (Server-Sent Events - Sự kiện từ máy chủ gửi về) có kèm ID sự kiện và khả năng tự kết nối lại. Giao kèo API chính được mô tả trong OpenAPI. Các sự kiện SSE sẽ được phiên bản hóa và làm tài liệu riêng biệt.

### Phương án cân nhắc

- Dùng GraphQL (ngôn ngữ truy vấn dữ liệu) cho toàn bộ dữ liệu.
- Dùng WebSocket cho mọi giao tiếp thời gian thực.
- Sử dụng phương pháp Long polling (chờ phản hồi lâu) hoặc chỉ trả về kết quả AI khi đã hoàn tất toàn bộ.

### Hệ quả

- Ưu: Dễ dàng cache (lưu trữ tạm thời), quan sát hệ thống và kiểm thử. SSE rất phù hợp với việc truyền dữ liệu một chiều và hoạt động tốt qua các proxy HTTP.
- Đổi lại: Phải quản lý việc kết nối lại, lưu giữ stream và sức chứa kết nối của máy chủ. OpenAPI không thể mô tả hoàn hảo cho SSE. Nếu sau này cần tính năng thời gian thực hai chiều, chúng ta có thể thêm một kênh riêng biệt.

### Xem xét lại khi

Số lượng stream đồng thời hoặc giới hạn của proxy làm hệ thống không đạt SLO. Hoặc khi tính năng mạng xã hội/cộng tác thực sự yêu cầu giao tiếp hai chiều với độ trễ thấp.

---

## ADR-005 — Structured filters và PostgreSQL full-text trước search/vector cluster

### Bối cảnh

Chức năng tìm kiếm trên giao diện chủ yếu dựa vào các thông số địa lý, giá cả, diện tích, số phòng, trạng thái và từ khóa. Khối lượng dữ liệu, yêu cầu độ trễ và chất lượng tìm kiếm vẫn chưa được xác định rõ. Tại sao chọn giải pháp đơn giản trước? Việc thiết lập ngay một cụm máy chủ tìm kiếm (search cluster) hoặc vector riêng biệt sẽ làm tăng độ phức tạp trong việc đồng bộ hóa. Đồng thời, nó cũng làm tăng chi phí và công sức vận hành.

### Quyết định đề xuất

Sử dụng truy vấn có cấu trúc (structured query) kết hợp với công cụ tìm kiếm toàn văn (full-text) của PostgreSQL. Đối với tìm kiếm bằng ngôn ngữ tự nhiên (NL search), chúng ta chỉ trích xuất các bộ lọc rồi chạy truy vấn tất định. Sẽ thử nghiệm `pgvector` (tiện ích vector cho PostgreSQL) sau khi đánh giá xem việc truy xuất ngữ nghĩa có thực sự cần thiết hay không. Chỉ cân nhắc sử dụng hệ thống tìm kiếm/vector riêng khi có dữ liệu đo lường cụ thể.

### Phương án cân nhắc

- Sử dụng OpenSearch hoặc Elasticsearch ngay từ đầu.
- Thiết lập một cơ sở dữ liệu vector riêng để xử lý toàn bộ chức năng tìm kiếm.
- Dùng Mô hình ngôn ngữ lớn (LLM) để đọc toàn bộ dữ liệu ngữ cảnh mà không cần đánh chỉ mục.

### Hệ quả

- Ưu: Giải pháp này đơn giản, dễ duy trì tính nhất quán dữ liệu (consistency). Việc kiểm soát quyền truy cập (authorization) cũng dễ dàng hơn và chi phí hệ thống thấp.
- Đổi lại: Xử lý lỗi chính tả (typo), từ đồng nghĩa (synonym) và xếp hạng (ranking) cho tiếng Việt có thể cần nhiều công sức tinh chỉnh. Khả năng mở rộng quy mô và xếp hạng phức tạp bị giới hạn. Cần thu thập dữ liệu về truy vấn (telemetry) để biết khi nào cần chuyển đổi hệ thống.

### Xem xét lại khi

PostgreSQL không đáp ứng được yêu cầu về độ trễ, độ phủ hoặc xếp hạng trên tập dữ liệu và truy vấn thực tế. Hoặc khi nhu cầu tìm kiếm mờ (fuzzy), phân tích khía cạnh (faceted) hoặc lọc dữ liệu vượt quá khả năng xử lý hợp lý.

---

## ADR-006 — Managed LLM qua adapter provider-neutral

### Bối cảnh

Dữ liệu giả hiện tại đang dùng cấu trúc của Gemini nhưng chúng ta chưa có nhà cung cấp nào được phê duyệt chính thức. Tại sao không tự chạy mô hình? Việc tự vận hành mô hình (self-host) đòi hỏi tài nguyên GPU (bộ xử lý đồ họa), nhân sự trực vận hành và quy trình đánh giá. Trong khi đó, chúng ta chưa có các yêu cầu cụ thể về quyền riêng tư (privacy), tải hệ thống hay tổng chi phí.

### Quyết định đề xuất

Sử dụng các dịch vụ LLM được quản lý (managed LLM) qua một `ModelGateway` (bộ chuyển đổi trung lập). Cổng này cho phép cấu hình, định tuyến mô hình và chọn phiên bản tùy tình huống. Các chính sách về công cụ và câu lệnh (prompt) sẽ không bị phụ thuộc vào SDK (Bộ công cụ phát triển) của một nhà cung cấp cụ thể. Hệ thống có cấu hình giới hạn thời gian (timeout), hạn mức (quota), kiểm soát chi phí và cơ chế dự phòng.

### Phương án cân nhắc

- Code cứng (Hard-code) việc sử dụng Gemini vì đã có sẵn thư viện.
- Tự triển khai mô hình mở ngay từ phiên bản đầu tiên.
- Cho phép từng tính năng gọi trực tiếp đến SDK của các nhà cung cấp.

### Hệ quả

- Ưu: Thời gian đưa ra thị trường nhanh chóng. Năng lực hệ thống tốt và giảm bớt công sức vận hành hạ tầng GPU. Dễ dàng chuyển đổi hoặc so sánh giữa các mô hình khác nhau.
- Đổi lại: Bị phụ thuộc vào chính sách dữ liệu, chi phí và hạn mức của nhà cung cấp. Bộ chuyển đổi (adapter) không thể loại bỏ hoàn toàn sự khác biệt về năng lực giữa các mô hình. Các vấn đề về nhà cung cấp và thời gian lưu giữ dữ liệu cần được phê duyệt trước khi chạy thực tế.

### Xem xét lại khi

Có dữ liệu chứng minh rằng dịch vụ quản lý (managed provider) không còn phù hợp do các vấn đề về quyền riêng tư, vị trí dữ liệu, độ trễ, tính khả dụng hoặc tổng chi phí sở hữu (TCO).

---

## ADR-007 — Inventory hold/booking dùng transaction PostgreSQL

### Bối cảnh

Giao diện người dùng hiển thị trạng thái đặt chỗ hoặc giữ chỗ (hold). Trạng thái của các căn hộ có thể bị thay đổi cùng lúc bởi nhiều người dùng. Tại sao cần thiết kế cẩn thận? Việc sai lệch các quy tắc bất biến sẽ gây ra hậu quả kinh doanh nghiêm trọng. Sử dụng bộ nhớ đệm (cache) hoặc bản sao dữ liệu trên máy khách (client snapshot) là không đủ an toàn để ngăn chặn tình trạng đặt trùng (double booking).

### Quyết định đề xuất

Kiểm tra trạng thái giữ chỗ trong một transaction trên cơ sở dữ liệu PostgreSQL chính. Sử dụng cơ chế khóa hàng (row lock) và các ràng buộc (constraint) để đảm bảo tính an toàn. Đảm bảo tính lũy đẳng (idempotency - gọi nhiều lần vẫn ra một kết quả). Trạng thái và sự kiện hộp thư đi (outbox) sẽ được commit (lưu thành công) cùng lúc. Không dùng Redis làm nơi quyết định kết quả cuối cùng.

### Phương án cân nhắc

- Sử dụng khóa phân tán (distributed lock) của Redis làm nguồn phán quyết.
- Áp dụng kiểm tra lạc quan (optimistic) chỉ dựa trên phía khách.
- Đưa mọi yêu cầu đặt chỗ vào một hàng đợi (queue) để xử lý tuần tự trước khi trả lời.

### Hệ quả

- Ưu: Đảm bảo các quy tắc bất biến mạnh mẽ. Cách xử lý lỗi rõ ràng. Việc kiểm toán (audit) và phục hồi hệ thống rất đơn giản.
- Đổi lại: Tình trạng tranh chấp (contention) ở những căn hộ hot yêu cầu phải có chỉ mục (index) tốt và giao dịch phải diễn ra thật ngắn. Vấn đề cập nhật dữ liệu từ nguồn đối tác bên ngoài vẫn nằm ngoài khả năng của giao dịch. Quyết định này chưa được triển khai cho đến khi các quy tắc về đặt chỗ và thời gian sống của lệnh giữ chỗ được duyệt.

### Xem xét lại khi

Nguồn cung cấp kho hàng bên ngoài mới là nơi quyết định giao dịch, hoặc khi số lượng giao dịch thực tế vượt quá khả năng xử lý của PostgreSQL. Khi đó, chúng ta cần xây dựng một giao thức đặt chỗ với bên quyết định, chứ không chỉ đơn thuần là đổi loại cơ sở dữ liệu.

---

## ADR-008 — DB-backed job queue và transactional outbox trước broker riêng

### Bối cảnh

Hệ thống có nhiều công việc chạy nền (background job) như: nạp dữ liệu, thông báo, kiểm duyệt và xử lý AI theo lô. Các công việc này cần khả năng thử lại khi lỗi (retry). Tại sao chọn giải pháp này? Hiện tại chúng ta chưa rõ khối lượng công việc hay mức độ phân tán (fan-out). Khi thay đổi dữ liệu nghiệp vụ, chúng ta cần phát ra sự kiện một cách an toàn mà không bị mất giữa lúc lưu (commit) và lúc phát đi (publish).

### Quyết định đề xuất

Sử dụng các bảng dữ liệu `jobs` và `outbox_events`. Các worker (tiến trình nền) sẽ nhận việc thông qua cơ chế khóa (locking). Mô hình xử lý là ít-nhất-một-lần (at-least-once) và tiến trình tiêu thụ (consumer) phải đảm bảo tính lũy đẳng. Dữ liệu outbox sẽ được tạo ra cùng trong giao dịch nghiệp vụ để đảm bảo tính toàn vẹn.

### Phương án cân nhắc

- Sử dụng một dịch vụ hàng đợi (queue) được quản lý riêng cho mọi công việc ngay từ đầu.
- Triển khai hệ thống Kafka hoặc truyền phát sự kiện (event streaming) từ đầu.
- Gọi trực tiếp đến các nhà cung cấp bên ngoài một cách đồng bộ ngay trong lúc xử lý request.

### Hệ quả

- Ưu: Hệ thống có ít thành phần hơn. Đảm bảo tính nguyên tử (atomicity) cùng với cơ sở dữ liệu. Rất dễ dàng để gỡ lỗi (debug) và chạy lại (replay) sự kiện ở quy mô ban đầu.
- Đổi lại: Tạo thêm tải cho cơ sở dữ liệu do việc thăm dò (polling) và dọn dẹp. Khả năng phân tán sự kiện, thời gian lưu giữ và thông lượng (throughput) bị giới hạn. Dữ liệu sự kiện (payload) phải nhỏ; các tệp lớn phải được lưu ở object storage riêng.

### Xem xét lại khi

Độ trễ của công việc (job lag), tải hệ thống hoặc mức độ phân tán không còn đạt SLO sau khi đã tối ưu. Hoặc khi có yêu cầu tích hợp bắt buộc phải sử dụng một trình môi giới (broker) chuyên dụng cụ thể.

---

## ADR-009 — Không dùng Redis trong baseline

### Bối cảnh

Chúng ta chưa có thông số về hiệu suất hệ thống thực tế. Việc sử dụng CDN, HTTP cache và PostgreSQL là đủ để bắt đầu. Tại sao không dùng Redis? Đưa Redis vào sớm sẽ sinh ra các vấn đề về làm mới dữ liệu (invalidation), tính sẵn sàng cao (HA) và bảo mật. Nó cũng dễ biến thành một nguồn lưu trữ trạng thái bị lạm dụng.

### Quyết định đề xuất

Không cài đặt Redis trong cấu hình chuẩn (baseline). Chúng ta sẽ dùng các cơ chế kiểm soát tốc độ tại biên (edge rate controls), cơ sở dữ liệu hoặc HTTP cache, đồng thời đo lường điểm nghẽn. Nếu sau này cần thêm, Redis chỉ được đóng vai trò là bộ nhớ đệm tạm thời (ephemeral cache) hoặc lưu trữ trạng thái giới hạn tốc độ, tuyệt đối không làm nguồn dữ liệu gốc (source of truth).

### Phương án cân nhắc

- Sử dụng Redis làm giải pháp mặc định cho session (phiên bản), cache, khóa và bộ đếm.
- Xây dựng cache trên bộ nhớ (In-memory cache) chạy giữa nhiều phiên bản API.

### Hệ quả

- Ưu: Giữ hệ thống đơn giản. Tiết kiệm chi phí vận hành và trực hệ thống (on-call). Đảm bảo tính đúng đắn của dữ liệu một cách rõ ràng.
- Đổi lại: Một số truy vấn đọc nhiều (hot read) hoặc việc giới hạn tốc độ (rate-limit) có thể đòi hỏi những giải pháp thay thế phức tạp hơn sau này. Bắt buộc phải theo dõi sát sao cơ sở dữ liệu và khả năng xử lý tại biên.

### Xem xét lại khi

Có số liệu (metric) chứng minh rằng việc giới hạn tốc độ phân tán, các truy vấn đọc tần suất cao hoặc độ trễ của bộ đếm cần đến Redis. Và điều này phải đi kèm với quy trình làm mới dữ liệu (invalidation) rõ ràng.

---

## ADR-010 — Object storage và CDN cho media

### Bối cảnh

Giao diện người dùng sử dụng rất nhiều hình ảnh, và có thể có cả video hay tài liệu pháp lý. Tại sao chọn lưu ngoài? Nếu lưu các tệp tin nhị phân trực tiếp trong cơ sở dữ liệu, hoặc bắt API phải làm trung gian cho mọi luồng tải dữ liệu, sẽ gây tải rất lớn. Chi phí sẽ tăng cao và việc phân phối nội dung cũng trở nên chậm chạp.

### Quyết định đề xuất

Lưu trữ các tệp nhị phân tại object storage (hệ thống lưu trữ đối tượng). Các siêu dữ liệu (metadata), quyền truy cập và vòng đời tệp sẽ được quản lý bằng PostgreSQL. Quá trình tải lên sẽ dùng chữ ký trực tiếp (signed direct upload). Tệp sẽ được cách ly (quarantine) và quét mã độc rồi mới phát hành. Chúng ta sử dụng CDN để phân phối nhanh cho những tài nguyên công khai.

### Phương án cân nhắc

- Lưu trực tiếp dữ liệu dạng blob trong PostgreSQL.
- Nhúng trực tiếp toàn bộ link URL từ các nguồn bên ngoài.
- Việc tải lên và phục vụ tệp thông qua API của hệ thống máy chủ.

### Hệ quả

- Ưu: Đảm bảo độ bền dữ liệu, khả năng mở rộng (scale) và phân phối qua CDN tốt. API sẽ hoạt động rất nhẹ nhàng. Vòng đời của các tài nguyên được quản lý rõ ràng.
- Đổi lại: Yêu cầu phải xử lý các URL có chữ ký và vấn đề chia sẻ tài nguyên khác nguồn (CORS). Cần có quy trình quét mã độc, chuyển đổi định dạng, đảm bảo quyền riêng tư và dọn dẹp các tệp rác. Các chính sách cho video và tài liệu pháp lý vẫn đang chờ yêu cầu cụ thể.

### Xem xét lại khi

Nhà cung cấp hoặc chính sách cấp phép nội dung yêu cầu lưu trữ bên ngoài. Hoặc khi khối lượng xử lý media đòi hỏi phải có một luồng làm việc (pipeline) hoặc dịch vụ streaming chuyên dụng.

---

## ADR-011 — Versioned AI runs, trust tier và citation

### Bối cảnh

Giao diện sử dụng AI để cung cấp thông tin về giá cả, dự án và đánh giá. Tuy nhiên, dữ liệu giả hiện tại đang có sự mâu thuẫn. Tại sao cần lưu vết? Nếu không lưu lại nguồn gốc (provenance) hoặc phiên bản, chúng ta sẽ rất khó để giải thích kết quả AI, kiểm thử độ chính xác hoặc sửa chữa sai sót khi cần thiết.

### Quyết định đề xuất

Mỗi lần chạy AI (AI run) sẽ được lưu lại với đầy đủ phiên bản của mô hình, câu lệnh, công cụ, độ trễ và trích dẫn (citation). Quá trình truy xuất dữ liệu được chia thành các cấp: T1 chuẩn (canonical), T2 đã xác minh (verified), T3 do người dùng tạo (UGC), T4 chưa xác minh. Kết quả đầu ra sẽ phân biệt rõ loại nguồn, và AI sẽ từ chối trả lời (abstain) khi thiếu bằng chứng chắc chắn.

### Phương án cân nhắc

- Chỉ lưu lại kết quả văn bản cuối cùng của AI.
- Cho phép mô hình tự động "bịa" đường link và trích dẫn.
- Trộn lẫn dữ liệu từ người dùng (UGC) và dữ liệu chuẩn mà không dán nhãn phân biệt.

### Hệ quả

- Ưu: Hỗ trợ tốt cho việc kiểm toán, đánh giá, gỡ lỗi và hoàn tác. Giúp tăng độ tin cậy của hệ thống và hỗ trợ quy trình sửa lỗi khi AI trả lời sai.
- Đổi lại: Cấu trúc lưu trữ và giao diện hiển thị trích dẫn sẽ phức tạp hơn. Cần có chính sách lưu giữ và phân quyền truy cập nghiêm ngặt. Hệ thống sẽ không lưu lại toàn bộ quá trình suy nghĩ (chain-of-thought) của AI để bảo vệ quyền riêng tư.

### Xem xét lại khi

Các yêu cầu về pháp lý hoặc sản phẩm thay đổi tiêu chuẩn về trích dẫn và lưu giữ. Hoặc khi có một chức năng sử dụng không cần lưu vết phức tạp. Dù vậy, vẫn phải duy trì việc lưu giữ nguồn gốc ở mức tối thiểu cho các dữ kiện.

---

## ADR-012 — Chưa triển khai STT, TTS hoặc self-hosted model

### Bối cảnh

Giao diện hiện tại không có luồng tương tác bằng giọng nói. Việc đính kèm tệp cũng chưa được thống nhất. Tại sao cần tạm hoãn? Nếu bổ sung thêm tính năng giọng nói hoặc phục vụ mô hình AI riêng (self-hosted), sẽ kéo theo hàng loạt yêu cầu về sự đồng thuận ghi âm (consent), độ trễ, lưu trữ và GPU. Việc vận hành lúc này là không cần thiết khi chưa có yêu cầu cụ thể.

### Quyết định đề xuất

Đánh dấu các tính năng Nhận diện giọng nói (STT), Tổng hợp giọng nói (TTS) và mô hình tự vận hành (self-hosted) là không nằm trong phạm vi chuẩn (baseline). Chỉ thiết kế các phần này (bằng ADR mới) sau khi trải nghiệm người dùng, quyền riêng tư, nhà cung cấp và ngân sách đã được phê duyệt.

### Phương án cân nhắc

- Thêm sẵn một API xử lý giọng nói để dự phòng.
- Sử dụng API giọng nói của trình duyệt mà không có chính sách kiểm soát trên máy chủ.
- Xây dựng ngay một máy chủ GPU/mô hình chạy cùng với chức năng chat.

### Hệ quả

- Ưu: Tránh mở rộng phạm vi dự án, tiết kiệm chi phí và giảm thiểu rủi ro bảo mật chưa cần thiết. Cho phép đội ngũ tập trung tối đa vào chất lượng xử lý văn bản.
- Đổi lại: Nếu tính năng giọng nói trở thành một phần thiết yếu sau này, chúng ta sẽ phải cập nhật lại phần lớn kiến trúc, API và hạ tầng trước khi có thể bắt đầu code.

### Xem xét lại khi

Các câu hỏi OQ có yêu cầu rõ ràng về giao diện và luồng xử lý toàn trình, đồng thời có người chịu trách nhiệm và ngân sách cụ thể để thực hiện.

---

## ADR-013 — Money là integer VND, time là UTC có semantic timestamp

### Bối cảnh

Dữ liệu giả hiện đang sử dụng số tiền với các thang đo khác nhau (giữa bán và thuê). Thời gian (timestamp) đang bị trộn lẫn giữa nhiều định dạng hiển thị. Tại sao phải chuẩn hóa? Sự không nhất quán này gây ra các lỗi nghiêm trọng khi lọc, sắp xếp, phân tích dữ liệu và ảnh hưởng đến tính cập nhật của thông tin trích dẫn.

### Quyết định đề xuất

Lưu trữ và truyền tải thông tin tiền tệ bằng số nguyên VND (integer VND) với kiểu `bigint` hoặc số nguyên an toàn trong JSON. Tên trường dữ liệu luôn có hậu tố `*AmountVnd`. Lưu trữ thời gian bằng kiểu `timestamptz` và xuất API theo định dạng UTC chuẩn. Phân biệt rõ các mốc thời gian: ngày tạo (created), ngày xuất bản (published), ngày có hiệu lực (effective) và ngày cập nhật (updated).

### Phương án cân nhắc

- Lưu trữ bằng số thực (float) theo đơn vị tỷ hoặc triệu.
- Dùng chuỗi hiển thị (display string) làm chuẩn lưu trữ gốc.
- Lưu thời gian theo giờ địa phương (local time) mà không có thông tin múi giờ.

### Hệ quả

- Ưu: Đảm bảo việc tính toán và so sánh luôn chính xác. Không còn sự mơ hồ về đơn vị tính hay múi giờ giữa các hệ thống khác nhau.
- Đổi lại: Cần xây dựng các bộ định dạng hiển thị (formatter) và kịch bản chuyển đổi dữ liệu. Phía frontend phải chú ý xử lý giới hạn an toàn số nguyên của JavaScript nếu giá trị quá lớn. Các thông tin về thuế, phí hay tổng giá vẫn phải chờ các quy định chi tiết.

### Xem xét lại khi

Hệ thống cần hỗ trợ đa tiền tệ hoặc yêu cầu độ chính xác khác (số thập phân). Khi đó chúng ta sẽ bổ sung thêm mô hình tiền tệ chi tiết, chứ không quay lại việc dùng số hiển thị mơ hồ.

---

## ADR-014 — Hoãn chọn IdP, role và tenant model nhưng giữ boundary

### Bối cảnh

Giao diện có hiển thị avatar và các loại tác giả khác nhau, nhưng chưa có luồng công việc cho xác thực (auth) hoặc phân quyền. Tại sao khoan chọn? Nếu vội vàng chọn ngay một giải pháp gửi OTP, OAuth, kiến trúc đa khách hàng (multi-tenant) hay phân quyền (role) lúc này, chúng ta sẽ tự tạo ra các yêu cầu không có thật. Điều này có thể dẫn đến việc phải đập đi xây lại (migration) rất lớn sau này.

### Quyết định đề xuất

Giữ nguyên ranh giới hệ thống (boundary) về `Identity & Access` (Định danh và Truy cập). Giữ lại các bảng chuẩn như `users` (người dùng), `organizations` (tổ chức) cùng với các điểm móc phân quyền. Tuyệt đối không chốt nhà cung cấp định danh (IdP - Identity Provider), các loại vai trò, cột lưu khách hàng (tenant column) hoặc quyền hạn của khách trước khi các yêu cầu sản phẩm được làm rõ.

### Phương án cân nhắc

- Giả định rằng mọi người dùng đều giống nhau và mọi API đều công khai.
- Chọn đại ngay một nhà cung cấp IdP hoặc bộ phân quyền theo thói quen cũ.
- Gắn thêm cột `tenant_id` vào mọi bảng dữ liệu dù hệ thống chưa hề hỗ trợ đa khách hàng.

### Hệ quả

- Ưu: Tránh việc tự tạo ra các luật kinh doanh sai lệch. Hệ thống không bị phụ thuộc sớm vào một nhà cung cấp nào. Code xử lý xác thực không bị rải rác khắp nơi.
- Đổi lại: OpenAPI sẽ bị chặn một số phần phụ thuộc vào xác thực. Không thể triển khai các tính năng thay đổi dữ liệu lên môi trường thật (production) trước khi có quyết định. Khi yêu cầu được làm rõ, bắt buộc phải viết một ADR mới chi tiết về xác thực.

### Xem xét lại khi

Phía Sản phẩm (Product) có câu trả lời rõ ràng cho các yêu cầu về định danh, và bộ phận Bảo mật xác nhận các luồng đồng ý (consent) cần thiết.

## 3. Mẫu phê duyệt

Khi review, ghi thêm dưới ADR tương ứng:

```text
Decision status: Accepted | Rejected | Superseded
Approved by: <name/role>
Approved at: <YYYY-MM-DD>
Notes / conditions: <text>
Supersedes / superseded by: <ADR, nếu có>
```

Các ADR được `Accepted` nhưng còn điều kiện phải liên kết OQ/issue và không được xem là hoàn tất cho đến khi điều kiện được đóng.

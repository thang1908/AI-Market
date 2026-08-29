# Yêu cầu sản phẩm và nghiệp vụ

## 1. Trạng thái tài liệu

- Trạng thái: **Bản nháp để duyệt**.
- Phạm vi: Mô tả hành vi đang thể hiện trong thiết kế giao diện giả lập (mock UI/UX). Tài liệu cũng bao gồm các năng lực backend (hệ thống máy chủ) cần có để hiện thực hóa các hành vi đó.
- Nguồn khảo sát: `src/App.tsx`, `src/state/useAppState.tsx`, `src/types.ts`. Các component trong `src/components/` và dữ liệu trong `src/data/`.
- Nguyên tắc: Nội dung được phân loại thành **Đã quan sát**, **Đề xuất thiết kế** hoặc **Chưa xác định**. Mục chưa xác định được theo dõi tại [open-questions.md](./open-questions.md). Các mục này không được xem là yêu cầu đã phê duyệt.
- Cổng kiểm soát: Chưa viết application code (mã nguồn ứng dụng) cho đến khi bộ tài liệu thiết kế được duyệt rõ ràng.

### 1.1 Danh mục nguồn yêu cầu

| Nguồn | Nội dung sử dụng | Giới hạn |
|---|---|---|
| Yêu cầu trực tiếp của người dùng | Thiết kế backend đầy đủ từ mock UI/UX; phải tạo đủ 9 tài liệu và dừng trước khi lập trình thực tế | Không cung cấp actor (người dùng hoặc hệ thống tương tác), nguồn data, SLA (cam kết chất lượng dịch vụ), cloud hoặc chính sách cho production (môi trường thực tế) |
| `src/App.tsx`, `src/components/**` | Màn hình, điều hướng, input/action, modal, loading/empty state và luồng chéo | Chỉ phản ánh mock UI. Không chứng minh nghiệp vụ production |
| `src/state/useAppState.tsx` | State/action, persistence (lưu trữ dữ liệu) và behavior demo | Rule/keyword/localStorage hiện tại không mặc định là kiến trúc hoặc rule production |
| `src/types.ts` | Entity/field/status/role đang dùng trong mock | Có type trùng hoặc không nhất quán. Chưa phải API contract (hợp đồng API) |
| `src/data/mock*.ts` | Mẫu listing, project, unit, market/news/social và quan hệ demo | Có ID, giá, timestamp và nguồn mâu thuẫn. Không phải dữ liệu chuẩn |
| Khảo sát chạy UI local | Xác nhận ba luồng AI/Market/Social và hành vi responsive/modal | Không có backend/external integration để kiểm chứng side effect (tác động làm thay đổi dữ liệu) |
| Tài liệu nghiệp vụ/API/cloud bên ngoài | Không được cung cấp | Mọi khoảng trống được ghi tại `open-questions.md` |

## 2. Bối cảnh hiện tại

Sản phẩm hiện là SPA (Single Page Application) React/Vite với ba khu vực chính:

1. **AI**: Hỏi đáp bất động sản, lịch sử hội thoại, thông tin giá. Có dự án nổi bật, tin tức và nội dung cảnh báo rủi ro.
2. **Thị trường**: Nhà bán, nhà cho thuê, dự án sơ cấp, tồn kho theo căn. Có đánh giá và so sánh bằng AI, lưu thông tin và liên hệ tư vấn.
3. **Cộng đồng**: Bảng tin, bài viết đa loại, tác giả/đơn vị đã xác minh. Hỗ trợ bình luận, tương tác, tìm kiếm bằng AI. Cung cấp nội dung liên kết tới dự án hoặc tin đăng.

Hiện trạng là mock demo (bản trình diễn giả lập):

- Điều hướng bằng React Context. Hệ thống chưa có URL route hoặc deep link (liên kết sâu vào thẳng trang con).
- Dữ liệu lấy từ file mock (dữ liệu giả). Việc lọc, tìm kiếm và trả lời AI chủ yếu dùng rule/keyword ở phía trình duyệt.
- Chưa có backend. Chưa có cơ chế đăng nhập, phân quyền, đồng bộ đa thiết bị hoặc nguồn dữ liệu production.
- Một phần trạng thái được lưu bằng `localStorage`. Cơ chế này không phù hợp để làm nguồn dữ liệu chính cho production.
- `MarketSearch.tsx` không còn được import. `MarketPage.tsx` đang dùng `MarketAISearch.tsx`. File cũ cần được xóa hoặc đánh dấu deprecated (đã lỗi thời).
- `SocialFeedCategory` trong `types.ts` chứa các giá trị thừa không dùng trong UI. Bao gồm: FOR_YOU, PROJECT, PRICE, PLANNING, INFRASTRUCTURE, INVESTMENT, VIDEO.
- Các thao tác liên hệ, giữ chỗ, tạo bài viết và bình luận chỉ tạo phản hồi UI. Chúng chưa thực hiện quy trình nghiệp vụ thật.

## 3. Mục tiêu

- Chuyển các luồng đã thể hiện trong UI thành hợp đồng nghiệp vụ và backend nhất quán.
- Tạo một nguồn dữ liệu chuẩn cho tin đăng, dự án, căn hàng, giá. Nguồn này cũng chứa nội dung thị trường và cộng đồng.
- Cho phép tìm kiếm và lọc có cấu trúc. Dùng AI để hiểu ý định, tổng hợp và giải thích. Trả lời của AI phải lấy từ dữ liệu có nguồn dẫn rõ ràng.
- Bảo vệ các thao tác quan trọng như liên hệ, giữ chỗ và booking. Tránh lỗi lặp và kiểm soát xung đột đồng thời. Không để xảy ra thay đổi trạng thái ngoài ý muốn.
- Cung cấp nền tảng có thể vận hành ổn định. Hệ thống bao gồm bảo mật, audit (nhật ký kiểm toán) và quan sát hệ thống. Hỗ trợ xử lý nền và triển khai theo từng môi trường.
- Giữ kiến trúc ban đầu đơn giản. Luôn có sẵn giải pháp nâng cấp khi lượng dữ liệu và tải thực tế yêu cầu.

## 4. Ngoài phạm vi đã được xác nhận

Các mục sau **không được coi là phạm vi hiện tại**, vì UI hoặc yêu cầu chưa đủ bằng chứng:

- Thanh toán trực tuyến, đặt cọc, KYC (định danh khách hàng), ký hợp đồng điện tử.
- STT (chuyển giọng nói thành văn bản), TTS (chuyển văn bản thành giọng nói). Gọi thoại hoặc trợ lý giọng nói.
- Tự vận hành GPU hay model LLM riêng.
- Giao dịch mua bán hoặc cho thuê khép kín trên nền tảng.
- Chức năng back-office/admin hoàn chỉnh.
- Cam kết SLA/SLO (mục tiêu chất lượng dịch vụ) hay RPO/RTO (thời điểm và thời gian phục hồi hệ thống) bằng con số cụ thể.
- Cơ chế đa tenant (nhiều khách thuê) cho nhiều doanh nghiệp.

Việc đưa bất kỳ mục nào trên vào phạm vi phải được trả lời trong [open-questions.md](./open-questions.md) và cập nhật lại tài liệu này.

## 5. Người dùng và vai trò

### 5.1 Vai trò quan sát được trong UI

| Nhóm | Hành vi quan sát được |
|---|---|
| Khách/người tìm bất động sản | Xem và tìm kiếm, hỏi AI, lưu mục quan tâm. Có thể gửi yêu cầu liên hệ, xem preview booking. Đọc và tương tác trên cộng đồng. |
| Tác giả cộng đồng | Có hồ sơ cá nhân, đăng bài viết, xem số liệu theo dõi. Loại hiển thị gồm: người dùng, môi giới/sale, creator, agency, chủ đầu tư, tài khoản chính thức. |
| Đơn vị phân phối/chủ đầu tư | Xuất hiện trên thông tin dự án, tồn kho căn, ưu đãi và thông tin liên hệ. |

### 5.2 Vai trò chưa được xác nhận

UI chưa quy định ai được tạo, sửa hoặc xác minh dữ liệu. Hệ thống chưa rõ ai điều phối lead (khách hàng tiềm năng), phê duyệt giữ chỗ hay kiểm duyệt nội dung. Các vai trò `admin`, `moderator`, `data operator`, `sale`, `agency manager`, `developer manager` chỉ là ứng viên thiết kế. Chúng chưa phải yêu cầu đã duyệt. Xem OQ-002 (ai được làm gì/quyền hạn người dùng), OQ-004 (mô hình nhiều tổ chức/tenant), OQ-006 (yêu cầu admin/back-office) và OQ-036 (ai được tạo bài/kiểm duyệt).

## 6. Luồng nghiệp vụ đầu-cuối

### WF-001 — Khám phá và trao đổi với AI

1. Người dùng nhập câu hỏi tự nhiên hoặc chọn gợi ý có sẵn.
2. Hệ thống tạo hoặc tiếp tục hội thoại. Hệ thống lưu từng message (tin nhắn) theo đúng thứ tự.
3. AI nhận diện ý định của người dùng. AI gọi công cụ đọc dữ liệu phù hợp và trả kết quả dạng streaming (trả dữ liệu từng phần liên tục).
4. Khi dùng dữ liệu dự án, tin đăng, giá hoặc tin tức, câu trả lời phải gắn citation (trích dẫn nguồn) và thời điểm hiệu lực.
5. Người dùng có thể mở ngữ cảnh liên quan, đổi tên, hoặc xóa hội thoại. Họ cũng có thể bắt đầu hội thoại mới.
6. AI chỉ đóng vai trò tư vấn hoặc tham khảo. AI không tự tạo lead, giữ chỗ, booking hay thanh toán.

### WF-002 — Tìm nhà bán/cho thuê

1. Người dùng chọn thị trường bán hoặc thuê. Sau đó chọn khu vực và các bộ lọc khác.
2. Có thể nhập truy vấn tự nhiên. Hệ thống chuyển nó thành điều kiện lọc có cấu trúc và cho phép kiểm tra, chỉnh lại.
3. Danh sách được phân trang và sắp xếp. Người dùng mở chi tiết, lưu hoặc đánh dấu quan tâm.
4. Người dùng có thể yêu cầu AI đánh giá một tin đăng. Họ cũng có thể so sánh các mục đã lưu bằng AI.
5. Khi gửi liên hệ, hệ thống kiểm tra dữ liệu và chống gửi lặp. Hệ thống ghi nhận sự đồng ý và chuyển yêu cầu vào quy trình phân công lead.

### WF-003 — Khám phá dự án và căn sơ cấp

1. Người dùng tìm và lọc dự án. Họ có thể mở dự án từ bản đồ hoặc khối gợi ý.
2. Trang dự án tổng hợp thông tin chung, pháp lý, tiến độ, tiện ích. Trang cung cấp mặt bằng, lịch sử giá, tin tức sự kiện và hình ảnh/video.
3. Người dùng mở Master Pool (rổ hàng chung). Họ có thể lọc căn theo phân khu, tòa nhà, loại căn, hướng, trạng thái.
4. Chi tiết căn hiển thị trạng thái, giá, chính sách và offer (ưu đãi) của đơn vị phân phối. Thông tin kèm theo thời điểm cập nhật.
5. Người dùng có thể lưu, hỏi AI, liên hệ tư vấn. Họ có thể gửi yêu cầu booking hoặc giữ chỗ.
6. Backend phải kiểm tra trạng thái mới nhất trong một transaction (giao dịch đảm bảo tính toàn vẹn). UI không được coi trạng thái đang hiển thị là một cam kết giữ hàng chắc chắn.

### WF-004 — Booking/giữ chỗ

1. Người dùng gửi thông tin khách hàng và `idempotency key` (khóa chống trùng lặp) cho một căn cụ thể.
2. Hệ thống xác thực quyền hạn, sự đồng ý và trạng thái căn tại nguồn chính.
3. Nếu nghiệp vụ cho phép, hệ thống tạo yêu cầu và/hoặc hold (giữ chỗ tạm) có thời hạn trong một transaction. Việc này chống trường hợp có hai lượt giữ chỗ cùng hiệu lực cho một căn.
4. Mọi thay đổi trạng thái được ghi vào lịch sử và audit (nhật ký kiểm toán).
5. Worker (trình xử lý nền) phát thông báo cho người dùng và bộ phận xử lý.
6. Thời hạn 24 giờ, thanh toán, phê duyệt hay chuyển đổi thành booking thật vẫn là nội dung chưa xác định. Xem OQ-019 (nút booking là preview hay thật), OQ-020 (quy trình thanh toán/đặt cọc) và OQ-024 (thời hạn/hủy/sửa booking).

### WF-005 — Cộng đồng

1. Người dùng xem bảng tin theo chế độ được hỗ trợ. Họ có thể mở bài viết, hồ sơ và các đối tượng liên kết.
2. Người dùng đủ quyền có thể tạo bài viết mới. Họ có thể đính kèm media, nguồn tin và liên kết tới dự án/tin đăng.
3. Bài viết đi qua bước kiểm tra nội dung. Trạng thái xuất bản phải tuân theo chính sách (hiện chưa được xác nhận).
4. Người dùng có thể thích, lưu, bình luận, theo dõi và chia sẻ bài viết.
5. Tìm kiếm AI tổng hợp thông tin từ các nội dung được phép truy cập. AI phải nêu nguồn và phân biệt dữ liệu chuẩn với ý kiến UGC (nội dung do người dùng tạo).
6. Quy trình báo cáo, chặn, kháng nghị và chính sách kiểm duyệt phải được xác nhận trước khi đưa lên production. Xem OQ-037 (chính sách moderation/kiểm duyệt).

## 7. Yêu cầu chức năng

### 7.1 Nền tảng chung

| ID | Yêu cầu | Nguồn/trạng thái |
|---|---|---|
| FR-001 | Hệ thống cung cấp ba khu vực: AI, Thị trường và Cộng đồng. Giữ ngữ cảnh điều hướng phù hợp trên desktop và mobile. | Đã quan sát |
| FR-002 | Hỗ trợ lựa chọn thành phố/khu vực. Áp dụng nhất quán vào tìm kiếm, dữ liệu giá và nội dung liên quan. | Đã quan sát; UI có dropdown thành phố nhưng dữ liệu chỉ có Hà Nội. Dữ liệu production chưa xác định |
| FR-003 | Mỗi tài nguyên có URL hoặc deep link (liên kết sâu) ổn định. Cho phép mở từ kết quả AI, feed, chia sẻ và thông báo. | Đề xuất thiết kế; UI hiện chưa có router |
| FR-004 | Hỗ trợ lưu hoặc bỏ lưu tin đăng, dự án, căn và bài viết. Định nghĩa một collection (bộ sưu tập) chung hay các collection riêng cần được thống nhất. | Đã quan sát; hiện UI chỉ hỗ trợ lưu listing. Chưa có cơ chế save project/unit/post. Cách hợp nhất chờ OQ-052 (modal saved đếm loại nào/hợp nhất) |
| FR-005 | Các API đọc danh sách hỗ trợ cursor pagination (phân trang dùng con trỏ). Hỗ trợ lọc, sort và các trạng thái rỗng/lỗi/đang tải. | Cần thiết để hiện thực hóa UI; chi tiết tải chưa xác định |

### 7.2 AI và hội thoại

| ID | Yêu cầu | Nguồn/trạng thái |
|---|---|---|
| FR-010 | Tạo, tiếp tục, tìm, đổi tên và xóa hội thoại của người dùng. | Đã quan sát |
| FR-011 | Lưu message theo vai trò, thứ tự, thời gian và ngữ cảnh bất động sản được đính kèm. | Đã quan sát |
| FR-012 | Trả lời AI theo luồng streaming (trả dữ liệu từng phần liên tục). Cho phép hủy request (yêu cầu) đang chạy. | Đề xuất để đáp ứng trải nghiệm chat; UI hiện giả lập bằng setTimeout, chưa có SSE (Server-Sent Events) thực |
| FR-013 | AI được phép gọi các công cụ chỉ-đọc để tìm tin đăng, dự án, tồn kho. AI cũng tra cứu dữ liệu giá và nội dung đã được xác minh. | Đề xuất thiết kế |
| FR-014 | Câu trả lời có dữ kiện phải ghi citation (trích dẫn nguồn), loại nguồn và thời điểm dữ liệu. Không che giấu khi không đủ bằng chứng. | Cần thiết cho các khối UI có nguồn/cảnh báo |
| FR-015 | Hỗ trợ đánh giá một bất động sản và so sánh nhiều mục đã lưu. Tiêu chí và phiên bản đánh giá phải truy vết được. | Đã quan sát; tiêu chí chưa xác định |
| FR-016 | Hỗ trợ tổng hợp bài viết, bình luận và hồ sơ cộng đồng. Quá trình tổng hợp phải tuân thủ giới hạn quyền truy cập. | Đã quan sát |
| FR-017 | Hiển thị cảnh báo rằng AI có thể sai. Không thực thi giao dịch hoặc thay đổi dữ liệu nghiệp vụ nếu người dùng chưa xác nhận qua API chuyên biệt. | Đã quan sát/đề xuất an toàn |
| FR-018 | Chế độ debug (gỡ lỗi) hoặc trace (theo dõi vết) không được lộ cho người dùng trên production. | Đề xuất bảo mật |

### 7.3 Nhà bán và nhà cho thuê

| ID | Yêu cầu | Nguồn/trạng thái |
|---|---|---|
| FR-020 | Tìm kiếm tin theo loại giao dịch, thành phố/quận, loại bất động sản. Hỗ trợ khoảng giá, diện tích, số phòng ngủ và bộ lọc nâng cao. | Đã quan sát |
| FR-021 | Truy vấn tự nhiên được chuyển thành bộ lọc có cấu trúc. Các điều kiện này được trả lại cho client (ứng dụng khách) để người dùng hiểu kết quả. | Đã quan sát/đề xuất hợp đồng |
| FR-022 | Sắp xếp và phân trang kết quả theo các chế độ được phê duyệt. | Đã quan sát; định nghĩa sort chưa đầy đủ |
| FR-023 | Chi tiết tin gồm media, giá, diện tích, phòng, tầng, hướng, nội thất. Bao gồm cả pháp lý, tiện ích, hạ tầng, nguồn và thời điểm cập nhật (nếu có). | Đã quan sát |
| FR-024 | Thao tác lưu/bỏ lưu và đánh dấu quan tâm phải idempotent (gửi lại không bị lặp hoặc thực hiện nhiều lần ra một kết quả). Cần đồng bộ đa thiết bị sau khi có tài khoản. | Đã quan sát; auth chưa xác định |
| FR-025 | Gửi yêu cầu tư vấn với chủ đề, số điện thoại (bắt buộc). Bao gồm tên và ghi chú (tùy chọn); backend ghi lại trạng thái xử lý. | Đã quan sát |
| FR-026 | Không được cam kết thời gian phản hồi “15 phút” nếu chưa có quy trình. Hệ thống cần SLA, giờ phục vụ và quy trình phân công rõ ràng. | Ràng buộc từ copy UI hiện tại |
| FR-027 | Đánh giá hoặc so sánh bằng AI phải nêu dữ liệu đầu vào và thời điểm. Cần ghi rõ tiêu chí, hạn chế và citation. | Đề xuất an toàn |
| FR-028 | Tin đăng phải liên kết bằng khóa chuẩn tới dự án, tòa nhà, căn hộ khi xác định được. Không chỉ dựa vào tên gọi tự do. | Đề xuất chuẩn hóa |

### 7.4 Dự án sơ cấp và tồn kho

| ID | Yêu cầu | Nguồn/trạng thái |
|---|---|---|
| FR-030 | Tìm, lọc dự án và hiển thị danh sách. Có khối khám phá và marker trên bản đồ. | Đã quan sát |
| FR-031 | Chi tiết dự án cung cấp thông tin tổng quan, chủ đầu tư, khoảng giá, pháp lý. Có cả tiến độ, tiện ích, hạ tầng, mặt bằng, lịch sử giá, sự kiện và media (khi có nguồn). | Đã quan sát |
| FR-032 | Master Pool lọc căn theo phân khu, tòa nhà, từ khóa, loại căn, hướng, trạng thái và sắp xếp. | Đã quan sát |
| FR-033 | Mỗi căn hiển thị trạng thái, giá, ưu đãi của đơn vị phân phối và thời điểm đồng bộ. Dữ liệu cũ phải được đánh dấu rõ ràng. | Đã quan sát/đề xuất độ tin cậy |
| FR-034 | Chi tiết căn hiển thị layout (mặt bằng), view simulation (mô phỏng tầm nhìn) nếu có dữ liệu. Bao gồm cả chính sách, lịch thanh toán và ưu đãi. | Đã quan sát |
| FR-035 | Người dùng có thể lưu căn, yêu cầu AI đánh giá, gửi liên hệ tư vấn và mở luồng booking. | Đã quan sát |
| FR-036 | Luồng booking/giữ chỗ phải chống gửi lặp và cạnh tranh đồng thời. Phải kiểm tra trạng thái tại database, ghi lịch sử chuyển trạng thái và audit. | Cần thiết để hiện thực hóa an toàn |
| FR-037 | Trạng thái ở thẻ hoặc trang chi tiết chỉ là ảnh chụp tại thời điểm `updated_at`. Xác nhận cuối cùng xảy ra tại bước tạo yêu cầu/hold. | Đề xuất nhất quán |
| FR-038 | Các nguồn tồn kho từ đối tác phải được xác thực và hỗ trợ idempotency. Cần theo dõi lịch sử đồng bộ và xử lý các bản ghi lỗi hoặc cần cách ly (quarantine). | Đề xuất vận hành; nguồn chưa xác định |

### 7.5 Cộng đồng

| ID | Yêu cầu | Nguồn/trạng thái |
|---|---|---|
| FR-040 | Bảng tin hỗ trợ các chế độ “Dành cho bạn”, “Mới nhất” và “Đang theo dõi”. Định nghĩa xếp hạng phải được phê duyệt trước. | Đã quan sát; ranking chưa xác định |
| FR-041 | Hiển thị thông tin tác giả, loại vai trò, trạng thái xác minh và hồ sơ. Dấu xác minh chỉ được cấp thông qua quy trình có lưu audit. | Đã quan sát/đề xuất an toàn |
| FR-042 | Bài viết hỗ trợ nhiều loại hình: cộng đồng, phân tích, tin tức, và video. Trường bắt buộc và cách upload cho từng loại cần được xác nhận. | Đã quan sát; hợp đồng chưa đủ |
| FR-043 | Bài viết có thể chứa văn bản, media, nguồn trích dẫn, chỉ số thị trường. Bài viết có thể liên kết bằng khóa chuẩn tới dự án hoặc tin đăng. | Đã quan sát |
| FR-044 | Hỗ trợ thích, lưu, theo dõi, bình luận và chia sẻ (kèm khả năng hoàn tác). Các thao tác này phải là thao tác idempotent. | Đã quan sát |
| FR-045 | Cho phép tạo bình luận và tương tác với bình luận. Việc phản hồi theo luồng (threading), sửa/xóa và giới hạn thời gian vẫn chưa xác định. | Đã quan sát/chưa xác định |
| FR-046 | Hồ sơ cá nhân hiển thị thông tin công khai, chuyên môn, số liệu và bài viết. Cung cấp điểm chạm để hỏi AI theo đúng quyền riêng tư. | Đã quan sát |
| FR-047 | Tìm kiếm AI trên cộng đồng trả về bản tóm tắt, điểm nổi bật và citation. Nó cũng gợi ý bài viết, dự án, tin đăng, tác giả liên quan. Có thông báo khi không đủ kết quả. | Đã quan sát/đề xuất hoàn thiện |
| FR-048 | Nội dung UGC (do người dùng tạo) phải được phân biệt rõ với dữ liệu chính thức/đã xác minh. Điều này áp dụng cả trên UI và trong ngữ cảnh cấp cho AI. | Đề xuất an toàn |
| FR-049 | Trước khi lên production phải có cơ chế chống spam, chống lừa đảo, kiểm duyệt và audit. Chức năng báo cáo/chặn/kháng nghị phụ thuộc quyết định sản phẩm. | Đề xuất bắt buộc về an toàn |
| FR-050 | Link chia sẻ là deep link canonical (đường dẫn gốc chính thức). Nút chia sẻ QR chỉ được gọi là QR khi thực sự tạo mã. Không thay thế bằng thao tác sao chép liên kết đơn thuần. | Ràng buộc từ UI hiện tại |
| FR-051 | Các số đếm reaction, comment, share, follow được cập nhật nhất quán. Không được tính toán giả lập dựa vào số liệu mock ở phía client. | Đề xuất dữ liệu chuẩn |

### 7.6 Lead, thông báo và dữ liệu cá nhân

| ID | Yêu cầu | Nguồn/trạng thái |
|---|---|---|
| FR-060 | Yêu cầu tư vấn/booking cần lưu lại nguồn phát sinh và tài nguyên liên quan. Nó phải lưu thông tin liên hệ, sự đồng ý, trạng thái và người phụ trách. | Đề xuất để vận hành luồng UI |
| FR-061 | Tác vụ tạo lead, booking, bài viết, bình luận phải nhận `Idempotency-Key` (khóa chống trùng lặp). Yêu cầu lặp lại phải trả về cùng kết quả hoặc báo lỗi xung đột rõ ràng. | Đề xuất độ tin cậy |
| FR-062 | Thông báo in-app và các kênh khác chỉ được gửi theo loại sự kiện và quyền hạn. Phải tôn trọng cài đặt (preference) đã được xác nhận của người dùng. | UI có notification; kênh chưa xác định |
| FR-063 | Người dùng có thể yêu cầu truy xuất hoặc xóa dữ liệu cá nhân (PII). Chính sách lưu giữ cụ thể (retention) hiện chưa xác định. | Đề xuất tuân thủ |
| FR-064 | Mọi hành động nhạy cảm phải có audit log bất biến ở cấp ứng dụng. Các hành động này gồm: phân quyền, xác minh, kiểm duyệt, hold/booking và truy cập PII (dữ liệu cá nhân). | Đề xuất bảo mật |

## 8. Quy tắc nghiệp vụ

| ID | Quy tắc | Trạng thái |
|---|---|---|
| BR-001 | Giá tiền lưu bằng số nguyên VND. Đơn vị “triệu” hay “tỷ” chỉ là định dạng để hiển thị. | Đề xuất; sửa sự không nhất quán trong mock |
| BR-002 | Thời gian trong API dùng định dạng RFC 3339 UTC. Client sẽ tự chuyển sang múi giờ địa phương để hiển thị. | Đề xuất |
| BR-003 | Dữ liệu quan trọng có thể thay đổi (giá, trạng thái căn, pháp lý, tiến độ) phải ghi kèm nguồn lấy từ đâu (`source`). Nó cũng phải có thời điểm quan sát (`observed_at` hoặc `effective_at`) và mức tin cậy/xác minh. | Đề xuất |
| BR-004 | Một mục đã lưu chỉ trỏ tới đúng một đối tượng được hỗ trợ. Nó phải là duy nhất theo cặp `(user, object)`. | Đề xuất |
| BR-005 | Trạng thái `saved` (lưu) và `interested` (quan tâm) là hai tín hiệu khác nhau. Chờ sản phẩm quyết định có hợp nhất hay không. Xem OQ-023 (phân biệt Lưu và Quan tâm). | Phản ánh UI; cần OQ-023 |
| BR-006 | Chỉ một hold (giữ chỗ) hiệu lực được phép tồn tại cho một căn tại một thời điểm. Database là nguồn phán quyết cuối cùng. | Đề xuất |
| BR-007 | Mọi chuyển trạng thái booking/hold phải hợp lệ theo state machine (mô hình trạng thái). Phải ghi rõ actor (người thực hiện), timestamp, lý do và phiên bản. | Đề xuất |
| BR-008 | Trạng thái căn từ đối tác không được ghi đè mù quáng. Phải lưu nguồn, phiên bản, thời điểm và giải quyết xung đột theo chính sách được duyệt. | Đề xuất; chính sách chưa xác định |
| BR-009 | AI không được tự tạo hay xác nhận hold, booking, lead, thanh toán, bài viết. AI cũng không được tự thay đổi hồ sơ người dùng. | Đề xuất an toàn |
| BR-010 | Đánh giá AI hoặc match score (điểm phù hợp) phải lưu lại phiên bản thuật toán, dữ liệu đầu vào và kết quả. LLM (Mô hình ngôn ngữ lớn) có thể giải thích nhưng không được âm thầm thay đổi điểm. | Đề xuất |
| BR-011 | Citation (trích dẫn) của AI phải trỏ tới record hoặc nguồn mà người dùng được phép xem. Tuyệt đối không làm rò rỉ tài nguyên riêng tư. | Đề xuất |
| BR-012 | Nội dung đã xóa, bị ẩn hoặc không được phép truy cập sẽ không xuất hiện trong bảng tin. Những nội dung này cũng không được đưa vào kết quả search hoặc ngữ cảnh mới của AI. | Đề xuất |
| BR-013 | Dấu xác minh, vai trò chính thức và số liệu thống kê không do client tự do khai báo. | Đề xuất |
| BR-014 | Các API mutation (thao tác thay đổi dữ liệu) phải kiểm tra quyền ở phía server. Ẩn nút trong UI không phải là biện pháp phân quyền an toàn. | Đề xuất |
| BR-015 | Các dòng chữ mang tính cam kết như “real-time”, “còn hàng” hoặc “phản hồi 15 phút” chỉ được hiển thị khi có cơ chế đáp ứng và đo lường tương ứng. | Ràng buộc sản phẩm |

## 9. Yêu cầu phi chức năng

Các con số cụ thể về tải, độ trễ, availability, RPO/RTO (thời điểm và thời gian phục hồi hệ thống) chưa được cung cấp. Không tự đặt mục tiêu số. Kiến trúc phải cho phép đo đạc trước khi chốt lại.

| ID | Yêu cầu | Tiêu chí kiểm chứng ở giai đoạn thiết kế/triển khai |
|---|---|---|
| NFR-001 | Responsive và tương thích với các luồng desktop/mobile đang có. | Contract và deep link không phụ thuộc kích thước màn hình. Kiểm thử e2e cho viewport chính khi triển khai. |
| NFR-002 | Giao diện tiếng Việt, tiền VND và thời gian nhất quán. | Formatter tập trung. Contract dùng VND định dạng số nguyên và UTC. |
| NFR-003 | Tính mới và nguồn gốc dữ liệu quan trọng phải quan sát được. | Có `source`, `observed_at`, sync job (tác vụ đồng bộ) và freshness metric (chỉ số độ mới). |
| NFR-004 | Bảo mật PII (dữ liệu cá nhân có thể định danh) và thông tin liên hệ. | TLS, mã hóa lưu trữ theo dịch vụ cloud. Có log redaction (che giấu dữ liệu nhạy cảm trong log), RBAC (phân quyền theo vai trò), audit và secret manager. |
| NFR-005 | An toàn AI. | Mức độ bao phủ citation, kiểm thử prompt-injection. Có chính sách PII, moderation (kiểm duyệt nội dung), fallback và eval gate (cổng đánh giá). |
| NFR-006 | Khả năng truy vết. | Request ID xuyên suốt API, job, và quá trình chạy AI. Cần structured log, metric và trace (theo dõi vết). |
| NFR-007 | Độ tin cậy cho mutation (thao tác thay đổi dữ liệu) quan trọng. | Transaction (giao dịch toàn vẹn), idempotency (gửi lại không bị lặp). Có optimistic/pessimistic concurrency (kiểm soát đồng thời lạc quan/bi quan) và cơ chế outbox (hàng đợi gửi tin ngoài). |
| NFR-008 | Khả năng mở rộng có kiểm chứng. | Đo QPS (số truy vấn mỗi giây), latency (độ trễ), DB load, cache hit/job lag trước khi quyết định tách dịch vụ. |
| NFR-009 | Chi phí có kiểm soát. | Cảnh báo ngân sách theo môi trường và AI token/model. Chỉ lưu cache khi chứng minh được hiệu quả. |
| NFR-010 | Khả năng khôi phục. | Backup, khôi phục theo thời điểm (PITR) và diễn tập restore. RPO/RTO chờ xem OQ-045 (mục tiêu RPO/RTO). |
| NFR-011 | Khả năng tiếp cận. | Mức WCAG và phạm vi kiểm thử chờ OQ. Các component mới không được làm giảm khả năng dùng bàn phím hoặc đọc màn hình hiện có. |

## 10. Ma trận truy vết

| Nhóm yêu cầu | Dữ liệu chính | API chính | Tài liệu chi tiết |
|---|---|---|---|
| FR-010..018 | conversations, messages, ai_runs, ai_citations | `/conversations`, `/messages`, `/ai/*` | [ai-architecture.md](./ai-architecture.md), [api-design.md](./api-design.md) |
| FR-020..028 | listings, listing_media, saved_items, consultation_requests | `/listings`, `/me/saved-items`, `/consultation-requests` | [database-design.md](./database-design.md), [api-design.md](./api-design.md) |
| FR-030..038 | projects, buildings, units, offers, holds, booking_requests | `/projects`, `/units`, `/booking-requests`, inventory webhook | [database-design.md](./database-design.md), [api-design.md](./api-design.md) |
| FR-040..051 | author_profiles, social_posts, comments, reactions, follows, moderation | `/feed`, `/posts`, `/comments`, `/authors`, `/search/social` | [database-design.md](./database-design.md), [ai-architecture.md](./ai-architecture.md) |
| FR-060..064 | leads, notifications, audit_logs, outbox_events | `/consultation-requests`, `/notifications` | [system-architecture.md](./system-architecture.md), [infrastructure.md](./infrastructure.md) |

## 11. Điều kiện duyệt thiết kế

Bộ thiết kế sẵn sàng để chuyển sang kế hoạch triển khai khi:

- Sản phẩm xác nhận phạm vi release đầu tiên và các luồng bắt buộc.
- Các câu hỏi Priority P0 trong [open-questions.md](./open-questions.md) được trả lời.
- Các khái niệm actor, nguồn dữ liệu, ngữ nghĩa trạng thái căn, booking và hold được thống nhất.
- Chính sách AI, bảo mật PII, citation và kiểm duyệt nội dung cộng đồng được duyệt.
- API và data model được review bởi đội frontend, backend và người sở hữu nghiệp vụ.
- Vấn đề cloud, môi trường, mục tiêu vận hành và ngân sách có chủ sở hữu rõ ràng.
- Các ADR (Architecture Decision Record) liên quan được chuyển từ `Proposed` sang `Accepted`, `Rejected` hoặc `Superseded`.

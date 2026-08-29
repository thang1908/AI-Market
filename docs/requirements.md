# Yêu cầu sản phẩm và nghiệp vụ

## 1. Trạng thái tài liệu

- Trạng thái: **Bản nháp để duyệt**.
- Phạm vi: mô tả hành vi đang thể hiện trong mock UI/UX và các năng lực backend cần có để hiện thực hóa các hành vi đó.
- Nguồn khảo sát: `src/App.tsx`, `src/state/useAppState.tsx`, `src/types.ts`, các component trong `src/components/` và dữ liệu trong `src/data/`.
- Nguyên tắc: nội dung được phân loại là **Đã quan sát**, **Đề xuất thiết kế** hoặc **Chưa xác định**. Mục chưa xác định được theo dõi tại [open-questions.md](./open-questions.md), không được xem là yêu cầu đã phê duyệt.
- Cổng kiểm soát: chưa viết application code cho đến khi bộ tài liệu thiết kế được duyệt rõ ràng.

### 1.1 Danh mục nguồn yêu cầu

| Nguồn | Nội dung sử dụng | Giới hạn |
|---|---|---|
| Yêu cầu trực tiếp của người dùng | Thiết kế backend đầy đủ từ mock UI/UX; phải tạo đủ 9 tài liệu và dừng trước implementation | Không cung cấp actor, nguồn data, SLA, cloud hoặc policy production |
| `src/App.tsx`, `src/components/**` | Màn hình, điều hướng, input/action, modal, loading/empty state và luồng chéo | Chỉ phản ánh mock UI, không chứng minh nghiệp vụ production |
| `src/state/useAppState.tsx` | State/action, persistence và behavior demo | Rule/keyword/localStorage hiện tại không mặc định là kiến trúc hoặc rule production |
| `src/types.ts` | Entity/field/status/role đang dùng trong mock | Có type trùng/không nhất quán; chưa phải API contract |
| `src/data/mock*.ts` | Mẫu listing, project, unit, market/news/social và quan hệ demo | Có ID, giá, timestamp và nguồn mâu thuẫn; không phải dữ liệu chuẩn |
| Khảo sát chạy UI local | Xác nhận ba luồng AI/Market/Social và hành vi responsive/modal | Không có backend/external integration để kiểm chứng side effect |
| Tài liệu nghiệp vụ/API/cloud bên ngoài | Không được cung cấp | Mọi khoảng trống được ghi tại `open-questions.md` |

## 2. Bối cảnh hiện tại

Sản phẩm hiện là SPA React/Vite với ba khu vực chính:

1. **AI**: hỏi đáp bất động sản, lịch sử hội thoại, thông tin giá, dự án nổi bật, tin tức và nội dung cảnh báo rủi ro.
2. **Thị trường**: nhà bán, nhà cho thuê, dự án sơ cấp, tồn kho theo căn, đánh giá/so sánh bằng AI, lưu và liên hệ tư vấn.
3. **Cộng đồng**: bảng tin, bài viết đa loại, tác giả/đơn vị đã xác minh, bình luận, tương tác, tìm kiếm bằng AI và nội dung liên kết tới dự án/tin đăng.

Hiện trạng là mock demo:

- Điều hướng bằng React Context, chưa có URL route/deep link.
- Dữ liệu lấy từ file mock; lọc/tìm kiếm và trả lời AI chủ yếu là rule/keyword ở phía trình duyệt.
- Chưa có backend, cơ chế đăng nhập, phân quyền, đồng bộ đa thiết bị hoặc nguồn dữ liệu production.
- Một phần trạng thái được lưu bằng `localStorage`; không phù hợp để làm nguồn dữ liệu chính cho production.
- `MarketSearch.tsx` không còn được import; `MarketPage.tsx` dùng `MarketAISearch.tsx`. File cũ cần được xóa hoặc đánh dấu deprecated.
- `SocialFeedCategory` trong `types.ts` chứa các giá trị thừa không dùng trong UI: FOR_YOU, PROJECT, PRICE, PLANNING, INFRASTRUCTURE, INVESTMENT, VIDEO.
- Các thao tác liên hệ, giữ chỗ, tạo bài viết và bình luận chỉ tạo phản hồi UI, chưa thực hiện quy trình nghiệp vụ thật.

## 3. Mục tiêu

- Chuyển các luồng đã thể hiện trong UI thành hợp đồng nghiệp vụ và backend nhất quán.
- Tạo một nguồn dữ liệu chuẩn cho tin đăng, dự án, căn hàng, giá, nội dung thị trường và cộng đồng.
- Cho phép tìm kiếm/lọc có cấu trúc; dùng AI để hiểu ý định, tổng hợp và giải thích trên dữ liệu có nguồn dẫn.
- Bảo vệ các thao tác quan trọng như liên hệ, giữ chỗ và booking trước lỗi lặp, cạnh tranh đồng thời và thay đổi trạng thái ngoài ý muốn.
- Cung cấp nền tảng có thể vận hành: bảo mật, audit, quan sát hệ thống, xử lý nền và triển khai theo môi trường.
- Giữ kiến trúc ban đầu đơn giản, có đường nâng cấp khi dữ liệu/tải thực tế chứng minh cần thiết.

## 4. Ngoài phạm vi đã được xác nhận

Các mục sau **không được coi là phạm vi hiện tại**, vì UI hoặc yêu cầu chưa đủ bằng chứng:

- Thanh toán/đặt cọc trực tuyến, KYC, ký hợp đồng điện tử.
- STT, TTS, gọi thoại hoặc trợ lý giọng nói.
- Tự vận hành GPU hay model LLM riêng.
- Giao dịch mua bán/cho thuê khép kín trên nền tảng.
- Chức năng back-office/admin hoàn chỉnh.
- Cam kết SLA/SLO, RPO/RTO bằng con số.
- Cơ chế đa tenant cho nhiều doanh nghiệp.

Việc đưa bất kỳ mục nào trên vào phạm vi phải được trả lời trong [open-questions.md](./open-questions.md) và cập nhật lại tài liệu này.

## 5. Người dùng và vai trò

### 5.1 Vai trò quan sát được trong UI

| Nhóm | Hành vi quan sát được |
|---|---|
| Khách/người tìm bất động sản | Xem và tìm kiếm, hỏi AI, lưu mục quan tâm, gửi yêu cầu liên hệ, xem preview booking, đọc/tương tác cộng đồng |
| Tác giả cộng đồng | Có hồ sơ, bài viết, số liệu theo dõi; loại hiển thị gồm người dùng, môi giới/sale, creator, agency, chủ đầu tư, tài khoản chính thức |
| Đơn vị phân phối/chủ đầu tư | Xuất hiện trên dự án, tồn kho căn, ưu đãi và thông tin liên hệ |

### 5.2 Vai trò chưa được xác nhận

UI chưa quy định ai được tạo/sửa/xác minh dữ liệu, điều phối lead, phê duyệt giữ chỗ hay kiểm duyệt nội dung. Các vai trò `admin`, `moderator`, `data operator`, `sale`, `agency manager`, `developer manager` chỉ là ứng viên thiết kế, chưa phải yêu cầu đã duyệt. Xem OQ-002, OQ-004, OQ-006 và OQ-036.

## 6. Luồng nghiệp vụ đầu-cuối

### WF-001 — Khám phá và trao đổi với AI

1. Người dùng nhập câu hỏi tự nhiên hoặc chọn gợi ý.
2. Hệ thống tạo/tiếp tục hội thoại và lưu từng message theo thứ tự.
3. AI nhận diện ý định, gọi công cụ đọc dữ liệu phù hợp và trả kết quả dạng streaming.
4. Khi dùng dữ liệu dự án, tin đăng, giá hoặc tin tức, câu trả lời gắn nguồn và thời điểm hiệu lực.
5. Người dùng có thể mở ngữ cảnh liên quan, đổi tên/xóa hội thoại hoặc bắt đầu hội thoại mới.
6. AI chỉ tư vấn/tham khảo; không tự tạo lead, giữ chỗ, booking hay thanh toán.

### WF-002 — Tìm nhà bán/cho thuê

1. Người dùng chọn thị trường bán hoặc thuê, khu vực và bộ lọc.
2. Có thể nhập truy vấn tự nhiên; hệ thống chuyển thành điều kiện lọc có cấu trúc và cho phép kiểm tra/chỉnh lại.
3. Danh sách được phân trang/sắp xếp; người dùng mở chi tiết, lưu hoặc đánh dấu quan tâm.
4. Người dùng có thể yêu cầu AI đánh giá một tin hoặc so sánh các mục đã lưu.
5. Khi gửi liên hệ, hệ thống kiểm tra dữ liệu, chống gửi lặp, ghi nhận consent và chuyển yêu cầu vào quy trình phân công lead.

### WF-003 — Khám phá dự án và căn sơ cấp

1. Người dùng tìm/lọc dự án hoặc mở từ bản đồ/khối gợi ý.
2. Trang dự án tổng hợp thông tin, pháp lý, tiến độ, tiện ích, mặt bằng, lịch sử giá, tin/sự kiện và media.
3. Người dùng mở Master Pool, lọc căn theo phân khu/tòa/loại/hướng/trạng thái.
4. Chi tiết căn hiển thị trạng thái, giá/chính sách và offer của đơn vị phân phối cùng thời điểm cập nhật.
5. Người dùng có thể lưu, hỏi AI, liên hệ hoặc gửi yêu cầu booking/giữ chỗ.
6. Backend phải kiểm tra trạng thái mới nhất trong transaction; UI không được coi trạng thái đang hiển thị là một cam kết giữ hàng.

### WF-004 — Booking/giữ chỗ

1. Người dùng gửi thông tin khách hàng và `idempotency key` cho một căn cụ thể.
2. Hệ thống xác thực quyền, consent và trạng thái căn tại nguồn chính.
3. Nếu nghiệp vụ cho phép, hệ thống tạo yêu cầu và/hoặc hold có thời hạn trong transaction, chống hai hold hiệu lực cho cùng một căn.
4. Mọi thay đổi trạng thái được ghi lịch sử và audit.
5. Worker phát thông báo cho người dùng và bộ phận xử lý.
6. Thời hạn 24 giờ, thanh toán, phê duyệt hay chuyển đổi thành booking thật vẫn là nội dung chưa xác định (OQ-019, OQ-020, OQ-024).

### WF-005 — Cộng đồng

1. Người dùng xem feed theo chế độ được hỗ trợ, mở bài/hồ sơ và các đối tượng liên kết.
2. Người dùng đủ quyền có thể tạo bài, đính kèm media/nguồn và liên kết dự án/tin đăng.
3. Bài đi qua kiểm tra nội dung và trạng thái xuất bản phù hợp với chính sách chưa được xác nhận.
4. Người dùng có thể thích, lưu, bình luận, theo dõi và chia sẻ.
5. Tìm kiếm AI tổng hợp từ nội dung được phép truy cập, nêu nguồn và phân biệt dữ liệu chuẩn với ý kiến UGC.
6. Báo cáo/chặn/kháng nghị và chính sách kiểm duyệt phải được xác nhận trước production (OQ-037).

## 7. Yêu cầu chức năng

### 7.1 Nền tảng chung

| ID | Yêu cầu | Nguồn/trạng thái |
|---|---|---|
| FR-001 | Hệ thống cung cấp ba khu vực AI, Thị trường và Cộng đồng, giữ ngữ cảnh điều hướng phù hợp trên desktop/mobile. | Đã quan sát |
| FR-002 | Hỗ trợ lựa chọn thành phố/khu vực và áp dụng nhất quán vào tìm kiếm, dữ liệu giá và nội dung liên quan. | Đã quan sát; UI có dropdown thành phố nhưng dữ liệu chỉ có Hà Nội (hard-coded HANOI_DISTRICTS). Dữ liệu production chưa xác định |
| FR-003 | Mỗi tài nguyên có URL/deep link ổn định để mở từ kết quả AI, feed, chia sẻ và thông báo. | Đề xuất thiết kế; UI hiện chưa có router |
| FR-004 | Hệ thống hỗ trợ lưu/bỏ lưu tin đăng, dự án, căn và bài viết; định nghĩa một collection chung hay các collection riêng và cách đếm badge phải được thống nhất. | Đã quan sát; hiện UI chỉ hỗ trợ lưu listing (savedListingIds). Chưa có cơ chế save project/unit/post. Cách hợp nhất chưa xác định tại OQ-052 |
| FR-005 | Các API đọc danh sách hỗ trợ cursor pagination, lọc, sort và trạng thái rỗng/lỗi/tải. | Cần thiết để hiện thực hóa UI; chi tiết tải chưa xác định |

### 7.2 AI và hội thoại

| ID | Yêu cầu | Nguồn/trạng thái |
|---|---|---|
| FR-010 | Tạo, tiếp tục, tìm, đổi tên và xóa hội thoại của người dùng. | Đã quan sát |
| FR-011 | Lưu message theo vai trò, thứ tự, thời gian và ngữ cảnh bất động sản được đính kèm. | Đã quan sát |
| FR-012 | Trả lời AI theo luồng streaming và cho phép hủy request đang chạy. | Đề xuất để đáp ứng trải nghiệm chat; UI hiện giả lập typing bằng setTimeout, chưa có SSE thực |
| FR-013 | AI được phép gọi các công cụ chỉ-đọc để tìm tin đăng, dự án, tồn kho, dữ liệu giá và nội dung đã được xác minh. | Đề xuất thiết kế |
| FR-014 | Câu trả lời có dữ kiện phải ghi citation, loại nguồn và thời điểm dữ liệu; không che giấu khi không đủ bằng chứng. | Cần thiết cho các khối UI có nguồn/cảnh báo |
| FR-015 | Hỗ trợ đánh giá một bất động sản và so sánh nhiều mục đã lưu; tiêu chí và phiên bản đánh giá phải truy vết được. | Đã quan sát; tiêu chí chưa xác định |
| FR-016 | Hỗ trợ tổng hợp bài viết, bình luận và hồ sơ cộng đồng, trong giới hạn quyền truy cập. | Đã quan sát |
| FR-017 | Hiển thị cảnh báo rằng AI có thể sai; không thực thi giao dịch hoặc thay đổi dữ liệu nghiệp vụ nếu người dùng chưa xác nhận qua API chuyên biệt. | Đã quan sát/đề xuất an toàn |
| FR-018 | Chế độ debug/prompt/tool trace không được lộ cho người dùng production. | Đề xuất bảo mật |

### 7.3 Nhà bán và nhà cho thuê

| ID | Yêu cầu | Nguồn/trạng thái |
|---|---|---|
| FR-020 | Tìm kiếm tin theo loại giao dịch, thành phố/quận, loại bất động sản, khoảng giá, diện tích, số phòng ngủ và bộ lọc nâng cao. | Đã quan sát |
| FR-021 | Truy vấn tự nhiên được chuyển thành bộ lọc có cấu trúc; điều kiện được trả lại cho client để người dùng hiểu kết quả. | Đã quan sát/đề xuất hợp đồng |
| FR-022 | Sắp xếp và phân trang kết quả theo các chế độ được product xác nhận. | Đã quan sát; định nghĩa sort chưa đầy đủ |
| FR-023 | Chi tiết tin gồm media, giá, diện tích, phòng, tầng, hướng, nội thất, pháp lý, tiện ích, hạ tầng, nguồn và thời điểm cập nhật khi có. | Đã quan sát |
| FR-024 | Lưu/bỏ lưu và đánh dấu/bỏ quan tâm phải idempotent, đồng bộ đa thiết bị sau khi có tài khoản. | Đã quan sát; auth chưa xác định |
| FR-025 | Gửi yêu cầu tư vấn với chủ đề, số điện thoại bắt buộc, tên và ghi chú tùy chọn; backend ghi trạng thái xử lý. | Đã quan sát |
| FR-026 | Hệ thống không được cam kết thời gian phản hồi “15 phút” nếu chưa có SLA, giờ phục vụ và quy trình phân công được phê duyệt. | Ràng buộc từ copy UI hiện tại |
| FR-027 | AI evaluation/compare phải nêu dữ liệu đầu vào, thời điểm, tiêu chí, hạn chế và citation. | Đề xuất an toàn |
| FR-028 | Tin đăng phải liên kết bằng khóa chuẩn tới dự án/tòa/căn khi xác định được, không chỉ dựa vào tên tự do. | Đề xuất chuẩn hóa |

### 7.4 Dự án sơ cấp và tồn kho

| ID | Yêu cầu | Nguồn/trạng thái |
|---|---|---|
| FR-030 | Tìm/lọc dự án, hiển thị danh sách, khối khám phá và marker bản đồ. | Đã quan sát |
| FR-031 | Chi tiết dự án cung cấp tổng quan, chủ đầu tư, khoảng giá, pháp lý, tiến độ, tiện ích, hạ tầng, layout, lịch sử giá, tin/sự kiện và media khi có nguồn. | Đã quan sát |
| FR-032 | Master Pool lọc căn theo phase/tòa, từ khóa, loại, hướng, trạng thái và sort. | Đã quan sát |
| FR-033 | Mỗi căn hiển thị trạng thái, giá, offer của đơn vị phân phối và thời điểm đồng bộ; dữ liệu cũ phải được đánh dấu. | Đã quan sát/đề xuất độ tin cậy |
| FR-034 | Chi tiết căn hiển thị layout, view simulation nếu có dữ liệu, chính sách, lịch thanh toán và offer. | Đã quan sát |
| FR-035 | Người dùng có thể lưu căn, yêu cầu AI đánh giá, gửi liên hệ và mở luồng booking. | Đã quan sát |
| FR-036 | Booking/hold phải chống gửi lặp và cạnh tranh đồng thời, kiểm tra trạng thái tại database, ghi lịch sử chuyển trạng thái và audit. | Cần thiết để hiện thực hóa an toàn |
| FR-037 | Trạng thái ở card/detail chỉ là ảnh chụp tại `updated_at`; xác nhận cuối cùng xảy ra tại bước tạo yêu cầu/hold. | Đề xuất nhất quán |
| FR-038 | Các nguồn tồn kho đối tác phải xác thực, có idempotency, theo dõi lần đồng bộ và xử lý record lỗi/quarantine. | Đề xuất vận hành; nguồn chưa xác định |

### 7.5 Cộng đồng

| ID | Yêu cầu | Nguồn/trạng thái |
|---|---|---|
| FR-040 | Feed hỗ trợ các chế độ “Dành cho bạn”, “Mới nhất” và “Đang theo dõi” khi định nghĩa xếp hạng được phê duyệt. | Đã quan sát; ranking chưa xác định |
| FR-041 | Hiển thị tác giả, loại vai trò, trạng thái xác minh và hồ sơ; dấu xác minh chỉ do quy trình có audit cấp. | Đã quan sát/đề xuất an toàn |
| FR-042 | Bài viết hỗ trợ loại cộng đồng, phân tích, tin bất động sản và video; trường bắt buộc/phương thức upload cho từng loại cần được xác nhận. | Đã quan sát; hợp đồng chưa đủ |
| FR-043 | Bài có thể chứa text, media, nguồn, chỉ số thị trường và liên kết có khóa chuẩn tới dự án/tin đăng. | Đã quan sát |
| FR-044 | Hỗ trợ thích, bỏ thích, lưu, bỏ lưu, theo dõi, bỏ theo dõi, bình luận và chia sẻ bằng thao tác idempotent. | Đã quan sát |
| FR-045 | Bình luận có tạo và tương tác; threading, sửa/xóa và giới hạn thời gian vẫn chưa xác định. | Đã quan sát/chưa xác định |
| FR-046 | Hồ sơ hiển thị thông tin công khai, chuyên môn, số liệu, bài viết và entry point hỏi AI theo quyền riêng tư. | Đã quan sát |
| FR-047 | Tìm kiếm AI trên cộng đồng trả summary, highlights, citation và các bài/dự án/tin/tác giả liên quan; có trạng thái không đủ kết quả. | Đã quan sát/đề xuất hoàn thiện |
| FR-048 | Nội dung UGC phải được phân biệt rõ với dữ liệu chính thức/đã xác minh trong UI và trong context AI. | Đề xuất an toàn |
| FR-049 | Trước production phải có cơ chế chống spam/lừa đảo, kiểm duyệt và audit; chức năng report/block/appeal phụ thuộc quyết định product. | Đề xuất bắt buộc về an toàn |
| FR-050 | Link chia sẻ là canonical deep link; QR chỉ được ghi là QR khi thực sự tạo mã, không thay thế bằng thao tác copy link. | Ràng buộc từ UI hiện tại |
| FR-051 | Các số đếm reaction/comment/share/follow được cập nhật nhất quán và không dựa vào số mock phía client. | Đề xuất dữ liệu chuẩn |

### 7.6 Lead, thông báo và dữ liệu cá nhân

| ID | Yêu cầu | Nguồn/trạng thái |
|---|---|---|
| FR-060 | Yêu cầu tư vấn/booking lưu nguồn phát sinh, tài nguyên liên quan, thông tin liên hệ, consent, trạng thái và người/đơn vị phụ trách. | Đề xuất để vận hành luồng UI |
| FR-061 | Tác vụ tạo lead, booking, bài và bình luận nhận `Idempotency-Key`; request lặp trả cùng kết quả hoặc xung đột rõ ràng. | Đề xuất độ tin cậy |
| FR-062 | Thông báo in-app và các kênh khác chỉ được gửi theo loại sự kiện, quyền và preference đã xác nhận. | UI có notification; kênh chưa xác định |
| FR-063 | Người dùng có thể yêu cầu truy xuất/xóa dữ liệu cá nhân khi chính sách pháp lý yêu cầu; retention cụ thể chưa xác định. | Đề xuất tuân thủ |
| FR-064 | Mọi hành động nhạy cảm về quyền, xác minh, kiểm duyệt, hold/booking và truy cập PII phải có audit log bất biến ở cấp ứng dụng. | Đề xuất bảo mật |

## 8. Quy tắc nghiệp vụ

| ID | Quy tắc | Trạng thái |
|---|---|---|
| BR-001 | Giá tiền lưu bằng số nguyên VND; đơn vị “triệu/tỷ” chỉ là định dạng hiển thị. | Đề xuất; sửa sự không nhất quán trong mock |
| BR-002 | Thời gian API dùng RFC 3339 UTC; client chuyển sang múi giờ hiển thị. | Đề xuất |
| BR-003 | Mọi dữ kiện có thể thay đổi (giá, trạng thái căn, pháp lý, tiến độ) mang `source`, `observed_at/effective_at` và mức tin cậy/xác minh khi phù hợp. | Đề xuất |
| BR-004 | Một saved item chỉ trỏ tới đúng một loại đối tượng được hỗ trợ và là duy nhất theo `(user, object)`. | Đề xuất |
| BR-005 | `saved` và `interested` là hai tín hiệu khác nhau cho đến khi product quyết định hợp nhất. | Phản ánh UI; cần OQ-023 |
| BR-006 | Chỉ một hold hiệu lực được phép tồn tại cho một căn tại một thời điểm; database là nguồn phán quyết cuối. | Đề xuất |
| BR-007 | Mọi chuyển trạng thái booking/hold phải hợp lệ theo state machine, có actor, timestamp, lý do và phiên bản. | Đề xuất |
| BR-008 | Trạng thái căn từ đối tác không được ghi đè mù; phải lưu nguồn, phiên bản/thời điểm và giải quyết xung đột theo chính sách được duyệt. | Đề xuất; chính sách chưa xác định |
| BR-009 | AI không được tự tạo/xác nhận hold, booking, lead, thanh toán, bài viết hoặc thay đổi hồ sơ. | Đề xuất an toàn |
| BR-010 | Match score/AI evaluation lưu phiên bản thuật toán, dữ liệu đầu vào và kết quả; LLM có thể giải thích nhưng không âm thầm thay đổi điểm. | Đề xuất |
| BR-011 | Citation AI phải trỏ tới record/nguồn người dùng được phép xem; không làm rò rỉ tài nguyên riêng tư. | Đề xuất |
| BR-012 | Nội dung đã xóa/ẩn/không được phép truy cập không xuất hiện trong feed, search hoặc context mới của AI. | Đề xuất |
| BR-013 | Dấu xác minh, vai trò chính thức và số liệu thống kê không do client tự khai báo. | Đề xuất |
| BR-014 | API mutation phải kiểm tra quyền phía server; ẩn nút trong UI không phải biện pháp phân quyền. | Đề xuất |
| BR-015 | Các copy cam kết như “real-time”, “còn hàng” hoặc “phản hồi 15 phút” chỉ hiển thị khi có định nghĩa và cơ chế đo tương ứng. | Ràng buộc sản phẩm |

## 9. Yêu cầu phi chức năng

Các con số cụ thể về tải, độ trễ, availability, RPO/RTO và retention chưa được cung cấp; không tự đặt mục tiêu số. Kiến trúc phải cho phép đo trước khi chốt.

| ID | Yêu cầu | Tiêu chí kiểm chứng ở giai đoạn thiết kế/triển khai |
|---|---|---|
| NFR-001 | Responsive và tương thích các luồng desktop/mobile đang có. | Contract và deep link không phụ thuộc kích thước màn hình; e2e cho viewport chính khi triển khai |
| NFR-002 | Giao diện tiếng Việt, tiền VND và thời gian nhất quán. | Formatter tập trung; contract dùng VND integer và UTC |
| NFR-003 | Tính mới và nguồn gốc dữ liệu quan trọng phải quan sát được. | Có `source`, `observed_at`, sync job và freshness metric |
| NFR-004 | Bảo mật PII và thông tin liên hệ. | TLS, mã hóa lưu trữ theo dịch vụ cloud, log redaction, RBAC, audit, secret manager |
| NFR-005 | An toàn AI. | Citation coverage, prompt-injection tests, PII policy, moderation, fallback và eval gate |
| NFR-006 | Khả năng truy vết. | Request ID xuyên API/job/AI run; structured log, metric và trace |
| NFR-007 | Độ tin cậy mutation quan trọng. | Transaction, idempotency, optimistic/pessimistic concurrency và outbox |
| NFR-008 | Khả năng mở rộng có kiểm chứng. | Đo QPS, latency, DB load, cache hit/job lag trước khi tách dịch vụ |
| NFR-009 | Chi phí có kiểm soát. | Budget/alert theo môi trường và AI token/model; lưu cache chỉ khi chứng minh hiệu quả |
| NFR-010 | Khả năng khôi phục. | Backup/PITR và diễn tập restore; RPO/RTO chờ OQ-045 |
| NFR-011 | Khả năng tiếp cận. | Mức WCAG và phạm vi kiểm thử chờ OQ; component mới không được làm giảm khả năng bàn phím/đọc màn hình hiện có |

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

- Product xác nhận phạm vi release đầu và các luồng bắt buộc.
- Các câu hỏi Priority P0 trong [open-questions.md](./open-questions.md) được trả lời.
- Actor/role, nguồn dữ liệu, semantics trạng thái căn và booking/hold được thống nhất.
- Chính sách AI, PII, citation và nội dung cộng đồng được duyệt.
- API/data model được review bởi frontend, backend và người sở hữu nghiệp vụ.
- Cloud, môi trường, mục tiêu vận hành và ngân sách có owner.
- Các ADR liên quan được chuyển từ `Proposed` sang `Accepted`, `Rejected` hoặc `Superseded`.

# Câu hỏi mở

## 1. Cách sử dụng

- Trạng thái tài liệu: **Đang chờ trả lời**.
- Không mục nào dưới đây tự động trở thành yêu cầu — đây chỉ là danh sách cần xác nhận.
- **P0**: Phải trả lời **trước khi** bắt đầu code phần liên quan.
- **P1**: Có thể dựng khung trước, nhưng phải trả lời trước khi lên production.
- **P2**: Có thể quyết định sau khi có số liệu thực tế hoặc phản hồi người dùng.
- Khi có câu trả lời → cập nhật cột "Quyết định" bên dưới, ghi vào nhật ký, và tạo/cập nhật ADR nếu ảnh hưởng kiến trúc.

## 2. Phạm vi, người dùng và quyền

| ID | Ưu tiên | Câu hỏi | Vì sao cần trả lời |
|---|---:|---|---|
| OQ-001 | P0 | Release đầu gồm cả AI, Thị trường và Cộng đồng, hay chia giai đoạn? Luồng nào là MVP? | Quyết định phạm vi roadmap, schema, API, hạ tầng |
| OQ-002 | P0 | Ai là người dùng chính: khách vãng lai, người mua/thuê, sale, agency, chủ đầu tư, creator, moderator, admin? Mỗi người được làm gì? | Quyết định phân quyền và bảo mật |
| OQ-003 | P0 | Đăng nhập bằng gì: phone OTP, email/password, OAuth hay kết hợp? Khách chưa đăng nhập được làm gì (xem, lưu, chat)? | Ảnh hưởng đăng nhập, lưu dữ liệu, chống lạm dụng |
| OQ-004 | P0 | Có mô hình nhiều tổ chức không? Agency và chủ đầu tư có thành viên, workspace, dữ liệu riêng không? | Ảnh hưởng cách phân quyền và tách dữ liệu |
| OQ-005 | P1 | MVP phục vụ Hà Nội, TP.HCM hay cả hai? Thành phố nào có dữ liệu đủ tin cậy? | Ảnh hưởng dữ liệu địa lý, nội dung, tìm kiếm |
| OQ-006 | P1 | Có cần trang admin để quản lý data, lead, xác minh và kiểm duyệt không? | Ảnh hưởng cấu trúc project và API nội bộ |
| OQ-007 | P2 | Cần hỗ trợ accessibility/WCAG mức nào? Hỗ trợ trình duyệt/thiết bị nào? | Ảnh hưởng QA và tiêu chuẩn component |

## 3. Dữ liệu bất động sản và tìm kiếm

| ID | Ưu tiên | Câu hỏi | Vì sao cần trả lời |
|---|---:|---|---|
| OQ-008 | P0 | Dữ liệu production (listing, dự án, giá, pháp lý, tin tức, tồn kho) lấy từ đâu: nhập tay, file, crawl hay API đối tác? Ai xác minh? | Quyết định cách nhập liệu, nguồn gốc, bản quyền |
| OQ-009 | P0 | Ai là nguồn sự thật cuối cùng cho trạng thái căn hộ (còn hàng/đã bán)? Bao lâu đồng bộ 1 lần? | Quyết định trạng thái, cache, cảnh báo hết hàng |
| OQ-010 | P0 | Nếu nhiều đại lý cùng chào 1 căn, làm sao nhận diện căn chuẩn? Xung đột trạng thái giải quyết ra sao? | Quyết định gộp trùng lặp, schema căn/offer |
| OQ-011 | P0 | Trạng thái căn chuyển theo sơ đồ nào (mở bán → giữ chỗ → booking → bán)? Ai có quyền chuyển? | Quyết định giao dịch, xung đột, audit |
| OQ-012 | P0 | Giá lưu theo VND nào (tổng/m²/từ-đến)? Phí, thuế VAT, phí bảo trì có gồm không? | Quyết định cách lưu tiền và tính toán |
| OQ-013 | P0 | Quan hệ listing → dự án → giai đoạn → tòa → căn xác định đến đâu? Tin đăng không rõ căn thì xử lý sao? | Quyết định liên kết bảng, tìm kiếm, gộp trùng |
| OQ-014 | P1 | Bản đồ dùng nhà cung cấp nào? Cần tìm theo bán kính/vùng hay chỉ đặt marker? | Ảnh hưởng index không gian, chi phí |
| OQ-015 | P1 | Tìm kiếm cần hỗ trợ ngôn ngữ nào? Cần sửa lỗi chính tả, từ đồng nghĩa không? Bao nhiêu record? | Quyết định dùng PostgreSQL FTS hay search engine riêng |
| OQ-016 | P1 | Ai có quyền sửa dữ liệu chính? Có quy trình nháp → duyệt → xuất bản không? | Ảnh hưởng vòng đời nội dung và lịch sử |
| OQ-017 | P1 | Dữ liệu mock hiện tại có nhiều giá/ngày/ID không nhất quán. Nguồn nào chọn làm chuẩn khi chuyển đổi? | Quyết định cách chuyển dữ liệu và kiểm tra chất lượng |
| OQ-018 | P2 | So sánh tối đa bao nhiêu listing/dự án/căn trong 1 lần? | Ảnh hưởng giới hạn request và chi phí AI |

## 4. Lead, booking và giao dịch

| ID | Ưu tiên | Câu hỏi | Vì sao cần trả lời |
|---|---:|---|---|
| OQ-019 | P0 | Nút booking hiện là "xem trước" hay phải giữ chỗ thật? Thời hạn 24h có phải quy tắc đã duyệt? | Quyết định scope giao dịch, trạng thái căn |
| OQ-020 | P0 | Booking có cần đặt cọc/thanh toán, KYC, ký điện tử, duyệt thủ công, đồng bộ CRM/ERP không? | Không thiết kế thanh toán trước khi xác nhận |
| OQ-021 | P0 | Ai nhận lead và booking? Phân công tự động hay thủ công? Có SLA "15 phút" không? | Quyết định luồng phân công, thông báo |
| OQ-022 | P0 | Email trong form booking: bắt buộc, tùy chọn hay bỏ? Type hiện tại và UI chưa thống nhất. | Quyết định cấu trúc request và chuyển đổi dữ liệu |
| OQ-023 | P1 | "Lưu" và "Quan tâm" khác nhau thế nào về mục đích, thông báo, và quyền chia sẻ dữ liệu? | Ảnh hưởng schema, phân tích, đồng ý người dùng |
| OQ-024 | P1 | Người dùng được hủy/sửa booking khi nào? Hết hạn giữ chỗ thì ai giải phóng căn? | Ảnh hưởng endpoint, job tự động hết hạn |
| OQ-025 | P1 | Kênh thông báo nào được phép: in-app, SMS, email, Zalo, gọi điện? Cần đồng ý/từ chối nhận gì? | Quyết định nhà cung cấp, chi phí, quyền riêng tư |

## 5. AI, dữ liệu và quyền riêng tư

| ID | Ưu tiên | Câu hỏi | Vì sao cần trả lời |
|---|---:|---|---|
| OQ-026 | P0 | Gemini có phải nhà cung cấp AI được duyệt không? Có yêu cầu model, vùng triển khai, độ trễ hay dự phòng? | Quyết định provider, chi phí, đánh giá chất lượng |
| OQ-027 | P0 | AI được dùng nguồn nào: chỉ DB nội bộ, dữ liệu đối tác, web/tin tức hay cả bài viết cộng đồng? | Quyết định mức tin cậy nguồn, pháp lý |
| OQ-028 | P0 | Thông tin cá nhân nào được gửi tới AI provider? Chính sách lưu trữ, xóa, từ chối, dùng để train? | Quyết định quyền riêng tư, xử lý dữ liệu nhạy cảm |
| OQ-029 | P0 | Điểm đánh giá AI do quy tắc sản phẩm, ML hay LLM quyết định? Tiêu chí và bộ test chuẩn là gì? | Quyết định cách giải thích, versioning, đánh giá |
| OQ-030 | P0 | Nội dung pháp lý/tài chính/rủi ro do AI tạo cần người duyệt, disclaimer hay giới hạn đối tượng? | Quyết định chính sách an toàn nội dung |
| OQ-031 | P1 | Chat có cần upload ảnh/file, OCR, phân tích hợp đồng/pháp lý không? | Ảnh hưởng xử lý media, bảo mật, giới hạn |
| OQ-032 | P1 | Có cần chức năng giọng nói (STT/TTS) không? Nếu có: ngôn ngữ, streaming, đồng ý lưu audio? | Chưa có dấu hiệu trong UI. Không làm trước khi trả lời |
| OQ-033 | P1 | Trích dẫn nguồn cần ở mức toàn câu trả lời hay từng khẳng định? Nguồn là URL công khai hay record nội bộ? | Ảnh hưởng hiển thị nguồn, bảo mật |
| OQ-034 | P1 | Lịch sử hội thoại lưu bao lâu? Người dùng có thể xuất/xóa? Có dùng lịch sử cũ cho hội thoại mới? | Ảnh hưởng lưu trữ, cá nhân hóa, quyền riêng tư |
| OQ-035 | P2 | Ngưỡng chất lượng, chi phí, độ trễ cho từng use case AI? Ai duyệt bộ test và tiêu chí phát hành? | Ảnh hưởng chọn model, ngân sách |

## 6. Cộng đồng và nội dung

| ID | Ưu tiên | Câu hỏi | Vì sao cần trả lời |
|---|---:|---|---|
| OQ-036 | P0 | Ai được tạo bài theo từng loại? Bài nào cần duyệt? Quy trình cấp/thu hồi dấu xác minh? | Quyết định phân quyền, vòng đời bài viết |
| OQ-037 | P0 | Chính sách kiểm duyệt: spam, lừa đảo, nội dung sai, thông tin cá nhân, bản quyền? Có report, block, khiếu nại? | Bắt buộc có trước khi lên production |
| OQ-038 | P1 | Feed "Dành cho bạn", "Mới nhất", "Đang theo dõi" xếp hạng ra sao? Có quảng cáo/nội dung tài trợ? | Ảnh hưởng API feed, minh bạch thuật toán |
| OQ-039 | P1 | Bình luận có phân nhánh thật không? Được sửa/xóa/tag người/report không? Giới hạn cấp sâu? | Ảnh hưởng schema và endpoint |
| OQ-040 | P1 | Video: upload hay nhập URL? Giới hạn dung lượng/thời lượng? Ảnh: hotlink hay lưu vào storage? | Quyết định xử lý media, CDN, chi phí |
| OQ-041 | P1 | Số lượt share tính theo click hay sự kiện server? Link riêng tư xử lý thế nào? QR có cần? | Ảnh hưởng deep link, quyền riêng tư, phân tích |
| OQ-042 | P2 | Follow/view/reaction cần realtime đến mức nào? Có cần chống gian lận số liệu? | Ảnh hưởng kiến trúc bộ đếm, cache |

## 7. Hạ tầng, vận hành và quy mô

| ID | Ưu tiên | Câu hỏi | Vì sao cần trả lời |
|---|---:|---|---|
| OQ-043 | P0 | Chọn cloud nào, vùng nào? Có yêu cầu dữ liệu phải lưu trong nước không? | Ảnh hưởng mọi cấu hình hạ tầng |
| OQ-044 | P0 | Dự kiến DAU/MAU, lượng request cao điểm, số listing/dự án/bài viết, tốc độ tăng? | Quyết định kích thước DB, search, queue |
| OQ-045 | P0 | Mục tiêu uptime, độ trễ, RPO (mất bao nhiêu dữ liệu), RTO (phục hồi bao lâu)? | Quyết định backup, DR, SLO, chi phí |
| OQ-046 | P0 | Ngân sách hàng tháng cho cloud, media, AI là bao nhiêu? | Quyết định chọn model AI, autoscaling |
| OQ-047 | P1 | Cần tích hợp CRM, ERP, analytics, bản đồ, SMS/email/Zalo hay data warehouse nào? | Ảnh hưởng kết nối ngoài, bảo mật |
| OQ-048 | P1 | Cần mấy môi trường (dev, staging, production)? Có sandbox đối tác và dữ liệu test ẩn danh? | Ảnh hưởng CI/CD và tách môi trường |
| OQ-049 | P1 | Ai trực vận hành? Escalation và thời gian hỗ trợ? | Ảnh hưởng cảnh báo, runbook |
| OQ-050 | P2 | Khi nào là đủ bằng chứng để thêm Redis, vector search, search engine riêng, hay tách microservice? | Ngăn chặn tối ưu sớm khi chưa cần |

## 8. Điều hướng và giao diện

| ID | Ưu tiên | Câu hỏi | Vì sao cần trả lời |
|---|---:|---|---|
| OQ-051 | P0 | URL/deep link cho listing, dự án, căn, bài viết, profile, hội thoại cấu trúc thế nào? Trang nào public/SEO? | Quyết định router, share link, xác thực |
| OQ-052 | P1 | Badge "Đã lưu" đếm những loại nào? Modal lưu là 1 collection chung hay nhiều collection? | Ảnh hưởng FR-004 (chức năng lưu) |
| OQ-053 | P1 | Trạng thái loading/rỗng/lỗi/offline hiển thị và retry như thế nào? | Ảnh hưởng xử lý lỗi API, trải nghiệm người dùng |
| OQ-054 | P1 | Icon thông báo trong header đại diện sự kiện nào? Cần đã đọc/chưa đọc/cài đặt? | Quyết định model thông báo và API |

## 9. Nhật ký trả lời

Chưa có câu hỏi nào được đóng. Khi product trả lời, ghi theo mẫu:

| Question ID | Quyết định | Người xác nhận | Ngày | Tài liệu/ADR đã cập nhật |
|---|---|---|---|---|
| — | — | — | — | — |

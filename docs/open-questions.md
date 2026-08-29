# Câu hỏi mở

## 1. Cách sử dụng

- Trạng thái tài liệu: **Đang chờ trả lời**.
- Không mục nào trong bảng dưới đây được tự động coi là yêu cầu.
- `P0`: phải trả lời trước khi chốt contract/triển khai phần liên quan.
- `P1`: có thể bắt đầu skeleton sau khi P0 được duyệt nhưng phải trả lời trước production.
- `P2`: có thể quyết định sau khi có số đo hoặc feedback.
- Khi có câu trả lời, cập nhật cột quyết định, tài liệu chịu ảnh hưởng và tạo/cập nhật ADR nếu quyết định có tác động kiến trúc.

## 2. Phạm vi, người dùng và quyền

| ID | Ưu tiên | Câu hỏi | Vì sao cần trả lời / tài liệu chịu ảnh hưởng |
|---|---:|---|---|
| OQ-001 | P0 | Release đầu gồm cả AI, Thị trường sơ cấp/thứ cấp và Cộng đồng, hay chia theo giai đoạn? Luồng nào là MVP? | Quyết định phạm vi toàn bộ roadmap, schema, API và hạ tầng |
| OQ-002 | P0 | Actor chính là ai: khách vãng lai, người mua/thuê/đầu tư, sale, agency, chủ đầu tư, creator, moderator, admin, data operator? Mỗi actor được làm gì? | Ma trận RBAC/ABAC, endpoint mutation, audit |
| OQ-003 | P0 | Cơ chế đăng nhập nào được chọn: phone OTP, email/password, OAuth hay kết hợp? Khách chưa đăng nhập được lưu/chat/liên hệ đến mức nào? | Identity, consent, đồng bộ đa thiết bị, chống abuse |
| OQ-004 | P0 | Có mô hình nhiều tổ chức/tenant không? Agency và chủ đầu tư có thành viên, workspace và dữ liệu riêng không? | Khóa tenant, row-level authorization, cấu trúc org |
| OQ-005 | P1 | MVP phục vụ Hà Nội, TP.HCM hay cả hai? Thành phố nào có dữ liệu đủ tin cậy? | Geography, nội dung, search, copy UI |
| OQ-006 | P1 | Có yêu cầu admin/back-office nào để quản lý data, lead, verification và moderation? | Project structure, API nội bộ và vận hành |
| OQ-007 | P2 | Cần mức tuân thủ accessibility/WCAG nào và hỗ trợ trình duyệt/thiết bị nào? | NFR, QA và component policy |

## 3. Dữ liệu bất động sản và tìm kiếm

| ID | Ưu tiên | Câu hỏi | Vì sao cần trả lời / tài liệu chịu ảnh hưởng |
|---|---:|---|---|
| OQ-008 | P0 | Nguồn production của listing, dự án, pháp lý, tiến độ, giá, tin tức và inventory là nhập tay, file, crawler hay partner API? Ai sở hữu và xác minh từng nguồn? | Ingestion, provenance, bản quyền, độ mới và schema |
| OQ-009 | P0 | Đơn vị nào là nguồn sự thật cuối cho trạng thái căn? Freshness SLA và tần suất đồng bộ là bao lâu? | State model, cache, UI copy, worker, alert |
| OQ-010 | P0 | Nếu nhiều distributor cùng chào một căn, nhận diện căn chuẩn và hợp nhất offer thế nào? Xung đột trạng thái được giải quyết ra sao? | Khóa tự nhiên, deduplication, unit/offers schema |
| OQ-011 | P0 | Trạng thái căn được phép chuyển theo sơ đồ nào, actor nào có quyền chuyển và “Đang giữ chỗ/Đã booking/Đã bán” có định nghĩa chính xác gì? | Transaction, API conflict, audit, UI |
| OQ-012 | P0 | Giá canonical lưu theo VND nào; giá tổng, giá/m², giá từ/đến, phí và thuế có gồm VAT/maintenance không? | Money contract và analytics |
| OQ-013 | P0 | Quan hệ canonical listing → project → phase → building → unit được xác định đến mức nào? Listing môi giới không xác định căn xử lý ra sao? | Foreign key, search, dedupe, citation |
| OQ-014 | P1 | Map dùng nhà cung cấp/geocoding nào, cần tìm theo bán kính/polygon hay chỉ marker theo tọa độ? | Spatial index, chi phí và privacy |
| OQ-015 | P1 | Search cần những ngôn ngữ, typo tolerance, synonym và độ trễ nào? Khối lượng record dự kiến? | PostgreSQL FTS so với search engine riêng |
| OQ-016 | P1 | Ai có quyền sửa dữ liệu chuẩn; có workflow draft/review/publish và lịch sử phiên bản không? | Content lifecycle và audit |
| OQ-017 | P1 | Dữ liệu demo hiện có nhiều giá/ngày/ID không nhất quán. Nguồn nào được chọn làm canonical khi migration? | Migration, data-quality gates |
| OQ-018 | P2 | So sánh tối đa bao nhiêu listing/project/unit trong một lần? | Request limits, UX và AI context cost |

## 4. Lead, booking và giao dịch

| ID | Ưu tiên | Câu hỏi | Vì sao cần trả lời / tài liệu chịu ảnh hưởng |
|---|---:|---|---|
| OQ-019 | P0 | Nút booking hiện là “preview” hay phải tạo hold tồn kho thật? Thời hạn 24 giờ có phải quy tắc đã duyệt không? | Phạm vi, transaction, state machine, copy UI |
| OQ-020 | P0 | Booking có cần đặt cọc/thanh toán, KYC, e-sign, duyệt thủ công hoặc đồng bộ CRM/ERP không? | Không được thiết kế payment endpoint trước khi xác nhận |
| OQ-021 | P0 | Ai nhận lead và booking request, thuật toán phân công là gì, có giờ phục vụ/escalation/SLA “15 phút” không? | Lead workflow, notification, reporting |
| OQ-022 | P0 | Email trong form booking là bắt buộc, tùy chọn hay bỏ? Type hiện tại và UI chưa thống nhất. | Request contract và migration |
| OQ-023 | P1 | `Lưu` và `Quan tâm` khác nhau về mục đích, notification và quyền chia sẻ dữ liệu thế nào? | Schema, analytics, consent |
| OQ-024 | P1 | Người dùng được hủy/sửa booking request hoặc hold khi nào? Hết hạn và giải phóng căn do ai thực hiện? | Endpoint, job expiry, audit |
| OQ-025 | P1 | Kênh liên hệ/notification nào được phép: in-app, SMS, email, Zalo, gọi điện? Cần opt-in/opt-out gì? | Provider, cost, consent |

## 5. AI, dữ liệu và quyền riêng tư

| ID | Ưu tiên | Câu hỏi | Vì sao cần trả lời / tài liệu chịu ảnh hưởng |
|---|---:|---|---|
| OQ-026 | P0 | Gemini trong scaffold có phải nhà cung cấp được phê duyệt không? Có yêu cầu model/provider, region, latency hoặc fallback cụ thể nào? | ADR provider-neutral, credential, cost và eval |
| OQ-027 | P0 | AI được dùng nguồn nào: chỉ dữ liệu nội bộ, partner data, web/news hay cả social UGC? Có whitelist/blacklist nguồn không? | RAG trust tier, crawler, citation và pháp lý |
| OQ-028 | P0 | PII nào được phép gửi sang model provider? Retention, export/delete, opt-out và dùng hội thoại để train có chính sách gì? | Privacy, prompt assembly, logging, DPA |
| OQ-029 | P0 | Match score/AI evaluation do product rules, mô hình ML hay LLM quyết định? Tiêu chí, trọng số và bộ kiểm thử chuẩn là gì? | Khả năng giải thích, versioning, eval |
| OQ-030 | P0 | Nội dung pháp lý/tài chính/rủi ro do AI tạo cần human review, disclaimer hoặc giới hạn đối tượng nào? | Safety policy và publishing workflow |
| OQ-031 | P1 | Chat có cần upload ảnh/file, OCR, phân tích hợp đồng/pháp lý không? UI hiện có dấu hiệu chưa nhất quán về attachment. | Media pipeline, malware/OCR, context limits |
| OQ-032 | P1 | Có yêu cầu STT/TTS/trợ lý giọng nói không? Nếu có: ngôn ngữ, streaming, consent lưu audio và latency? | Hiện chưa có bằng chứng UI; không triển khai trước khi trả lời |
| OQ-033 | P1 | Citation cần ở mức toàn câu trả lời hay từng claim? Nguồn cần public URL hay có thể là record nội bộ có quyền? | Contract, UI citation và security |
| OQ-034 | P1 | Hội thoại lưu bao lâu; người dùng có thể export/xóa; memory có được dùng xuyên hội thoại không? | Retention, personalization, privacy |
| OQ-035 | P2 | Ngưỡng chất lượng/chi phí/độ trễ nào cho từng use case AI? Ai duyệt eval set và release gate? | Model routing, budget và SLO |

## 6. Cộng đồng và nội dung

| ID | Ưu tiên | Câu hỏi | Vì sao cần trả lời / tài liệu chịu ảnh hưởng |
|---|---:|---|---|
| OQ-036 | P0 | Ai được tạo bài theo từng loại; bài nào cần duyệt; quy trình cấp/thu hồi dấu xác minh thế nào? | RBAC, post lifecycle, audit |
| OQ-037 | P0 | Chính sách moderation cho spam, lừa đảo, nội dung sai, PII, bản quyền là gì? Có report, block, appeal và human review không? | Safety bắt buộc trước production |
| OQ-038 | P1 | “Dành cho bạn”, “Mới nhất”, “Đang theo dõi” được xếp hạng chính xác ra sao? Có quảng cáo/sponsored content không? | Feed API, explainability và compliance |
| OQ-039 | P1 | Comment có threading thật, sửa/xóa, mention, report, notification và giới hạn độ sâu không? | Schema và endpoint |
| OQ-040 | P1 | Video được upload hay nhập URL; giới hạn file/duration; hình được hotlink hay đưa vào object storage? | Media contract, CDN, transcoding, cost |
| OQ-041 | P1 | Share count tính theo click hay sự kiện server; link private xử lý thế nào; QR có nằm trong phạm vi? | Deep link, privacy, analytics |
| OQ-042 | P2 | Số follow/view/reaction cần realtime đến mức nào và có chống gian lận không? | Counter architecture, cache và abuse |

## 7. Hạ tầng, vận hành và quy mô

| ID | Ưu tiên | Câu hỏi | Vì sao cần trả lời / tài liệu chịu ảnh hưởng |
|---|---:|---|---|
| OQ-043 | P0 | Cloud provider, region chính và yêu cầu data residency nào được chọn? | Mọi mapping hạ tầng cụ thể |
| OQ-044 | P0 | Dự kiến DAU/MAU, peak QPS, số listing/project/unit/post, tốc độ tăng và concurrent AI streams? | Capacity, DB/search/queue sizing |
| OQ-045 | P0 | Availability, latency, RPO, RTO và retention mục tiêu theo môi trường là gì? | Backup, DR, SLO và chi phí |
| OQ-046 | P0 | Ngân sách hàng tháng/giới hạn chi phí cho cloud, media và AI là bao nhiêu? | Model routing, autoscaling, observability |
| OQ-047 | P1 | Có yêu cầu tích hợp CRM, ERP, analytics, map, SMS/email/Zalo hoặc data warehouse nào? | Adapter, webhook, secret và egress |
| OQ-048 | P1 | Cần dev, staging, production; có sandbox đối tác và dữ liệu test ẩn danh không? | Account/project isolation và CI/CD |
| OQ-049 | P1 | Ai trực vận hành/on-call; escalation và thời gian hỗ trợ là gì? | Alert routing, runbook và SLA |
| OQ-050 | P2 | Khi nào được xem là đủ bằng chứng để thêm Redis, vector search, dedicated search hoặc tách microservice? | Guardrail chống tối ưu sớm |

## 8. Điều hướng và hợp đồng UI

| ID | Ưu tiên | Câu hỏi | Vì sao cần trả lời / tài liệu chịu ảnh hưởng |
|---|---:|---|---|
| OQ-051 | P0 | Cấu trúc URL/deep link mong muốn cho listing, project, unit, post, profile và conversation là gì? Nội dung nào public/indexable? | Router, SEO, share/citation và auth |
| OQ-052 | P1 | Saved badge đếm những loại nào? Modal saved có phải một collection chung hay nhiều collection? | FR-004, response contract |
| OQ-053 | P1 | Các trạng thái loading/empty/error/offline và retry cần copy/hành vi nào? | API errors, frontend acceptance |
| OQ-054 | P1 | Notification icon trong header đại diện cho sự kiện nào và cần read/unread/preferences ra sao? | Notification model/API |

## 9. Nhật ký trả lời

Chưa có câu hỏi nào được đóng. Khi product trả lời, ghi theo mẫu:

| Question ID | Quyết định | Người xác nhận | Ngày | Tài liệu/ADR đã cập nhật |
|---|---|---|---|---|
| — | — | — | — | — |


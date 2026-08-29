# Tài liệu thiết kế — Hướng dẫn đọc

## Tổng quan dự án

Ứng dụng bất động sản AI gồm 3 phần chính:

1. **AI** — Hỏi đáp bất động sản, xem giá, dự án nổi bật, tin tức, cảnh báo rủi ro.
2. **Thị trường** — Tìm nhà bán/cho thuê, xem dự án sơ cấp, xem từng căn hộ, đánh giá/so sánh bằng AI, liên hệ tư vấn, giữ chỗ.
3. **Cộng đồng** — Bảng tin, bài viết, bình luận, theo dõi tác giả, tìm kiếm bằng AI.

**Hiện trạng**: Giao diện đã hoàn thiện dưới dạng mock (React/Vite SPA, dữ liệu giả). Chưa có backend, database hay đăng nhập.

**Mục tiêu docs**: Mô tả thiết kế backend (Python FastAPI + PostgreSQL) để hiện thực hóa các tính năng đã có trong giao diện.

## Thứ tự đọc

| # | File | Đọc để hiểu |
|---|---|---|
| 1 | [requirements.md](./requirements.md) | Sản phẩm làm gì, cho ai, các luồng nghiệp vụ, quy tắc |
| 2 | [system-architecture.md](./system-architecture.md) | Kiến trúc tổng thể: SPA, API, Worker, Database, AI |
| 3 | [project-structure.md](./project-structure.md) | Cây thư mục hiện tại và đích, quy tắc tổ chức code |
| 4 | [api-design.md](./api-design.md) | Thiết kế REST API: endpoints, request/response, lỗi |
| 5 | [database-design.md](./database-design.md) | Thiết kế database: bảng, quan hệ, ràng buộc |
| 6 | [ai-architecture.md](./ai-architecture.md) | Kiến trúc AI: pipeline hỏi đáp, tìm kiếm, đánh giá |
| 7 | [infrastructure.md](./infrastructure.md) | Hạ tầng cloud, CI/CD, bảo mật, giám sát |
| 8 | [decisions.md](./decisions.md) | 14 quyết định kiến trúc và lý do (ADR) |
| 9 | [open-questions.md](./open-questions.md) | 54 câu hỏi cần trả lời trước khi code |
| 10 | [sprint-plan.md](./sprint-plan.md) | Kế hoạch 16 sprint: MVP → Feature → Scale → Production |

> **Lưu ý**: Tất cả tài liệu đang ở trạng thái **"Proposed — chờ review"**. Chưa có gì là quyết định cuối cùng.

## Trạng thái tài liệu

- **Đã quan sát**: Tính năng đã thấy trong giao diện mock.
- **Đề xuất thiết kế**: Thiết kế đề xuất cho backend, chưa implement.
- **Chưa xác định**: Cần trả lời trong `open-questions.md` trước khi thiết kế.

## Tech stack

| Thành phần | Công nghệ |
|---|---|
| Frontend | React + Vite + TypeScript (đã có) |
| Backend API | Python FastAPI |
| Background Worker | Python (cùng codebase) |
| Database | PostgreSQL (managed) |
| ORM | SQLAlchemy |
| Migration | Alembic |
| Validation | Pydantic |
| AI | Managed LLM qua adapter (chưa chọn provider) |
| Object Storage | Chưa chọn (provider-neutral) |

## Bảng thuật ngữ

Các thuật ngữ kỹ thuật dùng xuyên suốt tài liệu:

### Dữ liệu & Database

| Thuật ngữ | Nghĩa | Ví dụ |
|---|---|---|
| **Canonical** | Dữ liệu gốc, chính thức, nguồn sự thật duy nhất | Trạng thái căn hộ trong DB là canonical, trạng thái hiển thị trên UI là bản copy |
| **Provenance** | Nguồn gốc và lịch sử của dữ liệu | Giá căn hộ lấy từ đâu, lúc nào, ai cập nhật |
| **Source of truth** | Nguồn sự thật — nơi lưu dữ liệu chính xác nhất | PostgreSQL là source of truth, không phải Redis hay cache |
| **Schema** | Cấu trúc bảng/cột trong database | Bảng `listings` có các cột `id`, `price`, `area`... |
| **Migration** | File thay đổi cấu trúc database theo thứ tự | Thêm cột `status` vào bảng `units` |
| **Seed** | Dữ liệu mẫu ban đầu để test/dev | Danh sách quận huyện, loại bất động sản |
| **FK (Foreign Key)** | Khóa ngoại — liên kết giữa 2 bảng | `listing.project_id` trỏ tới `projects.id` |
| **Soft delete** | Xóa mềm — đánh dấu `deleted_at` thay vì xóa thật | Bài viết bị xóa vẫn còn trong DB để audit |
| **Projection** | Bản sao tính toán sẵn cho đọc nhanh | `followers_count` là projection, source of truth là bảng `follows` |

### API & Giao tiếp

| Thuật ngữ | Nghĩa | Ví dụ |
|---|---|---|
| **REST** | Kiểu thiết kế API theo tài nguyên (resource) | `GET /listings/123` — lấy tin đăng số 123 |
| **Endpoint** | Một đường dẫn API cụ thể | `POST /consultation-requests` |
| **Mutation** | Thao tác thay đổi dữ liệu (tạo/sửa/xóa) | Tạo booking, đăng bài, gửi liên hệ |
| **Idempotent** | Gửi request nhiều lần vẫn cho cùng kết quả, không bị lặp | Bấm "Gửi liên hệ" 2 lần chỉ tạo 1 request |
| **Cursor pagination** | Phân trang bằng con trỏ (token) thay vì số trang | Cuộn danh sách → load thêm bằng `nextCursor` |
| **SSE** | Server-Sent Events — server gửi dữ liệu liên tục tới client | AI trả lời từng chữ (streaming) |
| **Idempotency-Key** | Mã duy nhất gắn theo request để chống gửi lặp | Client tạo UUID, gửi kèm request booking |
| **ETag / If-Match** | Cơ chế kiểm tra phiên bản khi cập nhật | Sửa bài viết: gửi kèm version cũ để tránh ghi đè |
| **Webhook** | API ngược — server bên ngoài gọi vào hệ thống | Đối tác cập nhật trạng thái căn → gọi webhook |

### Kiến trúc & Hệ thống

| Thuật ngữ | Nghĩa | Ví dụ |
|---|---|---|
| **Modular monolith** | Một ứng dụng nhưng chia module có ranh giới rõ | Module `bookings/`, `listings/`, `social/` trong cùng 1 server |
| **Transactional outbox** | Ghi event cùng lúc với dữ liệu trong 1 transaction DB | Tạo booking + ghi event "booking.created" trong cùng commit |
| **Worker** | Tiến trình chạy nền, xử lý việc không cần phản hồi ngay | Gửi notification, scan ảnh, đồng bộ dữ liệu đối tác |
| **Optimistic concurrency** | Cho phép đọc đồng thời, kiểm tra xung đột lúc ghi | 2 người cùng booking 1 căn → người sau nhận lỗi conflict |
| **Circuit breaker** | Tự ngắt kết nối tới dịch vụ lỗi để tránh lan truyền | Nếu LLM lỗi liên tục → tạm dừng gọi, trả fallback |
| **Feature flag** | Bật/tắt tính năng không cần deploy lại | Bật booking chỉ cho staging, tắt trên production |
| **Kill switch** | Nút tắt khẩn cấp cho tính năng rủi ro | Tắt AI nếu phát hiện câu trả lời sai nghiêm trọng |

### AI & Dữ liệu

| Thuật ngữ | Nghĩa | Ví dụ |
|---|---|---|
| **Trust tier** | Mức tin cậy của nguồn dữ liệu (T1–T4) | T1: DB chính thức, T4: nguồn chưa xác minh |
| **Citation** | Trích dẫn nguồn trong câu trả lời AI | "Giá từ 6.8 tỷ [nguồn: dự án Lumi, cập nhật 28/08]" |
| **RAG** | AI tìm dữ liệu rồi mới trả lời (Retrieval-Augmented Generation) | AI search listings trong DB rồi tổng hợp câu trả lời |
| **Grounding** | Gắn câu trả lời AI vào dữ liệu thực | AI không bịa giá, mà lấy từ DB có nguồn |
| **Eval** | Kiểm tra chất lượng đầu ra AI | So sánh câu trả lời AI với đáp án chuẩn |

### Nghiệp vụ bất động sản

| Thuật ngữ | Nghĩa | Ví dụ |
|---|---|---|
| **Hold** | Giữ chỗ tạm thời cho một căn hộ (có thời hạn) | Khách booking → căn được hold 24h |
| **Lead** | Yêu cầu liên hệ/tư vấn từ khách hàng | Khách gửi SĐT để được tư vấn về căn hộ |
| **Inventory** | Tồn kho căn hộ sơ cấp (từ chủ đầu tư) | 500 căn, 200 đã bán, 300 còn hàng |
| **Distributor** | Đơn vị phân phối bất động sản | Đại lý A bán căn hộ cho dự án Lumi |
| **UGC** | Nội dung do người dùng tạo (User Generated Content) | Bài viết, bình luận trên mạng cộng đồng |
| **Listing** | Tin đăng bán/cho thuê bất động sản | "Bán căn hộ 2PN Tây Hồ, 6.8 tỷ" |

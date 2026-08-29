#!/usr/bin/env python3
"""
Đồng bộ và cập nhật nội dung chi tiết chuẩn Enterprise cho các GitHub Issues của Sprint 1.
"""

import subprocess
import json

REPO = "thang1908/Market-"

UPDATES = [
    {
        "issue_num": 1,
        "title": "[Sprint 1] [Task 1.1] [BE] Setup FastAPI Application Factory, Config & Health Endpoints",
        "body": """## 📌 Tổng quan
Khởi tạo khung ứng dụng Backend bằng Python FastAPI sử dụng mô hình Application Factory, cấu hình Pydantic BaseSettings và cung cấp các endpoint kiểm tra trạng thái sống (Liveness / Readiness).

---

### 📥 1. Đầu vào (Inputs)
- Tài liệu kiến trúc: `docs/system-architecture.md` và `docs/project-structure.md`.
- File môi trường mẫu: `server/.env.example`.
- Python >= 3.11, FastAPI, Pydantic v2, Uvicorn.

---

### 🛠️ 2. Chi tiết công việc cần làm
1. **Tạo `server/app/config.py`**:
   - Định nghĩa class `Settings(BaseSettings)` chứa: `ENV`, `API_PORT`, `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`.
   - Đọc tự động từ biến môi trường và file `.env`.
2. **Tạo `server/app/main.py`**:
   - Hàm factory `create_app() -> FastAPI`.
   - Cấu hình `CORSMiddleware` cho phép `localhost:3000` và các client domain.
   - Đăng ký router prefix `/api/v1`.
3. **Tạo các Health Endpoints**:
   - `GET /health` (Liveness probe): Kiểm tra tiến trình app đang chạy.
   - `GET /ready` (Readiness probe): Kiểm tra kết nối DB và cấu hình sẵn sàng nhận traffic.

---

### 📤 3. Đầu ra (Outputs)
- File `server/app/config.py`.
- File `server/app/main.py`.
- Endpoint `GET /health` và `GET /ready`.

---

### ✅ 4. Tiêu chí nghiệm thu (Acceptance Criteria)
- [ ] Chạy `uvicorn app.main:app --reload` khởi động thành công trên cổng 8000.
- [ ] `curl -s http://localhost:8000/health` trả về HTTP 200: `{"status": "ok", "environment": "development"}`.
- [ ] `curl -s http://localhost:8000/ready` trả về HTTP 200: `{"status": "ready", "database": "connected"}` (khi có DB).
- [ ] Kiểm tra Swagger UI truy cập được tại `http://localhost:8000/docs`.
"""
    },
    {
        "issue_num": 2,
        "title": "[Sprint 1] [Task 1.2] [BE] Setup PostgreSQL 16, Async SQLAlchemy 2.0 & Alembic Migrations",
        "body": """## 📌 Tổng quan
Thiết lập hệ thống cơ sở dữ liệu PostgreSQL 16 (hỗ trợ pgvector), xây dựng tầng kết nối Async SQLAlchemy 2.0 và cấu hình công cụ quản lý lược đồ dữ liệu Alembic.

---

### 📥 1. Đầu vào (Inputs)
- Tài liệu: `docs/database-design.md` (Mục 1 & 2: Quy chuẩn thiết kế DB, Async engine).
- `docker-compose.yml` định nghĩa service `postgres:pgvector/pgvector:pg16`.

---

### 🛠️ 2. Chi tiết công việc cần làm
1. **Khởi tạo Async Database Session**:
   - Tạo `server/app/shared/database.py`.
   - Khởi tạo `create_async_engine(DATABASE_URL, pool_size=20, max_overflow=10)`.
   - Tạo `async_sessionmaker` và dependency `get_db_session() -> AsyncGenerator`.
   - Định nghĩa `Base(DeclarativeBase)` với timestamp tự động (`created_at`, `updated_at`).
2. **Cấu hình Alembic Async**:
   - Khởi tạo `alembic init -t async server/alembic`.
   - Cập nhật `server/alembic/env.py` để import `Base.metadata` và đọc `DATABASE_URL` từ `config.py`.
3. **Tạo Migration đầu tiên (Initial Migration)**:
   - Tạo bảng `users` cơ bản để kiểm tra migration flow.

---

### 📤 3. Đầu ra (Outputs)
- Module `server/app/shared/database.py`.
- Thư mục `server/alembic/` và file `alembic.ini`.
- File migration `server/alembic/versions/001_initial_schema.py`.

---

### ✅ 4. Tiêu chí nghiệm thu (Acceptance Criteria)
- [ ] Khởi động Postgres qua `docker compose up -d postgres` thành công.
- [ ] Chạy `alembic upgrade head` áp dụng migration thành công không có lỗi.
- [ ] Chạy `alembic downgrade -1` rollback được và `alembic upgrade head` lại trơn tru.
"""
    },
    {
        "issue_num": 3,
        "title": "[Sprint 1] [Task 1.3] [BE] Module Identity: Phone OTP Mock & JWT Token Authentication",
        "body": """## 📌 Tổng quan
Xây dựng phân hệ xác thực người dùng (Module Identity) hỗ trợ đăng nhập bằng Số điện thoại với mã OTP giả lập cho giai đoạn MVP (`123456`) và cấp phát JWT Bearer token an toàn.

---

### 📥 1. Đầu vào (Inputs)
- Tài liệu: `docs/api-design.md` (Mục 4: Authentication & Identity).
- Tài liệu: `docs/database-design.md` (Bảng `users`).
- Thư viện: `python-jose`, `passlib`.

---

### 🛠️ 2. Chi tiết công việc cần làm
1. **Thiết kế Domain & Database**:
   - Tạo model `User` trong `server/app/modules/identity/domain/models.py`:
     - `id` (UUID / BigInt), `phone` (VARCHAR(15), UNIQUE), `full_name` (VARCHAR(100)), `role` (ENUM: user, creator, admin), `is_active` (BOOLEAN), `created_at`, `updated_at`.
2. **Xây dựng DTOs (Pydantic Schemas)**:
   - `RequestOTPRequest`, `RequestOTPResponse` (phone, expires_in_seconds).
   - `VerifyOTPRequest`, `AuthTokenResponse` (access_token, token_type, user_info).
3. **Xây dựng Use Cases & Router**:
   - `POST /api/v1/auth/request-otp`: Nhận SĐT, sinh OTP mock `123456` và lưu cache/memory với TTL 5 phút.
   - `POST /api/v1/auth/verify-otp`: Kiểm tra SĐT + OTP. Nếu đúng -> tạo user mới (nếu chưa có) hoặc lấy user cũ -> sinh JWT access token.
   - `GET /api/v1/auth/me`: Lấy thông tin user hiện tại từ Bearer token.
4. **Viết Dependency `get_current_user`**:
   - Trích xuất token từ header `Authorization: Bearer <token>`, giải mã và inject `current_user` vào các endpoint cần bảo vệ.

---

### 📤 3. Đầu ra (Outputs)
- Module `server/app/modules/identity/` hoàn chỉnh.
- Router `server/app/modules/identity/transport/router.py`.
- 3 API endpoints: `/auth/request-otp`, `/auth/verify-otp`, `/auth/me`.

---

### ✅ 4. Tiêu chí nghiệm thu (Acceptance Criteria)
- [ ] Gửi request `POST /api/v1/auth/request-otp` với body `{"phone": "0987654321"}` -> trả HTTP 200 kèm `expires_in: 300`.
- [ ] Gửi request `POST /api/v1/auth/verify-otp` với body `{"phone": "0987654321", "otp": "123456"}` -> trả HTTP 200 kèm JWT token hợp lệ.
- [ ] Gửi OTP sai -> trả HTTP 400 Bad Request kèm message lỗi rõ ràng.
- [ ] Gọi `GET /api/v1/auth/me` kèm header `Authorization: Bearer <token>` -> trả về đúng thông tin user profile.
"""
    },
    {
        "issue_num": 4,
        "title": "[Sprint 1] [Task 1.4] [BE] Module Geography: Schema, Seed 30 Quận/Huyện Hà Nội & REST Endpoints",
        "body": """## 📌 Tổng quan
Xây dựng phân hệ địa lý (Module Geography) chuẩn hóa, lưu trữ Tỉnh/Thành phố và Quận/Huyện vào cơ sở dữ liệu và seed dữ liệu chuẩn cho 30 Quận/Huyện Hà Nội để thay thế dữ liệu hardcode trên UI.

---

### 📥 1. Đầu vào (Inputs)
- Tài liệu: `docs/database-design.md` (Bảng `cities`, `districts`).
- Dữ liệu mock quận/huyện hiện tại trong `client/src/data/` (HANOI_DISTRICTS).

---

### 🛠️ 2. Chi tiết công việc cần làm
1. **Thiết kế Database & Migration**:
   - Bảng `cities`: `id` (VARCHAR(10), PK - vd: 'HN'), `name` (VARCHAR(100)), `slug` (VARCHAR(100)), `is_active` (BOOLEAN).
   - Bảng `districts`: `id` (VARCHAR(20), PK), `city_id` (FK -> cities.id), `name` (VARCHAR(100)), `slug` (VARCHAR(100)), `display_order` (INT).
2. **Viết Script Seed dữ liệu**:
   - Seed Thành phố Hà Nội ('HN') và 30 Quận/Huyện (Ba Đình, Hoàn Kiếm, Tây Hồ, Cầu Giấy, Nam Từ Liêm, Hà Đông...).
3. **Xây dựng API Endpoints**:
   - `GET /api/v1/cities`: Danh sách các tỉnh/thành phố đang hoạt động.
   - `GET /api/v1/cities/{city_id}/districts`: Danh sách quận/huyện theo thành phố, sắp xếp theo `display_order`.

---

### 📤 3. Đầu ra (Outputs)
- Module `server/app/modules/geography/`.
- File seed script `server/app/modules/geography/seeds/hanoi_districts.py`.
- 2 API endpoints: `GET /api/v1/cities`, `GET /api/v1/cities/{city_id}/districts`.

---

### ✅ 4. Tiêu chí nghiệm thu (Acceptance Criteria)
- [ ] Chạy lệnh seed -> nạp đủ 30 quận/huyện vào DB Postgres.
- [ ] `curl -s http://localhost:8000/api/v1/cities` trả về danh sách có Hà Nội.
- [ ] `curl -s http://localhost:8000/api/v1/cities/HN/districts` trả về 30 quận/huyện đúng định dạng JSON chuẩn.
"""
    },
    {
        "issue_num": 5,
        "title": "[Sprint 1] [Task 1.5] [BE] API Conventions: Error Envelope, Cursor Pagination & CORS",
        "body": """## 📌 Tổng quan
Thiết lập bộ tiêu chuẩn giao tiếp API đồng nhất cho toàn bộ hệ thống backend: Cấu trúc đóng gói lỗi (Error Envelope), Helper phân trang con trỏ (Cursor Pagination), và bảo mật CORS.

---

### 📥 1. Đầu vào (Inputs)
- Tài liệu: `docs/api-design.md` (Mục 2: Format chuẩn, Mục 3: Error handling & HTTP status codes).

---

### 🛠️ 2. Chi tiết công việc cần làm
1. **Xây dựng Error Envelope chuẩn**:
   - Định nghĩa format:
     ```json
     {
       "error": {
         "code": "VALIDATION_ERROR | NOT_FOUND | UNAUTHORIZED | CONFLICT | INTERNAL_ERROR",
         "message": "Thông điệp lỗi thân thiện cho người dùng",
         "details": [{"field": "phone", "issue": "Invalid format"}],
         "request_id": "req-uuid"
       }
     }
     ```
   - Đăng ký global exception handlers trong FastAPI: `RequestValidationError`, `HTTPException`, `AppException`.
2. **Xây dựng Generic Cursor Pagination Helper**:
   - Tạo helper mã hóa/giải mã Base64 cursor: `encode_cursor(created_at, id) -> str`, `decode_cursor(cursor_str) -> tuple`.
   - Struct response phân trang chuẩn: `items`, `next_cursor`, `has_more`, `total_count`.
3. **Cấu hình Middleware**:
   - Thêm Request ID middleware (tạo UUID gắn vào mỗi request log).

---

### 📤 3. Đầu ra (Outputs)
- Module `server/app/shared/errors.py`.
- Module `server/app/shared/pagination.py`.
- Module `server/app/shared/middleware.py`.

---

### ✅ 4. Tiêu chí nghiệm thu (Acceptance Criteria)
- [ ] Gửi request sai format dữ liệu -> Nhận về format `{"error": {"code": "VALIDATION_ERROR", ...}}` với HTTP 422.
- [ ] Hàm `encode_cursor` và `decode_cursor` có unit test đạt độ chính xác 100%.
- [ ] Header response luôn chứa `X-Request-ID`.
"""
    },
    {
        "issue_num": 6,
        "title": "[Sprint 1] [Task 1.6] [DevOps] CI Pipeline cơ bản với GitHub Actions",
        "body": """## 📌 Tổng quan
Thiết lập quy trình tích hợp liên tục (CI) tự động kiểm tra cú pháp, type check, unit test và build test trên mỗi Pull Request và Push vào nhánh `main`.

---

### 📥 1. Đầu vào (Inputs)
- Tài liệu: `docs/infrastructure.md` (Mục 9: CI/CD và artifact supply chain).
- Stack: GitHub Actions, Python 3.11 (Ruff, Mypy, Pytest), Node 18 (TypeScript, Vite).

---

### 🛠️ 2. Chi tiết công việc cần làm
1. **Tạo workflow `.github/workflows/ci.yml`**:
   - **Job 1: Backend Checks**:
     - Cài đặt Python 3.11 & dependencies qua pip.
     - Chạy `ruff check .` (Linter).
     - Chạy `mypy app` (Static Type Checker).
     - Chạy `pytest` (Unit Tests).
   - **Job 2: Frontend Checks**:
     - Cài đặt Node 18 & `npm ci` trong thư mục `client/`.
     - Chạy `npx tsc --noEmit` (TypeScript check).
     - Chạy `npm run build` (Vite production build test).
2. **Quy tắc bảo vệ**:
   - Bắt buộc CI phải PASS (Green) trước khi merge PR.

---

### 📤 3. Đầu ra (Outputs)
- File workflow `.github/workflows/ci.yml`.

---

### ✅ 4. Tiêu chí nghiệm thu (Acceptance Criteria)
- [ ] Đẩy code lên GitHub -> GitHub Actions kích hoạt tự động.
- [ ] Toàn bộ các bước kiểm tra (Backend + Frontend) đều chuyển trạng thái ✅ PASS.
- [ ] Cố tình commit code sai type -> CI bắt được lỗi và chặn merge ❌ FAIL.
"""
    },
    {
        "issue_num": 7,
        "title": "[Sprint 1] [Task 1.7] [FE] Setup API Client Architecture: Axios Instance & JWT Interceptors",
        "body": """## 📌 Tổng quan
Xây dựng lớp dịch vụ mạng tập trung (API Client Layer) trong Frontend React sử dụng Axios, tích hợp sẵn Request Interceptor tự động gắn token và Response Interceptor xử lý lỗi tập trung.

---

### 📥 1. Đầu vào (Inputs)
- Tài liệu: `docs/api-design.md` (Mục 1: Migration mapping & API client conventions).
- File cấu hình môi trường `client/.env.example` (`VITE_API_URL`).

---

### 🛠️ 2. Chi tiết công việc cần làm
1. **Cài đặt thư viện**:
   - Cài đặt `axios` trong thư mục `client/`.
2. **Tạo `client/src/api/client.ts`**:
   - Tạo instance `apiClient` với `baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'`.
   - **Request Interceptor**: Tự động lấy JWT token từ `localStorage` (hoặc AuthState) và gắn vào header `Authorization: Bearer <token>`.
   - **Response Interceptor**: Bắt lỗi 401 Unauthorized -> xóa token và kích hoạt mở modal đăng nhập; chuẩn hóa thông điệp lỗi từ Error Envelope.
3. **Tạo các API Services ban đầu**:
   - `client/src/api/auth.ts`: `requestOtp()`, `verifyOtp()`, `getMe()`.
   - `client/src/api/geography.ts`: `getCities()`, `getDistricts(cityId)`.
4. **Tích hợp Geography API vào giao diện**:
   - Cập nhật `MarketFilters.tsx` để load danh sách quận/huyện từ API thật thay vì hằng số `HANOI_DISTRICTS`.

---

### 📤 3. Đầu ra (Outputs)
- Module `client/src/api/client.ts`.
- Các service `client/src/api/auth.ts`, `client/src/api/geography.ts`.
- `MarketFilters.tsx` gọi API `getDistricts` thành công.

---

### ✅ 4. Tiêu chí nghiệm thu (Acceptance Criteria)
- [ ] Mở tab Thị trường BĐS trên browser -> Network tab hiển thị request `GET /api/v1/cities/HN/districts` trả về 200.
- [ ] Dropdown quận/huyện hiển thị đầy đủ 30 quận/huyện được nạp từ Backend.
"""
    },
    {
        "issue_num": 8,
        "title": "[Sprint 1] [Task 1.8] [FE] Màn hình đăng nhập Auth Flow: Phone Input -> OTP -> State Persistence",
        "body": """## 📌 Tổng quan
Hiện thực hóa giao diện đăng nhập cho người dùng trên Frontend: Form nhập Số điện thoại, form xác thực mã OTP giả lập (6 số), lưu trữ JWT token và cập nhật trạng thái Profile trên Header.

---

### 📥 1. Đầu vào (Inputs)
- Backend Auth API đã hoàn thành từ Task 1.3 (`/auth/request-otp`, `/auth/verify-otp`, `/auth/me`).
- API client từ Task 1.7.

---

### 🛠️ 2. Chi tiết công việc cần làm
1. **Tạo Auth Modal Component**:
   - Tạo `client/src/features/identity/AuthModal.tsx` với 2 bước:
     - **Step 1**: Nhập Số điện thoại (Validate định dạng SĐT Việt Nam 10 chữ số) -> Bấm "Tiếp tục".
     - **Step 2**: Nhập mã OTP 6 số (gợi ý mặc định `123456`) kèm nút "Gửi lại mã" đếm ngược 60 giây.
2. **Quản lý Auth State**:
   - Cập nhật `useAppState.tsx` (hoặc tạo `useAuth.tsx`): Lưu `token`, `currentUser`, `isAuthenticated`.
   - Lưu `token` vào `localStorage` để duy trì đăng nhập khi F5.
3. **Cập nhật Header UI**:
   - Header hiển thị nút "Đăng nhập" khi chưa auth.
   - Khi đã đăng nhập: Hiển thị Avatar, Tên/SĐT người dùng và menu Dropdown "Đăng xuất".

---

### 📤 3. Đầu ra (Outputs)
- Component `client/src/features/identity/AuthModal.tsx`.
- Hook / State quản lý authentication.
- Header cập nhật trạng thái đăng nhập thời gian thực.

---

### ✅ 4. Tiêu chí nghiệm thu (Acceptance Criteria)
- [ ] Bấm nút "Đăng nhập" trên Header -> Modal hiển thị mượt mà.
- [ ] Nhập `0987654321` -> Nhận mã -> Nhập `123456` -> Đăng nhập thành công, Modal đóng lại.
- [ ] Header chuyển sang hiển thị icon người dùng đã đăng nhập.
- [ ] F5 lại trang web -> Trạng thái đăng nhập vẫn được giữ nguyên.
"""
    },
    {
        "issue_num": 9,
        "title": "[Sprint 1] [Task 1.9] [FE] Tích hợp React Router DOM & URL-based Deep Linking Navigation",
        "body": """## 📌 Tổng quan
Chuyển đổi toàn bộ cơ chế điều hướng trong ứng dụng từ dạng chuyển Tab bằng state bộ nhớ (`activeTab`) sang **React Router DOM với URL chuẩn**, hỗ trợ Deep Link, F5 giữ nguyên trang và tối ưu SEO.

---

### 📥 1. Đầu vào (Inputs)
- Tài liệu: `docs/project-structure.md` và `docs/requirements.md`.
- Codebase `client/src/App.tsx` và `BottomNav.tsx`.

---

### 🛠️ 2. Chi tiết công việc cần làm
1. **Cài đặt thư viện**:
   - Cài đặt `react-router-dom` trong `client/`.
2. **Cấu hình Router**:
   - Định nghĩa các Route trong `client/src/App.tsx`:
     - `/` hoặc `/ai`: Màn hình Trợ lý AI
     - `/market`: Màn hình Thị trường BĐS
     - `/social`: Màn hình Cộng đồng
     - `/saved`: Màn hình / Modal Danh sách đã lưu
3. **Cập nhật Navigation Components**:
   - Cập nhật `BottomNav.tsx` dùng `NavLink` / `useLocation` để highlight tab đang active theo URL.
   - Cập nhật các nút chuyển trang trong Header và các component con dùng `useNavigate()`.
4. **Bảo toàn trạng thái**:
   - Đảm bảo khi người dùng chuyển giữa các route hoặc copy link gửi người khác, ứng dụng mở đúng màn hình tương ứng.

---

### 📤 3. Đầu ra (Outputs)
- Cấu hình Router hoàn chỉnh trong `client/src/App.tsx`.
- `client/src/components/common/BottomNav.tsx` tích hợp router link.

---

### ✅ 4. Tiêu chí nghiệm thu (Acceptance Criteria)
- [ ] Truy cập `http://localhost:3000/market` -> Hiển thị ngay tab Thị trường.
- [ ] Truy cập `http://localhost:3000/social` -> Hiển thị ngay tab Cộng đồng.
- [ ] Bấm các nút ở thanh điều hướng phía dưới -> URL trên thanh địa chỉ trình duyệt thay đổi tương ứng.
- [ ] Bấm F5 ở bất kỳ route nào -> Ứng dụng không bị reset về trang chủ mà giữ đúng màn hình hiện tại.
"""
    }
]

TASK_1_0 = {
    "title": "[Sprint 1] [Task 1.0] [Architecture] Restructure & Format Project Structure chuẩn Enterprise Monorepo",
    "labels": "sprint-1,architecture,P0-blocker",
    "body": """## 📌 Tổng quan
Tái cấu trúc toàn bộ repository từ dạng Flat Vite ban đầu thành **Mô hình Monorepo chuẩn Enterprise** (`client/`, `server/`, `docs/`, `scripts/`) theo đúng tài liệu `docs/project-structure.md`.

---

### 📥 1. Đầu vào (Inputs)
- Tài liệu kiến trúc: `docs/project-structure.md` (Mục 3: Cấu trúc đích ở mức repository).
- Codebase frontend hiện tại ở thư mục gốc (`src/`, `package.json`, `vite.config.ts`, `node_modules/`...).
- Danh sách các file orphan/deprecated (`MarketSearch.tsx`).

---

### 🛠️ 2. Chi tiết công việc cần làm
1. **Tách không gian làm việc Frontend (`client/`)**:
   - Di chuyển toàn bộ file frontend (`src/`, `index.html`, `package.json`, `tsconfig.json`, `vite.config.ts`, `node_modules/`, `assets/`, `dist/`) vào thư mục `client/`.
   - Dọn dẹp/xóa bỏ file `MarketSearch.tsx` đã deprecated.
   - Tổ chức lại thư mục `client/src/` theo chuẩn **Feature-driven**:
     - `client/src/features/ai/` (AI Chat, Hero, MarketToday, News, Risk...)
     - `client/src/features/market/` (MarketPage, Filters, Cards, Modals...)
     - `client/src/features/projects/` (Primary projects, Inventory, Map, Booking...)
     - `client/src/features/social/` (SocialPage, Feed, Comments, CreatePost...)
     - `client/src/features/saved/` (SavedModal...)
     - `client/src/api/` (API client & models)
     - `client/src/components/common/` (Header, BottomNav)
2. **Khởi tạo không gian làm việc Backend (`server/`)**:
   - Tạo khung thư mục `server/app/modules/` cho 12 domain: `identity`, `geography`, `catalog`, `listings`, `inventory`, `bookings`, `leads`, `saved`, `conversations`, `ai`, `social`, `moderation`.
   - Tạo `server/pyproject.toml`, `server/tests/`, `server/alembic/`.
3. **Thiết lập công cụ điều phối Root**:
   - Tạo `Makefile`, `docker-compose.yml`, `.editorconfig`, `.gitignore`, `README.md`.

---

### 📤 3. Đầu ra (Outputs)
- Thư mục `client/` chứa toàn bộ frontend độc lập.
- Thư mục `server/` chứa khung backend Python FastAPI.
- File `Makefile` và `docker-compose.yml` điều phối toàn dự án.

---

### ✅ 4. Tiêu chí nghiệm thu (Acceptance Criteria)
- [x] Thư mục gốc không còn file `.json`, `.ts` hay `node_modules` nằm tự do.
- [x] Chạy `npm --prefix client run build` thành công 100% không có lỗi import.
- [x] Chạy `npm --prefix client run dev` khởi động dev server mượt mà trên `http://localhost:3000/`.
"""
}

def run(cmd):
    print(f"👉 {cmd}")
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"⚠️ {res.stderr.strip()}")
    else:
        print(f"✅ {res.stdout.strip()}")
    return res

def main():
    print("🚀 Đang cập nhật 9 Issues cũ thành format chuẩn Enterprise...")
    for item in UPDATES:
        num = item["issue_num"]
        title = item["title"]
        body = item["body"]
        # write body to temp file to avoid escaping issues
        with open(f"/tmp/issue_body_{num}.md", "w") as f:
            f.write(body)
        run(f'gh issue edit {num} --repo {REPO} --title "{title}" --body-file /tmp/issue_body_{num}.md')

    print("\n🚀 Đang tạo Task 1.0 (Architecture Monorepo)...")
    with open("/tmp/issue_body_1_0.md", "w") as f:
        f.write(TASK_1_0["body"])
    res = run(f'gh issue create --repo {REPO} --title "{TASK_1_0["title"]}" --body-file /tmp/issue_body_1_0.md --label "{TASK_1_0["labels"]}"')
    if res.stdout.strip():
        issue_url = res.stdout.strip()
        print(f"🎉 Created Task 1.0 at: {issue_url}")
        # Close Task 1.0 as completed
        run(f'gh issue close {issue_url} --repo {REPO} --comment "✅ Hoàn thành 100% trong Sprint 1 (Đã chuyển toàn bộ sang mô hình Monorepo client/ và server/, build thành công 100%)."')

if __name__ == "__main__":
    main()

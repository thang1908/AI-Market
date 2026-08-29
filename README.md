# 🏢 BĐS AI Platform — Enterprise Monorepo

Hệ thống nền tảng Bất Động Sản tích hợp Trợ lý Trí Tuệ Nhân Tạo (AI Assistant), Thị trường Sơ cấp/Thứ cấp và Mạng xã hội Cộng đồng.

---

## 🏛️ Kiến trúc Monorepo

```text
.
├── client/                     # 🌐 Frontend React + Vite + TypeScript (SPA)
│   ├── src/
│   │   ├── app/                # Application bootstrap & routing
│   │   ├── api/                # API client & OpenAPI contracts
│   │   ├── components/common/  # Reusable UI components
│   │   ├── features/           # Feature-based domain modules
│   │   │   ├── ai/             # AI Assistant & Chat
│   │   │   ├── market/         # Secondary Market & Property Listings
│   │   │   ├── projects/       # Primary Projects & Inventory
│   │   │   ├── social/         # Social Feed & Community
│   │   │   └── saved/          # Saved properties & Collections
│   │   └── state/              # Global state management
│   ├── package.json
│   └── vite.config.ts
│
├── server/                     # 🐍 Backend Python FastAPI (Modular Monolith)
│   ├── app/
│   │   ├── main.py             # FastAPI App Factory & Middleware
│   │   ├── config.py           # Pydantic Settings & Environment
│   │   ├── dependencies.py     # Auth & Database Session injection
│   │   └── modules/            # Domain modules (Clean Architecture)
│   │       ├── identity/       # Users & Authentication
│   │       ├── geography/      # Cities & Districts
│   │       ├── listings/       # Property listings
│   │       ├── inventory/      # Primary project units
│   │       ├── bookings/       # Unit holds & bookings
│   │       ├── leads/          # Consultation requests
│   │       ├── conversations/  # AI Chat history
│   │       └── social/         # Posts, comments, reactions
│   ├── tests/                  # Integration & Contract tests
│   ├── alembic/                # Database migrations
│   └── pyproject.toml          # Modern Python dependency specification
│
├── docs/                       # 📚 Toàn bộ tài liệu thiết kế & Sprint Plan
├── scripts/                    # 🛠️ Scripts tự động hóa & CI/CD helpers
├── docker-compose.yml          # 🐳 Khởi chạy toàn bộ hệ thống (Postgres + Server + Client)
├── Makefile                    # ⚡ Developer Command Palette
└── README.md
```

---

## 🚀 Khởi chạy nhanh (Quick Start)

### Yêu cầu môi trường:
- **Node.js**: >= 18.x
- **Python**: >= 3.11
- **Docker & Docker Compose**: (Khuyên dùng)

### 1. Khởi động toàn bộ qua Docker Compose
```bash
make dev
```
*(Hệ thống sẽ tự động khởi tạo Postgres với pgvector, build Server FastAPI trên cổng `8000` và Client trên cổng `3000`)*

### 2. Hoặc chạy độc lập từng phân hệ:

#### Frontend:
```bash
make dev-client
# Hoặc: cd client && npm install && npm run dev
```

#### Backend:
```bash
make dev-server
# Hoặc: cd server && pip install -e ".[dev]" && uvicorn app.main:app --reload
```

---

## 🛠️ Developer Command Palette (Makefile)

Chạy `make help` để xem danh sách lệnh:

- `make install` — Cài đặt dependencies cho cả Client và Server
- `make dev` — Khởi động toàn bộ stack bằng Docker
- `make test` — Chạy toàn bộ test suites (Pytest + TypeScript typecheck)
- `make lint` — Kiểm tra code style (Ruff + Mypy + ESLint)
- `make db-up` — Khởi động riêng PostgreSQL
- `make db-migrate` — Chạy Alembic database migrations
- `make build` — Build production artifacts

---

## 📚 Tài liệu chi tiết

Vui lòng tham khảo thư mục [`docs/`](./docs/README.md) để xem chi tiết:
- [Hướng dẫn đọc & Thuật ngữ](./docs/README.md)
- [Kế hoạch 16 Sprint từ MVP đến 1M Users](./docs/sprint-plan.md)
- [Kiến trúc hệ thống](./docs/system-architecture.md)
- [Thiết kế Database](./docs/database-design.md)
- [Thiết kế API REST](./docs/api-design.md)

.PHONY: help install dev dev-client dev-server build test lint db-up db-down db-migrate clean

help: ## Hiển thị danh sách lệnh hữu ích
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Cài đặt dependencies cho cả Client và Server
	@echo "📦 Cài đặt Client dependencies..."
	cd client && npm install
	@echo "📦 Cài đặt Server dependencies..."
	cd server && pip install -e ".[dev]"

dev: ## Chạy đồng thời Postgres, Server và Client qua Docker Compose
	docker compose up --build

dev-client: ## Chạy Frontend React development server
	cd client && npm run dev

dev-server: ## Chạy Backend FastAPI development server
	cd server && uvicorn app.main:app --reload --port 8000

build: ## Build production artifacts cho cả Client và Server
	@echo "🏗️ Building Client..."
	cd client && npm run build
	@echo "🏗️ Building Docker images..."
	docker compose build

test: ## Chạy toàn bộ test suites (Client & Server)
	@echo "🧪 Chạy Backend tests..."
	cd server && pytest
	@echo "🧪 Chạy Client typecheck..."
	cd client && npx tsc --noEmit

lint: ## Chạy linter & code formatter
	@echo "🔍 Kiểm tra Server code..."
	cd server && ruff check . && mypy app
	@echo "🔍 Kiểm tra Client code..."
	cd client && npm run lint

db-up: ## Khởi động riêng PostgreSQL
	docker compose up -d postgres

db-down: ## Dừng PostgreSQL
	docker compose stop postgres

db-migrate: ## Chạy Alembic database migration
	cd server && alembic upgrade head

clean: ## Dọn dẹp cache và build artifacts
	rm -rf client/dist client/node_modules/.vite server/.pytest_cache server/.mypy_cache server/.ruff_cache

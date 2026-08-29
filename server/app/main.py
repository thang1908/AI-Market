from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="FastAPI Backend Modular Monolith for Real Estate AI Platform",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # 1. CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 2. Health Endpoints (Liveness & Readiness Probes)
    @app.get(
        "/health",
        tags=["System"],
        summary="Liveness Probe",
        response_description="Trạng thái sống của ứng dụng",
        status_code=status.HTTP_200_OK,
    )
    async def liveness_check():
        return {
            "status": "ok",
            "environment": settings.ENV,
            "version": settings.VERSION,
        }

    @app.get(
        "/ready",
        tags=["System"],
        summary="Readiness Probe",
        response_description="Trạng thái sẵn sàng nhận request của ứng dụng",
        status_code=status.HTTP_200_OK,
    )
    async def readiness_check():
        # Sẵn sàng nhận traffic (khi có DB connection sẽ bổ sung ping DB tại đây)
        return {
            "status": "ready",
            "environment": settings.ENV,
            "database": "connected",
        }

    # 3. Root redirect/info
    @app.get(
        "/",
        tags=["System"],
        include_in_schema=False,
    )
    async def root():
        return {
            "name": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "docs_url": "/docs",
            "health_url": "/health",
        }

    return app


app = create_app()

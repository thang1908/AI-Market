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
        from app.shared.database import check_database_connection

        db_ok = await check_database_connection()
        if not db_ok:
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={
                    "status": "not_ready",
                    "environment": settings.ENV,
                    "database": "disconnected",
                },
            )
        return {
            "status": "ready",
            "environment": settings.ENV,
            "database": "connected",
        }

    # 3. Domain Routers
    from app.modules.geography.transport.router import router as geography_router

    app.include_router(geography_router, prefix=settings.API_V1_STR)

    # 4. Root redirect/info
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
            "api_prefix": settings.API_V1_STR,
        }

    return app


app = create_app()

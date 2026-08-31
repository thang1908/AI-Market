"""
FastAPI Router cho module Projects.
Cung cấp các endpoints tìm kiếm, lọc và xem chi tiết dự án BĐS sơ cấp.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.database import get_db
from app.modules.projects.service.project_service import ProjectService
from app.modules.projects.schemas.project_schemas import (
    ProjectCard,
    ProjectDetail,
    PaginatedProjects,
    ProjectUnitCard,
    PaginatedUnits,
    ProjectSummary,
)

router = APIRouter(prefix="/projects", tags=["projects"])


# ── GET /projects ─── Danh sách dự án có filter + phân trang ──────────────
@router.get("", response_model=PaginatedProjects, summary="Danh sách dự án BĐS sơ cấp")
async def list_projects(
    city_id: Optional[str] = Query(None, description="Lọc theo tỉnh/thành (VD: HN, HCM, DN)"),
    district_id: Optional[str] = Query(None, description="Lọc theo quận/huyện"),
    property_type: Optional[str] = Query(None, description="Loại hình, comma-separated: Căn hộ,Biệt thự"),
    status: Optional[str] = Query(None, description="Trạng thái, comma-separated: Đang mở bán,Sắp mở bán"),
    min_price: Optional[int] = Query(None, description="Giá từ (VND)"),
    max_price: Optional[int] = Query(None, description="Giá đến (VND)"),
    is_featured: Optional[bool] = Query(None, description="Chỉ lấy dự án nổi bật"),
    search: Optional[str] = Query(None, description="Tìm theo tên dự án, chủ đầu tư, địa chỉ"),
    page: int = Query(1, ge=1, description="Số trang"),
    page_size: int = Query(12, ge=1, le=50, description="Số mục mỗi trang"),
    db: AsyncSession = Depends(get_db),
):
    result = await ProjectService.get_projects(
        db=db,
        city_id=city_id,
        district_id=district_id,
        property_type=property_type,
        status=status,
        min_price=min_price,
        max_price=max_price,
        is_featured=is_featured,
        search=search,
        page=page,
        page_size=page_size,
    )
    return result


# ── GET /projects/featured ─── Dự án nổi bật ──────────────────────────────
@router.get("/featured", response_model=list[ProjectCard], summary="Dự án nổi bật")
async def get_featured_projects(
    limit: int = Query(6, ge=1, le=20, description="Số dự án tối đa"),
    city_id: Optional[str] = Query(None, description="Lọc theo thành phố"),
    db: AsyncSession = Depends(get_db),
):
    return await ProjectService.get_featured_projects(db=db, limit=limit, city_id=city_id)


# ── GET /projects/stats/summary ─── Thống kê tổng quan ────────────────────
@router.get("/stats/summary", response_model=ProjectSummary, summary="Thống kê dự án")
async def get_project_summary(
    city_id: Optional[str] = Query(None, description="Lọc theo thành phố"),
    db: AsyncSession = Depends(get_db),
):
    return await ProjectService.get_summary(db=db, city_id=city_id)


# ── GET /projects/{id} ─── Chi tiết dự án ─────────────────────────────────
@router.get("/{project_id}", response_model=ProjectDetail, summary="Chi tiết dự án")
async def get_project_detail(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    project = await ProjectService.get_project_detail(db=db, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy dự án: {project_id}")
    return project


# ── GET /projects/{id}/units ─── Danh sách căn hộ tồn kho ─────────────────
@router.get("/{project_id}/units", response_model=PaginatedUnits, summary="Tồn kho căn hộ dự án")
async def get_project_units(
    project_id: str,
    status: Optional[str] = Query(None, description="available | deposited | sold"),
    bedrooms: Optional[int] = Query(None, description="Số phòng ngủ"),
    block: Optional[str] = Query(None, description="Tòa / Block"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    # Kiểm tra dự án tồn tại
    project = await ProjectService.get_project_detail(db=db, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy dự án: {project_id}")

    return await ProjectService.get_project_units(
        db=db,
        project_id=project_id,
        status=status,
        bedrooms=bedrooms,
        block=block,
        page=page,
        page_size=page_size,
    )


# ── GET /projects/{id}/units/{unit_id} ─── Chi tiết căn hộ ────────────────
@router.get("/{project_id}/units/{unit_id}", response_model=ProjectUnitCard, summary="Chi tiết căn hộ")
async def get_unit_detail(
    project_id: str,
    unit_id: str,
    db: AsyncSession = Depends(get_db),
):
    unit = await ProjectService.get_unit_detail(db=db, project_id=project_id, unit_id=unit_id)
    if not unit:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy căn hộ: {unit_id}")
    return unit

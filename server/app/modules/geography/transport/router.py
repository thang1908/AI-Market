from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.shared.database import get_db
from app.modules.geography.domain.models import City, District
from app.modules.geography.schemas import CityResponse, CityDetailResponse, DistrictResponse
from app.modules.geography.seeds.hanoi_districts import seed_geography_data

router = APIRouter(prefix="/geography", tags=["Geography"])


@router.get(
    "/cities",
    response_model=List[CityResponse],
    summary="Danh sách Tỉnh / Thành phố",
    description="Lấy danh sách các tỉnh/thành phố đang hoạt động, sắp xếp theo thứ tự hiển thị.",
)
async def list_cities(
    is_active: Optional[bool] = Query(True, description="Lọc theo trạng thái hoạt động"),
    db: AsyncSession = Depends(get_db),
):
    query = select(City).order_by(City.display_order)
    if is_active is not None:
        query = query.where(City.is_active == is_active)
    result = await db.execute(query)
    cities = result.scalars().all()
    return cities


@router.get(
    "/cities/{city_id}",
    response_model=CityDetailResponse,
    summary="Chi tiết Tỉnh / Thành phố",
    description="Lấy thông tin chi tiết một tỉnh/thành phố kèm danh sách toàn bộ quận/huyện trực thuộc.",
)
async def get_city(
    city_id: str,
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(City)
        .where(City.id == city_id.upper())
        .options(selectinload(City.districts))
    )
    result = await db.execute(query)
    city = result.scalar_one_or_none()
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy tỉnh/thành phố với mã '{city_id}'",
        )
    return city


@router.get(
    "/cities/{city_id}/districts",
    response_model=List[DistrictResponse],
    summary="Danh sách Quận / Huyện theo Tỉnh Thành",
    description="Lấy danh sách các quận/huyện trực thuộc tỉnh/thành phố, sắp xếp theo thứ tự ưu tiên (nội thành trước).",
)
async def list_districts_by_city(
    city_id: str,
    is_active: Optional[bool] = Query(True, description="Lọc theo trạng thái hoạt động"),
    db: AsyncSession = Depends(get_db),
):
    # Kiểm tra thành phố tồn tại
    city_check = await db.execute(select(City.id).where(City.id == city_id.upper()))
    if not city_check.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy tỉnh/thành phố với mã '{city_id}'",
        )

    query = (
        select(District)
        .where(District.city_id == city_id.upper())
        .order_by(District.display_order)
    )
    if is_active is not None:
        query = query.where(District.is_active == is_active)

    result = await db.execute(query)
    districts = result.scalars().all()
    return districts


@router.post(
    "/seed",
    summary="Nạp dữ liệu mẫu Địa lý",
    description="Tự động nạp dữ liệu Tỉnh/Thành phố và 30 Quận/Huyện Hà Nội nếu chưa có trong DB.",
    status_code=status.HTTP_200_OK,
)
async def trigger_geography_seed(
    db: AsyncSession = Depends(get_db),
):
    count = await seed_geography_data(db)
    return {
        "status": "success",
        "message": f"Đã nạp thành công {count} bản ghi địa lý mới vào database.",
    }

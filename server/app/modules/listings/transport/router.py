"""
Router FastAPI cho Module Listings.
Endpoints: danh sách, chi tiết, tin nổi bật, thống kê thị trường.
"""
import math
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.database import get_db
from app.modules.listings.service.listing_service import listing_service
from app.modules.listings.schemas.listing_schemas import (
    ListingCard,
    ListingDetail,
    PaginatedListings,
    MarketSummary,
    PriceDistribution,
)

router = APIRouter(prefix="/listings", tags=["Listings"])


@router.get(
    "",
    response_model=PaginatedListings,
    summary="Danh sách tin đăng BĐS với lọc đa tiêu chí",
    description=(
        "Tìm kiếm và lọc tin đăng BĐS theo: mode, thành phố, quận, loại hình, "
        "khoảng giá, diện tích, số phòng ngủ, và từ khóa tự do. Hỗ trợ sắp xếp và phân trang."
    ),
)
async def list_listings(
    # ── Bộ lọc chính ──
    mode: Optional[str] = Query(None, description="Loại giao dịch: 'sale' hoặc 'rent'"),
    city_id: Optional[str] = Query(None, description="Mã tỉnh/thành, vd: 'HN', 'HCM'"),
    district_ids: Optional[str] = Query(None, description="Danh sách mã quận, phân cách bởi dấu phẩy. Vd: 'HN_001,HN_003'"),
    property_types: Optional[str] = Query(None, description="Loại hình BĐS phân cách bởi dấu phẩy. Vd: 'Căn hộ,Biệt thự'"),
    # ── Khoảng giá ──
    min_price: Optional[int] = Query(None, description="Giá tối thiểu (VND)"),
    max_price: Optional[int] = Query(None, description="Giá tối đa (VND)"),
    # ── Diện tích ──
    min_area: Optional[float] = Query(None, description="Diện tích tối thiểu (m²)"),
    max_area: Optional[float] = Query(None, description="Diện tích tối đa (m²)"),
    # ── Phòng ngủ ──
    bedrooms: Optional[str] = Query(None, description="Số phòng ngủ: 'Studio', '1PN', '2PN', '3PN', '4PN+'"),
    # ── Tìm kiếm ──
    search: Optional[str] = Query(None, description="Từ khóa tìm kiếm tự do (title, address, description)"),
    # ── Sắp xếp ──
    sort_by: str = Query(
        "latest",
        description="Sắp xếp: 'latest' | 'price_asc' | 'price_desc' | 'area_desc' | 'price_per_m2_asc' | 'featured'"
    ),
    # ── Phân trang ──
    page: int = Query(1, ge=1, description="Trang hiện tại (bắt đầu từ 1)"),
    page_size: int = Query(12, ge=1, le=50, description="Số tin mỗi trang (tối đa 50)"),
    db: AsyncSession = Depends(get_db),
):
    # Parse danh sách từ chuỗi phân cách dấu phẩy
    district_ids_list = [d.strip() for d in district_ids.split(",")] if district_ids else None
    property_types_list = [p.strip() for p in property_types.split(",")] if property_types else None

    items, total = await listing_service.get_listings(
        db,
        mode=mode,
        city_id=city_id,
        district_ids=district_ids_list,
        property_types=property_types_list,
        min_price=min_price,
        max_price=max_price,
        min_area=min_area,
        max_area=max_area,
        bedrooms=bedrooms,
        search=search,
        sort_by=sort_by,
        page=page,
        page_size=page_size,
    )

    return PaginatedListings(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 0,
    )


@router.get(
    "/featured",
    response_model=List[ListingCard],
    summary="Danh sách tin đăng nổi bật",
    description="Lấy các tin đăng được đánh dấu nổi bật (VIP), dùng cho banner và section homepage.",
)
async def get_featured_listings(
    limit: int = Query(8, ge=1, le=20, description="Số lượng tin nổi bật tối đa"),
    db: AsyncSession = Depends(get_db),
):
    items = await listing_service.get_featured_listings(db, limit=limit)
    return items


@router.get(
    "/stats/summary",
    response_model=MarketSummary,
    summary="Thống kê tổng quan thị trường BĐS",
    description=(
        "Tổng số tin, phân bổ mua/thuê, giá trung bình, diện tích trung bình, "
        "top quận/huyện theo số lượng tin đăng."
    ),
)
async def get_market_summary(
    city_id: Optional[str] = Query(None, description="Lọc thống kê theo tỉnh/thành phố"),
    db: AsyncSession = Depends(get_db),
):
    return await listing_service.get_market_summary(db, city_id=city_id)


@router.get(
    "/stats/price-distribution",
    response_model=List[dict],
    summary="Phân bổ tin đăng theo khoảng giá",
    description="Thống kê số tin đăng theo từng khoảng giá (dùng cho biểu đồ cột).",
)
async def get_price_distribution(
    city_id: Optional[str] = Query(None, description="Lọc theo tỉnh/thành phố"),
    mode: str = Query("sale", description="Loại giao dịch: 'sale' hoặc 'rent'"),
    db: AsyncSession = Depends(get_db),
):
    return await listing_service.get_price_distribution(db, city_id=city_id, mode=mode)


@router.get(
    "/{listing_id}",
    response_model=ListingDetail,
    summary="Chi tiết tin đăng BĐS",
    description="Lấy toàn bộ thông tin chi tiết của một tin đăng theo UUID.",
)
async def get_listing_detail(
    listing_id: str,
    db: AsyncSession = Depends(get_db),
):
    listing = await listing_service.get_listing_by_id(db, listing_id)
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy tin đăng với id={listing_id}",
        )
    return listing

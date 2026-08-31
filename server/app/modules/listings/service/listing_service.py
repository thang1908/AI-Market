"""
Service layer cho Module Listings.
Business logic: query builder, filter, sort, pagination, stats.
"""
import math
from typing import List, Optional, Tuple

from sqlalchemy import func, select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.listings.domain.models import Listing


class ListingService:
    """Service xử lý logic tìm kiếm, lọc, phân trang và thống kê Listings."""

    async def get_listings(
        self,
        db: AsyncSession,
        *,
        mode: Optional[str] = None,
        city_id: Optional[str] = None,
        district_ids: Optional[List[str]] = None,
        property_types: Optional[List[str]] = None,
        min_price: Optional[int] = None,
        max_price: Optional[int] = None,
        min_area: Optional[float] = None,
        max_area: Optional[float] = None,
        bedrooms: Optional[str] = None,
        status: str = "active",
        search: Optional[str] = None,
        sort_by: str = "latest",
        page: int = 1,
        page_size: int = 12,
    ) -> Tuple[List[Listing], int]:
        """
        Truy vấn danh sách listings với lọc đa tiêu chí và phân trang.
        Returns: (items, total_count)
        """
        query = select(Listing).where(Listing.status == status)

        # ── Lọc theo mode (sale / rent) ──
        if mode:
            query = query.where(Listing.mode == mode)

        # ── Lọc theo tỉnh thành ──
        if city_id:
            query = query.where(Listing.city_id == city_id)

        # ── Lọc theo nhiều quận/huyện (Hỗ trợ cả ID 'HN_005', tên đầy đủ 'Quận Cầu Giấy', 'Huyện Gia Lâm' hoặc tên ngắn 'Cầu Giấy') ──
        if district_ids:
            from app.modules.geography.domain.models import District
            name_conditions = []
            for d in district_ids:
                d_clean = d.strip()
                if not d_clean:
                    continue
                name_conditions.append(District.id == d_clean)
                name_conditions.append(District.name.ilike(f"%{d_clean}%"))

            if name_conditions:
                matching_districts_subquery = select(District.id).where(or_(*name_conditions))
                query = query.where(Listing.district_id.in_(matching_districts_subquery))

        # ── Lọc theo loại hình BĐS ──
        if property_types:
            query = query.where(Listing.property_type.in_(property_types))

        # ── Lọc theo khoảng giá ──
        if min_price is not None:
            query = query.where(Listing.price >= min_price)
        if max_price is not None:
            query = query.where(Listing.price <= max_price)

        # ── Lọc theo diện tích ──
        if min_area is not None:
            query = query.where(Listing.area >= min_area)
        if max_area is not None:
            query = query.where(Listing.area <= max_area)

        # ── Lọc theo số phòng ngủ ──
        if bedrooms:
            if bedrooms == "Studio":
                query = query.where(Listing.bedrooms == 0)
            elif bedrooms.endswith("+") or bedrooms.endswith("PN+"):
                # vd: "4PN+" → bedrooms >= 4
                num = int(bedrooms.replace("PN+", "").replace("+", ""))
                query = query.where(Listing.bedrooms >= num)
            else:
                # vd: "2PN" → bedrooms == 2
                num_str = bedrooms.replace("PN", "")
                try:
                    num = int(num_str)
                    query = query.where(Listing.bedrooms == num)
                except ValueError:
                    pass

        # ── Tìm kiếm full-text (title + address) ──
        if search and search.strip():
            search_term = f"%{search.strip()}%"
            query = query.where(
                or_(
                    Listing.title.ilike(search_term),
                    Listing.address.ilike(search_term),
                    Listing.description.ilike(search_term),
                )
            )

        # ── Đếm tổng (cho phân trang) ──
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        # ── Sắp xếp ──
        if sort_by == "price_asc":
            query = query.order_by(Listing.price.asc())
        elif sort_by == "price_desc":
            query = query.order_by(Listing.price.desc())
        elif sort_by == "area_desc":
            query = query.order_by(Listing.area.desc())
        elif sort_by == "price_per_m2_asc":
            query = query.order_by((Listing.price / Listing.area).asc())
        elif sort_by == "featured":
            query = query.order_by(Listing.is_featured.desc(), Listing.created_at.desc())
        else:  # latest
            query = query.order_by(Listing.created_at.desc())

        # ── Phân trang ──
        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

        result = await db.execute(query)
        items = result.scalars().all()

        return items, total

    async def get_listing_by_id(
        self,
        db: AsyncSession,
        listing_id: str,
    ) -> Optional[Listing]:
        """Lấy chi tiết một tin đăng theo ID."""
        result = await db.execute(
            select(Listing).where(Listing.id == listing_id)
        )
        return result.scalar_one_or_none()

    async def get_featured_listings(
        self,
        db: AsyncSession,
        limit: int = 8,
    ) -> List[Listing]:
        """Lấy danh sách tin đăng nổi bật."""
        result = await db.execute(
            select(Listing)
            .where(Listing.is_featured == True, Listing.status == "active")  # noqa: E712
            .order_by(Listing.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()

    async def get_market_summary(
        self,
        db: AsyncSession,
        city_id: Optional[str] = None,
    ) -> dict:
        """Thống kê tổng quan thị trường."""
        base = select(Listing).where(Listing.status == "active")
        if city_id:
            base = base.where(Listing.city_id == city_id)

        # Tổng số tin
        total_res = await db.execute(
            select(func.count()).select_from(base.subquery())
        )
        total = total_res.scalar_one()

        # Bán / Thuê
        sale_res = await db.execute(
            select(func.count()).select_from(
                base.where(Listing.mode == "sale").subquery()
            )
        )
        total_sale = sale_res.scalar_one()

        # Giá trung bình bán / thuê
        avg_sale_res = await db.execute(
            select(func.avg(Listing.price)).where(
                Listing.status == "active",
                Listing.mode == "sale",
                *([Listing.city_id == city_id] if city_id else []),
            )
        )
        avg_price_sale = float(avg_sale_res.scalar_one() or 0)

        avg_rent_res = await db.execute(
            select(func.avg(Listing.price)).where(
                Listing.status == "active",
                Listing.mode == "rent",
                *([Listing.city_id == city_id] if city_id else []),
            )
        )
        avg_price_rent = float(avg_rent_res.scalar_one() or 0)

        # Diện tích trung bình
        avg_area_res = await db.execute(
            select(func.avg(Listing.area)).select_from(base.subquery())
        )
        avg_area = float(avg_area_res.scalar_one() or 0)

        # Top quận huyện
        from app.modules.geography.domain.models import District
        top_res = await db.execute(
            select(
                District.id,
                District.name,
                func.count(Listing.id).label("count"),
                func.avg(Listing.price).label("avg_price"),
                func.min(Listing.price).label("min_price"),
                func.max(Listing.price).label("max_price"),
            )
            .join(Listing, Listing.district_id == District.id)
            .where(Listing.status == "active")
            .group_by(District.id, District.name)
            .order_by(func.count(Listing.id).desc())
            .limit(10)
        )
        top_districts = [
            {
                "district_id": row.id,
                "district_name": row.name,
                "count": row.count,
                "avg_price": float(row.avg_price or 0),
                "min_price": row.min_price,
                "max_price": row.max_price,
            }
            for row in top_res.all()
        ]

        return {
            "total_listings": total,
            "total_sale": total_sale,
            "total_rent": total - total_sale,
            "avg_price_sale": avg_price_sale,
            "avg_price_rent": avg_price_rent,
            "avg_area": avg_area,
            "top_districts": top_districts,
        }

    async def get_price_distribution(
        self,
        db: AsyncSession,
        city_id: Optional[str] = None,
        mode: str = "sale",
    ) -> list:
        """Phân bổ tin đăng theo khoảng giá."""
        if mode == "sale":
            ranges = [
                ("< 3 tỷ", 0, 3_000_000_000),
                ("3–5 tỷ", 3_000_000_000, 5_000_000_000),
                ("5–7 tỷ", 5_000_000_000, 7_000_000_000),
                ("7–10 tỷ", 7_000_000_000, 10_000_000_000),
                ("10–20 tỷ", 10_000_000_000, 20_000_000_000),
                ("> 20 tỷ", 20_000_000_000, None),
            ]
        else:
            ranges = [
                ("< 10 triệu", 0, 10_000_000),
                ("10–20 triệu", 10_000_000, 20_000_000),
                ("20–30 triệu", 20_000_000, 30_000_000),
                ("30–50 triệu", 30_000_000, 50_000_000),
                ("> 50 triệu", 50_000_000, None),
            ]

        distribution = []
        for label, min_p, max_p in ranges:
            q = select(func.count(Listing.id)).where(
                Listing.status == "active",
                Listing.mode == mode,
                Listing.price >= min_p,
            )
            if city_id:
                q = q.where(Listing.city_id == city_id)
            if max_p is not None:
                q = q.where(Listing.price < max_p)
            res = await db.execute(q)
            distribution.append({"range": label, "count": res.scalar_one()})

        return distribution


# Singleton service instance
listing_service = ListingService()

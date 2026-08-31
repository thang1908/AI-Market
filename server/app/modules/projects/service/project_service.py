"""
ProjectService — Business logic cho module Projects.
Xử lý query, filter, phân trang và thống kê dự án BĐS sơ cấp.
"""
import math
from typing import Optional

from sqlalchemy import func, select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.projects.domain.models import Project, ProjectUnit


class ProjectService:

    # ── Danh sách dự án có filter + phân trang ─────────────────────────────
    @staticmethod
    async def get_projects(
        db: AsyncSession,
        city_id: Optional[str] = None,
        district_id: Optional[str] = None,
        property_type: Optional[str] = None,
        status: Optional[str] = None,
        min_price: Optional[int] = None,
        max_price: Optional[int] = None,
        is_featured: Optional[bool] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 12,
    ) -> dict:
        conditions = [Project.is_active == True]  # noqa: E712

        if city_id:
            conditions.append(Project.city_id == city_id)
        if district_id:
            from app.modules.geography.domain.models import District
            d_clean = district_id.strip()
            if d_clean:
                matching_districts_subquery = select(District.id).where(
                    or_(
                        District.id == d_clean,
                        District.name.ilike(f"%{d_clean}%"),
                    )
                )
                conditions.append(Project.district_id.in_(matching_districts_subquery))
        if property_type:
            types = [t.strip() for t in property_type.split(",")]
            conditions.append(Project.property_type.in_(types))
        if status:
            statuses = [s.strip() for s in status.split(",")]
            conditions.append(Project.status.in_(statuses))
        if min_price is not None:
            conditions.append(
                or_(Project.price_from >= min_price, Project.price_from == None)  # noqa: E711
            )
        if max_price is not None:
            conditions.append(
                or_(Project.price_from <= max_price, Project.price_from == None)  # noqa: E711
            )
        if is_featured is not None:
            conditions.append(Project.is_featured == is_featured)
        if search:
            q = f"%{search}%"
            conditions.append(
                or_(
                    Project.name.ilike(q),
                    Project.developer.ilike(q),
                    Project.address.ilike(q),
                )
            )

        where_clause = and_(*conditions)

        # Đếm tổng
        count_q = select(func.count()).select_from(Project).where(where_clause)
        total = (await db.scalar(count_q)) or 0

        # Lấy data
        offset = (page - 1) * page_size
        data_q = (
            select(Project)
            .where(where_clause)
            .order_by(Project.is_featured.desc(), Project.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        result = await db.execute(data_q)
        items = result.scalars().all()

        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": max(1, math.ceil(total / page_size)),
        }

    # ── Dự án nổi bật ──────────────────────────────────────────────────────
    @staticmethod
    async def get_featured_projects(
        db: AsyncSession,
        limit: int = 6,
        city_id: Optional[str] = None,
    ) -> list:
        conditions = [
            Project.is_active == True,  # noqa: E712
            Project.is_featured == True,  # noqa: E712
        ]
        if city_id:
            conditions.append(Project.city_id == city_id)

        q = (
            select(Project)
            .where(and_(*conditions))
            .order_by(Project.created_at.desc())
            .limit(limit)
        )
        result = await db.execute(q)
        return result.scalars().all()

    # ── Chi tiết dự án ─────────────────────────────────────────────────────
    @staticmethod
    async def get_project_detail(
        db: AsyncSession,
        project_id: str,
    ) -> Optional[Project]:
        q = select(Project).where(
            Project.id == project_id,
            Project.is_active == True,  # noqa: E712
        )
        return await db.scalar(q)

    # ── Danh sách căn hộ của một dự án ────────────────────────────────────
    @staticmethod
    async def get_project_units(
        db: AsyncSession,
        project_id: str,
        status: Optional[str] = None,
        bedrooms: Optional[int] = None,
        block: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> dict:
        conditions = [ProjectUnit.project_id == project_id]

        if status:
            conditions.append(ProjectUnit.status == status)
        if bedrooms is not None:
            conditions.append(ProjectUnit.bedrooms == bedrooms)
        if block:
            conditions.append(ProjectUnit.block == block)

        where_clause = and_(*conditions)

        count_q = select(func.count()).select_from(ProjectUnit).where(where_clause)
        total = (await db.scalar(count_q)) or 0

        offset = (page - 1) * page_size
        data_q = (
            select(ProjectUnit)
            .where(where_clause)
            .order_by(ProjectUnit.block, ProjectUnit.floor, ProjectUnit.unit_code)
            .offset(offset)
            .limit(page_size)
        )
        result = await db.execute(data_q)
        items = result.scalars().all()

        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": max(1, math.ceil(total / page_size)),
        }

    # ── Chi tiết một căn hộ ────────────────────────────────────────────────
    @staticmethod
    async def get_unit_detail(
        db: AsyncSession,
        project_id: str,
        unit_id: str,
    ) -> Optional[ProjectUnit]:
        q = select(ProjectUnit).where(
            ProjectUnit.project_id == project_id,
            ProjectUnit.id == unit_id,
        )
        return await db.scalar(q)

    # ── Thống kê tổng quan ─────────────────────────────────────────────────
    @staticmethod
    async def get_summary(
        db: AsyncSession,
        city_id: Optional[str] = None,
    ) -> dict:
        conditions = [Project.is_active == True]  # noqa: E712
        if city_id:
            conditions.append(Project.city_id == city_id)
        where_clause = and_(*conditions)

        total = (await db.scalar(
            select(func.count()).select_from(Project).where(where_clause)
        )) or 0

        # Phân bổ theo status
        status_q = (
            select(Project.status, func.count().label("count"))
            .where(where_clause)
            .group_by(Project.status)
            .order_by(func.count().desc())
        )
        status_rows = (await db.execute(status_q)).all()

        # Phân bổ theo city
        city_q = (
            select(Project.city_id, func.count().label("count"))
            .where(Project.is_active == True)  # noqa: E712
            .group_by(Project.city_id)
            .order_by(func.count().desc())
        )
        city_rows = (await db.execute(city_q)).all()

        # Tổng units
        unit_cond = []
        if city_id:
            unit_cond.append(
                ProjectUnit.project_id.in_(
                    select(Project.id).where(where_clause)
                )
            )
        total_units = (await db.scalar(
            select(func.count()).select_from(ProjectUnit).where(
                and_(*unit_cond) if unit_cond else True  # noqa: E712
            )
        )) or 0

        available_units = (await db.scalar(
            select(func.count()).select_from(ProjectUnit).where(
                ProjectUnit.status == "available"
            )
        )) or 0

        return {
            "total_projects": total,
            "total_active": sum(r.count for r in status_rows if r.status == "Đang mở bán"),
            "total_units": total_units,
            "total_available_units": available_units,
            "by_status": [{"status": r.status, "count": r.count} for r in status_rows],
            "by_city": [{"city_id": r.city_id, "count": r.count} for r in city_rows],
        }

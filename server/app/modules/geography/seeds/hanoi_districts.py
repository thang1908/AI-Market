import json
import os
from typing import Any, Dict, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.geography.domain.models import City, District

SEED_DATA_PATH = os.path.join(
    os.path.dirname(__file__), "vietnam_administrative_data.json"
)


def load_vietnam_administrative_data() -> List[Dict[str, Any]]:
    """Đọc dữ liệu 63 tỉnh thành và 696 quận/huyện từ file JSON chuẩn hóa."""
    if not os.path.exists(SEED_DATA_PATH):
        raise FileNotFoundError(f"Không tìm thấy file dữ liệu: {SEED_DATA_PATH}")
    with open(SEED_DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


async def seed_geography_data(session: AsyncSession) -> int:
    """Nạp toàn bộ 63 Tỉnh/Thành phố và 696 Quận/Huyện của Việt Nam vào PostgreSQL."""
    from sqlalchemy import delete

    provinces_data = load_vietnam_administrative_data()
    
    # Xóa sạch dữ liệu cũ để tránh duplicate
    await session.execute(delete(District))
    await session.execute(delete(City))
    await session.flush()

    seeded_count = 0

    for p in provinces_data:
        city = City(
            id=p["id"],
            name=p["name"],
            slug=p["slug"],
            display_order=p["display_order"],
            is_active=p.get("is_active", True),
        )
        session.add(city)
        seeded_count += 1
        await session.flush()

        for d in p.get("districts", []):
            district = District(
                id=d["id"],
                city_id=p["id"],
                name=d["name"],
                slug=d["slug"],
                display_order=d["display_order"],
                is_active=d.get("is_active", True),
            )
            session.add(district)
            seeded_count += 1

    await session.commit()
    return seeded_count

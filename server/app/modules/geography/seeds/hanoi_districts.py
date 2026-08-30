from typing import List, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.geography.domain.models import City, District

CITIES_DATA = [
    {
        "id": "HN",
        "name": "Hà Nội",
        "slug": "ha-noi",
        "display_order": 1,
        "is_active": True,
    },
    {
        "id": "HCM",
        "name": "TP. Hồ Chí Minh",
        "slug": "ho-chi-minh",
        "display_order": 2,
        "is_active": True,
    },
]

HANOI_DISTRICTS_DATA: List[Dict[str, Any]] = [
    # Các quận nội thành trung tâm (Ưu tiên hiển thị đầu tiên)
    {"id": "HN_TH", "name": "Tây Hồ", "slug": "tay-ho", "display_order": 1},
    {"id": "HN_CG", "name": "Cầu Giấy", "slug": "cau-giay", "display_order": 2},
    {"id": "HN_NTL", "name": "Nam Từ Liêm", "slug": "nam-tu-liem", "display_order": 3},
    {"id": "HN_LB", "name": "Long Biên", "slug": "long-bien", "display_order": 4},
    {"id": "HN_HD", "name": "Hà Đông", "slug": "ha-dong", "display_order": 5},
    {"id": "HN_GL", "name": "Gia Lâm", "slug": "gia-lam", "display_order": 6},
    {"id": "HN_BD", "name": "Ba Đình", "slug": "ba-dinh", "display_order": 7},
    {"id": "HN_HM", "name": "Hoàng Mai", "slug": "hoang-mai", "display_order": 8},
    {"id": "HN_TX", "name": "Thanh Xuân", "slug": "thanh-xuan", "display_order": 9},
    {"id": "HN_BTL", "name": "Bắc Từ Liêm", "slug": "bac-tu-liem", "display_order": 10},
    {"id": "HN_DD", "name": "Đống Đa", "slug": "dong-da", "display_order": 11},
    {"id": "HN_HBT", "name": "Hai Bà Trưng", "slug": "hai-ba-trung", "display_order": 12},
    {"id": "HN_HK", "name": "Hoàn Kiếm", "slug": "hoan-kiem", "display_order": 13},
    # Các quận huyện mở rộng và ngoại thành
    {"id": "HN_TT", "name": "Thanh Trì", "slug": "thanh-tri", "display_order": 14},
    {"id": "HN_DA", "name": "Đông Anh", "slug": "dong-anh", "display_order": 15},
    {"id": "HN_HDu", "name": "Hoài Đức", "slug": "hoai-duc", "display_order": 16},
    {"id": "HN_ML", "name": "Mê Linh", "slug": "me-linh", "display_order": 17},
    {"id": "HN_SS", "name": "Sóc Sơn", "slug": "soc-son", "display_order": 18},
    {"id": "HN_DP", "name": "Đan Phượng", "slug": "dan-phuong", "display_order": 19},
    {"id": "HN_QO", "name": "Quốc Oai", "slug": "quoc-oai", "display_order": 20},
    {"id": "HN_TTn", "name": "Thạch Thất", "slug": "thach-that", "display_order": 21},
    {"id": "HN_CM", "name": "Chương Mỹ", "slug": "chuong-my", "display_order": 22},
    {"id": "HN_TO", "name": "Thanh Oai", "slug": "thanh-oai", "display_order": 23},
    {"id": "HN_TTi", "name": "Thường Tín", "slug": "thuong-tin", "display_order": 24},
    {"id": "HN_PX", "name": "Phú Xuyên", "slug": "phu-xuyen", "display_order": 25},
    {"id": "HN_UH", "name": "Ứng Hòa", "slug": "ung-hoa", "display_order": 26},
    {"id": "HN_MD", "name": "Mỹ Đức", "slug": "my-duc", "display_order": 27},
    {"id": "HN_PT", "name": "Phúc Thọ", "slug": "phuc-tho", "display_order": 28},
    {"id": "HN_BV", "name": "Ba Vì", "slug": "ba-vi", "display_order": 29},
    {"id": "HN_ST", "name": "Sơn Tây", "slug": "son-tay", "display_order": 30},
]


async def seed_geography_data(session: AsyncSession) -> int:
    """Nạp dữ liệu tỉnh thành và 30 quận/huyện Hà Nội nếu chưa có."""
    seeded_count = 0

    # 1. Seed Cities
    for city_data in CITIES_DATA:
        result = await session.execute(select(City).where(City.id == city_data["id"]))
        existing_city = result.scalar_one_or_none()
        if not existing_city:
            city = City(
                id=city_data["id"],
                name=city_data["name"],
                slug=city_data["slug"],
                display_order=city_data["display_order"],
                is_active=city_data["is_active"],
            )
            session.add(city)
            seeded_count += 1

    await session.flush()

    # 2. Seed 30 Districts of Hanoi
    for district_data in HANOI_DISTRICTS_DATA:
        result = await session.execute(
            select(District).where(District.id == district_data["id"])
        )
        existing_district = result.scalar_one_or_none()
        if not existing_district:
            district = District(
                id=district_data["id"],
                city_id="HN",
                name=district_data["name"],
                slug=district_data["slug"],
                display_order=district_data["display_order"],
                is_active=True,
            )
            session.add(district)
            seeded_count += 1

    await session.commit()
    return seeded_count

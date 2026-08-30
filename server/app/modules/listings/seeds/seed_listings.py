"""
Seed script: Nạp dữ liệu tin đăng BĐS mẫu vào PostgreSQL.
Chạy: cd server && python -m app.modules.listings.seeds.seed_listings
Script idempotent: chạy nhiều lần không bị duplicate.
"""
import asyncio
import json
import sys
from pathlib import Path

# Thêm thư mục server vào sys.path
sys.path.insert(0, str(Path(__file__).resolve().parents[5]))

from sqlalchemy import select, text
from app.shared.database import get_session_factory, get_engine
from app.modules.listings.domain.models import Listing


async def seed_listings() -> None:
    """Nạp dữ liệu tin đăng BĐS từ JSON vào PostgreSQL."""
    seed_file = Path(__file__).parent / "listings_seed_data.json"
    with open(seed_file, "r", encoding="utf-8") as f:
        listings_data = json.load(f)

    session_factory = get_session_factory()

    # Kiểm tra danh sách district_id hợp lệ trong DB
    async with session_factory() as session:
        result = await session.execute(text("SELECT id FROM districts"))
        valid_district_ids = {row[0] for row in result.fetchall()}

        result2 = await session.execute(text("SELECT id FROM cities"))
        valid_city_ids = {row[0] for row in result2.fetchall()}

    created_count = 0
    skipped_count = 0
    invalid_count = 0

    async with session_factory() as session:
        for data in listings_data:
            # Bỏ qua nếu district_id không hợp lệ
            if data["district_id"] not in valid_district_ids:
                print(f"⚠️  Bỏ qua '{data['title'][:40]}' — district_id '{data['district_id']}' không tồn tại trong DB")
                invalid_count += 1
                continue

            # Bỏ qua nếu city_id không hợp lệ
            if data["city_id"] not in valid_city_ids:
                print(f"⚠️  Bỏ qua '{data['title'][:40]}' — city_id '{data['city_id']}' không tồn tại")
                invalid_count += 1
                continue

            # Kiểm tra đã tồn tại chưa (dựa vào title + district_id)
            result = await session.execute(
                select(Listing).where(
                    Listing.title == data["title"],
                    Listing.district_id == data["district_id"],
                )
            )
            existing = result.scalar_one_or_none()

            if existing:
                skipped_count += 1
                continue

            listing = Listing(
                title=data["title"],
                description=data.get("description"),
                mode=data["mode"],
                property_type=data["property_type"],
                price=data["price"],
                price_unit=data["price_unit"],
                area=data["area"],
                bedrooms=data.get("bedrooms"),
                bathrooms=data.get("bathrooms"),
                floor=data.get("floor"),
                direction=data.get("direction"),
                legal_status=data.get("legal_status"),
                furnishing=data.get("furnishing"),
                address=data["address"],
                city_id=data["city_id"],
                district_id=data["district_id"],
                latitude=data.get("latitude"),
                longitude=data.get("longitude"),
                images=data.get("images", []),
                contact_name=data.get("contact_name"),
                contact_phone=data.get("contact_phone"),
                is_featured=data.get("is_featured", False),
                status=data.get("status", "active"),
            )
            session.add(listing)
            created_count += 1

        await session.commit()

    print(f"\n✅ Seed listings hoàn tất!")
    print(f"   📦 Đã tạo mới : {created_count} tin đăng")
    print(f"   ⏩ Bỏ qua (đã có): {skipped_count} tin đăng")
    if invalid_count > 0:
        print(f"   ⚠️  Không hợp lệ: {invalid_count} tin đăng (district_id không tồn tại)")


if __name__ == "__main__":
    asyncio.run(seed_listings())

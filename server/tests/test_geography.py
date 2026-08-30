import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from app.main import app
from app.shared.database import Base, get_db
from app.modules.geography.seeds.hanoi_districts import seed_geography_data


@pytest.mark.asyncio
async def test_geography_endpoints_with_sqlite_mock():
    # 1. Setup in-memory SQLite DB
    test_engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    test_session_factory = async_sessionmaker(bind=test_engine, expire_on_commit=False)

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed data
    async with test_session_factory() as session:
        await seed_geography_data(session)

    # Override get_db dependency
    async def override_get_db():
        async with test_session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Test 1: GET /api/v1/geography/cities
        response = await ac.get("/api/v1/geography/cities")
        assert response.status_code == 200
        cities = response.json()
        assert len(cities) >= 2
        city_ids = [c["id"] for c in cities]
        assert "HN" in city_ids
        assert "HCM" in city_ids

        # Test 2: GET /api/v1/geography/cities/HN/districts
        response = await ac.get("/api/v1/geography/cities/HN/districts")
        assert response.status_code == 200
        districts = response.json()
        assert len(districts) == 30
        assert districts[0]["name"] == "Tây Hồ"
        assert districts[1]["name"] == "Cầu Giấy"

        # Test 3: GET /api/v1/geography/cities/HN (Detail with nested districts)
        response = await ac.get("/api/v1/geography/cities/HN")
        assert response.status_code == 200
        hn_detail = response.json()
        assert hn_detail["name"] == "Hà Nội"
        assert len(hn_detail["districts"]) == 30

        # Test 4: GET /api/v1/geography/cities/NON_EXISTENT/districts -> 404
        response = await ac.get("/api/v1/geography/cities/INVALID_CITY/districts")
        assert response.status_code == 404

    # Cleanup
    app.dependency_overrides.clear()
    await test_engine.dispose()

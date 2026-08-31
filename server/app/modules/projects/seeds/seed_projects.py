"""
Seed script — Nạp dữ liệu dự án BĐS sơ cấp vào PostgreSQL.
Idempotent: chạy nhiều lần không bị duplicate.

Cách chạy (từ thư mục gốc):
  PYTHONPATH=server server/.venv/bin/python server/app/modules/projects/seeds/seed_projects.py
"""
import asyncio
import json
import uuid
from pathlib import Path

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# ── Import models ──────────────────────────────────────────────────────────
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[5]))  # thêm server/ vào path

from app.modules.projects.domain.models import Project, ProjectUnit  # noqa: E402
import app.modules.geography.domain.models  # noqa: F401, E402  — cần để resolve FK

DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/market_bds"
SEED_FILE = Path(__file__).parent / "projects_seed_data.json"


async def seed_projects() -> None:
    engine = create_async_engine(DATABASE_URL, echo=False)
    AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    with open(SEED_FILE, encoding="utf-8") as f:
        projects_data: list[dict] = json.load(f)

    async with AsyncSessionLocal() as session:
        total_projects = 0
        total_units = 0
        skipped = 0

        for proj_data in projects_data:
            # Kiểm tra project đã tồn tại chưa
            existing = await session.scalar(
                select(Project).where(Project.id == proj_data["id"])
            )
            if existing:
                skipped += 1
                print(f"  ⏭  Bỏ qua (đã có): {proj_data['id']} — {proj_data['name']}")
                continue

            # Tách units ra khỏi project data
            units_data = proj_data.pop("units", [])

            # Tạo Project
            project = Project(**proj_data)
            session.add(project)
            await session.flush()  # để có project.id cho units

            # Tạo ProjectUnit
            for unit_data in units_data:
                unit = ProjectUnit(
                    id=uuid.uuid4(),
                    project_id=project.id,
                    **unit_data,
                )
                session.add(unit)
                total_units += 1

            total_projects += 1
            print(f"  ✅ Seeded: {project.id} — {project.name} ({len(units_data)} units)")

        await session.commit()

    await engine.dispose()

    print(f"\n{'─'*55}")
    print(f"🏗  Projects seeded : {total_projects}")
    print(f"🏠  Units seeded    : {total_units}")
    print(f"⏭  Đã bỏ qua      : {skipped}")
    print(f"{'─'*55}")


if __name__ == "__main__":
    asyncio.run(seed_projects())

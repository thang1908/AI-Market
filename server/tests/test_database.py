import pytest
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select

from app.shared.database import Base
from app.modules.identity.domain.models import User, UserRole


def test_base_metadata_contains_tables():
    """Kiểm tra Base.metadata đã đăng ký bảng users."""
    assert "users" in Base.metadata.tables
    users_table = Base.metadata.tables["users"]
    assert "id" in users_table.c
    assert "phone" in users_table.c
    assert "role" in users_table.c
    assert "created_at" in users_table.c
    assert "updated_at" in users_table.c


@pytest.mark.asyncio
async def test_async_session_crud_with_inmemory_db():
    """Kiểm tra AsyncSession tạo bảng, thêm User và truy vấn thành công."""
    test_engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    test_session_factory = async_sessionmaker(bind=test_engine, expire_on_commit=False)

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 1. Create user
    user_id = uuid.uuid4()
    async with test_session_factory() as session:
        user = User(
            id=user_id,
            phone="0988888888",
            full_name="Nguyễn Văn A",
            role=UserRole.USER,
            is_active=True,
        )
        session.add(user)
        await session.commit()

    # 2. Query user
    async with test_session_factory() as session:
        result = await session.execute(select(User).where(User.phone == "0988888888"))
        fetched_user = result.scalar_one_or_none()
        assert fetched_user is not None
        assert fetched_user.id == user_id
        assert fetched_user.full_name == "Nguyễn Văn A"
        assert fetched_user.role == UserRole.USER
        assert fetched_user.is_active is True
        assert fetched_user.created_at is not None

    await test_engine.dispose()

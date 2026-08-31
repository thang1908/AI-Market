"""create projects and project_units tables

Revision ID: 0004_create_projects
Revises: 0003_create_listings
Create Date: 2026-08-31 13:00:00.000000

Tạo 2 bảng:
- projects: dự án BĐS sơ cấp
- project_units: căn hộ / sản phẩm tồn kho của từng dự án
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

# revision identifiers
revision: str = "0004_create_projects"
down_revision: Union[str, None] = "0003_create_listings"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Bảng projects ──────────────────────────────────────────
    op.create_table(
        "projects",
        sa.Column("id", sa.String(30), primary_key=True, comment="Mã dự án slug"),
        sa.Column("name", sa.String(300), nullable=False, comment="Tên dự án"),
        sa.Column("developer", sa.String(200), nullable=False, comment="Chủ đầu tư"),
        sa.Column("description", sa.Text(), nullable=True, comment="Mô tả tổng quan"),
        sa.Column("property_type", sa.String(50), nullable=False, comment="Loại hình BĐS"),
        sa.Column("status", sa.String(30), nullable=False, default="Đang mở bán", comment="Trạng thái mở bán"),
        sa.Column("badge", sa.String(30), nullable=True, comment="Badge nổi bật"),
        # Giá
        sa.Column("price_from", sa.BigInteger(), nullable=True, comment="Giá từ (VND)"),
        sa.Column("price_per_m2_from", sa.BigInteger(), nullable=True, comment="Giá/m² từ (VND)"),
        sa.Column("price_per_m2_to", sa.BigInteger(), nullable=True, comment="Giá/m² đến (VND)"),
        sa.Column("available_units_count", sa.Integer(), nullable=True, default=0, comment="Số căn còn hàng"),
        # Địa lý
        sa.Column("address", sa.String(500), nullable=False, comment="Địa chỉ đầy đủ"),
        sa.Column("city_id", sa.String(10), sa.ForeignKey("cities.id", ondelete="CASCADE"), nullable=False),
        sa.Column("district_id", sa.String(20), sa.ForeignKey("districts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        # Media
        sa.Column("cover_image", sa.Text(), nullable=True, comment="URL ảnh bìa"),
        sa.Column("gallery", JSONB, nullable=True, comment="Array URL ảnh gallery"),
        # JSONB metadata
        sa.Column("overview", JSONB, nullable=True, comment="Tổng quan dự án"),
        sa.Column("legal", JSONB, nullable=True, comment="Pháp lý"),
        sa.Column("amenities", JSONB, nullable=True, comment="Tiện ích"),
        sa.Column("contact", JSONB, nullable=True, comment="Liên hệ CĐT"),
        # Flags
        sa.Column("is_featured", sa.Boolean(), nullable=False, default=False, comment="Dự án nổi bật"),
        sa.Column("is_active", sa.Boolean(), nullable=False, default=True, comment="Đang hoạt động"),
        # Timestamps (TimestampMixin)
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )

    # Indexes cho projects
    op.create_index("ix_projects_city_id", "projects", ["city_id"])
    op.create_index("ix_projects_district_id", "projects", ["district_id"])
    op.create_index("ix_projects_status", "projects", ["status"])
    op.create_index("ix_projects_property_type", "projects", ["property_type"])
    op.create_index("ix_projects_is_featured", "projects", ["is_featured"])
    op.create_index("ix_projects_is_active", "projects", ["is_active"])
    op.create_index("ix_projects_city_status", "projects", ["city_id", "status", "is_active"])

    # ── Bảng project_units ─────────────────────────────────────
    op.create_table(
        "project_units",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()"), comment="UUID căn hộ"),
        sa.Column("project_id", sa.String(30), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        # Định danh
        sa.Column("unit_code", sa.String(30), nullable=False, comment="Mã căn: A2-15-03"),
        sa.Column("block", sa.String(20), nullable=True, comment="Tòa / Block"),
        sa.Column("floor", sa.Integer(), nullable=True, comment="Tầng"),
        # Thông số
        sa.Column("area", sa.Float(), nullable=False, comment="Diện tích m²"),
        sa.Column("bedrooms", sa.Integer(), nullable=True),
        sa.Column("bathrooms", sa.Integer(), nullable=True),
        sa.Column("direction", sa.String(20), nullable=True, comment="Hướng"),
        sa.Column("view", sa.String(100), nullable=True, comment="View nhìn ra"),
        sa.Column("floor_plan_image", sa.Text(), nullable=True, comment="URL ảnh mặt bằng"),
        # Giá & trạng thái
        sa.Column("price", sa.BigInteger(), nullable=True, comment="Giá bán (VND)"),
        sa.Column("status", sa.String(20), nullable=False, default="available", comment="available | deposited | sold"),
        # Timestamps
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )

    # Indexes cho project_units
    op.create_index("ix_units_project_id", "project_units", ["project_id"])
    op.create_index("ix_units_status", "project_units", ["status"])
    op.create_index("ix_units_project_status", "project_units", ["project_id", "status"])
    op.create_index("ix_units_bedrooms", "project_units", ["bedrooms"])


def downgrade() -> None:
    # Xóa theo thứ tự: con trước, cha sau
    op.drop_index("ix_units_bedrooms", table_name="project_units")
    op.drop_index("ix_units_project_status", table_name="project_units")
    op.drop_index("ix_units_status", table_name="project_units")
    op.drop_index("ix_units_project_id", table_name="project_units")
    op.drop_table("project_units")

    op.drop_index("ix_projects_city_status", table_name="projects")
    op.drop_index("ix_projects_is_active", table_name="projects")
    op.drop_index("ix_projects_is_featured", table_name="projects")
    op.drop_index("ix_projects_property_type", table_name="projects")
    op.drop_index("ix_projects_status", table_name="projects")
    op.drop_index("ix_projects_district_id", table_name="projects")
    op.drop_index("ix_projects_city_id", table_name="projects")
    op.drop_table("projects")

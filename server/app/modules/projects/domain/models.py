"""
Module Projects — SQLAlchemy Models
Bảng `projects` lưu thông tin dự án BĐS sơ cấp.
Bảng `project_units` lưu căn hộ / sản phẩm tồn kho của từng dự án.
"""
import uuid
from typing import Optional

from sqlalchemy import (
    BigInteger,
    Boolean,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.shared.database import Base, TimestampMixin

# Import geography models để SQLAlchemy resolver nhận diện City / District
import app.modules.geography.domain.models  # noqa: F401


class Project(Base, TimestampMixin):
    """Dự án BĐS sơ cấp (căn hộ, biệt thự, shophouse...)."""

    __tablename__ = "projects"

    # ── Primary Key ────────────────────────────────────────────
    id: Mapped[str] = mapped_column(
        String(30),
        primary_key=True,
        comment="Mã dự án dạng slug, VD: 'PROJ-LUMI-HN'",
    )

    # ── Thông tin cơ bản ───────────────────────────────────────
    name: Mapped[str] = mapped_column(
        String(300),
        nullable=False,
        comment="Tên dự án",
    )
    developer: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
        comment="Tên chủ đầu tư",
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Mô tả tổng quan dự án",
    )
    property_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Loại hình: Căn hộ, Biệt thự, Shophouse, Nhà phố, Đất nền, Tổ hợp",
    )

    # ── Trạng thái ─────────────────────────────────────────────
    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="Đang mở bán",
        comment="Trạng thái: Sắp mở bán | Đang mở bán | Đang nhận booking | Đã bàn giao",
    )
    badge: Mapped[Optional[str]] = mapped_column(
        String(30),
        nullable=True,
        comment="Badge nổi bật: Hot | New | Sắp bàn giao | Limited",
    )

    # ── Giá ────────────────────────────────────────────────────
    price_from: Mapped[Optional[int]] = mapped_column(
        BigInteger,
        nullable=True,
        comment="Giá từ (VND) — giá thấp nhất trong dự án",
    )
    price_per_m2_from: Mapped[Optional[int]] = mapped_column(
        BigInteger,
        nullable=True,
        comment="Giá/m² thấp nhất (VND)",
    )
    price_per_m2_to: Mapped[Optional[int]] = mapped_column(
        BigInteger,
        nullable=True,
        comment="Giá/m² cao nhất (VND)",
    )
    available_units_count: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        default=0,
        comment="Số căn còn hàng hiện tại",
    )

    # ── Vị trí địa lý ──────────────────────────────────────────
    address: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        comment="Địa chỉ đầy đủ của dự án",
    )
    city_id: Mapped[str] = mapped_column(
        String(10),
        ForeignKey("cities.id", ondelete="CASCADE"),
        nullable=False,
        comment="FK → cities.id",
    )
    district_id: Mapped[str] = mapped_column(
        String(20),
        ForeignKey("districts.id", ondelete="CASCADE"),
        nullable=False,
        comment="FK → districts.id",
    )
    latitude: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        comment="Tọa độ GPS vĩ độ",
    )
    longitude: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        comment="Tọa độ GPS kinh độ",
    )

    # ── Ảnh & Media ────────────────────────────────────────────
    cover_image: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="URL ảnh bìa đại diện dự án",
    )
    gallery: Mapped[Optional[list]] = mapped_column(
        JSONB,
        nullable=True,
        default=list,
        comment="Danh sách URL ảnh gallery JSON array",
    )

    # ── Thông tin chi tiết dự án (JSONB) ───────────────────────
    overview: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
        comment="""Tổng quan: {
            scale, land_area, density, floors, blocks,
            handover_date, construction_progress
        }""",
    )
    legal: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
        comment="""Pháp lý: {
            ownership_type, permit_number, investor_license, notes
        }""",
    )
    amenities: Mapped[Optional[list]] = mapped_column(
        JSONB,
        nullable=True,
        default=list,
        comment="Tiện ích nội/ngoại khu: ['Hồ bơi', 'Gym', 'Công viên', ...]",
    )
    contact: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
        comment="Liên hệ CĐT: {name, phone, email, hotline}",
    )

    # ── Flags ──────────────────────────────────────────────────
    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="Dự án nổi bật — hiển thị widget AI tab",
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        comment="Dự án còn hiển thị trên app",
    )

    # ── Relationships ──────────────────────────────────────────
    city = relationship("City", lazy="joined")
    district = relationship("District", lazy="joined")
    units: Mapped[list["ProjectUnit"]] = relationship(
        "ProjectUnit",
        back_populates="project",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )

    # ── Indexes ────────────────────────────────────────────────
    __table_args__ = (
        Index("ix_projects_city_id", "city_id"),
        Index("ix_projects_district_id", "district_id"),
        Index("ix_projects_status", "status"),
        Index("ix_projects_property_type", "property_type"),
        Index("ix_projects_is_featured", "is_featured"),
        Index("ix_projects_is_active", "is_active"),
        Index("ix_projects_city_status", "city_id", "status", "is_active"),
    )

    def __repr__(self) -> str:
        return f"<Project id={self.id} name={self.name} status={self.status}>"


class ProjectUnit(Base, TimestampMixin):
    """Căn hộ / sản phẩm cụ thể trong một dự án BĐS sơ cấp."""

    __tablename__ = "project_units"

    # ── Primary Key ────────────────────────────────────────────
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        comment="UUID căn hộ",
    )

    # ── FK dự án ───────────────────────────────────────────────
    project_id: Mapped[str] = mapped_column(
        String(30),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        comment="FK → projects.id",
    )

    # ── Định danh căn hộ ───────────────────────────────────────
    unit_code: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        comment="Mã căn: 'A2-15-03' (Tòa A2, tầng 15, số 03)",
    )
    block: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
        comment="Tòa / Block: 'A', 'B', 'S1', 'The Sapphire'",
    )
    floor: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Tầng (số)",
    )

    # ── Thông số kỹ thuật ──────────────────────────────────────
    area: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        comment="Diện tích thông thủy (m²)",
    )
    bedrooms: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Số phòng ngủ",
    )
    bathrooms: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Số phòng tắm",
    )
    direction: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
        comment="Hướng ban công / cửa chính",
    )
    view: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        comment="View nhìn ra: Hồ Tây, Sân vườn, Nội khu, Thành phố",
    )
    floor_plan_image: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="URL ảnh mặt bằng căn hộ",
    )

    # ── Giá & Trạng thái ───────────────────────────────────────
    price: Mapped[Optional[int]] = mapped_column(
        BigInteger,
        nullable=True,
        comment="Giá bán (VND). NULL = giá theo thỏa thuận",
    )
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="available",
        comment="Trạng thái: available | deposited | sold",
    )

    # ── Relationship ───────────────────────────────────────────
    project: Mapped["Project"] = relationship("Project", back_populates="units")

    # ── Indexes ────────────────────────────────────────────────
    __table_args__ = (
        Index("ix_units_project_id", "project_id"),
        Index("ix_units_status", "status"),
        Index("ix_units_project_status", "project_id", "status"),
        Index("ix_units_bedrooms", "bedrooms"),
    )

    def __repr__(self) -> str:
        return f"<ProjectUnit {self.unit_code} project={self.project_id} status={self.status}>"

"""
Module Listings — SQLAlchemy Models
Bảng `listings` lưu trữ toàn bộ tin đăng bất động sản.
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


class Listing(Base, TimestampMixin):
    """Model tin đăng bất động sản."""

    __tablename__ = "listings"

    # ── Primary Key ──────────────────────────────────────────
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        comment="Mã tin đăng (UUID)",
    )

    # ── Thông tin cơ bản ─────────────────────────────────────
    title: Mapped[str] = mapped_column(
        String(300),
        nullable=False,
        comment="Tiêu đề tin đăng",
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Mô tả chi tiết bất động sản",
    )
    mode: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        comment="Loại giao dịch: 'sale' (Bán) hoặc 'rent' (Cho thuê)",
    )
    property_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Loại hình BĐS: Căn hộ, Nhà riêng, Biệt thự, Đất, Shophouse, Nhà phố, Khác",
    )

    # ── Giá & Diện tích ──────────────────────────────────────
    price: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        comment="Giá (VND). Bán: đơn vị đồng. Thuê: đơn vị đồng/tháng",
    )
    price_unit: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="VND",
        comment="Đơn vị hiển thị giá: 'tỷ', 'triệu/tháng'",
    )
    area: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        comment="Diện tích sử dụng (m²)",
    )

    # ── Thông số kỹ thuật ────────────────────────────────────
    bedrooms: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Số phòng ngủ (0 = Studio)",
    )
    bathrooms: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Số phòng tắm / WC",
    )
    floor: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
        comment="Tầng, vd: '12/25', 'Trệt'",
    )
    direction: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
        comment="Hướng nhà: Đông, Tây, Nam, Bắc, Đông Nam, Tây Bắc...",
    )
    legal_status: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
        comment="Pháp lý: Sổ đỏ, Sổ hồng, HĐMB, Đang chờ sổ",
    )
    furnishing: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
        comment="Nội thất: Full nội thất, Cơ bản, Nguyên bản",
    )

    # ── Vị trí địa lý ───────────────────────────────────────
    address: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        comment="Địa chỉ chi tiết",
    )
    city_id: Mapped[str] = mapped_column(
        String(10),
        ForeignKey("cities.id", ondelete="CASCADE"),
        nullable=False,
        comment="FK → cities.id (Tỉnh / Thành phố)",
    )
    district_id: Mapped[str] = mapped_column(
        String(20),
        ForeignKey("districts.id", ondelete="CASCADE"),
        nullable=False,
        comment="FK → districts.id (Quận / Huyện)",
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

    # ── Ảnh & Media ──────────────────────────────────────────
    images: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True,
        default=list,
        comment="Danh sách URL ảnh BĐS dạng JSON array",
    )

    # ── Liên hệ ──────────────────────────────────────────────
    contact_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        comment="Tên người liên hệ / môi giới",
    )
    contact_phone: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
        comment="Số điện thoại liên hệ",
    )

    # ── Trạng thái & Nổi bật ─────────────────────────────────
    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="Tin nổi bật / VIP",
    )
    status: Mapped[str] = mapped_column(
        String(20),
        default="active",
        nullable=False,
        comment="Trạng thái: active, sold, rented, expired",
    )

    # ── Relationships ─────────────────────────────────────────
    city = relationship(
        "City",
        lazy="joined",
    )
    district = relationship(
        "District",
        lazy="joined",
    )

    # ── Indexes ───────────────────────────────────────────────
    __table_args__ = (
        Index("ix_listings_mode", "mode"),
        Index("ix_listings_city_id", "city_id"),
        Index("ix_listings_district_id", "district_id"),
        Index("ix_listings_property_type", "property_type"),
        Index("ix_listings_price", "price"),
        Index("ix_listings_status", "status"),
        Index("ix_listings_is_featured", "is_featured"),
        Index("ix_listings_mode_city_status", "mode", "city_id", "status"),
    )

    def __repr__(self) -> str:
        return f"<Listing id={self.id} title={self.title[:30]} mode={self.mode} price={self.price}>"

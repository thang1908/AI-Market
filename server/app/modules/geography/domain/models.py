from typing import List
from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.shared.database import Base, TimestampMixin


class City(Base, TimestampMixin):
    __tablename__ = "cities"

    id: Mapped[str] = mapped_column(
        String(10),
        primary_key=True,
        comment="Mã viết tắt tỉnh/thành phố, vd: 'HN', 'HCM'",
    )
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="Tên tỉnh/thành phố, vd: 'Hà Nội'",
    )
    slug: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
        comment="Slug URL, vd: 'ha-noi'",
    )
    display_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # Quan hệ 1-N với danh sách Quận/Huyện
    districts: Mapped[List["District"]] = relationship(
        "District",
        back_populates="city",
        cascade="all, delete-orphan",
        order_by="District.display_order",
    )

    def __repr__(self) -> str:
        return f"<City id={self.id} name={self.name}>"


class District(Base, TimestampMixin):
    __tablename__ = "districts"

    id: Mapped[str] = mapped_column(
        String(20),
        primary_key=True,
        comment="Mã định danh quận/huyện, vd: 'HN_TH', 'HN_CG'",
    )
    city_id: Mapped[str] = mapped_column(
        String(10),
        ForeignKey("cities.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="Tên quận/huyện, vd: 'Tây Hồ', 'Cầu Giấy'",
    )
    slug: Mapped[str] = mapped_column(
        String(100),
        index=True,
        nullable=False,
        comment="Slug URL, vd: 'tay-ho', 'cau-giay'",
    )
    display_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    city: Mapped["City"] = relationship(
        "City",
        back_populates="districts",
    )

    def __repr__(self) -> str:
        return f"<District id={self.id} name={self.name} city_id={self.city_id}>"

"""create listings table

Revision ID: 0003_create_listings
Revises: 0002_create_geography
Create Date: 2026-08-31 00:01:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

# revision identifiers, used by Alembic.
revision: str = '0003_create_listings'
down_revision: Union[str, None] = '0002_create_geography'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'listings',

        # ── Primary Key ──
        sa.Column('id', UUID(as_uuid=True), primary_key=True, nullable=False,
                  server_default=sa.text('gen_random_uuid()'),
                  comment="Mã tin đăng (UUID)"),

        # ── Thông tin cơ bản ──
        sa.Column('title', sa.String(300), nullable=False,
                  comment="Tiêu đề tin đăng"),
        sa.Column('description', sa.Text(), nullable=True,
                  comment="Mô tả chi tiết bất động sản"),
        sa.Column('mode', sa.String(10), nullable=False,
                  comment="Loại giao dịch: 'sale' hoặc 'rent'"),
        sa.Column('property_type', sa.String(50), nullable=False,
                  comment="Loại hình BĐS: Căn hộ, Nhà riêng, Biệt thự..."),

        # ── Giá & Diện tích ──
        sa.Column('price', sa.BigInteger(), nullable=False,
                  comment="Giá (VND)"),
        sa.Column('price_unit', sa.String(20), nullable=False,
                  server_default='VND',
                  comment="Đơn vị hiển thị giá"),
        sa.Column('area', sa.Float(), nullable=False,
                  comment="Diện tích sử dụng (m²)"),

        # ── Thông số kỹ thuật ──
        sa.Column('bedrooms', sa.Integer(), nullable=True,
                  comment="Số phòng ngủ (0 = Studio)"),
        sa.Column('bathrooms', sa.Integer(), nullable=True,
                  comment="Số phòng tắm / WC"),
        sa.Column('floor', sa.String(20), nullable=True,
                  comment="Tầng, vd: '12/25'"),
        sa.Column('direction', sa.String(20), nullable=True,
                  comment="Hướng nhà"),
        sa.Column('legal_status', sa.String(50), nullable=True,
                  comment="Pháp lý: Sổ đỏ, Sổ hồng, HĐMB..."),
        sa.Column('furnishing', sa.String(50), nullable=True,
                  comment="Nội thất: Full, Cơ bản, Nguyên bản"),

        # ── Vị trí địa lý ──
        sa.Column('address', sa.String(500), nullable=False,
                  comment="Địa chỉ chi tiết"),
        sa.Column('city_id', sa.String(10), sa.ForeignKey('cities.id', ondelete='CASCADE'),
                  nullable=False, comment="FK → cities.id"),
        sa.Column('district_id', sa.String(20), sa.ForeignKey('districts.id', ondelete='CASCADE'),
                  nullable=False, comment="FK → districts.id"),
        sa.Column('latitude', sa.Float(), nullable=True,
                  comment="Tọa độ GPS vĩ độ"),
        sa.Column('longitude', sa.Float(), nullable=True,
                  comment="Tọa độ GPS kinh độ"),

        # ── Ảnh & Media ──
        sa.Column('images', JSONB(), nullable=True,
                  server_default='[]',
                  comment="Danh sách URL ảnh BĐS dạng JSON array"),

        # ── Liên hệ ──
        sa.Column('contact_name', sa.String(100), nullable=True,
                  comment="Tên người liên hệ / môi giới"),
        sa.Column('contact_phone', sa.String(20), nullable=True,
                  comment="Số điện thoại liên hệ"),

        # ── Trạng thái ──
        sa.Column('is_featured', sa.Boolean(), server_default='false', nullable=False,
                  comment="Tin nổi bật / VIP"),
        sa.Column('status', sa.String(20), server_default='active', nullable=False,
                  comment="Trạng thái: active, sold, rented, expired"),

        # ── Timestamps ──
        sa.Column('created_at', sa.DateTime(timezone=True),
                  server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True),
                  server_default=sa.text('now()'), nullable=False),
    )

    # ── Indexes cho tìm kiếm & lọc nhanh ──
    op.create_index('ix_listings_mode', 'listings', ['mode'])
    op.create_index('ix_listings_city_id', 'listings', ['city_id'])
    op.create_index('ix_listings_district_id', 'listings', ['district_id'])
    op.create_index('ix_listings_property_type', 'listings', ['property_type'])
    op.create_index('ix_listings_price', 'listings', ['price'])
    op.create_index('ix_listings_status', 'listings', ['status'])
    op.create_index('ix_listings_is_featured', 'listings', ['is_featured'])
    # Composite index: tìm kiếm phổ biến nhất (mode + city + status)
    op.create_index('ix_listings_mode_city_status', 'listings', ['mode', 'city_id', 'status'])


def downgrade() -> None:
    op.drop_index('ix_listings_mode_city_status', table_name='listings')
    op.drop_index('ix_listings_is_featured', table_name='listings')
    op.drop_index('ix_listings_status', table_name='listings')
    op.drop_index('ix_listings_price', table_name='listings')
    op.drop_index('ix_listings_property_type', table_name='listings')
    op.drop_index('ix_listings_district_id', table_name='listings')
    op.drop_index('ix_listings_city_id', table_name='listings')
    op.drop_index('ix_listings_mode', table_name='listings')
    op.drop_table('listings')

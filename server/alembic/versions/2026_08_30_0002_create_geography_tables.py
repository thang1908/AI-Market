"""create geography tables (cities and districts)

Revision ID: 0002_create_geography
Revises: 0001_create_users
Create Date: 2026-08-30 00:01:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '0002_create_geography'
down_revision: Union[str, None] = '0001_create_users'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Tạo bảng cities
    op.create_table(
        'cities',
        sa.Column('id', sa.String(length=10), primary_key=True, nullable=False, comment="Mã viết tắt tỉnh/thành phố, vd: 'HN', 'HCM'"),
        sa.Column('name', sa.String(length=100), nullable=False, comment="Tên tỉnh/thành phố, vd: 'Hà Nội'"),
        sa.Column('slug', sa.String(length=100), nullable=False, comment="Slug URL, vd: 'ha-noi'"),
        sa.Column('display_order', sa.Integer(), server_default='0', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_cities_slug', 'cities', ['slug'], unique=True)

    # 2. Tạo bảng districts
    op.create_table(
        'districts',
        sa.Column('id', sa.String(length=20), primary_key=True, nullable=False, comment="Mã định danh quận/huyện, vd: 'HN_TH', 'HN_CG'"),
        sa.Column('city_id', sa.String(length=10), sa.ForeignKey('cities.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False, comment="Tên quận/huyện, vd: 'Tây Hồ', 'Cầu Giấy'"),
        sa.Column('slug', sa.String(length=100), nullable=False, comment="Slug URL, vd: 'tay-ho', 'cau-giay'"),
        sa.Column('display_order', sa.Integer(), server_default='0', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_districts_city_id', 'districts', ['city_id'], unique=False)
    op.create_index('ix_districts_slug', 'districts', ['slug'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_districts_slug', table_name='districts')
    op.drop_index('ix_districts_city_id', table_name='districts')
    op.drop_table('districts')
    op.drop_index('ix_cities_slug', table_name='cities')
    op.drop_table('cities')

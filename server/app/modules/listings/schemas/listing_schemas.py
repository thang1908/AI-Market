"""
Schemas Pydantic cho Module Listings.
Request params và Response models.
"""
import uuid
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


# ── Response: Địa chỉ gộp (dùng trong listing) ────────────────────────────
class CityRef(BaseModel):
    id: str
    name: str

    model_config = {"from_attributes": True}


class DistrictRef(BaseModel):
    id: str
    name: str

    model_config = {"from_attributes": True}


# ── Response: Listing tóm tắt (dùng trong danh sách) ─────────────────────
class ListingCard(BaseModel):
    id: uuid.UUID
    title: str
    mode: str
    property_type: str
    price: int
    price_unit: str
    area: float
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    direction: Optional[str] = None
    legal_status: Optional[str] = None
    furnishing: Optional[str] = None
    address: str
    city_id: str
    district_id: str
    city: Optional[CityRef] = None
    district: Optional[DistrictRef] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    images: Optional[list] = None
    is_featured: bool
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Response: Listing chi tiết ────────────────────────────────────────────
class ListingDetail(ListingCard):
    description: Optional[str] = None
    floor: Optional[str] = None
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    updated_at: datetime


# ── Response: Danh sách phân trang ────────────────────────────────────────
class PaginatedListings(BaseModel):
    items: List[ListingCard]
    total: int
    page: int
    page_size: int
    total_pages: int


# ── Response: Thống kê thị trường ─────────────────────────────────────────
class DistrictStats(BaseModel):
    district_id: str
    district_name: str
    count: int
    avg_price: float
    min_price: int
    max_price: int


class MarketSummary(BaseModel):
    total_listings: int
    total_sale: int
    total_rent: int
    avg_price_sale: float
    avg_price_rent: float
    avg_area: float
    top_districts: List[DistrictStats]


class PriceRange(BaseModel):
    range: str
    count: int


class PriceDistribution(BaseModel):
    city_id: str
    mode: str
    distribution: List[PriceRange]

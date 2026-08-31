"""
Schemas Pydantic cho Module Projects.
Request params và Response models.
"""
import uuid
from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


# ── Shared refs ────────────────────────────────────────────────────────────
class CityRef(BaseModel):
    id: str
    name: str
    model_config = {"from_attributes": True}


class DistrictRef(BaseModel):
    id: str
    name: str
    model_config = {"from_attributes": True}


# ── ProjectUnit schemas ────────────────────────────────────────────────────
class ProjectUnitCard(BaseModel):
    """Căn hộ tóm tắt — dùng trong danh sách tồn kho."""
    id: uuid.UUID
    project_id: str
    unit_code: str
    block: Optional[str] = None
    floor: Optional[int] = None
    area: float
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    direction: Optional[str] = None
    view: Optional[str] = None
    floor_plan_image: Optional[str] = None
    price: Optional[int] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedUnits(BaseModel):
    items: List[ProjectUnitCard]
    total: int
    page: int
    page_size: int
    total_pages: int


# ── Project schemas ────────────────────────────────────────────────────────
class ProjectCard(BaseModel):
    """Dự án tóm tắt — dùng trong danh sách và map."""
    id: str
    name: str
    developer: str
    property_type: str
    status: str
    badge: Optional[str] = None
    price_from: Optional[int] = None
    price_per_m2_from: Optional[int] = None
    price_per_m2_to: Optional[int] = None
    available_units_count: Optional[int] = None
    address: str
    city_id: str
    district_id: str
    city: Optional[CityRef] = None
    district: Optional[DistrictRef] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    cover_image: Optional[str] = None
    gallery: Optional[List[str]] = None
    is_featured: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ProjectDetail(ProjectCard):
    """Dự án chi tiết đầy đủ — dùng trong màn hình chi tiết."""
    description: Optional[str] = None
    overview: Optional[Dict[str, Any]] = None
    legal: Optional[Dict[str, Any]] = None
    amenities: Optional[List[str]] = None
    contact: Optional[Dict[str, Any]] = None
    updated_at: datetime


class PaginatedProjects(BaseModel):
    items: List[ProjectCard]
    total: int
    page: int
    page_size: int
    total_pages: int


# ── Stats schemas ──────────────────────────────────────────────────────────
class ProjectStatusStat(BaseModel):
    status: str
    count: int


class ProjectSummary(BaseModel):
    total_projects: int
    total_active: int
    total_units: int
    total_available_units: int
    by_status: List[ProjectStatusStat]
    by_city: List[Dict[str, Any]]

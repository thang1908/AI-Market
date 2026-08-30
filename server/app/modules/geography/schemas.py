from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class DistrictResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    city_id: str
    name: str
    slug: str
    display_order: int
    is_active: bool


class CityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    slug: str
    display_order: int
    is_active: bool


class CityDetailResponse(CityResponse):
    districts: List[DistrictResponse] = []

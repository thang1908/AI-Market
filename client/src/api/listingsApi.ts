import { apiClient } from './client';
import { PropertyListing, PropertyType } from '../types';

// ── Types Backend trả về ───────────────────────────────────────────────────
export interface BackendListing {
  id: string;
  title: string;
  description: string | null;
  mode: 'sale' | 'rent';
  property_type: string;
  price: number;
  price_unit: string;
  area: number;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: string | null;
  direction: string | null;
  legal_status: string | null;
  furnishing: string | null;
  address: string;
  city_id: string;
  district_id: string;
  city: { id: string; name: string } | null;
  district: { id: string; name: string } | null;
  latitude: number | null;
  longitude: number | null;
  images: string[] | null;
  contact_name: string | null;
  contact_phone: string | null;
  is_featured: boolean;
  status: string;
  created_at: string;
}

export interface PaginatedListings {
  items: BackendListing[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ListingsQueryParams {
  mode?: string;
  city_id?: string;
  district_ids?: string;       // comma-separated IDs
  property_types?: string;     // comma-separated types
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  bedrooms?: string;
  search?: string;
  sort_by?: string;
  page?: number;
  page_size?: number;
}

// ── Adapter: Backend → Frontend PropertyListing ───────────────────────────
export function mapToPropertyListing(b: BackendListing): PropertyListing {
  // Định dạng giá hiển thị
  const priceDisplay = b.mode === 'sale'
    ? formatSalePrice(b.price)
    : formatRentPrice(b.price);

  // Giá trị số để sort client-side nếu cần
  const priceValueNumber = b.mode === 'sale'
    ? b.price / 1_000_000_000   // → tỷ
    : b.price / 1_000_000;      // → triệu

  return {
    id: b.id,
    title: b.title,
    mode: b.mode as any,
    propertyType: b.property_type as PropertyType,
    district: b.district?.name ?? b.district_id,
    city: b.city?.name ?? b.city_id,
    address: b.address,
    price: priceDisplay,
    priceValueNumber,
    pricePerM2: b.area > 0
      ? formatPricePerM2(b.price, b.area, b.mode)
      : undefined,
    area: b.area,
    bedrooms: b.bedrooms ?? 0,
    bathrooms: b.bathrooms ?? 0,
    floor: b.floor ?? undefined,
    direction: b.direction ?? undefined,
    furnitureStatus: b.furnishing ?? undefined,
    legalStatus: b.legal_status ?? undefined,
    description: b.description ?? '',
    images: b.images ?? [],
    updatedAt: b.created_at,
    isDemo: false,
  };
}

// ── Helpers định dạng giá ─────────────────────────────────────────────────
function formatSalePrice(price: number): string {
  if (price >= 1_000_000_000) {
    const ty = price / 1_000_000_000;
    return ty % 1 === 0 ? `${ty} tỷ` : `${ty.toFixed(1)} tỷ`;
  }
  const trieu = price / 1_000_000;
  return `${trieu.toFixed(0)} triệu`;
}

function formatRentPrice(price: number): string {
  if (price >= 1_000_000) {
    const trieu = price / 1_000_000;
    return trieu % 1 === 0 ? `${trieu} triệu/tháng` : `${trieu.toFixed(1)} triệu/tháng`;
  }
  return `${price.toLocaleString('vi-VN')} đ/tháng`;
}

function formatPricePerM2(price: number, area: number, mode: string): string {
  if (mode === 'sale') {
    const perM2 = price / area / 1_000_000;
    return `${perM2.toFixed(1)} triệu/m²`;
  }
  return '';
}

// ── Mapping priceRange filter string → API params ─────────────────────────
export function priceRangeToApiParams(
  priceRange: string,
  mode: 'sale' | 'rent' | 'project'
): { min_price?: number; max_price?: number } {
  if (!priceRange || priceRange === 'Tất cả') return {};

  if (mode === 'sale') {
    const map: Record<string, { min_price?: number; max_price?: number }> = {
      '<3 tỷ':    { max_price: 3_000_000_000 },
      '3–5 tỷ':   { min_price: 3_000_000_000,  max_price: 5_000_000_000 },
      '5–7 tỷ':   { min_price: 5_000_000_000,  max_price: 7_000_000_000 },
      '7–10 tỷ':  { min_price: 7_000_000_000,  max_price: 10_000_000_000 },
      '10–20 tỷ': { min_price: 10_000_000_000, max_price: 20_000_000_000 },
      '>20 tỷ':   { min_price: 20_000_000_000 },
    };
    return map[priceRange] ?? {};
  } else {
    const map: Record<string, { min_price?: number; max_price?: number }> = {
      '<10 triệu':   { max_price: 10_000_000 },
      '10–20 triệu': { min_price: 10_000_000, max_price: 20_000_000 },
      '20–30 triệu': { min_price: 20_000_000, max_price: 30_000_000 },
      '30–50 triệu': { min_price: 30_000_000, max_price: 50_000_000 },
      '>50 triệu':   { min_price: 50_000_000 },
    };
    return map[priceRange] ?? {};
  }
}

// ── Mapping areaRange filter string → API params ──────────────────────────
export function areaRangeToApiParams(
  areaRange: string
): { min_area?: number; max_area?: number } {
  if (!areaRange || areaRange === 'Tất cả') return {};
  const map: Record<string, { min_area?: number; max_area?: number }> = {
    '<50m²':     { max_area: 50 },
    '50–70m²':   { min_area: 50,  max_area: 70 },
    '70–100m²':  { min_area: 70,  max_area: 100 },
    '100–150m²': { min_area: 100, max_area: 150 },
    '>150m²':    { min_area: 150 },
  };
  return map[areaRange] ?? {};
}

// ── API ───────────────────────────────────────────────────────────────────
export const listingsApi = {
  async getListings(params: ListingsQueryParams): Promise<PaginatedListings> {
    // Lọc bỏ các params undefined/null
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
    const res = await apiClient.get<PaginatedListings>('/listings', { params: cleanParams });
    return res.data;
  },

  async getFeatured(limit = 8): Promise<BackendListing[]> {
    const res = await apiClient.get<BackendListing[]>('/listings/featured', { params: { limit } });
    return res.data;
  },

  async getDetail(id: string): Promise<BackendListing> {
    const res = await apiClient.get<BackendListing>(`/listings/${id}`);
    return res.data;
  },

  async getMarketSummary(city_id?: string) {
    const res = await apiClient.get('/listings/stats/summary', {
      params: city_id ? { city_id } : {},
    });
    return res.data;
  },
};

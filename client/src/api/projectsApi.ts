/**
 * Projects API Client
 * Kết nối với backend /api/v1/projects
 */
import { apiClient } from './client';
import { Project, ProjectOverview, ProjectLegal, ProjectAmenities } from '../types';

// ── Backend response types ─────────────────────────────────────────────────
export interface BackendProject {
  id: string;
  name: string;
  developer: string;
  description?: string;
  property_type: string;
  status: string;
  badge?: string;
  price_from?: number;
  price_per_m2_from?: number;
  price_per_m2_to?: number;
  available_units_count?: number;
  address: string;
  city_id: string;
  district_id: string;
  city?: { id: string; name: string };
  district?: { id: string; name: string };
  latitude?: number;
  longitude?: number;
  cover_image?: string;
  gallery?: string[];
  overview?: Record<string, any>;
  legal?: Record<string, any>;
  amenities?: string[];
  contact?: Record<string, any>;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
}

export interface BackendProjectUnit {
  id: string;
  project_id: string;
  unit_code: string;
  block?: string;
  floor?: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  direction?: string;
  view?: string;
  floor_plan_image?: string;
  price?: number;
  status: 'available' | 'deposited' | 'sold';
  created_at: string;
}

export interface PaginatedProjects {
  items: BackendProject[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PaginatedUnits {
  items: BackendProjectUnit[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ProjectSummary {
  total_projects: number;
  total_active: number;
  total_units: number;
  total_available_units: number;
  by_status: { status: string; count: number }[];
  by_city: { city_id: string; count: number }[];
}

export interface ProjectsFilterParams {
  city_id?: string;
  district_id?: string;
  property_type?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

// ── Adapter: Backend → FE Project type ────────────────────────────────────
export function mapToProject(b: BackendProject): Project {
  const priceBillion = b.price_from ? b.price_from / 1_000_000_000 : 0;
  const priceM2From = b.price_per_m2_from ? b.price_per_m2_from / 1_000_000 : 0;
  const priceM2To = b.price_per_m2_to ? b.price_per_m2_to / 1_000_000 : 0;

  return {
    id: b.id,
    name: b.name,
    developer: b.developer,
    description: b.description || '',
    location: b.address,
    district: b.district?.name || b.district_id,
    city: b.city?.name || b.city_id,
    coordinates: {
      lat: b.latitude || 21.0285,
      lng: b.longitude || 105.8542,
      xPercent: 50,
      yPercent: 50,
    },
    status: (b.status as any) || 'Đang mở bán',
    badge: (b.badge as any) || undefined,
    priceFrom: priceBillion > 0 ? `Giá từ ${priceBillion.toLocaleString('vi-VN')} tỷ` : 'Liên hệ',
    priceFromNumber: priceBillion,
    pricePerM2: priceM2From > 0
      ? `${priceM2From.toFixed(0)} – ${priceM2To.toFixed(0)} triệu/m²`
      : 'Liên hệ',
    availableUnitsCount: b.available_units_count || 0,
    propertyType: (b.property_type as any) || 'Căn hộ',
    coverImage: b.cover_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    gallery: b.gallery || [],
    // Overview: map từ JSONB backend về ProjectOverview FE
    overview: {
      scale: b.overview?.scale || '',
      landArea: b.overview?.land_area || '',
      buildingDensity: b.overview?.density || '',
      totalTowers: b.overview?.total_towers || '',
      totalUnits: b.overview?.total_units || '',
      launchTime: b.overview?.launch_time || '',
      handoverTime: b.overview?.handover_date || '',
      density: b.overview?.density || '',
    } as ProjectOverview,
    // Legal
    legal: {
      ownership: b.legal?.ownership_type || '',
      permits: b.legal?.permit_number ? [b.legal.permit_number] : [],
      statusText: b.legal?.notes || '',
    } as ProjectLegal,
    // Amenities: backend lưu flat string[], FE cần {internal, external}
    amenities: {
      internal: b.amenities || [],
      external: [],
    } as ProjectAmenities,
    // Placeholder fields — FE components expect these
    priceDetails: {
      priceFrom: b.price_from ? `${priceBillion} tỷ` : 'Liên hệ',
      avgPricePerM2: priceM2From > 0 ? `${priceM2From.toFixed(0)} triệu/m²` : 'Liên hệ',
      byType: [],
    },
    progress: {
      constructionStatus: b.overview?.construction_progress || '',
      timeline: [],
      lastUpdated: b.updated_at ? new Date(b.updated_at).toLocaleDateString('vi-VN') : '',
    },
    infrastructure: [],
    layouts: { masterPlanImage: '', towerLayouts: [], unitLayouts: [] },
    news: [],
    videos: [],
    tags: [b.property_type, b.status].filter(Boolean),
    isFeatured: b.is_featured,
    contact: b.contact,
  } as any;
}

// ── API object ─────────────────────────────────────────────────────────────
export const projectsApi = {
  /** Danh sách dự án với filter + phân trang */
  getProjects: async (params: ProjectsFilterParams = {}): Promise<PaginatedProjects> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    const res = await apiClient.get<PaginatedProjects>(`/projects?${searchParams}`);
    return res.data;
  },

  /** Dự án nổi bật */
  getFeatured: async (limit = 6, cityId?: string): Promise<BackendProject[]> => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cityId) params.set('city_id', cityId);
    const res = await apiClient.get<BackendProject[]>(`/projects/featured?${params}`);
    return res.data;
  },

  /** Chi tiết dự án */
  getDetail: async (projectId: string): Promise<BackendProject> => {
    const res = await apiClient.get<BackendProject>(`/projects/${projectId}`);
    return res.data;
  },

  /** Tồn kho căn hộ */
  getUnits: async (
    projectId: string,
    params: { status?: string; bedrooms?: number; block?: string; page?: number; page_size?: number } = {}
  ): Promise<PaginatedUnits> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    const res = await apiClient.get<PaginatedUnits>(`/projects/${projectId}/units?${searchParams}`);
    return res.data;
  },

  /** Chi tiết căn hộ */
  getUnit: async (projectId: string, unitId: string): Promise<BackendProjectUnit> => {
    const res = await apiClient.get<BackendProjectUnit>(`/projects/${projectId}/units/${unitId}`);
    return res.data;
  },

  /** Thống kê tổng quan */
  getSummary: async (cityId?: string): Promise<ProjectSummary> => {
    const params = cityId ? `?city_id=${cityId}` : '';
    const res = await apiClient.get<ProjectSummary>(`/projects/stats/summary${params}`);
    return res.data;
  },
};

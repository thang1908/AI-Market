import { apiClient } from './client';

export interface City {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
}

export interface District {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
}

export interface CityDetail extends City {
  districts: District[];
}

export const geographyApi = {
  /**
   * Lấy danh sách 63 Tỉnh/Thành phố toàn quốc
   */
  async getCities(isActive: boolean = true): Promise<City[]> {
    const response = await apiClient.get<City[]>('/geography/cities', {
      params: { is_active: isActive },
    });
    return response.data;
  },

  /**
   * Lấy danh sách Quận/Huyện theo mã Tỉnh/Thành phố
   */
  async getDistrictsByCity(cityId: string, isActive: boolean = true): Promise<District[]> {
    const response = await apiClient.get<District[]>(`/geography/cities/${cityId}/districts`, {
      params: { is_active: isActive },
    });
    return response.data;
  },

  /**
   * Lấy chi tiết Tỉnh/Thành phố kèm danh sách Quận/Huyện
   */
  async getCityDetail(cityId: string): Promise<CityDetail> {
    const response = await apiClient.get<CityDetail>(`/geography/cities/${cityId}`);
    return response.data;
  },
};

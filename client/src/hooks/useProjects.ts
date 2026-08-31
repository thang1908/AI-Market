/**
 * useProjects — Custom hook fetch dự án từ API
 * Tương tự useListings, hỗ trợ filter + pagination + debounce
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Project } from '../types';
import { projectsApi, mapToProject, ProjectsFilterParams } from '../api/projectsApi';

interface UseProjectsOptions {
  cityId?: string;
  districtId?: string;
  propertyType?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  search?: string;
  pageSize?: number;
}

interface UseProjectsResult {
  projects: Project[];
  total: number;
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProjects(options: UseProjectsOptions = {}): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Race condition guard
  const fetchIdRef = useRef(0);

  const {
    cityId, districtId, propertyType, status,
    minPrice, maxPrice, isFeatured, search, pageSize = 12,
  } = options;

  const fetchProjects = useCallback(async (currentPage: number) => {
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const params: ProjectsFilterParams = {
        page: currentPage,
        page_size: pageSize,
      };
      if (cityId) params.city_id = cityId;
      if (districtId) params.district_id = districtId;
      if (propertyType) params.property_type = propertyType;
      if (status) params.status = status;
      if (minPrice !== undefined) params.min_price = minPrice;
      if (maxPrice !== undefined) params.max_price = maxPrice;
      if (isFeatured !== undefined) params.is_featured = isFeatured;
      if (search) params.search = search;

      const data = await projectsApi.getProjects(params);

      // Bỏ qua nếu đã có request mới hơn
      if (fetchId !== fetchIdRef.current) return;

      setProjects(data.items.map(mapToProject));
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err: any) {
      if (fetchId !== fetchIdRef.current) return;
      setError(err?.response?.data?.detail || 'Không thể tải danh sách dự án');
      setProjects([]);
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [cityId, districtId, propertyType, status, minPrice, maxPrice, isFeatured, search, pageSize]);

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setPage(1);
  }, [cityId, districtId, propertyType, status, minPrice, maxPrice, isFeatured, search]);

  // Fetch mỗi khi page hoặc filter thay đổi
  useEffect(() => {
    fetchProjects(page);
  }, [fetchProjects, page]);

  return {
    projects,
    total,
    totalPages,
    page,
    setPage,
    isLoading,
    error,
    refetch: () => fetchProjects(page),
  };
}

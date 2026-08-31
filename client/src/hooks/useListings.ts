import { useState, useEffect, useCallback, useRef } from 'react';
import { PropertyListing, MarketFilterState } from '../types';
import {
  listingsApi,
  mapToPropertyListing,
  priceRangeToApiParams,
  areaRangeToApiParams,
} from '../api/listingsApi';

interface UseListingsResult {
  listings: PropertyListing[];
  total: number;
  totalPages: number;
  page: number;
  isLoading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => void;
}

/**
 * Hook quản lý việc gọi API listings dựa trên marketFilters.
 * - Tự động re-fetch khi filter thay đổi (page reset về 1)
 * - Debounce 300ms để tránh gọi API quá nhiều khi user đang gõ search
 */
export function useListings(
  filters: MarketFilterState,
  pageSize = 12
): UseListingsResult {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref để track fetch request mới nhất (tránh race condition)
  const fetchIdRef = useRef(0);

  const fetchListings = useCallback(
    async (currentPage: number) => {
      if (filters.mode === 'project') return; // project tab không dùng API này

      const fetchId = ++fetchIdRef.current;
      setIsLoading(true);
      setError(null);

      try {
        // Map priceRange & areaRange string → số
        const { min_price, max_price } = priceRangeToApiParams(
          filters.priceRange,
          filters.mode as 'sale' | 'rent'
        );
        const { min_area, max_area } = areaRangeToApiParams(filters.areaRange);

        // Bedrooms
        const bedroomsParam =
          !filters.bedrooms || filters.bedrooms === 'Tất cả' ? undefined : filters.bedrooms;

        // Property types
        const propertyTypesParam =
          filters.propertyTypes.length > 0 ? filters.propertyTypes.join(',') : undefined;

        // Sort
        const sortMap: Record<string, string> = {
          latest: 'latest',
          price_asc: 'price_asc',
          price_desc: 'price_desc',
          area_desc: 'area_desc',
          price_per_m2_asc: 'price_per_m2_asc',
        };

        // District IDs / Names
        const districtIdsParam =
          filters.districts && filters.districts.length > 0
            ? filters.districts.join(',')
            : undefined;

        const data = await listingsApi.getListings({
          mode: filters.mode,
          city_id: filters.cityId || undefined,
          district_ids: districtIdsParam,
          property_types: propertyTypesParam,
          min_price,
          max_price,
          min_area,
          max_area,
          bedrooms: bedroomsParam,
          search: filters.searchQuery || undefined,
          sort_by: sortMap[filters.sortBy] ?? 'latest',
          page: currentPage,
          page_size: pageSize,
        });

        // Chỉ update state nếu đây là request mới nhất
        if (fetchId !== fetchIdRef.current) return;

        setListings(data.items.map(mapToPropertyListing));
        setTotal(data.total);
        setTotalPages(data.total_pages);
      } catch (err) {
        if (fetchId !== fetchIdRef.current) return;
        console.error('[useListings] Lỗi gọi API listings:', err);
        setError('Không thể tải danh sách BĐS. Vui lòng thử lại.');
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [filters, pageSize]
  );

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setPage(1);
  }, [
    filters.mode,
    filters.cityId,
    filters.districts,
    filters.propertyTypes,
    filters.priceRange,
    filters.areaRange,
    filters.bedrooms,
    filters.sortBy,
    filters.searchQuery,
  ]);

  // Debounce fetch khi searchQuery thay đổi, ngay lập tức cho các filter khác
  useEffect(() => {
    const isSearchChange = filters.searchQuery !== undefined;
    const delay = isSearchChange ? 300 : 0;

    const timer = setTimeout(() => {
      fetchListings(page);
    }, delay);

    return () => clearTimeout(timer);
  }, [fetchListings, page]);

  const refetch = useCallback(() => {
    fetchListings(page);
  }, [fetchListings, page]);

  return {
    listings,
    total,
    totalPages,
    page,
    isLoading,
    error,
    setPage,
    refetch,
  };
}

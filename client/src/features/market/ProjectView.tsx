import React from 'react';
import { Building2, AlertCircle, RefreshCw } from 'lucide-react';
import { ProjectMapView } from '../projects/ProjectMapView';
import { ProjectDiscoverySections } from '../projects/ProjectDiscoverySections';
import { ProjectPageModal } from '../projects/ProjectPageModal';
import { ProjectInventoryModal } from '../projects/ProjectInventoryModal';
import { PrimaryUnitDetailModal } from '../projects/PrimaryUnitDetailModal';
import { BookingPreviewModal } from '../projects/BookingPreviewModal';
import { useProjects } from '../../hooks/useProjects';
import { useAppState } from '../../state/useAppState';

// ── Loading skeleton ───────────────────────────────────────────────────────
const ProjectCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 animate-pulse">
    <div className="h-48 bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="h-3 bg-slate-200 rounded w-2/3" />
    </div>
  </div>
);

export const ProjectView: React.FC = () => {
  const { activeMarketCity, projectFilters } = useAppState() as any;

  // Lấy cityId từ state nếu có, mặc định HN
  const cityId = activeMarketCity || 'HN';

  // Chuyển đổi projectFilters sang query params
  const districtId = projectFilters?.districts?.length > 0 ? projectFilters.districts[0] : undefined;
  const status = projectFilters?.status && projectFilters.status !== 'Tất cả' ? projectFilters.status : undefined;
  const search = projectFilters?.searchQuery || (projectFilters?.developer && projectFilters.developer !== 'Tất cả' ? projectFilters.developer : undefined);
  const propertyType = projectFilters?.propertyTypes?.length > 0 ? projectFilters.propertyTypes.join(',') : undefined;

  const { projects, total, isLoading, error, refetch } = useProjects({
    cityId,
    districtId,
    status,
    search,
    propertyType,
    pageSize: 20,
  });

  // ── Error state ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <p className="font-semibold text-slate-800">Không thể tải danh sách dự án</p>
          <p className="text-sm text-slate-500 mt-1">{error}</p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div id="market-projects-tab-view" className="w-full space-y-8 animate-in fade-in duration-200">

      {/* Header tổng quan */}
      {!isLoading && (
        <div className="flex items-center gap-3 px-1">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Building2 className="w-4 h-4" />
            <span>
              <span className="font-semibold text-slate-800">{total}</span> dự án sơ cấp
            </span>
          </div>
        </div>
      )}

      {/* 1. Bản đồ dự án */}
      {isLoading ? (
        <div className="h-72 bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center">
          <div className="text-slate-400 text-sm">Đang tải bản đồ dự án...</div>
        </div>
      ) : (
        <ProjectMapView projects={projects} />
      )}

      {/* 2. Danh sách dự án: loading skeleton hoặc data thật */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <Building2 className="w-12 h-12 text-slate-300" />
          <p className="font-semibold text-slate-600">Không tìm thấy dự án nào</p>
          <p className="text-sm text-slate-400">Thử thay đổi bộ lọc thành phố hoặc loại hình</p>
        </div>
      ) : (
        <ProjectDiscoverySections projects={projects} />
      )}

      {/* 3. Modals */}
      <ProjectPageModal />
      <ProjectInventoryModal />
      <PrimaryUnitDetailModal />
      <BookingPreviewModal />
    </div>
  );
};

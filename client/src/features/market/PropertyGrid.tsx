import React from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  AlertCircle,
  Loader2,
  WifiOff,
} from 'lucide-react';
import { PropertyListing } from '../../types';
import { PropertyCard } from './PropertyCard';
import { useAppState } from '../../state/useAppState';

interface PropertyGridProps {
  listings: PropertyListing[];
  total: number;
  totalPages: number;
  page: number;
  isLoading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  onOpenDetail: (listing: PropertyListing) => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  listings,
  total,
  totalPages,
  page,
  isLoading,
  error,
  onPageChange,
  onOpenDetail,
}) => {
  const {
    marketFilters,
    setMarketFilters,
    resetMarketFilters,
    openChatTab,
  } = useAppState();

  const cityLabel =
    marketFilters.cityId === 'HN' ? 'tại Hà Nội'
    : marketFilters.cityId === 'HCM' ? 'tại TP. Hồ Chí Minh'
    : marketFilters.cityId === 'DN' ? 'tại Đà Nẵng'
    : marketFilters.cityId === 'HP' ? 'tại Hải Phòng'
    : marketFilters.cityId ? `tại ${marketFilters.cityId}`
    : 'toàn quốc';

  const handleAskAIAlternative = () => {
    openChatTab(
      'Tôi đang tìm bất động sản nhưng chưa thấy căn phù hợp với bộ lọc hiện tại. AI có thể tư vấn các phương án hoặc khu vực thay thế tương đương không?'
    );
  };

  return (
    <div id="market-property-grid-container" className="space-y-4">

      {/* Result Header & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            {isLoading
              ? 'Đang tải…'
              : `${total.toLocaleString('vi-VN')} BĐS đang ${marketFilters.mode === 'sale' ? 'bán' : 'cho thuê'} ${cityLabel}`}
          </h2>
          <p className="text-xs text-slate-500">
            {!isLoading && totalPages > 1
              ? `Trang ${page}/${totalPages} — ${listings.length} tin đăng`
              : 'Hiển thị danh sách bất động sản khớp với tiêu chí tìm kiếm'}
          </p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 hidden sm:inline">Sắp xếp:</span>
          <div className="relative inline-block">
            <select
              id="market-sort-select"
              value={marketFilters.sortBy}
              onChange={(e) =>
                setMarketFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
              }
              className="appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="latest">Mới nhất</option>
              <option value="price_asc">Giá: Thấp → Cao</option>
              <option value="price_desc">Giá: Cao → Thấp</option>
              <option value="area_desc">Diện tích: Lớn nhất</option>
              <option value="price_per_m2_asc">Giá/m²: Thấp nhất</option>
              <option value="featured">Nổi bật trước</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="flex gap-2">
                  <div className="h-3 bg-slate-200 rounded w-16" />
                  <div className="h-3 bg-slate-200 rounded w-16" />
                  <div className="h-3 bg-slate-200 rounded w-16" />
                </div>
                <div className="h-6 bg-slate-200 rounded w-1/3 mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="text-center py-12 px-4 bg-red-50 border border-dashed border-red-200 rounded-3xl">
          <div className="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <WifiOff className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Không thể kết nối máy chủ</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">{error}</p>
          <button
            onClick={resetMarketFilters}
            className="px-5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !error && listings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing) => (
            <PropertyCard
              key={listing.id}
              listing={listing}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && listings.length === 0 && (
        <div
          id="market-empty-state"
          className="text-center py-16 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-3xl"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Chưa có BĐS phù hợp với bộ lọc này.
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            Hãy thử mở rộng khoảng giá, chọn thêm khu vực hoặc để trợ lý AI gợi ý các bất động sản tiềm năng tương đương.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="empty-reset-filter-btn"
              onClick={resetMarketFilters}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
            <button
              id="empty-ask-ai-btn"
              onClick={handleAskAIAlternative}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hỏi AI tìm phương án khác</span>
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Trước
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && (arr[idx - 1] as number) !== p - 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`dot-${idx}`} className="px-2 text-slate-400 text-xs">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => onPageChange(p as number)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      p === page
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Sau
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};

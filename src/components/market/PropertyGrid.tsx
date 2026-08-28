import React from 'react';
import { ChevronDown, Sparkles, RotateCcw, AlertCircle, ArrowUpDown } from 'lucide-react';
import { PropertyListing } from '../../types';
import { PropertyCard } from './PropertyCard';
import { useAppState } from '../../state/useAppState';

interface PropertyGridProps {
  listings: PropertyListing[];
  onOpenDetail: (listing: PropertyListing) => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({ listings, onOpenDetail }) => {
  const { 
    marketFilters, 
    setMarketFilters, 
    resetMarketFilters, 
    openChatTab,
    selectedCity 
  } = useAppState();

  // Filter listings based on current filter state
  const filteredListings = listings.filter((item) => {
    // 1. Mode: sale or rent
    if (item.mode !== marketFilters.mode) return false;

    // 2. Search query
    if (marketFilters.searchQuery.trim()) {
      const q = marketFilters.searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchProject = item.projectName?.toLowerCase().includes(q) || false;
      const matchAddress = item.address.toLowerCase().includes(q);
      const matchDistrict = item.district.toLowerCase().includes(q);
      const matchType = item.propertyType.toLowerCase().includes(q);
      if (!matchTitle && !matchProject && !matchAddress && !matchDistrict && !matchType) {
        return false;
      }
    }

    // 3. District filter
    if (marketFilters.districts.length > 0) {
      if (!marketFilters.districts.includes(item.district)) {
        return false;
      }
    }

    // 4. Property type filter
    if (marketFilters.propertyTypes.length > 0) {
      if (!marketFilters.propertyTypes.includes(item.propertyType)) {
        return false;
      }
    }

    // 5. Price filter
    if (marketFilters.priceRange !== 'Tất cả') {
      const val = item.priceValueNumber;
      if (marketFilters.mode === 'sale') {
        if (marketFilters.priceRange === '<3 tỷ' && val >= 3) return false;
        if (marketFilters.priceRange === '3–5 tỷ' && (val < 3 || val > 5)) return false;
        if (marketFilters.priceRange === '5–7 tỷ' && (val < 5 || val > 7)) return false;
        if (marketFilters.priceRange === '7–10 tỷ' && (val < 7 || val > 10)) return false;
        if (marketFilters.priceRange === '10–20 tỷ' && (val < 10 || val > 20)) return false;
        if (marketFilters.priceRange === '>20 tỷ' && val <= 20) return false;
      } else {
        if (marketFilters.priceRange === '<10 triệu' && val >= 10) return false;
        if (marketFilters.priceRange === '10–20 triệu' && (val < 10 || val > 20)) return false;
        if (marketFilters.priceRange === '20–30 triệu' && (val < 20 || val > 30)) return false;
        if (marketFilters.priceRange === '30–50 triệu' && (val < 30 || val > 50)) return false;
        if (marketFilters.priceRange === '>50 triệu' && val <= 50) return false;
      }
    }

    // 6. Area filter
    if (marketFilters.areaRange !== 'Tất cả') {
      const a = item.area;
      if (marketFilters.areaRange === '<50m²' && a >= 50) return false;
      if (marketFilters.areaRange === '50–70m²' && (a < 50 || a > 70)) return false;
      if (marketFilters.areaRange === '70–100m²' && (a < 70 || a > 100)) return false;
      if (marketFilters.areaRange === '100–150m²' && (a < 100 || a > 150)) return false;
      if (marketFilters.areaRange === '>150m²' && a <= 150) return false;
    }

    // 7. Bedrooms filter
    if (marketFilters.bedrooms !== 'Tất cả') {
      const pn = item.bedrooms;
      if (marketFilters.bedrooms === 'Studio' && pn !== 1 && pn !== 0) return false;
      if (marketFilters.bedrooms === '1PN' && pn !== 1) return false;
      if (marketFilters.bedrooms === '2PN' && pn !== 2) return false;
      if (marketFilters.bedrooms === '3PN' && pn !== 3) return false;
      if (marketFilters.bedrooms === '4PN+' && pn < 4) return false;
    }

    return true;
  });

  // Sort logic
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (marketFilters.sortBy === 'price_asc') {
      return a.priceValueNumber - b.priceValueNumber;
    }
    if (marketFilters.sortBy === 'price_desc') {
      return b.priceValueNumber - a.priceValueNumber;
    }
    if (marketFilters.sortBy === 'area_desc') {
      return b.area - a.area;
    }
    if (marketFilters.sortBy === 'price_per_m2_asc') {
      const priceA = a.priceValueNumber / (a.area || 1);
      const priceB = b.priceValueNumber / (b.area || 1);
      return priceA - priceB;
    }
    // Default: latest (keep list order)
    return 0;
  });

  const handleAskAIAlternative = () => {
    openChatTab('Tôi đang tìm bất động sản nhưng chưa thấy căn phù hợp với bộ lọc hiện tại. AI có thể tư vấn các phương án hoặc khu vực thay thế tương đương không?');
  };

  return (
    <div id="market-property-grid-container" className="space-y-4">
      
      {/* Result Header & Sort Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            {sortedListings.length} BĐS đang {marketFilters.mode === 'sale' ? 'bán' : 'cho thuê'} tại {selectedCity}
          </h2>
          <p className="text-xs text-slate-500">
            Hiển thị danh sách bất động sản khớp với các tiêu chí tìm kiếm
          </p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 hidden sm:inline">Sắp xếp:</span>
          <div className="relative inline-block">
            <select
              id="market-sort-select"
              value={marketFilters.sortBy}
              onChange={(e) => setMarketFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="latest">Mới nhất</option>
              <option value="price_asc">Giá: Thấp → Cao</option>
              <option value="price_desc">Giá: Cao → Thấp</option>
              <option value="area_desc">Diện tích: Lớn nhất</option>
              <option value="price_per_m2_asc">Giá/m²: Thấp nhất</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid or Empty State */}
      {sortedListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedListings.map((listing) => (
            <PropertyCard
              key={listing.id}
              listing={listing}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
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

    </div>
  );
};

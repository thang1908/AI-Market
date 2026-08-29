import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, Check, X, RotateCcw } from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { PropertyType } from '../../types';

export const HANOI_DISTRICTS = [
  'Tây Hồ',
  'Cầu Giấy',
  'Nam Từ Liêm',
  'Long Biên',
  'Hà Đông',
  'Gia Lâm',
  'Ba Đình',
  'Hoàng Mai',
  'Thanh Xuân',
  'Bắc Từ Liêm',
  'Đống Đa',
  'Hai Bà Trưng'
];

export const PROPERTY_TYPES: PropertyType[] = [
  'Căn hộ',
  'Nhà riêng',
  'Nhà phố',
  'Biệt thự',
  'Đất',
  'Shophouse',
  'Khác'
];

export const SALE_PRICES = [
  'Tất cả',
  '<3 tỷ',
  '3–5 tỷ',
  '5–7 tỷ',
  '7–10 tỷ',
  '10–20 tỷ',
  '>20 tỷ'
];

export const RENT_PRICES = [
  'Tất cả',
  '<10 triệu',
  '10–20 triệu',
  '20–30 triệu',
  '30–50 triệu',
  '>50 triệu'
];

export const AREA_RANGES = [
  'Tất cả',
  '<50m²',
  '50–70m²',
  '70–100m²',
  '100–150m²',
  '>150m²'
];

export const BEDROOM_OPTIONS = [
  'Tất cả',
  'Studio',
  '1PN',
  '2PN',
  '3PN',
  '4PN+'
];

interface MarketFiltersProps {
  onOpenAdvancedModal: () => void;
}

export const MarketFilters: React.FC<MarketFiltersProps> = ({ onOpenAdvancedModal }) => {
  const { marketFilters, setMarketFilters, resetMarketFilters } = useAppState();
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  const handleDistrictToggle = (district: string) => {
    setMarketFilters(prev => {
      const exists = prev.districts.includes(district);
      return {
        ...prev,
        districts: exists 
          ? prev.districts.filter(d => d !== district)
          : [...prev.districts, district]
      };
    });
  };

  const handleTypeToggle = (type: PropertyType) => {
    setMarketFilters(prev => {
      const exists = prev.propertyTypes.includes(type);
      return {
        ...prev,
        propertyTypes: exists 
          ? prev.propertyTypes.filter(t => t !== type)
          : [...prev.propertyTypes, type]
      };
    });
  };

  const handleSelectPrice = (price: string) => {
    setMarketFilters(prev => ({ ...prev, priceRange: price }));
    setActiveDropdown(null);
  };

  const handleSelectArea = (area: string) => {
    setMarketFilters(prev => ({ ...prev, areaRange: area }));
    setActiveDropdown(null);
  };

  const handleSelectBedrooms = (pn: string) => {
    setMarketFilters(prev => ({ ...prev, bedrooms: pn }));
    setActiveDropdown(null);
  };

  const activePriceList = marketFilters.mode === 'sale' ? SALE_PRICES : RENT_PRICES;

  const hasActiveFilters = 
    marketFilters.districts.length > 0 ||
    marketFilters.propertyTypes.length > 0 ||
    marketFilters.priceRange !== 'Tất cả' ||
    marketFilters.areaRange !== 'Tất cả' ||
    marketFilters.bedrooms !== 'Tất cả' ||
    marketFilters.searchQuery.trim() !== '';

  return (
    <div className="relative z-20 mb-6">
      
      {/* Filter Buttons Horizontal Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        
        {/* District Multi-select Dropdown */}
        <div className="relative">
          <button
            id="filter-btn-district"
            onClick={() => toggleDropdown('district')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              marketFilters.districts.length > 0
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span>
              Khu vực {marketFilters.districts.length > 0 && `(${marketFilters.districts.length})`}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activeDropdown === 'district' && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Quận / Huyện Hà Nội</span>
                {marketFilters.districts.length > 0 && (
                  <button
                    onClick={() => setMarketFilters(prev => ({ ...prev, districts: [] }))}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Bỏ chọn
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
                {HANOI_DISTRICTS.map((d) => (
                  <button
                    key={d}
                    onClick={() => handleDistrictToggle(d)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      marketFilters.districts.includes(d)
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{d}</span>
                    {marketFilters.districts.includes(d) && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Property Type Dropdown */}
        <div className="relative">
          <button
            id="filter-btn-property-type"
            onClick={() => toggleDropdown('type')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              marketFilters.propertyTypes.length > 0
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span>
              Loại hình {marketFilters.propertyTypes.length > 0 && `(${marketFilters.propertyTypes.length})`}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activeDropdown === 'type' && (
            <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Loại hình BĐS</span>
                {marketFilters.propertyTypes.length > 0 && (
                  <button
                    onClick={() => setMarketFilters(prev => ({ ...prev, propertyTypes: [] }))}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Bỏ chọn
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {PROPERTY_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTypeToggle(t)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      marketFilters.propertyTypes.includes(t)
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t}</span>
                    {marketFilters.propertyTypes.includes(t) && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price Dropdown */}
        <div className="relative">
          <button
            id="filter-btn-price"
            onClick={() => toggleDropdown('price')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              marketFilters.priceRange !== 'Tất cả'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span>Mức giá: {marketFilters.priceRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activeDropdown === 'price' && (
            <div className="absolute left-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="space-y-0.5">
                {activePriceList.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSelectPrice(p)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs ${
                      marketFilters.priceRange === p
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{p}</span>
                    {marketFilters.priceRange === p && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Area Dropdown */}
        <div className="relative">
          <button
            id="filter-btn-area"
            onClick={() => toggleDropdown('area')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              marketFilters.areaRange !== 'Tất cả'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span>Diện tích: {marketFilters.areaRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activeDropdown === 'area' && (
            <div className="absolute left-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="space-y-0.5">
                {AREA_RANGES.map((a) => (
                  <button
                    key={a}
                    onClick={() => handleSelectArea(a)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs ${
                      marketFilters.areaRange === a
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{a}</span>
                    {marketFilters.areaRange === a && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bedrooms Dropdown */}
        <div className="relative">
          <button
            id="filter-btn-bedrooms"
            onClick={() => toggleDropdown('bedrooms')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              marketFilters.bedrooms !== 'Tất cả'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span>Số PN: {marketFilters.bedrooms}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activeDropdown === 'bedrooms' && (
            <div className="absolute left-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="space-y-0.5">
                {BEDROOM_OPTIONS.map((pn) => (
                  <button
                    key={pn}
                    onClick={() => handleSelectBedrooms(pn)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs ${
                      marketFilters.bedrooms === pn
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{pn}</span>
                    {marketFilters.bedrooms === pn && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* All Filters Modal trigger */}
        <button
          id="filter-btn-all-modal"
          onClick={onOpenAdvancedModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200/90 text-slate-700 hover:border-slate-300 transition-all whitespace-nowrap"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>Bộ lọc</span>
        </button>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            id="filter-btn-reset"
            onClick={resetMarketFilters}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors whitespace-nowrap"
            title="Xóa tất cả bộ lọc"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa lọc</span>
          </button>
        )}

      </div>

      {/* Backdrop to close popovers on click outside */}
      {activeDropdown && (
        <div
          onClick={() => setActiveDropdown(null)}
          className="fixed inset-0 z-40 bg-transparent"
        />
      )}

    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, SlidersHorizontal, Check, X, RotateCcw, MapPin, Search } from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { PropertyType } from '../../types';
import { geographyApi, City, District } from '../../api/geographyApi';

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
  'Hai Bà Trưng',
  'Hoàn Kiếm'
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
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [districtSearch, setDistrictSearch] = useState<string>('');
  const [citySearch, setCitySearch] = useState<string>('');
  const [isLoadingGeography, setIsLoadingGeography] = useState<boolean>(false);

  // 1. Tải danh sách Tỉnh / Thành phố từ API Backend
  useEffect(() => {
    let isMounted = true;
    const loadCities = async () => {
      try {
        const data = await geographyApi.getCities();
        if (isMounted && data.length > 0) {
          setCities(data);
        }
      } catch (err) {
        console.warn('Không thể nạp danh sách Tỉnh/Thành từ API:', err);
      }
    };
    loadCities();
    return () => { isMounted = false; };
  }, []);

  // 2. Tải danh sách Quận / Huyện tương ứng với Tỉnh/Thành đã chọn
  useEffect(() => {
    let isMounted = true;
    const loadDistricts = async () => {
      if (!marketFilters.cityId) return;
      setIsLoadingGeography(true);
      try {
        const data = await geographyApi.getDistrictsByCity(marketFilters.cityId);
        if (isMounted) {
          setDistricts(data);
        }
      } catch (err) {
        console.warn(`Không thể nạp quận huyện của ${marketFilters.cityId}:`, err);
      } finally {
        if (isMounted) setIsLoadingGeography(false);
      }
    };
    loadDistricts();
    return () => { isMounted = false; };
  }, [marketFilters.cityId]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const handleCitySelect = (city: City) => {
    setMarketFilters(prev => ({
      ...prev,
      cityId: city.id,
      districts: [], // Reset quận huyện khi đổi tỉnh thành
    }));
    closeDropdown();
  };

  const handleDistrictToggle = (districtName: string) => {
    setMarketFilters(prev => {
      const exists = prev.districts.includes(districtName);
      return {
        ...prev,
        districts: exists 
          ? prev.districts.filter(d => d !== districtName)
          : [...prev.districts, districtName]
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
    closeDropdown();
  };

  const handleSelectArea = (area: string) => {
    setMarketFilters(prev => ({ ...prev, areaRange: area }));
    closeDropdown();
  };

  const handleSelectBedrooms = (pn: string) => {
    setMarketFilters(prev => ({ ...prev, bedrooms: pn }));
    closeDropdown();
  };

  const activePriceList = marketFilters.mode === 'sale' ? SALE_PRICES : RENT_PRICES;
  const currentCityName = cities.find(c => c.id === marketFilters.cityId)?.name || 'Hà Nội';

  const filteredCities = cities.filter(c => 
    c.name.toLowerCase().includes(citySearch.toLowerCase().trim())
  );

  const filteredDistricts = districts.filter(d => 
    d.name.toLowerCase().includes(districtSearch.toLowerCase().trim())
  );

  const hasActiveFilters = 
    marketFilters.districts.length > 0 ||
    marketFilters.propertyTypes.length > 0 ||
    marketFilters.priceRange !== 'Tất cả' ||
    marketFilters.areaRange !== 'Tất cả' ||
    marketFilters.bedrooms !== 'Tất cả' ||
    marketFilters.searchQuery.trim() !== '';

  return (
    <div className="relative z-30 mb-6">
      
      {/* Click-away backdrop to close open dropdown cleanly */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-30 bg-transparent" 
          onClick={closeDropdown} 
        />
      )}

      {/* Filter Buttons Container */}
      <div className="flex flex-wrap items-center gap-2">
        
        {/* 1. City / Province Selector Dropdown */}
        <div className="relative">
          <button
            id="filter-btn-city"
            onClick={() => toggleDropdown('city')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              activeDropdown === 'city'
                ? 'bg-blue-100 border-blue-400 text-blue-900 shadow-sm'
                : 'bg-blue-50/80 border-blue-200 text-blue-800 hover:bg-blue-100/80'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="max-w-[110px] truncate">{currentCityName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
          </button>

          {activeDropdown === 'city' && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Tỉnh / Thành phố</span>
                <span className="text-[10px] font-semibold text-slate-400">{cities.length || 63} tỉnh thành</span>
              </div>
              
              {/* City Search Bar */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Tìm tỉnh thành..."
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 focus:bg-white"
                  autoFocus
                />
              </div>

              <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
                {filteredCities.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCitySelect(c)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      marketFilters.cityId === c.id
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    {marketFilters.cityId === c.id && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. District Multi-select Dropdown */}
        <div className="relative">
          <button
            id="filter-btn-district"
            onClick={() => toggleDropdown('district')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              marketFilters.districts.length > 0
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span>
              Quận/Huyện {marketFilters.districts.length > 0 && `(${marketFilters.districts.length})`}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activeDropdown === 'district' && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Quận / Huyện ({currentCityName})</span>
                {marketFilters.districts.length > 0 && (
                  <button
                    onClick={() => setMarketFilters(prev => ({ ...prev, districts: [] }))}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Bỏ chọn ({marketFilters.districts.length})
                  </button>
                )}
              </div>

              {/* District Search Bar */}
              {districts.length > 8 && (
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={districtSearch}
                    onChange={(e) => setDistrictSearch(e.target.value)}
                    placeholder="Tìm quận / huyện..."
                    className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 focus:bg-white"
                    autoFocus
                  />
                </div>
              )}

              {isLoadingGeography ? (
                <div className="py-6 text-center text-xs text-slate-400">Đang tải danh sách quận huyện...</div>
              ) : filteredDistricts.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">Không tìm thấy quận huyện phù hợp</div>
              ) : (
                <div className="grid grid-cols-2 gap-1 max-h-52 overflow-y-auto pr-1">
                  {filteredDistricts.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleDistrictToggle(d.name)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                        marketFilters.districts.includes(d.name)
                          ? 'bg-blue-50 text-blue-600 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{d.name}</span>
                      {marketFilters.districts.includes(d.name) && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Property Type Dropdown */}
        <div className="relative">
          <button
            id="filter-btn-property-type"
            onClick={() => toggleDropdown('type')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
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
            <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 z-40 animate-in fade-in zoom-in-95 duration-100">
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
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
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

        {/* 4. Price Range Dropdown */}
        <div className="relative">
          <button
            id="filter-btn-price"
            onClick={() => toggleDropdown('price')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              marketFilters.priceRange !== 'Tất cả'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span>
              {marketFilters.priceRange !== 'Tất cả' ? `Giá: ${marketFilters.priceRange}` : 'Mức giá'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activeDropdown === 'price' && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="space-y-0.5">
                {activePriceList.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSelectPrice(p)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      marketFilters.priceRange === p
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{p}</span>
                    {marketFilters.priceRange === p && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Area Range Dropdown */}
        <div className="relative">
          <button
            id="filter-btn-area"
            onClick={() => toggleDropdown('area')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              marketFilters.areaRange !== 'Tất cả'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span>
              {marketFilters.areaRange !== 'Tất cả' ? `DT: ${marketFilters.areaRange}` : 'Diện tích'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activeDropdown === 'area' && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="space-y-0.5">
                {AREA_RANGES.map((a) => (
                  <button
                    key={a}
                    onClick={() => handleSelectArea(a)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      marketFilters.areaRange === a
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{a}</span>
                    {marketFilters.areaRange === a && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 6. Bedrooms Dropdown */}
        <div className="relative">
          <button
            id="filter-btn-bedrooms"
            onClick={() => toggleDropdown('bedrooms')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              marketFilters.bedrooms !== 'Tất cả'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span>
              {marketFilters.bedrooms !== 'Tất cả' ? `${marketFilters.bedrooms}` : 'Số phòng ngủ'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activeDropdown === 'bedrooms' && (
            <div className="absolute left-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="space-y-0.5">
                {BEDROOM_OPTIONS.map((pn) => (
                  <button
                    key={pn}
                    onClick={() => handleSelectBedrooms(pn)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      marketFilters.bedrooms === pn
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{pn}</span>
                    {marketFilters.bedrooms === pn && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Advanced Filters Modal Button */}
        <button
          id="filter-btn-advanced"
          onClick={onOpenAdvancedModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200/90 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all whitespace-nowrap"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>Bộ lọc khác</span>
        </button>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={resetMarketFilters}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50/80 hover:bg-red-100/80 border border-red-200/80 transition-all whitespace-nowrap"
            title="Đặt lại toàn bộ bộ lọc"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Xóa lọc</span>
          </button>
        )}
      </div>

    </div>
  );
};

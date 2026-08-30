import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Check, MapPin } from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { PROPERTY_TYPES, SALE_PRICES, RENT_PRICES, AREA_RANGES, BEDROOM_OPTIONS } from './MarketFilters';
import { PropertyType } from '../../types';
import { geographyApi, City, District } from '../../api/geographyApi';

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({ isOpen, onClose }) => {
  const { marketFilters, setMarketFilters, resetMarketFilters } = useAppState();

  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    const loadCities = async () => {
      try {
        const data = await geographyApi.getCities();
        if (isMounted) setCities(data);
      } catch (err) {
        console.warn('Lỗi tải tỉnh thành trong Modal:', err);
      }
    };
    loadCities();
    return () => { isMounted = false; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !marketFilters.cityId) return;
    let isMounted = true;
    const loadDistricts = async () => {
      setIsLoadingDistricts(true);
      try {
        const data = await geographyApi.getDistrictsByCity(marketFilters.cityId);
        if (isMounted) setDistricts(data);
      } catch (err) {
        console.warn('Lỗi tải quận huyện trong Modal:', err);
      } finally {
        if (isMounted) setIsLoadingDistricts(false);
      }
    };
    loadDistricts();
    return () => { isMounted = false; };
  }, [isOpen, marketFilters.cityId]);

  if (!isOpen) return null;

  const handleCityChange = (cityId: string) => {
    setMarketFilters(prev => ({
      ...prev,
      cityId: cityId,
      districts: [], // Reset quận huyện khi đổi thành phố
    }));
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

  const activePrices = marketFilters.mode === 'sale' ? SALE_PRICES : RENT_PRICES;
  const currentCityName = cities.find(c => c.id === marketFilters.cityId)?.name || 'Hà Nội';

  return (
    <div id="advanced-filters-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        id="advanced-filters-modal"
        className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">Tất cả bộ lọc tìm kiếm</h3>
            <p className="text-xs text-slate-400">Tùy chỉnh tiêu chí bất động sản chính xác nhất</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Sections */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* 1. Tỉnh / Thành phố */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Tỉnh / Thành phố
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {cities.slice(0, 12).map((c) => {
                const selected = marketFilters.cityId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCityChange(c.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100'
                    }`}
                  >
                    <MapPin className={`w-3 h-3 ${selected ? 'text-white' : 'text-slate-400'}`} />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Districts of selected city */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Khu vực Quận / Huyện ({currentCityName})
              </label>
              {marketFilters.districts.length > 0 && (
                <button
                  onClick={() => setMarketFilters(prev => ({ ...prev, districts: [] }))}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Xóa chọn ({marketFilters.districts.length})
                </button>
              )}
            </div>
            {isLoadingDistricts ? (
              <div className="py-4 text-center text-xs text-slate-400">Đang tải danh sách quận huyện...</div>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                {districts.map((d) => {
                  const selected = marketFilters.districts.includes(d.name);
                  return (
                    <button
                      key={d.id}
                      onClick={() => handleDistrictToggle(d.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        selected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100'
                      }`}
                    >
                      {d.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Property Types */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Loại hình bất động sản
              </label>
              {marketFilters.propertyTypes.length > 0 && (
                <button
                  onClick={() => setMarketFilters(prev => ({ ...prev, propertyTypes: [] }))}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Xóa chọn ({marketFilters.propertyTypes.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PROPERTY_TYPES.map((t) => {
                const selected = marketFilters.propertyTypes.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => handleTypeToggle(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Price Range */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Mức giá {marketFilters.mode === 'sale' ? '(Bán)' : '(Thuê theo tháng)'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {activePrices.map((p) => {
                const selected = marketFilters.priceRange === p;
                return (
                  <button
                    key={p}
                    onClick={() => setMarketFilters(prev => ({ ...prev, priceRange: p }))}
                    className={`py-2 px-3 rounded-xl text-xs border text-center transition-all ${
                      selected
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-extrabold shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Area Range */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Diện tích sử dụng
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {AREA_RANGES.map((a) => {
                const selected = marketFilters.areaRange === a;
                return (
                  <button
                    key={a}
                    onClick={() => setMarketFilters(prev => ({ ...prev, areaRange: a }))}
                    className={`py-2 px-3 rounded-xl text-xs border text-center transition-all ${
                      selected
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-extrabold shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Bedrooms */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Số phòng ngủ
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {BEDROOM_OPTIONS.map((pn) => {
                const selected = marketFilters.bedrooms === pn;
                return (
                  <button
                    key={pn}
                    onClick={() => setMarketFilters(prev => ({ ...prev, bedrooms: pn }))}
                    className={`py-2 px-2 rounded-xl text-xs border text-center transition-all ${
                      selected
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-extrabold shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    {pn}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={resetMarketFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại tất cả</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Áp dụng bộ lọc
          </button>
        </div>

      </div>
    </div>
  );
};

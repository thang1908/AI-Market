import React, { useState } from 'react';
import { ChevronDown, Check, RotateCcw, MapPin, Building2, DollarSign, Clock } from 'lucide-react';
import { useAppState } from '../../state/useAppState';

export const PROJECT_DISTRICTS = [
  'Tất cả',
  'Nam Từ Liêm',
  'Tây Hồ',
  'Cầu Giấy',
  'Gia Lâm',
  'Hà Đông',
  'Hưng Yên'
];

export const PROJECT_DEVELOPERS = [
  'Tất cả',
  'CapitaLand',
  'Masterise Homes',
  'Vinhomes',
  'MIK Group',
  'Hesco & An Lạc'
];

export const PROJECT_PRICES = [
  'Tất cả',
  'Dưới 5 tỷ',
  '5 - 8 tỷ',
  '8 - 15 tỷ',
  'Trên 15 tỷ'
];

export const PROJECT_STATUSES = [
  'Tất cả',
  'Đang mở bán',
  'Sắp mở bán',
  'Đang bàn giao'
];

export const ProjectFilters: React.FC = () => {
  const { projectFilters, setProjectFilters, resetProjectFilters } = useAppState();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  const handleSelectDistrict = (district: string) => {
    setProjectFilters(prev => ({
      ...prev,
      districts: district === 'Tất cả' ? [] : [district]
    }));
    setActiveDropdown(null);
  };

  const handleSelectDeveloper = (dev: string) => {
    setProjectFilters(prev => ({
      ...prev,
      developer: dev
    }));
    setActiveDropdown(null);
  };

  const handleSelectPrice = (p: string) => {
    setProjectFilters(prev => ({
      ...prev,
      priceRange: p
    }));
    setActiveDropdown(null);
  };

  const handleSelectStatus = (s: string) => {
    setProjectFilters(prev => ({
      ...prev,
      status: s
    }));
    setActiveDropdown(null);
  };

  const hasActiveFilters = 
    projectFilters.districts.length > 0 ||
    projectFilters.developer !== 'Tất cả' ||
    projectFilters.priceRange !== 'Tất cả' ||
    projectFilters.status !== 'Tất cả' ||
    Boolean(projectFilters.searchQuery);

  return (
    <div id="project-manual-filters-bar" className="relative z-20 mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        
        {/* Khu vực Dropdown */}
        <div className="relative">
          <button
            id="proj-filter-district-btn"
            onClick={() => toggleDropdown('district')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              projectFilters.districts.length > 0
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>
              Khu vực: {projectFilters.districts[0] || 'Tất cả'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activeDropdown === 'district' && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="space-y-0.5">
                {PROJECT_DISTRICTS.map((d) => {
                  const isSelected = (d === 'Tất cả' && projectFilters.districts.length === 0) || projectFilters.districts.includes(d);
                  return (
                    <button
                      key={d}
                      onClick={() => handleSelectDistrict(d)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        isSelected
                          ? 'bg-blue-50 text-blue-600 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{d}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Chủ đầu tư Dropdown */}
        <div className="relative">
          <button
            id="proj-filter-developer-btn"
            onClick={() => toggleDropdown('developer')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              projectFilters.developer !== 'Tất cả'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>
              CĐT: {projectFilters.developer}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activeDropdown === 'developer' && (
            <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="space-y-0.5">
                {PROJECT_DEVELOPERS.map((dev) => (
                  <button
                    key={dev}
                    onClick={() => handleSelectDeveloper(dev)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      projectFilters.developer === dev
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{dev}</span>
                    {projectFilters.developer === dev && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Khoảng giá Dropdown */}
        <div className="relative">
          <button
            id="proj-filter-price-btn"
            onClick={() => toggleDropdown('price')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              projectFilters.priceRange !== 'Tất cả'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            <span>
              Mức giá: {projectFilters.priceRange}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activeDropdown === 'price' && (
            <div className="absolute left-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="space-y-0.5">
                {PROJECT_PRICES.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSelectPrice(p)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      projectFilters.priceRange === p
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{p}</span>
                    {projectFilters.priceRange === p && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Trạng thái Dropdown */}
        <div className="relative">
          <button
            id="proj-filter-status-btn"
            onClick={() => toggleDropdown('status')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              projectFilters.status !== 'Tất cả'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>
              Trạng thái: {projectFilters.status}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activeDropdown === 'status' && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="space-y-0.5">
                {PROJECT_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSelectStatus(s)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      projectFilters.status === s
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{s}</span>
                    {projectFilters.status === s && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            id="proj-filter-reset-btn"
            onClick={resetProjectFilters}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors whitespace-nowrap"
            title="Xóa tất cả bộ lọc dự án"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa lọc</span>
          </button>
        )}

      </div>

      {/* Backdrop to close popovers */}
      {activeDropdown && (
        <div
          onClick={() => setActiveDropdown(null)}
          className="fixed inset-0 z-40 bg-transparent"
        />
      )}
    </div>
  );
};

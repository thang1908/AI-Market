import React, { useState } from 'react';
import { Search, Sparkles, Filter, RotateCcw, Building2, MapPin, DollarSign, X } from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { mockProjects } from '../../data/mockPrimaryProjects';

const DEVELOPERS = [
  'Tất cả',
  'CapitaLand',
  'Masterise Homes',
  'Vinhomes',
  'MIK Group',
  'Hesco & An Lạc'
];

const PRICE_RANGES = [
  'Tất cả',
  'Dưới 5 tỷ',
  '5 - 8 tỷ',
  '8 - 15 tỷ',
  'Trên 15 tỷ'
];

const PROJECT_STATUSES = [
  'Tất cả',
  'Đang mở bán',
  'Sắp mở bán',
  'Đang bàn giao'
];

const DISTRICTS = [
  'Tất cả',
  'Nam Từ Liêm',
  'Tây Hồ',
  'Cầu Giấy',
  'Gia Lâm',
  'Hà Đông',
  'Hưng Yên'
];

const QUICK_AI_PROMPTS = [
  'Dự án Vinhomes dưới 8 tỷ',
  'Mới mở bán ở Tây Hà Nội',
  'Chung cư sơ cấp 3PN Tây Hồ',
  'Masterise Homes Hà Nội',
  'Dự án sắp bàn giao 2024'
];

export const ProjectSearchBar: React.FC = () => {
  const { projectFilters, setProjectFilters, resetProjectFilters } = useAppState();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localInput, setLocalInput] = useState(projectFilters.searchQuery || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    parseNaturalLanguageSearch(localInput);
  };

  const parseNaturalLanguageSearch = (query: string) => {
    const q = query.trim().toLowerCase();
    let detectedDistrict: string[] = [];
    let detectedDeveloper = 'Tất cả';
    let detectedPrice = 'Tất cả';
    let detectedStatus = 'Tất cả';

    if (q.includes('tây hồ')) detectedDistrict = ['Tây Hồ'];
    else if (q.includes('nam từ liêm') || q.includes('tây hà nội') || q.includes('mễ trì') || q.includes('tây mỗ')) detectedDistrict = ['Nam Từ Liêm'];
    else if (q.includes('cầu giấy')) detectedDistrict = ['Cầu Giấy'];
    else if (q.includes('hà đông')) detectedDistrict = ['Hà Đông'];
    else if (q.includes('hưng yên') || q.includes('ocean park')) detectedDistrict = ['Hưng Yên'];

    if (q.includes('capitaland') || q.includes('lumi') || q.includes('heritage')) detectedDeveloper = 'CapitaLand';
    else if (q.includes('masterise') || q.includes('masteri')) detectedDeveloper = 'Masterise Homes';
    else if (q.includes('vinhomes') || q.includes('vin')) detectedDeveloper = 'Vinhomes';
    else if (q.includes('mik') || q.includes('matrix')) detectedDeveloper = 'MIK Group';

    if (q.includes('dưới 5 tỷ') || q.includes('3 tỷ') || q.includes('4 tỷ')) detectedPrice = 'Dưới 5 tỷ';
    else if (q.includes('dưới 8 tỷ') || q.includes('5 - 8 tỷ') || q.includes('6 tỷ') || q.includes('7 tỷ')) detectedPrice = '5 - 8 tỷ';
    else if (q.includes('8 - 15 tỷ') || q.includes('10 tỷ') || q.includes('12 tỷ')) detectedPrice = '8 - 15 tỷ';
    else if (q.includes('trên 15 tỷ') || q.includes('20 tỷ') || q.includes('penthouse') || q.includes('biệt thự')) detectedPrice = 'Trên 15 tỷ';

    if (q.includes('mới mở bán') || q.includes('mở bán')) detectedStatus = 'Đang mở bán';
    else if (q.includes('sắp mở bán')) detectedStatus = 'Sắp mở bán';
    else if (q.includes('bàn giao') || q.includes('ở ngay')) detectedStatus = 'Đang bàn giao';

    setProjectFilters(prev => ({
      ...prev,
      searchQuery: query.trim(),
      districts: detectedDistrict.length > 0 ? detectedDistrict : prev.districts,
      developer: detectedDeveloper !== 'Tất cả' ? detectedDeveloper : prev.developer,
      priceRange: detectedPrice !== 'Tất cả' ? detectedPrice : prev.priceRange,
      status: detectedStatus !== 'Tất cả' ? detectedStatus : prev.status
    }));
  };

  const handleQuickPrompt = (prompt: string) => {
    setLocalInput(prompt);
    parseNaturalLanguageSearch(prompt);
  };

  const hasActiveFilters = 
    projectFilters.districts.length > 0 ||
    projectFilters.developer !== 'Tất cả' ||
    projectFilters.priceRange !== 'Tất cả' ||
    projectFilters.status !== 'Tất cả' ||
    Boolean(projectFilters.searchQuery);

  return (
    <div id="project-search-bar" className="w-full max-w-5xl mx-auto mb-8 space-y-3">
      {/* Main Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center bg-white rounded-2xl border-2 border-blue-500/30 hover:border-blue-500 shadow-lg shadow-blue-500/5 transition-all p-1.5 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10">
          <div className="pl-3.5 pr-2 text-blue-600 flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <input
            id="project-ai-search-input"
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Tìm dự án theo khu vực, CĐT, ngân sách hoặc nhu cầu (VD: Dự án Vinhomes dưới 8 tỷ)..."
            className="w-full bg-transparent border-none text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-hidden px-2 font-medium"
          />

          {localInput && (
            <button
              type="button"
              onClick={() => {
                setLocalInput('');
                setProjectFilters(prev => ({ ...prev, searchQuery: '' }));
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              id="project-toggle-filter-btn"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showAdvanced || hasActiveFilters
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bộ lọc</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </button>

            <button
              type="submit"
              id="project-submit-search-btn"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Tìm kiếm</span>
            </button>
          </div>
        </div>
      </form>

      {/* Quick AI Search Suggestions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-500 font-medium whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          Gợi ý tìm kiếm:
        </span>
        {QUICK_AI_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleQuickPrompt(prompt)}
            className="px-3 py-1 bg-slate-100/90 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-transparent rounded-full text-slate-600 whitespace-nowrap transition-all font-medium text-xs shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Advanced Filter Drawer / Pills */}
      {showAdvanced && (
        <div 
          id="project-filter-drawer"
          className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Khu vực */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Khu vực
              </label>
              <select
                value={projectFilters.districts[0] || 'Tất cả'}
                onChange={(e) => {
                  const val = e.target.value;
                  setProjectFilters(prev => ({
                    ...prev,
                    districts: val === 'Tất cả' ? [] : [val]
                  }));
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              >
                {DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Chủ đầu tư */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Chủ đầu tư
              </label>
              <select
                value={projectFilters.developer || 'Tất cả'}
                onChange={(e) => {
                  const val = e.target.value;
                  setProjectFilters(prev => ({
                    ...prev,
                    developer: val
                  }));
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              >
                {DEVELOPERS.map(dev => (
                  <option key={dev} value={dev}>{dev}</option>
                ))}
              </select>
            </div>

            {/* Khoảng giá */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                Khoảng giá
              </label>
              <select
                value={projectFilters.priceRange || 'Tất cả'}
                onChange={(e) => {
                  const val = e.target.value;
                  setProjectFilters(prev => ({
                    ...prev,
                    priceRange: val
                  }));
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              >
                {PRICE_RANGES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Trạng thái dự án */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Trạng thái
              </label>
              <select
                value={projectFilters.status || 'Tất cả'}
                onChange={(e) => {
                  const val = e.target.value;
                  setProjectFilters(prev => ({
                    ...prev,
                    status: val
                  }));
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              >
                {PROJECT_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Reset Filters & Summary */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
            <span className="text-slate-500">
              Đang hiển thị các dự án sơ cấp khớp với tiêu chí tìm kiếm
            </span>
            <button
              type="button"
              onClick={() => {
                resetProjectFilters();
                setLocalInput('');
              }}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-red-600 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

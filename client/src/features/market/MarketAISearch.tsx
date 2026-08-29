import React, { useState, useEffect } from 'react';
import { Search, Sparkles, X, RotateCcw } from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { HANOI_DISTRICTS } from './MarketFilters';
import { PropertyType, ListingMode } from '../../types';

export interface MarketAISearchProps {
  mode: ListingMode;
}

interface ParsedAIChip {
  id: string;
  type: 'district' | 'bedroom' | 'price' | 'mode' | 'propertyType' | 'developer' | 'status' | 'keyword';
  label: string;
  value: string;
}

const SALE_SUGGESTIONS = [
  'Tìm căn 2PN Tây Hồ dưới 6 tỷ',
  'Nhà 3PN cho gia đình 4 người ở Cầu Giấy',
  'Căn hộ đầu tư khoảng 5 tỷ',
  'Biệt thự Hà Đông 10-20 tỷ'
];

const RENT_SUGGESTIONS = [
  'Căn hộ 2PN Cầu Giấy 10-15 triệu',
  'Studio Tây Hồ view hồ 10-12 triệu',
  'Căn 3PN Nam Từ Liêm cho gia đình',
  'Nhà riêng Ba Đình 20-30 triệu'
];

const PROJECT_SUGGESTIONS = [
  'Dự án Vinhomes dưới 8 tỷ',
  'Mới mở bán ở Tây Hà Nội',
  'Chung cư sơ cấp 3PN Tây Hồ',
  'Masterise Homes Hà Nội',
  'Dự án sắp bàn giao 2024'
];

export const MarketAISearch: React.FC<MarketAISearchProps> = ({ mode }) => {
  const { 
    marketFilters, 
    setMarketFilters, 
    resetMarketFilters,
    projectFilters, 
    setProjectFilters, 
    resetProjectFilters 
  } = useAppState();

  const isProject = mode === 'project';
  const currentQuery = isProject ? projectFilters.searchQuery : marketFilters.searchQuery;
  const [inputValue, setInputValue] = useState(currentQuery || '');
  const [parsedChips, setParsedChips] = useState<ParsedAIChip[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Synchronize input value with active filter state when tab changes
  useEffect(() => {
    const val = isProject ? projectFilters.searchQuery : marketFilters.searchQuery;
    setInputValue(val || '');
    updateChipsFromFilters(val || '');
  }, [mode, isProject]);

  // Extract active chips based on current mode and filters
  const updateChipsFromFilters = (query: string) => {
    const chips: ParsedAIChip[] = [];

    if (isProject) {
      if (query.trim()) {
        chips.push({ id: 'proj-query', type: 'keyword', label: `Từ khóa: "${query.trim()}"`, value: query.trim() });
      }
      projectFilters.districts.forEach(d => {
        chips.push({ id: `proj-dist-${d}`, type: 'district', label: `Khu vực: ${d}`, value: d });
      });
      if (projectFilters.developer !== 'Tất cả') {
        chips.push({ id: 'proj-dev', type: 'developer', label: `CĐT: ${projectFilters.developer}`, value: projectFilters.developer });
      }
      if (projectFilters.priceRange !== 'Tất cả') {
        chips.push({ id: 'proj-price', type: 'price', label: `Giá: ${projectFilters.priceRange}`, value: projectFilters.priceRange });
      }
      if (projectFilters.status !== 'Tất cả') {
        chips.push({ id: 'proj-status', type: 'status', label: `Trạng thái: ${projectFilters.status}`, value: projectFilters.status });
      }
    } else {
      if (query.trim()) {
        chips.push({ id: 'market-query', type: 'keyword', label: `Từ khóa: "${query.trim()}"`, value: query.trim() });
      }
      marketFilters.districts.forEach(d => {
        chips.push({ id: `market-dist-${d}`, type: 'district', label: `Khu vực: ${d}`, value: d });
      });
      marketFilters.propertyTypes.forEach(t => {
        chips.push({ id: `market-type-${t}`, type: 'propertyType', label: `Loại hình: ${t}`, value: t });
      });
      if (marketFilters.priceRange !== 'Tất cả') {
        chips.push({ id: 'market-price', type: 'price', label: `Giá: ${marketFilters.priceRange}`, value: marketFilters.priceRange });
      }
      if (marketFilters.bedrooms !== 'Tất cả') {
        chips.push({ id: 'market-bed', type: 'bedroom', label: `PN: ${marketFilters.bedrooms}`, value: marketFilters.bedrooms });
      }
    }

    setParsedChips(chips);
  };

  // Parse natural language queries into structured filters
  const parseNaturalLanguage = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) {
      if (isProject) {
        resetProjectFilters();
      } else {
        setMarketFilters(prev => ({ ...prev, searchQuery: '' }));
      }
      setParsedChips([]);
      return;
    }

    if (isProject) {
      // 1. Parsing for Primary Projects
      let detectedDistrict: string[] = [];
      let detectedDeveloper = 'Tất cả';
      let detectedPrice = 'Tất cả';
      let detectedStatus = 'Tất cả';

      if (q.includes('tây hồ')) detectedDistrict = ['Tây Hồ'];
      else if (q.includes('nam từ liêm') || q.includes('tây hà nội') || q.includes('mễ trì') || q.includes('tây mỗ')) detectedDistrict = ['Nam Từ Liêm'];
      else if (q.includes('cầu giấy')) detectedDistrict = ['Cầu Giấy'];
      else if (q.includes('hà đông')) detectedDistrict = ['Hà Đông'];
      else if (q.includes('gia lâm')) detectedDistrict = ['Gia Lâm'];
      else if (q.includes('hưng yên') || q.includes('ocean park')) detectedDistrict = ['Hưng Yên'];

      if (q.includes('capitaland') || q.includes('lumi') || q.includes('heritage')) detectedDeveloper = 'CapitaLand';
      else if (q.includes('masterise') || q.includes('masteri')) detectedDeveloper = 'Masterise Homes';
      else if (q.includes('vinhomes') || q.includes('vin')) detectedDeveloper = 'Vinhomes';
      else if (q.includes('mik') || q.includes('matrix')) detectedDeveloper = 'MIK Group';

      if (q.includes('dưới 5 tỷ') || q.includes('< 5 tỷ') || q.includes('3 tỷ') || q.includes('4 tỷ')) detectedPrice = 'Dưới 5 tỷ';
      else if (q.includes('dưới 8 tỷ') || q.includes('5 - 8 tỷ') || q.includes('5 đến 8 tỷ') || q.includes('6 tỷ') || q.includes('7 tỷ')) detectedPrice = '5 - 8 tỷ';
      else if (q.includes('8 - 15 tỷ') || q.includes('8 đến 15 tỷ') || q.includes('10 tỷ') || q.includes('12 tỷ')) detectedPrice = '8 - 15 tỷ';
      else if (q.includes('trên 15 tỷ') || q.includes('> 15 tỷ') || q.includes('20 tỷ') || q.includes('penthouse') || q.includes('biệt thự')) detectedPrice = 'Trên 15 tỷ';

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

    } else {
      // 2. Parsing for Secondary Sale / Rent Listings
      const newDistricts: string[] = [];
      let newBedrooms = 'Tất cả';
      let newPriceRange = 'Tất cả';
      const newPropertyTypes: PropertyType[] = [];

      // Check districts
      for (const d of HANOI_DISTRICTS) {
        if (q.includes(d.toLowerCase())) {
          newDistricts.push(d);
        }
      }

      // Check bedrooms
      if (q.includes('studio')) {
        newBedrooms = 'Studio';
      } else if (q.includes('1pn') || q.includes('1 phòng ngủ') || q.includes('1 pn')) {
        newBedrooms = '1PN';
      } else if (q.includes('2pn') || q.includes('2 phòng ngủ') || q.includes('2 pn')) {
        newBedrooms = '2PN';
      } else if (q.includes('3pn') || q.includes('3 phòng ngủ') || q.includes('3 pn')) {
        newBedrooms = '3PN';
      } else if (q.includes('4pn') || q.includes('4 phòng ngủ') || q.includes('4 pn')) {
        newBedrooms = '4PN+';
      }

      // Check prices
      if (mode === 'rent') {
        if (q.includes('dưới 10 triệu') || q.includes('< 10 triệu') || q.includes('<10tr') || q.includes('dưới 10tr')) {
          newPriceRange = '<10 triệu';
        } else if (q.includes('10-20 triệu') || q.includes('10 đến 20 triệu') || q.includes('10-15 triệu') || q.includes('15 triệu')) {
          newPriceRange = '10–20 triệu';
        } else if (q.includes('20-30 triệu') || q.includes('20 đến 30 triệu') || q.includes('25 triệu')) {
          newPriceRange = '20–30 triệu';
        } else if (q.includes('30-50 triệu') || q.includes('30 đến 50 triệu')) {
          newPriceRange = '30–50 triệu';
        } else if (q.includes('trên 50 triệu') || q.includes('> 50 triệu')) {
          newPriceRange = '>50 triệu';
        }
      } else {
        // Sale price
        if (q.includes('dưới 3 tỷ') || q.includes('< 3 tỷ') || q.includes('dưới 3tỷ')) {
          newPriceRange = '<3 tỷ';
        } else if (q.includes('dưới 6 tỷ') || q.includes('6 tỷ') || q.includes('5-7 tỷ') || q.includes('5 đến 7 tỷ')) {
          newPriceRange = '5–7 tỷ';
        } else if (q.includes('5 tỷ') || q.includes('3-5 tỷ') || q.includes('3 đến 5 tỷ')) {
          newPriceRange = '3–5 tỷ';
        } else if (q.includes('7-10 tỷ') || q.includes('7 đến 10 tỷ') || q.includes('dưới 10 tỷ')) {
          newPriceRange = '7–10 tỷ';
        } else if (q.includes('10-20 tỷ') || q.includes('10 đến 20 tỷ')) {
          newPriceRange = '10–20 tỷ';
        } else if (q.includes('trên 20 tỷ') || q.includes('>20 tỷ')) {
          newPriceRange = '>20 tỷ';
        }
      }

      // Check property types
      if (q.includes('căn hộ') || q.includes('chung cư')) {
        newPropertyTypes.push('Căn hộ');
      }
      if (q.includes('nhà riêng')) {
        newPropertyTypes.push('Nhà riêng');
      }
      if (q.includes('biệt thự')) {
        newPropertyTypes.push('Biệt thự');
      }
      if (q.includes('nhà phố') || q.includes('shophouse')) {
        newPropertyTypes.push('Nhà phố');
      }

      setMarketFilters(prev => ({
        ...prev,
        searchQuery: query.trim(),
        districts: newDistricts.length > 0 ? newDistricts : prev.districts,
        bedrooms: newBedrooms !== 'Tất cả' ? newBedrooms : prev.bedrooms,
        priceRange: newPriceRange !== 'Tất cả' ? newPriceRange : prev.priceRange,
        propertyTypes: newPropertyTypes.length > 0 ? newPropertyTypes : prev.propertyTypes
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (!val.trim()) {
      if (isProject) {
        setProjectFilters(prev => ({ ...prev, searchQuery: '' }));
      } else {
        setMarketFilters(prev => ({ ...prev, searchQuery: '' }));
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setIsAiProcessing(true);
    setTimeout(() => {
      parseNaturalLanguage(inputValue);
      setIsAiProcessing(false);
    }, 180);
  };

  const handleSelectSample = (sample: string) => {
    setInputValue(sample);
    setIsAiProcessing(true);
    setTimeout(() => {
      parseNaturalLanguage(sample);
      setIsAiProcessing(false);
    }, 150);
  };

  const handleRemoveChip = (chip: ParsedAIChip) => {
    if (isProject) {
      if (chip.type === 'keyword') {
        setInputValue('');
        setProjectFilters(prev => ({ ...prev, searchQuery: '' }));
      } else if (chip.type === 'district') {
        setProjectFilters(prev => ({
          ...prev,
          districts: prev.districts.filter(d => d !== chip.value)
        }));
      } else if (chip.type === 'developer') {
        setProjectFilters(prev => ({ ...prev, developer: 'Tất cả' }));
      } else if (chip.type === 'price') {
        setProjectFilters(prev => ({ ...prev, priceRange: 'Tất cả' }));
      } else if (chip.type === 'status') {
        setProjectFilters(prev => ({ ...prev, status: 'Tất cả' }));
      }
    } else {
      if (chip.type === 'keyword') {
        setInputValue('');
        setMarketFilters(prev => ({ ...prev, searchQuery: '' }));
      } else if (chip.type === 'district') {
        setMarketFilters(prev => ({
          ...prev,
          districts: prev.districts.filter(d => d !== chip.value)
        }));
      } else if (chip.type === 'propertyType') {
        setMarketFilters(prev => ({
          ...prev,
          propertyTypes: prev.propertyTypes.filter(t => t !== chip.value)
        }));
      } else if (chip.type === 'bedroom') {
        setMarketFilters(prev => ({ ...prev, bedrooms: 'Tất cả' }));
      } else if (chip.type === 'price') {
        setMarketFilters(prev => ({ ...prev, priceRange: 'Tất cả' }));
      }
    }
  };

  const handleClearAll = () => {
    setInputValue('');
    setParsedChips([]);
    if (isProject) {
      resetProjectFilters();
    } else {
      resetMarketFilters();
    }
  };

  // Get dynamic placeholder & suggestions based on mode
  const getSearchPlaceholder = () => {
    switch (mode) {
      case 'rent':
        return 'Tìm nhà thuê, căn hộ theo khu vực, giá thuê hoặc phòng ngủ (VD: Căn hộ 2PN Cầu Giấy 10-15 triệu)...';
      case 'project':
        return 'Tìm dự án sơ cấp theo khu vực, CĐT hoặc ngân sách (VD: Dự án Vinhomes dưới 8 tỷ, Mới mở bán Tây Hà Nội)...';
      case 'sale':
      default:
        return 'Tìm căn hộ, nhà riêng theo khu vực, ngân sách hoặc nhu cầu (VD: Căn 2PN Tây Hồ dưới 6 tỷ)...';
    }
  };

  const suggestions = mode === 'project' 
    ? PROJECT_SUGGESTIONS 
    : mode === 'rent' 
      ? RENT_SUGGESTIONS 
      : SALE_SUGGESTIONS;

  // Track active chips dynamically when filters change
  useEffect(() => {
    updateChipsFromFilters(inputValue);
  }, [marketFilters, projectFilters, inputValue]);

  return (
    <div id="market-ai-search-unified" className="w-full max-w-4xl mx-auto space-y-3">
      {/* 1. Main Search Bar Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center bg-white border-2 border-blue-500/25 hover:border-blue-500/50 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10 rounded-2xl p-1.5 shadow-sm transition-all">
          
          <div className="pl-3.5 pr-2 text-blue-600 flex items-center gap-1.5 shrink-0">
            <Sparkles className={`w-4 h-4 text-blue-600 ${isAiProcessing ? 'animate-spin' : 'animate-pulse'}`} />
          </div>

          <input
            id="market-ai-search-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={getSearchPlaceholder()}
            className="w-full px-2 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent outline-none font-medium"
          />

          <div className="flex items-center gap-1 shrink-0 pr-1">
            {inputValue && (
              <button
                type="button"
                onClick={() => {
                  setInputValue('');
                  if (isProject) {
                    setProjectFilters(prev => ({ ...prev, searchQuery: '' }));
                  } else {
                    setMarketFilters(prev => ({ ...prev, searchQuery: '' }));
                  }
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                title="Xóa ô tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              id="market-ai-search-submit-btn"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tìm kiếm</span>
            </button>
          </div>
        </div>
      </form>

      {/* 2. Quick Suggestions */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] text-slate-400 font-semibold shrink-0 pl-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-500" />
          Gợi ý:
        </span>
        {suggestions.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectSample(sample)}
            className="px-3 py-1 bg-slate-100/90 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200/60 rounded-full text-slate-600 text-[11px] font-medium transition-all shrink-0 whitespace-nowrap shadow-2xs cursor-pointer"
          >
            "{sample}"
          </button>
        ))}
      </div>

      {/* 3. Active Search Chips */}
      {parsedChips.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap px-1 pt-0.5 animate-in fade-in duration-150">
          <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 shrink-0">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>AI đã nhận diện:</span>
          </div>

          {parsedChips.map(chip => (
            <span
              key={chip.id}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-200 shadow-2xs text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg hover:border-slate-300 transition-colors"
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={() => handleRemoveChip(chip)}
                className="hover:text-rose-600 text-slate-400 transition-colors"
                title="Bỏ tiêu chí này"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-rose-600 underline ml-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại</span>
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, X, ArrowRight, Tag } from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { HANOI_DISTRICTS, PROPERTY_TYPES } from './MarketFilters';
import { PropertyType } from '../../types';

interface ParsedAIChip {
  id: string;
  type: 'district' | 'bedroom' | 'price' | 'mode' | 'propertyType' | 'keyword';
  label: string;
  value: string;
}

const SAMPLE_PROMPTS = [
  'Tìm căn 2PN Tây Hồ dưới 6 tỷ',
  'Nhà 3PN cho gia đình 4 người ở Cầu Giấy',
  'Căn hộ đầu tư cho thuê khoảng 5 tỷ'
];

export const MarketSearch: React.FC = () => {
  const { marketFilters, setMarketFilters } = useAppState();
  const [inputValue, setInputValue] = useState(marketFilters.searchQuery || '');
  const [parsedChips, setParsedChips] = useState<ParsedAIChip[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Parse natural language queries into structured chips & filters
  const parseNaturalLanguage = (query: string) => {
    if (!query.trim()) {
      setParsedChips([]);
      return;
    }

    const q = query.toLowerCase();
    const chips: ParsedAIChip[] = [];
    const newDistricts: string[] = [];
    let newBedrooms = 'Tất cả';
    let newPriceRange = 'Tất cả';
    let newMode = marketFilters.mode;
    const newPropertyTypes: PropertyType[] = [];

    // 1. Check mode
    if (q.includes('cho thuê') || q.includes('thuê')) {
      newMode = 'rent';
      chips.push({ id: 'mode-rent', type: 'mode', label: 'Cho thuê', value: 'rent' });
    } else if (q.includes('bán') || q.includes('mua') || q.includes('tỷ')) {
      newMode = 'sale';
    }

    // 2. Check districts
    for (const d of HANOI_DISTRICTS) {
      if (q.includes(d.toLowerCase())) {
        newDistricts.push(d);
        chips.push({ id: `dist-${d}`, type: 'district', label: d, value: d });
      }
    }

    // 3. Check bedrooms
    if (q.includes('studio')) {
      newBedrooms = 'Studio';
      chips.push({ id: 'bed-studio', type: 'bedroom', label: 'Studio', value: 'Studio' });
    } else if (q.includes('1pn') || q.includes('1 phòng ngủ') || q.includes('1 pn')) {
      newBedrooms = '1PN';
      chips.push({ id: 'bed-1pn', type: 'bedroom', label: '1PN', value: '1PN' });
    } else if (q.includes('2pn') || q.includes('2 phòng ngủ') || q.includes('2 pn')) {
      newBedrooms = '2PN';
      chips.push({ id: 'bed-2pn', type: 'bedroom', label: '2PN', value: '2PN' });
    } else if (q.includes('3pn') || q.includes('3 phòng ngủ') || q.includes('3 pn')) {
      newBedrooms = '3PN';
      chips.push({ id: 'bed-3pn', type: 'bedroom', label: '3PN', value: '3PN' });
    } else if (q.includes('4pn') || q.includes('4 phòng ngủ') || q.includes('4 pn')) {
      newBedrooms = '4PN+';
      chips.push({ id: 'bed-4pn', type: 'bedroom', label: '4PN+', value: '4PN+' });
    }

    // 4. Check price
    if (q.includes('dưới 3 tỷ') || q.includes('< 3 tỷ') || q.includes('dưới 3tỷ') || q.includes('<3 tỷ')) {
      newPriceRange = '<3 tỷ';
      chips.push({ id: 'price-lt3', type: 'price', label: '< 3 tỷ', value: '<3 tỷ' });
    } else if (q.includes('dưới 6 tỷ') || q.includes('6 tỷ') || q.includes('5-7 tỷ') || q.includes('5 đến 7 tỷ')) {
      newPriceRange = '5–7 tỷ';
      chips.push({ id: 'price-57', type: 'price', label: '≤ 6 tỷ', value: '5–7 tỷ' });
    } else if (q.includes('5 tỷ') || q.includes('3-5 tỷ') || q.includes('3 đến 5 tỷ')) {
      newPriceRange = '3–5 tỷ';
      chips.push({ id: 'price-35', type: 'price', label: '~5 tỷ', value: '3–5 tỷ' });
    } else if (q.includes('7-10 tỷ') || q.includes('7 đến 10 tỷ') || q.includes('dưới 10 tỷ')) {
      newPriceRange = '7–10 tỷ';
      chips.push({ id: 'price-710', type: 'price', label: '7–10 tỷ', value: '7–10 tỷ' });
    }

    // 5. Check property types
    if (q.includes('căn hộ') || q.includes('chung cư')) {
      newPropertyTypes.push('Căn hộ');
      chips.push({ id: 'type-canho', type: 'propertyType', label: 'Căn hộ', value: 'Căn hộ' });
    }
    if (q.includes('nhà riêng')) {
      newPropertyTypes.push('Nhà riêng');
      chips.push({ id: 'type-nharieng', type: 'propertyType', label: 'Nhà riêng', value: 'Nhà riêng' });
    }
    if (q.includes('biệt thự')) {
      newPropertyTypes.push('Biệt thự');
      chips.push({ id: 'type-bietthu', type: 'propertyType', label: 'Biệt thự', value: 'Biệt thự' });
    }

    setParsedChips(chips);

    // Apply structured filters to marketFilters
    setMarketFilters(prev => ({
      ...prev,
      searchQuery: query,
      mode: newMode,
      districts: newDistricts.length > 0 ? newDistricts : prev.districts,
      bedrooms: newBedrooms !== 'Tất cả' ? newBedrooms : prev.bedrooms,
      priceRange: newPriceRange !== 'Tất cả' ? newPriceRange : prev.priceRange,
      propertyTypes: newPropertyTypes.length > 0 ? newPropertyTypes : prev.propertyTypes
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (!val.trim()) {
      setParsedChips([]);
      setMarketFilters(prev => ({ ...prev, searchQuery: '' }));
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setIsAiProcessing(true);
    setTimeout(() => {
      parseNaturalLanguage(inputValue);
      setIsAiProcessing(false);
    }, 200);
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
    setParsedChips(prev => prev.filter(c => c.id !== chip.id));
    if (chip.type === 'district') {
      setMarketFilters(prev => ({
        ...prev,
        districts: prev.districts.filter(d => d !== chip.value)
      }));
    } else if (chip.type === 'bedroom') {
      setMarketFilters(prev => ({ ...prev, bedrooms: 'Tất cả' }));
    } else if (chip.type === 'price') {
      setMarketFilters(prev => ({ ...prev, priceRange: 'Tất cả' }));
    } else if (chip.type === 'propertyType') {
      setMarketFilters(prev => ({
        ...prev,
        propertyTypes: prev.propertyTypes.filter(t => t !== chip.value)
      }));
    }
  };

  const handleClearAll = () => {
    setInputValue('');
    setParsedChips([]);
    setMarketFilters(prev => ({
      ...prev,
      searchQuery: ''
    }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-2.5">
      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center bg-white border-2 border-blue-500/20 hover:border-blue-500/40 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10 rounded-2xl p-1.5 shadow-sm transition-all">
          
          <div className="pl-3.5 pr-2 text-blue-600 flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
          </div>

          <input
            id="market-search-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Bạn đang tìm BĐS như thế nào? Hãy mô tả tự nhiên..."
            className="w-full px-2 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent outline-none font-medium"
          />

          <div className="flex items-center gap-1 shrink-0 pr-1">
            {inputValue && (
              <button
                type="button"
                onClick={handleClearAll}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                title="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tìm kiếm</span>
            </button>
          </div>
        </div>
      </form>

      {/* AI Parsed Filter Chips */}
      {parsedChips.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap px-1 animate-in fade-in duration-150">
          <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 shrink-0">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>AI đã nhận diện:</span>
          </div>

          {parsedChips.map(chip => (
            <span
              key={chip.id}
              className="inline-flex items-center gap-1 bg-white border border-slate-300 shadow-2xs text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg"
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={() => handleRemoveChip(chip)}
                className="hover:text-rose-600 text-slate-400 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={handleClearAll}
            className="text-[11px] font-bold text-slate-400 hover:text-slate-600 underline ml-1"
          >
            Đặt lại
          </button>
        </div>
      )}

      {/* Quick Sample Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] text-slate-400 font-semibold shrink-0 pl-1">
          Gợi ý:
        </span>
        {SAMPLE_PROMPTS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectSample(sample)}
            className="px-2.5 py-1 bg-slate-100/90 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200/60 rounded-full text-slate-600 text-[11px] font-medium transition-all shrink-0 whitespace-nowrap shadow-2xs"
          >
            "{sample}"
          </button>
        ))}
      </div>
    </div>
  );
};

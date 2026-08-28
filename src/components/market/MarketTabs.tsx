import React from 'react';
import { Home, Key, Building2 } from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { ListingMode } from '../../types';

export const MarketTabs: React.FC = () => {
  const { marketFilters, setMarketFilters } = useAppState();

  const handleModeChange = (mode: ListingMode) => {
    setMarketFilters(prev => ({
      ...prev,
      mode,
      // reset price filter on mode switch to prevent price scale mismatch
      priceRange: 'Tất cả'
    }));
  };

  return (
    <div className="flex justify-center mb-6">
      <div 
        id="market-subtabs-switch"
        className="inline-flex bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs"
      >
        <button
          id="mode-sale-btn"
          onClick={() => handleModeChange('sale')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            marketFilters.mode === 'sale'
              ? 'bg-white text-blue-600 shadow-xs scale-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Nhà bán</span>
        </button>

        <button
          id="mode-rent-btn"
          onClick={() => handleModeChange('rent')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            marketFilters.mode === 'rent'
              ? 'bg-white text-blue-600 shadow-xs scale-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Nhà cho thuê</span>
        </button>

        <button
          id="mode-project-btn"
          onClick={() => handleModeChange('project')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            marketFilters.mode === 'project'
              ? 'bg-white text-blue-600 shadow-xs scale-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Dự án</span>
        </button>
      </div>
    </div>
  );
};

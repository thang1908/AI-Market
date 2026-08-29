import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, ShieldAlert, Layers } from 'lucide-react';
import { mockPriceUpdates } from '../../data/mockPriceData';
import { useAppState } from '../../state/useAppState';

export const PriceUpdate: React.FC = () => {
  const [activeCityTab, setActiveCityTab] = useState<'Hà Nội' | 'TP.HCM'>('Hà Nội');
  const { openMarketWithFilter } = useAppState();

  const filteredStats = mockPriceUpdates.filter(item => item.city === activeCityTab);

  return (
    <section id="ai-price-update-section" className="py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Cập nhật giá bất động sản
            </h2>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 px-2 py-0.5 rounded-md uppercase tracking-wide">
              Dữ liệu demo
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Biến động đơn giá trung bình theo m² tại các quận trung tâm
          </p>
        </div>

        {/* City Filter Tabs */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 self-start sm:self-auto">
          <button
            id="price-tab-hanoi"
            onClick={() => setActiveCityTab('Hà Nội')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeCityTab === 'Hà Nội'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Hà Nội
          </button>
          <button
            id="price-tab-tphcm"
            onClick={() => setActiveCityTab('TP.HCM')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeCityTab === 'TP.HCM'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            TP.HCM
          </button>
        </div>
      </div>

      {/* Mock Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {filteredStats.map((item, idx) => (
          <div
            key={idx}
            id={`price-card-${idx}`}
            onClick={() => openMarketWithFilter({ districts: [item.district] })}
            className="bg-white border border-slate-200/90 rounded-2xl p-4.5 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                  {item.district}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  +{item.changePercent}%
                </span>
              </div>
              
              <div className="mt-1">
                <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  {item.avgPricePerM2} <span className="text-xs font-bold text-slate-400">tr/m²</span>
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>{item.totalListings?.toLocaleString()} tin</span>
              <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">Xem →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

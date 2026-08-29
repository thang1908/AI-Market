import React from 'react';
import { TrendingUp, Map, Building2, Scale, Percent, AlertTriangle, Clock } from 'lucide-react';
import { mockMarketToday } from '../../data/mockNews';

export const MarketToday: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'TrendingUp': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'Map': return <Map className="w-4 h-4 text-emerald-600" />;
      case 'Building2': return <Building2 className="w-4 h-4 text-violet-600" />;
      case 'Scale': return <Scale className="w-4 h-4 text-amber-600" />;
      case 'Percent': return <Percent className="w-4 h-4 text-sky-600" />;
      case 'AlertTriangle': return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default: return <TrendingUp className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <section id="ai-market-today-section" className="py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Thị trường hôm nay
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Tổng hợp các diễn biến quan trọng tác động tới quyết định mua bán
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockMarketToday.map((item) => (
          <div
            key={item.id}
            id={`market-update-${item.id}`}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${item.badgeColor}`}>
                  {item.category}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{item.updatedTime}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0 mt-0.5">
                  {getIcon(item.iconName)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {item.headline}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

import React from 'react';
import { MapPin, TrendingUp, Sparkles, Building, ArrowUpRight } from 'lucide-react';
import { mockPopularAreas } from '../../data/mockPriceData';
import { useAppState } from '../../state/useAppState';

export const PopularAreas: React.FC = () => {
  const { openMarketWithFilter } = useAppState();

  return (
    <section id="ai-popular-areas-section" className="py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Khu vực được quan tâm
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Top quận huyện có mật độ giao dịch và tìm kiếm sôi động nhất
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockPopularAreas.map((area, idx) => (
          <div
            key={idx}
            id={`popular-area-${idx}`}
            onClick={() => openMarketWithFilter({ districts: [area.district] })}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {area.district}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{area.tag}</span>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  {area.changeRate}
                </span>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 mt-2 mb-3 leading-relaxed">
                {area.description}
              </p>
            </div>

            <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Giá trung bình</div>
                <div className="font-extrabold text-slate-900 text-sm">{area.avgPrice}</div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nguồn cung</div>
                <div className="font-bold text-slate-700 text-sm">{area.totalProducts}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

import React from 'react';
import { AIHero } from './AIHero';
import { PriceUpdate } from './PriceUpdate';
import { HotProjects } from './HotProjects';
import { PopularAreas } from './PopularAreas';
import { MarketToday } from './MarketToday';
import { NewsSection } from './NewsSection';
import { RiskSection } from './RiskSection';
import { ArrowRight, Store } from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { AIChatTab } from './AIChatTab';

export const AIPage: React.FC = () => {
  const { setActiveTab, isChatTabActive } = useAppState();

  return (
    <div id="tab-ai-container" className="w-full">
      {/* 1. AI Home View - Preserved in DOM when chat is open to keep scroll & state */}
      <div className={isChatTabActive ? 'hidden' : 'block'}>
        <div id="tab-ai-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-16 space-y-4">
          {/* 1. Hero AI */}
          <AIHero />

          {/* Divider */}
          <div className="h-px bg-slate-200/60 w-full" />

          {/* 2. Cập nhật giá BĐS */}
          <PriceUpdate />

          {/* 3. Dự án đang được quan tâm */}
          <HotProjects />

          {/* 4. Khu vực được quan tâm */}
          <PopularAreas />

          {/* 5. Khám phá Market Banner (Link sang Tab Market) */}
          <div className="my-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold text-blue-400 tracking-wider uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-400/20">
                Sàn Giao Dịch Trực Quan
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Tự duyệt danh sách hơn 86+ Bất động sản đang bán và cho thuê
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Lọc theo quận, tầm tài chính, diện tích và số phòng ngủ với đầy đủ hình ảnh, thông số kỹ thuật và tình trạng pháp lý.
              </p>
            </div>

            <button
              id="ai-to-market-cta-btn"
              onClick={() => setActiveTab('market')}
              className="shrink-0 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl flex items-center gap-2.5 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
            >
              <Store className="w-4 h-4" />
              <span>Xem tất cả sản phẩm Market</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 6. Thị trường hôm nay */}
          <MarketToday />

          {/* 7. Tin tức nổi bật */}
          <NewsSection />

          {/* 8. Thông tin cần lưu ý */}
          <RiskSection />
        </div>
      </div>

      {/* 2. Temporary AI Chat Tab View */}
      {isChatTabActive && (
        <AIChatTab />
      )}
    </div>
  );
};

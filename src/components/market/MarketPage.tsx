import React, { useState } from 'react';
import { MarketAISearch } from './MarketAISearch';
import { MarketTabs } from './MarketTabs';
import { MarketFilters } from './MarketFilters';
import { ProjectFilters } from './ProjectFilters';
import { AdvancedFiltersModal } from './AdvancedFiltersModal';
import { PropertyGrid } from './PropertyGrid';
import { PropertyDetail } from './PropertyDetail';
import { ProjectView } from './ProjectView';
import { mockListings } from '../../data/mockListings';
import { PropertyListing } from '../../types';
import { useAppState } from '../../state/useAppState';

export const MarketPage: React.FC = () => {
  const { activeDetailListing, setActiveDetailListing, marketFilters } = useAppState();
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);

  const isProjectTab = marketFilters.mode === 'project';

  return (
    <div id="tab-market-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-16 space-y-6">
      
      {/* 1. Page Title & Subtitle */}
      <div className="pt-6 sm:pt-8 pb-2 text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Thị trường Bất động sản
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Khám phá và tìm kiếm bất động sản phù hợp với nhu cầu của bạn
        </p>
      </div>

      {/* 2. Sub-Tabs: [Nhà bán] [Nhà cho thuê] [Dự án] (placed ABOVE search bar) */}
      <MarketTabs />

      {/* 3. AI Search with Suggestions & Active Search Chips */}
      <div className="pb-2">
        <MarketAISearch mode={marketFilters.mode} />
      </div>

      {/* 4. Manual Filters (adapted per sub-tab) */}
      {isProjectTab ? (
        <ProjectFilters />
      ) : (
        <MarketFilters onOpenAdvancedModal={() => setIsAdvancedModalOpen(true)} />
      )}

      {/* 5. Results Section */}
      {isProjectTab ? (
        <ProjectView />
      ) : (
        <>
          {/* Property Grid */}
          <PropertyGrid 
            listings={mockListings} 
            onOpenDetail={(listing: PropertyListing) => setActiveDetailListing(listing)} 
          />

          {/* Advanced Filters Modal */}
          <AdvancedFiltersModal 
            isOpen={isAdvancedModalOpen} 
            onClose={() => setIsAdvancedModalOpen(false)} 
          />

          {/* Property Detail Drawer / Fullscreen */}
          {activeDetailListing && (
            <PropertyDetail
              listing={activeDetailListing}
              onClose={() => setActiveDetailListing(null)}
            />
          )}
        </>
      )}

    </div>
  );
};

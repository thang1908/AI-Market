import React, { useState } from 'react';
import { MarketAISearch } from './MarketAISearch';
import { MarketTabs } from './MarketTabs';
import { MarketFilters } from './MarketFilters';
import { ProjectFilters } from './ProjectFilters';
import { AdvancedFiltersModal } from './AdvancedFiltersModal';
import { PropertyGrid } from './PropertyGrid';
import { PropertyDetail } from './PropertyDetail';
import { ProjectView } from './ProjectView';
import { PropertyListing } from '../../types';
import { useAppState } from '../../state/useAppState';
import { useListings } from '../../hooks/useListings';

export const MarketPage: React.FC = () => {
  const { activeDetailListing, setActiveDetailListing, marketFilters } = useAppState();
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);

  const isProjectTab = marketFilters.mode === 'project';

  // ── Gọi API listings qua hook ──────────────────────────────────────────
  const {
    listings,
    total,
    totalPages,
    page,
    isLoading,
    error,
    setPage,
  } = useListings(marketFilters, 12);

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

      {/* 2. Sub-Tabs: [Nhà bán] [Nhà cho thuê] [Dự án] */}
      <MarketTabs />

      {/* 3. AI Search */}
      <div className="pb-2">
        <MarketAISearch mode={marketFilters.mode} />
      </div>

      {/* 4. Manual Filters */}
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
          {/* Property Grid — nhận data từ API */}
          <PropertyGrid
            listings={listings}
            total={total}
            totalPages={totalPages}
            page={page}
            isLoading={isLoading}
            error={error}
            onPageChange={setPage}
            onOpenDetail={(listing: PropertyListing) => setActiveDetailListing(listing)}
          />

          {/* Advanced Filters Modal */}
          <AdvancedFiltersModal
            isOpen={isAdvancedModalOpen}
            onClose={() => setIsAdvancedModalOpen(false)}
          />

          {/* Property Detail Drawer */}
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

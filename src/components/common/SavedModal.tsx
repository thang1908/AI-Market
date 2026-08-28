import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  PhoneCall, 
  ExternalLink,
  ShieldCheck,
  Scale,
  Building2,
  Layers,
  BookmarkPlus
} from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { mockListings } from '../../data/mockListings';
import { mockProjects } from '../../data/mockPrimaryProjects';
import { mockPrimaryUnits } from '../../data/mockPrimaryInventory';

export const SavedModal: React.FC = () => {
  const { 
    isSavedModalOpen, 
    setIsSavedModalOpen, 
    savedListingIds, 
    toggleSaveListing, 
    savedProjectIds,
    toggleSaveProject,
    savedUnitIds,
    toggleSaveUnit,
    setActiveDetailListing,
    setActiveProject,
    setActivePrimaryUnit,
    openInventory,
    openBookingModal,
    openEvaluation,
    openComparison,
    openContactSale,
    setActiveTab
  } = useAppState();

  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'listings' | 'projects' | 'units'>('all');

  if (!isSavedModalOpen) return null;

  const savedListings = mockListings.filter(item => savedListingIds.includes(item.id));
  const savedProjects = mockProjects.filter(item => savedProjectIds.includes(item.id));
  const savedUnits = mockPrimaryUnits.filter(item => savedUnitIds.includes(item.id));

  const totalSavedCount = savedListings.length + savedProjects.length + savedUnits.length;

  const handleOpenEvaluation = (target: any) => {
    setIsSavedModalOpen(false);
    openEvaluation(target);
  };

  const handleOpenComparison = () => {
    setIsSavedModalOpen(false);
    openComparison();
  };

  const handleOpenListingDetail = (listing: any) => {
    setIsSavedModalOpen(false);
    setActiveDetailListing(listing);
  };

  const handleOpenProjectDetail = (proj: any) => {
    setIsSavedModalOpen(false);
    setActiveProject(proj);
  };

  const handleOpenUnitDetail = (unit: any) => {
    setIsSavedModalOpen(false);
    setActivePrimaryUnit(unit);
  };

  const handleContactSale = (target: any) => {
    setIsSavedModalOpen(false);
    openContactSale(target);
  };

  const handleOpenBooking = (unit: any) => {
    setIsSavedModalOpen(false);
    openBookingModal(unit);
  };

  return (
    <div id="saved-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="saved-modal-container" 
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Mục đã lưu
              </h2>
              <p className="text-xs text-slate-500">
                {totalSavedCount} sản phẩm & dự án bạn đang quan tâm
              </p>
            </div>
          </div>
          <button
            id="close-saved-modal-btn"
            onClick={() => setIsSavedModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub Navigation Filter Pills */}
        {totalSavedCount > 0 && (
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTabFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTabFilter === 'all'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tất cả ({totalSavedCount})
            </button>
            <button
              onClick={() => setActiveTabFilter('listings')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTabFilter === 'listings'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              BĐS Thứ cấp ({savedListings.length})
            </button>
            <button
              onClick={() => setActiveTabFilter('projects')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTabFilter === 'projects'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Dự án Sơ cấp ({savedProjects.length})
            </button>
            <button
              onClick={() => setActiveTabFilter('units')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTabFilter === 'units'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Căn sơ cấp ({savedUnits.length})
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {totalSavedCount === 0 ? (
            <div className="text-center py-14 px-4">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3.5 text-slate-400">
                <Bookmark className="w-7 h-7" />
              </div>
              <p className="text-slate-900 font-extrabold text-base mb-1">
                Chưa có mục nào được lưu
              </p>
              <p className="text-slate-400 text-xs max-w-sm mx-auto mb-5 leading-relaxed">
                Bấm vào biểu tượng trái tim ♡ tại danh sách Market hoặc tab Dự án để lưu các bất động sản bạn muốn so sánh và đánh giá.
              </p>
              <button
                onClick={() => {
                  setIsSavedModalOpen(false);
                  setActiveTab('market');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <span>Khám phá Market</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* AI Comparison Top Bar */}
              {savedListings.length > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/70 to-blue-50/40 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-900">
                      <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                      <span>AI So sánh & đánh giá mức độ phù hợp</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      AI sẽ đánh giá các BĐS đã lưu dựa trên nhu cầu của bạn.
                    </p>
                  </div>

                  {savedListings.length === 1 ? (
                    <button
                      type="button"
                      onClick={() => handleOpenEvaluation(savedListings[0])}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI đánh giá căn này</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpenComparison}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>AI so sánh {savedListings.length} căn</span>
                    </button>
                  )}
                </div>
              )}

              {/* 1. Saved Projects */}
              {(activeTabFilter === 'all' || activeTabFilter === 'projects') && savedProjects.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Dự án Sơ cấp ({savedProjects.length})</span>
                  </h3>
                  {savedProjects.map(proj => (
                    <div 
                      key={proj.id}
                      className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white"
                    >
                      <img 
                        src={proj.thumbnail || proj.coverImage} 
                        alt={proj.name}
                        className="w-full sm:w-24 h-24 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase bg-blue-50 text-blue-700 border border-blue-100">
                            {proj.developer}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{proj.district}</span>
                        </div>
                        <h4 
                          onClick={() => handleOpenProjectDetail(proj)}
                          className="text-sm font-extrabold text-slate-900 truncate hover:text-blue-600 cursor-pointer"
                        >
                          {proj.name}
                        </h4>
                        <div className="text-xs font-bold text-blue-700 mt-1">
                          {proj.priceFrom} • {proj.priceAvgPerM2 || proj.pricePerM2}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSavedModalOpen(false);
                            openInventory(proj);
                          }}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Giỏ hàng ({proj.availableUnitsCount})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenProjectDetail(proj)}
                          className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSaveProject(proj.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. Saved Primary Units */}
              {(activeTabFilter === 'all' || activeTabFilter === 'units') && savedUnits.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Căn hộ Sơ cấp CĐT ({savedUnits.length})</span>
                  </h3>
                  {savedUnits.map(unit => (
                    <div 
                      key={unit.id}
                      className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white"
                    >
                      <img 
                        src={unit.layoutImage || unit.viewSimulationUrl} 
                        alt={unit.unitCode}
                        className="w-full sm:w-24 h-24 rounded-xl object-contain bg-slate-100 shrink-0 p-1"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Căn sơ cấp
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{unit.projectName} • {unit.buildingName}</span>
                        </div>
                        <h4 
                          onClick={() => handleOpenUnitDetail(unit)}
                          className="text-sm font-extrabold text-slate-900 truncate hover:text-blue-600 cursor-pointer"
                        >
                          Căn {unit.unitCode} • Tầng {unit.floor} ({unit.unitType})
                        </h4>
                        <div className="text-xs font-bold text-blue-700 mt-1">
                          {unit.totalPrice} • {unit.area}m² • {unit.bedrooms} PN
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEvaluation(unit)}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">AI Đánh giá</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenBooking(unit)}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-2xs"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          <span>Giữ căn</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenUnitDetail(unit)}
                          className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSaveUnit(unit.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. Saved Secondary Listings */}
              {(activeTabFilter === 'all' || activeTabFilter === 'listings') && savedListings.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                    <span>Bất động sản Thứ cấp ({savedListings.length})</span>
                  </h3>
                  {savedListings.map(listing => (
                    <div 
                      key={listing.id}
                      id={`saved-item-${listing.id}`}
                      className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white"
                    >
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title}
                        className="w-full sm:w-24 h-24 rounded-xl object-cover shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            listing.mode === 'sale' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            {listing.mode === 'sale' ? 'Bán' : 'Cho thuê'}
                          </span>
                          <span className="text-xs text-slate-400 truncate font-medium">{listing.district}</span>
                        </div>

                        <h4 
                          onClick={() => handleOpenListingDetail(listing)}
                          className="text-sm font-extrabold text-slate-900 truncate hover:text-blue-600 cursor-pointer"
                        >
                          {listing.title}
                        </h4>

                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mt-1">
                          <span>{listing.price}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 font-semibold">{listing.area}m²</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 font-semibold">{listing.bedrooms} PN</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEvaluation(listing)}
                          title="AI đánh giá căn này"
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors border border-blue-200/60"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span className="hidden md:inline">AI Đánh giá</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleContactSale(listing)}
                          title="Liên hệ tư vấn"
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors shadow-2xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Tư vấn</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenListingDetail(listing)}
                          title="Xem chi tiết"
                          className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleSaveListing(listing.id)}
                          title="Bỏ lưu"
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {totalSavedCount > 0 && (
          <div className="p-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <span>Dữ liệu được lưu trữ an toàn trên thiết bị</span>
            <button
              onClick={() => {
                setIsSavedModalOpen(false);
                setActiveTab('market');
              }}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>Xem toàn bộ trên Market</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Filter, 
  Layers, 
  Building2, 
  Compass, 
  Maximize2, 
  Heart, 
  PhoneCall, 
  ChevronRight, 
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  FileCheck2,
  BookmarkPlus
} from 'lucide-react';
import { Project, PrimaryInventoryUnit } from '../../types';
import { useAppState } from '../../state/useAppState';
import { mockPrimaryUnits } from '../../data/mockPrimaryInventory';

export const ProjectInventoryModal: React.FC = () => {
  const { 
    isInventoryOpen, 
    inventoryProject, 
    closeInventory,
    setActivePrimaryUnit,
    openBookingModal,
    openContactSale,
    openEvaluation,
    isUnitSaved,
    toggleSaveUnit
  } = useAppState();

  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedTower, setSelectedTower] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDirection, setSelectedDirection] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'area_desc' | 'floor_asc'>('price_asc');

  if (!isInventoryOpen || !inventoryProject) return null;

  // Filter units belonging to this project
  const projectUnits = mockPrimaryUnits.filter(u => u.projectId === inventoryProject.id);

  // Available phases & towers in this project
  const phases = Array.from(new Set(projectUnits.map(u => u.phaseName).filter(Boolean)));
  const towers = Array.from(new Set(projectUnits.map(u => u.buildingName).filter(Boolean)));

  // Filtered unit list
  const filteredUnits = projectUnits.filter(unit => {
    // 1. Phase
    if (selectedPhase !== 'all' && unit.phaseName !== selectedPhase) return false;
    // 2. Tower
    if (selectedTower !== 'all' && unit.buildingName !== selectedTower) return false;
    // 3. Unit Type
    if (selectedType !== 'all' && unit.unitType !== selectedType) return false;
    // 4. Direction
    if (selectedDirection !== 'all') {
      const matchDir = unit.balconyDirection?.toLowerCase().includes(selectedDirection.toLowerCase()) ||
                       unit.doorDirection?.toLowerCase().includes(selectedDirection.toLowerCase());
      if (!matchDir) return false;
    }
    // 5. Status
    if (selectedStatus !== 'all' && unit.status !== selectedStatus) return false;
    // 6. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCode = unit.unitCode.toLowerCase().includes(q);
      const matchType = unit.unitType.toLowerCase().includes(q);
      const matchView = unit.view?.toLowerCase().includes(q) || false;
      const matchTower = unit.buildingName?.toLowerCase().includes(q) || false;
      if (!matchCode && !matchType && !matchView && !matchTower) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return (a.priceValueNumber || 0) - (b.priceValueNumber || 0);
    if (sortBy === 'price_desc') return (b.priceValueNumber || 0) - (a.priceValueNumber || 0);
    if (sortBy === 'area_desc') return b.area - a.area;
    if (sortBy === 'floor_asc') return a.floor - b.floor;
    return 0;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Còn hàng':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Đang giữ chỗ':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Đã booking':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Đã bán':
        return 'bg-slate-100 text-slate-400 border border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const handleResetFilters = () => {
    setSelectedPhase('all');
    setSelectedTower('all');
    setSelectedType('all');
    setSelectedDirection('all');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  return (
    <div id="project-inventory-backdrop" className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        id="project-inventory-modal"
        className="bg-white w-full h-full sm:h-[94vh] sm:max-w-6xl rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 relative"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              id="close-inventory-btn"
              onClick={closeInventory}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Đóng giỏ hàng"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xs font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                  {inventoryProject.developer}
                </span>
                <span className="text-2xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                  Bảng hàng Master Pool
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5 truncate">
                Giỏ hàng sơ cấp: {inventoryProject.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>{filteredUnits.length} / {projectUnits.length} căn khớp lọc</span>
            </span>
          </div>
        </div>

        {/* Hierarchy Navigation: Phase & Tower Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:p-4 space-y-3 shrink-0">
          
          {/* Phase Tabs */}
          {phases.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              <span className="text-slate-500 font-bold shrink-0">Phân khu:</span>
              <button
                onClick={() => setSelectedPhase('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedPhase === 'all'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Tất cả phân khu
              </button>
              {phases.map(ph => (
                <button
                  key={ph}
                  onClick={() => setSelectedPhase(ph)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    selectedPhase === ph
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {ph}
                </button>
              ))}
            </div>
          )}

          {/* Tower Tabs */}
          {towers.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              <span className="text-slate-500 font-bold shrink-0">Toà tháp:</span>
              <button
                onClick={() => setSelectedTower('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedTower === 'all'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Tất cả toà
              </button>
              {towers.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTower(t)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    selectedTower === t
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Detailed Filters & Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 pt-1">
            
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã căn (L1.1205), view..."
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 shadow-2xs pl-8"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Unit Type */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              >
                <option value="all">Tất cả loại căn</option>
                <option value="1PN">1 Phòng ngủ</option>
                <option value="2PN">2 Phòng ngủ</option>
                <option value="3PN">3 Phòng ngủ</option>
                <option value="Duplex">Duplex</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>

            {/* Direction */}
            <div>
              <select
                value={selectedDirection}
                onChange={(e) => setSelectedDirection(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              >
                <option value="all">Tất cả hướng</option>
                <option value="Đông Nam">Đông Nam (mát)</option>
                <option value="Đông Bắc">Đông Bắc</option>
                <option value="Tây Nam">Tây Nam</option>
                <option value="Tây Bắc">Tây Bắc</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Còn hàng">Còn hàng</option>
                <option value="Đang giữ chỗ">Đang giữ chỗ</option>
                <option value="Đã booking">Đã booking</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              >
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
                <option value="area_desc">Diện tích lớn nhất</option>
                <option value="floor_asc">Tầng thấp đến cao</option>
              </select>
            </div>

          </div>

        </div>

        {/* Units Grid / Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {filteredUnits.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Không có căn nào phù hợp với bộ lọc hiện tại
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Vui lòng đổi lựa chọn loại căn, toà tháp hoặc đặt lại bộ lọc để xem toàn bộ giỏ hàng của dự án.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại bộ lọc</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUnits.map((unit) => {
                const isSaved = isUnitSaved(unit.id);

                return (
                  <div
                    key={unit.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between p-4 space-y-3"
                  >
                    <div>
                      {/* Top Row: Unit Code, Tower, Floor & Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                              Căn {unit.unitCode}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${getStatusBadge(unit.status)}`}>
                              {unit.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            {unit.buildingName} • Tầng {unit.floor} • {unit.unitType}
                          </p>
                        </div>

                        {/* Save Unit Button */}
                        <button
                          type="button"
                          onClick={() => toggleSaveUnit(unit.id)}
                          className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors ${
                            isSaved ? 'text-red-500' : 'text-slate-400'
                          }`}
                          title={isSaved ? 'Bỏ lưu căn' : 'Lưu căn'}
                        >
                          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Specs Matrix */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-2.5 text-2xs my-2.5 border border-slate-100">
                        <div>
                          <span className="text-slate-400 block">Diện tích</span>
                          <span className="font-bold text-slate-800">{unit.area} m²</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">PN / WC</span>
                          <span className="font-bold text-slate-800">{unit.bedrooms}PN • {unit.bathrooms}WC</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Ban công</span>
                          <span className="font-bold text-slate-800 truncate block" title={unit.balconyDirection}>
                            {unit.balconyDirection || 'Đông Nam'}
                          </span>
                        </div>
                      </div>

                      {/* View snippet */}
                      {unit.view && (
                        <p className="text-2xs text-slate-600 line-clamp-1 flex items-center gap-1">
                          <span className="font-bold text-blue-600">View:</span>
                          <span className="truncate">{unit.view}</span>
                        </p>
                      )}

                      {/* Distributor & Update time */}
                      <div className="flex items-center justify-between text-2xs text-slate-400 mt-2 pt-2 border-t border-slate-100">
                        <span className="truncate">Sàn: <strong>{unit.distributor || 'CĐT'}</strong></span>
                        <span className="shrink-0">{unit.updatedAt}</span>
                      </div>
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-2xs text-slate-400 block">Tổng giá sơ cấp</span>
                          <span className="text-base font-black text-blue-700">
                            {unit.totalPrice}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xs text-slate-400 block">Đơn giá</span>
                          <span className="text-xs font-bold text-slate-700">
                            {unit.pricePerM2}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActivePrimaryUnit(unit)}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all text-center"
                        >
                          Chi tiết căn
                        </button>

                        <button
                          type="button"
                          onClick={() => openBookingModal(unit)}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all text-center flex items-center justify-center gap-1"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          <span>Giữ căn</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => openEvaluation(unit)}
                          className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-2xs font-bold transition-all text-center flex items-center justify-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>AI Đánh giá</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openContactSale(unit)}
                          className="w-full py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-2xs font-bold transition-all text-center flex items-center justify-center gap-1"
                        >
                          <PhoneCall className="w-3 h-3 text-blue-600" />
                          <span>Tư vấn</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

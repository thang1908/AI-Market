import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Building2, 
  Layers, 
  Heart, 
  PhoneCall, 
  Share2, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Play, 
  ChevronRight, 
  ExternalLink,
  DollarSign,
  Maximize2,
  Clock,
  Compass,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { Project, PropertyListing } from '../../types';
import { useAppState } from '../../state/useAppState';
import { mockListings } from '../../data/mockListings';

export const ProjectPageModal: React.FC = () => {
  const { 
    activeProject, 
    setActiveProject, 
    openInventory, 
    isProjectSaved, 
    toggleSaveProject,
    openContactSale,
    setActiveDetailListing
  } = useAppState();

  const [activeSection, setActiveSection] = useState<string>('overview');
  const [selectedLayoutImage, setSelectedLayoutImage] = useState<string | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!activeProject) return null;

  const isSaved = isProjectSaved(activeProject.id);

  // Match secondary listings related to this project
  const relatedSecondarySales = mockListings.filter(l => 
    l.mode === 'sale' && (
      l.projectName?.toLowerCase().includes(activeProject.name.toLowerCase().split(' ')[0]) ||
      l.title.toLowerCase().includes(activeProject.name.toLowerCase().split(' ')[0])
    )
  );

  const relatedRentals = mockListings.filter(l => 
    l.mode === 'rent' && (
      l.projectName?.toLowerCase().includes(activeProject.name.toLowerCase().split(' ')[0]) ||
      l.title.toLowerCase().includes(activeProject.name.toLowerCase().split(' ')[0])
    )
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const navItems = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'pricing', label: 'Bảng giá' },
    { id: 'legal', label: 'Pháp lý' },
    { id: 'progress', label: 'Tiến độ' },
    { id: 'amenities', label: 'Tiện ích' },
    { id: 'infrastructure', label: 'Hạ tầng' },
    { id: 'layouts', label: 'Mặt bằng' },
    { id: 'price-history', label: 'Lịch sử giá' },
    { id: 'news', label: 'Tin tức' },
    { id: 'video', label: 'Video / 3D' },
    { id: 'secondary-market', label: `Chuyển nhượng (${relatedSecondarySales.length})` },
    { id: 'rental-market', label: `Cho thuê (${relatedRentals.length})` }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(`proj-sec-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="project-page-backdrop" className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        id="project-page-modal"
        className="bg-white w-full h-full sm:h-[92vh] sm:max-w-5xl rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 relative"
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              id="close-project-page-btn"
              onClick={() => setActiveProject(null)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Đóng trang dự án"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xs font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                  {activeProject.developer}
                </span>
                <span className="text-2xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                  {activeProject.status}
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5 truncate max-w-xs sm:max-w-md md:max-w-xl">
                {activeProject.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors text-xs font-semibold flex items-center gap-1.5"
              title="Sao chép liên kết"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? 'Đã sao chép!' : 'Chia sẻ'}</span>
            </button>

            <button
              onClick={() => toggleSaveProject(activeProject.id)}
              className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-bold ${
                isSaved
                  ? 'border-red-200 bg-red-50 text-red-600'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Đã lưu' : 'Lưu dự án'}</span>
            </button>
          </div>
        </div>

        {/* Sticky Sub Navigation */}
        <div className="border-b border-slate-100 bg-slate-50/90 px-4 sm:px-6 py-2 overflow-x-auto flex items-center gap-1.5 shrink-0 no-scrollbar text-xs font-semibold z-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-10 scroll-smooth">
          
          {/* Top Hero Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-3xl overflow-hidden shadow-xs">
            <div className="md:col-span-2 aspect-16/10 md:aspect-auto h-[260px] sm:h-[340px] relative group overflow-hidden bg-slate-100">
              <img
                src={activeProject.gallery?.[0] || activeProject.coverImage || activeProject.thumbnail}
                alt={activeProject.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                onClick={() => setSelectedGalleryIndex(0)}
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-medium">
                Phối cảnh kiến trúc tổng quan
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              {(activeProject.gallery || []).slice(1, 3).map((img, idx) => (
                <div 
                  key={idx} 
                  className="h-[120px] sm:h-[162px] relative group overflow-hidden bg-slate-100 rounded-2xl cursor-pointer"
                  onClick={() => setSelectedGalleryIndex(idx + 1)}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {idx === 1 && (activeProject.gallery?.length || 0) > 3 && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white font-bold text-sm">
                      +{(activeProject.gallery?.length || 0) - 3} hình ảnh
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stat Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-blue-50/60 border border-blue-100 rounded-2xl p-4">
            <div>
              <span className="text-2xs text-blue-700 font-bold uppercase block">Mức giá sơ cấp</span>
              <span className="text-base sm:text-lg font-black text-blue-900">{activeProject.priceFrom}</span>
            </div>
            <div>
              <span className="text-2xs text-blue-700 font-bold uppercase block">Đơn giá TB</span>
              <span className="text-base sm:text-lg font-black text-blue-900">{activeProject.priceAvgPerM2 || activeProject.pricePerM2}</span>
            </div>
            <div>
              <span className="text-2xs text-blue-700 font-bold uppercase block">Quy mô</span>
              <span className="text-base sm:text-lg font-black text-blue-900">{activeProject.overview?.scale}</span>
            </div>
            <div>
              <span className="text-2xs text-blue-700 font-bold uppercase block">Bàn giao</span>
              <span className="text-base sm:text-lg font-black text-blue-900">{activeProject.overview?.handoverTime || activeProject.overview?.handover || 'Đang cập nhật'}</span>
            </div>
          </div>

          {/* 1. TỔNG QUAN */}
          <section id="proj-sec-overview" className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-extrabold text-slate-900">1. Tổng quan dự án</h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {activeProject.description || activeProject.overview?.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Chủ đầu tư</span>
                <span className="font-bold text-slate-800 text-sm">{activeProject.developer}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Vị trí</span>
                <span className="font-bold text-slate-800 text-sm">{activeProject.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Tổng diện tích đất</span>
                <span className="font-bold text-slate-800 text-sm">{activeProject.overview?.landArea}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Mật độ xây dựng</span>
                <span className="font-bold text-slate-800 text-sm">{activeProject.overview?.buildingDensity || activeProject.overview?.density}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Số toà & Số tầng</span>
                <span className="font-bold text-slate-800 text-sm">{activeProject.overview?.totalTowers || activeProject.overview?.towers || activeProject.overview?.scale}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Tổng số lượng căn</span>
                <span className="font-bold text-slate-800 text-sm">{activeProject.overview?.totalUnits}</span>
              </div>
            </div>
          </section>

          {/* 2. BẢNG GIÁ CHI TIẾT THEO LOẠI CĂN */}
          <section id="proj-sec-pricing" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-extrabold text-slate-900">2. Bảng giá chi tiết theo loại hình</h2>
              </div>
              <button
                onClick={() => openInventory(activeProject)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Xem từng căn cụ thể</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/80 text-slate-700 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Loại hình căn hộ</th>
                    <th className="px-4 py-3">Diện tích</th>
                    <th className="px-4 py-3">Khoảng giá tổng</th>
                    <th className="px-4 py-3">Đơn giá / m²</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {(activeProject.pricing?.byUnitTypes || activeProject.priceDetails?.byType || []).map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900">{item.type}</td>
                      <td className="px-4 py-3.5 text-slate-600">{item.area}</td>
                      <td className="px-4 py-3.5 font-extrabold text-blue-700">{item.priceRange || item.price}</td>
                      <td className="px-4 py-3.5 text-slate-700">{item.pricePerM2 || activeProject.pricePerM2}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => openInventory(activeProject)}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors"
                        >
                          Xem giỏ hàng
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. PHÁP LÝ & HỒ SƠ */}
          <section id="proj-sec-legal" className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-extrabold text-slate-900">3. Pháp lý dự án</h2>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Hình thức sở hữu: {activeProject.legal?.ownership}</span>
              </div>
              <p className="text-xs text-slate-600">
                {activeProject.legal?.statusText || activeProject.legal?.status}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {(activeProject.legal?.permits || []).map((p, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold shadow-2xs">
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 4. TIẾN ĐỘ THI CÔNG */}
          <section id="proj-sec-progress" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-extrabold text-slate-900">4. Tiến độ xây dựng</h2>
              </div>
              <span className="text-xs text-slate-400">
                Cập nhật {activeProject.progress?.lastUpdated}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Trạng thái hiện tại:</span>
                <span className="px-3 py-1 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs">
                  {activeProject.progress?.constructionStatus || activeProject.progress?.currentStatus || 'Đang thi công đúng tiến độ'}
                </span>
              </div>

              {/* Timeline Milestones */}
              <div className="space-y-3 pt-2">
                {(activeProject.progress?.timeline || activeProject.progress?.milestones || []).map((m: any, idx: number) => {
                  const isCompleted = m.completed || m.status === 'completed';
                  const isInProgress = m.status === 'in_progress' || (!isCompleted && idx === 1);
                  const title = m.phase || m.title;
                  return (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isInProgress
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${isInProgress ? 'text-blue-700' : 'text-slate-800'}`}>
                            {title}
                          </span>
                          <span className="text-slate-400 font-medium">{m.date}</span>
                        </div>
                        <span className="text-2xs text-slate-500">
                          {isCompleted ? 'Đã hoàn thành / Nghiệm thu' : isInProgress ? 'Đang triển khai đúng tiến độ' : 'Dự kiến theo kế hoạch'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 5. TIỆN ÍCH NỘI & NGOẠI KHU */}
          <section id="proj-sec-amenities" className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-extrabold text-slate-900">5. Hệ thống tiện ích chuẩn quốc tế</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
                  Tiện ích nội khu đặc quyền ({activeProject.amenities?.internal?.length || 0})
                </h3>
                <div className="space-y-2">
                  {(activeProject.amenities?.internal || []).map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-3">
                  Tiện ích ngoại khu kết nối ({activeProject.amenities?.external?.length || 0})
                </h3>
                <div className="space-y-2">
                  {(activeProject.amenities?.external || []).map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 6. HẠ TẦNG & QUY HOẠCH */}
          <section id="proj-sec-infrastructure" className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Compass className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-extrabold text-slate-900">6. Hạ tầng & Quy hoạch kết nối</h2>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(activeProject.infrastructure || []).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 7. MẶT BẰNG TỔNG THỂ & THIẾT KẾ CĂN */}
          <section id="proj-sec-layouts" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-extrabold text-slate-900">7. Mặt bằng tổng thể & Thiết kế căn hộ</h2>
              </div>
              <span className="text-2xs text-slate-400">Click ảnh để phóng to</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(Array.isArray(activeProject.layouts)
                ? activeProject.layouts
                : [
                    ...(activeProject.layouts?.masterPlanImage ? [{
                      title: 'Mặt bằng tổng thể quy hoạch (Master Plan)',
                      type: 'Tổng thể',
                      description: 'Quy hoạch phân khu và mạng lưới giao thông nội bộ',
                      image: activeProject.layouts.masterPlanImage
                    }] : []),
                    ...(activeProject.layouts?.towerLayouts || []).map((tl: any) => ({
                      title: tl.towerName,
                      type: 'Mặt bằng tòa tháp',
                      description: 'Bố trí căn hộ và hệ thống thang máy từng tầng',
                      image: tl.image
                    })),
                    ...(activeProject.layouts?.unitLayouts || []).map((ul: any) => ({
                      title: ul.typeName,
                      type: 'Mặt bằng căn hộ',
                      description: `Bố trí không gian chi tiết diện tích ${ul.area}`,
                      image: ul.image
                    }))
                  ]
              ).map((layout: any, idx: number) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedLayoutImage(layout.image)}
                  className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
                    <img 
                      src={layout.image} 
                      alt={layout.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Maximize2 className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{layout.title}</h4>
                      <span className="text-2xs px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-md shrink-0">
                        {layout.type}
                      </span>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1 line-clamp-2">{layout.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 8. LỊCH SỬ GIÁ */}
          <section id="proj-sec-price-history" className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-extrabold text-slate-900">8. Lịch sử & Diễn biến giá</h2>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <p className="text-xs text-slate-600">
                {activeProject.priceHistory?.trendDescription ||
                  `Mặt bằng giá sơ cấp dự án ${activeProject.name} có xu hướng tăng trưởng ổn định theo từng giai đoạn triển khai và hoàn thiện tiện ích.`}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(activeProject.priceHistory?.historyMilestones || 
                  (activeProject.priceDetails?.priceHistory || []).map((ph: any) => ({
                    period: ph.period,
                    price: ph.priceAvg,
                    note: 'Đơn giá thông thủy trung bình'
                  }))
                ).map((h: any, idx: number) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-2xs text-slate-400 block">{h.period}</span>
                    <span className="text-sm font-extrabold text-blue-700 block mt-1">{h.price}</span>
                    <span className="text-2xs text-slate-600 block mt-0.5">{h.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 9. TIN TỨC & SỰ KIỆN MỞ BÁN */}
          <section id="proj-sec-news" className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-extrabold text-slate-900">9. Tin tức & Sự kiện mở bán</h2>
            </div>

            <div className="space-y-3">
              {(activeProject.news || []).map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <span className="text-2xs text-blue-600 font-bold">{item.date}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.snippet}</p>
                  </div>
                  <button
                    onClick={() => openContactSale(activeProject)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors whitespace-nowrap self-start sm:self-center"
                  >
                    Đăng ký tham gia
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 10. VIDEO GIỚI THIỆU & 3D */}
          <section id="proj-sec-video" className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Play className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-extrabold text-slate-900">10. Video giới thiệu & Phối cảnh 3D</h2>
            </div>

            <div className="aspect-16/9 rounded-3xl overflow-hidden bg-slate-900 relative group flex items-center justify-center">
              <img 
                src={activeProject.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
              <button 
                onClick={() => openInventory(activeProject)}
                className="absolute z-10 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform ring-8 ring-blue-600/30"
              >
                <Play className="w-6 h-6 fill-current ml-1" />
              </button>
              <div className="absolute bottom-4 left-6 text-white text-xs font-semibold">
                Phim giới thiệu kiến trúc & hệ sinh thái {activeProject.name}
              </div>
            </div>
          </section>

          {/* 11. BĐS CHUYỂN NHƯỢNG TẠI DỰ ÁN */}
          <section id="proj-sec-secondary-market" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-extrabold text-slate-900">
                  11. BĐS chuyển nhượng tại dự án ({relatedSecondarySales.length})
                </h2>
              </div>
            </div>

            {relatedSecondarySales.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-xl">
                Chưa có căn thứ cấp chuyển nhượng nào được đăng bán tại dự án này.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedSecondarySales.map((listing) => (
                  <div 
                    key={listing.id}
                    onClick={() => setActiveDetailListing(listing)}
                    className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-4 flex gap-3 shadow-2xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-2xs font-bold text-blue-600">{listing.price} • {listing.area}m²</span>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{listing.title}</h4>
                      <p className="text-2xs text-slate-500 truncate mt-0.5">{listing.floor} • {listing.direction}</p>
                      <span className="text-2xs font-semibold text-emerald-600 block mt-1">Chuyển nhượng thứ cấp</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 12. BĐS CHO THUÊ TẠI DỰ ÁN */}
          <section id="proj-sec-rental-market" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-extrabold text-slate-900">
                  12. BĐS cho thuê tại dự án ({relatedRentals.length})
                </h2>
              </div>
            </div>

            {relatedRentals.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-xl">
                Chưa có căn hộ cho thuê nào được niêm yết tại dự án này.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedRentals.map((listing) => (
                  <div 
                    key={listing.id}
                    onClick={() => setActiveDetailListing(listing)}
                    className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-4 flex gap-3 shadow-2xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-2xs font-bold text-blue-600">{listing.price} • {listing.area}m²</span>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{listing.title}</h4>
                      <p className="text-2xs text-slate-500 truncate mt-0.5">{listing.floor} • {listing.furnitureStatus}</p>
                      <span className="text-2xs font-semibold text-blue-600 block mt-1">Căn hộ cho thuê</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Bottom Floating Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 z-20">
          <div className="hidden sm:block">
            <span className="text-2xs text-slate-400 block font-medium">Giá bán sơ cấp trực tiếp CĐT</span>
            <span className="text-base font-black text-blue-700">{activeProject.priceFrom}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => openContactSale(activeProject)}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>Liên hệ tư vấn</span>
            </button>

            <button
              onClick={() => {
                const p = activeProject;
                setActiveProject(null);
                openInventory(p);
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>Xem giỏ hàng ({activeProject.availableUnitsCount} căn)</span>
            </button>
          </div>
        </div>

        {/* Layout Image Fullscreen Zoom Modal */}
        {selectedLayoutImage && (
          <div 
            onClick={() => setSelectedLayoutImage(null)}
            className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative max-w-4xl w-full bg-white rounded-3xl p-4 overflow-hidden shadow-2xl">
              <button 
                onClick={() => setSelectedLayoutImage(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
              <img 
                src={selectedLayoutImage} 
                alt="Layout preview" 
                className="w-full max-h-[80vh] object-contain rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}

        {/* Gallery Lightbox */}
        {selectedGalleryIndex !== null && (
          <div 
            onClick={() => setSelectedGalleryIndex(null)}
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative max-w-5xl w-full">
              <button 
                onClick={() => setSelectedGalleryIndex(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-slate-300"
              >
                <X className="w-6 h-6" />
              </button>
              <img 
                src={activeProject.gallery[selectedGalleryIndex] || activeProject.thumbnail} 
                alt="" 
                className="w-full max-h-[85vh] object-contain rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

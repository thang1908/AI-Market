import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Building2, 
  Compass, 
  Layers, 
  Heart, 
  PhoneCall, 
  BookmarkPlus, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Maximize2, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  Clock,
  Share2,
  FileText
} from 'lucide-react';
import { PrimaryInventoryUnit } from '../../types';
import { useAppState } from '../../state/useAppState';
import { mockProjects } from '../../data/mockPrimaryProjects';

export const PrimaryUnitDetailModal: React.FC = () => {
  const {
    activePrimaryUnit,
    setActivePrimaryUnit,
    openBookingModal,
    openContactSale,
    openEvaluation,
    isUnitSaved,
    toggleSaveUnit
  } = useAppState();

  const [selectedZoomImage, setSelectedZoomImage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!activePrimaryUnit) return null;

  const isSaved = isUnitSaved(activePrimaryUnit.id);
  const project = mockProjects.find(p => p.id === activePrimaryUnit.projectId);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Còn hàng':
        return 'bg-emerald-500 text-white';
      case 'Đang giữ chỗ':
        return 'bg-amber-500 text-white';
      case 'Đã booking':
        return 'bg-blue-600 text-white';
      case 'Đã bán':
        return 'bg-slate-400 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  return (
    <div id="primary-unit-detail-backdrop" className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        id="primary-unit-detail-modal"
        className="bg-white w-full h-full sm:h-[92vh] sm:max-w-4xl rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 relative"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              id="close-unit-detail-btn"
              onClick={() => setActivePrimaryUnit(null)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Đóng chi tiết căn"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xs font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                  {activePrimaryUnit.projectName}
                </span>
                <span className={`text-2xs px-2 py-0.5 rounded-md font-bold ${getStatusBadge(activePrimaryUnit.status)}`}>
                  {activePrimaryUnit.status}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5 truncate">
                Căn hộ {activePrimaryUnit.unitCode} • {activePrimaryUnit.buildingName} (Tầng {activePrimaryUnit.floor})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors text-xs font-semibold flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? 'Đã chép' : 'Chia sẻ'}</span>
            </button>

            <button
              onClick={() => toggleSaveUnit(activePrimaryUnit.id)}
              className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-bold ${
                isSaved
                  ? 'border-red-200 bg-red-50 text-red-600'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Đã lưu' : 'Lưu căn'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8">
          
          {/* Top Quick Price Highlight Card */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-2xs text-blue-200 uppercase font-bold tracking-wider block">
                Tổng giá bán trực tiếp Chủ Đầu Tư (gồm VAT & KPBT)
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {activePrimaryUnit.totalPrice}
                </span>
                <span className="text-xs text-blue-200 font-semibold">
                  ~ {activePrimaryUnit.pricePerM2}
                </span>
              </div>
              <p className="text-xs text-blue-100/80 mt-1">
                {activePrimaryUnit.projectName} • {activePrimaryUnit.phaseName}
              </p>
            </div>

            <div className="flex sm:flex-col gap-2">
              <button
                onClick={() => openBookingModal(activePrimaryUnit)}
                className="flex-1 sm:flex-none px-6 py-3 bg-white hover:bg-blue-50 text-blue-900 rounded-2xl text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <BookmarkPlus className="w-4 h-4 text-blue-700" />
                <span>Yêu cầu giữ căn</span>
              </button>

              <button
                onClick={() => openEvaluation(activePrimaryUnit)}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Đánh giá</span>
              </button>
            </div>
          </div>

          {/* Specifications Matrix */}
          <section className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Thông số kỹ thuật chi tiết
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Mã căn hộ</span>
                <span className="font-bold text-slate-900 text-sm">{activePrimaryUnit.unitCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Loại hình</span>
                <span className="font-bold text-slate-900 text-sm">{activePrimaryUnit.unitType}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Diện tích thông thuỷ</span>
                <span className="font-bold text-slate-900 text-sm">{activePrimaryUnit.area} m²</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Tầng</span>
                <span className="font-bold text-slate-900 text-sm">Tầng {activePrimaryUnit.floor}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Phòng ngủ / WC</span>
                <span className="font-bold text-slate-900 text-sm">{activePrimaryUnit.bedrooms} PN • {activePrimaryUnit.bathrooms} WC</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Hướng cửa chính</span>
                <span className="font-bold text-slate-900 text-sm">{activePrimaryUnit.doorDirection || 'Tây Bắc'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Hướng ban công</span>
                <span className="font-bold text-slate-900 text-sm">{activePrimaryUnit.balconyDirection || 'Đông Nam'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Tầm nhìn (View)</span>
                <span className="font-bold text-blue-700 text-xs line-clamp-1">{activePrimaryUnit.view || 'Nội khu'}</span>
              </div>
            </div>
          </section>

          {/* Layout Diagram Floorplan */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Mặt bằng thiết kế căn hộ
              </h3>
              <span className="text-2xs text-slate-400">Click ảnh để phóng to</span>
            </div>

            <div 
              onClick={() => setSelectedZoomImage(activePrimaryUnit.layoutImage)}
              className="bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-3xl p-4 flex items-center justify-center cursor-pointer group relative overflow-hidden transition-all"
            >
              <img
                src={activePrimaryUnit.layoutImage}
                alt={`Mặt bằng căn ${activePrimaryUnit.unitCode}`}
                className="max-h-72 object-contain group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Maximize2 className="w-6 h-6" />
              </div>
            </div>
          </section>

          {/* 3D / View Simulation from Balcony */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                Mô phỏng tầm nhìn thực tế (View từ căn hộ)
              </h3>
            </div>

            {activePrimaryUnit.viewSimulationUrl ? (
              <div className="relative rounded-3xl overflow-hidden aspect-16/9 bg-slate-900 shadow-md group">
                <img
                  src={activePrimaryUnit.viewSimulationUrl}
                  alt={`Tầm nhìn căn ${activePrimaryUnit.unitCode}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Mô phỏng 3D từ ban công tầng {activePrimaryUnit.floor} ({activePrimaryUnit.balconyDirection})</span>
                  </div>
                  <span className="font-bold bg-blue-600/80 px-2.5 py-1 rounded-lg">
                    {activePrimaryUnit.view}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-8 text-center space-y-2">
                <EyeOff className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700">
                  Chưa có mô phỏng tầm nhìn cho căn này
                </h4>
                <p className="text-2xs text-slate-400 max-w-sm mx-auto">
                  Dữ liệu phối cảnh 360 độ góc nhìn thực tế của toà tháp này đang được cập nhật từ Chủ đầu tư.
                </p>
              </div>
            )}
          </section>

          {/* Payment Policies & Discounts */}
          {activePrimaryUnit.paymentPolicies && activePrimaryUnit.paymentPolicies.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Chính sách bán hàng & Chiết khấu đặc quyền
              </h3>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-2">
                {activePrimaryUnit.paymentPolicies.map((pol, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-semibold">{pol}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Payment Schedule Table */}
          {activePrimaryUnit.paymentSchedule && activePrimaryUnit.paymentSchedule.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Tiến độ thanh toán chuẩn
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100/80 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Đợt thanh toán</th>
                      <th className="px-4 py-3">Tỷ lệ thanh toán</th>
                      <th className="px-4 py-3">Ghi chú tiến độ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {activePrimaryUnit.paymentSchedule.map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30">
                        <td className="px-4 py-3 font-bold text-slate-900">{item.milestone}</td>
                        <td className="px-4 py-3 font-extrabold text-blue-700">{item.percentage}</td>
                        <td className="px-4 py-3 text-slate-600">{item.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Distributor Pool */}
          {activePrimaryUnit.distributionSources && activePrimaryUnit.distributionSources.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Nguồn phân phối đa sàn (Primary Distribution Pool)
              </h3>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 divide-y divide-slate-200/60">
                {activePrimaryUnit.distributionSources.map((src, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{src.distributorName}</span>
                      <span className="text-2xs text-slate-400 block mt-0.5">Cập nhật {src.updatedAt}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-blue-700">{src.price}</span>
                      <span className="text-2xs text-emerald-600 font-semibold block">{src.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Floating Bottom Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 z-10">
          <div className="hidden sm:block">
            <span className="text-2xs text-slate-400 block font-medium">Giá bán sơ cấp trực tiếp</span>
            <span className="text-lg font-black text-blue-700">{activePrimaryUnit.totalPrice}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => openContactSale(activePrimaryUnit)}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>Liên hệ tư vấn</span>
            </button>

            <button
              onClick={() => openBookingModal(activePrimaryUnit)}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Yêu cầu giữ căn / Booking</span>
            </button>
          </div>
        </div>

        {/* Layout Zoom Lightbox */}
        {selectedZoomImage && (
          <div 
            onClick={() => setSelectedZoomImage(null)}
            className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative max-w-4xl w-full bg-white rounded-3xl p-4 overflow-hidden shadow-2xl">
              <button 
                onClick={() => setSelectedZoomImage(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
              <img 
                src={selectedZoomImage} 
                alt="Layout zoomed" 
                className="w-full max-h-[80vh] object-contain rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

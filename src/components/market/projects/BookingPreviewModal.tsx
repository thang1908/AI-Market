import React, { useState } from 'react';
import { X, BookmarkPlus, CheckCircle2, ShieldCheck, Clock, Building2, User, Phone, Mail, AlertCircle } from 'lucide-react';
import { useAppState } from '../../../state/useAppState';

export const BookingPreviewModal: React.FC = () => {
  const { isBookingModalOpen, closeBookingModal, bookingUnit } = useAppState();

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isBookingModalOpen || !bookingUnit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setCustomerName('');
    setPhoneNumber('');
    setEmail('');
    setNote('');
    closeBookingModal();
  };

  return (
    <div id="booking-preview-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        id="booking-preview-container"
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <BookmarkPlus className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Yêu cầu giữ căn / Booking
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                  Demo workflow
                </span>
              </div>
              <p className="text-xs text-slate-500">Giữ chỗ ưu tiên trực tiếp từ giỏ hàng sơ cấp</p>
            </div>
          </div>
          <button
            id="close-booking-modal-btn"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Yêu cầu giữ căn đã được ghi nhận!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mt-1">
                  Thông tin căn <span className="font-bold text-slate-800">{bookingUnit.unitCode}</span> ({bookingUnit.projectName}) đã được chuyển tới chuyên viên tư vấn sàn phân phối <span className="font-bold text-blue-700">{bookingUnit.distributor || 'CapitaLand'}</span>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left max-w-sm mx-auto space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Khách hàng:</span>
                  <span className="font-bold text-slate-800">{customerName || 'Quý khách'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số điện thoại:</span>
                  <span className="font-bold text-slate-800">{phoneNumber || 'Đang cập nhật'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Thời gian phản hồi:</span>
                  <span className="font-bold text-emerald-600">Trong 15 phút</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  Hoàn tất & Đóng
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Unit Summary Card */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-bold uppercase text-blue-700">Thông tin sản phẩm giữ chỗ</span>
                  <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">{bookingUnit.unitType}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-extrabold text-slate-900">
                    Căn {bookingUnit.unitCode} • {bookingUnit.buildingName}
                  </span>
                  <span className="text-base font-black text-blue-700">
                    {bookingUnit.totalPrice}
                  </span>
                </div>
                <div className="text-xs text-slate-600 grid grid-cols-2 gap-1 pt-1 border-t border-blue-100/60">
                  <span>Dự án: <strong>{bookingUnit.projectName}</strong></span>
                  <span>Diện tích: <strong>{bookingUnit.area} m²</strong></span>
                  <span>Sàn phân phối: <strong>{bookingUnit.distributor || 'CapitaLand F1'}</strong></span>
                  <span>Chuyên viên: <strong>Nguyễn Hoàng Minh (F1 Lead)</strong></span>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-start gap-2 bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Hệ thống tiếp nhận yêu cầu lock căn sơ cấp 24h. Chuyên viên sẽ gọi điện xác thực phiếu đăng ký trước khi phát hành thỏa thuận đặt cọc chính thức.
                </span>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    Họ và tên khách hàng *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    Số điện thoại nhận xác nhận *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Ví dụ: 0912 345 678"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    Email nhận chính sách & tiến độ (không bắt buộc)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ghi chú thêm (nguyện vọng về tầng, gói nội thất, tiến độ vay)
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ví dụ: Cần vay 70% ngân hàng và muốn chọn tầng từ 10-18..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Xác nhận giữ căn</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};

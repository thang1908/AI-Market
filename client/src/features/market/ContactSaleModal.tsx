import React, { useState } from 'react';
import { X, PhoneCall, CheckCircle2, ShieldCheck, Clock, MapPin, Send, Building2, Layers } from 'lucide-react';
import { useAppState } from '../../state/useAppState';

const CONSULTATION_TOPICS = [
  'Giá & chính sách CĐT',
  'Tình trạng giỏ hàng',
  'Đặt lịch xem nhà mẫu / thực tế',
  'Pháp lý & HĐMB',
  'Chính sách vay 0% & tiến độ',
  'Thủ tục giữ căn / Booking'
];

export const ContactSaleModal: React.FC = () => {
  const { isContactSaleOpen, closeContactSale, contactSaleContext, contactSaleListing } = useAppState();

  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Giá & chính sách CĐT']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isContactSaleOpen) return null;

  const target = contactSaleContext || (contactSaleListing ? {
    id: contactSaleListing.id,
    title: contactSaleListing.title,
    district: contactSaleListing.district,
    price: contactSaleListing.price,
    area: contactSaleListing.area,
    bedrooms: contactSaleListing.bedrooms,
    image: contactSaleListing.images[0],
    type: 'listing' as const
  } : null);

  if (!target) return null;

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setPhoneNumber('');
    setFullName('');
    setNote('');
    closeContactSale();
  };

  return (
    <div id="contact-sale-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="contact-sale-container"
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Liên hệ tư vấn {target.type === 'project' ? 'Dự án' : target.type === 'unit' ? 'Căn hộ sơ cấp' : 'Bất động sản'}
              </h2>
              <p className="text-xs text-slate-500">Chuyên viên hỗ trợ thông tin giỏ hàng & chính sách nhanh chóng</p>
            </div>
          </div>
          <button
            id="close-contact-modal-btn"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {isSubmitted ? (
            <div className="text-center py-8 space-y-3 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Yêu cầu tư vấn đã được gửi thành công!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Chuyên viên tư vấn khu vực <span className="font-bold text-slate-700">{target.district}</span> ({target.distributor || 'Đại diện phân phối'}) sẽ liên hệ với bạn qua số điện thoại <span className="font-bold text-slate-700">{phoneNumber || 'của bạn'}</span> trong vòng 15 phút.
              </p>
              <div className="pt-4">
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
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Property Snapshot Card */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                {target.image && (
                  <img
                    src={target.image}
                    alt={target.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                      {target.type === 'project' ? 'Dự án' : target.type === 'unit' ? 'Căn sơ cấp' : 'Thứ cấp'}
                    </span>
                    {target.distributor && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        Sàn: {target.distributor}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                    {target.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{target.district}</span>
                  </div>
                  <div className="text-xs font-bold text-blue-700 mt-1">
                    {target.price} {target.area ? `• ${target.area}m²` : ''} {target.bedrooms ? `• ${target.bedrooms} PN` : ''}
                  </div>
                </div>
              </div>

              {/* Topic Select Question */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Bạn muốn được hỗ trợ về nội dung nào? <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CONSULTATION_TOPICS.map(topic => {
                    const isChecked = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                          isChecked
                            ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate text-2xs">{topic}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="VD: 0912 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Họ và tên (không bắt buộc)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Ghi chú thêm (nếu có)
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="VD: Cần bảng tính dòng tiền vay, xem nhà mẫu trong tuần này..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 transition-all font-medium resize-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={selectedTopics.length === 0}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi yêu cầu tư vấn</span>
                </button>
                <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 mt-2.5 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bảo mật thông tin 100%</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Phản hồi trong 15 phút</span>
                  </span>
                </div>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};


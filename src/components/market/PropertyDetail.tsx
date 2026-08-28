import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ThumbsUp, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Compass, 
  ShieldCheck, 
  Building, 
  TrendingUp, 
  CheckCircle, 
  Share2, 
  Layers, 
  Info,
  PhoneCall
} from 'lucide-react';
import { PropertyListing } from '../../types';
import { useAppState } from '../../state/useAppState';

interface PropertyDetailProps {
  listing: PropertyListing;
  onClose: () => void;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ listing, onClose }) => {
  const { 
    toggleSaveListing, 
    isListingSaved, 
    toggleInterestListing, 
    isListingInterested,
    openContactSale
  } = useAppState();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);

  const isSaved = isListingSaved(listing.id);
  const isInterested = isListingInterested(listing.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleContactClick = () => {
    openContactSale(listing);
  };

  return (
    <div id="property-detail-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      
      <div 
        id="property-detail-container"
        className="w-full md:w-[720px] lg:w-[840px] h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-250 relative"
      >
        
        {/* Detail Sticky Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                listing.mode === 'sale'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {listing.mode === 'sale' ? 'Đang bán' : 'Cho thuê'}
            </span>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {listing.propertyType}
            </span>
            <span className="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
              DEMO DATA
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="Chia sẻ tin đăng"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="close-property-detail-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              title="Đóng chi tiết"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-8 pb-32">
          
          {/* 1. Image Gallery */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs">
              <img
                src={listing.images[activeImageIndex] || listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full">
                Ảnh {activeImageIndex + 1} / {listing.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {listing.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-blue-600 scale-105 shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Main Title & Key Specs Header */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">
                  {listing.price}
                </div>
                {listing.pricePerM2 && (
                  <div className="text-xs font-semibold text-slate-400 mt-0.5">
                    Đơn giá: ~{listing.pricePerM2}
                  </div>
                )}
              </div>
              <div className="text-right text-xs text-slate-400">
                <span>Cập nhật: {listing.updatedAt}</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {listing.title}
            </h1>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{listing.address}, {listing.district}, {listing.city}</span>
            </div>
          </div>

          {/* 3. Key Specifications Quick Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <div className="p-2">
              <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Diện tích</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900">{listing.area} m²</div>
            </div>

            <div className="p-2">
              <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                <Bed className="w-3.5 h-3.5 text-blue-600" />
                <span>Phòng ngủ</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900">{listing.bedrooms} PN</div>
            </div>

            <div className="p-2">
              <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                <Bath className="w-3.5 h-3.5 text-blue-600" />
                <span>Phòng tắm</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900">{listing.bathrooms} WC</div>
            </div>

            <div className="p-2">
              <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Vị trí tầng</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900">{listing.floor || 'Trung tầng'}</div>
            </div>
          </div>

          {/* 4. Structured Parameters Table */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Thông tin chi tiết Bất động sản</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">Hướng ban công / cửa</span>
                <span className="font-bold text-slate-900">{listing.direction || 'Đông Nam'}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">Tình trạng nội thất</span>
                <span className="font-bold text-slate-900">{listing.furniture || 'Đầy đủ cao cấp'}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">Tình trạng pháp lý</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{listing.legalStatus || 'Sổ đỏ lâu dài'}</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">Phí quản lý ước tính</span>
                <span className="font-bold text-slate-900">{listing.managementFee || '16.500 đ/m²/tháng'}</span>
              </div>
            </div>
          </div>

          {/* 5. Description */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Mô tả chi tiết
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              {listing.description}
            </p>
          </div>

          {/* 6. Amenities & Facilities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Tiện ích dự án & khu vực</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-50/50 text-blue-800 rounded-xl border border-blue-100"
                  >
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                    <span>{amenity}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 7. Nearby Infrastructure */}
          {listing.infrastructure && listing.infrastructure.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Hạ tầng & Kết nối giao thông</span>
              </h3>

              <div className="space-y-2">
                {listing.infrastructure.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Source & Verification */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Nguồn tin & Xác thực thông tin</span>
            </div>
            <p>
              Dữ liệu được cập nhật từ bảng hàng và môi giới đối tác uy tín. Thông tin mang tính tham khảo và có thể thay đổi tùy tình trạng giao dịch thực tế.
            </p>
          </div>

        </div>

        {/* Sticky CTA Bottom Bar: [♡ Lưu] [Quan tâm] [Liên hệ tư vấn] */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl flex items-center gap-3 z-20">
          
          {/* Save Button */}
          <button
            id="detail-save-btn"
            onClick={() => toggleSaveListing(listing.id)}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center shrink-0 ${
              isSaved
                ? 'bg-rose-50 border-rose-300 text-rose-600 font-bold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Đã lưu (Bấm để bỏ lưu)' : 'Lưu tin'}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-600' : ''}`} />
          </button>

          {/* Interested Button */}
          <button
            id="detail-interest-btn"
            onClick={() => toggleInterestListing(listing.id)}
            className={`px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold border flex items-center justify-center gap-1.5 transition-all shrink-0 ${
              isInterested
                ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isInterested ? 'fill-emerald-600' : ''}`} />
            <span>{isInterested ? 'Đã quan tâm' : 'Quan tâm'}</span>
          </button>

          {/* Contact Sale Button */}
          <button
            id="detail-contact-sale-btn"
            onClick={handleContactClick}
            className="flex-1 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Liên hệ tư vấn</span>
          </button>

        </div>

      </div>

      {/* Copied Toast */}
      {copiedToast && (
        <div className="fixed bottom-24 right-8 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl z-60 animate-in fade-in duration-150">
          Đã sao chép liên kết chia sẻ!
        </div>
      )}

    </div>
  );
};

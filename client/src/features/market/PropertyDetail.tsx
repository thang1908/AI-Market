import React, { useState, useEffect } from 'react';
import {
  X, Heart, ThumbsUp, MapPin, Bed, Bath, Maximize2,
  Compass, ShieldCheck, Building, TrendingUp, CheckCircle,
  Share2, Layers, Info, PhoneCall, ChevronLeft, ChevronRight,
  Sofa, Calendar, User, Phone, ExternalLink, Loader2,
} from 'lucide-react';
import { PropertyListing } from '../../types';
import { useAppState } from '../../state/useAppState';
import { listingsApi, mapToPropertyListing, BackendListing } from '../../api/listingsApi';

interface PropertyDetailProps {
  listing: PropertyListing;
  onClose: () => void;
}

// Format ngày ISO → "DD/MM/YYYY"
function formatDate(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return isoStr;
  }
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ listing, onClose }) => {
  const {
    toggleSaveListing,
    isListingSaved,
    toggleInterestListing,
    isListingInterested,
    openContactSale,
  } = useAppState();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);
  // Detail đầy đủ từ API (có contact_name, contact_phone)
  const [detail, setDetail] = useState<PropertyListing>(listing);
  const [rawDetail, setRawDetail] = useState<BackendListing | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const isSaved = isListingSaved(listing.id);
  const isInterested = isListingInterested(listing.id);

  // Fetch chi tiết đầy đủ từ API khi mở drawer
  useEffect(() => {
    let cancelled = false;
    setIsLoadingDetail(true);
    listingsApi.getDetail(listing.id)
      .then((raw) => {
        if (!cancelled) {
          setRawDetail(raw);
          setDetail(mapToPropertyListing(raw));
          setIsLoadingDetail(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoadingDetail(false);
      });
    return () => { cancelled = true; };
  }, [listing.id]);

  const images = detail.images.length > 0 ? detail.images : [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  ];

  const prevImage = () =>
    setActiveImageIndex((i) => (i - 1 + images.length) % images.length);
  const nextImage = () =>
    setActiveImageIndex((i) => (i + 1) % images.length);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  // Google Maps embed URL từ tọa độ hoặc địa chỉ
  const mapQuery = rawDetail?.latitude && rawDetail?.longitude
    ? `${rawDetail.latitude},${rawDetail.longitude}`
    : encodeURIComponent(detail.address);

  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;
  const mapLinkUrl = rawDetail?.latitude && rawDetail?.longitude
    ? `https://www.google.com/maps?q=${rawDetail.latitude},${rawDetail.longitude}`
    : `https://www.google.com/maps/search/${encodeURIComponent(detail.address)}`;

  return (
    <div
      id="property-detail-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        id="property-detail-container"
        className="w-full md:w-[720px] lg:w-[860px] h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-250 relative"
      >
        {/* ── Sticky Header ── */}
        <div className="px-5 py-3.5 border-b border-slate-100 bg-white/95 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              detail.mode === 'sale' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {detail.mode === 'sale' ? 'Đang bán' : 'Cho thuê'}
            </span>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {detail.propertyType}
            </span>
            {isLoadingDetail && (
              <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="Chia sẻ"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="close-property-detail-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto pb-32">

          {/* 1. Image Gallery */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative h-64 sm:h-80 bg-slate-100 overflow-hidden">
              <img
                key={activeImageIndex}
                src={images[activeImageIndex]}
                alt={detail.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-xs text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-xs text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              {/* Counter */}
              <div className="absolute bottom-3 right-3 bg-slate-900/75 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full">
                {activeImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 px-5 py-3 overflow-x-auto bg-slate-50 border-b border-slate-100">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-blue-600 scale-105 shadow-sm'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 sm:p-7 space-y-8">

            {/* 2. Giá & Tiêu đề */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">
                    {detail.price}
                  </div>
                  {detail.pricePerM2 && (
                    <div className="text-xs font-semibold text-slate-400 mt-0.5">
                      Đơn giá: ~{detail.pricePerM2}
                    </div>
                  )}
                </div>
                <div className="text-right text-xs text-slate-400 shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(detail.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {detail.title}
              </h1>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{detail.address}</span>
              </div>
            </div>

            {/* 3. Thông số nhanh */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                  <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Diện tích</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900">{detail.area} m²</div>
              </div>

              {detail.bedrooms > 0 ? (
                <div className="p-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                    <Bed className="w-3.5 h-3.5 text-blue-600" />
                    <span>Phòng ngủ</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">{detail.bedrooms} PN</div>
                </div>
              ) : (
                <div className="p-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                    <Bed className="w-3.5 h-3.5 text-blue-600" />
                    <span>Phòng ngủ</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-500">—</div>
                </div>
              )}

              {detail.bathrooms > 0 ? (
                <div className="p-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                    <Bath className="w-3.5 h-3.5 text-blue-600" />
                    <span>Phòng tắm</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">{detail.bathrooms} WC</div>
                </div>
              ) : (
                <div className="p-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                    <Bath className="w-3.5 h-3.5 text-blue-600" />
                    <span>Phòng tắm</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-500">—</div>
                </div>
              )}

              <div className="p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Vị trí tầng</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  {detail.floor ?? '—'}
                </div>
              </div>
            </div>

            {/* 4. Bảng thông tin chi tiết */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                Thông tin chi tiết
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {detail.direction && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Compass className="w-3.5 h-3.5" />
                      Hướng cửa / ban công
                    </span>
                    <span className="font-bold text-slate-900">{detail.direction}</span>
                  </div>
                )}

                {detail.furnitureStatus && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Sofa className="w-3.5 h-3.5" />
                      Tình trạng nội thất
                    </span>
                    <span className="font-bold text-slate-900">{detail.furnitureStatus}</span>
                  </div>
                )}

                {detail.legalStatus && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Tình trạng pháp lý
                    </span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {detail.legalStatus}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Building className="w-3.5 h-3.5" />
                    Loại hình
                  </span>
                  <span className="font-bold text-slate-900">{detail.propertyType}</span>
                </div>
              </div>
            </div>

            {/* 5. Mô tả */}
            {detail.description && (
              <div className="space-y-3">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Mô tả chi tiết</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {detail.description}
                </p>
              </div>
            )}

            {/* 6. Thông tin người đăng */}
            {rawDetail && (rawDetail.contact_name || rawDetail.contact_phone) && (
              <div className="space-y-3">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Thông tin người đăng
                </h3>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-3">
                  {rawDetail.contact_name && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {rawDetail.contact_name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{rawDetail.contact_name}</div>
                        <div className="text-xs text-slate-500">Môi giới / Chủ nhà</div>
                      </div>
                    </div>
                  )}
                  {rawDetail.contact_phone && (
                    <a
                      href={`tel:${rawDetail.contact_phone}`}
                      className="flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      {rawDetail.contact_phone}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* 7. Bản đồ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Vị trí trên bản đồ
                </h3>
                <a
                  href={mapLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Xem Google Maps
                </a>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 h-56 sm:h-64 bg-slate-100">
                <iframe
                  title="Bản đồ vị trí BĐS"
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="text-xs text-slate-400 text-center">
                {detail.address}
              </p>
            </div>

            {/* 8. Nguồn dữ liệu */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Nguồn tin & Xác thực
              </div>
              <p>
                Dữ liệu cập nhật từ bảng hàng và môi giới đối tác uy tín.
                Thông tin mang tính tham khảo và có thể thay đổi theo thực tế giao dịch.
              </p>
            </div>

          </div>
        </div>

        {/* ── Sticky CTA Bottom ── */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl flex items-center gap-3 z-20">
          {/* Save */}
          <button
            id="detail-save-btn"
            onClick={() => toggleSaveListing(listing.id)}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center shrink-0 ${
              isSaved
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Bỏ lưu' : 'Lưu tin'}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-600' : ''}`} />
          </button>

          {/* Interested */}
          <button
            id="detail-interest-btn"
            onClick={() => toggleInterestListing(listing.id)}
            className={`px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold border flex items-center gap-1.5 transition-all shrink-0 ${
              isInterested
                ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isInterested ? 'fill-emerald-600' : ''}`} />
            <span>{isInterested ? 'Đã quan tâm' : 'Quan tâm'}</span>
          </button>

          {/* Contact */}
          <button
            id="detail-contact-sale-btn"
            onClick={() => openContactSale(detail)}
            className="flex-1 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>
              {rawDetail?.contact_phone
                ? `Gọi ${rawDetail.contact_phone}`
                : 'Liên hệ tư vấn'}
            </span>
          </button>
        </div>

        {/* Toast copied */}
        {copiedToast && (
          <div className="fixed bottom-24 right-8 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl z-60 animate-in fade-in duration-150">
            Đã sao chép liên kết chia sẻ!
          </div>
        )}
      </div>
    </div>
  );
};

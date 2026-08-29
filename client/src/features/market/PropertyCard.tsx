import React from 'react';
import { Heart, MapPin, Bed, Bath, Maximize2, Clock, ThumbsUp, MessageSquare, PhoneCall } from 'lucide-react';
import { PropertyListing } from '../../types';
import { useAppState } from '../../state/useAppState';

interface PropertyCardProps {
  listing: PropertyListing;
  onOpenDetail: (listing: PropertyListing) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ listing, onOpenDetail }) => {
  const { 
    toggleSaveListing, 
    isListingSaved, 
    toggleInterestListing, 
    isListingInterested,
    openContactSale
  } = useAppState();

  const isSaved = isListingSaved(listing.id);
  const isInterested = isListingInterested(listing.id);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveListing(listing.id);
  };

  const handleInterestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleInterestListing(listing.id);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openContactSale(listing);
  };

  return (
    <div
      id={`property-card-${listing.id}`}
      onClick={() => onOpenDetail(listing)}
      className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Image & Overlay Badges */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs ${
                listing.mode === 'sale'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {listing.mode === 'sale' ? 'Bán' : 'Cho thuê'}
            </span>

            <span className="bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
              DEMO DATA
            </span>
          </div>

          {/* Heart / Save Button */}
          <button
            id={`save-btn-${listing.id}`}
            type="button"
            onClick={handleHeartClick}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-xs ${
              isSaved
                ? 'bg-rose-500 text-white scale-110'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
            title={isSaved ? 'Đã lưu (Bấm để bỏ lưu)' : 'Lưu tin đăng này'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>

          {/* Updated time tag bottom */}
          <div className="absolute bottom-2.5 left-3 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3 text-slate-300" />
            <span>{listing.updatedAt}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          
          {/* Price & Price/m2 */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div className="text-lg sm:text-xl font-extrabold text-blue-600 tracking-tight">
              {listing.price}
            </div>
            {listing.pricePerM2 && (
              <span className="text-xs font-semibold text-slate-400">
                ~{listing.pricePerM2}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1 leading-snug">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-3 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{listing.address}</span>
          </div>

          {/* Specs: Area • Bedrooms • Bathrooms • Floor */}
          <div className="flex items-center gap-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{listing.area}m²</span>
            </div>

            {listing.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span>{listing.bedrooms} PN</span>
              </div>
            )}

            {listing.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span>{listing.bathrooms} WC</span>
              </div>
            )}

            {listing.floor && (
              <div className="text-slate-400 text-[11px] ml-auto hidden sm:block font-normal">
                {listing.floor}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Card Footer Actions: [Quan tâm] [Chi tiết] [Liên hệ tư vấn] */}
      <div className="px-3.5 pb-3.5 pt-1.5 flex items-center justify-between gap-1.5 border-t border-slate-50">
        <button
          type="button"
          onClick={handleInterestClick}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            isInterested
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
          }`}
          title={isInterested ? 'Đã thêm vào danh sách quan tâm' : 'Quan tâm'}
        >
          <ThumbsUp className={`w-3 h-3 ${isInterested ? 'fill-emerald-600' : ''}`} />
          <span>{isInterested ? 'Đã quan tâm' : 'Quan tâm'}</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenDetail(listing)}
          className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors shrink-0"
        >
          Chi tiết
        </button>

        <button
          type="button"
          onClick={handleContactClick}
          className="py-1.5 px-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all shadow-2xs shrink-0"
        >
          <PhoneCall className="w-3 h-3" />
          <span>Liên hệ tư vấn</span>
        </button>
      </div>
    </div>
  );
};

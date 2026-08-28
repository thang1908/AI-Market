import React from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  Crown, 
  PhoneCall, 
  Maximize2, 
  Bed, 
  Bath, 
  ShieldCheck, 
  Compass, 
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useAppState, calculateListingEvaluation } from '../../state/useAppState';
import { mockListings } from '../../data/mockListings';

export const AIComparisonModal: React.FC = () => {
  const { 
    isComparisonOpen, 
    closeComparison, 
    savedListingIds, 
    customerRequirement,
    openContactSale,
    setActiveDetailListing
  } = useAppState();

  if (!isComparisonOpen) return null;

  const savedListings = mockListings.filter(item => savedListingIds.includes(item.id));

  if (savedListings.length === 0) {
    return null;
  }

  // Calculate evaluation for all listings
  const evaluatedListings = savedListings.map(listing => ({
    listing,
    eval: calculateListingEvaluation(listing, customerRequirement)
  }));

  // Find the top match
  const topMatch = evaluatedListings.reduce((prev, current) => 
    (prev.eval.matchScore > current.eval.matchScore) ? prev : current
  , evaluatedListings[0]);

  const handleOpenDetail = (listing: any) => {
    closeComparison();
    setActiveDetailListing(listing);
  };

  const handleContactSale = (listing: any) => {
    closeComparison();
    openContactSale(listing);
  };

  return (
    <div id="ai-comparison-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        id="ai-comparison-container"
        className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/90 to-indigo-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  AI So sánh {savedListings.length} Bất động sản đã lưu
                </h2>
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-md uppercase">
                  Phân tích đa tiêu chí
                </span>
              </div>
              <p className="text-xs text-slate-500">Đối chiếu thông số, mức độ phù hợp và lợi thế cạnh tranh</p>
            </div>
          </div>
          <button
            id="close-comparison-modal-btn"
            onClick={closeComparison}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-600 flex items-center justify-center transition-colors shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* AI Comprehensive Summary Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-xs font-extrabold text-blue-300">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>TỔNG KẾT SO SÁNH TỪ AI</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Dựa trên tiêu chí ngân sách <span className="font-bold text-white">~{customerRequirement.budget} tỷ</span> và nhu cầu <span className="font-bold text-white">{customerRequirement.bedrooms}PN ({customerRequirement.purpose === 'SELF_USE' ? 'ở thực' : 'đầu tư'})</span>, bất động sản <span className="font-extrabold text-emerald-400">"{topMatch.listing.title}"</span> đạt điểm tương thích cao nhất ({topMatch.eval.matchScore}%). 
              Nếu ưu tiên tối ưu tài chính, bạn có thể cân nhắc các căn hộ có đơn giá/m² thấp hơn; nếu ưu tiên không gian sống và tiện ích, căn dẫn đầu là lựa chọn vượt trội.
            </p>
          </div>

          {/* Comparison Table (Desktop & Scrollable) */}
          <div className="overflow-x-auto border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
            <table className="w-full text-xs text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="p-3.5 font-bold text-slate-500 w-44">Tiêu chí so sánh</th>
                  {evaluatedListings.map(({ listing, eval: itemEval }) => {
                    const isBest = listing.id === topMatch.listing.id;
                    return (
                      <th key={listing.id} className={`p-3.5 align-top min-w-[200px] ${isBest ? 'bg-blue-50/40' : ''}`}>
                        {isBest && (
                          <div className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md mb-2 shadow-2xs">
                            <Crown className="w-3 h-3" />
                            <span>Phù hợp nhất</span>
                          </div>
                        )}
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-24 object-cover rounded-xl mb-2 border border-slate-200"
                        />
                        <h4 className="font-extrabold text-slate-900 line-clamp-2 leading-snug">
                          {listing.title}
                        </h4>
                        <div className="text-slate-500 text-[11px] mt-0.5">{listing.district}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {/* Row: Match Score */}
                <tr className="bg-blue-50/20">
                  <td className="p-3.5 font-bold text-blue-900">Mức độ phù hợp (AI)</td>
                  {evaluatedListings.map(({ listing, eval: itemEval }) => (
                    <td key={listing.id} className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-black px-2.5 py-1 rounded-lg border ${
                          itemEval.matchScore >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {itemEval.matchScore}%
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Row: Price */}
                <tr>
                  <td className="p-3.5 font-bold text-slate-500">Giá bán / Thuê</td>
                  {evaluatedListings.map(({ listing }) => (
                    <td key={listing.id} className="p-3.5 font-extrabold text-sm text-blue-600">
                      {listing.price}
                    </td>
                  ))}
                </tr>

                {/* Row: Price per m2 */}
                <tr>
                  <td className="p-3.5 font-bold text-slate-500">Đơn giá / m²</td>
                  {evaluatedListings.map(({ listing }) => (
                    <td key={listing.id} className="p-3.5 font-semibold text-slate-600">
                      ~{listing.pricePerM2 || 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Row: Area */}
                <tr>
                  <td className="p-3.5 font-bold text-slate-500">Diện tích & Tầng</td>
                  {evaluatedListings.map(({ listing }) => (
                    <td key={listing.id} className="p-3.5">
                      <span className="font-bold text-slate-900">{listing.area} m²</span>
                      {listing.floor && <span className="text-slate-400 text-[11px] block">{listing.floor}</span>}
                    </td>
                  ))}
                </tr>

                {/* Row: Bedrooms & Bathrooms */}
                <tr>
                  <td className="p-3.5 font-bold text-slate-500">Phòng ngủ / WC</td>
                  {evaluatedListings.map(({ listing }) => (
                    <td key={listing.id} className="p-3.5 font-semibold text-slate-800">
                      {listing.bedrooms} PN • {listing.bathrooms} WC
                    </td>
                  ))}
                </tr>

                {/* Row: Direction & View */}
                <tr>
                  <td className="p-3.5 font-bold text-slate-500">Hướng ban công</td>
                  {evaluatedListings.map(({ listing }) => (
                    <td key={listing.id} className="p-3.5">
                      {listing.direction || 'Đông Nam'}
                    </td>
                  ))}
                </tr>

                {/* Row: Legal */}
                <tr>
                  <td className="p-3.5 font-bold text-slate-500">Tình trạng pháp lý</td>
                  {evaluatedListings.map(({ listing }) => (
                    <td key={listing.id} className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{listing.legalStatus || 'Sổ đỏ lâu dài'}</span>
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Row: Actions */}
                <tr className="bg-slate-50/50">
                  <td className="p-3.5 font-bold text-slate-500">Thao tác</td>
                  {evaluatedListings.map(({ listing }) => (
                    <td key={listing.id} className="p-3.5">
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => handleContactSale(listing)}
                          className="w-full py-2 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1 shadow-2xs text-xs"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>Tư vấn</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(listing)}
                          className="w-full py-1.5 px-2.5 bg-slate-200/80 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold text-[11px]"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={closeComparison}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all"
          >
            Đóng bảng so sánh
          </button>
        </div>

      </div>
    </div>
  );
};

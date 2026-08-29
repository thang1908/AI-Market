import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  Sliders, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Building,
  ExternalLink,
  Layers
} from 'lucide-react';
import { useAppState, calculateListingEvaluation } from '../../state/useAppState';
import { PropertyListing, PrimaryInventoryUnit } from '../../types';

export const AIEvaluationModal: React.FC = () => {
  const { 
    isEvaluationOpen, 
    closeEvaluation, 
    evaluatingTarget,
    evaluatingListing, 
    customerRequirement, 
    setCustomerRequirement,
    openContactSale,
    setActiveDetailListing,
    setActivePrimaryUnit
  } = useAppState();

  const [showRequirementEditor, setShowRequirementEditor] = useState(false);

  const target = evaluatingTarget || evaluatingListing;
  if (!isEvaluationOpen || !target) return null;

  const evaluation = calculateListingEvaluation(target, customerRequirement);

  const isPrimaryUnit = 'unitCode' in target;
  const unitTarget = isPrimaryUnit ? (target as PrimaryInventoryUnit) : null;
  const listingTarget = !isPrimaryUnit ? (target as PropertyListing) : null;

  const title = unitTarget 
    ? `Căn hộ ${unitTarget.unitCode} • ${unitTarget.buildingName} (${unitTarget.projectName})` 
    : listingTarget?.title || '';

  const location = unitTarget 
    ? `${unitTarget.projectName} • Tầng ${unitTarget.floor}` 
    : listingTarget?.address || '';

  const price = unitTarget ? unitTarget.totalPrice : listingTarget?.price || '';
  const area = unitTarget ? unitTarget.area : listingTarget?.area || 0;
  const bedrooms = unitTarget ? unitTarget.bedrooms : listingTarget?.bedrooms || 0;
  const image = unitTarget ? (unitTarget.layoutImage || unitTarget.viewSimulationUrl) : listingTarget?.images[0];

  const handleContactSale = () => {
    closeEvaluation();
    openContactSale(target);
  };

  const handleOpenDetail = () => {
    closeEvaluation();
    if (unitTarget) {
      setActivePrimaryUnit(unitTarget);
    } else if (listingTarget) {
      setActiveDetailListing(listingTarget);
    }
  };

  return (
    <div id="ai-evaluation-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="ai-evaluation-container"
        className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 to-indigo-50/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  AI Đánh giá mức độ phù hợp
                </h2>
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-md uppercase">
                  {isPrimaryUnit ? 'Sơ cấp CĐT' : 'Thị trường'}
                </span>
              </div>
              <p className="text-xs text-slate-500">Phân tích dựa trên nhu cầu và tiêu chí thực tế của bạn</p>
            </div>
          </div>
          <button
            id="close-evaluation-modal-btn"
            onClick={closeEvaluation}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-600 flex items-center justify-center transition-colors shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Property Snapshot */}
          <div className="flex items-center justify-between gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            {image && (
              <img
                src={image}
                alt={title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 bg-white"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                {title}
              </h4>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{location}</span>
              </div>
              <div className="text-xs font-bold text-blue-700 mt-1">
                {price} • {area}m² • {bedrooms} PN
              </div>
            </div>

            <button
              onClick={handleOpenDetail}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-colors shrink-0"
              title="Xem chi tiết BĐS"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Match Score Display Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-between shadow-md">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                Chỉ số phù hợp (Match Score)
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                {evaluation.matchScore >= 80 ? 'Rất phù hợp với bạn' : 'Phù hợp mức trung bình'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Ngân sách dự kiến ~{customerRequirement.budget} tỷ • {customerRequirement.bedrooms} PN • {customerRequirement.purpose === 'SELF_USE' ? 'Mua để ở' : 'Đầu tư'}
              </p>
            </div>

            <div className="text-center shrink-0 ml-3">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center border-2 ${
                evaluation.matchScore >= 85 ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 'border-blue-400 bg-blue-500/20 text-blue-300'
              }`}>
                <span className="text-2xl sm:text-3xl font-black">{evaluation.matchScore}%</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">Tương thích</span>
              </div>
            </div>
          </div>

          {/* Pros (Điểm phù hợp) */}
          <div className="space-y-2.5">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Điểm phù hợp</span>
            </h4>
            <div className="space-y-1.5">
              {evaluation.pros.map((pro, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/60 border border-emerald-100 p-2.5 rounded-xl font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cons (Điểm cần cân nhắc) */}
          {evaluation.cons.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Điểm cần cân nhắc</span>
              </h4>
              <div className="space-y-1.5">
                {evaluation.cons.map((con, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-amber-50/60 border border-amber-100 p-2.5 rounded-xl font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Summary / Review */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-900">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Nhận xét tổng quan của AI</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {evaluation.summary}
            </p>
          </div>

          {/* Customer Requirement Adjuster Accordion */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowRequirementEditor(!showRequirementEditor)}
              className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Tùy chỉnh tiêu chí đánh giá của bạn</span>
              </div>
              <span className="text-[11px] text-blue-600">{showRequirementEditor ? 'Thu gọn' : 'Chỉnh sửa'}</span>
            </button>

            {showRequirementEditor && (
              <div className="p-4 bg-white space-y-3.5 border-t border-slate-200 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Ngân sách dự kiến: {customerRequirement.budget} tỷ VND</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="0.5"
                    value={customerRequirement.budget}
                    onChange={e => setCustomerRequirement(prev => ({ ...prev, budget: parseFloat(e.target.value) }))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số phòng ngủ</label>
                    <select
                      value={customerRequirement.bedrooms}
                      onChange={e => setCustomerRequirement(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                      className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold"
                    >
                      <option value={1}>1 Phòng ngủ</option>
                      <option value={2}>2 Phòng ngủ</option>
                      <option value={3}>3 Phòng ngủ</option>
                      <option value={4}>4+ Phòng ngủ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mục đích chính</label>
                    <select
                      value={customerRequirement.purpose}
                      onChange={e => setCustomerRequirement(prev => ({ ...prev, purpose: e.target.value as any }))}
                      className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold"
                    >
                      <option value="SELF_USE">Mua để ở</option>
                      <option value="INVESTMENT">Đầu tư tích sản</option>
                      <option value="RENTAL">Đầu tư cho thuê</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={closeEvaluation}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleContactSale}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Liên hệ tư vấn {isPrimaryUnit ? 'căn này' : 'BĐS này'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};


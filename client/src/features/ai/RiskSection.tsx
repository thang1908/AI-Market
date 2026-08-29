import React from 'react';
import { ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';
import { mockRiskItems } from '../../data/mockNews';
import { useAppState } from '../../state/useAppState';

export const RiskSection: React.FC = () => {
  const { openChatTab } = useAppState();

  const handleAskAIRisk = (title: string) => {
    openChatTab(`Tư vấn cho tôi về vấn đề: "${title}"`);
  };

  return (
    <section id="ai-risk-knowledge-section" className="py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Thông tin cần lưu ý
            </h2>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              Kiến thức BĐS
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Những lưu ý pháp lý và tài chính quan trọng giúp bảo vệ tài sản của bạn
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockRiskItems.map((item, idx) => (
          <div
            key={idx}
            id={`risk-card-${idx}`}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="font-extrabold text-base text-slate-900 leading-snug mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {item.summary}
              </p>
            </div>

            <div className="pt-3.5 border-t border-slate-100">
              <div className="flex items-start gap-2 text-xs text-slate-700 font-medium mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item.recommendedAction}</span>
              </div>

              <button
                onClick={() => handleAskAIRisk(item.title)}
                className="w-full py-2.5 bg-blue-50/70 hover:bg-blue-600 hover:text-white border border-blue-100 hover:border-blue-600 rounded-xl text-xs font-bold text-blue-600 flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                <span>Hỏi AI chi tiết về chủ đề này</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

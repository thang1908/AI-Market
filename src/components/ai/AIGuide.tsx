import React from 'react';
import { X, Sparkles, Wallet, Target, Users, MapPin, Clock, Lightbulb, ArrowRight } from 'lucide-react';
import { useAppState } from '../../state/useAppState';

export const AIGuide: React.FC = () => {
  const { isGuideOpen, setIsGuideOpen, openChatTab } = useAppState();

  if (!isGuideOpen) return null;

  const handleUsePrompt = (promptText: string) => {
    setIsGuideOpen(false);
    openChatTab(promptText);
  };

  const sections = [
    {
      title: 'Tài chính',
      icon: <Wallet className="w-4 h-4 text-blue-600" />,
      examples: [
        'Tôi có khoảng 3 tỷ vốn tự có.',
        'Tôi có thể vay thêm 2 tỷ.'
      ]
    },
    {
      title: 'Mục đích',
      icon: <Target className="w-4 h-4 text-emerald-600" />,
      examples: [
        'Tôi muốn mua để ở.',
        'Tôi muốn đầu tư cho thuê.'
      ]
    },
    {
      title: 'Nhu cầu',
      icon: <Users className="w-4 h-4 text-purple-600" />,
      examples: [
        'Gia đình tôi có 4 người.',
        'Tôi cần căn 3PN.'
      ]
    },
    {
      title: 'Vị trí',
      icon: <MapPin className="w-4 h-4 text-rose-600" />,
      examples: [
        'Tôi ưu tiên Tây Hồ.',
        'Tôi muốn đi làm tới Cầu Giấy dưới 30 phút.'
      ]
    },
    {
      title: 'Thời gian',
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      examples: [
        'Tôi muốn mua trong 3 tháng tới.'
      ]
    }
  ];

  return (
    <div 
      id="ai-guide-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-200"
    >
      <div 
        id="ai-guide-container"
        className="w-full h-full md:h-auto md:max-h-[90vh] md:w-[700px] bg-white md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
      >
        
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-extrabold text-slate-900 leading-snug tracking-tight">
                Cách trò chuyện với AI Bất Động Sản
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Bạn không cần điền form. Chỉ cần mô tả tự nhiên điều bạn đang cần.
              </p>
            </div>
          </div>

          <button
            id="close-guide-btn"
            onClick={() => setIsGuideOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-4 flex-1">
          
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-950 leading-relaxed">
              <strong>Mẹo nhỏ:</strong> Bạn có thể kết hợp nhiều yếu tố trong một câu hỏi, hoặc chỉ cần nói ra điều quan trọng nhất trước. Trợ lý AI sẽ tự động phân tích và đưa ra gợi ý phù hợp.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {sections.map((section, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 hover:border-blue-300 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    {section.icon}
                  </div>
                  <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-700">
                    {section.title}
                  </h4>
                </div>

                <div className="space-y-1.5">
                  {section.examples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => handleUsePrompt(ex)}
                      className="w-full text-left p-2 rounded-xl text-xs bg-slate-50/80 hover:bg-blue-50 hover:text-blue-600 text-slate-700 flex items-center justify-between group transition-colors"
                    >
                      <span className="truncate italic">“{ex}”</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 md:p-5 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-400 text-center sm:text-left">
            Bạn không cần cung cấp tất cả ngay từ đầu. AI sẽ hỏi thêm khi cần.
          </span>
          <button
            onClick={() => {
              setIsGuideOpen(false);
              openChatTab();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Bắt đầu trò chuyện</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

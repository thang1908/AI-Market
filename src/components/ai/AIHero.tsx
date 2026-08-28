import React, { useState } from 'react';
import { Sparkles, ArrowUp, HelpCircle, ArrowRight, MessageSquare, RotateCcw, Clock } from 'lucide-react';
import { useAppState } from '../../state/useAppState';

export const AIHero: React.FC = () => {
  const { 
    openChatTab, 
    setIsGuideOpen, 
    mostRecentConversation, 
    selectConversation 
  } = useAppState();
  const [heroInput, setHeroInput] = useState('');

  const quickPrompts = [
    'Tôi có 5 tỷ',
    'Mua để ở',
    'Mua để đầu tư',
    'Tìm căn 2PN'
  ];

  const handleOpenChatWithPrompt = (promptText?: string) => {
    const textToSend = promptText !== undefined ? promptText : heroInput;
    openChatTab(textToSend);
    setHeroInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleOpenChatWithPrompt();
    }
  };

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Vừa xong';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMins < 2) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return 'Hôm qua';
    return `${diffDays} ngày trước`;
  };

  const handleResumeRecentChat = () => {
    if (mostRecentConversation) {
      selectConversation(mostRecentConversation.id);
      openChatTab();
    }
  };

  return (
    <section id="ai-hero-section" className="py-10 md:py-16 flex flex-col items-center text-center">
      
      {/* Decorative Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-5">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Trợ lý AI Tìm Kiếm & Định Giá Bất Động Sản</span>
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl leading-[1.15]">
        Tìm bất động sản phù hợp với bạn
      </h1>
      
      <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-xl mt-4 mb-8 leading-relaxed font-normal">
        Hỏi AI về nhu cầu mua, tài chính, khu vực, dự án hoặc đầu tư.
      </p>

      {/* Large AI Prompt Bar */}
      <div className="w-full max-w-2xl">
        <div 
          id="ai-hero-prompt-bar"
          className="relative flex items-center bg-white border border-slate-200 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/60 rounded-[28px] p-2 pl-4 shadow-xl shadow-slate-200/50 transition-all"
        >
          <div className="text-blue-600 pl-2">
            <Sparkles className="w-5 h-5" />
          </div>

          <input
            id="hero-prompt-input"
            type="text"
            value={heroInput}
            onChange={(e) => setHeroInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ví dụ: Tôi có 5 tỷ, muốn tìm căn 2PN ở Tây Hồ để ở"
            className="flex-1 px-3 py-3 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 bg-transparent outline-none"
          />

          <button
            id="hero-prompt-submit-btn"
            onClick={() => handleOpenChatWithPrompt()}
            className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center transition-all shadow-md shadow-blue-500/25 shrink-0"
            title="Gửi cho AI"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts & Guide Link */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
          
          {/* Quick prompt pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Gợi ý:</span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                id={`quick-prompt-${idx}`}
                onClick={() => handleOpenChatWithPrompt(prompt)}
                className="px-3.5 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 rounded-full text-xs font-semibold border border-slate-200 shadow-2xs transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Guide link */}
          <button
            id="ai-guide-link-btn"
            onClick={() => setIsGuideOpen(true)}
            className="text-xs text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1.5 transition-colors shrink-0 underline underline-offset-4 decoration-slate-300 hover:decoration-blue-500"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>? Cách hỏi AI hiệu quả</span>
          </button>

        </div>

        {/* ========================================================================= */}
        {/* Section 9: "Tiếp tục cuộc trò chuyện" (Chỉ hiển thị 1 conversation gần nhất) */}
        {/* ========================================================================= */}
        {mostRecentConversation && (
          <div 
            id="ai-hero-recent-conversation"
            className="mt-6 p-3 sm:p-3.5 bg-slate-100/80 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-200 rounded-2xl flex items-center justify-between gap-3 transition-all text-left shadow-2xs group cursor-pointer"
            onClick={handleResumeRecentChat}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white text-blue-600 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>Tiếp tục cuộc trò chuyện</span>
                  <span>•</span>
                  <span>{formatRelativeTime(mostRecentConversation.updatedAt)}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-900 truncate">
                  "{mostRecentConversation.title}"
                </div>
              </div>
            </div>

            <button
              id="ai-hero-resume-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleResumeRecentChat();
              }}
              className="shrink-0 px-3 py-1.5 bg-white group-hover:bg-blue-600 text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-blue-600 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
            >
              <span>Mở lại</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

    </section>
  );
};

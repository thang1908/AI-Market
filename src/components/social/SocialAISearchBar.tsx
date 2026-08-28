import React, { useState } from 'react';
import { Search, Sparkles, X, ArrowRight } from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { mockSampleSearchQueries } from '../../data/mockSocialData';

export const SocialAISearchBar: React.FC = () => {
  const { 
    socialSearchQuery, 
    handleSocialSearch, 
    clearSocialSearch,
    isSocialSearching 
  } = useAppState();

  const [inputVal, setInputVal] = useState(socialSearchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      handleSocialSearch(inputVal.trim());
    }
  };

  const handleQuickPrompt = (query: string) => {
    setInputVal(query);
    handleSocialSearch(query);
  };

  const handleClear = () => {
    setInputVal('');
    clearSocialSearch();
  };

  return (
    <div id="social-ai-search-container" className="bg-white rounded-2xl border border-slate-200/80 p-4 md:p-5 shadow-xs mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-3 bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 border border-slate-200 rounded-xl px-3.5 py-2.5 transition-all">
          <div className="p-1 rounded-lg bg-blue-600/10 text-blue-600 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          
          <input
            id="social-ai-search-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Hỏi AI bất kỳ điều gì: 'Thông tin mới nhất Lumi Hanoi', 'Căn 2PN dưới 6 tỷ'..."
            className="w-full bg-transparent text-sm md:text-base text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
          />

          {inputVal && (
            <button
              type="button"
              id="social-search-clear-btn"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            id="social-search-submit-btn"
            disabled={isSocialSearching || !inputVal.trim()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shrink-0 shadow-xs transition-all active:scale-95"
          >
            {isSocialSearching ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tìm kiếm AI</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested quick prompt chips */}
      {!socialSearchQuery && (
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Gợi ý:
          </span>
          {mockSampleSearchQueries.map((query, idx) => (
            <button
              key={idx}
              type="button"
              id={`social-quick-prompt-${idx}`}
              onClick={() => handleQuickPrompt(query)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100/80 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg whitespace-nowrap transition-colors border border-transparent hover:border-blue-200"
            >
              <span>{query}</span>
              <ArrowRight className="w-2.5 h-2.5 opacity-50" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

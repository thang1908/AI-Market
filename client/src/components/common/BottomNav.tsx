import React from 'react';
import { Sparkles, Store, Bookmark, MessageSquarePlus, Users } from 'lucide-react';
import { useAppState } from '../../state/useAppState';

export const BottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    openChatTab,
    isChatTabActive,
    savedListingIds, 
    setIsSavedModalOpen 
  } = useAppState();

  if (isChatTabActive) return null;

  const handleOpenChat = () => {
    openChatTab();
  };

  return (
    <div id="mobile-bottom-navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around shadow-lg">
      
      {/* AI Tab */}
      <button
        id="bottom-nav-ai"
        onClick={() => {
          setActiveTab('ai');
        }}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
          activeTab === 'ai'
            ? 'text-blue-600 font-bold'
            : 'text-slate-500 font-medium hover:text-slate-900'
        }`}
      >
        <div className={`p-1 rounded-xl ${activeTab === 'ai' ? 'bg-blue-50 text-blue-600' : ''}`}>
          <Sparkles className="w-5 h-5" />
        </div>
        <span className="text-[10px] uppercase tracking-wider">AI</span>
      </button>

      {/* Market Tab */}
      <button
        id="bottom-nav-market"
        onClick={() => {
          setActiveTab('market');
        }}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
          activeTab === 'market'
            ? 'text-blue-600 font-bold'
            : 'text-slate-500 font-medium hover:text-slate-900'
        }`}
      >
        <div className={`p-1 rounded-xl ${activeTab === 'market' ? 'bg-blue-50 text-blue-600' : ''}`}>
          <Store className="w-5 h-5" />
        </div>
        <span className="text-[10px] uppercase tracking-wider">Market</span>
      </button>

      {/* Quick AI Chat Action Button */}
      <button
        id="bottom-nav-quick-chat"
        onClick={handleOpenChat}
        className="flex flex-col items-center justify-center -mt-5 bg-blue-600 hover:bg-blue-700 text-white w-11 h-11 rounded-full shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
        title="Mở Trợ lý AI"
      >
        <MessageSquarePlus className="w-5 h-5" />
      </button>

      {/* Social Tab */}
      <button
        id="bottom-nav-social"
        onClick={() => {
          setActiveTab('social');
        }}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
          activeTab === 'social'
            ? 'text-blue-600 font-bold'
            : 'text-slate-500 font-medium hover:text-slate-900'
        }`}
      >
        <div className={`p-1 rounded-xl ${activeTab === 'social' ? 'bg-blue-50 text-blue-600' : ''}`}>
          <Users className="w-5 h-5" />
        </div>
        <span className="text-[10px] uppercase tracking-wider">Cộng đồng</span>
      </button>

      {/* Saved Modal Button */}
      <button
        id="bottom-nav-saved"
        onClick={() => setIsSavedModalOpen(true)}
        className="relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl text-slate-500 font-medium hover:text-slate-900 transition-all"
      >
        <div className="p-1">
          <Bookmark className="w-5 h-5" />
          {savedListingIds.length > 0 && (
            <span className="absolute top-1 right-1.5 w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
              {savedListingIds.length}
            </span>
          )}
        </div>
        <span className="text-[10px] uppercase tracking-wider">Đã lưu</span>
      </button>

    </div>
  );
};

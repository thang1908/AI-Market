import React, { useRef, useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  RotateCcw, 
  Code2, 
  X, 
  Plus, 
  ArrowUp, 
  HelpCircle, 
  ArrowRight,
  Building,
  TrendingUp,
  Menu,
  PanelLeftClose,
  PanelLeft,
  MessageSquare
} from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { ChatHistorySidebar } from './ChatHistorySidebar';

export const AIChatTab: React.FC = () => {
  const {
    closeChatTab,
    activeConversation,
    activeConversationId,
    sendChatMessage,
    resetChat,
    currentPropertyContext,
    clearPropertyContext,
    setIsGuideOpen,
    openMarketWithFilter
  } = useAppState();

  const [inputText, setInputText] = useState('');
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = activeConversation?.messages || [];

  // Auto scroll to bottom when new messages arrive or active conversation changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversationId]);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleQuickSuggestion = (text: string) => {
    sendChatMessage(text);
  };

  return (
    <div 
      id="temporary-ai-chat-tab" 
      className="flex h-[calc(100vh-4rem)] bg-white text-slate-900 overflow-hidden select-text animate-in fade-in duration-150 relative"
    >
      {/* ========================================================================= */}
      {/* 1. DESKTOP LEFT SIDEBAR (Collapsible, 280-320px) */}
      {/* ========================================================================= */}
      <div 
        className={`hidden md:block transition-all duration-200 ease-in-out shrink-0 overflow-hidden ${
          isSidebarOpen ? 'w-72 lg:w-80' : 'w-0'
        }`}
      >
        <ChatHistorySidebar />
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE HISTORY DRAWER (Slide-in from Left) */}
      {/* ========================================================================= */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-[85%] max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Top Bar */}
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold tracking-tight">Lịch sử trò chuyện</span>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
                title="Đóng lịch sử"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar View */}
            <div className="flex-1 overflow-hidden">
              <ChatHistorySidebar 
                isMobileDrawer={true} 
                onSelectConversation={() => setIsMobileDrawerOpen(false)} 
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN CHAT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white overflow-hidden">
        
        {/* Chat Header */}
        <header 
          id="chat-tab-header"
          className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shrink-0"
        >
          {/* Left: Mobile Drawer Trigger [☰] / Desktop Sidebar Toggle + Back Button + Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            
            {/* Mobile History Drawer Button [☰] */}
            <button
              id="chat-mobile-menu-btn"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden w-8 h-8 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
              title="Mở lịch sử trò chuyện"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar Toggle Button */}
            <button
              id="chat-desktop-toggle-sidebar-btn"
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="hidden md:flex w-8 h-8 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 items-center justify-center transition-colors"
              title={isSidebarOpen ? 'Thu gọn thanh lịch sử' : 'Mở thanh lịch sử'}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>

            {/* Back Button [←] (Returns to AI Home) */}
            <button
              id="chat-tab-back-btn"
              onClick={closeChatTab}
              className="w-8 h-8 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
              title="Quay về AI Home"
              aria-label="Quay về AI Home"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Title & Subtext */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0 truncate">
                <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight tracking-tight truncate">
                  {activeConversation?.title || 'AI Bất Động Sản'}
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                  Trợ lý AI Tìm Kiếm & Định Giá
                </p>
              </div>
            </div>
          </div>

          {/* Right: [Cuộc trò chuyện mới] [Debug] [Đóng] */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Guide Quick Button */}
            <button
              id="chat-tab-guide-btn"
              onClick={() => setIsGuideOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Xem hướng dẫn cách hỏi AI"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Cách hỏi</span>
            </button>

            {/* Cuộc trò chuyện mới */}
            <button
              id="chat-tab-new-chat-btn"
              onClick={resetChat}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-xl transition-colors shadow-2xs"
              title="Bắt đầu cuộc trò chuyện mới"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mới</span>
            </button>

            {/* Debug */}
            <button
              id="chat-tab-debug-btn"
              onClick={() => setShowDebugModal(true)}
              className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Xem trạng thái kỹ thuật (Debug)"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Debug</span>
            </button>

            {/* Đóng (Quay lại AI Home) */}
            <button
              id="chat-tab-close-btn"
              onClick={closeChatTab}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Đóng chat và quay lại AI Home"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Đóng</span>
            </button>
          </div>
        </header>

        {/* 2. Conversation Area (ChatGPT Style, Centered, Generous Whitespace) */}
        <div 
          id="chat-tab-conversation-area"
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 md:py-8 bg-slate-50/40"
        >
          <div className="max-w-3xl lg:max-w-4xl mx-auto space-y-6 md:space-y-8">
            
            {/* Welcome Hint Bar if only initial message */}
            {messages.length <= 1 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-100 text-xs text-blue-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-700">
                  <Sparkles className="w-4 h-4" />
                  <span>Trợ lý sẵn sàng phân tích dữ liệu thị trường theo nhu cầu cụ thể của bạn:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleQuickSuggestion('Tôi có 5 tỷ, nên mua ở Nam Từ Liêm hay Cầu Giấy?')}
                    className="text-left p-2.5 bg-white/90 hover:bg-white border border-blue-200/60 rounded-xl text-slate-700 font-medium hover:text-blue-600 transition-colors shadow-2xs"
                  >
                    💡 “Tôi có 5 tỷ, nên mua ở Nam Từ Liêm hay Cầu Giấy?”
                  </button>
                  <button
                    onClick={() => handleQuickSuggestion('Cần tìm căn hộ 2PN view hồ, ngân sách 7 tỷ')}
                    className="text-left p-2.5 bg-white/90 hover:bg-white border border-blue-200/60 rounded-xl text-slate-700 font-medium hover:text-blue-600 transition-colors shadow-2xs"
                  >
                    💡 “Cần tìm căn hộ 2PN view hồ, ngân sách 7 tỷ”
                  </button>
                </div>
              </div>
            )}

            {/* Messages Loop */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                id={`chat-message-${msg.id}`}
                className={`flex gap-3.5 sm:gap-4 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* AI Avatar */}
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                )}

                {/* Message Box */}
                <div className={`space-y-2.5 ${msg.role === 'user' ? 'max-w-[85%] sm:max-w-[75%]' : 'flex-1 max-w-full'}`}>
                  
                  {/* Property context preview badge if present in message */}
                  {msg.propertyContext && (
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5 shadow-2xs">
                      <Building className="w-3.5 h-3.5 text-blue-600" />
                      <span>{msg.propertyContext.title} ({msg.propertyContext.price} • {msg.propertyContext.area}m²)</span>
                    </div>
                  )}

                  {/* Message Content */}
                  <div
                    className={`text-sm sm:text-[15px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white p-4 sm:p-4.5 rounded-2xl rounded-tr-xs shadow-xs font-medium'
                        : 'bg-white p-4.5 sm:p-5 rounded-2xl border border-slate-200/90 text-slate-800 shadow-2xs font-normal space-y-3'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                  </div>

                  {/* AI Interactive Shortcut Suggestion to Market */}
                  {msg.role === 'assistant' && !msg.id.includes('welcome') && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => openMarketWithFilter({ searchQuery: '2PN' })}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-blue-50 border border-slate-200/90 hover:border-blue-300 rounded-full text-xs font-bold text-blue-600 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Building className="w-3.5 h-3.5" />
                        <span>Xem BĐS liên quan trên Market</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleQuickSuggestion('So sánh giá bán khu vực này với các quận lân cận')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-full text-xs font-semibold text-slate-600 transition-colors shadow-2xs cursor-pointer"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                        <span>So sánh giá khu vực</span>
                      </button>
                    </div>
                  )}

                  <div className={`text-[10px] text-slate-400 font-medium ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* User Avatar */}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    Bạn
                  </div>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 3. Fixed / Sticky Composer (ChatGPT Style, Centered 850px on desktop) */}
        <footer 
          id="chat-tab-composer-section"
          className="sticky bottom-0 z-20 bg-white border-t border-slate-200/80 px-4 sm:px-6 pt-3 pb-4 shrink-0 shadow-lg shadow-slate-200/20"
        >
          <div className="max-w-3xl lg:max-w-4xl mx-auto">
            
            {/* Property Context on top of composer if active in conversation */}
            {currentPropertyContext && (
              <div 
                id="composer-property-context-card"
                className="mb-2.5 bg-blue-50/90 border border-blue-200/90 rounded-2xl p-3 flex items-center justify-between text-xs text-slate-800 shadow-2xs animate-in fade-in duration-150"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                      Đang hỏi về
                    </div>
                    <div className="font-extrabold text-slate-900 truncate text-sm">
                      {currentPropertyContext.title}
                    </div>
                    <div className="text-slate-600 font-semibold mt-0.5">
                      {currentPropertyContext.price} • {currentPropertyContext.area}m² • {currentPropertyContext.district}
                    </div>
                  </div>
                </div>

                <button
                  id="composer-clear-context-btn"
                  onClick={clearPropertyContext}
                  className="w-7 h-7 rounded-xl hover:bg-blue-200/70 text-slate-500 hover:text-slate-900 flex items-center justify-center shrink-0 ml-2 transition-colors cursor-pointer"
                  title="Bỏ ngữ cảnh bất động sản này"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Composer Input Bar: [+] [Nhập câu hỏi hoặc nhu cầu của bạn...] [↑] */}
            <div 
              id="chat-composer-bar"
              className="relative flex items-center gap-2 bg-slate-100/90 border border-slate-200/80 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/60 focus-within:bg-white rounded-2xl p-1.5 transition-all shadow-xs"
            >
              {/* [+] Button */}
              <button
                type="button"
                id="composer-plus-btn"
                onClick={() => setIsGuideOpen(true)}
                className="w-9 h-9 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 flex items-center justify-center shrink-0 transition-colors ml-0.5"
                title="Gợi ý mẫu câu hỏi & nhu cầu"
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Textarea Input */}
              <textarea
                ref={textareaRef}
                id="composer-textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi hoặc nhu cầu của bạn..."
                rows={1}
                className="flex-1 bg-transparent py-2 px-1 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 resize-none outline-none max-h-36 min-h-[2.5rem]"
              />

              {/* [↑] Send Button */}
              <button
                id="composer-send-btn"
                type="button"
                onClick={handleSend}
                disabled={!inputText.trim()}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  inputText.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                title="Gửi câu hỏi"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Disclaimer */}
            <div className="mt-2 text-center">
              <span className="text-[11px] text-slate-400 font-medium">
                AI có thể trả lời sai. Hãy kiểm tra thông tin quan trọng.
              </span>
            </div>

          </div>
        </footer>
      </div>

      {/* Debug Modal */}
      {showDebugModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600" />
                <h4 className="font-extrabold text-slate-900 text-sm">Trạng thái Debug AI Chat</h4>
              </div>
              <button 
                onClick={() => setShowDebugModal(false)}
                className="w-7 h-7 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-mono bg-slate-50 border border-slate-200/70 p-4 rounded-2xl space-y-2 text-slate-700">
              <div><strong>active_conv_id:</strong> {activeConversationId}</div>
              <div><strong>conv_title:</strong> {activeConversation?.title}</div>
              <div><strong>messages_total:</strong> {messages.length}</div>
              <div><strong>property_context:</strong> {currentPropertyContext ? currentPropertyContext.title : "null"}</div>
              <div><strong>storage:</strong> "localStorage_cached"</div>
              <div><strong>sidebar_state:</strong> {isSidebarOpen ? "expanded" : "collapsed"}</div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowDebugModal(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Đóng Debug
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

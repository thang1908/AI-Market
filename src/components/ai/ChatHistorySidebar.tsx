import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { Conversation } from '../../types';

interface ChatHistorySidebarProps {
  onSelectConversation?: () => void;
  isMobileDrawer?: boolean;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ 
  onSelectConversation,
  isMobileDrawer = false 
}) => {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    createNewConversation,
    renameConversation,
    deleteConversation
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [activeMenuConvId, setActiveMenuConvId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase().trim();
    return conversations.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.messages.some(m => m.content.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  // Group conversations by time category: Hôm nay, Hôm qua, 7 ngày trước, Cũ hơn
  const groupedConversations = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
    const startOf7DaysAgo = startOfToday - 7 * 24 * 60 * 60 * 1000;

    const groups: {
      today: Conversation[];
      yesterday: Conversation[];
      last7Days: Conversation[];
      older: Conversation[];
    } = {
      today: [],
      yesterday: [],
      last7Days: [],
      older: []
    };

    // Sort by updatedAt descending
    const sorted = [...filteredConversations].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    sorted.forEach(conv => {
      const convTime = new Date(conv.updatedAt).getTime();
      if (convTime >= startOfToday) {
        groups.today.push(conv);
      } else if (convTime >= startOfYesterday) {
        groups.yesterday.push(conv);
      } else if (convTime >= startOf7DaysAgo) {
        groups.last7Days.push(conv);
      } else {
        groups.older.push(conv);
      }
    });

    return [
      { key: 'today', title: 'Hôm nay', items: groups.today },
      { key: 'yesterday', title: 'Hôm qua', items: groups.yesterday },
      { key: 'last7Days', title: '7 ngày trước', items: groups.last7Days },
      { key: 'older', title: 'Cũ hơn', items: groups.older }
    ].filter(g => g.items.length > 0);
  }, [filteredConversations]);

  const handleStartNewChat = () => {
    createNewConversation();
    if (onSelectConversation) {
      onSelectConversation();
    }
  };

  const handleSelect = (id: string) => {
    selectConversation(id);
    setActiveMenuConvId(null);
    if (onSelectConversation) {
      onSelectConversation();
    }
  };

  const startRename = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation();
    setEditingConvId(conv.id);
    setEditingTitle(conv.title);
    setActiveMenuConvId(null);
  };

  const submitRename = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingConvId && editingTitle.trim()) {
      renameConversation(editingConvId, editingTitle.trim());
    }
    setEditingConvId(null);
  };

  const cancelRename = () => {
    setEditingConvId(null);
  };

  const promptDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
    setActiveMenuConvId(null);
  };

  const executeDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteConversation(id);
    setConfirmDeleteId(null);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  return (
    <div 
      id="chat-history-sidebar" 
      className={`flex flex-col h-full bg-slate-50/80 border-r border-slate-200/80 select-none ${
        isMobileDrawer ? 'w-full' : 'w-72 xl:w-80'
      }`}
    >
      {/* 1. Header: [ + Cuộc trò chuyện mới ] */}
      <div className="p-3.5 space-y-3 border-b border-slate-200/60 shrink-0 bg-white/70">
        <button
          id="sidebar-new-chat-btn"
          onClick={handleStartNewChat}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Cuộc trò chuyện mới</span>
        </button>

        {/* Search Bar: "Tìm cuộc trò chuyện..." */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            id="sidebar-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm cuộc trò chuyện..."
            className="w-full pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200/80 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Grouped History List */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {groupedConversations.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">
              {searchQuery ? 'Không tìm thấy cuộc trò chuyện phù hợp' : 'Chưa có lịch sử trò chuyện'}
            </p>
          </div>
        ) : (
          groupedConversations.map(group => (
            <div key={group.key} className="space-y-1">
              {/* Group Title */}
              <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </div>

              {/* Items in this group */}
              <div className="space-y-0.5">
                {group.items.map(conv => {
                  const isActive = conv.id === activeConversationId;
                  const isEditing = editingConvId === conv.id;
                  const isConfirmingDelete = confirmDeleteId === conv.id;
                  const isMenuOpen = activeMenuConvId === conv.id;

                  if (isEditing) {
                    return (
                      <form
                        key={conv.id}
                        onSubmit={submitRename}
                        className="px-2 py-1.5 bg-white border border-blue-400 rounded-xl shadow-xs flex items-center gap-1.5"
                      >
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          autoFocus
                          className="flex-1 text-xs text-slate-900 bg-transparent outline-none px-1 py-0.5 font-medium"
                        />
                        <button
                          type="submit"
                          className="w-5 h-5 text-emerald-600 hover:bg-emerald-50 rounded flex items-center justify-center transition-colors"
                          title="Lưu"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelRename}
                          className="w-5 h-5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded flex items-center justify-center transition-colors"
                          title="Hủy"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    );
                  }

                  if (isConfirmingDelete) {
                    return (
                      <div
                        key={conv.id}
                        className="p-2 bg-red-50/90 border border-red-200 rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-100"
                      >
                        <span className="text-red-800 text-[11px] font-semibold truncate pr-1">
                          Xóa cuộc trò chuyện?
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => executeDelete(e, conv.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded-lg transition-colors"
                          >
                            Xóa
                          </button>
                          <button
                            onClick={cancelDelete}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 font-semibold text-[10px] rounded-lg border border-slate-200 transition-colors"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={conv.id}
                      id={`conv-item-${conv.id}`}
                      onClick={() => handleSelect(conv.id)}
                      className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                        isActive
                          ? 'bg-white text-blue-900 font-semibold border border-blue-200/90 shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      {/* Left: Icon + Title */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                        {conv.propertyContext ? (
                          <Building2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} />
                        ) : (
                          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        )}
                        <span className="truncate leading-relaxed">
                          {conv.title}
                        </span>
                      </div>

                      {/* Right: [...] Action Button */}
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          id={`conv-menu-btn-${conv.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuConvId(isMenuOpen ? null : conv.id);
                          }}
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-opacity ${
                            isActive || isMenuOpen
                              ? 'opacity-100 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                              : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200/80'
                          }`}
                          title="Tùy chọn cuộc trò chuyện"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>

                        {/* Action Popover Menu */}
                        {isMenuOpen && (
                          <div 
                            className="absolute right-0 top-7 z-30 w-32 bg-white rounded-xl shadow-lg border border-slate-200/90 py-1 text-xs animate-in fade-in zoom-in-95 duration-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              id={`conv-rename-btn-${conv.id}`}
                              onClick={(e) => startRename(e, conv)}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 hover:text-blue-600 font-medium"
                            >
                              <Pencil className="w-3 h-3 text-slate-400" />
                              <span>Đổi tên</span>
                            </button>
                            <button
                              id={`conv-delete-btn-${conv.id}`}
                              onClick={(e) => promptDelete(e, conv.id)}
                              className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 3. Footer minimal stats */}
      <div className="p-3 border-t border-slate-200/60 bg-white/40 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-blue-500" />
          <span>{conversations.length} cuộc trò chuyện</span>
        </span>
        <span className="text-[10px] font-medium text-slate-400">Lưu cục bộ</span>
      </div>
    </div>
  );
};

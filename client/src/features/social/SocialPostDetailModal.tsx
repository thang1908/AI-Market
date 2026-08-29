import React from 'react';
import { X, MessageSquare, Sparkles } from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { SocialPostCard } from './SocialPostCard';

export const SocialPostDetailModal: React.FC = () => {
  const { activePostDetail, closePostDetail } = useAppState();

  if (!activePostDetail) return null;

  return (
    <div
      id="social-post-detail-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={closePostDetail}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200/80 my-auto animate-in fade-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Chi tiết bài viết
          </span>
          <button
            type="button"
            onClick={closePostDetail}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Card Embedded */}
        <div className="p-4 sm:p-5 max-h-[80vh] overflow-y-auto">
          <SocialPostCard post={activePostDetail} />
        </div>
      </div>
    </div>
  );
};

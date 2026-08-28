import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Heart, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { SocialPost } from '../../types';

export const SocialCommentsModal: React.FC = () => {
  const {
    isCommentsModalOpen,
    commentingPost,
    closeCommentsModal,
    addCommentToPost,
    toggleLikeComment,
    openSocialProfile,
    openAIWithSocialContext
  } = useAppState();

  const [commentText, setCommentText] = useState('');

  if (!isCommentsModalOpen || !commentingPost) return null;

  const comments = commentingPost.comments || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentToPost(commentingPost.id, commentText.trim());
    setCommentText('');
  };

  const handleAskAIToSummarizeDiscussion = () => {
    const commentsListText = comments.map(c => `- ${c.authorName}: "${c.content}"`).join('\n');
    openAIWithSocialContext(`Hãy tóm tắt các ý kiến và quan điểm của cộng đồng trong cuộc thảo luận này:\nBài viết: ${commentingPost.title || commentingPost.content}\n\nÝ kiến cư dân & chuyên gia:\n${commentsListText}\n\nĐánh giá xem quan điểm nào khách quan và có căn cứ nhất.`);
  };

  return (
    <div
      id="social-comments-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={closeCommentsModal}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200/80 my-auto animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Bình luận & Thảo luận ({comments.length})
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {comments.length > 1 && (
              <button
                type="button"
                onClick={handleAskAIToSummarizeDiscussion}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
                title="AI Tóm tắt thảo luận"
              >
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Tóm tắt AI</span>
              </button>
            )}
            <button
              type="button"
              onClick={closeCommentsModal}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Post Snippet */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-900">{commentingPost.author.name}</span>
            {commentingPost.author.isVerified && (
              <CheckCircle2 className="w-3 h-3 text-blue-500" />
            )}
            <span className="text-[10px] text-slate-400">• {commentingPost.createdAt}</span>
          </div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {commentingPost.content}
          </p>
        </div>

        {/* Comments List */}
        <div className="p-5 space-y-3.5 overflow-y-auto flex-1 bg-white divide-y divide-slate-50">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-300" />
              <p className="text-xs font-medium">Chưa có bình luận nào. Hãy là người đầu tiên thảo luận!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="pt-3 first:pt-0 flex items-start gap-3">
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-100 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-100">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900">{comment.authorName}</span>
                      <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>

                  {/* Comment interaction */}
                  <div className="flex items-center gap-3 px-2 pt-1 text-[11px] text-slate-400">
                    <button
                      type="button"
                      onClick={() => toggleLikeComment(commentingPost.id, comment.id)}
                      className={`inline-flex items-center gap-1 font-semibold transition-colors ${
                        comment.isLiked ? 'text-rose-600 font-bold' : 'hover:text-slate-600'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-rose-600' : ''}`} />
                      <span>{comment.likesCount > 0 ? comment.likesCount : 'Thích'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommentText(`@${comment.authorName} `)}
                      className="hover:text-slate-600 font-medium"
                    >
                      Trả lời
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input Footer */}
        <form onSubmit={handleSend} className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Viết bình luận hoặc đặt câu hỏi..."
            className="flex-1 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-all shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Facebook, 
  MessageCircle, 
  QrCode,
  Sparkles
} from 'lucide-react';
import { useAppState } from '../../state/useAppState';

export const SocialShareModal: React.FC = () => {
  const { isShareModalOpen, sharingPost, closeShareModal } = useAppState();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isShareModalOpen || !sharingPost) return null;

  const postUrl = `${window.location.origin}/#social-post-${sharingPost.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      id="social-share-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={closeShareModal}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200/80 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Chia sẻ bài viết</h2>
          </div>
          <button
            type="button"
            onClick={closeShareModal}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-5 space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-[11px] font-bold text-blue-600 block">{sharingPost.author.name}</span>
            <p className="text-xs font-semibold text-slate-800 line-clamp-2 mt-0.5">
              {sharingPost.title || sharingPost.content}
            </p>
          </div>

          {/* Social Channels */}
          <div>
            <span className="block text-xs font-semibold text-slate-500 mb-2">Gửi qua ứng dụng</span>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100 text-blue-700 transition-colors border border-blue-100"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  f
                </div>
                <span className="text-[11px] font-semibold">Facebook</span>
              </a>

              <a
                href={`https://zalo.me/share?url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100 text-blue-700 transition-colors border border-blue-100"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                  Zalo
                </div>
                <span className="text-[11px] font-semibold">Zalo</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-100/70 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold">Mã QR</span>
              </button>
            </div>
          </div>

          {/* Copy Link Input */}
          <div>
            <span className="block text-xs font-semibold text-slate-500 mb-1.5">Hoặc sao chép liên kết</span>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
              <input
                type="text"
                readOnly
                value={postUrl}
                className="w-full bg-transparent text-xs text-slate-600 px-2 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 transition-all ${
                  isCopied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

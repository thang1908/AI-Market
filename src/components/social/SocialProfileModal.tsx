import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Share2, 
  Users, 
  FileText,
  MessageCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { SocialPostCard } from './SocialPostCard';

export const SocialProfileModal: React.FC = () => {
  const {
    activeSocialProfile,
    closeSocialProfile,
    followedAuthorIds,
    toggleFollowAuthor,
    isAuthorFollowed,
    socialPosts,
    openAIWithSocialContext,
    openProjectFromSocial
  } = useAppState();

  if (!activeSocialProfile) return null;

  const author = activeSocialProfile;
  const isFollowed = isAuthorFollowed(author.id);
  const authorPosts = socialPosts.filter(p => p.authorId === author.id || p.author.id === author.id);

  const handleAskAIAboutProfile = () => {
    openAIWithSocialContext(`Hãy tổng hợp và đánh giá uy tín, các dự án trọng điểm và kinh nghiệm của tác giả/đơn vị "${author.name}" (${author.roleTitle}).`);
  };

  return (
    <div 
      id="social-profile-modal" 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={closeSocialProfile}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200/80 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover / Header banner */}
        <div className="h-28 bg-linear-to-r from-blue-600 via-indigo-600 to-slate-800 relative p-4 flex justify-end items-start">
          <button
            type="button"
            id="close-profile-modal-btn"
            onClick={closeSocialProfile}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Info Section */}
        <div className="px-5 pb-5 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div className="relative">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-white shadow-md bg-white"
              />
              {author.isVerified && (
                <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full ring-2 ring-white">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {author.role !== 'OFFICIAL_APP' && (
                <button
                  type="button"
                  id={`profile-follow-btn-${author.id}`}
                  onClick={() => toggleFollowAuthor(author.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    isFollowed
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {isFollowed ? 'Đang theo dõi' : '+ Theo dõi'}
                </button>
              )}

              {author.contactPhone && (
                <a
                  href={`tel:${author.contactPhone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{author.contactPhone}</span>
                </a>
              )}

              {author.contactZalo && (
                <a
                  href={`https://zalo.me/${author.contactZalo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold border border-blue-200 transition-colors"
                >
                  <span>Zalo</span>
                </a>
              )}

              <button
                type="button"
                onClick={handleAskAIAboutProfile}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors"
                title="Hỏi AI về chuyên gia này"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Hỏi AI</span>
              </button>
            </div>
          </div>

          {/* Name & Title */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{author.name}</h2>
              {author.badgeLabel && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {author.badgeLabel}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">{author.roleTitle}</p>
          </div>

          {/* Bio */}
          {author.bio && (
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
              {author.bio}
            </p>
          )}

          {/* Specialty tags */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            {author.specialtyAreas && author.specialtyAreas.length > 0 && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Khu vực:</span>
                <strong className="text-slate-800">{author.specialtyAreas.join(', ')}</strong>
              </div>
            )}
            {author.specialtyProjects && author.specialtyProjects.length > 0 && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Dự án trọng điểm:</span>
                <strong className="text-slate-800">{author.specialtyProjects.join(', ')}</strong>
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-center">
            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <span className="block text-sm sm:text-base font-bold text-slate-900">
                {author.followersCount?.toLocaleString('vi-VN') || 0}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Người theo dõi</span>
            </div>
            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <span className="block text-sm sm:text-base font-bold text-slate-900">
                {author.followingCount || 0}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Đang theo dõi</span>
            </div>
            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <span className="block text-sm sm:text-base font-bold text-slate-900">
                {authorPosts.length}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Bài viết</span>
            </div>
          </div>
        </div>

        {/* Author's Feed Section */}
        <div className="bg-slate-50 p-5 border-t border-slate-200/80 max-h-96 overflow-y-auto space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Bài viết của {author.name} ({authorPosts.length})</span>
          </h3>

          {authorPosts.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">Chưa có bài viết nào từ tác giả này.</p>
          ) : (
            authorPosts.map((post) => (
              <SocialPostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

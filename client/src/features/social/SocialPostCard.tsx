import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Home, 
  Play, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Phone,
  MessageCircle,
  MoreHorizontal
} from 'lucide-react';
import { SocialPost, SocialAuthor } from '../../types';
import { useAppState } from '../../state/useAppState';
import { mockListings } from '../../data/mockListings';
import { mockProjects } from '../../data/mockPrimaryProjects';

interface SocialPostCardProps {
  post: SocialPost;
}

export const SocialPostCard: React.FC<SocialPostCardProps> = ({ post }) => {
  const {
    likedPostIds,
    toggleLikePost,
    isPostLiked,
    savedPostIds,
    toggleSavePost,
    isPostSaved,
    followedAuthorIds,
    toggleFollowAuthor,
    isAuthorFollowed,
    openPostDetail,
    openSocialProfile,
    openShareModal,
    openCommentsModal,
    openProjectFromSocial,
    openListingFromSocial,
    openAIWithSocialContext,
    openContactSale
  } = useAppState();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isLiked = isPostLiked(post.id);
  const isSaved = isPostSaved(post.id);
  const isFollowed = isAuthorFollowed(post.author.id);

  // Match referenced properties and projects
  const linkedListings = post.listingIds 
    ? mockListings.filter(l => post.listingIds?.includes(l.id))
    : [];

  const linkedProjects = post.projectIds
    ? mockProjects.filter(p => post.projectIds?.includes(p.id))
    : [];

  const handleAskAIAboutPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prompt = `Hãy phân tích và đánh giá góc nhìn trong bài viết này:\n"${post.title || ''}"\nNội dung: ${post.content}\n\nCho tôi biết tính xác thực, tiềm năng đầu tư và các rủi ro cần chú ý.`;
    openAIWithSocialContext(prompt);
  };

  const getRoleBadgeStyle = (role: SocialAuthor['role']) => {
    switch (role) {
      case 'DEVELOPER':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'SALE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CREATOR':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'OFFICIAL_APP':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'AGENCY':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getPostTypeLabel = (type: SocialPost['postType']) => {
    switch (type) {
      case 'AI_NEWS_SUMMARY':
        return { label: 'AI Tóm tắt tin tức', color: 'bg-blue-600 text-white' };
      case 'DEVELOPER_OFFICIAL':
        return { label: 'Thông báo Chủ đầu tư', color: 'bg-amber-600 text-white' };
      case 'PROPERTY_POST':
        return { label: 'Bảng hàng BĐS', color: 'bg-emerald-600 text-white' };
      case 'MARKET_UPDATE':
        return { label: 'Radar Giá & Thị trường', color: 'bg-indigo-600 text-white' };
      case 'VIDEO':
        return { label: 'Video Review', color: 'bg-rose-600 text-white' };
      case 'ANALYSIS':
        return { label: 'Góc nhìn Chuyên gia', color: 'bg-violet-600 text-white' };
      case 'SALE_POST':
        return { label: 'Quỹ căn ngoại giao', color: 'bg-cyan-700 text-white' };
      case 'COMMUNITY':
      default:
        return { label: 'Thảo luận Cộng đồng', color: 'bg-slate-700 text-white' };
    }
  };

  const typeConfig = getPostTypeLabel(post.postType);

  return (
    <article
      id={`social-post-${post.id}`}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow duration-200 overflow-hidden"
    >
      {/* 1. Header: Author info, badge, follow button, post type */}
      <div className="p-4 md:p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => openSocialProfile(post.author)}
              className="relative shrink-0 group focus:outline-hidden"
            >
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-blue-400 transition-all"
              />
              {post.author.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-white" />
                </div>
              )}
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => openSocialProfile(post.author)}
                  className="text-xs md:text-sm font-bold text-slate-900 hover:text-blue-600 truncate transition-colors text-left"
                >
                  {post.author.name}
                </button>
                
                {post.author.badgeLabel && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(post.author.role)}`}>
                    {post.author.badgeLabel}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span>{post.createdAt}</span>
                {post.locationTags && post.locationTags.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-slate-500">{post.locationTags.join(', ')}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Follow & Post Type Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${typeConfig.color} shadow-2xs`}>
              {typeConfig.label}
            </span>

            {post.author.role !== 'OFFICIAL_APP' && post.author.id !== 'AUTH-CURRENT-USER' && (
              <button
                type="button"
                id={`follow-btn-${post.author.id}`}
                onClick={() => toggleFollowAuthor(post.author.id)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                  isFollowed
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200/60'
                }`}
              >
                {isFollowed ? 'Đã theo dõi' : '+ Theo dõi'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Content Body */}
      <div className="px-4 md:px-5 pb-3">
        {/* Post Title */}
        {post.title && (
          <h3 
            onClick={() => openPostDetail(post)}
            className="text-sm md:text-base font-bold text-slate-900 mb-2 leading-snug cursor-pointer hover:text-blue-600 transition-colors"
          >
            {post.title}
          </h3>
        )}

        {/* AI Summary Badge for AI News */}
        {post.aiSummaryBadge && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200/70 text-blue-700 text-[11px] font-semibold mb-2.5">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>{post.aiSummaryBadge}</span>
          </div>
        )}

        {/* Text Body with Expand / Collapse */}
        <p className={`text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line ${
          !isExpanded && post.content.length > 240 ? 'line-clamp-3' : ''
        }`}>
          {post.content}
        </p>

        {post.content.length > 240 && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1"
          >
            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        )}

        {/* AI News Sources */}
        {post.sources && post.sources.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-[11px] text-slate-400">
            <span className="font-medium text-slate-500">Nguồn trích xuất:</span>
            {post.sources.map((src, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                {src.name}
              </span>
            ))}
          </div>
        )}

        {/* Market Metrics Widget for MARKET_UPDATE */}
        {post.marketMetrics && post.marketMetrics.length > 0 && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            {post.marketMetrics.map((metric, idx) => (
              <div key={idx} className="bg-white p-2 rounded-lg border border-slate-100 text-center shadow-2xs">
                <span className="block text-[10px] text-slate-400 font-medium truncate">{metric.label}</span>
                <span className="block text-xs font-bold text-slate-800 mt-0.5">{metric.value}</span>
                {metric.change && (
                  <span className={`text-[10px] font-bold ${metric.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {metric.change}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Linked Media (Images or Video) */}
      {post.postType === 'VIDEO' && post.videoThumbnail && (
        <div 
          onClick={() => openPostDetail(post)}
          className="relative mx-4 md:mx-5 mb-3 rounded-xl overflow-hidden bg-black aspect-video cursor-pointer group"
        >
          <img
            src={post.videoThumbnail}
            alt={post.title || 'Video preview'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 ml-0.5 fill-white" />
            </div>
          </div>
          {post.videoDuration && (
            <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {post.videoDuration}
            </div>
          )}
        </div>
      )}

      {post.postType !== 'VIDEO' && post.images && post.images.length > 0 && (
        <div className="px-4 md:px-5 mb-3">
          {post.images.length === 1 ? (
            <div 
              onClick={() => openPostDetail(post)}
              className="rounded-xl overflow-hidden cursor-pointer max-h-96 bg-slate-100"
            >
              <img
                src={post.images[0]}
                alt="Post attachment"
                className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
              {post.images.slice(0, 2).map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => openPostDetail(post)}
                  className="cursor-pointer aspect-4/3 bg-slate-100 overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Attachment ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Linked Structured Real Estate Components (Primary Projects or Secondary Listings) */}
      {linkedProjects.length > 0 && (
        <div className="px-4 md:px-5 mb-3 space-y-2">
          {linkedProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => openProjectFromSocial(proj.id)}
              className="flex items-center justify-between gap-3 p-3 bg-blue-50/50 hover:bg-blue-50/80 rounded-xl border border-blue-100 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={proj.coverImage}
                  alt={proj.name}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">{proj.developer}</span>
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">
                    {proj.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">{proj.location} • {proj.priceFrom}</p>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 px-3 py-1.5 bg-white group-hover:bg-blue-600 text-blue-600 group-hover:text-white border border-blue-200 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1"
              >
                <span>Xem giỏ hàng</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {linkedListings.length > 0 && (
        <div className="px-4 md:px-5 mb-3 space-y-2">
          {linkedListings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => openListingFromSocial(listing.id)}
              className="flex items-center justify-between gap-3 p-3 bg-emerald-50/40 hover:bg-emerald-50/70 rounded-xl border border-emerald-100 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-emerald-600">{listing.district} • {listing.bedrooms}PN</span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700">
                    {listing.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">{listing.area}m² • <strong className="text-rose-600">{listing.price}</strong></p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openContactSale(listing);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                >
                  Tư vấn
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Contact specialist shortcut for Sale / Agency */}
      {(post.author.role === 'SALE' || post.author.role === 'AGENCY') && post.author.contactPhone && (
        <div className="mx-4 md:mx-5 mb-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Môi giới chuyên trách dự án: <strong>{post.author.contactPhone}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            {post.author.contactZalo && (
              <a
                href={`https://zalo.me/${post.author.contactZalo}`}
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-[11px] font-semibold"
              >
                Nhắn Zalo
              </a>
            )}
            <a
              href={`tel:${post.author.contactPhone.replace(/\s/g, '')}`}
              className="px-2 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded text-[11px] font-semibold"
            >
              Gọi ngay
            </a>
          </div>
        </div>
      )}

      {/* 6. Interaction Action Bar (Like, Comment, Share, Bookmark, Ask AI) */}
      <div className="px-4 md:px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like */}
          <button
            type="button"
            id={`like-btn-${post.id}`}
            onClick={() => toggleLikePost(post.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
              isLiked
                ? 'text-rose-600 bg-rose-50 font-bold'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
            <span>{post.likeCount}</span>
          </button>

          {/* Comment */}
          <button
            type="button"
            id={`comment-btn-${post.id}`}
            onClick={() => openCommentsModal(post)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.commentCount}</span>
          </button>

          {/* Share */}
          <button
            type="button"
            id={`share-btn-${post.id}`}
            onClick={() => openShareModal(post)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Chia sẻ</span>
          </button>

          {/* Bookmark */}
          <button
            type="button"
            id={`save-post-btn-${post.id}`}
            onClick={() => toggleSavePost(post.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isSaved
                ? 'text-amber-600 bg-amber-50'
                : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
            }`}
            title={isSaved ? 'Đã lưu bài viết' : 'Lưu bài viết'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>

        {/* AI Action CTA: Hỏi AI về bài này */}
        <button
          type="button"
          id={`ask-ai-post-btn-${post.id}`}
          onClick={handleAskAIAboutPost}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-all border border-blue-200/60 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[11px]">Hỏi AI về bài này</span>
        </button>
      </div>
    </article>
  );
};

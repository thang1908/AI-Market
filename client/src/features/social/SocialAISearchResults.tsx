import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  Home, 
  UserCheck, 
  Video, 
  FileText, 
  MessageSquare,
  ChevronRight,
  Phone,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { SocialPostCard } from './SocialPostCard';
import { Project, PropertyListing, SocialAuthor } from '../../types';

export const SocialAISearchResults: React.FC = () => {
  const { 
    socialSearchQuery, 
    socialSearchResults, 
    clearSocialSearch,
    openAIWithSocialContext,
    openProjectFromSocial,
    openListingFromSocial,
    openSocialProfile,
    toggleFollowAuthor,
    isAuthorFollowed,
    openContactSale
  } = useAppState();

  const [activeResultTab, setActiveResultTab] = useState<'all' | 'posts' | 'projects' | 'listings' | 'authors' | 'videos'>('all');

  if (!socialSearchResults) return null;

  const { aiAnswer, relatedPosts, relatedProjects, relatedListings, relatedAuthors, relatedVideos } = socialSearchResults;

  const handleAskDeeper = () => {
    openAIWithSocialContext(`Phân tích chuyên sâu hơn về: "${socialSearchQuery}". Hãy cung cấp số liệu so sánh, quy hoạch và rủi ro nếu có.`);
  };

  return (
    <div id="social-ai-search-results" className="space-y-6">
      {/* Header with back button & query */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          id="social-search-back-btn"
          onClick={clearSocialSearch}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Bảng tin</span>
        </button>
        <span className="text-xs text-slate-400">
          Kết quả tìm kiếm cho: <strong className="text-slate-700">"{socialSearchQuery}"</strong>
        </span>
      </div>

      {/* ========================================================= */}
      {/* LAYER 1: AI ANSWER / SUMMARY CARD */}
      {/* ========================================================= */}
      <div id="ai-search-layer-1-summary" className="bg-linear-to-br from-blue-50/90 via-indigo-50/40 to-white rounded-2xl border border-blue-200/80 p-5 md:p-6 shadow-xs relative overflow-hidden">
        {/* Decorative corner icon */}
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Sparkles className="w-24 h-24 text-blue-600" />
        </div>

        {/* AI Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-xs mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Tổng hợp thông minh</span>
        </div>

        {/* Headline */}
        <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
          {aiAnswer.headline}
        </h2>

        {/* Summary text */}
        <p className="text-sm md:text-base text-slate-700 leading-relaxed mb-4">
          {aiAnswer.summary}
        </p>

        {/* Key Highlights Metrics */}
        {aiAnswer.keyHighlights && aiAnswer.keyHighlights.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
            {aiAnswer.keyHighlights.map((hl, idx) => (
              <div key={idx} className="bg-white/90 border border-blue-100 rounded-xl p-2.5 text-center">
                <span className="block text-[11px] text-slate-400 font-medium">{hl.label}</span>
                <span className="block text-xs md:text-sm font-bold text-blue-900 mt-0.5">{hl.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bullet Points */}
        {aiAnswer.bulletPoints && aiAnswer.bulletPoints.length > 0 && (
          <div className="space-y-2 mb-4 bg-white/70 backdrop-blur-xs rounded-xl p-3.5 border border-blue-100/60">
            {aiAnswer.bulletPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs md:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        )}

        {/* Citation & Action CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-blue-100 text-xs">
          <span className="text-slate-400 italic">
            {aiAnswer.sourceCitation || 'Nguồn: Dữ liệu Masterise, CapitaLand & Hệ thống AI Bất Động Sản'}
          </span>

          <button
            type="button"
            id="ai-search-ask-more-btn"
            onClick={handleAskDeeper}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-all active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Hỏi thêm trợ lý AI</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LAYER 2: RELATED STRUCTURED RESULTS */}
      {/* ========================================================= */}
      <div id="ai-search-layer-2-results" className="space-y-4">
        {/* Results Navigation Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveResultTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeResultTab === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả kết quả
          </button>
          <button
            type="button"
            onClick={() => setActiveResultTab('posts')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeResultTab === 'posts'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Bài viết ({relatedPosts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveResultTab('projects')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeResultTab === 'projects'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>Dự án ({relatedProjects.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveResultTab('listings')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeResultTab === 'listings'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Home className="w-3 h-3" />
            <span>BĐS đang bán ({relatedListings.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveResultTab('authors')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeResultTab === 'authors'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>Chuyên gia & CĐT ({relatedAuthors.length})</span>
          </button>
        </div>

        {/* Section: Related Projects */}
        {(activeResultTab === 'all' || activeResultTab === 'projects') && relatedProjects.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 md:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Dự án sơ cấp liên quan
              </h3>
              <span className="text-xs text-slate-400">{relatedProjects.length} dự án</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer group"
                  onClick={() => openProjectFromSocial(project.id)}
                >
                  <img
                    src={project.coverImage}
                    alt={project.name}
                    className="w-20 h-20 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">{project.developer}</span>
                    <h4 className="text-xs md:text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">{project.location}</p>
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/40">
                      <span className="text-xs font-bold text-rose-600">{project.priceFrom} • {project.pricePerM2}</span>
                      <span className="text-[10px] text-slate-500 font-medium inline-flex items-center">
                        Xem chi tiết <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Related Listings */}
        {(activeResultTab === 'all' || activeResultTab === 'listings') && relatedListings.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 md:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Home className="w-4 h-4 text-emerald-600" />
                Bất động sản phù hợp tiêu chí
              </h3>
              <span className="text-xs text-slate-400">{relatedListings.length} căn hộ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedListings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 bg-slate-50/50 hover:bg-emerald-50/20 transition-all cursor-pointer group"
                  onClick={() => openListingFromSocial(listing.id)}
                >
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-20 h-20 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold text-emerald-600">{listing.district} • {listing.bedrooms}PN</span>
                    <h4 className="text-xs md:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {listing.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">{listing.area}m² • {listing.pricePerM2}</p>
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/40">
                      <span className="text-xs font-bold text-rose-600">{listing.price}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openContactSale(listing);
                        }}
                        className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded"
                      >
                        Liên hệ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Related Authors / Specialists */}
        {(activeResultTab === 'all' || activeResultTab === 'authors') && relatedAuthors.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 md:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                Môi giới xác thực & Chuyên gia tư vấn
              </h3>
              <span className="text-xs text-slate-400">{relatedAuthors.length} chuyên gia</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedAuthors.map((author) => {
                const isFollowed = isAuthorFollowed(author.id);
                return (
                  <div
                    key={author.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-white transition-all flex items-start gap-3"
                  >
                    <img
                      src={author.avatar}
                      alt={author.name}
                      onClick={() => openSocialProfile(author)}
                      className="w-12 h-12 rounded-full object-cover shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span 
                          onClick={() => openSocialProfile(author)}
                          className="text-xs font-bold text-slate-800 truncate cursor-pointer hover:text-blue-600"
                        >
                          {author.name}
                        </span>
                        {author.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        )}
                      </div>
                      <span className="block text-[10px] text-slate-500 font-medium">
                        {author.roleTitle}
                      </span>
                      <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                        {author.specialtyProjects.join(', ')}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => toggleFollowAuthor(author.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                            isFollowed
                              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isFollowed ? 'Đang theo dõi' : '+ Theo dõi'}
                        </button>
                        {author.contactPhone && (
                          <a
                            href={`tel:${author.contactPhone.replace(/\s/g, '')}`}
                            className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            title="Gọi điện"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {author.contactZalo && (
                          <a
                            href={`https://zalo.me/${author.contactZalo}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-semibold border border-blue-200"
                          >
                            Zalo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section: Related Posts */}
        {(activeResultTab === 'all' || activeResultTab === 'posts') && relatedPosts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-700" />
              Bài thảo luận & Đánh giá từ cộng đồng ({relatedPosts.length})
            </h3>
            {relatedPosts.map((post) => (
              <SocialPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

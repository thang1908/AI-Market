import React from 'react';
import { 
  Plus, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  Compass, 
  ShieldCheck,
  ChevronRight,
  Filter,
  Users
} from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { SocialAISearchBar } from './SocialAISearchBar';
import { SocialAISearchResults } from './SocialAISearchResults';
import { SocialPostCard } from './SocialPostCard';
import { SocialProfileModal } from './SocialProfileModal';
import { SocialCreatePostModal } from './SocialCreatePostModal';
import { SocialShareModal } from './SocialShareModal';
import { SocialCommentsModal } from './SocialCommentsModal';
import { SocialPostDetailModal } from './SocialPostDetailModal';
import { mockTrendingTopics, mockSocialAuthors } from '../../data/mockSocialData';
import { SocialFeedCategory } from '../../types';

export const SocialPage: React.FC = () => {
  const {
    socialPosts,
    activeSocialTopic,
    setActiveSocialTopic,
    socialFeedSort,
    setSocialFeedSort,
    socialSearchResults,
    handleSocialSearch,
    openCreatePost,
    openSocialProfile,
    toggleFollowAuthor,
    isAuthorFollowed,
    openAIWithSocialContext,
    openProjectFromSocial
  } = useAppState();

  const topicTabs: { id: SocialFeedCategory; label: string }[] = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'PROJECTS', label: 'Dự án & CĐT' },
    { id: 'MARKET', label: 'Thị trường & Giá' },
    { id: 'LEGAL', label: 'Pháp lý & Quy hoạch' },
    { id: 'LISTINGS', label: 'Bảng hàng BĐS' },
    { id: 'VIDEOS', label: 'Video Review' },
    { id: 'LIFESTYLE', label: 'Kinh nghiệm ở thực' }
  ];

  // Filter posts by topic
  const filteredPosts = socialPosts.filter((post) => {
    // Topic filtering
    if (activeSocialTopic === 'PROJECTS') {
      if (post.postType !== 'DEVELOPER_OFFICIAL' && (!post.projectIds || post.projectIds.length === 0)) return false;
    } else if (activeSocialTopic === 'MARKET') {
      if (post.postType !== 'MARKET_UPDATE' && post.postType !== 'AI_NEWS_SUMMARY') return false;
    } else if (activeSocialTopic === 'LEGAL') {
      if (!post.categories.some(c => c.toLowerCase().includes('pháp lý') || c.toLowerCase().includes('quy hoạch'))) return false;
    } else if (activeSocialTopic === 'LISTINGS') {
      if (post.postType !== 'PROPERTY_POST' && post.postType !== 'SALE_POST') return false;
    } else if (activeSocialTopic === 'VIDEOS') {
      if (post.postType !== 'VIDEO') return false;
    } else if (activeSocialTopic === 'LIFESTYLE') {
      if (post.postType !== 'COMMUNITY') return false;
    }

    // Following tab filtering
    if (socialFeedSort === 'following') {
      return isAuthorFollowed(post.authorId || post.author.id);
    }

    return true;
  });

  return (
    <div id="social-page-container" className="min-h-screen bg-slate-50/70 pb-24 md:pb-12 pt-4 md:pt-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        
        {/* Top Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-blue-600/10 text-blue-600">
                <Compass className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Cộng đồng & Khám phá BĐS
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              AI Search, tin tức thị trường, bảng hàng độc quyền & đánh giá từ chuyên gia
            </p>
          </div>

          {/* Action: Create Post */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              id="social-create-post-btn"
              onClick={openCreatePost}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo bài viết</span>
            </button>
          </div>
        </div>

        {/* AI Search Header */}
        <SocialAISearchBar />

        {/* Dynamic Section: Search Results OR Standard Feed */}
        {socialSearchResults ? (
          <SocialAISearchResults />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left/Main Column: Topics & Feed (8 cols on desktop) */}
            <main className="lg:col-span-8 space-y-5">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {topicTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    id={`social-topic-tab-${tab.id}`}
                    onClick={() => setActiveSocialTopic(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activeSocialTopic === tab.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Feed Sort Switcher */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 text-xs">
                  <button
                    type="button"
                    id="sort-for-you-btn"
                    onClick={() => setSocialFeedSort('for_you')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      socialFeedSort === 'for_you'
                        ? 'bg-white text-blue-600 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Dành cho bạn
                  </button>
                  <button
                    type="button"
                    id="sort-latest-btn"
                    onClick={() => setSocialFeedSort('latest')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      socialFeedSort === 'latest'
                        ? 'bg-white text-blue-600 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Mới nhất
                  </button>
                  <button
                    type="button"
                    id="sort-following-btn"
                    onClick={() => setSocialFeedSort('following')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      socialFeedSort === 'following'
                        ? 'bg-white text-blue-600 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Đang theo dõi
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-medium">
                  {filteredPosts.length} bài viết
                </span>
              </div>

              {/* Posts Feed List */}
              <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center text-slate-400">
                    <Compass className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-600">Chưa có bài viết phù hợp</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {socialFeedSort === 'following'
                        ? 'Bạn chưa theo dõi tác giả nào hoặc tác giả chưa đăng bài mới.'
                        : 'Hãy thử chọn danh mục khác hoặc tạo bài viết đầu tiên.'}
                    </p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <SocialPostCard key={post.id} post={post} />
                  ))
                )}
              </div>
            </main>

            {/* Right Column: Trending, Verified Creators, AI Radar (4 cols on desktop) */}
            <aside className="hidden lg:block lg:col-span-4 space-y-5">
              
              {/* Widget 1: Trending Hashtags */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
                <div className="flex items-center gap-1.5 mb-3">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Chủ đề thảo luận nóng
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {mockTrendingTopics.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSocialSearch(item.tag.replace('#', ''))}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {item.tag}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{item.count}</span>
                      </div>
                      {item.isHot && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100">
                          HOT
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget 2: Verified Creators & Developers */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Chuyên gia & Chủ đầu tư
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {mockSocialAuthors.slice(0, 4).map((author) => {
                    const isFollowed = isAuthorFollowed(author.id);
                    return (
                      <div key={author.id} className="flex items-center justify-between gap-2.5">
                        <div 
                          onClick={() => openSocialProfile(author)}
                          className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                        >
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-100 group-hover:ring-blue-400 transition-all"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600">
                                {author.name}
                              </span>
                              {author.isVerified && (
                                <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
                              )}
                            </div>
                            <span className="block text-[10px] text-slate-400 truncate">
                              {author.roleTitle}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleFollowAuthor(author.id)}
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg shrink-0 transition-colors ${
                            isFollowed
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200/60'
                          }`}
                        >
                          {isFollowed ? 'Đã theo dõi' : '+ Theo dõi'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Widget 3: AI Assistant Quick Help */}
              <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-white/20">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    Trợ lý AI Bất Động Sản
                  </h3>
                </div>
                <p className="text-xs text-blue-100 leading-relaxed mb-3">
                  Cần thẩm định pháp lý, so sánh giá các khu vực hoặc kiểm tra tiến độ dự án mới?
                </p>
                <button
                  type="button"
                  onClick={() => openAIWithSocialContext('Tư vấn giúp tôi tổng quan thị trường căn hộ Hà Nội tháng này, dự án nào đáng mua nhất để ở?')}
                  className="w-full py-2 bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold rounded-xl shadow-xs transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>Hỏi AI ngay</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </aside>
          </div>
        )}

      </div>

      {/* Social Modals */}
      <SocialProfileModal />
      <SocialCreatePostModal />
      <SocialShareModal />
      <SocialCommentsModal />
      <SocialPostDetailModal />
    </div>
  );
};

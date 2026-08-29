import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { mockNewsList } from '../../data/mockNews';

export const NewsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const categories = ['Tất cả', 'Thị trường', 'Quy hoạch', 'Hạ tầng', 'Chính sách', 'Tài chính'];

  const filteredNews = selectedCategory === 'Tất cả' 
    ? mockNewsList 
    : mockNewsList.filter(n => n.category === selectedCategory);

  const featured = filteredNews.find(n => n.isFeatured) || filteredNews[0];
  const sideArticles = filteredNews.filter(n => n.id !== featured?.id).slice(0, 3);

  return (
    <section id="ai-news-section" className="py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Tin tức nổi bật
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Góc nhìn chuyên sâu và thông tin chính sách bất động sản mới nhất
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredNews.length > 0 && featured ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Featured Article (Large) */}
          <div 
            id="featured-news-card"
            className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-300 transition-all flex flex-col group cursor-pointer"
          >
            <div className="relative h-56 sm:h-72 overflow-hidden bg-slate-100">
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-blue-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg shadow-xs">
                {featured.category}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {featured.time}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featured.readTime}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {featured.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 mt-2.5 line-clamp-3 leading-relaxed">
                  {featured.summary}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600 group-hover:gap-2 transition-all">
                <span>Đọc bài phân tích</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </div>

          {/* 3 Secondary Articles */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            {sideArticles.map((article) => (
              <div
                key={article.id}
                id={`side-news-${article.id}`}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 hover:border-blue-300 hover:shadow-md transition-all flex gap-4 items-center group cursor-pointer flex-1"
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-24 h-24 sm:w-28 sm:h-24 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-200"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] mb-1.5 font-bold">
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="text-slate-400 font-medium">{article.time}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                    {article.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl text-xs">
          Không có tin tức trong chuyên mục này.
        </div>
      )}
    </section>
  );
};

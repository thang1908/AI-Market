import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Sparkles, Building2, Tag } from 'lucide-react';
import { mockHotProjects } from '../../data/mockProjects';
import { useAppState } from '../../state/useAppState';

export const HotProjects: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { openMarketWithFilter, askAIAboutProperty } = useAppState();

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.8;
      carouselRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="ai-hot-projects-section" className="py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Dự án đang được quan tâm
            </h2>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Nổi bật
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Các dự án đô thị và căn hộ có lưu lượng tìm kiếm cao nhất trong tháng
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shadow-2xs"
            title="Trượt sang trái"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shadow-2xs"
            title="Trượt sang phải"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mockHotProjects.map((project) => (
          <div
            key={project.id}
            id={`project-card-${project.id}`}
            className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-300 transition-all flex flex-col snap-start group"
          >
            {/* Image & Status Badge */}
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs">
                {project.status}
              </div>
              <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                {project.units}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {project.name}
                </h3>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{project.location}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {project.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Khoảng giá</div>
                  <div className="font-black text-sm text-blue-600">{project.priceRange}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{project.pricePerM2}</div>
                </div>

                <button
                  onClick={() => openMarketWithFilter({ searchQuery: project.name })}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-xl text-xs font-bold transition-all"
                >
                  Xem quỹ căn
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

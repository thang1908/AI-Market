import React from 'react';
import { Sparkles, Flame, Clock, Building2, SearchX, RotateCcw } from 'lucide-react';
import { Project } from '../../../types';
import { ProjectCard } from './ProjectCard';
import { useAppState } from '../../../state/useAppState';

interface ProjectDiscoverySectionsProps {
  projects: Project[];
}

export const ProjectDiscoverySections: React.FC<ProjectDiscoverySectionsProps> = ({ projects }) => {
  const { projectFilters, resetProjectFilters } = useAppState();

  const isFiltering = 
    Boolean(projectFilters.searchQuery) ||
    projectFilters.districts.length > 0 ||
    projectFilters.developer !== 'Tất cả' ||
    projectFilters.priceRange !== 'Tất cả' ||
    projectFilters.status !== 'Tất cả';

  // Filtered dataset
  const filteredProjects = projects.filter(p => {
    // 1. Search Query
    if (projectFilters.searchQuery) {
      const q = projectFilters.searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDev = p.developer.toLowerCase().includes(q);
      const matchDistrict = p.district.toLowerCase().includes(q);
      const matchLocation = p.location.toLowerCase().includes(q);
      const matchTypes = p.propertyTypes.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchDev && !matchDistrict && !matchLocation && !matchTypes) {
        return false;
      }
    }

    // 2. Districts
    if (projectFilters.districts.length > 0) {
      const matchDistrict = projectFilters.districts.some(d => 
        p.district.toLowerCase().includes(d.toLowerCase()) || 
        p.location.toLowerCase().includes(d.toLowerCase())
      );
      if (!matchDistrict) return false;
    }

    // 3. Developer
    if (projectFilters.developer !== 'Tất cả') {
      if (!p.developer.toLowerCase().includes(projectFilters.developer.toLowerCase())) {
        return false;
      }
    }

    // 4. Status
    if (projectFilters.status !== 'Tất cả') {
      if (p.status !== projectFilters.status) return false;
    }

    // 5. Price Range
    if (projectFilters.priceRange !== 'Tất cả') {
      const price = p.priceValueNumber || 0;
      if (projectFilters.priceRange === 'Dưới 5 tỷ' && price >= 5) return false;
      if (projectFilters.priceRange === '5 - 8 tỷ' && (price < 5 || price > 8)) return false;
      if (projectFilters.priceRange === '8 - 15 tỷ' && (price < 8 || price > 15)) return false;
      if (projectFilters.priceRange === 'Trên 15 tỷ' && price < 15) return false;
    }

    return true;
  });

  // If user is searching or filtering, show direct results grid
  if (isFiltering) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Kết quả tìm kiếm dự án ({filteredProjects.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dự án sơ cấp phù hợp với tiêu chí của bạn
            </p>
          </div>

          <button
            type="button"
            onClick={resetProjectFilters}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xoá bộ lọc</span>
          </button>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center mx-auto">
              <SearchX className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base font-bold text-slate-800">
                Không tìm thấy dự án phù hợp
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Hãy thử nới lỏng các tiêu chí lọc giá, khu vực hoặc sử dụng thanh tìm kiếm AI với từ khoá tổng quát hơn.
              </p>
            </div>
            <button
              type="button"
              onClick={resetProjectFilters}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              Xem tất cả dự án
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default Discovery View: 3 Structured Sections
  const featuredProjects = projects.filter(p => p.isFeatured);
  const newLaunchProjects = projects.filter(p => p.status === 'Đang mở bán' || p.status === 'Sắp mở bán');
  const popularProjects = [...projects].sort((a, b) => b.availableUnitsCount - a.availableUnitsCount);

  return (
    <div className="space-y-12">
      
      {/* 1. DỰ ÁN NỔI BẬT */}
      <section id="section-featured-projects" className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Dự án nổi bật
              </h2>
              <p className="text-xs text-slate-500">Các đại dự án quy mô lớn từ chủ đầu tư hàng đầu</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {featuredProjects.length} dự án
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={`feat-${project.id}`} project={project} />
          ))}
        </div>
      </section>

      {/* 2. MỚI MỞ BÁN / MỚI CẬP NHẬT */}
      <section id="section-new-launch-projects" className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Mới mở bán / Mới cập nhật
              </h2>
              <p className="text-xs text-slate-500">Các phân khu mới mở giỏ hàng với chính sách chiết khấu tốt nhất</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {newLaunchProjects.length} dự án
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newLaunchProjects.map((project) => (
            <ProjectCard key={`new-${project.id}`} project={project} />
          ))}
        </div>
      </section>

      {/* 3. ĐƯỢC QUAN TÂM NHIỀU */}
      <section id="section-popular-projects" className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Được quan tâm nhiều
              </h2>
              <p className="text-xs text-slate-500">Dự án có lượng tìm kiếm & yêu cầu tư vấn sôi động nhất tuần qua</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {popularProjects.length} dự án
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularProjects.map((project) => (
            <ProjectCard key={`pop-${project.id}`} project={project} />
          ))}
        </div>
      </section>

    </div>
  );
};

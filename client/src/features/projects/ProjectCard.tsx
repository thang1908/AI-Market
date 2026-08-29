import React from 'react';
import { MapPin, Building2, Layers, Heart, Sparkles, PhoneCall, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Project } from '../../types';
import { useAppState } from '../../state/useAppState';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const {
    setActiveProject,
    openInventory,
    isProjectSaved,
    toggleSaveProject,
    openContactSale
  } = useAppState();

  const isSaved = isProjectSaved(project.id);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Đang mở bán':
        return 'bg-emerald-500 text-white';
      case 'Sắp mở bán':
        return 'bg-amber-500 text-white';
      case 'Đang bàn giao':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  return (
    <div 
      id={`project-card-${project.id}`}
      className="group bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Thumbnail & Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={project.thumbnail}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className={`px-2.5 py-1 rounded-xl text-2xs font-extrabold uppercase tracking-wider shadow-xs ${getStatusBadgeStyle(project.status)}`}>
            {project.status}
          </span>
          {project.badge && (
            <span className="px-2.5 py-1 rounded-xl text-2xs font-extrabold bg-blue-600/90 backdrop-blur-xs text-white uppercase tracking-wider shadow-xs">
              {project.badge}
            </span>
          )}
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveProject(project.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all z-10 ${
            isSaved
              ? 'bg-white text-red-500 shadow-md'
              : 'bg-black/30 hover:bg-black/50 text-white'
          }`}
          title={isSaved ? 'Bỏ lưu dự án' : 'Lưu dự án'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Image Info: Available Units Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
          <div className="flex items-center gap-1.5 text-2xs font-semibold bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <Layers className="w-3 h-3 text-blue-300" />
            <span>Giỏ hàng sơ cấp: <strong>{project.availableUnitsCount} căn</strong></span>
          </div>
          <span className="text-2xs bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white/90 font-medium">
            {project.overview.handoverTime || project.overview.handover || '2025 - 2026'}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Developer & Legal */}
          <div className="flex items-center justify-between gap-2 text-2xs mb-1">
            <span className="font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {project.developer}
            </span>
            <span className="text-slate-400 font-medium truncate">
              {project.legal.ownership}
            </span>
          </div>

          {/* Project Title */}
          <h3 
            onClick={() => setActiveProject(project)}
            className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
          >
            {project.name}
          </h3>

          {/* Location */}
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{project.location}</span>
          </p>

          {/* Property Types / Tags Chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(project.tags || (project.propertyType ? [project.propertyType] : [])).slice(0, 3).map((type) => (
              <span 
                key={type}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Metric */}
        <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <span className="text-2xs text-slate-400 block font-medium">Mức giá sơ cấp</span>
            <span className="text-base sm:text-lg font-black text-blue-700 tracking-tight">
              {project.priceFrom}
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xs text-slate-400 block font-medium">Đơn giá trung bình</span>
            <span className="text-xs font-bold text-slate-700">
              {project.priceAvgPerM2 || project.pricePerM2}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveProject(project)}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
          >
            <span>Xem dự án</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            type="button"
            onClick={() => openInventory(project)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md hover:shadow-blue-600/20 transition-all text-center flex items-center justify-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Xem giỏ hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

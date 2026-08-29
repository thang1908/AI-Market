import React, { useState } from 'react';
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, Maximize2, ExternalLink, Building2, Eye, ShieldCheck, Heart, Sparkles, X } from 'lucide-react';
import { Project } from '../../types';
import { useAppState } from '../../state/useAppState';

interface ProjectMapViewProps {
  projects: Project[];
}

export const ProjectMapView: React.FC<ProjectMapViewProps> = ({ projects }) => {
  const { 
    setActiveProject, 
    openInventory, 
    isProjectSaved, 
    toggleSaveProject,
    openContactSale
  } = useAppState();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('standard');
  const [activeDistrictTab, setActiveDistrictTab] = useState<string>('Tất cả');

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0] || null;

  // Filter projects by district if selected in map tab
  const displayedProjects = activeDistrictTab === 'Tất cả'
    ? projects
    : projects.filter(p => p.district.toLowerCase().includes(activeDistrictTab.toLowerCase()));

  // Map coordinates simulation for Hanoi & regional projects
  const getProjectMapCoords = (projectId: string) => {
    switch (projectId) {
      case 'PROJ-LUMI':
        return { top: '56%', left: '32%' }; // Nam Từ Liêm / Tây Mỗ
      case 'PROJ-HERITAGE':
        return { top: '28%', left: '52%' }; // Tây Hồ / Lạc Long Quân
      case 'PROJ-MASTERI-WEST':
        return { top: '58%', left: '30%' }; // Smart City / Tây Mỗ
      case 'PROJ-MATRIX-ONE':
        return { top: '48%', left: '40%' }; // Mễ Trì / Nam Từ Liêm
      case 'PROJ-VINOCC3':
        return { top: '72%', left: '78%' }; // Văn Giang / Ocean Park
      case 'PROJ-GRAND-SUNLAKE':
        return { top: '68%', left: '38%' }; // Hà Đông / Văn Quán
      default:
        return { top: '50%', left: '50%' };
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 1.6));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.8));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div id="project-map-section" className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mb-10">
      {/* Map Header / District Switcher */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Bản đồ quy hoạch & Dự án sơ cấp
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Khám phá vị trí các đại dự án, hạ tầng giao thông và giỏ hàng phân phối trực tiếp
          </p>
        </div>

        {/* District Filter Pills on Map */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {['Tất cả', 'Nam Từ Liêm', 'Tây Hồ', 'Cầu Giấy', 'Hà Đông', 'Hưng Yên'].map(district => (
            <button
              key={district}
              onClick={() => setActiveDistrictTab(district)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeDistrictTab === district
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {district}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[400px] sm:h-[480px] bg-slate-100 overflow-hidden select-none">
        
        {/* Map Background Surface (Stylized Grid & Vector Metro lines) */}
        <div 
          className="absolute inset-0 transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {mapMode === 'standard' ? (
            <div className="absolute inset-0 bg-[#eef2f6] opacity-90 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]">
              {/* Stylized River & Lakes */}
              <svg className="absolute inset-0 w-full h-full text-blue-200/70 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* West Lake Hồ Tây */}
                <ellipse cx="54%" cy="26%" rx="90" ry="60" fill="#bae6fd" opacity="0.6" />
                <text x="53%" y="26%" fill="#0369a1" fontSize="11" fontWeight="700" textAnchor="middle">HỒ TÂY (500ha)</text>

                {/* Red River Sông Hồng */}
                <path d="M 0,50 Q 300,120 550,70 T 1100,180" fill="none" stroke="#93c5fd" strokeWidth="32" strokeLinecap="round" opacity="0.4" />
                
                {/* Metro Line 5 & Thang Long Blvd */}
                <path d="M 100,280 L 800,220" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 4" opacity="0.8" />
                <text x="320" y="240" fill="#b45309" fontSize="10" fontWeight="600" transform="rotate(-5 320 240)">Tuyến Metro Số 5 • Đại lộ Thăng Long</text>

                {/* Ring Road 3 */}
                <path d="M 420,50 Q 380,250 430,450" fill="none" stroke="#64748b" strokeWidth="3.5" opacity="0.5" />
                <text x="400" y="360" fill="#475569" fontSize="9" fontWeight="600" transform="rotate(80 400 360)">Vành Đai 3</text>
              </svg>
            </div>
          ) : (
            <div className="absolute inset-0 bg-slate-900 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]">
              {/* Satellite Dark Map */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 opacity-95"></div>
            </div>
          )}

          {/* Project Markers */}
          {displayedProjects.map((project) => {
            const coords = getProjectMapCoords(project.id);
            const isSelected = selectedProjectId === project.id;

            return (
              <div
                key={project.id}
                style={{ top: coords.top, left: coords.left }}
                onClick={() => setSelectedProjectId(project.id)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10 hover:z-30 group ${
                  isSelected ? 'z-20 scale-110' : ''
                }`}
              >
                {/* Marker Pin Icon & Price Badge */}
                <div className="flex flex-col items-center">
                  <div className={`px-2.5 py-1 rounded-xl font-extrabold text-2xs sm:text-xs shadow-md flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 scale-105'
                      : 'bg-white text-slate-900 hover:bg-blue-50 border border-slate-200'
                  }`}>
                    <Building2 className="w-3 h-3 text-blue-500" />
                    <span>{project.name.split(' ')[0]}</span>
                    <span className={`font-semibold ${isSelected ? 'text-blue-100' : 'text-blue-600'}`}>
                      {project.priceFrom.replace('Giá từ ', '')}
                    </span>
                  </div>

                  <div className={`w-3 h-3 rotate-45 -mt-1.5 transition-colors ${
                    isSelected ? 'bg-blue-600' : 'bg-white border-r border-b border-slate-200'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Control Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-1 shadow-md border border-slate-200 flex flex-col gap-1">
            <button
              onClick={handleZoomIn}
              title="Phóng to"
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-700 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Thu nhỏ"
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-700 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Tâm bản đồ"
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-700 transition-colors"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setMapMode(prev => prev === 'standard' ? 'satellite' : 'standard')}
            title="Đổi kiểu bản đồ"
            className="p-2.5 bg-white/95 backdrop-blur-xs rounded-2xl shadow-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Project Floating Mini Card (Bottom Left) */}
        {selectedProject && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200/90 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start gap-3.5">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <img 
                  src={selectedProject.thumbnail || selectedProject.coverImage} 
                  alt={selectedProject.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-blue-600/90 text-white text-[10px] font-bold">
                  {selectedProject.status}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-blue-600 truncate uppercase tracking-wider">
                    {selectedProject.developer}
                  </span>
                  <button
                    onClick={() => toggleSaveProject(selectedProject.id)}
                    className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${
                      isProjectSaved(selectedProject.id) ? 'text-red-500' : 'text-slate-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isProjectSaved(selectedProject.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                  {selectedProject.name}
                </h3>

                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{selectedProject.location}</span>
                </p>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-sm font-extrabold text-blue-700">
                    {selectedProject.priceFrom}
                  </span>
                  <span className="text-2xs text-slate-400">
                    {selectedProject.priceAvgPerM2 || selectedProject.pricePerM2}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs on Mini Map Card */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveProject(selectedProject)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all text-center"
              >
                Xem chi tiết dự án
              </button>
              
              <button
                onClick={() => openInventory(selectedProject)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all text-center flex items-center justify-center gap-1"
              >
                <span>Xem giỏ hàng ({selectedProject.availableUnitsCount})</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

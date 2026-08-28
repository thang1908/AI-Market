import React, { useState } from 'react';
import { Sparkles, Store, MapPin, Bookmark, Bell, ChevronDown, Check } from 'lucide-react';
import { useAppState } from '../../state/useAppState';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    savedListingIds, 
    setIsSavedModalOpen,
    selectedCity,
    setSelectedCity
  } = useAppState();
  
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const handleCitySelect = (city: 'Hà Nội' | 'TP.HCM') => {
    setSelectedCity(city);
    setIsCityDropdownOpen(false);
  };

  const handleBellClick = () => {
    setShowNotificationToast(true);
    setHasNotifications(false);
    setTimeout(() => setShowNotificationToast(false), 3000);
  };

  return (
    <header id="app-header" className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <div 
            id="brand-logo" 
            onClick={() => setActiveTab('ai')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              AI Bất Động Sản
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex gap-1 ml-4 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            <button
              id="tab-btn-ai-header"
              onClick={() => setActiveTab('ai')}
              className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'ai'
                  ? 'bg-white shadow-xs text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              AI Assistant
            </button>
            <button
              id="tab-btn-market-header"
              onClick={() => setActiveTab('market')}
              className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'market'
                  ? 'bg-white shadow-xs text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Market
            </button>
            <button
              id="tab-btn-social-header"
              onClick={() => setActiveTab('social')}
              className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'social'
                  ? 'bg-white shadow-xs text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Cộng đồng
            </button>
          </nav>
        </div>

        {/* Right: City Selector, Saved, Notifications, Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Location Selector */}
          <div className="relative">
            <button
              id="header-location-selector"
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-full text-xs font-semibold text-slate-700 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isCityDropdownOpen && (
              <div 
                id="city-dropdown-menu"
                className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <button
                  onClick={() => handleCitySelect('Hà Nội')}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  <span>Hà Nội</span>
                  {selectedCity === 'Hà Nội' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  onClick={() => handleCitySelect('TP.HCM')}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  <span>TP.HCM</span>
                  {selectedCity === 'TP.HCM' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Saved Items Button */}
          <button
            id="header-saved-btn"
            onClick={() => setIsSavedModalOpen(true)}
            className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors"
            title="Bất động sản đã lưu"
          >
            <Bookmark className="w-5 h-5" />
            {savedListingIds.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center leading-none">
                {savedListingIds.length}
              </span>
            )}
          </button>

          {/* Notification Button */}
          <button
            id="header-notifications-btn"
            onClick={handleBellClick}
            className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors"
            title="Thông báo thị trường"
          >
            <Bell className="w-5 h-5" />
            {hasNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* User Avatar */}
          <div 
            id="header-avatar" 
            className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white shadow-xs flex items-center justify-center overflow-hidden cursor-pointer"
            title="Tài khoản cá nhân"
          >
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

      {/* Notification Toast */}
      {showNotificationToast && (
        <div className="absolute top-18 right-4 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl z-50 flex items-center gap-2 animate-in fade-in duration-150">
          <Bell className="w-4 h-4 text-blue-400" />
          <span>Bạn đã cập nhật tin thị trường mới nhất hôm nay!</span>
        </div>
      )}
    </header>
  );
};

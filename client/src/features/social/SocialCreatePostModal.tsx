import React, { useState } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Building2, 
  Tag, 
  MapPin, 
  Sparkles,
  Send,
  Check
} from 'lucide-react';
import { useAppState } from '../../state/useAppState';
import { mockProjects } from '../../data/mockPrimaryProjects';
import { mockListings } from '../../data/mockListings';
import { SocialPost } from '../../types';

export const SocialCreatePostModal: React.FC = () => {
  const {
    isCreatePostOpen,
    closeCreatePost,
    createNewSocialPost
  } = useAppState();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<SocialPost['postType']>('COMMUNITY');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedListingId, setSelectedListingId] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Hà Nội');
  const [selectedImage, setSelectedImage] = useState<string>('');

  if (!isCreatePostOpen) return null;

  const sampleImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createNewSocialPost({
      title: title.trim() || undefined,
      content: content.trim(),
      postType,
      images: selectedImage ? [selectedImage] : [],
      projectIds: selectedProjectId ? [selectedProjectId] : undefined,
      listingIds: selectedListingId ? [selectedListingId] : undefined,
      locationTags: [selectedDistrict],
      categories: ['Cộng đồng', postType === 'ANALYSIS' ? 'Phân tích' : 'Thảo luận']
    });

    // Reset fields
    setTitle('');
    setContent('');
    setSelectedProjectId('');
    setSelectedListingId('');
    setSelectedImage('');
  };

  return (
    <div
      id="social-create-post-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={closeCreatePost}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200/80 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              +
            </div>
            <h2 className="text-base font-bold text-slate-900">Tạo bài viết mới</h2>
          </div>
          <button
            type="button"
            onClick={closeCreatePost}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Post Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Loại bài viết
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'COMMUNITY', label: 'Thảo luận' },
                { type: 'ANALYSIS', label: 'Phân tích' },
                { type: 'PROPERTY_POST', label: 'Bán BĐS' },
                { type: 'VIDEO', label: 'Review' }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setPostType(item.type as SocialPost['postType'])}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    postType === item.type
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề bài viết (tuỳ chọn)..."
              className="w-full text-sm font-bold text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ kinh nghiệm, thắc mắc về dự án, tiến độ, thị trường BĐS..."
              className="w-full text-sm text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-xl p-3.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none leading-relaxed"
            />
          </div>

          {/* Attachments & Tags Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Tag Project */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                Gắn thẻ Dự án
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden focus:border-blue-500"
              >
                <option value="">-- Không gắn thẻ dự án --</option>
                {mockProjects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name} ({proj.developer})
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Location */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                Khu vực
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden focus:border-blue-500"
              >
                <option value="Hà Nội">Toàn Hà Nội</option>
                <option value="Nam Từ Liêm">Nam Từ Liêm</option>
                <option value="Tây Hồ">Tây Hồ</option>
                <option value="Cầu Giấy">Cầu Giấy</option>
                <option value="Bắc Từ Liêm">Bắc Từ Liêm</option>
                <option value="Gia Lâm">Gia Lâm</option>
                <option value="Hưng Yên">Hưng Yên / Ocean Park</option>
              </select>
            </div>
          </div>

          {/* Sample Photo selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-slate-400" />
              Đính kèm hình ảnh thực tế (Chọn mẫu)
            </label>
            <div className="flex gap-2">
              {sampleImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(selectedImage === img ? '' : img)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedImage === img ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="sample" className="w-full h-full object-cover" />
                  {selectedImage === img && (
                    <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow-sm" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeCreatePost}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Đăng bài</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

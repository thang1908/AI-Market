import React from 'react';
import { X, Building } from 'lucide-react';
import { useAppState } from '../../state/useAppState';

export const PropertyContextCard: React.FC = () => {
  const { currentPropertyContext, clearPropertyContext } = useAppState();

  if (!currentPropertyContext) return null;

  return (
    <div 
      id="chat-property-context-card"
      className="mx-4 mb-2 bg-blue-50/90 border border-blue-200/80 rounded-2xl p-3 flex items-center justify-between text-xs text-slate-800 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
          <Building className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
            Đang hỏi về
          </div>
          <div className="font-bold text-slate-900 truncate">
            {currentPropertyContext.title}
          </div>
          <div className="text-slate-600 font-medium">
            {currentPropertyContext.price} • {currentPropertyContext.area}m² • {currentPropertyContext.district}
          </div>
        </div>
      </div>

      <button
        id="clear-context-btn"
        onClick={clearPropertyContext}
        className="w-6 h-6 rounded-full hover:bg-blue-200/60 text-slate-500 hover:text-slate-800 flex items-center justify-center shrink-0 ml-2 transition-colors"
        title="Bỏ ngữ cảnh bất động sản này"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

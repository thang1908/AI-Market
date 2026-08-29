import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Plus, Sparkles, Paperclip } from 'lucide-react';
import { PropertyContextCard } from './PropertyContextCard';

interface ChatComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({ onSend, disabled = false }) => {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || disabled) return;
    onSend(inputText);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="border-t border-slate-100 bg-white pt-2.5 pb-4 px-4 md:px-6">
      {/* Property Context on top of composer if active */}
      <PropertyContextCard />

      <div className="relative max-w-3xl mx-auto flex items-center gap-2 bg-slate-100/90 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white focus-within:border focus-within:border-blue-400 transition-all">
        
        {/* Plus / Attach Action Button */}
        <button
          type="button"
          className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center shrink-0 transition-colors ml-1"
          title="Thêm tài liệu hoặc ảnh tham khảo"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          id="chat-composer-textarea"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập câu hỏi hoặc nhu cầu của bạn..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent py-2 px-1 text-sm text-slate-800 placeholder:text-slate-400 resize-none outline-none max-h-32 min-h-[2.5rem]"
        />

        {/* Send Button */}
        <button
          id="chat-send-btn"
          type="button"
          onClick={handleSend}
          disabled={!inputText.trim() || disabled}
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
            inputText.trim() && !disabled
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs scale-100'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          title="Gửi câu hỏi"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-2 text-center">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          AI Bất Động Sản phản hồi thông minh dựa trên dữ liệu thị trường mô phỏng
        </span>
      </div>
    </div>
  );
};

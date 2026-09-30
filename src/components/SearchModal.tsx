import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { sounds } from '../utils/audioUtils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, extra?: Record<string, unknown>) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const suggestions = [
    { title: 'Khám phá quả cam', type: 'Giáo án · 4-5 tuổi', tab: 'lesson-studio', extra: { topic: 'Khám phá quả cam' } },
    { title: 'Kỹ thuật giữ nhân vật nhất quán', type: 'Hướng dẫn học AI', tab: 'academy' },
    { title: 'Luyện AI mỗi ngày: Viết prompt, tạo ảnh & video', type: 'Thực hành Canva & ChatGPT', tab: 'daily-practice' },
    { title: 'English Buddy cho trẻ 3-4 tuổi', type: 'Song ngữ tự nhiên', tab: 'english-buddy' },
    { title: 'Kiến thức AI: Tải & Lưu trữ file Word, PDF', type: 'Tài liệu mầm non lưu mãi', tab: 'teaching-pack' },
    { title: 'Trò chơi phân loại màu sắc', type: 'Interactive Game', tab: 'magic-learning' },
  ];

  const filtered = query.trim()
    ? suggestions.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()))
    : suggestions;

  const handleSelect = (s: typeof suggestions[0]) => {
    sounds.playPop();
    onClose();
    onNavigate(s.tab, s.extra);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-16 sm:pt-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-200/90 space-y-4">
        {/* Search Input */}
        <div className="flex items-center gap-2 pb-3 border-b border-amber-100">
          <Search className="w-5 h-5 text-orange-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm giáo án, bài học AI, flashcard, trò chơi..."
            className="flex-1 text-sm font-bold text-amber-950 placeholder-stone-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center text-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Auto-suggestions */}
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          <span className="text-[11px] font-black text-stone-400 block px-2">
            GỢI Ý TÌM KIẾM NHANH:
          </span>
          {filtered.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(item)}
              className="w-full text-left p-3 rounded-2xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200 transition-all flex items-center justify-between text-xs group cursor-pointer"
            >
              <div>
                <span className="font-black text-amber-950 group-hover:text-orange-600 block font-['Quicksand']">
                  {item.title}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5 font-medium">
                  {item.type}
                </span>
              </div>
              <span className="text-orange-600 font-black opacity-0 group-hover:opacity-100 transition-opacity">
                Mở →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

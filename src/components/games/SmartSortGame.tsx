import React, { useState } from 'react';
import { GameQuestion } from '../../types/interactiveGame';
import { sounds, speakGirlPraise, speakGirlEncourage } from '../../utils/audioUtils';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Trophy,
  ArrowRight,
} from 'lucide-react';

interface SmartSortGameProps {
  questions: GameQuestion[];
  soundEnabled: boolean;
  onOpenQuestionManager: () => void;
}

interface SortItem {
  id: string;
  name: string;
  emoji: string;
  targetBasket: string;
  isPlaced: boolean;
}

interface Basket {
  id: string;
  title: string;
  emoji: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export const SmartSortGame: React.FC<SmartSortGameProps> = ({
  questions,
  soundEnabled,
  onOpenQuestionManager,
}) => {
  // Extract items and categories from questions
  const defaultBaskets: Basket[] = [
    {
      id: 'b1',
      title: 'Động Vật & Con Vật',
      emoji: '🐾',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-300',
      textClass: 'text-emerald-950',
    },
    {
      id: 'b2',
      title: 'Hoa Quả & Thực Vật',
      emoji: '🍎',
      bgClass: 'bg-rose-50',
      borderClass: 'border-rose-300',
      textClass: 'text-rose-950',
    },
    {
      id: 'b3',
      title: 'Phương Tiện & Khác',
      emoji: '🚗',
      bgClass: 'bg-sky-50',
      borderClass: 'border-sky-300',
      textClass: 'text-sky-950',
    },
  ];

  // Build items from active question list
  const buildInitialItems = (): SortItem[] => {
    return questions.slice(0, 9).map((q, idx) => {
      const bestOpt = q.options.find((o) => o.isCorrect) || q.options[0];
      let targetBasket = 'b1';
      if (q.category?.includes('quả') || q.category?.includes('thực') || q.sortBasket?.includes('quả')) {
        targetBasket = 'b2';
      } else if (
        q.category?.includes('giao thông') ||
        q.category?.includes('kỹ năng') ||
        q.sortBasket?.includes('giao thông')
      ) {
        targetBasket = 'b3';
      } else {
        // distribute across baskets if uncategorized
        targetBasket = idx % 3 === 0 ? 'b1' : idx % 3 === 1 ? 'b2' : 'b3';
      }

      return {
        id: `sort_${q.id}_${idx}`,
        name: bestOpt?.text || q.question.slice(0, 15),
        emoji: bestOpt?.emoji || '🌟',
        targetBasket,
        isPlaced: false,
      };
    });
  };

  const [items, setItems] = useState<SortItem[]>(buildInitialItems);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  // Touch item to select
  const handleSelectItem = (id: string) => {
    if (soundEnabled) sounds.playPop();
    setSelectedItemId(id);
  };

  // Touch basket to drop
  const handleSelectBasket = (basketId: string) => {
    if (!selectedItemId) return;

    const currentItem = items.find((i) => i.id === selectedItemId);
    if (!currentItem) return;

    if (currentItem.targetBasket === basketId) {
      if (soundEnabled) {
        sounds.playSuccess();
        speakGirlPraise();
      }
      setItems((prev) =>
        prev.map((item) => (item.id === selectedItemId ? { ...item, isPlaced: true } : item))
      );
      setScore((s) => s + 10);
      setSelectedItemId(null);
    } else {
      if (soundEnabled) {
        sounds.playRetry();
        speakGirlEncourage();
      }
    }
  };

  const handleReset = () => {
    if (soundEnabled) sounds.playPop();
    setItems((prev) => prev.map((i) => ({ ...i, isPlaced: false })));
    setSelectedItemId(null);
    setScore(0);
  };

  const remainingItems = items.filter((i) => !i.isPlaced);
  const isFinished = remainingItems.length === 0 && items.length > 0;

  return (
    <div className="space-y-6">
      {/* Game Header Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border-2 border-emerald-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
            🧺
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-['Quicksand']">
              Kéo Thả Phân Loại Thông Minh
            </h2>
            <p className="text-xs text-emerald-100 font-medium">
              Chạm vào hình ảnh ➔ chạm tiếp vào giỏ phù hợp để phân loại
            </p>
          </div>
        </div>

        {/* Score & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/30 text-xs font-black">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span>Điểm: {score}</span>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white cursor-pointer shadow-2xs"
            title="Chơi lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenQuestionManager}
            className="px-3.5 py-1.5 rounded-2xl bg-white text-emerald-900 text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Đổi Chủ Đề</span>
          </button>
        </div>
      </div>

      {/* Item Pool to Pick Up */}
      <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-emerald-950 uppercase tracking-wide">
            1. Các món đồ bé cần phân loại ({remainingItems.length} món còn lại):
          </span>
          {selectedItemId && (
            <span className="text-[11px] font-black text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200 animate-pulse">
              Đang chọn món! Chạm vào Giỏ bên dưới để thả 👇
            </span>
          )}
        </div>

        {isFinished ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-center space-y-2 animate-fadeIn">
            <div className="text-4xl">🎉 ⭐ 🏆</div>
            <h3 className="text-base font-black text-emerald-950 font-['Quicksand']">
              BÉ THÔNG MINH TUYỆT VỜI! ĐÃ PHÂN LOẠI XONG HẾT!
            </h3>
            <p className="text-xs text-emerald-800">
              Tất cả các món đồ đã được đặt vào đúng giỏ mục tiêu một cách xuất sắc!
            </p>
            <button
              onClick={handleReset}
              className="mt-2 px-5 py-2 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-md hover:scale-105 cursor-pointer"
            >
              Chơi Lại Vòng Khác
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-wrap min-h-[70px]">
            {items.map((item) => {
              if (item.isPlaced) return null;
              const isSelected = selectedItemId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 border-2 transition-all cursor-pointer select-none active:scale-95 ${
                    isSelected
                      ? 'bg-amber-400 border-amber-500 text-amber-950 scale-110 shadow-lg ring-4 ring-amber-200 animate-bounce'
                      : 'bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-200 text-stone-800 hover:scale-105 shadow-2xs'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="font-black">{item.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Target Baskets (Touch Target) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {defaultBaskets.map((basket) => {
          const placedInThis = items.filter((i) => i.isPlaced && i.targetBasket === basket.id);

          return (
            <div
              key={basket.id}
              onClick={() => handleSelectBasket(basket.id)}
              className={`p-5 rounded-3xl border-3 transition-all cursor-pointer flex flex-col items-center justify-between text-center select-none min-h-[220px] ${basket.bgClass} ${basket.borderClass} ${basket.textClass} hover:scale-[1.02] active:scale-98 shadow-md relative group`}
            >
              <div className="space-y-1">
                <span className="text-4xl block group-hover:scale-125 transition-transform duration-300">
                  {basket.emoji}
                </span>
                <h3 className="font-black text-sm sm:text-base font-['Quicksand']">{basket.title}</h3>
                <span className="text-[10px] font-bold opacity-75 block">
                  (Chạm vào đây để thả vào giỏ)
                </span>
              </div>

              {/* Already placed items in basket */}
              <div className="w-full mt-3 pt-3 border-t border-black/10 flex items-center justify-center gap-1.5 flex-wrap min-h-[50px]">
                {placedInThis.length === 0 ? (
                  <span className="text-[11px] opacity-50 italic">Giỏ đang trống</span>
                ) : (
                  placedInThis.map((p) => (
                    <span
                      key={p.id}
                      className="px-2.5 py-1 rounded-xl bg-white/90 border border-black/10 text-xs font-black shadow-xs flex items-center gap-1"
                    >
                      <span>{p.emoji}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

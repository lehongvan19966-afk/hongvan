import React from 'react';
import { X, Sparkles, Heart, Crown, Award } from 'lucide-react';
import { StickerItem } from '../types/englishBuddy';
import { PRESCHOOL_STICKERS } from '../data/stickersData';
import { sounds } from '../utils/audioUtils';

interface StickerBackpackModalProps {
  isOpen: boolean;
  onClose: () => void;
  kidName: string;
  kidAvatar: string;
  collectedStickers: StickerItem[];
  totalScore: number;
}

export const StickerBackpackModal: React.FC<StickerBackpackModalProps> = ({
  isOpen,
  onClose,
  kidName,
  kidAvatar,
  collectedStickers,
  totalScore,
}) => {
  if (!isOpen) return null;

  // Unique stickers collected
  const collectedIds = new Set(collectedStickers.map((s) => s.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fadeIn font-['Nunito',sans-serif]">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#FFFDF9] via-amber-50/70 to-orange-50/80 rounded-[38px] border-[5px] border-white shadow-[0_20px_50px_rgba(217,119,6,0.3)] p-5 sm:p-7 text-center overflow-hidden animate-scale-in max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-stone-400 hover:text-stone-700 flex items-center justify-center shadow-xs transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header */}
        <div className="space-y-1 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-orange-900 border border-orange-200 text-xs font-black font-bubbly shadow-2xs">
            <span className="text-base">🎒</span>
            <span>Bộ Sưu Tập Sticker Của Bé</span>
          </div>

          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-3xl">{kidAvatar}</span>
            <h3 className="text-xl sm:text-2xl font-black font-bubbly text-stone-900 tracking-tight">
              Ba Lô Của {kidName} ✨
            </h3>
          </div>

          <p className="text-xs text-stone-600 font-medium max-w-md mx-auto">
            Mỗi lần chơi trò chơi tiếng Anh, bé đều được tặng 1 sticker đáng yêu để dán vào bộ sưu tập!
          </p>
        </div>

        {/* Stats Summary Bar */}
        <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-2xs flex items-center justify-around mb-4">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase block">Đã sưu tầm</span>
            <span className="text-xl font-black font-bubbly text-orange-600">
              {collectedIds.size} / {PRESCHOOL_STICKERS.length}
            </span>
          </div>
          <div className="h-6 w-[1px] bg-amber-200" />
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase block">Tổng điểm tích lũy</span>
            <span className="text-xl font-black font-bubbly text-amber-600">
              {totalScore} ⭐
            </span>
          </div>
        </div>

        {/* Grid of All Available & Unlocked Stickers */}
        <div className="text-left mb-2">
          <span className="text-xs font-black font-bubbly text-stone-700">
            Album Sticker Mầm Non (Chạm vào sticker để xem):
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
          {PRESCHOOL_STICKERS.map((sticker) => {
            const isUnlocked = collectedIds.has(sticker.id);

            return (
              <div
                key={sticker.id}
                onClick={() => {
                  if (isUnlocked) sounds.playPop();
                }}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center relative select-none ${
                  isUnlocked
                    ? 'bg-white hover:bg-amber-50/70 border-amber-200/90 shadow-2xs hover:scale-102 cursor-pointer'
                    : 'bg-stone-50/60 border-stone-200/60 opacity-55 grayscale cursor-not-allowed'
                }`}
              >
                {/* Unlocked / Locked badge */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-50 to-orange-100 flex items-center justify-center text-2xl mb-1.5 shadow-xs">
                  {isUnlocked ? sticker.icon : '🔒'}
                </div>

                <span className="font-black font-bubbly text-xs text-stone-900 block leading-tight">
                  {sticker.name}
                </span>

                <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.2 rounded-full mt-1">
                  {sticker.title}
                </span>

                <p className="text-[10px] text-stone-400 mt-1 line-clamp-2 leading-tight">
                  {isUnlocked ? sticker.description : 'Chơi thêm để mở khóa'}
                </p>

                {isUnlocked && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                    ✓ Đã có
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-medium">
            💡 Cô giáo có thể in album này để dán sticker thật cho bé ở lớp!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black font-bubbly text-xs shadow-xs cursor-pointer transition-all"
          >
            Đóng ba lô
          </button>
        </div>
      </div>
    </div>
  );
};

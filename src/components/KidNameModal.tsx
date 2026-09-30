import React, { useState } from 'react';
import { X, Sparkles, User, Check, Heart } from 'lucide-react';
import { KID_AVATARS } from '../data/stickersData';
import { sounds } from '../utils/audioUtils';

interface KidNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentAvatar: string;
  onSave: (name: string, avatar: string) => void;
  isFirstTime?: boolean;
}

export const KidNameModal: React.FC<KidNameModalProps> = ({
  isOpen,
  onClose,
  currentName,
  currentAvatar,
  onSave,
  isFirstTime = false,
}) => {
  const [name, setName] = useState(currentName || '');
  const [avatar, setAvatar] = useState(currentAvatar || '👧');

  if (!isOpen) return null;

  const popularNames = ['Bé Bống', 'Bé Minh Khang', 'Bé Na', 'Bé Sam', 'Bé Tôm', 'Bé Bơ', 'Bé Sóc', 'Bé An'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Bé Yêu';
    sounds.playSuccess();
    onSave(finalName, avatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn font-['Nunito',sans-serif]">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#FFFDF9] via-amber-50/70 to-orange-50/80 rounded-[36px] border-[4px] border-white shadow-[0_20px_50px_rgba(217,119,6,0.25)] p-5 sm:p-7 text-center overflow-hidden animate-scale-in">
        {/* Close Button */}
        {!isFirstTime && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-stone-400 hover:text-stone-700 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Top Header */}
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-200 text-xs font-black font-bubbly shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-spin" />
            <span>English Buddy · Luyện Tập Vui</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-bubbly text-stone-900 tracking-tight">
            {isFirstTime ? 'Bé Tên Là Gì Nhỉ? ✨' : 'Đổi Tên Bé Luyện Tập 🎒'}
          </h3>
          <p className="text-xs text-stone-600 font-medium">
            Nhập tên bé để Mầm AI <strong className="text-orange-600">tính điểm</strong>, <strong className="text-amber-600">vinh danh</strong> và <strong className="text-rose-500">tặng sticker</strong> sau khi chơi nhé!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              1. Chọn hình đại diện của bé:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {KID_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setAvatar(av.emoji);
                  }}
                  className={`p-2 rounded-2xl border-2 transition-all flex flex-col items-center cursor-pointer ${
                    avatar === av.emoji
                      ? 'bg-amber-100 border-orange-500 ring-2 ring-orange-300 scale-105 shadow-xs'
                      : 'bg-white hover:bg-amber-50 border-amber-200/80 hover:scale-102'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl filter drop-shadow-xs">{av.emoji}</span>
                  <span className="text-[10px] font-bold text-stone-600 mt-0.5 line-clamp-1">
                    {av.label.split(' ')[1] || av.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="text-left">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              2. Nhập họ và tên / tên ở nhà của bé:
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Bé Bống, Bé Minh Khang..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-orange-300/80 focus:border-orange-500 text-sm font-black font-bubbly text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-orange-200 shadow-2xs"
                autoFocus
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl select-none">
                {avatar}
              </div>
            </div>
          </div>

          {/* Quick Name Suggestions for Preschool */}
          <div className="text-left">
            <span className="text-[11px] font-bold text-stone-500 block mb-1">
              Gợi ý tên nhanh cho cô giáo chọn:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularNames.map((pName) => (
                <button
                  key={pName}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setName(pName);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-orange-100 text-stone-700 hover:text-orange-900 border border-amber-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  {pName}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white font-black font-bubbly text-base tracking-wide shadow-lg shadow-orange-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-white"
            >
              <span>Vào Chơi & Tính Điểm Ngay 🚀</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

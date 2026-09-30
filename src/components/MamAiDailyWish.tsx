import React, { useState, useEffect } from 'react';
import { CuteSproutCharacter } from './CuteSproutCharacter';
import { Volume2, VolumeX, Sparkles, RefreshCw, Heart } from 'lucide-react';
import { sounds } from '../utils/audioUtils';

interface MamAiDailyWishProps {
  teacherName?: string;
  className?: string;
  autoSpeakOnMount?: boolean;
}

// Danh sách các lời chúc nhí nhảnh kiểu bé 5 tuổi nói giọng Bắc, xưng con gọi cô
const DAILY_WISHES_5YO = [
  'Hí hí, con chào cô Vân ạ! Con chúc cô hôm nay lên lớp thật là vui, lúc nào cũng cười tươi như hoa nhé cô ơi! Con yêu cô lắm í! 🌸',
  'A, cô Vân của con đến rồi nè! Con chúc cô một ngày mới rực rỡ, các bạn trong lớp ai cũng ngoan ngoãn vâng lời cô ạ! 🎈',
  'Dạ con chào cô ạ! Hôm nay trời đẹp thế này, con chúc cô luôn xinh đẹp như cô tiên và dạy chúng con nhiều trò vui nha! 🥰',
  'Cô Vân ơi, hôm nay con hứa sẽ ngồi thật ngoan, ăn hết bát cơm để được cô dán hoa bé ngoan ạ! Con chúc cô ngày mới ấm áp! ✨',
  'Hí hí, con chào cô! Cô có mang nhiều câu chuyện cổ tích hay cho chúng con không ạ? Con chúc cô dạy học lúc nào cũng tràn ngập niềm vui! 💖',
  'Con yêu cô Vân nhất trần đời luôn í! Con chúc cô một ngày thật là hạnh phúc, được các bé ôm thật chặt cô nha! 🌼',
];

export const MamAiDailyWish: React.FC<MamAiDailyWishProps> = ({
  teacherName = 'cô Vân',
  className = '',
}) => {
  // Chọn lời chúc theo ngày (hoặc ngẫu nhiên)
  const [wishIndex, setWishIndex] = useState(() => {
    const day = new Date().getDate();
    return day % DAILY_WISHES_5YO.length;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const currentWish = DAILY_WISHES_5YO[wishIndex];

  // Phát giọng đọc tiếng Việt nhí nhảnh 5 tuổi, ngữ điệu giọng Bắc
  const speakWish = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    sounds.playPop();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'vi-VN';
    // Cao độ pitch 1.6 để tạo chất giọng trẻ em 5 tuổi trong trẻo, nhí nhảnh
    utterance.pitch = 1.6;
    // Tốc độ rate 1.05 lanh lợi, hồn nhiên
    utterance.rate = 1.05;

    // Ưu tiên chọn giọng tiếng Việt sẵn có trong máy
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.includes('vi') || v.name.includes('Vietnamese') || v.lang.includes('VI'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setHasInteracted(true);
  };

  // Đổi sang lời chúc ngẫu nhiên tiếp theo
  const handleNextWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    setWishIndex((prev) => (prev + 1) % DAILY_WISHES_5YO.length);
  };

  return (
    <div
      className={`relative flex items-center justify-end gap-2.5 max-w-full select-none ${className}`}
    >
      {/* Bong bóng lời nói của Mầm AI 5 tuổi */}
      <div
        onClick={() => speakWish(currentWish)}
        className="relative bg-gradient-to-br from-amber-50 via-white to-orange-50/90 rounded-2xl p-3 sm:p-3.5 border-2 border-orange-200/90 shadow-[0_4px_16px_rgba(234,88,12,0.12)] hover:border-orange-400 transition-all cursor-pointer group max-w-xs sm:max-w-sm md:max-w-md"
      >
        {/* Mũi nhọn tam giác chỉ về phía nhân vật Mầm ở góc phải */}
        <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[8px] border-l-orange-200" />
        <div className="hidden sm:block absolute -right-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[7px] border-l-white" />

        {/* Header của lời chúc */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black font-bubbly text-orange-900 flex items-center gap-1">
              <span>Bé Mầm 5 tuổi gửi lời chúc</span>
              <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleNextWish}
              title="Đổi lời chúc khác"
              className="p-1 rounded-lg hover:bg-orange-100 text-stone-400 hover:text-orange-600 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                speakWish(currentWish);
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-bubbly transition-all flex items-center gap-1 ${
                isSpeaking
                  ? 'bg-orange-500 text-white animate-pulse'
                  : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
              }`}
            >
              <Volume2 className="w-3 h-3" />
              <span>{isSpeaking ? 'Đang nói...' : 'Nghe bé nói'}</span>
            </button>
          </div>
        </div>

        {/* Nội dung lời chúc ngọt ngào tiếng Việt giọng Bắc */}
        <p className="text-xs sm:text-[13px] font-semibold text-stone-800 leading-relaxed font-['Quicksand',sans-serif]">
          "{currentWish}"
        </p>

        {/* Gợi ý bấm nghe */}
        <div className="mt-1 flex items-center justify-between text-[10px] text-stone-400">
          <span>🔊 Nhấn vào để nghe bé nói</span>
          <span className="flex items-center gap-0.5 text-rose-500 font-bold">
            <Heart className="w-2.5 h-2.5 fill-rose-500" />
            <span>Yêu cô Vân</span>
          </span>
        </div>
      </div>

      {/* Nhân vật Mầm AI ở góc phải nhún nhảy vẫy chào */}
      <div
        onClick={() => speakWish(currentWish)}
        className="shrink-0 cursor-pointer transform hover:scale-110 active:scale-95 transition-transform"
        title="Nhấn vào Bé Mầm để nghe lời chúc!"
      >
        <div className="relative">
          <CuteSproutCharacter
            size="md"
            mood={isSpeaking ? 'dancing' : 'happy'}
            isDancing={true}
          />
          {isSpeaking && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold animate-bounce">
              Đang nói 🎵
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

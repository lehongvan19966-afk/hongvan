import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CuteSproutCharacter } from './CuteSproutCharacter';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Smile,
  Frown,
  CheckCircle2,
  X,
  Volume2,
} from 'lucide-react';
import { sounds } from '../utils/audioUtils';

export type UserEmotion = 'vui' | 'buon' | 'de-thuong';

interface PostLoginFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  onSelectEmotion?: (emotion: UserEmotion) => void;
}

export const PostLoginFlowModal: React.FC<PostLoginFlowModalProps> = ({
  isOpen,
  onClose,
  userName = 'Cô và bé',
  onSelectEmotion,
}) => {
  // Step 1: 'welcome' (Nhân vật mầm nhún nhảy + Thế giới AI- Khám phá mỗi ngày + Bắt đầu vào học)
  // Step 2: 'emotions' (Bảng cảm xúc: Vui - Buồn - Dễ thương)
  const [step, setStep] = useState<'welcome' | 'emotions'>('welcome');
  const [selectedEmotion, setSelectedEmotion] = useState<UserEmotion | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  if (!isOpen) return null;

  // Step 1 -> Step 2
  const handleStartLearning = () => {
    sounds.playPop();
    setStep('emotions');
  };

  // Step 2: Handle choosing emotion
  const handlePickEmotion = (emotion: UserEmotion) => {
    setSelectedEmotion(emotion);
    sounds.playSuccess();
    confetti({ particleCount: 80, spread: 85, origin: { y: 0.6 } });

    if (onSelectEmotion) {
      onSelectEmotion(emotion);
    }

    let msg = '';
    if (emotion === 'vui') {
      msg = '🎉 Tuyệt vời! Nụ cười rạng rỡ của bạn thắp sáng cả khu vườn Mầm AI!';
    } else if (emotion === 'buon') {
      msg = '💖 Mầm AI gửi bạn một cái ôm thật ấm áp! Hôm nay chắc chắn sẽ là một ngày tốt lành!';
    } else {
      msg = '🌸 Oa! Bạn hôm nay thật ngọt ngào và dễ thương! Cùng nhau khám phá nhé!';
    }
    setFeedbackMessage(msg);

    // After 1.4s smooth entry into main app
    setTimeout(() => {
      onClose();
      // Reset state for next login
      setTimeout(() => {
        setStep('welcome');
        setSelectedEmotion(null);
        setFeedbackMessage('');
      }, 300);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fadeIn font-['Nunito',sans-serif]">
      {/* Background magical glowing blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-400/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-lime-400/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Board Container */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] via-amber-50/70 to-orange-50/80 rounded-[36px] sm:rounded-[40px] border-[5px] border-white shadow-[0_20px_50px_rgba(124,45,18,0.3)] p-6 sm:p-8 text-center overflow-hidden animate-scale-in">
        {/* Soft decorative close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-stone-400 hover:text-stone-700 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          title="Đóng bảng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ========================================================= */}
        {/* STEP 1: BẢNG RIÊNG CHÀO MỪNG VỚI MẦM CUTE NHÚN NHẢY       */}
        {/* ========================================================= */}
        {step === 'welcome' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-orange-900 border border-orange-200 text-xs font-black font-bubbly shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-spin" />
              <span>Chào mừng {userName} đã đăng nhập!</span>
            </div>

            {/* Cute Sprout Character with eyes, nose, mouth, dancing */}
            <div className="py-2 flex justify-center transform hover:scale-105 transition-transform">
              <CuteSproutCharacter size="xl" mood="dancing" isDancing={true} />
            </div>

            {/* Headline as requested: "Thế giới AI- Khám phá mỗi ngày" */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-bubbly text-stone-900 tracking-tight leading-tight">
                Thế giới AI - Khám phá mỗi ngày
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-semibold max-w-sm mx-auto leading-relaxed">
                Nơi cô giáo và các bé mầm non cùng trải nghiệm những điều kỳ diệu từ công nghệ trí tuệ nhân tạo!
              </p>
            </div>

            {/* Action button as requested: "bắt đầu vào học" */}
            <div className="pt-2">
              <button
                onClick={handleStartLearning}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white font-bubbly font-black text-base sm:text-lg tracking-wide shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer border-2 border-white"
              >
                <span>Bắt đầu vào học</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>
              <p className="text-[11px] text-stone-400 mt-2 font-medium">
                Bấm vào để chọn cảm xúc hôm nay và vào lớp học
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: BẢNG CẢM XÚC (Vui - Buồn - Dễ thương)             */}
        {/* ========================================================= */}
        {step === 'emotions' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Header of Emotion board */}
            <div>
              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black font-bubbly mb-1.5 shadow-2xs">
                <span>🌸 Cùng chia sẻ cảm xúc</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-bubbly text-stone-900 tracking-tight">
                Hôm Nay Bạn Cảm Thấy Thế Nào?
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
                Hãy chọn 1 cảm xúc để Mầm AI cùng đồng hành với bạn nhé!
              </p>
            </div>

            {/* 3 Emotion Cards: Vui - Buồn - Dễ thương */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 pt-1">
              {/* 1. VUI */}
              <button
                onClick={() => handlePickEmotion('vui')}
                className={`p-3 sm:p-4 rounded-3xl border-3 text-center transition-all duration-300 flex flex-col items-center justify-between cursor-pointer group hover:-translate-y-1.5 hover:shadow-lg active:scale-95 ${
                  selectedEmotion === 'vui'
                    ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 scale-105 shadow-md'
                    : 'bg-gradient-to-b from-[#FFFBEB] to-amber-50 border-amber-200/90 hover:border-amber-400'
                }`}
              >
                <div className="w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <CuteSproutCharacter size="sm" mood="vui" isDancing={true} />
                </div>
                <div className="mt-2 w-full">
                  <span className="block font-bubbly font-black text-base sm:text-lg text-amber-950">
                    Vui
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-amber-800 font-bold mt-0.5">
                    Hớn hở & tươi vui 😄
                  </span>
                </div>
              </button>

              {/* 2. BUỒN */}
              <button
                onClick={() => handlePickEmotion('buon')}
                className={`p-3 sm:p-4 rounded-3xl border-3 text-center transition-all duration-300 flex flex-col items-center justify-between cursor-pointer group hover:-translate-y-1.5 hover:shadow-lg active:scale-95 ${
                  selectedEmotion === 'buon'
                    ? 'bg-sky-100 border-sky-500 ring-4 ring-sky-300 scale-105 shadow-md'
                    : 'bg-gradient-to-b from-[#F0F9FF] to-sky-50 border-sky-200/90 hover:border-sky-400'
                }`}
              >
                <div className="w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <CuteSproutCharacter size="sm" mood="buon" isDancing={false} />
                </div>
                <div className="mt-2 w-full">
                  <span className="block font-bubbly font-black text-base sm:text-lg text-sky-950">
                    Buồn
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-sky-800 font-bold mt-0.5">
                    Cần ôm vỗ về 🥺
                  </span>
                </div>
              </button>

              {/* 3. DỄ THƯƠNG */}
              <button
                onClick={() => handlePickEmotion('de-thuong')}
                className={`p-3 sm:p-4 rounded-3xl border-3 text-center transition-all duration-300 flex flex-col items-center justify-between cursor-pointer group hover:-translate-y-1.5 hover:shadow-lg active:scale-95 ${
                  selectedEmotion === 'de-thuong'
                    ? 'bg-rose-100 border-rose-500 ring-4 ring-rose-300 scale-105 shadow-md'
                    : 'bg-gradient-to-b from-[#FFF1F2] to-pink-50 border-rose-200/90 hover:border-rose-400'
                }`}
              >
                <div className="w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <CuteSproutCharacter size="sm" mood="de-thuong" isDancing={true} />
                </div>
                <div className="mt-2 w-full">
                  <span className="block font-bubbly font-black text-base sm:text-lg text-rose-950">
                    Dễ thương
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-rose-800 font-bold mt-0.5">
                    Đáng yêu & nơ xinh 🥰
                  </span>
                </div>
              </button>
            </div>

            {/* Feedback message banner after selection */}
            {feedbackMessage ? (
              <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-300 shadow-sm animate-bounce-gentle">
                <p className="text-xs sm:text-sm font-bubbly font-black text-emerald-900 leading-snug">
                  {feedbackMessage}
                </p>
                <p className="text-[10px] text-stone-400 mt-1">Đang vào giao diện chính...</p>
              </div>
            ) : (
              <p className="text-[11px] text-stone-500 pt-1 font-medium">
                👉 Nhấn chọn 1 cảm xúc để hoàn tất và vào giao diện chính của app
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

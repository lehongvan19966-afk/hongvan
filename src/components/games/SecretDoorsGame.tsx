import React, { useState, useEffect } from 'react';
import { GameQuestion } from '../../types/interactiveGame';
import {
  sounds,
  speakText,
  speakGirlPraise,
  speakGirlEncourage,
} from '../../utils/audioUtils';
import {
  Sparkles,
  Trophy,
  Volume2,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Key,
} from 'lucide-react';

interface SecretDoorsGameProps {
  questions: GameQuestion[];
  soundEnabled: boolean;
  onOpenQuestionManager: () => void;
}

const DOOR_THEMES = [
  {
    name: 'Cửa Hoàng Gia Vàng',
    icon: '👑',
    doorGrad: 'from-amber-600 via-yellow-500 to-amber-700',
    doorBorder: 'border-yellow-300',
    glowColor: 'shadow-[0_0_25px_rgba(234,179,8,0.4)]',
  },
  {
    name: 'Cửa Rừng Xanh Thần Tiên',
    icon: '🌳',
    doorGrad: 'from-emerald-700 via-teal-600 to-emerald-800',
    doorBorder: 'border-emerald-300',
    glowColor: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]',
  },
  {
    name: 'Cửa Cầu Vồng Kẹo Ngọt',
    icon: '🍭',
    doorGrad: 'from-rose-600 via-pink-500 to-purple-700',
    doorBorder: 'border-pink-300',
    glowColor: 'shadow-[0_0_25px_rgba(244,63,94,0.4)]',
  },
];

export const SecretDoorsGame: React.FC<SecretDoorsGameProps> = ({
  questions,
  soundEnabled,
  onOpenQuestionManager,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [openedDoorId, setOpenedDoorId] = useState<string | null>(null);
  const [knockedDoorId, setKnockedDoorId] = useState<string | null>(null);

  const currentQ = questions[currentIndex % questions.length];

  useEffect(() => {
    setOpenedDoorId(null);
    setKnockedDoorId(null);
    if (currentQ) {
      speakText(`Cốc cốc cốc! Đố bạn biết: ${currentQ.question}`, 1.05, 'vi-VN');
    }
  }, [currentIndex, currentQ]);

  // Touch door to knock or open
  const handleTouchDoor = (optId: string, isCorrect: boolean) => {
    if (openedDoorId !== null) return; // already opened

    if (soundEnabled) sounds.playKnockDoor();
    setKnockedDoorId(optId);

    // Open door after knocking
    setTimeout(() => {
      setOpenedDoorId(optId);

      if (isCorrect) {
        if (soundEnabled) {
          sounds.playTada();
          speakGirlPraise();
        }
        setScore((s) => s + 10);
      } else {
        if (soundEnabled) {
          sounds.playRetry();
          speakGirlEncourage();
        }
      }
    }, 400);
  };

  const handleNext = () => {
    if (soundEnabled) sounds.playPop();
    setCurrentIndex((i) => (i + 1) % questions.length);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border-2 border-purple-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
            🚪
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-['Quicksand']">
              Ô Cửa Bí Mật Cổ Tích (Magic Secret Doors)
            </h2>
            <p className="text-xs text-purple-100 font-medium">
              Chạm tay gõ cửa cốc cốc cốc, khám phá nhân vật và đáp án bí mật sau cánh cửa
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
            onClick={() => {
              if (soundEnabled) sounds.playPop();
              setCurrentIndex(0);
              setScore(0);
            }}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white cursor-pointer shadow-2xs"
            title="Bắt đầu lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenQuestionManager}
            className="px-3.5 py-1.5 rounded-2xl bg-white text-purple-950 text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Đổi Câu Hỏi</span>
          </button>
        </div>
      </div>

      {/* Main Stage */}
      <div className="bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 rounded-3xl p-5 sm:p-7 border-3 border-purple-400 shadow-xl space-y-6 select-none relative overflow-hidden text-white">
        {/* Sky fairy sparkles */}
        <div className="absolute top-4 left-6 text-2xl opacity-60 animate-pulse">✨</div>
        <div className="absolute top-8 right-10 text-2xl opacity-60 animate-pulse">🌟</div>

        {/* Question Header Card */}
        <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shadow-lg flex items-center justify-between gap-4 max-w-2xl mx-auto w-full">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-yellow-400 text-amber-950">
                Ô Cửa Số {currentIndex + 1}/{questions.length}
              </span>
              <span className="text-xs text-purple-200 font-bold">
                Bé gõ cửa và tìm đáp án đúng nha:
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-black text-white font-['Quicksand'] leading-snug">
              {currentQ.question}
            </h3>
          </div>

          <button
            onClick={() => speakText(currentQ.question, 1.05, 'vi-VN')}
            className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 text-yellow-300 cursor-pointer shadow-xs shrink-0"
            title="Nghe lại câu hỏi"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* 3 Secret Doors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto py-2">
          {currentQ.options.map((opt, idx) => {
            const isOpened = openedDoorId === opt.id;
            const isKnocked = knockedDoorId === opt.id;
            const theme = DOOR_THEMES[idx % DOOR_THEMES.length];

            return (
              <div key={opt.id} className="flex flex-col items-center">
                {/* Arch Top Frame */}
                <div className="w-full max-w-[210px] bg-stone-900/60 p-2 rounded-t-[50px] border-4 border-b-0 border-amber-300/60 shadow-xl flex flex-col items-center">
                  <span className="text-xl mb-1">{theme.icon}</span>

                  {/* The Door itself */}
                  <button
                    onClick={() => handleTouchDoor(opt.id, opt.isCorrect)}
                    disabled={openedDoorId !== null}
                    className={`w-full min-h-[220px] sm:min-h-[240px] rounded-t-[40px] rounded-b-xl border-3 p-3 flex flex-col items-center justify-between text-center transition-all cursor-pointer select-none active:scale-95 relative overflow-hidden ${
                      theme.doorBorder
                    } ${
                      isOpened
                        ? opt.isCorrect
                          ? 'bg-gradient-to-b from-emerald-500 to-teal-700 ring-4 ring-yellow-300 scale-103'
                          : 'bg-gradient-to-b from-stone-700 to-stone-800 opacity-60'
                        : `bg-gradient-to-b ${theme.doorGrad} ${theme.glowColor} hover:scale-103`
                    }`}
                  >
                    {!isOpened ? (
                      /* Closed Door with Knocker */
                      <>
                        <div className="w-full pt-3 flex flex-col items-center space-y-2">
                          {/* Wooden door panels */}
                          <div className="w-16 h-12 rounded-lg border-2 border-white/30 bg-black/20" />
                          {/* Brass Door Knocker */}
                          <div
                            className={`w-10 h-10 rounded-full border-4 border-yellow-300 bg-yellow-500 shadow-md flex items-center justify-center ${
                              isKnocked ? 'animate-ping' : 'animate-bounce'
                            }`}
                          >
                            <div className="w-3 h-3 rounded-full bg-yellow-200" />
                          </div>
                        </div>

                        <div className="pb-3 space-y-1">
                          <span className="text-xs font-black uppercase text-yellow-200 block drop-shadow-xs">
                            Cửa {idx + 1}
                          </span>
                          <span className="text-[10px] text-white/80 block font-bold">
                            Chạm gõ cửa
                          </span>
                        </div>
                      </>
                    ) : (
                      /* Opened Door revealing the Secret Content! */
                      <div className="w-full h-full flex flex-col items-center justify-center space-y-2 animate-fadeIn py-2">
                        <span className="text-5xl block animate-bounce filter drop-shadow-md">
                          {opt.emoji}
                        </span>
                        <span className="text-sm sm:text-base font-black text-white leading-tight block">
                          {opt.text}
                        </span>
                        {opt.isCorrect && (
                          <span className="px-2.5 py-0.5 rounded-full bg-yellow-300 text-amber-950 font-black text-[10px] shadow-sm">
                            ⭐ CHÍNH XÁC!
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                </div>

                {/* Door Step Threshold */}
                <div className="w-full max-w-[230px] h-3 bg-amber-400 rounded-b-md shadow-md" />
              </div>
            );
          })}
        </div>

        {/* Feedback Banner */}
        {openedDoorId !== null && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
              <CheckCircle2 className="w-5 h-5 text-yellow-300 shrink-0" />
              <span>{currentQ.explanation}</span>
            </div>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 font-black text-xs shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Mở Ô Cửa Kế Tiếp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

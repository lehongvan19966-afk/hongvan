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
  Crosshair,
} from 'lucide-react';

interface TargetThrowGameProps {
  questions: GameQuestion[];
  soundEnabled: boolean;
  onOpenQuestionManager: () => void;
}

export const TargetThrowGame: React.FC<TargetThrowGameProps> = ({
  questions,
  soundEnabled,
  onOpenQuestionManager,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hitTargetId, setHitTargetId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const currentQ = questions[currentIndex % questions.length];

  useEffect(() => {
    setHitTargetId(null);
    setHasAnswered(false);
    if (currentQ) {
      speakText(`Bé hãy ném bóng trúng đích nha! ${currentQ.question}`, 1.05, 'vi-VN');
    }
  }, [currentIndex, currentQ]);

  // Touch target to throw ball!
  const handleThrowAtTarget = (optId: string, isCorrect: boolean) => {
    if (hasAnswered) return;
    setHitTargetId(optId);
    setHasAnswered(true);

    if (soundEnabled) sounds.playBubblePop();

    setTimeout(() => {
      if (isCorrect) {
        if (soundEnabled) {
          sounds.playSuccess();
          speakGirlPraise();
        }
        setScore((s) => s + 10);
      } else {
        if (soundEnabled) {
          sounds.playRetry();
          speakGirlEncourage();
        }
      }
    }, 200);
  };

  const handleNext = () => {
    if (soundEnabled) sounds.playPop();
    setCurrentIndex((i) => (i + 1) % questions.length);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-600 to-cyan-600 rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border-2 border-teal-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
            🎯
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-['Quicksand']">
              Ném Bóng Trúng Đích (Magic Target Throw)
            </h2>
            <p className="text-xs text-teal-100 font-medium">
              Chạm tay vào tấm bia hồng tâm chứa câu trả lời đúng để ném bóng trúng đích
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
            className="px-3.5 py-1.5 rounded-2xl bg-white text-teal-950 text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Đổi Câu Hỏi</span>
          </button>
        </div>
      </div>

      {/* Main Target Field */}
      <div className="bg-gradient-to-b from-sky-200 via-teal-100 to-emerald-100 rounded-3xl p-5 sm:p-7 border-3 border-teal-300 shadow-md space-y-6 select-none relative overflow-hidden">
        {/* Question Header Card */}
        <div className="bg-white/95 p-4 sm:p-5 rounded-2xl border-2 border-teal-300 shadow-sm flex items-center justify-between gap-4 max-w-2xl mx-auto w-full">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                Bia Ngắm {currentIndex + 1}/{questions.length}
              </span>
              <span className="text-xs text-stone-500 font-bold">
                Bé ngắm ném bóng vào bia đúng nha:
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-black text-teal-950 font-['Quicksand'] leading-snug">
              {currentQ.question}
            </h3>
          </div>

          <button
            onClick={() => speakText(currentQ.question, 1.05, 'vi-VN')}
            className="p-3 rounded-2xl bg-teal-100 hover:bg-teal-200 text-teal-700 cursor-pointer shadow-2xs shrink-0"
            title="Nghe lại câu hỏi"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* 3 Circular Targets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto py-4">
          {currentQ.options.map((opt, idx) => {
            const isHit = hitTargetId === opt.id;

            return (
              <div key={opt.id} className="flex flex-col items-center">
                {/* Target Board Button */}
                <button
                  onClick={() => handleThrowAtTarget(opt.id, opt.isCorrect)}
                  disabled={hasAnswered}
                  className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full border-6 shadow-xl flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer select-none active:scale-90 relative ${
                    isHit
                      ? opt.isCorrect
                        ? 'bg-emerald-500 border-yellow-300 text-white scale-110 shadow-2xl ring-6 ring-emerald-300 animate-pulse'
                        : 'bg-rose-500 border-stone-800 text-white opacity-80'
                      : 'bg-white hover:bg-teal-50 border-rose-500 text-stone-800 hover:scale-108'
                  }`}
                >
                  {/* Concentric rings on target */}
                  <div className="absolute inset-2 rounded-full border-2 border-dashed border-rose-300 pointer-events-none" />
                  <div className="absolute inset-6 rounded-full border-2 border-rose-400 pointer-events-none" />

                  {/* Bullseye Center */}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-4xl sm:text-5xl block mb-1 filter drop-shadow-sm">
                      {opt.emoji}
                    </span>
                    <span className="text-xs sm:text-sm font-black leading-tight block">
                      {opt.text}
                    </span>
                  </div>

                  {/* Ball Splat upon hitting */}
                  {isHit && (
                    <div className="absolute inset-0 flex items-center justify-center animate-ping pointer-events-none">
                      <span className="text-4xl">💥 🔴</span>
                    </div>
                  )}
                </button>

                {/* Target Post / Hanging string */}
                <div className="w-3 h-10 bg-amber-800/60 rounded-b-md -mt-1 shadow-sm" />
              </div>
            );
          })}
        </div>

        {/* Feedback Banner */}
        {hasAnswered && (
          <div className="bg-white/95 rounded-2xl p-4 border-2 border-teal-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{currentQ.explanation}</span>
            </div>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-black text-xs shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Tấm Bia Tiếp Theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

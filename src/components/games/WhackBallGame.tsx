import React, { useState, useEffect } from 'react';
import { GameQuestion } from '../../types/interactiveGame';
import { sounds, speakText, speakGirlPraise, speakGirlEncourage } from '../../utils/audioUtils';
import {
  Sparkles,
  Trophy,
  Volume2,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface WhackBallGameProps {
  questions: GameQuestion[];
  soundEnabled: boolean;
  onOpenQuestionManager: () => void;
}

const BALL_COLORS = [
  'bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 text-white border-rose-300',
  'bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-400 text-amber-950 border-amber-200',
  'bg-gradient-to-tr from-sky-400 via-blue-500 to-cyan-400 text-white border-sky-200',
  'bg-gradient-to-tr from-emerald-400 via-teal-500 to-green-400 text-white border-emerald-200',
];

export const WhackBallGame: React.FC<WhackBallGameProps> = ({
  questions,
  soundEnabled,
  onOpenQuestionManager,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [whackedId, setWhackedId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const currentQ = questions[currentIndex % questions.length];

  useEffect(() => {
    setWhackedId(null);
    setHasAnswered(false);
    if (currentQ) {
      speakText(`Đố bạn biết nè: ${currentQ.question}`, 1.06, 'vi-VN');
    }
  }, [currentIndex, currentQ]);

  // Touch ball to whack!
  const handleWhack = (optId: string, isCorrect: boolean) => {
    if (hasAnswered) return;
    setWhackedId(optId);
    setHasAnswered(true);

    if (soundEnabled) sounds.playWhack();

    if (isCorrect) {
      if (soundEnabled) {
        setTimeout(() => sounds.playSuccess(), 120);
        speakGirlPraise();
      }
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
    } else {
      if (soundEnabled) {
        setTimeout(() => sounds.playRetry(), 120);
        speakGirlEncourage();
      }
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (soundEnabled) sounds.playPop();
    setCurrentIndex((i) => (i + 1) % questions.length);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-500 rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border-2 border-amber-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
            🔨
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-['Quicksand']">
              Đập Bóng Thần Tốc (Whack-a-Ball Cảm Ứng)
            </h2>
            <p className="text-xs text-amber-100 font-medium">
              Chạm tay thật nhanh vào quả bóng chứa đáp án đúng để đập nổ sao lấp lánh
            </p>
          </div>
        </div>

        {/* Score & Controls */}
        <div className="flex items-center gap-2">
          {streak > 1 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-2xl bg-yellow-300 text-yellow-950 font-black text-xs shadow-xs animate-bounce">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>Chuỗi {streak}🔥</span>
            </div>
          )}
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
            className="px-3.5 py-1.5 rounded-2xl bg-white text-orange-950 text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>AI Đổi Câu Hỏi</span>
          </button>
        </div>
      </div>

      {/* Main Arena */}
      <div className="bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200/60 rounded-3xl p-5 sm:p-7 border-3 border-amber-300 shadow-md space-y-6 select-none relative overflow-hidden">
        {/* Question Header Card */}
        <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border-2 border-orange-200 shadow-sm flex items-center justify-between gap-4 max-w-2xl mx-auto w-full">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-orange-100 text-orange-800">
                Câu {currentIndex + 1}/{questions.length}
              </span>
              <span className="text-xs text-stone-500 font-bold">
                Bé dùng tay đập bóng đúng nha:
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-black text-amber-950 font-['Quicksand'] leading-snug">
              {currentQ.question}
            </h3>
          </div>

          <button
            onClick={() => speakText(currentQ.question, 1.05, 'vi-VN')}
            className="p-3 rounded-2xl bg-orange-100 hover:bg-orange-200 text-orange-700 cursor-pointer shadow-2xs shrink-0"
            title="Bé nghe lại câu hỏi"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* 3 to 4 Whack Pads & Bouncing Balls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-3xl mx-auto py-2">
          {currentQ.options.map((opt, idx) => {
            const isWhacked = whackedId === opt.id;
            const colorClass = BALL_COLORS[idx % BALL_COLORS.length];

            return (
              <div key={opt.id} className="flex flex-col items-center justify-center">
                {/* Pad Platform */}
                <div className="relative w-full max-w-[220px] flex flex-col items-center">
                  {/* Bouncing Ball Button */}
                  <button
                    onClick={() => handleWhack(opt.id, opt.isCorrect)}
                    disabled={hasAnswered}
                    className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 shadow-xl flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer select-none active:scale-90 ${colorClass} ${
                      isWhacked
                        ? opt.isCorrect
                          ? 'ring-8 ring-emerald-400 scale-105 animate-pulse'
                          : 'ring-8 ring-rose-400 opacity-60'
                        : 'hover:scale-108 animate-bounce duration-1000'
                    }`}
                    style={{
                      animationDuration: `${1400 + idx * 250}ms`,
                    }}
                  >
                    {/* Highlight gloss */}
                    <div className="w-8 h-4 rounded-full bg-white/60 -rotate-30 mb-1" />

                    <span className="text-4xl sm:text-5xl block filter drop-shadow-sm">
                      {opt.emoji}
                    </span>
                    <span className="text-xs sm:text-sm font-black leading-tight block mt-1 drop-shadow-xs">
                      {opt.text}
                    </span>

                    {/* Whack impact banner */}
                    {isWhacked && (
                      <span className="absolute -top-3 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-md border border-white animate-ping">
                        💥 ĐẬP TRÚNG!
                      </span>
                    )}
                  </button>

                  {/* Hole / Pedestal */}
                  <div className="w-28 sm:w-36 h-6 rounded-[50%] bg-stone-800/30 border border-stone-800/40 -mt-2 shadow-inner" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback Banner */}
        {hasAnswered && (
          <div className="bg-white/95 rounded-2xl p-4 border-2 border-orange-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{currentQ.explanation}</span>
            </div>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Vòng Đập Tiếp Theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

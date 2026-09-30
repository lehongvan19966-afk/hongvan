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
  ArrowLeft,
} from 'lucide-react';

interface ClawMachineGameProps {
  questions: GameQuestion[];
  soundEnabled: boolean;
  onOpenQuestionManager: () => void;
}

export const ClawMachineGame: React.FC<ClawMachineGameProps> = ({
  questions,
  soundEnabled,
  onOpenQuestionManager,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [clawPosition, setClawPosition] = useState(50); // 20% to 80%
  const [isDropping, setIsDropping] = useState(false);
  const [grabbedOptionId, setGrabbedOptionId] = useState<string | null>(null);
  const [hasFinished, setHasFinished] = useState(false);

  const currentQ = questions[currentIndex % questions.length];

  useEffect(() => {
    setIsDropping(false);
    setGrabbedOptionId(null);
    setHasFinished(false);
    setClawPosition(50);
    if (currentQ) {
      speakText(`Cùng gắp thú bông nào! ${currentQ.question}`, 1.05, 'vi-VN');
    }
  }, [currentIndex, currentQ]);

  // Touch arrows to move claw
  const moveLeft = () => {
    if (isDropping || hasFinished) return;
    if (soundEnabled) sounds.playPop();
    setClawPosition((p) => Math.max(20, p - 30));
  };

  const moveRight = () => {
    if (isDropping || hasFinished) return;
    if (soundEnabled) sounds.playPop();
    setClawPosition((p) => Math.min(80, p + 30));
  };

  // Direct touch on plushie or press Grab Button
  const handleGrabPlushie = (targetIdx?: number) => {
    if (isDropping || hasFinished) return;

    if (soundEnabled) sounds.playClaw();
    setIsDropping(true);

    let chosenIdx = 1;
    if (typeof targetIdx === 'number') {
      chosenIdx = targetIdx;
      setClawPosition(chosenIdx === 0 ? 20 : chosenIdx === 1 ? 50 : 80);
    } else {
      chosenIdx = clawPosition <= 35 ? 0 : clawPosition >= 65 ? 2 : 1;
    }

    const chosenOpt = currentQ.options[chosenIdx] || currentQ.options[0];

    // Crane drops and retrieves prize
    setTimeout(() => {
      setGrabbedOptionId(chosenOpt.id);
      setIsDropping(false);
      setHasFinished(true);

      if (chosenOpt.isCorrect) {
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
    }, 1200);
  };

  const handleNext = () => {
    if (soundEnabled) sounds.playPop();
    setCurrentIndex((i) => (i + 1) % questions.length);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border-2 border-pink-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
            🧸
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-['Quicksand']">
              Gắp Thú Bông Tri Thức (Arcade Claw Machine)
            </h2>
            <p className="text-xs text-pink-100 font-medium">
              Chạm nút điều khiển cần cẩu gắp chú gấu bông chứa câu trả lời đúng
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
            className="px-3.5 py-1.5 rounded-2xl bg-white text-pink-950 text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>AI Đổi Câu Hỏi</span>
          </button>
        </div>
      </div>

      {/* Main Claw Machine Cabinet */}
      <div className="bg-gradient-to-b from-pink-200 via-rose-100 to-pink-300 rounded-[36px] p-5 sm:p-7 border-4 border-pink-400 shadow-2xl max-w-3xl mx-auto space-y-4 select-none">
        {/* Machine Marquee Header with Lights */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-3 rounded-2xl flex items-center justify-between shadow-md border-2 border-yellow-300">
          <div className="flex items-center gap-1.5 text-yellow-300 animate-pulse text-sm">
            <span>💡</span>
            <span>💡</span>
            <span>💡</span>
          </div>
          <h3 className="text-sm sm:text-base font-black tracking-wider uppercase drop-shadow-xs font-['Quicksand']">
            ★ MÁY GẮP THÚ BÔNG MẦM NON ★
          </h3>
          <div className="flex items-center gap-1.5 text-yellow-300 animate-pulse text-sm">
            <span>💡</span>
            <span>💡</span>
            <span>💡</span>
          </div>
        </div>

        {/* Question Bubble */}
        <div className="bg-white/95 p-4 rounded-2xl border-2 border-pink-300 shadow-sm flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase text-pink-700 bg-pink-100 px-2 py-0.5 rounded-md">
              Câu đố gắp thú:
            </span>
            <p className="text-sm sm:text-base font-black text-pink-950 font-['Quicksand']">
              {currentQ.question}
            </p>
          </div>
          <button
            onClick={() => speakText(currentQ.question, 1.05, 'vi-VN')}
            className="p-2.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 cursor-pointer shadow-xs shrink-0"
            title="Nghe lại câu hỏi"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Transparent Glass Showcase */}
        <div className="relative overflow-hidden bg-gradient-to-b from-sky-100/90 to-blue-50/90 rounded-3xl border-4 border-white/90 p-4 min-h-[300px] shadow-inner flex flex-col justify-between">
          {/* Glass Specular Glare */}
          <div className="absolute -top-10 -left-10 w-48 h-96 bg-white/30 rotate-25 pointer-events-none blur-xs" />

          {/* Crane Mechanism at Top */}
          <div className="relative w-full h-16">
            {/* Top sliding rail */}
            <div className="w-full h-3 bg-stone-700 rounded-full shadow-inner" />

            {/* The Claw */}
            <div
              className="absolute top-1 transition-all duration-500 flex flex-col items-center"
              style={{ left: `${clawPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-8 h-4 bg-yellow-400 rounded-t-md border-2 border-stone-800 shadow-sm" />
              {/* String / Rod */}
              <div
                className={`w-1.5 bg-stone-600 transition-all duration-700 ${
                  isDropping ? 'h-36' : 'h-10'
                }`}
              />
              {/* Metal Claw Prongs */}
              <div className="text-2xl -mt-1 filter drop-shadow-sm animate-pulse">
                🪝
              </div>
            </div>
          </div>

          {/* Plushies Floor (Touch Targets) */}
          <div className="relative z-10 flex items-center justify-around gap-2 pt-6">
            {currentQ.options.map((opt, idx) => {
              const isGrabbed = grabbedOptionId === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleGrabPlushie(idx)}
                  disabled={hasFinished}
                  className={`w-28 sm:w-36 p-3 rounded-3xl border-3 flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none active:scale-90 ${
                    isGrabbed
                      ? opt.isCorrect
                        ? 'bg-emerald-400 border-white text-emerald-950 scale-110 shadow-2xl ring-4 ring-yellow-300 animate-bounce'
                        : 'bg-rose-400 border-white text-rose-950 opacity-80'
                      : 'bg-white hover:bg-pink-50 border-pink-300 text-stone-800 hover:scale-108 shadow-md'
                  }`}
                >
                  <span className="text-4xl sm:text-5xl block mb-1 filter drop-shadow-xs">
                    {opt.emoji}
                  </span>
                  <span className="text-xs sm:text-sm font-black leading-tight block">
                    {opt.text}
                  </span>
                  <span className="text-[10px] text-pink-600 font-extrabold mt-1">
                    Chạm để gắp
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Arcade Physical Controls (Nút bấm cảm ứng) */}
        <div className="bg-pink-900/80 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
          {/* Directional Touch Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={moveLeft}
              disabled={isDropping || hasFinished}
              className="p-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-sm cursor-pointer active:scale-90 border-2 border-white/40 shadow-sm"
              title="Di chuyển sang trái"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={moveRight}
              disabled={isDropping || hasFinished}
              className="p-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-sm cursor-pointer active:scale-90 border-2 border-white/40 shadow-sm"
              title="Di chuyển sang phải"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Big Red Grab Button */}
          <button
            onClick={() => handleGrabPlushie()}
            disabled={isDropping || hasFinished}
            className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white font-black text-xs sm:text-sm shadow-xl border-2 border-white cursor-pointer active:scale-95 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="text-lg">🕹️</span>
            <span>{isDropping ? 'ĐANG GẮP...' : 'GẮP NGAY!'}</span>
          </button>
        </div>

        {/* Feedback Banner */}
        {hasFinished && (
          <div className="bg-white/95 rounded-2xl p-4 border-2 border-pink-400 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{currentQ.explanation}</span>
            </div>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Vòng Gắp Tiếp Theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

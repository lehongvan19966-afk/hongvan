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
} from 'lucide-react';

interface KnowledgeTrainGameProps {
  questions: GameQuestion[];
  soundEnabled: boolean;
  onOpenQuestionManager: () => void;
}

export const KnowledgeTrainGame: React.FC<KnowledgeTrainGameProps> = ({
  questions,
  soundEnabled,
  onOpenQuestionManager,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [connectedOptionId, setConnectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const currentQ = questions[currentIndex % questions.length];

  useEffect(() => {
    setConnectedOptionId(null);
    setHasAnswered(false);
    if (currentQ) {
      speakText(`Tu tu xình xịch! Bé hãy nối toa tàu đúng nhé: ${currentQ.question}`, 1.05, 'vi-VN');
    }
  }, [currentIndex, currentQ]);

  // Touch wagon to connect
  const handleConnectWagon = (optId: string, isCorrect: boolean) => {
    if (hasAnswered) return;
    setConnectedOptionId(optId);
    setHasAnswered(true);

    if (soundEnabled) sounds.playPop();

    setTimeout(() => {
      if (isCorrect) {
        if (soundEnabled) {
          sounds.playTrainWhistle();
          speakGirlPraise();
        }
        setScore((s) => s + 10);
      } else {
        if (soundEnabled) {
          sounds.playRetry();
          speakGirlEncourage();
        }
      }
    }, 250);
  };

  const handleNext = () => {
    if (soundEnabled) sounds.playPop();
    setCurrentIndex((i) => (i + 1) % questions.length);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border-2 border-blue-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
            🚂
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-['Quicksand']">
              Chuyến Tàu Tri Thức Nối Toa (Knowledge Train)
            </h2>
            <p className="text-xs text-blue-100 font-medium">
              Chạm tay chọn toa tàu mang đáp án đúng để nối vào đoàn tàu hỏa vui nhộn
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
            className="px-3.5 py-1.5 rounded-2xl bg-white text-blue-950 text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Đổi Câu Hỏi</span>
          </button>
        </div>
      </div>

      {/* Main Train Stage */}
      <div className="bg-gradient-to-b from-sky-200 via-blue-100 to-emerald-100 rounded-3xl p-5 sm:p-7 border-3 border-blue-300 shadow-md space-y-6 select-none relative overflow-hidden">
        {/* Question Header Card */}
        <div className="bg-white/95 p-4 sm:p-5 rounded-2xl border-2 border-blue-300 shadow-sm flex items-center justify-between gap-4 max-w-2xl mx-auto w-full">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                Toa Tàu Số {currentIndex + 1}/{questions.length}
              </span>
              <span className="text-xs text-stone-500 font-bold">
                Bé tìm toa tàu đúng để nối vào đoàn tàu:
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-black text-blue-950 font-['Quicksand'] leading-snug">
              {currentQ.question}
            </h3>
          </div>

          <button
            onClick={() => speakText(currentQ.question, 1.05, 'vi-VN')}
            className="p-3 rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-700 cursor-pointer shadow-2xs shrink-0"
            title="Nghe lại câu hỏi"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Train & Railway Track Scene */}
        <div className="relative py-4 overflow-x-auto scrollbar-none">
          {/* Steam locomotive engine + connected wagons */}
          <div className="flex items-end justify-center gap-2 min-w-[500px]">
            {/* Locomotive Head */}
            <div className="flex flex-col items-center">
              <span className="text-sm font-black text-blue-800 bg-white/80 px-2 py-0.5 rounded-full mb-1">
                Tu tu xình xịch!
              </span>
              <div className="w-32 h-28 bg-gradient-to-tr from-red-600 to-rose-500 rounded-t-3xl rounded-b-lg border-3 border-amber-300 shadow-lg flex flex-col items-center justify-between p-2 text-white relative">
                <span className="text-3xl">🚂</span>
                <span className="text-[11px] font-black uppercase">Đầu Tàu AI</span>
                {/* Wheels */}
                <div className="absolute -bottom-3 flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-stone-800 border-2 border-stone-400" />
                  <div className="w-6 h-6 rounded-full bg-stone-800 border-2 border-stone-400" />
                </div>
              </div>
            </div>

            {/* Connecting Hitch */}
            <div className="w-6 h-2 bg-stone-700 mb-6" />

            {/* The Target Missing Wagon Slot */}
            <div className="flex flex-col items-center">
              <div
                className={`w-36 h-28 rounded-2xl border-3 border-dashed flex flex-col items-center justify-center p-2 text-center transition-all relative ${
                  connectedOptionId
                    ? currentQ.options.find((o) => o.id === connectedOptionId)?.isCorrect
                      ? 'bg-emerald-400 border-emerald-600 text-white shadow-xl animate-bounce'
                      : 'bg-rose-400 border-rose-600 text-white'
                    : 'bg-white/60 border-blue-400 text-stone-500'
                }`}
              >
                {connectedOptionId ? (
                  <>
                    <span className="text-3xl block">
                      {currentQ.options.find((o) => o.id === connectedOptionId)?.emoji}
                    </span>
                    <span className="text-xs font-black mt-1">
                      {currentQ.options.find((o) => o.id === connectedOptionId)?.text}
                    </span>
                    <span className="text-[10px] font-black uppercase text-yellow-200 mt-0.5">
                      ✓ ĐÃ NỐI TOA
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl opacity-50 animate-pulse">❓</span>
                    <span className="text-[11px] font-black mt-1">Toa đang chờ nối</span>
                  </>
                )}

                {/* Wheels */}
                <div className="absolute -bottom-3 flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-stone-800 border-2 border-stone-400" />
                  <div className="w-6 h-6 rounded-full bg-stone-800 border-2 border-stone-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Railway Tracks Ground */}
          <div className="w-full h-4 bg-stone-600 rounded-full mt-4 flex items-center justify-around border-t-2 border-stone-400 shadow-md">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-1.5 h-3 bg-amber-800 rounded-sm" />
            ))}
          </div>
        </div>

        {/* Wagon Options to Touch (Bé chọn toa để nối) */}
        <div className="space-y-2">
          <span className="text-xs font-black text-blue-950 uppercase tracking-wide block text-center">
            👉 Chạm vào toa tàu đúng bên dưới để nối vào đoàn tàu:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {currentQ.options.map((opt) => {
              const isSelected = connectedOptionId === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleConnectWagon(opt.id, opt.isCorrect)}
                  disabled={hasAnswered}
                  className={`p-4 rounded-3xl border-3 flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none active:scale-95 shadow-md ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-xl'
                        : 'bg-rose-500 border-rose-600 text-white'
                      : 'bg-white hover:bg-blue-50 border-blue-300 text-stone-800 hover:scale-105'
                  }`}
                >
                  <span className="text-4xl block mb-1 filter drop-shadow-sm">
                    {opt.emoji}
                  </span>
                  <span className="text-xs sm:text-sm font-black leading-tight block">
                    {opt.text}
                  </span>
                  <span className="text-[10px] font-extrabold text-blue-600 mt-1 block">
                    Toa số {opt.id.slice(-1)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Banner */}
        {hasAnswered && (
          <div className="bg-white/95 rounded-2xl p-4 border-2 border-blue-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{currentQ.explanation}</span>
            </div>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Chuyến Tàu Tiếp Theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

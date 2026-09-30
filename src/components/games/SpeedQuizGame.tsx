import React, { useState, useEffect } from 'react';
import { GameQuestion } from '../../types/interactiveGame';
import { sounds, speakText, speakGirlPraise, speakGirlEncourage } from '../../utils/audioUtils';
import {
  Sparkles,
  Trophy,
  Volume2,
  RotateCcw,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface SpeedQuizGameProps {
  questions: GameQuestion[];
  soundEnabled: boolean;
  onOpenQuestionManager: () => void;
}

export const SpeedQuizGame: React.FC<SpeedQuizGameProps> = ({
  questions,
  soundEnabled,
  onOpenQuestionManager,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const currentQ = questions[currentIndex % questions.length];

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(15);
    setIsTimerActive(true);
    setSelectedOptionId(null);

    // Read question
    if (currentQ) {
      speakText(currentQ.question, 1.0, 'vi-VN');
    }
  }, [currentIndex, currentQ]);

  // Timer countdown
  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          if (soundEnabled) sounds.playRetry();
          return 0;
        }
        if (prev <= 5 && soundEnabled) {
          sounds.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft, soundEnabled]);

  // Touch option to answer
  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (selectedOptionId !== null) return;
    setIsTimerActive(false);
    setSelectedOptionId(optionId);

    if (isCorrect) {
      if (soundEnabled) {
        sounds.playSuccess();
        speakGirlPraise();
      }
      const bonus = timeLeft > 8 ? 15 : 10;
      setScore((s) => s + bonus);
      setStreak((st) => st + 1);
    } else {
      if (soundEnabled) {
        sounds.playRetry();
        speakGirlEncourage();
      }
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (soundEnabled) sounds.playPop();
    setCurrentIndex((i) => (i + 1) % questions.length);
  };

  const isAnswered = selectedOptionId !== null || timeLeft === 0;

  return (
    <div className="space-y-6">
      {/* Game Header Bar */}
      <div className="bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border-2 border-rose-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
            ⚡
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-['Quicksand']">
              Đấu Trường Nhanh Trí Mầm Non
            </h2>
            <p className="text-xs text-rose-100 font-medium">
              Chế độ nút bấm cảm ứng khổng lồ & đồng hồ đếm ngược cho lớp học tương tác
            </p>
          </div>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-2">
          {streak > 1 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-amber-400 text-amber-950 font-black text-xs shadow-xs animate-bounce">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>Chuỗi {streak}🔥</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/30 text-xs font-black">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span>Điểm: {score}</span>
          </div>
          <button
            onClick={onOpenQuestionManager}
            className="px-3.5 py-1.5 rounded-2xl bg-white text-rose-900 text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>AI Đổi Câu Hỏi</span>
          </button>
        </div>
      </div>

      {/* Main Arena Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-rose-200 shadow-md space-y-5 select-none">
        {/* Top Info & Countdown Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>
              Câu hỏi {currentIndex + 1} / {questions.length}
            </span>
            <div
              className={`flex items-center gap-1 font-black ${
                timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-stone-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Thời gian: {timeLeft}s</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft > 8
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                  : timeLeft > 4
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                  : 'bg-gradient-to-r from-rose-500 to-red-600'
              }`}
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Header */}
        <div className="bg-gradient-to-r from-rose-50 via-orange-50/60 to-rose-50 p-5 rounded-2xl border border-rose-200 flex items-start justify-between gap-4">
          <h3 className="text-lg sm:text-2xl font-black text-rose-950 font-['Quicksand'] leading-snug">
            {currentQ.question}
          </h3>
          <button
            onClick={() => speakText(currentQ.question, 1.0, 'vi-VN')}
            className="p-3 rounded-2xl bg-white hover:bg-rose-100 text-rose-700 cursor-pointer shadow-xs shrink-0 border border-rose-200"
            title="Đọc to câu hỏi"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Big Giant Touch Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;

            let buttonClass =
              'bg-gradient-to-b from-stone-50 to-stone-100 border-2 border-stone-200 hover:border-rose-400 hover:bg-rose-50/50 text-stone-800';

            if (isAnswered) {
              if (opt.isCorrect) {
                buttonClass =
                  'bg-gradient-to-b from-emerald-400 to-emerald-600 border-3 border-emerald-700 text-white shadow-xl scale-102';
              } else if (isSelected && !opt.isCorrect) {
                buttonClass =
                  'bg-gradient-to-b from-rose-400 to-rose-600 border-3 border-rose-700 text-white';
              } else {
                buttonClass = 'bg-stone-100 border-stone-200 text-stone-400 opacity-40';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                disabled={isAnswered}
                className={`min-h-[140px] sm:min-h-[160px] p-5 rounded-3xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer active:scale-95 shadow-md ${buttonClass}`}
              >
                <span className="text-4xl sm:text-5xl block filter drop-shadow-sm">
                  {opt.emoji}
                </span>
                <span className="text-sm sm:text-base font-black leading-snug block">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback & Next Button */}
        {isAnswered && (
          <div className="pt-3 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{currentQ.explanation}</span>
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Câu Hỏi Tiếp Theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

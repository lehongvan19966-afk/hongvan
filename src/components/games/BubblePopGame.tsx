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
} from 'lucide-react';

interface BubblePopGameProps {
  questions: GameQuestion[];
  soundEnabled: boolean;
  onOpenQuestionManager: () => void;
}

interface FloatingBubble {
  id: string;
  text: string;
  emoji: string;
  isTarget: boolean;
  xOffset: number; // percentage across screen
  yDelay: number; // animation delay
  isPopped: boolean;
  colorBg: string;
}

const BUBBLE_COLORS = [
  'from-rose-400 to-pink-500 text-white',
  'from-sky-400 to-blue-500 text-white',
  'from-amber-400 to-orange-500 text-white',
  'from-emerald-400 to-teal-500 text-white',
  'from-purple-400 to-indigo-500 text-white',
];

export const BubblePopGame: React.FC<BubblePopGameProps> = ({
  questions,
  soundEnabled,
  onOpenQuestionManager,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState<FloatingBubble[]>([]);
  const [hasAnsweredCorrect, setHasAnsweredCorrect] = useState(false);

  const currentQ = questions[currentQIndex % questions.length];

  // Set up bubbles for current question
  useEffect(() => {
    if (!currentQ) return;
    setHasAnsweredCorrect(false);

    // Pick 1 correct target and 3 distractors
    const correctOpt = currentQ.options.find((o) => o.isCorrect) || currentQ.options[0];
    const wrongOpts = currentQ.options.filter((o) => !o.isCorrect);

    const bubbleList: FloatingBubble[] = [
      {
        id: 'correct_target',
        text: correctOpt?.text || currentQ.bubbleTarget || 'Đáp án đúng',
        emoji: correctOpt?.emoji || '🎯',
        isTarget: true,
        xOffset: 15 + Math.random() * 20,
        yDelay: 0,
        isPopped: false,
        colorBg: BUBBLE_COLORS[0],
      },
    ];

    wrongOpts.slice(0, 3).forEach((w, idx) => {
      bubbleList.push({
        id: `wrong_${idx}`,
        text: w.text,
        emoji: w.emoji || '🎈',
        isTarget: false,
        xOffset: 40 + idx * 18,
        yDelay: idx * 0.4,
        isPopped: false,
        colorBg: BUBBLE_COLORS[(idx + 1) % BUBBLE_COLORS.length],
      });
    });

    // Shuffle bubbles
    setBubbles(bubbleList.sort(() => Math.random() - 0.5));

    // Read question
    speakText(currentQ.question, 1.0, 'vi-VN');
  }, [currentQIndex, currentQ]);

  // Touch bubble to pop!
  const handlePopBubble = (bubbleId: string, isTarget: boolean) => {
    if (hasAnsweredCorrect) return;

    if (soundEnabled) sounds.playBubblePop();

    setBubbles((prev) =>
      prev.map((b) => (b.id === bubbleId ? { ...b, isPopped: true } : b))
    );

    if (isTarget) {
      if (soundEnabled) {
        sounds.playSuccess();
        speakGirlPraise();
      }
      setHasAnsweredCorrect(true);
      setScore((s) => s + 10);
    } else {
      if (soundEnabled) {
        sounds.playRetry();
        speakGirlEncourage();
      }
    }
  };

  const handleNextQuestion = () => {
    if (soundEnabled) sounds.playPop();
    setCurrentQIndex((i) => (i + 1) % questions.length);
  };

  return (
    <div className="space-y-6">
      {/* Game Header Bar */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border-2 border-sky-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
            🎈
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-['Quicksand']">
              Bong Bóng Tri Thức Bay (Chạm Nổ Bong Bóng)
            </h2>
            <p className="text-xs text-sky-100 font-medium">
              Chạm tay vào bong bóng bay chứa đáp án đúng để làm nổ "BỐP!" vui tai
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
              setCurrentQIndex(0);
              setScore(0);
            }}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white cursor-pointer shadow-2xs"
            title="Bắt đầu lại từ câu 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenQuestionManager}
            className="px-3.5 py-1.5 rounded-2xl bg-white text-sky-900 text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>AI Đổi Câu Hỏi</span>
          </button>
        </div>
      </div>

      {/* Floating Sky Arena */}
      <div className="relative overflow-hidden rounded-3xl border-3 border-sky-300 bg-gradient-to-b from-sky-200 via-sky-100 to-blue-50 p-6 min-h-[420px] shadow-inner flex flex-col justify-between select-none">
        {/* Sky Ambient Clouds */}
        <div className="absolute top-4 left-6 text-4xl opacity-50 pointer-events-none select-none animate-pulse">
          ☁️
        </div>
        <div className="absolute top-10 right-10 text-5xl opacity-60 pointer-events-none select-none">
          ☁️
        </div>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-3xl opacity-80 pointer-events-none select-none">
          ☀️
        </div>

        {/* Question Header Card */}
        <div className="relative z-10 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border-2 border-sky-200 shadow-md flex items-center justify-between gap-4 max-w-2xl mx-auto w-full">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                Câu {currentQIndex + 1}/{questions.length}
              </span>
              <span className="text-xs text-stone-500 font-bold">
                Bé chạm nổ bóng đúng:
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-sky-950 font-['Quicksand'] leading-snug">
              {currentQ.question}
            </h3>
          </div>

          <button
            onClick={() => speakText(currentQ.question, 1.0, 'vi-VN')}
            className="p-3 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-700 cursor-pointer shadow-2xs shrink-0"
            title="Đọc to câu hỏi"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Bubbles Floating Field */}
        <div className="relative z-10 py-8 flex items-center justify-around flex-wrap gap-4 sm:gap-6 min-h-[200px]">
          {bubbles.map((b) => {
            if (b.isPopped) {
              return (
                <div
                  key={b.id}
                  className="w-28 h-28 sm:w-32 sm:h-32 flex flex-col items-center justify-center animate-ping text-3xl opacity-40 pointer-events-none"
                >
                  ✨ 💥
                </div>
              );
            }

            return (
              <button
                key={b.id}
                onClick={() => handlePopBubble(b.id, b.isTarget)}
                className={`relative w-28 h-32 sm:w-36 sm:h-40 rounded-[50%] bg-gradient-to-tr ${b.colorBg} border-3 border-white/80 shadow-[0_12px_24px_rgba(0,0,0,0.18)] flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:scale-115 active:scale-90 transition-all select-none animate-bounce duration-1000`}
                style={{
                  animationDuration: `${2000 + Math.random() * 1000}ms`,
                }}
              >
                {/* Bubble Shiny Specular Highlight */}
                <div className="absolute top-3 left-4 w-6 h-3 rounded-full bg-white/70 -rotate-35 blur-[0.5px]" />

                <span className="text-3xl sm:text-4xl block filter drop-shadow-sm mb-1">
                  {b.emoji}
                </span>
                <span className="text-xs sm:text-sm font-black leading-tight drop-shadow-xs block">
                  {b.text}
                </span>

                {/* Bubble String Tip */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-white/60 rounded-full" />
              </button>
            );
          })}
        </div>

        {/* Bottom Feedback Banner */}
        {hasAnsweredCorrect ? (
          <div className="relative z-10 bg-emerald-500 text-white p-3.5 rounded-2xl shadow-lg border-2 border-white flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black">
              <CheckCircle2 className="w-5 h-5 text-yellow-300 shrink-0" />
              <span>{currentQ.explanation}</span>
            </div>
            <button
              onClick={handleNextQuestion}
              className="px-5 py-2 rounded-xl bg-white text-emerald-900 font-black text-xs shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Bong Bóng Kế Tiếp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="relative z-10 text-center text-xs font-bold text-sky-800/80 bg-white/60 backdrop-blur-xs py-1.5 rounded-full max-w-sm mx-auto">
            👉 Chạm vào bóng để làm nổ và ghi 10 điểm!
          </div>
        )}
      </div>
    </div>
  );
};

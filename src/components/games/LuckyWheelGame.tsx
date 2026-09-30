import React, { useState, useRef } from 'react';
import { GameQuestion } from '../../types/interactiveGame';
import { sounds, speakText, speakGirlPraise, speakGirlEncourage } from '../../utils/audioUtils';
import {
  RotateCcw,
  Sparkles,
  Volume2,
  Trophy,
  CheckCircle2,
  HelpCircle,
  Gift,
  ArrowRight,
} from 'lucide-react';

interface LuckyWheelGameProps {
  questions: GameQuestion[];
  soundEnabled: boolean;
  onOpenQuestionManager: () => void;
}

const WHEEL_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFE66D',
  '#1A535C',
  '#FF9F1C',
  '#9B5DE5',
  '#F15BB5',
  '#00BBF9',
];

export const LuckyWheelGame: React.FC<LuckyWheelGameProps> = ({
  questions,
  soundEnabled,
  onOpenQuestionManager,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<GameQuestion | null>(null);
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState<number[]>([]);

  const wheelSegments = questions.slice(0, 8);
  const segmentAngle = 360 / Math.max(1, wheelSegments.length);

  // Spin the lucky wheel
  const handleSpin = () => {
    if (isSpinning) return;
    if (soundEnabled) sounds.playPop();

    setIsSpinning(true);
    setActiveQuestion(null);
    setIsBoxOpen(false);
    setSelectedOptionId(null);

    // Play ticker sound repeatedly
    let tickerCount = 0;
    const interval = setInterval(() => {
      if (soundEnabled) sounds.playSpin();
      tickerCount++;
      if (tickerCount > 15) clearInterval(interval);
    }, 180);

    // Pick random target segment
    const randomIndex = Math.floor(Math.random() * wheelSegments.length);
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5 to 7 full rotations
    const targetDeg = extraSpins * 360 + (360 - (randomIndex * segmentAngle + segmentAngle / 2));

    const finalDeg = rotationDegree + targetDeg;
    setRotationDegree(finalDeg);

    setTimeout(() => {
      setIsSpinning(false);
      const chosenQ = wheelSegments[randomIndex];
      setActiveQuestion(chosenQ);
      if (soundEnabled) sounds.playTada();
    }, 3200);
  };

  // Open mystery box
  const handleOpenBox = () => {
    if (!activeQuestion) return;
    if (soundEnabled) sounds.playTada();
    setIsBoxOpen(true);
    // Auto read question
    speakText(activeQuestion.question, 1.0, 'vi-VN');
  };

  // Answer selection on touch
  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (selectedOptionId !== null) return; // already answered
    setSelectedOptionId(optionId);

    if (isCorrect) {
      if (soundEnabled) {
        sounds.playSuccess();
        speakGirlPraise();
      }
      setScore((s) => s + 10);
      setStars((prev) => [...prev, Date.now()]);
    } else {
      if (soundEnabled) {
        sounds.playRetry();
        speakGirlEncourage();
      }
    }
  };

  const handleNextTurn = () => {
    if (soundEnabled) sounds.playPop();
    setActiveQuestion(null);
    setIsBoxOpen(false);
    setSelectedOptionId(null);
  };

  return (
    <div className="space-y-6">
      {/* Game Header Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border-2 border-amber-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
            🎡
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-['Quicksand']">
              Vòng Quay Thần Kỳ & Rương Báu Bí Mật
            </h2>
            <p className="text-xs text-amber-100 font-medium">
              Chạm nút quay bánh xe, mở rương kho báu và giải câu đố thần kỳ
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
            onClick={onOpenQuestionManager}
            className="px-3.5 py-1.5 rounded-2xl bg-white text-orange-900 text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>AI Đổi Câu Hỏi</span>
          </button>
        </div>
      </div>

      {/* Main Wheel & Mystery Box Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Interactive 3D Lucky Wheel */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-white/90 rounded-3xl border-2 border-amber-200 shadow-md relative min-h-[380px]">
          {/* Wheel Pointer Indicator */}
          <div className="absolute top-2 z-20 flex flex-col items-center">
            <div className="w-6 h-8 bg-gradient-to-b from-rose-500 to-red-600 shadow-md clip-triangle animate-bounce" />
            <div className="w-3 h-3 rounded-full bg-yellow-300 border-2 border-red-700 shadow-xs" />
          </div>

          {/* The Spinning Wheel */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4">
            <div
              className="w-full h-full rounded-full border-[6px] border-amber-400 shadow-2xl relative overflow-hidden transition-transform ease-out"
              style={{
                transform: `rotate(${rotationDegree}deg)`,
                transitionDuration: isSpinning ? '3200ms' : '0ms',
              }}
            >
              {wheelSegments.map((q, idx) => {
                const angle = idx * segmentAngle;
                const color = WHEEL_COLORS[idx % WHEEL_COLORS.length];
                return (
                  <div
                    key={q.id}
                    className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left flex items-center justify-center text-white"
                    style={{
                      transform: `rotate(${angle}deg) skewY(${90 - segmentAngle}deg)`,
                      backgroundColor: color,
                    }}
                  >
                    <div
                      className="absolute left-6 top-8 text-xs font-black select-none"
                      style={{
                        transform: `skewY(-${90 - segmentAngle}deg) rotate(${segmentAngle / 2}deg)`,
                      }}
                    >
                      <span className="text-xl block text-center">
                        {q.options[0]?.emoji || '🎁'}
                      </span>
                      <span className="text-[10px] block opacity-95 text-center truncate max-w-[70px]">
                        {q.category || `Số ${idx + 1}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Center Spin Button (Bé chạm trực tiếp vào tâm bánh xe) */}
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 border-4 border-white shadow-xl flex flex-col items-center justify-center text-amber-950 font-black cursor-pointer hover:scale-110 active:scale-95 transition-all select-none disabled:opacity-80 disabled:cursor-not-allowed group"
            >
              <Sparkles className="w-5 h-5 text-white animate-spin duration-1000 group-hover:scale-125 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-tight text-white drop-shadow-xs">
                {isSpinning ? 'Đang quay...' : 'QUAY!'}
              </span>
            </button>
          </div>

          {/* Action text */}
          <p className="text-xs text-stone-500 font-bold mt-1 text-center">
            {isSpinning ? '🎡 Bánh xe đang quay tít...' : '👉 Bé hãy chạm nút QUAY ở giữa bánh xe!'}
          </p>
        </div>

        {/* Right Side: Mystery Treasure Box or Question Card */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          {!activeQuestion ? (
            /* Standby State: Glowing Mystery Chest */
            <div className="w-full bg-gradient-to-br from-amber-50 to-orange-50/70 p-6 sm:p-8 rounded-3xl border-2 border-dashed border-amber-300 text-center flex flex-col items-center justify-center space-y-3 min-h-[360px]">
              <div className="w-24 h-24 rounded-3xl bg-amber-100/90 border-2 border-amber-300 flex items-center justify-center text-5xl shadow-md animate-bounce duration-1000">
                🎁
              </div>
              <h3 className="text-base font-black text-amber-950 font-['Quicksand']">
                Rương Báu Đang Chờ Mở
              </h3>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                Khi cô và các bé quay bánh xe, ô phần thưởng sẽ xuất hiện câu đố bí mật nằm trong chiếc rương báu này!
              </p>
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="mt-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                🎡 Quay Thử Ngay
              </button>
            </div>
          ) : !isBoxOpen ? (
            /* Box Landed - Ready to Tap Open! */
            <div className="w-full bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 p-6 sm:p-8 rounded-3xl border-4 border-amber-400 text-center flex flex-col items-center justify-center space-y-4 shadow-xl animate-fadeIn">
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500 text-white font-black shadow-xs animate-pulse">
                🌟 BÁNH XE ĐÃ DỪNG LẠI!
              </span>
              <div
                onClick={handleOpenBox}
                className="w-32 h-32 rounded-3xl bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 border-4 border-white shadow-2xl flex items-center justify-center text-6xl cursor-pointer hover:scale-110 active:scale-95 transition-all animate-bounce"
              >
                📦
              </div>
              <div>
                <h3 className="text-lg font-black text-amber-950 font-['Quicksand']">
                  Bé ơi! Chạm vào Rương Báu để mở nào!
                </h3>
                <p className="text-xs text-stone-600 font-medium mt-1">
                  Một điều kỳ diệu đang đợi bé khám phá bên trong ✨
                </p>
              </div>
              <button
                onClick={handleOpenBox}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Gift className="w-5 h-5" />
                <span>CHẠM MỞ RƯƠNG NGAY</span>
              </button>
            </div>
          ) : (
            /* Question Unveiled: Big Touch Options */
            <div className="w-full bg-white rounded-3xl border-2 border-amber-300 p-5 sm:p-6 shadow-xl space-y-4 animate-fadeIn">
              {/* Question Header & Speaker */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-amber-100">
                <div className="space-y-1">
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                    {activeQuestion.category || 'Câu đố mầm non'}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-amber-950 leading-snug">
                    {activeQuestion.question}
                  </h3>
                </div>
                <button
                  onClick={() => speakText(activeQuestion.question, 1.0, 'vi-VN')}
                  className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 cursor-pointer shadow-2xs shrink-0"
                  title="Đọc to câu hỏi cho các bé"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Big Touch Answer Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeQuestion.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isAnswered = selectedOptionId !== null;

                  let cardStyle =
                    'bg-amber-50/50 border-amber-200/90 text-stone-800 hover:bg-amber-100 hover:border-amber-400';
                  if (isAnswered) {
                    if (opt.isCorrect) {
                      cardStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-lg scale-102';
                    } else if (isSelected && !opt.isCorrect) {
                      cardStyle = 'bg-rose-500 border-rose-600 text-white opacity-80';
                    } else {
                      cardStyle = 'bg-stone-100 border-stone-200 text-stone-400 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                      disabled={isAnswered}
                      className={`p-4 rounded-2xl border-2 text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${cardStyle} active:scale-95 select-none min-h-[110px]`}
                    >
                      <span className="text-3xl block filter drop-shadow-xs">{opt.emoji}</span>
                      <span className="text-xs sm:text-sm font-black leading-tight block">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Next Turn */}
              {selectedOptionId && (
                <div className="pt-2 animate-fadeIn space-y-3">
                  <div
                    className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                      activeQuestion.options.find((o) => o.id === selectedOptionId)?.isCorrect
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{activeQuestion.explanation}</span>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextTurn}
                      className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      <span>Vòng Quay Tiếp Theo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

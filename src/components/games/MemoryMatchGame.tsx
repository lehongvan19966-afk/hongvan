import React, { useState, useEffect } from 'react';
import { GameQuestion } from '../../types/interactiveGame';
import { sounds, speakGirlPraise, speakGirlEncourage } from '../../utils/audioUtils';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  HelpCircle,
  Eye,
} from 'lucide-react';

interface MemoryMatchGameProps {
  questions: GameQuestion[];
  soundEnabled: boolean;
  onOpenQuestionManager: () => void;
}

interface CardItem {
  instanceId: string;
  pairId: string;
  text: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  questions,
  soundEnabled,
  onOpenQuestionManager,
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [movesCount, setMovesCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Initialize cards from questions matchPair
  useEffect(() => {
    initDeck();
  }, [questions]);

  const initDeck = () => {
    const deck: CardItem[] = [];
    const sourceQuestions = questions.slice(0, 6); // 6 pairs = 12 cards

    sourceQuestions.forEach((q, idx) => {
      const pairId = `pair_${idx}`;
      const pair = q.matchPair || {
        left: q.options[0]?.text || 'Hình 1',
        leftEmoji: q.options[0]?.emoji || '🌟',
        right: q.correctAnswerText || 'Hình 2',
        rightEmoji: q.options[0]?.emoji || '✨',
      };

      deck.push({
        instanceId: `card_${idx}_A`,
        pairId,
        text: pair.left,
        emoji: pair.leftEmoji,
        isFlipped: false,
        isMatched: false,
      });

      deck.push({
        instanceId: `card_${idx}_B`,
        pairId,
        text: pair.right,
        emoji: pair.rightEmoji,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    setCards(deck.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMovesCount(0);
    setMatchesCount(0);
    setIsLocked(false);
  };

  // Touch card to flip
  const handleCardClick = (card: CardItem) => {
    if (isLocked) return;
    if (card.isFlipped || card.isMatched) return;

    if (soundEnabled) sounds.playPop();

    // Flip card
    const updatedCards = cards.map((c) =>
      c.instanceId === card.instanceId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newSelection = [...selectedCards, card];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      setIsLocked(true);
      setMovesCount((m) => m + 1);

      const [c1, c2] = newSelection;
      if (c1.pairId === c2.pairId) {
        // MATCH!
        setTimeout(() => {
          if (soundEnabled) {
            sounds.playSuccess();
            speakGirlPraise();
          }
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === c1.pairId ? { ...c, isMatched: true } : c
            )
          );
          setSelectedCards([]);
          setMatchesCount((mc) => mc + 1);
          setIsLocked(false);
        }, 500);
      } else {
        // MISMATCH
        setTimeout(() => {
          if (soundEnabled) {
            sounds.playRetry();
            speakGirlEncourage();
          }
          setCards((prev) =>
            prev.map((c) =>
              c.instanceId === c1.instanceId || c.instanceId === c2.instanceId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setSelectedCards([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  const totalPairs = cards.length / 2;
  const isAllCompleted = matchesCount === totalPairs && totalPairs > 0;

  return (
    <div className="space-y-6">
      {/* Game Header Bar */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border-2 border-purple-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
            🔍
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-['Quicksand']">
              Thám Tử Nhí - Lật Mảnh Ghép Trí Nhớ
            </h2>
            <p className="text-xs text-purple-100 font-medium">
              Chạm tay lật mở các thẻ bài và tìm 2 hình ảnh có mối liên kết với nhau
            </p>
          </div>
        </div>

        {/* Score & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/30 text-xs font-black">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span>
              Cặp đúng: {matchesCount}/{totalPairs}
            </span>
          </div>
          <button
            onClick={() => {
              if (soundEnabled) sounds.playPop();
              initDeck();
            }}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white cursor-pointer shadow-2xs"
            title="Xáo bài chơi lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenQuestionManager}
            className="px-3.5 py-1.5 rounded-2xl bg-white text-purple-900 text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Đổi Cặp Thẻ</span>
          </button>
        </div>
      </div>

      {/* Complete Banner */}
      {isAllCompleted && (
        <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl shadow-xl text-center space-y-2 animate-fadeIn border-2 border-white">
          <div className="text-4xl animate-bounce">🏆 🌟 🎉</div>
          <h3 className="text-lg font-black font-['Quicksand']">
            HOAN HÔ BÉ! ĐÃ TÌM ĐƯỢC TOÀN BỘ CẶP HÌNH!
          </h3>
          <p className="text-xs text-emerald-100">
            Trí nhớ và khả năng quan sát của bé thật đáng kinh ngạc trong {movesCount} lượt lật!
          </p>
          <button
            onClick={initDeck}
            className="mt-2 px-6 py-2.5 rounded-2xl bg-white text-emerald-950 font-black text-xs shadow-md hover:scale-105 active:scale-95 cursor-pointer"
          >
            Chơi Ván Mới Ngay
          </button>
        </div>
      )}

      {/* Cards Grid Stage */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 select-none">
        {cards.map((card) => {
          const isFaceUp = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.instanceId}
              onClick={() => handleCardClick(card)}
              disabled={isFaceUp || isLocked}
              className={`h-32 sm:h-36 rounded-2xl border-2 text-center p-3 flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer shadow-sm active:scale-95 ${
                card.isMatched
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-950 scale-95 opacity-90 shadow-none'
                  : isFaceUp
                  ? 'bg-white border-purple-400 text-purple-950 shadow-md scale-102 ring-2 ring-purple-300'
                  : 'bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 border-indigo-300 text-white hover:scale-105 hover:shadow-md'
              }`}
            >
              {isFaceUp ? (
                <>
                  <span className="text-3xl sm:text-4xl block filter drop-shadow-xs animate-fadeIn">
                    {card.emoji}
                  </span>
                  <span className="text-xs sm:text-sm font-black leading-tight block truncate max-w-full">
                    {card.text}
                  </span>
                  {card.isMatched && (
                    <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-0.5 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Đúng cặp
                    </span>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1">
                  <span className="text-3xl opacity-80">❓</span>
                  <span className="text-[11px] font-black uppercase tracking-wider text-purple-200">
                    Mầm AI
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

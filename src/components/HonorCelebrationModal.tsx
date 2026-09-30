import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Star,
  Sparkles,
  Heart,
  Crown,
  Medal,
  Award,
  ArrowRight,
  RotateCcw,
  UserCheck,
  CheckCircle2,
  X,
  Share2,
} from 'lucide-react';
import { StickerItem, GameHonorRecord, KidRank } from '../types/englishBuddy';
import { sounds } from '../utils/audioUtils';

interface HonorCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: GameHonorRecord | null;
  onPlayAgain: () => void;
  onChangeKid: () => void;
  onOpenBackpack: () => void;
  leaderboard: GameHonorRecord[];
}

export const HonorCelebrationModal: React.FC<HonorCelebrationModalProps> = ({
  isOpen,
  onClose,
  record,
  onPlayAgain,
  onChangeKid,
  onOpenBackpack,
  leaderboard,
}) => {
  const [activeTab, setActiveTab] = useState<'honor' | 'leaderboard'>('honor');
  const [isStickerRevealed, setIsStickerRevealed] = useState(false);

  useEffect(() => {
    if (isOpen && record) {
      setIsStickerRevealed(false);
      sounds.playSuccess();
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899'],
        });
      } catch {}

      // Reveal sticker with sound after 500ms
      const timer = setTimeout(() => {
        setIsStickerRevealed(true);
        sounds.playPop();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, record]);

  if (!isOpen || !record) return null;

  const getRankBadge = (rank: KidRank) => {
    switch (rank) {
      case 'xuat_sac':
        return {
          title: '🌟 XUẤT SẮC - Ngôi Sao Tiếng Anh Nhí',
          badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white',
          icon: <Crown className="w-5 h-5 text-yellow-200 fill-yellow-300" />,
          compliment: 'Bé trả lời siêu nhanh và chính xác 100%! Cô và cả lớp rất tự hào về bé!',
        };
      case 'gioi':
        return {
          title: '🌸 GIỎI - Bé Siêu Cố Gắng',
          badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
          icon: <Medal className="w-5 h-5 text-emerald-200 fill-emerald-300" />,
          compliment: 'Bé làm rất tốt! Chỉ cần chăm chỉ luyện tập thêm một chút là đạt điểm tuyệt đối nha!',
        };
      case 'kha':
      default:
        return {
          title: '🌼 KHÁ - Bé Tiến Bộ Vượt Bậc',
          badgeBg: 'bg-gradient-to-r from-sky-500 to-blue-500 text-white',
          icon: <Award className="w-5 h-5 text-sky-200 fill-sky-300" />,
          compliment: 'Bé đã rất dũng cảm thử thách bản thân! Cùng Mầm AI chơi thêm để lên hạng nha!',
        };
    }
  };

  const rankInfo = getRankBadge(record.rank);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fadeIn font-['Nunito',sans-serif]">
      {/* Background magical glow */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-400/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-400/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] via-amber-50/70 to-orange-50/80 rounded-[38px] border-[5px] border-white shadow-[0_20px_50px_rgba(217,119,6,0.3)] p-5 sm:p-7 text-center overflow-hidden animate-scale-in max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-stone-400 hover:text-stone-700 flex items-center justify-center shadow-xs transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tab switch between Honor & Class Leaderboard */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-amber-100/70 rounded-2xl w-fit mx-auto mb-4 border border-amber-200">
          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('honor');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black font-bubbly transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'honor'
                ? 'bg-white text-amber-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Vinh Danh & Nhận Sticker</span>
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('leaderboard');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black font-bubbly transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'leaderboard'
                ? 'bg-white text-amber-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-orange-500" />
            <span>Bảng Vàng Cả Lớp 🏆</span>
          </button>
        </div>

        {activeTab === 'honor' ? (
          <div className="space-y-4 animate-fadeIn">
            {/* Top Podium Icon */}
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-400 p-1 shadow-lg shadow-amber-400/30 flex items-center justify-center animate-bounce-gentle">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl">
                  {record.kidAvatar}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 text-2xl filter drop-shadow-xs">
                🏆
              </span>
            </div>

            {/* Kid Name & Congratulations */}
            <div>
              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-orange-100 text-orange-900 text-xs font-black font-bubbly border border-orange-200 mb-1">
                <span>Trò chơi: {record.gameTitle}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-bubbly text-stone-900 tracking-tight">
                Vinh Danh {record.kidName}! 🎉
              </h2>
              <p className="text-xs text-stone-600 font-semibold max-w-sm mx-auto mt-0.5">
                {rankInfo.compliment}
              </p>
            </div>

            {/* Score & Stars Display (Tính điểm) */}
            <div className="p-3.5 bg-white rounded-3xl border-2 border-amber-200/90 shadow-2xs flex items-center justify-around">
              <div className="text-center">
                <span className="text-[11px] font-bold text-stone-400 block uppercase">
                  Điểm đạt được
                </span>
                <span className="text-2xl sm:text-3xl font-black font-bubbly text-orange-600">
                  {record.score}
                  <span className="text-sm text-stone-400 font-bold">/{record.maxScore}</span>
                </span>
              </div>

              <div className="h-8 w-[1px] bg-amber-200" />

              <div className="text-center">
                <span className="text-[11px] font-bold text-stone-400 block uppercase">
                  Ngôi sao
                </span>
                <div className="flex items-center gap-1 text-amber-400 justify-center">
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < record.stars
                          ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-xs'
                          : 'text-stone-200 fill-stone-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Rank Badge (Xếp loại vinh danh) */}
            <div className={`p-2.5 rounded-2xl ${rankInfo.badgeBg} shadow-md flex items-center justify-center gap-2`}>
              {rankInfo.icon}
              <span className="font-black font-bubbly text-sm tracking-wide">
                {rankInfo.title}
              </span>
            </div>

            {/* REWARD: TẶNG STICKER SAU MỖI LẦN CHƠI */}
            <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl p-4 border-2 border-orange-300/80 shadow-sm relative overflow-hidden">
              <div className="absolute top-2 right-2 text-xs font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                🎁 Quà tặng cho bé
              </div>

              <span className="text-xs font-black font-bubbly text-orange-950 block mb-2 text-left flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Bé vừa nhận được 1 Sticker mới:</span>
              </span>

              <div className={`p-3.5 rounded-2xl bg-white border-2 border-amber-200 flex items-center gap-3.5 text-left transition-all ${
                isStickerRevealed ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
              }`}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-100 to-orange-100 border border-orange-200 flex items-center justify-center text-3xl shrink-0 shadow-xs">
                  {record.stickerEarned.icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black font-bubbly text-sm text-stone-900">
                      {record.stickerEarned.name}
                    </span>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.2 rounded-full">
                      {record.stickerEarned.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    {record.stickerEarned.description}
                  </p>
                </div>
              </div>

              {/* View Backpack Button */}
              <div className="mt-2.5 flex justify-end">
                <button
                  onClick={() => {
                    sounds.playPop();
                    onOpenBackpack();
                  }}
                  className="text-xs font-bold text-orange-700 hover:text-orange-900 flex items-center gap-1 cursor-pointer underline underline-offset-2"
                >
                  <span>Mở Ba Lô Sticker của bé 🎒 ➔</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => {
                  sounds.playPop();
                  onPlayAgain();
                }}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black font-bubbly text-xs sm:text-sm tracking-wide shadow-md shadow-orange-500/25 hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại lượt mới</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  onChangeKid();
                }}
                className="py-3 px-4 rounded-2xl bg-white hover:bg-amber-50 text-stone-800 font-black font-bubbly text-xs sm:text-sm tracking-wide border-2 border-amber-200 shadow-2xs hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-orange-600" />
                <span>Đổi bạn khác chơi</span>
              </button>
            </div>
          </div>
        ) : (
          /* BẢNG VÀNG CẢ LỚP (LEADERBOARD) */
          <div className="space-y-3 text-left animate-fadeIn">
            <div className="text-center pb-2 border-b border-amber-200">
              <h3 className="text-lg font-black font-bubbly text-stone-900">
                Bảng Vàng Vinh Danh Cả Lớp Hôm Nay 🏆
              </h3>
              <p className="text-xs text-stone-500">
                Các bé tham gia luyện tập tiếng Anh đều được ghi danh và tặng sticker!
              </p>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {leaderboard.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                    idx === 0
                      ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black font-bubbly bg-stone-100 text-stone-700">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                    </span>
                    <span className="text-2xl">{item.kidAvatar}</span>
                    <div>
                      <span className="font-black font-bubbly text-xs sm:text-sm text-stone-900 block leading-tight">
                        {item.kidName}
                      </span>
                      <span className="text-[10px] text-stone-400 block leading-tight">
                        {item.gameTitle} · {item.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black font-bubbly text-sm sm:text-base text-orange-600 block leading-tight">
                      {item.score} điểm
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                      {item.stickerEarned.icon} {item.stickerEarned.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  sounds.playPop();
                  onChangeKid();
                }}
                className="py-2.5 px-5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black font-bubbly text-xs shadow-md cursor-pointer transition-all inline-flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Mời bé tiếp theo lên chơi</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

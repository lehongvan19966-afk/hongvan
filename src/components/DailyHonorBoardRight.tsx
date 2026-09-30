import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Crown,
  Medal,
  Star,
  Sparkles,
  Users,
  Award,
  RefreshCw,
  Share2,
  ChevronRight,
  Clock,
  Heart,
  CheckCircle2,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DailyKidSummary, GameHonorRecord } from '../types/englishBuddy';
import {
  getDailyKidSummaries,
  getTodayGameRecords,
  resetTodayRecords,
} from '../services/englishHonorStorage';
import { sounds } from '../utils/audioUtils';

interface DailyHonorBoardRightProps {
  className?: string;
  onSelectKid?: (name: string, avatar: string) => void;
}

export const DailyHonorBoardRight: React.FC<DailyHonorBoardRightProps> = ({
  className = '',
  onSelectKid,
}) => {
  const [summaries, setSummaries] = useState<DailyKidSummary[]>([]);
  const [records, setRecords] = useState<GameHonorRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'aggregate' | 'history'>('aggregate');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const loadData = () => {
    setSummaries(getDailyKidSummaries());
    setRecords(getTodayGameRecords());
  };

  useEffect(() => {
    loadData();

    // Listen for custom real-time event when a child completes a game
    const handleNewRecord = () => {
      loadData();
    };

    window.addEventListener('english_buddy_new_record', handleNewRecord);
    return () => {
      window.removeEventListener('english_buddy_new_record', handleNewRecord);
    };
  }, []);

  // Calculate totals
  const totalKids = summaries.length;
  const totalClassPoints = summaries.reduce((acc, curr) => acc + curr.totalScore, 0);
  const totalStickersGiven = summaries.reduce((acc, curr) => acc + curr.stickersEarned.length, 0);

  const top1 = summaries[0];
  const top2 = summaries[1];
  const top3 = summaries[2];

  const handleCelebrateClass = () => {
    sounds.playSuccess();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
      });
    } catch {}
  };

  const handleReset = () => {
    if (window.confirm('Cô có chắc muốn làm mới bảng điểm hôm nay để bắt đầu lượt mới không?')) {
      sounds.playPop();
      resetTodayRecords();
      loadData();
    }
  };

  return (
    <div
      className={`bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F0] to-[#FFF5E6] rounded-3xl border-2 border-amber-200/90 shadow-[0_8px_30px_rgba(217,119,6,0.12)] p-4 sm:p-5 flex flex-col font-['Nunito',sans-serif] select-none ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-200/80">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-lg shadow-sm border border-amber-300">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base sm:text-lg font-black font-bubbly text-amber-950 tracking-tight leading-tight">
                Bảng Vinh Danh Cuối Ngày
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-stone-500 font-semibold">
              Tổng hợp điểm số & khen thưởng lớp học
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCelebrateClass}
            title="Tung pháo hoa chúc mừng cả lớp!"
            className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-orange-600 animate-spin" />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="lg:hidden p-2 rounded-xl bg-white border border-amber-200 text-stone-500 hover:bg-amber-50 cursor-pointer"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="space-y-4 pt-3 animate-fadeIn flex-1 flex flex-col">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-2xl bg-white border border-amber-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 block uppercase">Bé tham gia</span>
              <span className="text-lg sm:text-xl font-black font-bubbly text-orange-600">
                {totalKids}
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white border border-amber-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 block uppercase">Tổng điểm</span>
              <span className="text-lg sm:text-xl font-black font-bubbly text-amber-600">
                {totalClassPoints}
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white border border-amber-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 block uppercase">Stickers</span>
              <span className="text-lg sm:text-xl font-black font-bubbly text-emerald-600">
                {totalStickersGiven}
              </span>
            </div>
          </div>

          {/* TOP 3 PODIUM (Bục Vinh Danh Vàng, Bạc, Đồng) */}
          {top1 && (
            <div className="relative pt-6 pb-3 px-2 bg-gradient-to-b from-amber-100/70 via-orange-50/50 to-white rounded-3xl border border-amber-200/80 text-center shadow-inner overflow-hidden">
              <div className="absolute top-1.5 left-3 text-[10px] font-extrabold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full flex items-center gap-1 font-bubbly">
                <Crown className="w-3 h-3 text-amber-600" />
                <span>Bục Vinh Danh Ngôi Sao</span>
              </div>

              <div className="flex items-end justify-center gap-2 sm:gap-3 pt-3">
                {/* 2nd Place (Silver) */}
                {top2 ? (
                  <div
                    onClick={() => onSelectKid && onSelectKid(top2.kidName, top2.kidAvatar)}
                    className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                    title={`Hạng 2: ${top2.kidName} (${top2.totalScore} đ)`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-300 shadow-sm flex items-center justify-center text-2xl">
                        {top2.kidAvatar}
                      </div>
                      <span className="absolute -bottom-1 -right-1 text-sm">🥈</span>
                    </div>
                    <span className="text-[11px] font-black font-bubbly text-stone-800 mt-1 max-w-[70px] truncate">
                      {top2.kidName}
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded-full">
                      {top2.totalScore} đ
                    </span>
                    <div className="w-16 h-10 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-xl mt-1.5 border border-slate-300 flex items-center justify-center font-black font-bubbly text-slate-700 text-xs shadow-2xs">
                      #2
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-10 border-dashed border-2 border-amber-200 rounded-t-xl" />
                )}

                {/* 1st Place (Gold Champion) */}
                <div
                  onClick={() => onSelectKid && onSelectKid(top1.kidName, top1.kidAvatar)}
                  className="flex flex-col items-center z-10 cursor-pointer hover:scale-105 transition-transform"
                  title={`Quán Quân: ${top1.kidName} (${top1.totalScore} đ)`}
                >
                  <div className="relative">
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-lg animate-bounce">
                      👑
                    </span>
                    <div className="w-15 h-15 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-400 p-0.5 shadow-md shadow-amber-400/30 flex items-center justify-center">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-3xl">
                        {top1.kidAvatar}
                      </div>
                    </div>
                    <span className="absolute -bottom-1 -right-1 text-base">🥇</span>
                  </div>
                  <span className="text-xs font-black font-bubbly text-amber-950 mt-1 max-w-[85px] truncate">
                    {top1.kidName}
                  </span>
                  <span className="text-[11px] font-black text-amber-900 bg-amber-200 px-2 py-0.2 rounded-full shadow-2xs">
                    {top1.totalScore} đ
                  </span>
                  <div className="w-20 h-14 bg-gradient-to-t from-amber-400 to-amber-200 rounded-t-2xl mt-1.5 border border-amber-400 flex flex-col items-center justify-center font-black font-bubbly text-white text-sm shadow-md">
                    <span>#1</span>
                    <span className="text-[9px] -mt-1 text-amber-950 font-bold">Quán quân</span>
                  </div>
                </div>

                {/* 3rd Place (Bronze) */}
                {top3 ? (
                  <div
                    onClick={() => onSelectKid && onSelectKid(top3.kidName, top3.kidAvatar)}
                    className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                    title={`Hạng 3: ${top3.kidName} (${top3.totalScore} đ)`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-amber-600/40 shadow-sm flex items-center justify-center text-2xl">
                        {top3.kidAvatar}
                      </div>
                      <span className="absolute -bottom-1 -right-1 text-sm">🥉</span>
                    </div>
                    <span className="text-[11px] font-black font-bubbly text-stone-800 mt-1 max-w-[70px] truncate">
                      {top3.kidName}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-orange-100 px-1.5 py-0.2 rounded-full">
                      {top3.totalScore} đ
                    </span>
                    <div className="w-16 h-8 bg-gradient-to-t from-orange-200 to-amber-100 rounded-t-xl mt-1.5 border border-orange-300 flex items-center justify-center font-black font-bubbly text-orange-800 text-xs shadow-2xs">
                      #3
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-8 border-dashed border-2 border-amber-200 rounded-t-xl" />
                )}
              </div>
            </div>
          )}

          {/* Switch Tab: Tổng Hợp Điểm vs Lịch Sử Từng Ván */}
          <div className="flex items-center gap-1 p-1 bg-amber-100/70 rounded-2xl border border-amber-200/80">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('aggregate');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black font-bubbly transition-all cursor-pointer ${
                activeTab === 'aggregate'
                  ? 'bg-white text-amber-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ⭐ Tổng Hợp Điểm ({summaries.length})
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('history');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black font-bubbly transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white text-amber-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🕒 Lịch Sử Ván ({records.length})
            </button>
          </div>

          {/* List of Kids / Records */}
          <div className="flex-1 max-h-72 lg:max-h-80 overflow-y-auto pr-1 space-y-2">
            {activeTab === 'aggregate' ? (
              summaries.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400">
                  <span>Chưa có lượt chơi nào hôm nay. Cho bé vào chơi ngay nhé! ✨</span>
                </div>
              ) : (
                summaries.map((kid, idx) => (
                  <div
                    key={kid.kidName}
                    onClick={() => onSelectKid && onSelectKid(kid.kidName, kid.kidAvatar)}
                    className="p-2.5 rounded-2xl bg-white hover:bg-orange-50/70 border border-amber-200/90 shadow-2xs flex items-center justify-between gap-2.5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-stone-100 text-[11px] font-black font-bubbly text-stone-600 flex items-center justify-center shrink-0">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                      </span>
                      <span className="text-xl shrink-0">{kid.kidAvatar}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black font-bubbly text-xs text-stone-900 group-hover:text-orange-600 truncate">
                            {kid.kidName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-stone-400 font-medium">
                          <span>{kid.totalGamesPlayed} ván</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-bold">
                            {kid.stickersEarned.length} sticker
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black font-bubbly text-sm text-orange-600 block leading-tight">
                        {kid.totalScore} đ
                      </span>
                      <div className="flex items-center gap-0.5 justify-end text-amber-400 text-[10px]">
                        {[...Array(Math.min(kid.totalStars, 3))].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : records.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400">
                <span>Chưa có lịch sử ván chơi nào.</span>
              </div>
            ) : (
              records.map((rec) => (
                <div
                  key={rec.id}
                  className="p-2.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex items-center justify-between gap-2 text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">{rec.kidAvatar}</span>
                    <div className="min-w-0">
                      <span className="font-black font-bubbly text-xs text-stone-900 block truncate">
                        {rec.kidName}
                      </span>
                      <span className="text-[10px] text-stone-400 block truncate">
                        {rec.gameTitle} · {rec.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black font-bubbly text-xs text-orange-600 block">
                      +{rec.score} đ
                    </span>
                    <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full">
                      {rec.stickerEarned?.icon} {rec.stickerEarned?.name}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-2 border-t border-amber-200/80 space-y-2">
            <button
              onClick={() => {
                sounds.playPop();
                setShowShareModal(true);
              }}
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black font-bubbly text-xs tracking-wide shadow-md shadow-orange-500/20 hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Xuất Bảng Vinh Danh Gửi Phụ Huynh</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
              <span>Đồng bộ theo thời gian thực</span>
              <button
                onClick={handleReset}
                className="text-stone-400 hover:text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Làm mới ngày mới
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: XUẤT BẢNG VINH DANH GỬI PHỤ HUYNH */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#FFFDF9] via-amber-50/70 to-orange-50/80 rounded-[36px] border-[4px] border-white shadow-2xl p-5 sm:p-6 text-center animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-200 text-xs font-black font-bubbly mb-2">
              <span>🏆 BÁO CÁO VINH DANH NGÀY HỌC</span>
            </div>

            <h3 className="text-xl font-black font-bubbly text-stone-900">
              Vinh Danh Lớp Tiếng Anh Hôm Nay 🎉
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Cô có thể chụp ảnh màn hình hoặc sao chép để gửi nhóm Zalo lớp học!
            </p>

            <div className="my-4 p-4 rounded-3xl bg-white border-2 border-orange-200 text-left space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="font-bold text-xs text-stone-500">Mầm AI · English Buddy</span>
                <span className="text-xs font-black text-orange-600">
                  {new Date().toLocaleDateString('vi-VN')}
                </span>
              </div>

              {/* Top Summary */}
              <div className="space-y-1.5">
                {summaries.slice(0, 5).map((kid, idx) => (
                  <div key={kid.kidName} className="flex items-center justify-between text-xs py-1">
                    <span className="font-bold text-stone-800 flex items-center gap-1.5">
                      <span>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '⭐'}</span>
                      <span>{kid.kidAvatar}</span>
                      <span>{kid.kidName}</span>
                    </span>
                    <span className="font-black font-bubbly text-orange-600">
                      {kid.totalScore} đ ({kid.stickersEarned.length} sticker)
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 italic text-center">
                &ldquo;Các bé hôm nay đã rất tự tin, phát âm to rõ và nhận được nhiều sticker đáng yêu!&rdquo;
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sounds.playSuccess();
                  handleCelebrateClass();
                  navigator.clipboard?.writeText(
                    `🏆 BẢNG VINH DANH TIẾNG ANH HÔM NAY (${new Date().toLocaleDateString('vi-VN')}):\n` +
                      summaries
                        .slice(0, 5)
                        .map((k, i) => `${i + 1}. ${k.kidName}: ${k.totalScore} điểm (${k.stickersEarned.length} sticker)`)
                        .join('\n') +
                      '\nChúc mừng các con đã hoàn thành xuất sắc bài học tiếng Anh cùng Mầm AI! 🌸'
                  );
                  alert('Đã sao chép nội dung vinh danh vào clipboard! Cô có thể dán vào nhóm Zalo phụ huynh.');
                }}
                className="py-2.5 px-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black font-bubbly text-xs shadow-md cursor-pointer transition-all"
              >
                Sao chép gửi Zalo 📋
              </button>

              <button
                onClick={() => setShowShareModal(false)}
                className="py-2.5 px-3 rounded-2xl bg-white border border-stone-200 text-stone-700 font-black font-bubbly text-xs hover:bg-stone-50 cursor-pointer transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

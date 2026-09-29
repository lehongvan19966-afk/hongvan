import React, { useState } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  Home,
  Heart,
  Clock,
  CheckCircle2,
  Volume2,
  Sparkles,
  MessageSquare,
  Smile,
  Send,
} from 'lucide-react';
import { speakText, sounds } from '../utils/audioUtils';

export const FamilyModeView: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [parentFeedback, setParentFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const activities = [
    {
      id: 1,
      title: 'Trò chơi: "Thợ săn màu cam"',
      time: '5 phút',
      description: 'Ba mẹ cùng bé đi quanh nhà và tìm 3 đồ vật có màu cam (quả cam, chiếc áo, đồ chơi). Khi tìm thấy, bé hãy đọc to từ tiếng Anh: "Orange!"',
      wordToSpeak: 'Orange',
    },
    {
      id: 2,
      title: 'Đọc thơ: "Quả cam của bé"',
      time: '3 phút',
      description: 'Cùng bé đọc bài thơ vần điệu: "Quả cam tròn xoe / Vỏ vàng óng ánh / Bé bóc từng múi / Tép ngọt lành thay!"',
      wordToSpeak: 'Quả cam tròn xoe, vỏ vàng óng ánh!',
      isVi: true,
    },
    {
      id: 3,
      title: 'Bàn tay khéo léo: "Vắt ly nước cam ngọt"',
      time: '7 phút',
      description: 'Bố mẹ chuẩn bị nửa quả cam và dụng cụ nhựa để con tự xoay vắt nước. Uống xong cùng con khen: "Yummy!"',
      wordToSpeak: 'Yummy and sweet',
    },
  ];

  const handleToggleTask = (id: number) => {
    sounds.playPop();
    if (completedTasks.includes(id)) {
      setCompletedTasks(completedTasks.filter((t) => t !== id));
    } else {
      sounds.playSuccess();
      setCompletedTasks([...completedTasks, id]);
    }
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentFeedback.trim()) return;
    sounds.playSuccess();
    setFeedbackSent(true);
    setParentFeedback('');
    setTimeout(() => setFeedbackSent(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Top Banner - Warm Terracotta */}
      <div className="bg-gradient-to-r from-amber-100/90 via-[#FFF8F0] to-orange-100/80 rounded-3xl p-5 sm:p-7 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(180,83,9,0.06)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-orange-700 text-xs font-black mb-2 shadow-2xs border border-orange-200">
            <Home className="w-3.5 h-3.5 text-orange-600" />
            <span>Family Mode · Góc Đồng Hành Của Ba Mẹ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight font-['Quicksand']">
            Cùng Con 10 Phút Mỗi Ngày
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
            Gắn kết yêu thương · Không áp lực bài tập · Trải nghiệm vừa chơi vừa học tự nhiên
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <MamAiMascot size="lg" mood="happy" />
        </div>
      </div>

      {/* Daily Progress summary */}
      <div className="bg-white/95 rounded-3xl p-5 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-stone-500">Hoạt động hôm nay</span>
          <h3 className="text-base sm:text-lg font-black text-amber-950 mt-0.5 font-['Quicksand']">
            Đã hoàn thành {completedTasks.length}/{activities.length} trải nghiệm
          </h3>
        </div>
        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-black text-orange-600 font-['Quicksand']">
            {Math.round((completedTasks.length / activities.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Activity Cards List */}
      <div className="space-y-3.5">
        {activities.map((act) => {
          const isDone = completedTasks.includes(act.id);
          return (
            <div
              key={act.id}
              className={`p-5 rounded-3xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-white/95 border-amber-100/90 shadow-[0_4px_16px_rgba(180,83,9,0.05)] hover:border-orange-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                      {act.time}
                    </span>
                    <h4 className="font-black text-sm sm:text-base text-amber-950 font-['Quicksand']">
                      {act.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1 font-medium">
                    {act.description}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleTask(act.id)}
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-400'
                  }`}
                  title={isDone ? 'Đã xong' : 'Đánh dấu đã hoàn thành'}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>

              {/* Action buttons inside card */}
              <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-xs">
                {act.wordToSpeak && (
                  <button
                    onClick={() => speakText(act.wordToSpeak, 0.9, act.isVi ? 'vi-VN' : 'en-US')}
                    className="text-orange-700 font-bold hover:text-orange-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-orange-600" />
                    <span>Nghe mẫu phát âm / đọc thơ</span>
                  </button>
                )}
                {isDone && (
                  <span className="text-emerald-700 font-black text-[11px] ml-auto">
                    ✓ Bé đã hoàn thành xuất sắc!
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Parent Feedback to Teacher Form */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-3.5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-600" />
          <div>
            <h3 className="text-sm sm:text-base font-black text-amber-950 font-['Quicksand']">
              Gửi Phản Hồi Cho Cô Giáo
            </h3>
            <p className="text-[11px] text-stone-500 font-medium">
              Chia sẻ cảm xúc hoặc khoảnh khắc đáng yêu của bé khi thực hiện hoạt động tại nhà
            </p>
          </div>
        </div>

        <form onSubmit={handleSendFeedback} className="space-y-3">
          <textarea
            rows={3}
            value={parentFeedback}
            onChange={(e) => setParentFeedback(e.target.value)}
            placeholder="Ví dụ: Bé thích bài thơ quả cam lắm cô ơi, tối nào trước khi ngủ cũng bắt mẹ đọc cùng..."
            className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 text-stone-800"
          />

          <div className="flex items-center justify-between">
            {feedbackSent ? (
              <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Đã gửi lời nhắn đến cô giáo thành công!
              </span>
            ) : (
              <span className="text-[11px] text-stone-400 font-medium">
                Lời nhắn sẽ xuất hiện trong thông báo của cô giáo
              </span>
            )}

            <button
              type="submit"
              disabled={!parentFeedback.trim()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs shadow-md disabled:opacity-40 flex items-center gap-1.5 cursor-pointer hover:scale-102 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi cho cô</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

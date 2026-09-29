import React from 'react';
import { Bell, X } from 'lucide-react';
import { sounds } from '../utils/audioUtils';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Học liệu của cô vừa được áp dụng!',
      description: 'Cô Nguyễn Mai Hương vừa bấm "Đã dùng tại lớp" giáo án Khám phá quả cam.',
      time: '15 phút trước',
      icon: '🌸',
      tab: 'library',
    },
    {
      id: 2,
      title: 'Huy hiệu mới đã mở khóa! 🏆',
      description: 'Chúc mừng cô đạt huy hiệu "Cô giáo sáng tạo" sau khi tạo 5 giáo án AI.',
      time: '2 giờ trước',
      icon: '✨',
      tab: 'profile',
    },
    {
      id: 3,
      title: 'Bài học mới tại AI Academy',
      description: 'Level 2 vừa mở thêm bài: Kỹ thuật giữ nhân vật nhất quán qua nhiều trang sách tranh.',
      time: 'Hôm qua',
      icon: '🎓',
      tab: 'academy',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-16 sm:pt-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-200/90 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            <h3 className="font-black text-amber-950 text-sm sm:text-base font-['Quicksand']">
              Thông Báo Mới (3)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center text-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                sounds.playPop();
                onClose();
                onNavigate(n.tab);
              }}
              className="p-3 rounded-2xl bg-amber-50/40 hover:bg-orange-50/70 border border-amber-100 hover:border-amber-200 cursor-pointer transition-all flex items-start gap-3 text-xs"
            >
              <span className="text-2xl shrink-0">{n.icon}</span>
              <div className="space-y-0.5 flex-1">
                <h4 className="font-black text-amber-950 font-['Quicksand']">{n.title}</h4>
                <p className="text-stone-600 leading-relaxed text-[11px] font-medium">
                  {n.description}
                </p>
                <span className="text-[10px] text-orange-700 font-bold block pt-1">
                  {n.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

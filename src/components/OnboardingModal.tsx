import React, { useState } from 'react';
import { MamAiMascot } from './MamAiMascot';
import { ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audioUtils';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [slide, setSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'Cô Học AI Thật Dễ Dàng',
      subtitle: 'Trợ lý thông minh đồng hành',
      description:
        'Hệ sinh thái video bài giảng và học liệu AI phong phú không giới hạn. Mỗi bài giảng có video thực hành, prompt mẫu 1-chạm và AI Mentor giải đáp thông minh.',
      mood: 'teaching' as const,
    },
    {
      title: 'Soạn Giáo Án & Học Liệu Siêu Tốc',
      subtitle: 'Chuẩn 5 bước Bộ GD&ĐT',
      description:
        'Chỉ cần nhập tên hoạt động: AI tự động sinh giáo án 5 bước lấy trẻ làm trung tâm, kèm thẻ flashcard 3D, quiz tương tác và trò chơi vận động.',
      mood: 'happy' as const,
    },
    {
      title: 'Tiếng Anh Đến Với Trẻ Thật Tự Nhiên',
      subtitle: 'English Buddy mầm non',
      description:
        'Không áp lực ngữ pháp hàn lâm! Trẻ học qua 4 từ vựng ngắn, trò chơi phản xạ, điệu hò vè vui tươi và Pronunciation Coach sửa phát âm tự tin.',
      mood: 'celebrate' as const,
    },
    {
      title: 'Cùng Cộng Đồng Giáo Viên Chia Sẻ',
      subtitle: 'Kho báu học liệu mở',
      description:
        'Khám phá hàng trăm tài liệu đã được kiểm chứng hiệu quả tại lớp. Cô chia sẻ 1 ý tưởng – hàng trăm trẻ thơ được đón nhận giờ học vui.',
      mood: 'celebrate' as const,
    },
  ];

  const current = slides[slide];

  const handleNext = () => {
    sounds.playPop();
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      sounds.playSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/45 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200/90 space-y-6 text-center">
        {/* Slide Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                slide === idx ? 'w-6 bg-gradient-to-r from-amber-500 to-orange-600' : 'w-2 bg-stone-200'
              }`}
            />
          ))}
        </div>

        {/* Mascot Centerpiece */}
        <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          <MamAiMascot size="xl" mood={current.mood} />
        </div>

        {/* Text Content */}
        <div className="space-y-1.5">
          <span className="text-xs font-black text-orange-700 uppercase tracking-wider">
            {current.subtitle}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight font-['Quicksand']">
            {current.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1 max-w-xs mx-auto font-medium">
            {current.description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
          >
            Bỏ qua
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{slide === slides.length - 1 ? 'Bắt đầu ngay 🌸' : 'Tiếp theo'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import { Pixar3DIcon, PixarIconType } from '../components/Pixar3DIcon';
import { ArrowRight, Sparkles, Wand2 } from 'lucide-react';
import { sounds } from '../utils/audioUtils';

interface AiCreateHubViewProps {
  onSelectTool: (toolId: string) => void;
}

export const AiCreateHubView: React.FC<AiCreateHubViewProps> = ({ onSelectTool }) => {
  const tools: Array<{
    id: string;
    title: string;
    subtitle: string;
    iconName: PixarIconType;
    badge: string;
  }> = [
    {
      id: 'lesson-studio',
      title: 'Giáo Án AI',
      subtitle: 'Soạn giáo án mầm non chuẩn 5 bước lấy trẻ làm trung tâm',
      iconName: 'lesson',
      badge: 'Khuyên dùng',
    },
    {
      id: 'magic-learning',
      title: 'Học Liệu AI',
      subtitle: 'Biến ảnh, truyện, bài thơ thành tài liệu tương tác cho bé',
      iconName: 'magic',
      badge: 'Đa năng',
    },
    {
      id: 'game-builder',
      title: 'Game AI Builder',
      subtitle: 'Tạo game matching, kéo thả, phân loại đồ vật vui nhộn',
      iconName: 'game',
      badge: 'Tương tác',
    },
    {
      id: 'quiz-generator',
      title: 'Quiz AI Nhận Biết',
      subtitle: 'Câu đố hình ảnh sinh động có giọng đọc và phản hồi tích cực',
      iconName: 'quiz',
      badge: 'Đánh giá vui',
    },
    {
      id: 'english-buddy',
      title: 'English Buddy',
      subtitle: 'Tích hợp 4 từ vựng & câu khẩu lệnh song ngữ tự nhiên',
      iconName: 'english',
      badge: 'Song ngữ',
    },
    {
      id: 'teaching-pack',
      title: 'Teaching Pack',
      subtitle: 'Sinh trọn gói Kịch bản + Thơ + Flashcard + Game 1-chạm',
      iconName: 'pack',
      badge: 'WOW Flow',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Top Banner with Warm Caramel-Peach Gradient */}
      <div className="bg-gradient-to-r from-amber-100/90 via-[#FFF8F0] to-orange-100/80 rounded-3xl p-5 sm:p-7 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(180,83,9,0.06)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-orange-700 text-xs font-black mb-2 shadow-2xs border border-orange-200">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>AI Studio · Không Gian Sáng Tạo Mầm Non</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight font-['Quicksand']">
            Cô Muốn Sáng Tạo Gì Hôm Nay?
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
            Chọn 1 trong 6 hòn đảo sáng tạo AI chuyên biệt cho giáo dục mầm non Việt Nam
          </p>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <MamAiMascot size="lg" mood="celebrate" />
        </div>
      </div>

      {/* 6 Studio Islands Grid (Mỗi mục chức năng trên mỗi hòn đảo nhỏ) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t) => {
          return (
            <div
              key={t.id}
              onClick={() => {
                sounds.playPop();
                onSelectTool(t.id);
              }}
              className="group p-5 rounded-3xl bg-white/95 border border-amber-100/90 hover:border-orange-300 shadow-[0_4px_16px_rgba(180,83,9,0.05)] hover:shadow-[0_8px_24px_rgba(234,88,12,0.12)] hover:-translate-y-1 active:scale-95 cursor-pointer transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  {/* 3D Cute Icon on Top of the Island */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-100/60 p-2 flex items-center justify-center border border-amber-200/50 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300 shadow-2xs">
                    <Pixar3DIcon name={t.iconName} size="md" animate={false} />
                  </div>
                  <span className="text-[10px] font-black text-orange-800 bg-orange-100 px-2.5 py-1 rounded-full border border-orange-200 shadow-2xs">
                    {t.badge}
                  </span>
                </div>

                {/* Name & Subtitle Below */}
                <h3 className="font-black text-base sm:text-lg text-amber-950 tracking-tight font-['Quicksand'] group-hover:text-orange-600 transition-colors">
                  {t.title}
                </h3>
                <p className="text-xs text-stone-600 font-medium mt-1 leading-relaxed">
                  {t.subtitle}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-amber-100/80 flex items-center justify-between text-xs font-black text-orange-600 group-hover:translate-x-1 transition-transform">
                <span>Khám phá ngay</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

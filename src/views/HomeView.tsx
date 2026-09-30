import React, { useState } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import { CuteSproutCharacter } from '../components/CuteSproutCharacter';
import { PixarSproutWithKidsLaptop } from '../components/PixarSproutWithKidsLaptop';
import { AiTechLeftIllustration } from '../components/AiTechLeftIllustration';
import { AiTechRightIllustration } from '../components/AiTechRightIllustration';
import { Pixar3DIcon, PixarIconType } from '../components/Pixar3DIcon';
import { ChibiPreschoolKid, ChibiCharacterId } from '../components/ChibiPreschoolKid';
import { Cute3DFunctionIllustration } from '../components/Cute3DFunctionIllustration';
import {
  ArrowRight,
  Flame,
  Sparkles,
  Heart,
  Users,
  ShieldCheck,
  ChevronRight,
  Smile,
} from 'lucide-react';
import { UserProfile, ResourceItem } from '../types';
import { sounds } from '../utils/audioUtils';
import { useAuth } from '../context/AuthContext';

interface HomeViewProps {
  user: UserProfile;
  onNavigate: (tab: string, extra?: Record<string, unknown>) => void;
  resources: ResourceItem[];
}

export const HomeView: React.FC<HomeViewProps> = ({ user, onNavigate, resources }) => {
  const [hoveredIslandId, setHoveredIslandId] = useState<string | null>(null);
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [homeSectionTab, setHomeSectionTab] = useState<'all' | 'teacher' | 'student'>('all');
  const { openPostLoginModal, todayEmotion } = useAuth();

  // Check if user has uploaded or cached videos
  const [latestVideo] = useState<{ id: string; title: string; desc: string; topic: string } | null>(() => {
    try {
      const userCached = localStorage.getItem('vuon_uom_user_uploaded_videos');
      if (userCached) {
        const parsed = JSON.parse(userCached);
        if (parsed.length > 0) {
          const v = parsed[0];
          return { id: v.id, title: v.title, desc: v.description, topic: v.topic };
        }
      }
      const allCached = localStorage.getItem('vuon_uom_cached_videos');
      if (allCached) {
        const parsed = JSON.parse(allCached);
        if (parsed.length > 0) {
          const v = parsed[0];
          return { id: v.id, title: v.title, desc: v.description, topic: v.topic };
        }
      }
    } catch {}
    return null;
  });

  // 1. PHÂN HỆ GIÁO VIÊN: Soạn giáo án, Hướng dẫn học AI từ cơ bản tới nâng cao, Luyện AI mỗi ngày
  const teacherIslands: Array<{
    id: string;
    title: string;
    subtitle: string;
    iconName: PixarIconType;
    badge: string;
    chibiId: ChibiCharacterId;
    kidName: string;
    kidGender: string;
    greeting: string;
    cloudColorName: string;
    cloudGradientTop: string;
    cloudGradientBottom: string;
    accentColor: string;
    cardBg: string;
    cardBorder: string;
    cardShadow: string;
    titleColor: string;
    badgeBg: string;
    badgeText: string;
    haloColor: string;
    aiBadge: string;
  }> = [
    {
      id: 'lesson-studio',
      title: 'Soạn Giáo Án',
      subtitle: 'Chuẩn 5 bước Bộ GD&ĐT tích hợp AI',
      iconName: 'lesson',
      badge: 'AI Soạn 30s',
      chibiId: 'mai-lesson',
      kidName: 'Bé Mai',
      kidGender: 'Bé gái',
      greeting: 'Chào cô! Bé cùng cô soạn bài 5 bước chuẩn Bộ nhé 🌸',
      cloudColorName: 'Hồng Đào',
      cloudGradientTop: '#FF758C',
      cloudGradientBottom: '#FFA8B6',
      accentColor: '#F43F5E',
      cardBg: 'from-[#FFF1F3] via-rose-50/80 to-[#FFE4E8]',
      cardBorder: 'border-rose-200/90 hover:border-rose-400',
      cardShadow: 'shadow-[0_8px_24px_rgba(244,63,94,0.12)] hover:shadow-[0_16px_32px_rgba(244,63,94,0.22)]',
      titleColor: 'text-rose-950 group-hover:text-rose-600',
      badgeBg: 'bg-rose-500',
      badgeText: 'text-white',
      haloColor: 'bg-rose-300/30',
      aiBadge: '✨ AI Hỗ Trợ 100%',
    },
    {
      id: 'academy',
      title: 'Hướng Dẫn Học AI Từ Cơ Bản Tới Nâng Cao',
      subtitle: 'Lộ trình video học AI bài bản cho cô giáo',
      iconName: 'academy',
      badge: 'Video Khóa Học',
      chibiId: 'linh-academy',
      kidName: 'Bé An',
      kidGender: 'Bé trai',
      greeting: 'Cô ơi, cùng xem video học AI từ số 0 đến làm chủ nhé! 🎓',
      cloudColorName: 'Xanh Biển Tri Thức',
      cloudGradientTop: '#38BDF8',
      cloudGradientBottom: '#0284C7',
      accentColor: '#0284C7',
      cardBg: 'from-[#F0F9FF] via-sky-50/80 to-[#E0F2FE]',
      cardBorder: 'border-sky-200/90 hover:border-sky-400',
      cardShadow: 'shadow-[0_8px_24px_rgba(2,132,199,0.12)] hover:shadow-[0_16px_32px_rgba(2,132,199,0.22)]',
      titleColor: 'text-sky-950 group-hover:text-sky-600',
      badgeBg: 'bg-sky-600',
      badgeText: 'text-white',
      haloColor: 'bg-sky-300/30',
      aiBadge: '✨ AI Đồng Hành',
    },
    {
      id: 'daily-practice',
      title: 'Luyện AI Mỗi Ngày',
      subtitle: 'Thử thách 5 phút prompt, tạo ảnh & video AI',
      iconName: 'daily-practice',
      badge: 'Thử Thách 5p',
      chibiId: 'phuc-practice',
      kidName: 'Bé Phúc',
      kidGender: 'Bé trai',
      greeting: 'Cô ơi, cùng luyện 1 bài tập AI hôm nay nha! 🔥',
      cloudColorName: 'Cam Lửa Nhiệt Huyết',
      cloudGradientTop: '#F97316',
      cloudGradientBottom: '#EF4444',
      accentColor: '#DC2626',
      cardBg: 'from-[#FFF7ED] via-orange-50/80 to-[#FFEDD5]',
      cardBorder: 'border-orange-200/90 hover:border-orange-400',
      cardShadow: 'shadow-[0_8px_24px_rgba(249,115,22,0.12)] hover:shadow-[0_16px_32px_rgba(249,115,22,0.22)]',
      titleColor: 'text-orange-950 group-hover:text-orange-600',
      badgeBg: 'bg-gradient-to-r from-red-500 to-orange-500',
      badgeText: 'text-white',
      haloColor: 'bg-orange-300/30',
      aiBadge: '✨ AI Đánh Giá Prompt',
    },
  ];

  // 2. PHÂN HỆ HỌC SINH: Trò chơi tương tác, Học tiếng Anh, Tạo thơ truyện
  const studentIslands: Array<{
    id: string;
    title: string;
    subtitle: string;
    iconName: PixarIconType;
    badge: string;
    chibiId: ChibiCharacterId;
    kidName: string;
    kidGender: string;
    greeting: string;
    cloudColorName: string;
    cloudGradientTop: string;
    cloudGradientBottom: string;
    accentColor: string;
    cardBg: string;
    cardBorder: string;
    cardShadow: string;
    titleColor: string;
    badgeBg: string;
    badgeText: string;
    haloColor: string;
    aiBadge: string;
  }> = [
    {
      id: 'interactive-games',
      title: 'Trò Chơi Tương Tác',
      subtitle: '10 game cảm ứng mầm non đa giác quan',
      iconName: 'game',
      badge: '10 Game Mới',
      chibiId: 'bi-magic',
      kidName: 'Bé Bi',
      kidGender: 'Bé trai',
      greeting: 'Bé chạm tay chơi 10 trò chơi cảm ứng mầm non vui nhộn! 🎮',
      cloudColorName: 'Vàng Nắng Rực Rỡ',
      cloudGradientTop: '#FBBF24',
      cloudGradientBottom: '#F59E0B',
      accentColor: '#D97706',
      cardBg: 'from-[#FFFBEB] via-amber-50/80 to-[#FEF3C7]',
      cardBorder: 'border-amber-200/90 hover:border-amber-400',
      cardShadow: 'shadow-[0_8px_24px_rgba(245,158,11,0.12)] hover:shadow-[0_16px_32px_rgba(245,158,11,0.22)]',
      titleColor: 'text-amber-950 group-hover:text-amber-600',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-500',
      badgeText: 'text-white',
      haloColor: 'bg-amber-300/30',
      aiBadge: '✨ AI Tự Sinh Câu Hỏi Game',
    },
    {
      id: 'english-buddy',
      title: 'Học Tiếng Anh',
      subtitle: 'English Buddy song ngữ mầm non vui nhộn',
      iconName: 'english',
      badge: 'Song Ngữ AI',
      chibiId: 'nam-english',
      kidName: 'Bé Nam',
      kidGender: 'Bé trai',
      greeting: 'Hello Teacher! Let\'s learn English with AI! 🌎',
      cloudColorName: 'Xanh Bạc Hà',
      cloudGradientTop: '#34D399',
      cloudGradientBottom: '#10B981',
      accentColor: '#059669',
      cardBg: 'from-[#ECFDF5] via-emerald-50/80 to-[#D1FAE5]',
      cardBorder: 'border-emerald-200/90 hover:border-emerald-400',
      cardShadow: 'shadow-[0_8px_24px_rgba(16,185,129,0.12)] hover:shadow-[0_16px_32px_rgba(16,185,129,0.22)]',
      titleColor: 'text-emerald-950 group-hover:text-emerald-600',
      badgeBg: 'bg-emerald-500',
      badgeText: 'text-white',
      haloColor: 'bg-emerald-300/30',
      aiBadge: '✨ AI Phát Âm Chuẩn',
    },
    {
      id: 'story-poem-creator',
      title: 'Tạo Thơ Truyện',
      subtitle: 'AI tạo thơ có ảnh 3D & câu chuyện bằng video từ câu lệnh',
      iconName: 'pack',
      badge: 'Thơ Truyện AI',
      chibiId: 'an-pack',
      kidName: 'Bé An',
      kidGender: 'Bé gái',
      greeting: 'Chỉ cần câu lệnh là AI tạo thơ 3D và video truyện cho bé nha! 📖🎬',
      cloudColorName: 'Tím Hoa Cà',
      cloudGradientTop: '#C084FC',
      cloudGradientBottom: '#A855F7',
      accentColor: '#9333EA',
      cardBg: 'from-[#FAF5FF] via-purple-50/80 to-[#F3E8FF]',
      cardBorder: 'border-purple-200/90 hover:border-purple-400',
      cardShadow: 'shadow-[0_8px_24px_rgba(168,85,247,0.12)] hover:shadow-[0_16px_32px_rgba(168,85,247,0.22)]',
      titleColor: 'text-purple-950 group-hover:text-purple-600',
      badgeBg: 'bg-purple-600',
      badgeText: 'text-white',
      haloColor: 'bg-purple-300/30',
      aiBadge: '✨ AI Tạo Thơ 3D & Video',
    },
    {
      id: 'be-vui-hoc',
      title: 'Bé Vui Học',
      subtitle: 'Chữ số, Rèn tư duy logic theo môn học & Khám phá AI lưu kết quả',
      iconName: 'magic',
      badge: 'Tư Duy & Khám Phá AI',
      chibiId: 'mai-lesson',
      kidName: 'Bé Mai',
      kidGender: 'Bé gái',
      greeting: 'Cùng bé học chữ số, luyện tư duy logic & khám phá thế giới cùng AI nhé! 🧠🚀',
      cloudColorName: 'Hồng San Hô',
      cloudGradientTop: '#F43F5E',
      cloudGradientBottom: '#E11D48',
      accentColor: '#BE123C',
      cardBg: 'from-[#FFF1F2] via-rose-50/80 to-[#FFE4E6]',
      cardBorder: 'border-rose-200/90 hover:border-rose-400',
      cardShadow: 'shadow-[0_8px_24px_rgba(244,63,94,0.12)] hover:shadow-[0_16px_32px_rgba(244,63,94,0.22)]',
      titleColor: 'text-rose-950 group-hover:text-rose-600',
      badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      badgeText: 'text-white',
      haloColor: 'bg-rose-300/30',
      aiBadge: '✨ Rèn Tư Duy & AI Khám Phá',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-20">
      {/* 1. HORIZONTAL AI TECH BLUE COVER BANNER (Ảnh bìa xanh dương công nghệ AI & thiết kế chuyên nghiệp) */}
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#020b1e] via-[#051a3d] via-[#072457] to-[#020b1e] border-2 sm:border-[2.5px] border-cyan-400/50 p-4 sm:p-6 md:p-8 shadow-[0_20px_60px_rgba(2,132,199,0.32)] text-center">
        {/* Subtle Cyber Architectural Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        {/* Soft Ambient Lens Blooms */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-sky-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Floating AI & Tech Micro-Accents */}
        <div className="absolute top-16 left-6 text-xl sm:text-2xl opacity-75 animate-pulse pointer-events-none select-none text-cyan-300">⚡</div>
        <div className="absolute bottom-6 left-8 text-lg opacity-60 pointer-events-none select-none text-sky-200">✦</div>
        <div className="absolute top-16 right-8 text-xl sm:text-2xl opacity-75 animate-pulse pointer-events-none select-none text-amber-300">✨</div>
        <div className="absolute bottom-6 right-10 text-lg opacity-60 pointer-events-none select-none text-cyan-200">🤖</div>

        {/* A. THANH ĐIỀU HƯỚNG & ĐƠN VỊ TRÊN CÙNG (TOP INSTITUTIONAL BAR) */}
        <div className="relative z-20 w-full flex items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-white/10 flex-wrap sm:flex-nowrap">
          {/* Tên trường mầm non với huy hiệu vàng kim trang trọng */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-300/30 shadow-xs">
            <span className="text-amber-400 text-sm sm:text-base">🏫</span>
            <span className="text-xs sm:text-sm font-black tracking-wide uppercase text-amber-200 font-['Quicksand'] whitespace-nowrap drop-shadow-sm">
              TRƯỜNG MẦM NON LIÊN MINH A
            </span>
          </div>

          {/* Dấu hiệu chuyển đổi số Thủ Đô 2026 */}
          <div className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 backdrop-blur-md border border-cyan-400/40 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span className="text-[11px] sm:text-xs font-black tracking-wider text-cyan-200 uppercase font-['Quicksand'] whitespace-nowrap">
              CHUYỂN ĐỔI SỐ GDMN THỦ ĐÔ 2026
            </span>
          </div>

          {/* Thao tác chọn ngôn ngữ Tiếng Việt & English chuẩn kính mờ */}
          <div className="inline-flex items-center p-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-xs">
            <button
              onClick={() => {
                sounds.playPop();
                setLanguage('vi');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black font-bubbly transition-all cursor-pointer ${
                language === 'vi'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm scale-102 ring-1 ring-white/50'
                  : 'text-stone-300 hover:text-white'
              }`}
              title="Chuyển sang Tiếng Việt"
            >
              <span>🇻🇳</span>
              <span>Tiếng Việt</span>
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setLanguage('en');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black font-bubbly transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm scale-102 ring-1 ring-white/50'
                  : 'text-stone-300 hover:text-white'
              }`}
              title="Switch to English"
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
          </div>
        </div>

        {/* B. KHU VỰC TIÊU ĐỀ CHÍNH RỘNG TOÀN KHUNG: VIẾT NGANG TRÊN 1 DÒNG KHÔNG XUỐNG DÒNG */}
        <div className="relative z-10 w-full pt-4 sm:pt-6 pb-2 flex flex-col items-center justify-center space-y-1 sm:space-y-2">
          {/* Nhãn giới thiệu chuyên nghiệp */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-200 text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-xs">
            <span>✦</span>
            <span>NỀN TẢNG GIÁO DỤC THÔNG MINH & TRÍ TUỆ NHÂN TẠO 4.0</span>
            <span>✦</span>
          </div>

          {/* TIÊU ĐỀ CHÍNH VIẾT NGANG DUY NHẤT 1 DÒNG - TUYỆT ĐỐI KHÔNG XUỐNG DÒNG (WHITESPACE-NOWRAP) */}
          <h1 className="w-full text-center font-black uppercase tracking-normal sm:tracking-wide md:tracking-wider whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#FFFBEB] via-[#FDE047] via-[#F59E0B] via-[#FDE047] to-[#FFFBEB] drop-shadow-[0_2px_22px_rgba(245,158,11,0.55)] text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-[44px] leading-tight select-none py-1">
            HỆ SINH THÁI GIÁO DỤC MẦM NON THÔNG MINH
          </h1>

          {/* Tên thương hiệu nhận diện "MẦM AI" to nổi bật và sắc nét */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 my-0.5">
            <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black font-bubbly tracking-wider leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-sky-300 drop-shadow-[0_6px_28px_rgba(56,189,248,0.6)] whitespace-nowrap">
              MẦM AI
            </span>
            <span className="self-center px-2.5 sm:px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/30 border border-cyan-300/40 text-cyan-200 text-[10px] sm:text-xs md:text-sm font-black tracking-widest uppercase shadow-xs whitespace-nowrap">
              EDTECH 4.0
            </span>
          </div>

          {/* Khẩu hiệu phụ viết ngang một dòng gọn gàng */}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-sky-100/95 tracking-wide font-['Quicksand'] drop-shadow-sm whitespace-nowrap text-center">
            Học vui – Chơi sáng tạo – Trải nghiệm cùng Trí tuệ Nhân tạo
          </p>
        </div>

        {/* C. BỐ CỤC 3 KHỐI NGHỆ THUẬT 3D CÂN ĐỐI (TRÁI: ROBOT AI · GIỮA: BÉ MẦM LAPTOP · PHẢI: ROBOT CÔ GIÁO) */}
        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6 pt-1 sm:pt-2">
          {/* CỘT TRÁI: MINH HỌA CÔNG NGHỆ AI (ROBOT HỌA SĨ, NEURAL CORE, SINH TRANH AI) */}
          <div className="hidden lg:flex flex-col items-center justify-center shrink-0 w-52 xl:w-64">
            <AiTechLeftIllustration className="w-full transform hover:scale-105 transition-transform duration-300" />
          </div>

          {/* CỘT GIỮA: NGHỆ THUẬT 3D PIXAR BÉ MẦM CÙNG CÁC BẠN NHỎ MẦM NON */}
          <div className="flex-1 max-w-xl sm:max-w-2xl mx-auto flex flex-col items-center justify-center">
            <div className="w-full transform hover:scale-[1.02] transition-transform duration-300 drop-shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
              <PixarSproutWithKidsLaptop className="w-full" />
            </div>
          </div>

          {/* CỘT PHẢI: MINH HỌA CÔNG NGHỆ AI (ROBOT GIÁO VIÊN AI, VIDEO STORY, HOLOGRAPHIC SCREEN) */}
          <div className="hidden lg:flex flex-col items-center justify-center shrink-0 w-52 xl:w-64">
            <AiTechRightIllustration className="w-full transform hover:scale-105 transition-transform duration-300" />
          </div>
        </div>

        {/* D. KHU VỰC CÁC NÚT THAO TÁC CHUYÊN NGHIỆP & ĐỒNG BỘ */}
        <div className="relative z-10 pt-3 sm:pt-4 flex flex-col items-center justify-center space-y-3">
          {/* Hàng nút hành động chính */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <button
              onClick={() => {
                sounds.playPop();
                onNavigate('ai-assistant');
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs sm:text-sm font-black font-bubbly transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-[0_4px_25px_rgba(245,158,11,0.5)] border-2 border-white/90"
            >
              <span className="text-base">🤖</span>
              <span>MỤC TRỢ LÝ AI MẦM NON (Hỏi đáp độ tuổi & chủ đề) ➔</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                openPostLoginModal();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-cyan-300/40 text-white text-xs sm:text-sm font-bold font-bubbly transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
            >
              <span>🌸</span>
              <span>
                {todayEmotion === 'vui'
                  ? 'Cảm xúc hôm nay: Vui vẻ 😄'
                  : todayEmotion === 'buon'
                  ? 'Cảm xúc hôm nay: Buồn 🥺'
                  : todayEmotion === 'de-thuong'
                  ? 'Cảm xúc hôm nay: Dễ thương 🥰'
                  : 'Bảng cảm xúc & Khám phá AI ➔'}
              </span>
            </button>
          </div>

          {/* Hàng nút kết nối cộng đồng & Zalo */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            <a
              href="https://facebook.com/groups/mam.ai.giaovien.mamnon"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playPop()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1877F2]/85 hover:bg-[#1877F2] text-white text-xs font-black font-bubbly transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm border border-white/20"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Nhóm Facebook (12.5K cô)</span>
            </a>

            <button
              onClick={() => {
                sounds.playPop();
                onNavigate('community');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0068FF]/85 hover:bg-[#0068FF] text-white text-xs font-black font-bubbly transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm border border-cyan-300/40"
            >
              <span className="font-black text-[10px] bg-white text-[#0068FF] px-1.5 py-0.2 rounded-md">Zalo</span>
              <span>Nhóm Zalo & Quét QR</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                onNavigate('community');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-cyan-200 text-xs font-black font-bubbly transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
            >
              <span>👥 Mục Cộng Đồng</span>
              <span>➔</span>
            </button>
          </div>

          {/* Dấu hiệu công nghệ AI hiển thị tinh tế trên di động */}
          <div className="flex lg:hidden items-center justify-center gap-2 pt-1 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-400/50 text-[11px] font-black text-cyan-200 shadow-sm">
              <span>⚡ AI 4.0</span>
              <span>• Sinh tranh & Giáo án</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-400/50 text-[11px] font-black text-sky-200 shadow-sm">
              <span>🎬 Video Story AI</span>
              <span>• Trợ lý cô</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* THANH CÔNG CỤ NGAY PHÍA DƯỚI ẢNH BÌA */}
      {/* Nền xanh đậm + Các ô vuông bo tròn cạnh màu xanh dương nhạt cho nổi */}
      {/* Chữ in hoa màu trắng: TRANG CHỦ, HỌC AI, TẠO VỚI AI, KHO HỌC LIỆU, CỘNG ĐỒNG, CỦA TÔI */}
      {/* ======================================================== */}
      <div className="rounded-[28px] sm:rounded-[36px] bg-gradient-to-r from-[#010e28] via-[#041d4c] via-[#072c6e] via-[#041d4c] to-[#010e28] border-2 sm:border-[3px] border-cyan-400 p-3 sm:p-5 shadow-[0_16px_45px_rgba(1,14,40,0.65)]">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3.5">
          {[
            { id: 'home', label: 'TRANG CHỦ', icon: '🏠', action: 'home' },
            { id: 'academy', label: 'HỌC AI', icon: '🎓', action: 'academy' },
            { id: 'create-hub', label: 'TẠO VỚI AI', icon: '✨', action: 'create-hub' },
            { id: 'library', label: 'KHO HỌC LIỆU', icon: '📚', action: 'library' },
            { id: 'community', label: 'CỘNG ĐỒNG', icon: '👥', action: 'community' },
            { id: 'profile', label: 'CỦA TÔI', icon: '👤', action: 'profile' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                sounds.playPop();
                if (item.action === 'home') {
                  const el = document.getElementById('islands-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onNavigate(item.action);
                }
              }}
              className="group aspect-square sm:aspect-auto sm:min-h-[110px] p-2.5 sm:p-4 rounded-2xl sm:rounded-[26px] flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-gradient-to-b from-[#38BDF8] via-[#0EA5E9] to-[#0284C7] hover:from-[#7DD3FC] hover:to-[#0EA5E9] border-[2.5px] border-white shadow-[0_8px_22px_rgba(14,165,233,0.5),inset_0_2px_4px_rgba(255,255,255,0.7)] hover:shadow-[0_12px_28px_rgba(56,189,248,0.7)] hover:scale-105 active:scale-95 text-white"
            >
              <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow-md group-hover:scale-115 transition-transform duration-300">
                {item.icon}
              </span>
              <span className="font-black text-[11px] sm:text-xs md:text-sm font-['Quicksand'] tracking-wider text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] whitespace-nowrap">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. DẢI THÔNG TIN HỌC ĐƯỜNG & CẢM XÚC */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 pt-1">
        {/* School badge, Emotion check-in shortcut, Streaks & XP */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold border border-amber-200/90 shadow-2xs font-bubbly flex items-center gap-1.5">
            <span>🏫</span>
            <span>{user.school.split('–')[0]}</span>
          </span>

          <button
            onClick={() => {
              sounds.playPop();
              openPostLoginModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-rose-50 to-pink-50 hover:bg-rose-100 border border-rose-200/90 rounded-2xl text-xs font-black text-rose-900 shadow-2xs cursor-pointer transition-all hover:scale-102"
            title="Mở bảng cảm xúc hôm nay"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
            <span className="font-bubbly">
              {todayEmotion === 'vui'
                ? 'Cảm xúc: Vui 😄'
                : todayEmotion === 'buon'
                ? 'Cảm xúc: Buồn 🥺'
                : todayEmotion === 'de-thuong'
                ? 'Cảm xúc: Dễ thương 🥰'
                : 'Bảng cảm xúc'}
            </span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl text-xs font-black text-amber-900 shadow-2xs font-bubbly">
            <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-pulse" />
            <span>Streak: {user.streakDays} ngày</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/90 rounded-2xl text-xs font-black text-amber-800 shadow-2xs font-bubbly">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{user.xp} XP</span>
          </div>
        </div>

        {/* Tab switch giữa Phần Giáo Viên và Phần Học Sinh */}
        <div className="inline-flex p-1 rounded-2xl bg-amber-100/70 border border-amber-200">
          <button
            onClick={() => {
              sounds.playPop();
              setHomeSectionTab('all');
            }}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
              homeSectionTab === 'all'
                ? 'bg-white text-amber-950 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setHomeSectionTab('teacher');
            }}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              homeSectionTab === 'teacher'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>👩‍🏫</span>
            <span>Phần Giáo Viên</span>
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setHomeSectionTab('student');
            }}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              homeSectionTab === 'student'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>👶</span>
            <span>Phần Học Sinh</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* HÒN ĐẢO CHỨC NĂNG: PHẦN GIÁO VIÊN VÀ PHẦN HỌC SINH */}
      {/* ======================================================== */}
      <div id="islands-section" className="space-y-8">
        {/* PHÂN HỆ 1: MỤC PHẦN GIÁO VIÊN */}
        {(homeSectionTab === 'all' || homeSectionTab === 'teacher') && (
          <section className="space-y-3.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-lg text-white shadow-md border-2 border-white">
                  👩‍🏫
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-rose-950 tracking-wide font-bubbly flex items-center gap-2">
                    <span>MỤC PHẦN GIÁO VIÊN</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-300">
                      AI Trợ Thủ 100%
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-500 font-bold font-['Quicksand']">
                    Soạn giáo án, Hướng dẫn học AI từ cơ bản đến nâng cao, Luyện AI mỗi ngày
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {teacherIslands.map((item, idx) => {
                const isEven = idx % 2 === 0;
                const isHovered = hoveredIslandId === item.id;

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => {
                      setHoveredIslandId(item.id);
                      sounds.playPop();
                    }}
                    onMouseLeave={() => setHoveredIslandId(null)}
                    onClick={() => {
                      sounds.playPop();
                      onNavigate(item.id);
                    }}
                    className={`group relative bg-gradient-to-b ${item.cardBg} rounded-[32px] sm:rounded-[36px] border-[3.5px] border-white ${item.cardShadow} p-4 sm:p-5 flex flex-col items-center text-center justify-between min-h-[255px] sm:min-h-[275px] transition-all duration-300 hover:-translate-y-2.5 hover:scale-[1.02] active:scale-95 cursor-pointer relative overflow-visible`}
                  >
                    <div className={`w-24 h-24 rounded-full blur-xl absolute -top-4 -right-4 pointer-events-none ${item.haloColor}`} />

                    <div
                      className={`absolute -top-10 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap bg-white px-3 py-1 rounded-2xl shadow-xl border-2 border-rose-400 text-[10px] sm:text-[11px] font-black font-bubbly text-rose-950 flex items-center gap-1 transition-all duration-300 pointer-events-none ${
                        isHovered
                          ? 'opacity-100 scale-100 translate-y-0'
                          : 'opacity-0 scale-75 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0'
                      }`}
                    >
                      <span>{item.greeting}</span>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-b-2 border-r-2 border-rose-400 rotate-45" />
                    </div>

                    <div className="w-full flex justify-between items-center relative z-10 px-1">
                      <span className="text-[10.5px] sm:text-[11px] font-bubbly font-black px-2.5 py-0.5 rounded-full bg-white/85 text-stone-700 border border-white shadow-2xs">
                        {item.kidName}
                      </span>
                      <span className={`text-[10px] sm:text-[10.5px] font-black font-bubbly px-2.5 py-0.5 rounded-full border-2 border-white shadow-xs ${item.badgeBg} ${item.badgeText}`}>
                        {item.badge}
                      </span>
                    </div>

                    <div
                      className={`relative w-full aspect-[16/12] max-w-[155px] sm:max-w-[175px] mx-auto flex items-center justify-center my-1.5 transition-transform duration-300 ${
                        isEven ? 'animate-float-cloud' : ''
                      }`}
                      style={!isEven ? { animation: 'float-cloud 3.5s ease-in-out 1.75s infinite' } : undefined}
                    >
                      {/* Minh họa 3D Kawaii đặc trưng theo đúng tên chức năng của mục */}
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                        <Cute3DFunctionIllustration id={item.id} isHovered={isHovered} />
                      </div>
                      <div className="relative z-10 w-20 h-24 sm:w-24 sm:h-28 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                        <ChibiPreschoolKid id={item.chibiId} isHovered={isHovered} />
                      </div>
                    </div>

                    <div className="w-full relative z-10 space-y-1">
                      <div className="inline-block px-2 py-0.5 rounded-md bg-white/90 text-rose-700 text-[10px] font-black tracking-wide border border-rose-200">
                        {item.aiBadge}
                      </div>
                      <h4 className={`text-base sm:text-lg font-black font-bubbly tracking-tight transition-colors line-clamp-1 ${item.titleColor}`}>
                        {item.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-stone-600 font-medium font-['Quicksand'] line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playPop();
                        onNavigate(item.id);
                      }}
                      className="mt-2 w-full py-2 px-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 font-black text-xs font-bubbly border-2 border-white shadow-xs group-hover:shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Mở Tính Năng</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* PHÂN HỆ 2: MỤC PHẦN HỌC SINH */}
        {(homeSectionTab === 'all' || homeSectionTab === 'student') && (
          <section className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-lg text-white shadow-md border-2 border-white">
                  👶
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-amber-950 tracking-wide font-bubbly flex items-center gap-2">
                    <span>MỤC PHẦN HỌC SINH</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black border border-amber-300">
                      Đa Giác Quan Vui Nhộn
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-500 font-bold font-['Quicksand']">
                    Trò chơi tương tác, Học tiếng Anh, Tạo thơ truyện & Bé vui học tô màu
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {studentIslands.map((item, idx) => {
                const isEven = idx % 2 === 0;
                const isHovered = hoveredIslandId === item.id;

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => {
                      setHoveredIslandId(item.id);
                      sounds.playPop();
                    }}
                    onMouseLeave={() => setHoveredIslandId(null)}
                    onClick={() => {
                      sounds.playPop();
                      onNavigate(item.id);
                    }}
                    className={`group relative bg-gradient-to-b ${item.cardBg} rounded-[32px] sm:rounded-[36px] border-[3.5px] border-white ${item.cardShadow} p-4 sm:p-5 flex flex-col items-center text-center justify-between min-h-[255px] sm:min-h-[275px] transition-all duration-300 hover:-translate-y-2.5 hover:scale-[1.02] active:scale-95 cursor-pointer relative overflow-visible`}
                  >
                    <div className={`w-24 h-24 rounded-full blur-xl absolute -top-4 -right-4 pointer-events-none ${item.haloColor}`} />

                    <div
                      className={`absolute -top-10 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap bg-white px-3 py-1 rounded-2xl shadow-xl border-2 border-amber-400 text-[10px] sm:text-[11px] font-black font-bubbly text-amber-950 flex items-center gap-1 transition-all duration-300 pointer-events-none ${
                        isHovered
                          ? 'opacity-100 scale-100 translate-y-0'
                          : 'opacity-0 scale-75 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0'
                      }`}
                    >
                      <span>{item.greeting}</span>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-b-2 border-r-2 border-amber-400 rotate-45" />
                    </div>

                    <div className="w-full flex justify-between items-center relative z-10 px-1">
                      <span className="text-[10.5px] sm:text-[11px] font-bubbly font-black px-2.5 py-0.5 rounded-full bg-white/85 text-stone-700 border border-white shadow-2xs">
                        {item.kidName}
                      </span>
                      <span className={`text-[10px] sm:text-[10.5px] font-black font-bubbly px-2.5 py-0.5 rounded-full border-2 border-white shadow-xs ${item.badgeBg} ${item.badgeText}`}>
                        {item.badge}
                      </span>
                    </div>

                    <div
                      className={`relative w-full aspect-[16/12] max-w-[155px] sm:max-w-[175px] mx-auto flex items-center justify-center my-1.5 transition-transform duration-300 ${
                        isEven ? 'animate-float-cloud' : ''
                      }`}
                      style={!isEven ? { animation: 'float-cloud 3.5s ease-in-out 1.75s infinite' } : undefined}
                    >
                      {/* Minh họa 3D Kawaii đặc trưng theo đúng tên chức năng của mục */}
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                        <Cute3DFunctionIllustration id={item.id} isHovered={isHovered} />
                      </div>
                      <div className="relative z-10 w-20 h-24 sm:w-24 sm:h-28 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                        <ChibiPreschoolKid id={item.chibiId} isHovered={isHovered} />
                      </div>
                    </div>

                    <div className="w-full relative z-10 space-y-1">
                      <div className="inline-block px-2 py-0.5 rounded-md bg-white/90 text-amber-700 text-[10px] font-black tracking-wide border border-amber-200">
                        {item.aiBadge}
                      </div>
                      <h4 className={`text-base sm:text-lg font-black font-bubbly tracking-tight transition-colors line-clamp-1 ${item.titleColor}`}>
                        {item.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-stone-600 font-medium font-['Quicksand'] line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>

                    {item.id === 'interactive-games' ? (
                      <div className="mt-2 w-full space-y-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.playPop();
                            onNavigate(item.id);
                          }}
                          className="w-full py-2 px-3 rounded-2xl bg-white hover:bg-amber-50 text-amber-900 font-black text-xs font-bubbly border-2 border-white shadow-xs group-hover:shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>🎮 Chơi 10 Game Cảm Ứng</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.playPop();
                            onNavigate('interactive-games', { setupQuestions: true });
                          }}
                          className="w-full py-1.5 px-2 rounded-xl bg-amber-100/90 hover:bg-amber-200 text-amber-950 font-black text-[11px] font-bubbly border border-amber-300 shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>⚙️ Điền Câu Hỏi Trước Khi Chơi</span>
                        </button>
                      </div>
                    ) : item.id === 'story-poem-creator' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playPop();
                          onNavigate(item.id);
                        }}
                        className="mt-2 w-full py-2 px-3 rounded-2xl bg-white hover:bg-purple-50 text-purple-900 font-black text-xs font-bubbly border-2 border-white shadow-xs group-hover:shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>✨ Tạo Thơ 3D & Video</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ) : item.id === 'be-vui-hoc' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playPop();
                          onNavigate(item.id);
                        }}
                        className="mt-2 w-full py-2 px-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-900 font-black text-xs font-bubbly border-2 border-white shadow-xs group-hover:shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>🎨 Vào Học & Tô Màu</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playPop();
                          onNavigate(item.id);
                        }}
                        className="mt-2 w-full py-2 px-3 rounded-2xl bg-white hover:bg-amber-50 text-amber-800 font-black text-xs font-bubbly border-2 border-white shadow-xs group-hover:shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Khám Phá Ngay</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Personalized For Teacher (Gợi ý riêng cho cô Vân) */}
      <section className="bg-gradient-to-br from-white via-amber-50/30 to-orange-50/40 rounded-3xl p-4 sm:p-6 border border-amber-200/70 shadow-[0_4px_16px_rgba(180,83,9,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
              💖
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-amber-950 tracking-tight font-['Quicksand']">
                Gợi Ý Dành Riêng Cho Cô {user.name.split(' ').pop()}
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
                Cá nhân hóa theo khối {user.ageGroup} và kế hoạch giáo dục tuần này
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('lesson-studio')}
            className="text-xs font-black text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            Tạo mới <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Card 1: Khám phá quả cam */}
          <div
            onClick={() =>
              onNavigate('lesson-studio', { topic: 'Khám phá quả cam', ageGroup: '4–5 tuổi (Lớp Chồi)' })
            }
            className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-2xs hover:shadow-sm hover:border-orange-300 hover:-translate-y-0.5 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-orange-600 mb-1.5">
                <span className="flex items-center gap-1">🍊 Chủ đề Thực vật · Lớp Chồi</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 font-bold">Hot</span>
              </div>
              <h4 className="font-black text-sm text-amber-950 font-['Quicksand']">
                Giáo án: Khám phá quả cam đa giác quan
              </h4>
              <p className="text-[11px] text-stone-600 font-medium mt-1 leading-relaxed line-clamp-2">
                Bé sờ vỏ sần sùi, ngửi tinh dầu thơm, nếm vị chua ngọt và học 3 từ tiếng Anh: Orange, Round, Sweet.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-[11px]">
              <span className="font-bold text-orange-600">142 cô đã áp dụng</span>
              <span className="text-stone-500 font-medium">25 phút · Chuẩn 5 bước</span>
            </div>
          </div>

          {/* Card 2: Teaching Pack */}
          <div
            onClick={() =>
              onNavigate('teaching-pack', { topic: 'Đôi bàn tay yêu thương', ageGroup: '4–5 tuổi' })
            }
            className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-2xs hover:shadow-sm hover:border-orange-300 hover:-translate-y-0.5 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-amber-700 mb-1.5">
                <span className="flex items-center gap-1">💐 Chủ đề Gia đình & Tình cảm</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold">1-Chạm</span>
              </div>
              <h4 className="font-black text-sm text-amber-950 font-['Quicksand']">
                Teaching Pack: Đôi bàn tay yêu thương
              </h4>
              <p className="text-[11px] text-stone-600 font-medium mt-1 leading-relaxed line-clamp-2">
                Trọn gói bài thơ 6 câu, 4 thẻ flashcard 3D, bài tập in màu và hoạt động 10 phút bố mẹ cùng chơi với bé.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-700">Gồm Family Mode</span>
              <span className="text-stone-500 font-medium">Trọn bộ 6 món</span>
            </div>
          </div>

          {/* Card 3: AI Academy */}
          <div
            onClick={() => onNavigate('academy', latestVideo ? { videoId: latestVideo.id } : undefined)}
            className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-2xs hover:shadow-sm hover:border-orange-300 hover:-translate-y-0.5 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-1.5">
                <span className="flex items-center gap-1">🎓 Hướng dẫn học AI từ cơ bản đến nâng cao</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                  {latestVideo ? '✓ Đã lưu an toàn' : 'Không giới hạn'}
                </span>
              </div>
              <h4 className="font-black text-sm text-amber-950 font-['Quicksand'] line-clamp-1">
                {latestVideo ? latestVideo.title : 'Thư viện video tri thức & Tự học AI'}
              </h4>
              <p className="text-[11px] text-stone-600 font-medium mt-1 leading-relaxed line-clamp-2">
                {latestVideo
                  ? latestVideo.desc || 'Video của cô đã được lưu trữ vĩnh viễn và tạo gói tri thức AI hoàn tất.'
                  : 'Khám phá video bài giảng ứng dụng Canva AI, ChatGPT, trò chơi mầm non và tải lên video bài học không giới hạn.'}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-[11px]">
              <span className="font-bold text-orange-700">
                {latestVideo ? 'Bấm xem video ngay ➔' : 'Xem toàn bộ video ➔'}
              </span>
              <span className="text-emerald-700 font-black">+50 XP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Flow Infographic */}
      <section className="bg-gradient-to-br from-amber-50 via-[#FFF8F0] to-orange-50 rounded-3xl p-4 sm:p-6 border border-amber-200/90 shadow-[0_4px_16px_rgba(180,83,9,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="space-y-0.5">
            <span className="text-[11px] font-black text-orange-700 uppercase tracking-wider">
              Dòng Chảy Tác Động Lan Tỏa 🌊
            </span>
            <h3 className="text-base sm:text-lg font-black text-amber-950 font-['Quicksand']">
              Cô chia sẻ 1 ý tưởng – Hàng trăm trẻ em học vui
            </h3>
            <p className="text-xs text-stone-600">
              Mô hình lan tỏa giáo dục mầm non thực tế từ cộng đồng giáo viên cả nước
            </p>
          </div>

          <button
            onClick={() => onNavigate('impact-dashboard')}
            className="px-3.5 py-2 rounded-xl bg-white text-orange-800 border border-orange-200 font-black text-xs shadow-2xs hover:bg-orange-50 transition-all self-start sm:self-auto shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Xem Dashboard Tác Động</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Infographic Islands */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-3 border-t border-amber-200/70">
          <div className="p-3.5 bg-white/90 rounded-2xl text-center border border-amber-100 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-orange-600 font-['Quicksand']">1</div>
            <div className="text-xs font-black text-amber-950 mt-1">Giáo viên chia sẻ</div>
            <div className="text-[10px] text-stone-500 font-medium">Giáo án & học liệu AI</div>
          </div>

          <div className="p-3.5 bg-white/90 rounded-2xl text-center border border-amber-100 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-['Quicksand']">25</div>
            <div className="text-xs font-black text-amber-950 mt-1">Giáo viên học</div>
            <div className="text-[10px] text-stone-500 font-medium">Tham khảo & tùy biến</div>
          </div>

          <div className="p-3.5 bg-white/90 rounded-2xl text-center border border-amber-100 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-orange-700 font-['Quicksand']">18</div>
            <div className="text-xs font-black text-amber-950 mt-1">Lớp áp dụng</div>
            <div className="text-[10px] text-stone-500 font-medium">Đã dạy cho trẻ tại lớp</div>
          </div>

          <div className="p-3.5 bg-white/90 rounded-2xl text-center border border-amber-100 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-amber-700 font-['Quicksand']">420+</div>
            <div className="text-xs font-black text-amber-950 mt-1">Trẻ được thụ hưởng</div>
            <div className="text-[10px] text-stone-500 font-medium">Bé học vui qua thị giác</div>
          </div>
        </div>
      </section>

      {/* Core Safety & Quality Guard Notice */}
      <div className="p-3.5 sm:p-4 bg-white border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-950 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0" />
        <p className="leading-relaxed font-medium">
          <strong className="font-black text-orange-800">Nguyên tắc cốt lõi:</strong> Nội dung do AI hỗ trợ tạo. Giáo viên giữ vai trò chuyên môn quyết định, kiểm tra và điều chỉnh cho phù hợp với tâm sinh lý của từng trẻ tại lớp.
        </p>
      </div>
    </div>
  );
};

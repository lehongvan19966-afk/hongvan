import React, { useState } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import { Pixar3DIcon, PixarIconType } from '../components/Pixar3DIcon';
import { ChibiPreschoolKid, ChibiCharacterId } from '../components/ChibiPreschoolKid';
import {
  ArrowRight,
  Flame,
  Sparkles,
  Heart,
  Users,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { UserProfile, ResourceItem } from '../types';
import { sounds } from '../utils/audioUtils';

interface HomeViewProps {
  user: UserProfile;
  onNavigate: (tab: string, extra?: Record<string, unknown>) => void;
  resources: ResourceItem[];
}

export const HomeView: React.FC<HomeViewProps> = ({ user, onNavigate, resources }) => {
  const [hoveredIslandId, setHoveredIslandId] = useState<string | null>(null);

  // 6 Primary Functional Cloud Islands (Hòn đảo chức năng đám mây)
  const functionalIslands: Array<{
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
  }> = [
    {
      id: 'lesson-studio',
      title: 'Soạn Giáo Án',
      subtitle: 'Chuẩn 5 bước Bộ GD&ĐT',
      iconName: 'lesson',
      badge: 'Phổ biến',
      // Bé gái Mai - Búi tóc 2 bên, áo cam, váy nâu nhạt trên gối
      chibiId: 'mai-lesson',
      kidName: 'Bé Mai',
      kidGender: 'Bé gái',
      greeting: 'Chào cô! Bé cùng cô soạn bài nha 🌸',
      // Cloud Colors: Sweet Coral Pink (Hồng Đào)
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
    },
    {
      id: 'magic-learning',
      title: 'Học Liệu Thần Kỳ',
      subtitle: 'Từ ảnh, truyện & video',
      iconName: 'magic',
      badge: 'Đa năng',
      // Bé trai Bi - Tóc xoăn hạt dẻ, áo cam, quần sooc nâu nhạt
      chibiId: 'bi-magic',
      kidName: 'Bé Bi',
      kidGender: 'Bé trai',
      greeting: 'Úm ba la! Tranh ảnh kỳ diệu quá! ✨',
      // Cloud Colors: Magic Lavender Violet (Tím Ma Thuật)
      cloudColorName: 'Tím Thần Kỳ',
      cloudGradientTop: '#A78BFA',
      cloudGradientBottom: '#C084FC',
      accentColor: '#8B5CF6',
      cardBg: 'from-[#FAF5FF] via-purple-50/80 to-[#F3E8FF]',
      cardBorder: 'border-purple-200/90 hover:border-purple-400',
      cardShadow: 'shadow-[0_8px_24px_rgba(139,92,246,0.12)] hover:shadow-[0_16px_32px_rgba(139,92,246,0.22)]',
      titleColor: 'text-purple-950 group-hover:text-purple-600',
      badgeBg: 'bg-purple-500',
      badgeText: 'text-white',
      haloColor: 'bg-purple-300/30',
    },
    {
      id: 'academy',
      title: 'Học Viện AI',
      subtitle: '7 Cấp độ cho giáo viên',
      iconName: 'academy',
      badge: 'Lộ trình',
      // Bé gái Linh - Tóc bob ngắn, tai nghe mèo, áo cam, váy nâu nhạt trên gối
      chibiId: 'linh-academy',
      kidName: 'Bé Linh',
      kidGender: 'Bé gái',
      greeting: 'Yeah! Bé cùng cô học AI nha! 🎓',
      // Cloud Colors: Sky Cyan Blue (Xanh Mây Trời)
      cloudColorName: 'Xanh Mây Trời',
      cloudGradientTop: '#38BDF8',
      cloudGradientBottom: '#60A5FA',
      accentColor: '#0284C7',
      cardBg: 'from-[#F0F9FF] via-sky-50/80 to-[#E0F2FE]',
      cardBorder: 'border-sky-200/90 hover:border-sky-400',
      cardShadow: 'shadow-[0_8px_24px_rgba(14,165,233,0.12)] hover:shadow-[0_16px_32px_rgba(14,165,233,0.22)]',
      titleColor: 'text-sky-950 group-hover:text-sky-600',
      badgeBg: 'bg-sky-500',
      badgeText: 'text-white',
      haloColor: 'bg-sky-300/30',
    },
    {
      id: 'english-buddy',
      title: 'English Buddy',
      subtitle: 'Song ngữ mầm non',
      iconName: 'english',
      badge: 'Song ngữ',
      // Bé trai Nam - Mũ lưỡi trai cam lệch, áo cam, quần sooc nâu nhạt
      chibiId: 'nam-english',
      kidName: 'Bé Nam',
      kidGender: 'Bé trai',
      greeting: 'Hello Teacher! Let\'s play! 🌎',
      // Cloud Colors: Fresh Mint Green (Xanh Bạc Hà)
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
    },
    {
      id: 'teaching-pack',
      title: 'Teaching Pack',
      subtitle: 'Trọn gói hoạt động',
      iconName: 'pack',
      badge: '1 Chạm',
      // Bé gái An - Tóc đuôi ngựa nơ dâu, áo cam, váy nâu nhạt trên gối
      chibiId: 'an-pack',
      kidName: 'Bé An',
      kidGender: 'Bé gái',
      greeting: 'Oa! Hộp quà học liệu thích quá! 🎁',
      // Cloud Colors: Warm Sunshine Orange (Cam Mặt Trời)
      cloudColorName: 'Cam Mặt Trời',
      cloudGradientTop: '#FBBF24',
      cloudGradientBottom: '#F97316',
      accentColor: '#EA580C',
      cardBg: 'from-[#FFFBEB] via-amber-50/80 to-[#FEF3C7]',
      cardBorder: 'border-amber-200/90 hover:border-amber-400',
      cardShadow: 'shadow-[0_8px_24px_rgba(245,158,11,0.12)] hover:shadow-[0_16px_32px_rgba(245,158,11,0.22)]',
      titleColor: 'text-amber-950 group-hover:text-amber-600',
      badgeBg: 'bg-amber-500',
      badgeText: 'text-white',
      haloColor: 'bg-amber-300/30',
    },
    {
      id: 'library',
      title: 'Kho Học Liệu',
      subtitle: '500+ tài liệu mầm non',
      iconName: 'library',
      badge: 'Cộng đồng',
      // Bé trai Bo - Tóc tém vuốt chỏm, áo cam, quần sooc nâu nhạt
      chibiId: 'bo-library',
      kidName: 'Bé Bo',
      kidGender: 'Bé trai',
      greeting: 'Kho báu truyện tranh đây rồi cô ơi! 📚',
      // Cloud Colors: Sweet Strawberry Fuchsia (Hồng Dâu Tây)
      cloudColorName: 'Hồng Dâu Tây',
      cloudGradientTop: '#F472B6',
      cloudGradientBottom: '#FB7185',
      accentColor: '#E11D48',
      cardBg: 'from-[#FDF2F8] via-pink-50/80 to-[#FCE7F3]',
      cardBorder: 'border-pink-200/90 hover:border-pink-400',
      cardShadow: 'shadow-[0_8px_24px_rgba(236,72,153,0.12)] hover:shadow-[0_16px_32px_rgba(236,72,153,0.22)]',
      titleColor: 'text-pink-950 group-hover:text-pink-600',
      badgeBg: 'bg-pink-500',
      badgeText: 'text-white',
      haloColor: 'bg-pink-300/30',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-20">
      {/* Top Welcome & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight font-['Quicksand']">
              Chào buổi sáng, {user.name} 🌸
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold border border-amber-200/80 shadow-2xs">
              {user.school.split('–')[0]}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
            Hôm nay cô muốn cùng Mầm AI sáng tạo điều tuyệt vời gì cho các bé?
          </p>
        </div>

        {/* Streaks & Gamification Badges */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl text-xs font-black text-amber-900 shadow-2xs">
            <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-pulse" />
            <span>Streak: {user.streakDays} ngày</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/90 rounded-2xl text-xs font-black text-amber-800 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{user.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Hero Banner with Modern Warm Terracotta-Peach Tone & Cute 3D Mascot */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100/90 via-[#FFF8F0] to-orange-100/80 border border-amber-200/80 p-5 sm:p-7 shadow-[0_4px_20px_rgba(194,65,12,0.06)]">
        {/* Soft background light blobs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-orange-700 text-xs font-black mb-3 shadow-2xs border border-orange-200/80">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Hệ sinh thái AI giáo dục mầm non</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-950 tracking-tight leading-snug font-['Quicksand']">
            AI giúp cô tiết kiệm thời gian để dành nhiều yêu thương cho trẻ.
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 font-medium mt-2 leading-relaxed">
            Soạn giáo án chuẩn 5 bước, tạo flashcard 3D sinh động, trò chơi tương tác và hoạt động tiếng Anh chỉ trong vài cú chạm.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <button
              onClick={() => {
                sounds.playPop();
                onNavigate('lesson-studio', { topic: 'Khám phá quả cam', ageGroup: user.ageGroup });
              }}
              className="px-4.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-xs sm:text-sm font-black shadow-md shadow-orange-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>✨ Soạn giáo án mẫu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                onNavigate('academy');
              }}
              className="px-4 py-2.5 rounded-2xl bg-white text-amber-950 text-xs sm:text-sm font-bold border border-amber-200/90 hover:bg-amber-50/70 active:scale-95 transition-all shadow-2xs cursor-pointer"
            >
              Lộ trình học AI
            </button>
          </div>
        </div>

        {/* Mascot decoration right side */}
        <div className="hidden sm:block absolute right-6 bottom-3 md:bottom-2 z-10 transition-transform duration-300 hover:scale-105">
          <MamAiMascot size="xl" mood="celebrate" />
        </div>
      </div>

      {/* Primary Function Islands (Mỗi mục chức năng là một hòn đảo đám mây bo tròn viền trắng) */}
      <section className="relative">
        {/* Playful background cloud decorations */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center text-base shadow-xs border-2 border-white">
              ☁️
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-amber-950 tracking-wide font-bubbly flex items-center gap-1.5">
                <span>Hòn Đảo Chức Năng</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              </h3>
              <p className="text-[11px] text-stone-500 font-bold font-['Quicksand']">
                Mỗi chức năng là một đám mây thần kỳ rực rỡ sắc màu
              </p>
            </div>
          </div>
          <span className="text-xs text-orange-600 font-bubbly font-bold bg-white/90 px-3 py-1 rounded-full border-2 border-white shadow-2xs hidden sm:inline-block">
            Chạm mây để khám phá ✨
          </span>
        </div>

        {/* The 6 Cloud Islands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {functionalIslands.map((item, idx) => {
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
                className={`group relative bg-gradient-to-b ${item.cardBg} rounded-[28px] sm:rounded-[32px] border-[3.5px] border-white ${item.cardShadow} p-3 sm:p-3.5 flex flex-col items-center text-center justify-between min-h-[225px] sm:min-h-[250px] transition-all duration-300 hover:-translate-y-2.5 hover:scale-[1.03] active:scale-95 cursor-pointer relative overflow-visible`}
              >
                {/* Ambient colorful light halo in card corner */}
                <div
                  className={`w-20 h-20 rounded-full blur-xl absolute -top-4 -right-4 pointer-events-none ${item.haloColor}`}
                />

                {/* Interactive Speech Bubble with Cute Greeting (Không cần mở ra cũng chào hỏi nhún nhảy) */}
                <div
                  className={`absolute -top-10 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap bg-white px-2.5 py-1 rounded-2xl shadow-xl border-2 border-orange-400 text-[10px] sm:text-[11px] font-black font-bubbly text-amber-950 flex items-center gap-1 transition-all duration-300 pointer-events-none ${
                    isHovered
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-75 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0'
                  }`}
                >
                  <span>{item.greeting}</span>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-b-2 border-r-2 border-orange-400 rotate-45" />
                </div>

                {/* Badge top right of island (Cute cloud-pill with white border) */}
                <div className="w-full flex justify-between items-center relative z-10 px-1">
                  <span className="text-[10px] font-bubbly font-black px-2 py-0.5 rounded-full bg-white/80 text-stone-600 border border-white shadow-2xs">
                    {item.kidName}
                  </span>
                  <span
                    className={`text-[9.5px] sm:text-[10px] font-black font-bubbly px-2 py-0.5 rounded-full border-2 border-white shadow-xs ${item.badgeBg} ${item.badgeText}`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Cloud & 2D Chibi Preschool Kid Illustration */}
                <div
                  className={`relative w-full aspect-[16/12] max-w-[135px] sm:max-w-[150px] mx-auto flex items-center justify-center my-1 transition-transform duration-300 ${
                    isEven ? 'animate-float-cloud' : ''
                  }`}
                  style={!isEven ? { animation: 'float-cloud 3.5s ease-in-out 1.75s infinite' } : undefined}
                >
                  {/* SVG Cloud Body with crisp thick white border and rounded puffy lobes */}
                  <svg
                    viewBox="0 0 160 110"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 w-full h-full filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-105"
                  >
                    <defs>
                      <linearGradient
                        id={`cloud-gradient-${item.id}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor={item.cloudGradientTop} />
                        <stop offset="100%" stopColor={item.cloudGradientBottom} />
                      </linearGradient>
                    </defs>

                    {/* Fluffy rounded cartoon cloud path with thick white border */}
                    <path
                      d="M 38 84 C 22 84, 14 70, 16 54 C 18 38, 30 32, 42 34 C 48 18, 66 10, 82 12 C 98 14, 110 24, 114 36 C 126 30, 140 36, 144 50 C 148 66, 138 84, 122 84 Z"
                      fill={`url(#cloud-gradient-${item.id})`}
                      stroke="#FFFFFF"
                      strokeWidth="5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />

                    {/* Glossy top white highlight shine reflection */}
                    <path
                      d="M 58 22 C 68 18, 80 18, 92 20"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                    <path
                      d="M 28 44 C 32 38, 38 38, 42 40"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.7"
                    />

                    {/* Cute white blush cheeks */}
                    <ellipse cx="40" cy="66" rx="6" ry="4" fill="#FFFFFF" opacity="0.4" />
                    <ellipse cx="120" cy="66" rx="6" ry="4" fill="#FFFFFF" opacity="0.4" />

                    {/* Twinkling star sparkle */}
                    <path
                      d="M 136 20 Q 138 25, 143 27 Q 138 29, 136 34 Q 134 29, 129 27 Q 134 25, 136 20 Z"
                      fill="#FFFFFF"
                      opacity="0.95"
                    />
                    <circle cx="26" cy="28" r="2" fill="#FFFFFF" opacity="0.8" />
                  </svg>

                  {/* 2D Chibi Kid standing on top of the cloud */}
                  <div className="relative z-20 w-19 h-23 sm:w-21 sm:h-25 flex items-center justify-center -translate-y-2 group-hover:scale-115 transition-transform duration-300">
                    <ChibiPreschoolKid
                      id={item.chibiId}
                      isHovered={isHovered}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Companion 3D Pixar Icon at the bottom-right corner of the cloud */}
                  <div className="absolute right-0 bottom-0 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 p-1 border-2 border-white shadow-xs group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                    <Pixar3DIcon name={item.iconName} size="sm" animate={false} />
                  </div>
                </div>

                {/* Cloud Island Info with Cute Bubbly Rounded Font */}
                <div className="w-full mt-1 relative z-10">
                  <h4
                    className={`font-bubbly font-black text-sm sm:text-base tracking-wide ${item.titleColor} transition-colors whitespace-nowrap overflow-hidden text-ellipsis`}
                  >
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-stone-600 font-bold font-['Quicksand'] mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>

                {/* Bottom Cute Cloud Pill Action Button */}
                <div className="mt-1.5 w-full pt-1.5 border-t border-white/60 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bubbly font-extrabold text-stone-600 group-hover:text-amber-900 group-hover:scale-105 transition-all">
                    <span>{isHovered ? 'Chào cô! 👋' : 'Khám phá'}</span>
                    <span className="text-[9px]">☁️</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

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
            onClick={() => onNavigate('academy')}
            className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-2xs hover:shadow-sm hover:border-orange-300 hover:-translate-y-0.5 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-1.5">
                <span className="flex items-center gap-1">🎓 AI Academy · Đang học</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold">Level 2</span>
              </div>
              <h4 className="font-black text-sm text-amber-950 font-['Quicksand']">
                Tiếp tục: Tạo nhân vật nhất quán trong tranh
              </h4>
              <p className="text-[11px] text-stone-600 font-medium mt-1 leading-relaxed line-clamp-2">
                Bí quyết dùng câu lệnh AI để giữ khuôn mặt bé Mai không thay đổi trong suốt cuốn sách tranh 10 trang.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-700">Đã học 75%</span>
              <span className="text-emerald-700 font-black">+50 XP khi hoàn thành</span>
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

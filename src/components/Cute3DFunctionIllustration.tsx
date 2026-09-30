import React from 'react';

export type FunctionIllustrationId =
  | 'lesson-studio'
  | 'academy'
  | 'daily-practice'
  | 'interactive-games'
  | 'english-buddy'
  | 'story-poem-creator'
  | 'be-vui-hoc';

interface Cute3DFunctionIllustrationProps {
  id: FunctionIllustrationId | string;
  isHovered?: boolean;
  className?: string;
}

export const Cute3DFunctionIllustration: React.FC<Cute3DFunctionIllustrationProps> = ({
  id,
  isHovered = false,
  className = '',
}) => {
  switch (id) {
    // 1. SOẠN GIÁO ÁN: Quyển giáo án 5 bước 3D Kawaii kèm bút chì phép thuật & sao vàng
    case 'lesson-studio':
      return (
        <svg
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full filter drop-shadow-[0_8px_16px_rgba(244,63,94,0.22)] transition-transform duration-300 ${
            isHovered ? 'scale-105' : ''
          } ${className}`}
        >
          <defs>
            <linearGradient id="lsBookCover" x1="20" y1="20" x2="140" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF758C" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>
            <linearGradient id="lsPages" x1="28" y1="28" x2="132" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFF1F2" />
            </linearGradient>
            <linearGradient id="lsPencil" x1="100" y1="15" x2="145" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="lsGlowStar" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* 3D Binder / Book Shadow */}
          <rect x="22" y="32" width="116" height="76" rx="18" fill="#FDA4AF" opacity="0.4" />

          {/* 3D Book Cover Base */}
          <rect x="18" y="26" width="124" height="78" rx="20" fill="url(#lsBookCover)" stroke="#FFFFFF" strokeWidth="3" />
          
          {/* Spine Binding Clips */}
          <circle cx="28" cy="40" r="4.5" fill="#FFE4E6" stroke="#BE123C" strokeWidth="2" />
          <circle cx="28" cy="65" r="4.5" fill="#FFE4E6" stroke="#BE123C" strokeWidth="2" />
          <circle cx="28" cy="90" r="4.5" fill="#FFE4E6" stroke="#BE123C" strokeWidth="2" />

          {/* Soft Clay Inner Pages */}
          <rect x="36" y="32" width="100" height="66" rx="14" fill="url(#lsPages)" stroke="#FECDD3" strokeWidth="2" />

          {/* 5-Step Colorful Planner Tabs */}
          <rect x="126" y="36" width="12" height="10" rx="3" fill="#38BDF8" />
          <rect x="126" y="49" width="12" height="10" rx="3" fill="#34D399" />
          <rect x="126" y="62" width="12" height="10" rx="3" fill="#FBBF24" />
          <rect x="126" y="75" width="12" height="10" rx="3" fill="#A855F7" />

          {/* Page Lines */}
          <line x1="46" y1="44" x2="114" y2="44" stroke="#FB7185" strokeWidth="3" strokeLinecap="round" />
          <line x1="46" y1="56" x2="104" y2="56" stroke="#FDA4AF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="46" y1="68" x2="110" y2="68" stroke="#FDA4AF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="46" y1="80" x2="90" y2="80" stroke="#FDA4AF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Cute 3D Heart Checkmark Badge */}
          <circle cx="108" cy="78" r="11" fill="#F43F5E" />
          <path d="M103 78L106.5 81.5L113.5 74.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Magic Cute 3D Pencil */}
          <g transform="rotate(25 125 35)">
            <rect x="110" y="8" width="14" height="42" rx="4" fill="url(#lsPencil)" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="110,8 117,-4 124,8" fill="#FED7AA" />
            <polygon points="115,2 117,-4 119,2" fill="#78350F" />
            <rect x="110" y="44" width="14" height="8" rx="2" fill="#F43F5E" />
          </g>

          {/* Floating Sparkles & Golden Stars */}
          <polygon points="26,16 28,21 33,22 28,24 26,29 24,24 19,22 24,21" fill="url(#lsGlowStar)" />
          <polygon points="144,18 145.5,22 149.5,23 145.5,24.5 144,28.5 142.5,24.5 138.5,23 142.5,22" fill="url(#lsGlowStar)" />
        </svg>
      );

    // 2. HƯỚNG DẪN HỌC AI: Màn hình TV / Tablet 3D mầm non với nón cử nhân & nút Play
    case 'academy':
      return (
        <svg
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full filter drop-shadow-[0_8px_16px_rgba(2,132,199,0.22)] transition-transform duration-300 ${
            isHovered ? 'scale-105' : ''
          } ${className}`}
        >
          <defs>
            <linearGradient id="acTvBody" x1="20" y1="20" x2="140" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="acScreen" x1="32" y1="30" x2="128" y2="92" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F0F9FF" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
            <linearGradient id="acGradCap" x1="60" y1="6" x2="100" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* TV Stand Base */}
          <path d="M64 100L70 110H90L96 100Z" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2.5" />
          <ellipse cx="80" cy="111" rx="26" ry="5" fill="#0369A1" />

          {/* TV / Tablet 3D Frame */}
          <rect x="22" y="24" width="116" height="78" rx="22" fill="url(#acTvBody)" stroke="#FFFFFF" strokeWidth="3.5" />
          
          {/* Display Screen */}
          <rect x="30" y="32" width="100" height="62" rx="14" fill="url(#acScreen)" stroke="#7DD3FC" strokeWidth="2" />

          {/* Video Play Button (Cute 3D) */}
          <circle cx="80" cy="62" r="17" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2.5" className="filter drop-shadow-md" />
          <polygon points="75,53 89,62 75,71" fill="#FFFFFF" />

          {/* Cute Graduation Cap (Nón Cử Nhân) on Top */}
          <polygon points="80,8 108,18 80,28 52,18" fill="url(#acGradCap)" stroke="#38BDF8" strokeWidth="1.5" />
          <rect x="70" y="25" width="20" height="7" rx="3.5" fill="#0F172A" />
          {/* Tassel */}
          <path d="M96 22C98 28 97 34 99 38" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="99" cy="40" r="2" fill="#F59E0B" />

          {/* Floating Course Book Stack on Left */}
          <rect x="10" y="76" width="24" height="7" rx="3" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="1.5" />
          <rect x="12" y="70" width="22" height="7" rx="3" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="1.5" />
          <rect x="14" y="64" width="20" height="7" rx="3" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Sparkles */}
          <polygon points="138,32 140,36 144,37 140,38 138,42 136,38 132,37 136,36" fill="#FDE047" />
        </svg>
      );

    // 3. LUYỆN AI MỖI NGÀY: Cúp Vàng Luyện Tập 3D kèm Ngọn Lửa & Đồng Hồ Cát 5 Phút
    case 'daily-practice':
      return (
        <svg
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full filter drop-shadow-[0_8px_16px_rgba(234,88,12,0.25)] transition-transform duration-300 ${
            isHovered ? 'scale-105' : ''
          } ${className}`}
        >
          <defs>
            <linearGradient id="dpTrophy" x1="50" y1="20" x2="110" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="dpFlame" x1="70" y1="6" x2="90" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <linearGradient id="dpBase" x1="55" y1="88" x2="105" y2="108" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7C2D12" />
              <stop offset="100%" stopColor="#431407" />
            </linearGradient>
          </defs>

          {/* Trophy Handles */}
          <path d="M54 36C40 36 34 50 44 64C48 70 56 74 60 76" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M106 36C120 36 126 50 116 64C112 70 104 74 100 76" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" fill="none" />

          {/* Trophy Cup Body */}
          <path d="M52 30H108C108 55 98 76 80 80C62 76 52 55 52 30Z" fill="url(#dpTrophy)" stroke="#FFFFFF" strokeWidth="3" />

          {/* Trophy Stem & Base */}
          <rect x="74" y="78" width="12" height="15" rx="3" fill="#D97706" />
          <path d="M56 93H104L108 108H52L56 93Z" fill="url(#dpBase)" stroke="#FFFFFF" strokeWidth="2.5" />
          <rect x="62" y="98" width="36" height="6" rx="2" fill="#FBBF24" />

          {/* Energetic 3D Flame inside Cup */}
          <path d="M80 12C85 20 92 24 90 32C88 40 76 42 74 34C72 26 78 18 80 12Z" fill="url(#dpFlame)" className="animate-pulse" />
          <path d="M80 20C82 24 85 27 84 31C83 34 78 35 77 31C76 27 79 23 80 20Z" fill="#FEF08A" />

          {/* 5-Min Hourglass / Target on Right */}
          <g transform="translate(112, 60)">
            <circle cx="16" cy="16" r="14" fill="#FFFFFF" stroke="#F97316" strokeWidth="2.5" />
            <text x="16" y="20" textAnchor="middle" fill="#EA580C" fontSize="11" fontWeight="900" fontFamily="monospace">
              5p
            </text>
          </g>

          {/* Floating Stars */}
          <polygon points="34,22 36,27 41,28 36,30 34,35 32,30 27,28 32,27" fill="#FDE047" />
          <polygon points="128,26 130,30 134,31 130,32 128,36 126,32 122,31 126,30" fill="#FBBF24" />
        </svg>
      );

    // 4. TRÒ CHƠI TƯƠNG TÁC: Tay Cầm Chơi Game 3D Kawaii & Vòng Quay May Mắn
    case 'interactive-games':
      return (
        <svg
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full filter drop-shadow-[0_8px_16px_rgba(217,119,6,0.22)] transition-transform duration-300 ${
            isHovered ? 'scale-105' : ''
          } ${className}`}
        >
          <defs>
            <linearGradient id="igGamepad" x1="20" y1="30" x2="140" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="igBtnRed" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF758C" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
            <linearGradient id="igBtnBlue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="igBtnGreen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Gamepad Shadow */}
          <path d="M42 42C30 42 22 55 24 74C26 92 36 102 52 98C64 95 72 82 80 82C88 82 96 95 108 98C124 102 134 92 136 74C138 55 130 42 118 42C106 42 96 50 80 50C64 50 54 42 42 42Z" fill="#FDE68A" opacity="0.5" />

          {/* Gamepad Main 3D Body */}
          <path d="M42 36C28 36 20 50 22 70C24 88 34 98 50 94C62 91 70 78 80 78C90 78 98 91 110 94C126 98 136 88 138 70C140 50 132 36 118 36C104 36 94 45 80 45C66 45 56 36 42 36Z" fill="url(#igGamepad)" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />

          {/* D-Pad (Left Arrow Buttons) */}
          <rect x="42" y="52" width="10" height="26" rx="4" fill="#FFFFFF" />
          <rect x="34" y="60" width="26" height="10" rx="4" fill="#FFFFFF" />
          <circle cx="47" cy="65" r="3" fill="#D97706" />

          {/* Action Candy Buttons (Right) */}
          <circle cx="112" cy="56" r="6" fill="url(#igBtnRed)" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="123" cy="66" r="6" fill="url(#igBtnBlue)" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="102" cy="66" r="6" fill="url(#igBtnGreen)" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="113" cy="76" r="6" fill="#A855F7" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Screen / Indicator in Center */}
          <rect x="70" y="58" width="20" height="10" rx="4" fill="#FFFFFF" opacity="0.9" />
          <circle cx="76" cy="63" r="2" fill="#10B981" />
          <circle cx="84" cy="63" r="2" fill="#F43F5E" />

          {/* Lucky Wheel & Arcade Badge on Top */}
          <circle cx="80" cy="22" r="14" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2.5" />
          <path d="M80 8L83 18L93 18L85 24L88 34L80 28L72 34L75 24L67 18L77 18Z" fill="#FEF08A" />
        </svg>
      );

    // 5. HỌC TIẾNG ANH: Quả Địa Cầu 3D Kawaii đeo Tai Nghe & Khối Chữ ABC
    case 'english-buddy':
      return (
        <svg
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full filter drop-shadow-[0_8px_16px_rgba(5,150,105,0.22)] transition-transform duration-300 ${
            isHovered ? 'scale-105' : ''
          } ${className}`}
        >
          <defs>
            <linearGradient id="ebGlobe" x1="45" y1="25" x2="115" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="ebHeadphone" x1="30" y1="20" x2="130" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>
          </defs>

          {/* Globe Stand */}
          <path d="M66 102H94" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
          <path d="M80 90V102" stroke="#047857" strokeWidth="4" strokeLinecap="round" />

          {/* 3D Cute Globe Sphere */}
          <circle cx="80" cy="58" r="34" fill="url(#ebGlobe)" stroke="#FFFFFF" strokeWidth="3.5" />
          
          {/* Earth Continents (Cute Blob Shapes) */}
          <path d="M62 46C65 40 76 42 78 48C80 54 74 60 68 58C62 56 60 50 62 46Z" fill="#ECFDF5" />
          <path d="M86 64C90 60 98 62 99 68C100 74 94 78 88 76C84 74 82 68 86 64Z" fill="#ECFDF5" />

          {/* Cute Face on Globe */}
          <circle cx="72" cy="56" r="3" fill="#064E3B" />
          <circle cx="88" cy="56" r="3" fill="#064E3B" />
          <path d="M76 64Q80 68 84 64" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Pink Cheeks */}
          <circle cx="68" cy="62" r="3.5" fill="#FDA4AF" opacity="0.8" />
          <circle cx="92" cy="62" r="3.5" fill="#FDA4AF" opacity="0.8" />

          {/* Cute 3D Headphones */}
          <path d="M48 58C48 38 62 24 80 24C98 24 112 38 112 58" stroke="url(#ebHeadphone)" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Left Earcup */}
          <rect x="42" y="48" width="12" height="22" rx="6" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" />
          {/* Right Earcup */}
          <rect x="106" y="48" width="12" height="22" rx="6" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" />

          {/* "HELLO!" Speech Bubble */}
          <g transform="translate(100, 14)">
            <rect x="0" y="0" width="52" height="22" rx="9" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
            <text x="26" y="15" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="900" fontFamily="Quicksand, sans-serif">
              HELLO!
            </text>
          </g>

          {/* ABC 3D Blocks on Left */}
          <g transform="translate(14, 62)">
            <rect x="0" y="8" width="18" height="18" rx="4" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="9" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900">A</text>
            <rect x="12" y="-2" width="18" height="18" rx="4" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="21" y="11" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900">B</text>
          </g>
        </svg>
      );

    // 6. TẠO THƠ TRUYỆN: Sách Mở 3D Cổ Tích, Lâu Đài Cầu Vồng & Cuộn Phim Hoạt Cảnh
    case 'story-poem-creator':
      return (
        <svg
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full filter drop-shadow-[0_8px_16px_rgba(147,51,234,0.22)] transition-transform duration-300 ${
            isHovered ? 'scale-105' : ''
          } ${className}`}
        >
          <defs>
            <linearGradient id="spBookOpen" x1="20" y1="40" x2="140" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#7E22CE" />
            </linearGradient>
            <linearGradient id="spRainbow" x1="40" y1="20" x2="120" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="30%" stopColor="#FBBF24" />
              <stop offset="60%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Rainbow Arcs Emerging From Storybook */}
          <path d="M46 54C46 28 62 14 80 14C98 14 114 28 114 54" stroke="#FDA4AF" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M52 54C52 34 64 22 80 22C96 22 108 34 108 54" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M58 54C58 40 68 30 80 30C92 30 102 40 102 54" stroke="#67E8F9" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* Miniature 3D Story Castle on Top */}
          <g transform="translate(68, 18)">
            <rect x="0" y="14" width="24" height="20" rx="3" fill="#FAF5FF" stroke="#9333EA" strokeWidth="1.5" />
            <polygon points="-2,14 4,2 10,14" fill="#EC4899" stroke="#FFFFFF" strokeWidth="1" />
            <polygon points="14,14 20,2 26,14" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1" />
            <rect x="8" y="24" width="8" height="10" rx="4" fill="#7E22CE" />
          </g>

          {/* Open 3D Storybook Pages */}
          {/* Left Page */}
          <path d="M80 62C64 58 42 60 22 66C22 86 24 98 80 98Z" fill="#FAF5FF" stroke="#A855F7" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Right Page */}
          <path d="M80 62C96 58 118 60 138 66C138 86 136 98 80 98Z" fill="#FFFFFF" stroke="#A855F7" strokeWidth="2.5" strokeLinejoin="round" />

          {/* Page Spine */}
          <path d="M80 62V100" stroke="#7E22CE" strokeWidth="3.5" strokeLinecap="round" />

          {/* Movie Clapper / Video Reel Icon on Bottom Right */}
          <g transform="translate(112, 70) rotate(-10)">
            <rect x="0" y="0" width="28" height="22" rx="4" fill="#1E1B4B" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="0" y="0" width="28" height="6" rx="2" fill="#F43F5E" />
            <polygon points="10,9 18,14 10,19" fill="#FFFFFF" />
          </g>

          {/* Floating Magic Sparks & Notes */}
          <text x="32" y="52" fill="#9333EA" fontSize="16" fontWeight="bold">♪</text>
          <polygon points="132,32 134,36 138,37 134,38 132,42 130,38 126,37 130,36" fill="#FDE047" />
        </svg>
      );

    // 7. BÉ VUI HỌC: Bảng Màu Vẽ 3D Kawaii, Khối Chữ Số 1-2-3 & Kính Lúp Tư Duy
    case 'be-vui-hoc':
    default:
      return (
        <svg
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full filter drop-shadow-[0_8px_16px_rgba(244,63,94,0.22)] transition-transform duration-300 ${
            isHovered ? 'scale-105' : ''
          } ${className}`}
        >
          <defs>
            <linearGradient id="bvhPalette" x1="25" y1="20" x2="135" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF1F2" />
              <stop offset="50%" stopColor="#FFE4E6" />
              <stop offset="100%" stopColor="#FECDD3" />
            </linearGradient>
            <linearGradient id="bvhBrush" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
          </defs>

          {/* 3D Artist Wooden Palette */}
          <path
            d="M32 60C30 36 50 20 80 20C110 20 134 38 132 64C130 84 116 98 94 98C84 98 78 92 72 92C66 92 62 96 54 96C38 96 34 80 32 60Z"
            fill="url(#bvhPalette)"
            stroke="#FFFFFF"
            strokeWidth="4"
          />

          {/* Thumb Hole */}
          <ellipse cx="50" cy="74" rx="7" ry="9" fill="#FFFFFF" stroke="#FDA4AF" strokeWidth="2" />

          {/* Colorful Paint Blobs (3D Candy Drops) */}
          <circle cx="56" cy="38" r="8" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="78" cy="32" r="8" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="100" cy="38" r="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="118" cy="56" r="8" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="110" cy="78" r="8" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2" />

          {/* Number Block 1-2-3 */}
          <g transform="translate(18, 62)">
            <rect x="0" y="8" width="18" height="18" rx="4" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="9" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900">1</text>
            <rect x="12" y="-2" width="18" height="18" rx="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="21" y="11" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900">2</text>
          </g>

          {/* Cute 3D Paintbrush Piercing through palette */}
          <g transform="rotate(35 90 70)">
            {/* Handle */}
            <rect x="86" y="10" width="8" height="60" rx="4" fill="url(#bvhBrush)" stroke="#FFFFFF" strokeWidth="1" />
            {/* Metal Ferrule */}
            <rect x="85" y="70" width="10" height="10" rx="2" fill="#E2E8F0" />
            {/* Brush Hairs with color dip */}
            <path d="M85 80C85 92 88 98 90 98C92 98 95 92 95 80Z" fill="#F43F5E" />
          </g>

          {/* Cute Thinking Lightbulb on Top */}
          <circle cx="80" cy="62" r="10" fill="#FEF08A" stroke="#F59E0B" strokeWidth="2" />
          <polygon points="80,56 81.5,59.5 85,60 82,62 83,66 80,63.5 77,66 78,62 75,60 78.5,59.5" fill="#F59E0B" />
        </svg>
      );
  }
};

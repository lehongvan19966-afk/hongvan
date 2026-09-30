import React from 'react';

export type ChibiCharacterId =
  | 'mai-lesson'      // Bé gái Mai - Soạn giáo án
  | 'bi-magic'        // Bé trai Bi - Học liệu thần kỳ
  | 'linh-academy'    // Bé gái Linh - Hướng dẫn học AI từ cơ bản đến nâng cao
  | 'nam-english'     // Bé trai Nam - English Buddy
  | 'an-pack'         // Bé gái An - Teaching Pack
  | 'bo-library'      // Bé trai Bo - Kho học liệu
  | 'phuc-practice'   // Bé trai Phúc - Luyện AI mỗi ngày
  | 'dung-video'      // Bé trai Dũng - Video Thơ & Truyện AI
  | 'lan-community';  // Bé gái Lan - Cộng đồng kết nối mầm non

interface ChibiPreschoolKidProps {
  id: ChibiCharacterId;
  className?: string;
  isHovered?: boolean;
}

export const ChibiPreschoolKid: React.FC<ChibiPreschoolKidProps> = ({
  id,
  className = '',
  isHovered = false,
}) => {
  // Common Colors for Uniform
  const SHIRT_ORANGE = '#FF7A00';
  const SHIRT_COLLAR = '#FFFFFF';
  const BROWN_BOTTOM = '#C29F78';
  const BROWN_SHADOW = '#A8835D';
  const SKIN_TONE = '#FFE5D4';
  const SKIN_SHADOW = '#FCD0B8';
  const BLUSH = '#FF8FA3';
  const SHOES_WHITE = '#FFFFFF';
  const SHOES_ORANGE = '#FF6B00';

  // Render specific character
  switch (id) {
    case 'mai-lesson': {
      // Bé gái Mai - Búi tóc 2 bên (Space buns), áo cam, váy nâu nhạt trên gối, cầm bút & bảng
      return (
        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full drop-shadow-md select-none transition-transform duration-300 ${
            isHovered ? 'animate-chibi-dance' : ''
          } ${className}`}
        >
          {/* Hair Space Buns (2 cục búi xinh xắn) */}
          <circle cx="24" cy="24" r="14" fill="#3D2314" />
          <circle cx="76" cy="24" r="14" fill="#3D2314" />
          {/* Orange Ribbon bows */}
          <path d="M 22 28 C 18 32, 16 34, 18 36 C 22 36, 26 32, 28 30 Z" fill="#FF7A00" />
          <path d="M 26 28 C 30 32, 32 34, 30 36 C 26 36, 22 32, 20 30 Z" fill="#FF7A00" />
          <circle cx="24" cy="29" r="3" fill="#FFD166" />
          <path d="M 74 28 C 70 32, 68 34, 70 36 C 74 36, 78 32, 80 30 Z" fill="#FF7A00" />
          <path d="M 78 28 C 82 32, 84 34, 82 36 C 78 36, 74 32, 72 30 Z" fill="#FF7A00" />
          <circle cx="76" cy="29" r="3" fill="#FFD166" />

          {/* Legs & Shoes */}
          {/* Left leg */}
          <rect x="40" y="88" width="6" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="42" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 36 107 Q 42 104, 48 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />
          {/* Right leg */}
          <rect x="54" y="88" width="6" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="58" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 52 107 Q 58 104, 64 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          {/* Váy trên gối màu nâu nhạt (Pleated skirt) */}
          <path
            d="M 37 74 L 63 74 L 69 90 L 31 90 Z"
            fill={BROWN_BOTTOM}
          />
          {/* Skirt pleats detail */}
          <path d="M 43 74 L 41 90" stroke={BROWN_SHADOW} strokeWidth="1.5" />
          <path d="M 50 74 L 50 90" stroke={BROWN_SHADOW} strokeWidth="1.5" />
          <path d="M 57 74 L 59 90" stroke={BROWN_SHADOW} strokeWidth="1.5" />
          <rect x="36" y="72" width="28" height="3" rx="1.5" fill={BROWN_SHADOW} />

          {/* Body: Áo phông cam (Orange T-shirt) */}
          <path
            d="M 34 52 L 66 52 L 64 74 L 36 74 Z"
            fill={SHIRT_ORANGE}
          />
          {/* White Round Collar */}
          <path
            d="M 44 52 C 44 57, 56 57, 56 52 Z"
            fill={SHIRT_COLLAR}
          />
          {/* Cute sprout logo on shirt */}
          <path d="M 50 64 Q 53 60, 56 61 Q 54 65, 50 66" fill="#84CC16" />
          <path d="M 50 64 Q 47 60, 44 61 Q 46 65, 50 66" fill="#84CC16" />

          {/* Left Arm: Cầm bút chì màu */}
          <path d="M 34 55 Q 24 64, 25 73" stroke={SHIRT_ORANGE} strokeWidth="7" strokeLinecap="round" />
          <circle cx="26" cy="74" r="4.5" fill={SKIN_TONE} />
          {/* Crayon/Pencil */}
          <rect x="22" y="66" width="4" height="12" rx="1" fill="#EF4444" transform="rotate(25 24 72)" />
          <polygon points="26,64 28,62 30,67" fill="#FBBF24" />

          {/* Right Arm: Vẫy tay chào (Waving hand) */}
          <path
            d="M 66 55 Q 78 50, 82 40"
            stroke={SHIRT_ORANGE}
            strokeWidth="7"
            strokeLinecap="round"
            className={isHovered ? 'animate-arm-wave origin-bottom-left' : ''}
          />
          <circle cx="83" cy="38" r="5" fill={SKIN_TONE} />
          {/* Waving fingers */}
          <circle cx="86" cy="36" r="1.5" fill={SKIN_TONE} />
          <circle cx="84" cy="33" r="1.5" fill={SKIN_TONE} />

          {/* Head & Hair base */}
          <circle cx="50" cy="36" r="23" fill={SKIN_TONE} />
          {/* Hair bangs (Mái ngố tròn trĩnh) */}
          <path
            d="M 28 32 C 28 16, 72 16, 72 32 C 68 26, 62 26, 56 30 C 50 26, 44 26, 38 31 C 34 28, 30 30, 28 32 Z"
            fill="#3D2314"
          />
          {/* Side hair strands */}
          <path d="M 27 32 C 25 42, 28 48, 30 50 C 31 46, 30 38, 30 32 Z" fill="#3D2314" />
          <path d="M 73 32 C 75 42, 72 48, 70 50 C 69 46, 70 38, 70 32 Z" fill="#3D2314" />

          {/* Big Sparkling Anime Eyes (Mắt to tròn lấp lánh) */}
          {/* Left Eye */}
          <ellipse cx="41" cy="36" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="42.5" cy="34" r="2.2" fill="#FFFFFF" />
          <circle cx="39.5" cy="38.5" r="1.2" fill="#FFFFFF" />
          {/* Right Eye */}
          <ellipse cx="59" cy="36" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="60.5" cy="34" r="2.2" fill="#FFFFFF" />
          <circle cx="57.5" cy="38.5" r="1.2" fill="#FFFFFF" />

          {/* Eyelashes */}
          <path d="M 37 31 Q 41 29, 45 31" stroke="#2E1C11" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 55 31 Q 59 29, 63 31" stroke="#2E1C11" strokeWidth="1.5" strokeLinecap="round" />

          {/* Rosy Cheeks (Má hồng phấn tròn xinh) */}
          <ellipse cx="35" cy="42" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />
          <ellipse cx="65" cy="42" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />

          {/* Joyful Open Smile */}
          <path d="M 46 42 Q 50 48, 54 42" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" fill="#F87171" />
        </svg>
      );
    }

    case 'bi-magic': {
      // Bé trai Bi - Tóc hạt dẻ xoăn, áo cam, quần sooc nâu nhạt, cầm đũa phép ngôi sao
      return (
        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full drop-shadow-md select-none transition-transform duration-300 ${
            isHovered ? 'animate-chibi-dance' : ''
          } ${className}`}
        >
          {/* Legs & Shoes */}
          <rect x="40" y="88" width="6.5" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="42" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 36 107 Q 42 104, 48 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          <rect x="53.5" y="88" width="6.5" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="58" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 52 107 Q 58 104, 64 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          {/* Quần sooc nâu nhạt bé trai (Boy Shorts) */}
          <path
            d="M 37 74 L 63 74 L 64 89 L 52 89 L 50 82 L 48 89 L 36 89 Z"
            fill={BROWN_BOTTOM}
          />
          <path d="M 50 74 L 50 82" stroke={BROWN_SHADOW} strokeWidth="1.5" />
          <rect x="36" y="72" width="28" height="3" rx="1.5" fill={BROWN_SHADOW} />

          {/* Body: Áo phông cam (Orange T-shirt) */}
          <path
            d="M 34 52 L 66 52 L 63 74 L 37 74 Z"
            fill={SHIRT_ORANGE}
          />
          {/* White Polo Collar */}
          <path
            d="M 43 52 L 47 57 L 50 54 L 53 57 L 57 52 Z"
            fill={SHIRT_COLLAR}
          />
          {/* Chest Pocket */}
          <rect x="54" y="60" width="6" height="6" rx="1" fill="#EA580C" />

          {/* Left Arm: Cầm cây đũa phép thần kỳ */}
          <path
            d="M 34 55 Q 22 50, 18 42"
            stroke={SHIRT_ORANGE}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle cx="17" cy="41" r="4.5" fill={SKIN_TONE} />
          {/* Star Magic Wand */}
          <line x1="16" y1="42" x2="10" y2="24" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M 10 16 L 12 21 L 17 21 L 13 24 L 15 29 L 10 26 L 5 29 L 7 24 L 3 21 L 8 21 Z"
            fill="#FBBF24"
            stroke="#FFFFFF"
            strokeWidth="1"
          />
          {/* Sparkles from wand */}
          <circle cx="18" cy="18" r="1.5" fill="#FFFFFF" />
          <circle cx="4" cy="15" r="1.2" fill="#FFFFFF" />

          {/* Right Arm: Giơ tay vẫy chào */}
          <path
            d="M 66 55 Q 76 60, 80 50"
            stroke={SHIRT_ORANGE}
            strokeWidth="7"
            strokeLinecap="round"
            className={isHovered ? 'animate-arm-wave origin-bottom-left' : ''}
          />
          <circle cx="81" cy="48" r="4.5" fill={SKIN_TONE} />

          {/* Head & Hair base */}
          <circle cx="50" cy="36" r="23" fill={SKIN_TONE} />

          {/* Curly Chestnut Hair (Tóc xoăn hạt dẻ bồng bềnh) */}
          <path
            d="M 28 35 
               C 24 25, 28 16, 38 15 
               C 44 11, 56 11, 62 14 
               C 70 14, 76 22, 74 34
               C 70 28, 64 26, 58 31 
               C 52 26, 44 26, 40 31 
               C 34 27, 30 30, 28 35 Z"
            fill="#5C381E"
          />
          {/* Curly hair tufts */}
          <circle cx="34" cy="22" r="5" fill="#5C381E" />
          <circle cx="48" cy="16" r="6" fill="#5C381E" />
          <circle cx="62" cy="18" r="5.5" fill="#5C381E" />

          {/* Eyes (Mắt to tròn tinh nghịch) */}
          <ellipse cx="42" cy="37" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="43.5" cy="35" r="2.2" fill="#FFFFFF" />
          <circle cx="40.5" cy="39" r="1.2" fill="#FFFFFF" />

          <ellipse cx="58" cy="37" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="59.5" cy="35" r="2.2" fill="#FFFFFF" />
          <circle cx="56.5" cy="39" r="1.2" fill="#FFFFFF" />

          {/* Eyebrows */}
          <path d="M 38 31 Q 42 29, 45 31" stroke="#5C381E" strokeWidth="2" strokeLinecap="round" />
          <path d="M 55 31 Q 58 29, 62 31" stroke="#5C381E" strokeWidth="2" strokeLinecap="round" />

          {/* Rosy Cheeks */}
          <ellipse cx="36" cy="43" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />
          <ellipse cx="64" cy="43" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />

          {/* Happy Open Mouth with cute tooth */}
          <path d="M 46 43 Q 50 50, 54 43 Z" fill="#DC2626" />
          <rect x="48" y="43" width="4" height="2" rx="0.5" fill="#FFFFFF" />
        </svg>
      );
    }

    case 'linh-academy': {
      // Bé gái Linh - Tóc bob ngắn ôm má, tai nghe mèo, áo cam, váy nâu nhạt trên gối
      return (
        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full drop-shadow-md select-none transition-transform duration-300 ${
            isHovered ? 'animate-chibi-dance' : ''
          } ${className}`}
        >
          {/* Cat Ear Headphone Band */}
          <path d="M 27 34 C 27 16, 73 16, 73 34" stroke="#FB923C" strokeWidth="3" fill="none" />
          {/* Left Cat Ear */}
          <polygon points="32,20 38,8 46,18" fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5" />
          <polygon points="35,18 39,12 43,18" fill="#FDE047" />
          {/* Right Cat Ear */}
          <polygon points="68,20 62,8 54,18" fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5" />
          <polygon points="65,18 61,12 57,18" fill="#FDE047" />
          {/* Headphone ear pads */}
          <rect x="23" y="30" width="6" height="12" rx="3" fill="#FB923C" />
          <rect x="71" y="30" width="6" height="12" rx="3" fill="#FB923C" />

          {/* Legs & Shoes */}
          <rect x="40" y="88" width="6" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="42" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 36 107 Q 42 104, 48 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          <rect x="54" y="88" width="6" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="58" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 52 107 Q 58 104, 64 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          {/* Váy trên gối màu nâu nhạt */}
          <path
            d="M 37 74 L 63 74 L 69 90 L 31 90 Z"
            fill={BROWN_BOTTOM}
          />
          <path d="M 43 74 L 41 90" stroke={BROWN_SHADOW} strokeWidth="1.5" />
          <path d="M 50 74 L 50 90" stroke={BROWN_SHADOW} strokeWidth="1.5" />
          <path d="M 57 74 L 59 90" stroke={BROWN_SHADOW} strokeWidth="1.5" />
          <rect x="36" y="72" width="28" height="3" rx="1.5" fill={BROWN_SHADOW} />

          {/* Body: Áo phông cam (Orange T-shirt) */}
          <path
            d="M 34 52 L 66 52 L 64 74 L 36 74 Z"
            fill={SHIRT_ORANGE}
          />
          <path
            d="M 44 52 C 44 57, 56 57, 56 52 Z"
            fill={SHIRT_COLLAR}
          />
          {/* AI star icon on shirt */}
          <circle cx="50" cy="64" r="3" fill="#FFFFFF" />

          {/* Left Arm: Giơ tay chữ V (Peace sign) */}
          <path
            d="M 34 55 Q 24 48, 20 40"
            stroke={SHIRT_ORANGE}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle cx="19" cy="38" r="4.5" fill={SKIN_TONE} />
          {/* V sign fingers */}
          <line x1="18" y1="36" x2="16" y2="30" stroke={SKIN_TONE} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="20" y1="36" x2="23" y2="30" stroke={SKIN_TONE} strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Arm: Vẫy chào */}
          <path
            d="M 66 55 Q 78 52, 82 42"
            stroke={SHIRT_ORANGE}
            strokeWidth="7"
            strokeLinecap="round"
            className={isHovered ? 'animate-arm-wave origin-bottom-left' : ''}
          />
          <circle cx="83" cy="40" r="4.5" fill={SKIN_TONE} />

          {/* Head & Hair base */}
          <circle cx="50" cy="36" r="23" fill={SKIN_TONE} />

          {/* Short Bob Hair (Tóc ngắn bob cong cúp má) */}
          <path
            d="M 27 34 C 27 16, 73 16, 73 34 C 75 46, 70 54, 66 54 C 67 46, 68 36, 64 32 C 58 35, 52 28, 48 31 C 42 27, 36 34, 32 32 C 32 38, 33 46, 34 54 C 30 54, 25 46, 27 34 Z"
            fill="#26170E"
          />

          {/* Eyes */}
          <ellipse cx="41" cy="36" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="42.5" cy="34" r="2.2" fill="#FFFFFF" />
          <circle cx="39.5" cy="38.5" r="1.2" fill="#FFFFFF" />

          <ellipse cx="59" cy="36" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="60.5" cy="34" r="2.2" fill="#FFFFFF" />
          <circle cx="57.5" cy="38.5" r="1.2" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <ellipse cx="35" cy="42" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />
          <ellipse cx="65" cy="42" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />

          {/* Cute Smile */}
          <path d="M 46 42 Q 50 47, 54 42" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }

    case 'nam-english': {
      // Bé trai Nam - Mũ lưỡi trai cam đội lệch, áo cam, quần sooc nâu nhạt, vẫy cờ ABC
      return (
        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full drop-shadow-md select-none transition-transform duration-300 ${
            isHovered ? 'animate-chibi-dance' : ''
          } ${className}`}
        >
          {/* Legs & Shoes */}
          <rect x="40" y="88" width="6.5" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="42" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 36 107 Q 42 104, 48 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          <rect x="53.5" y="88" width="6.5" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="58" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 52 107 Q 58 104, 64 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          {/* Quần sooc nâu nhạt bé trai */}
          <path
            d="M 37 74 L 63 74 L 64 89 L 52 89 L 50 82 L 48 89 L 36 89 Z"
            fill={BROWN_BOTTOM}
          />
          <path d="M 50 74 L 50 82" stroke={BROWN_SHADOW} strokeWidth="1.5" />
          <rect x="36" y="72" width="28" height="3" rx="1.5" fill={BROWN_SHADOW} />

          {/* Body: Áo phông cam */}
          <path
            d="M 34 52 L 66 52 L 63 74 L 37 74 Z"
            fill={SHIRT_ORANGE}
          />
          <path
            d="M 43 52 C 43 57, 57 57, 57 52 Z"
            fill={SHIRT_COLLAR}
          />
          {/* English letter 'A' on chest */}
          <text x="50" y="66" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900" fontFamily="sans-serif">
            A
          </text>

          {/* Left Arm: Cầm cờ tam giác ABC */}
          <path
            d="M 34 55 Q 22 56, 18 48"
            stroke={SHIRT_ORANGE}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle cx="17" cy="47" r="4.5" fill={SKIN_TONE} />
          {/* Flag stick */}
          <line x1="17" y1="58" x2="17" y2="24" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          {/* Flag pennant */}
          <polygon points="17,26 3,33 17,40" fill="#3B82F6" />
          <text x="12" y="35" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="900">
            EN
          </text>

          {/* Right Arm: Vẫy tay chào vui nhộn */}
          <path
            d="M 66 55 Q 78 50, 84 40"
            stroke={SHIRT_ORANGE}
            strokeWidth="7"
            strokeLinecap="round"
            className={isHovered ? 'animate-arm-wave origin-bottom-left' : ''}
          />
          <circle cx="85" cy="38" r="4.5" fill={SKIN_TONE} />

          {/* Head & Hair base */}
          <circle cx="50" cy="36" r="23" fill={SKIN_TONE} />

          {/* Short Dark Hair */}
          <path d="M 28 36 C 28 20, 72 20, 72 36 Z" fill="#1C1917" />

          {/* Sideways Cool Orange Baseball Cap (Mũ lưỡi trai cam đội lệch) */}
          <path
            d="M 30 25 C 30 13, 68 12, 70 24 Z"
            fill="#EA580C"
          />
          <circle cx="48" cy="13" r="2.5" fill="#FBBF24" />
          {/* Cap Visor tilted right */}
          <path
            d="M 62 21 C 74 21, 84 27, 85 30 C 76 32, 64 26, 62 21 Z"
            fill="#C2410C"
          />

          {/* Eyes */}
          <ellipse cx="42" cy="37" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="43.5" cy="35" r="2.2" fill="#FFFFFF" />
          <circle cx="40.5" cy="39" r="1.2" fill="#FFFFFF" />

          <ellipse cx="58" cy="37" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="59.5" cy="35" r="2.2" fill="#FFFFFF" />
          <circle cx="56.5" cy="39" r="1.2" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <ellipse cx="36" cy="43" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />
          <ellipse cx="64" cy="43" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />

          {/* Big Cheerful Smile */}
          <path d="M 45 42 Q 50 49, 55 42" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" fill="#FCA5A5" />
        </svg>
      );
    }

    case 'an-pack': {
      // Bé gái An - Tóc đuôi ngựa lệch nơ dâu tây, áo cam, váy nâu nhạt trên gối, ôm hộp quà
      return (
        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full drop-shadow-md select-none transition-transform duration-300 ${
            isHovered ? 'animate-chibi-dance' : ''
          } ${className}`}
        >
          {/* High Side Ponytail (Đuôi ngựa lệch cao) */}
          <path
            d="M 68 20 C 82 12, 92 18, 90 32 C 86 36, 78 30, 70 26 Z"
            fill="#3F2314"
          />
          {/* Strawberry Hair Tie */}
          <circle cx="70" cy="22" r="4.5" fill="#EF4444" />
          <polygon points="68,18 70,16 72,18" fill="#22C55E" />

          {/* Legs & Shoes */}
          <rect x="40" y="88" width="6" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="42" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 36 107 Q 42 104, 48 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          <rect x="54" y="88" width="6" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="58" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 52 107 Q 58 104, 64 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          {/* Váy trên gối màu nâu nhạt */}
          <path
            d="M 37 74 L 63 74 L 69 90 L 31 90 Z"
            fill={BROWN_BOTTOM}
          />
          <path d="M 43 74 L 41 90" stroke={BROWN_SHADOW} strokeWidth="1.5" />
          <path d="M 50 74 L 50 90" stroke={BROWN_SHADOW} strokeWidth="1.5" />
          <path d="M 57 74 L 59 90" stroke={BROWN_SHADOW} strokeWidth="1.5" />
          <rect x="36" y="72" width="28" height="3" rx="1.5" fill={BROWN_SHADOW} />

          {/* Body: Áo phông cam */}
          <path
            d="M 34 52 L 66 52 L 64 74 L 36 74 Z"
            fill={SHIRT_ORANGE}
          />
          <path
            d="M 44 52 C 44 57, 56 57, 56 52 Z"
            fill={SHIRT_COLLAR}
          />

          {/* Cute Gift Box in Hands (Teaching Pack box) */}
          <rect x="38" y="60" width="24" height="18" rx="2" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
          <rect x="36" y="58" width="28" height="5" rx="1" fill="#F59E0B" />
          {/* Ribbon */}
          <line x1="50" y1="58" x2="50" y2="78" stroke="#EF4444" strokeWidth="3" />
          <circle cx="50" cy="57" r="3" fill="#EF4444" />

          {/* Hands holding the box */}
          <circle cx="36" cy="68" r="4" fill={SKIN_TONE} />
          <circle cx="64" cy="68" r="4" fill={SKIN_TONE} />

          {/* Right Arm: Waving when hovered */}
          {isHovered && (
            <g className="animate-arm-wave origin-bottom-left">
              <path d="M 66 55 Q 78 48, 83 38" stroke={SHIRT_ORANGE} strokeWidth="6" strokeLinecap="round" />
              <circle cx="84" cy="36" r="4.5" fill={SKIN_TONE} />
            </g>
          )}

          {/* Head & Hair base */}
          <circle cx="50" cy="36" r="23" fill={SKIN_TONE} />

          {/* Cute Hair Bangs */}
          <path
            d="M 28 32 C 28 16, 72 16, 72 32 C 66 26, 60 27, 54 31 C 48 26, 40 27, 36 32 Z"
            fill="#3F2314"
          />
          <path d="M 27 32 C 26 42, 28 48, 30 50 Z" fill="#3F2314" />

          {/* Eyes */}
          <ellipse cx="41" cy="36" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="42.5" cy="34" r="2.2" fill="#FFFFFF" />
          <circle cx="39.5" cy="38.5" r="1.2" fill="#FFFFFF" />

          <ellipse cx="59" cy="36" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="60.5" cy="34" r="2.2" fill="#FFFFFF" />
          <circle cx="57.5" cy="38.5" r="1.2" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <ellipse cx="35" cy="42" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />
          <ellipse cx="65" cy="42" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />

          {/* Happy Open Smile */}
          <path d="M 46 42 Q 50 48, 54 42" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" fill="#F87171" />
        </svg>
      );
    }

    case 'bo-library': {
      // Bé trai Bo - Tóc tém vuốt chỏm, áo cam, quần sooc nâu nhạt, ôm cuốn sách mầm non
      return (
        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full drop-shadow-md select-none transition-transform duration-300 ${
            isHovered ? 'animate-chibi-dance' : ''
          } ${className}`}
        >
          {/* Legs & Shoes */}
          <rect x="40" y="88" width="6.5" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="42" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 36 107 Q 42 104, 48 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          <rect x="53.5" y="88" width="6.5" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="58" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 52 107 Q 58 104, 64 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          {/* Quần sooc nâu nhạt bé trai */}
          <path
            d="M 37 74 L 63 74 L 64 89 L 52 89 L 50 82 L 48 89 L 36 89 Z"
            fill={BROWN_BOTTOM}
          />
          <path d="M 50 74 L 50 82" stroke={BROWN_SHADOW} strokeWidth="1.5" />
          <rect x="36" y="72" width="28" height="3" rx="1.5" fill={BROWN_SHADOW} />

          {/* Body: Áo phông cam */}
          <path
            d="M 34 52 L 66 52 L 63 74 L 37 74 Z"
            fill={SHIRT_ORANGE}
          />
          <path
            d="M 43 52 C 43 57, 57 57, 57 52 Z"
            fill={SHIRT_COLLAR}
          />

          {/* Left Arm: Cầm cuốn sách tranh mở */}
          <path
            d="M 34 55 Q 24 64, 25 74"
            stroke={SHIRT_ORANGE}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle cx="26" cy="74" r="4.5" fill={SKIN_TONE} />
          {/* Picture book */}
          <polygon points="18,62 30,66 30,80 18,76" fill="#38BDF8" />
          <polygon points="30,66 42,62 42,76 30,80" fill="#60A5FA" />
          <line x1="30" y1="66" x2="30" y2="80" stroke="#FFFFFF" strokeWidth="1" />

          {/* Right Arm: Vẫy chào */}
          <path
            d="M 66 55 Q 78 50, 82 40"
            stroke={SHIRT_ORANGE}
            strokeWidth="7"
            strokeLinecap="round"
            className={isHovered ? 'animate-arm-wave origin-bottom-left' : ''}
          />
          <circle cx="83" cy="38" r="4.5" fill={SKIN_TONE} />

          {/* Head & Hair base */}
          <circle cx="50" cy="36" r="23" fill={SKIN_TONE} />

          {/* Stylish Spiky Boy Hair (Tóc tém vuốt chỏm năng động) */}
          <path
            d="M 28 35 
               C 27 20, 36 12, 50 10 
               C 52 5, 56 6, 56 12
               C 66 12, 73 20, 72 35
               C 68 28, 62 26, 56 31 
               C 52 26, 44 26, 38 31 Z"
            fill="#1E1B18"
          />
          {/* Cool hair spike */}
          <polygon points="48,12 52,4 55,11" fill="#1E1B18" />

          {/* Eyes (Smiling happy curved eyes) */}
          <path d="M 38 36 Q 42 32, 46 36" stroke="#2E1C11" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 54 36 Q 58 32, 62 36" stroke="#2E1C11" strokeWidth="2.5" strokeLinecap="round" />

          {/* Eyebrows */}
          <path d="M 37 30 Q 42 28, 46 30" stroke="#1E1B18" strokeWidth="2" strokeLinecap="round" />
          <path d="M 54 30 Q 58 28, 63 30" stroke="#1E1B18" strokeWidth="2" strokeLinecap="round" />

          {/* Rosy Cheeks */}
          <ellipse cx="36" cy="42" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />
          <ellipse cx="64" cy="42" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />

          {/* Joyful Grin */}
          <path d="M 45 42 Q 50 50, 55 42 Z" fill="#DC2626" />
          <rect x="47" y="42" width="6" height="2" rx="0.5" fill="#FFFFFF" />
        </svg>
      );
    }

    case 'dung-video': {
      // Bé trai Dũng - Mặc áo phông cam, quần sooc nâu nhạt, cầm máy quay phim mini đáng yêu
      return (
        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full drop-shadow-md select-none transition-transform duration-300 ${
            isHovered ? 'animate-chibi-dance' : ''
          } ${className}`}
        >
          {/* Legs & Shoes */}
          <rect x="40" y="88" width="6.5" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="42" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 36 107 Q 42 104, 48 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          <rect x="53.5" y="88" width="6.5" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="58" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 52 107 Q 58 104, 64 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          {/* Quần sooc nâu nhạt bé trai */}
          <path
            d="M 37 74 L 63 74 L 64 89 L 52 89 L 50 82 L 48 89 L 36 89 Z"
            fill={BROWN_BOTTOM}
          />
          <path d="M 50 74 L 50 82" stroke={BROWN_SHADOW} strokeWidth="1.5" />
          <rect x="36" y="72" width="28" height="3" rx="1.5" fill={BROWN_SHADOW} />

          {/* Body: Áo phông cam */}
          <path
            d="M 34 52 L 66 52 L 63 74 L 37 74 Z"
            fill={SHIRT_ORANGE}
          />
          <path
            d="M 43 52 C 43 57, 57 57, 57 52 Z"
            fill={SHIRT_COLLAR}
          />

          {/* Cute Play Icon / Video reel badge on shirt */}
          <circle cx="50" cy="63" r="4.5" fill="#FFFFFF" />
          <polygon points="49,60 54,63 49,66" fill={SHIRT_ORANGE} />

          {/* Left Arm: Cầm máy quay phim mini (Mini movie camera) */}
          <path
            d="M 34 55 Q 22 58, 20 66"
            stroke={SHIRT_ORANGE}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle cx="20" cy="67" r="4.5" fill={SKIN_TONE} />
          {/* Mini video camera */}
          <rect x="10" y="60" width="14" height="10" rx="2" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="14" cy="57" r="3" fill="#38BDF8" />
          <circle cx="20" cy="57" r="3" fill="#38BDF8" />
          <polygon points="24,63 29,60 29,70 24,67" fill="#0284C7" />
          <circle cx="16" cy="65" r="2.5" fill="#FDE047" />

          {/* Right Arm: Vẫy tay chào vui nhộn */}
          <path
            d="M 66 55 Q 78 50, 84 38"
            stroke={SHIRT_ORANGE}
            strokeWidth="7"
            strokeLinecap="round"
            className={isHovered ? 'animate-arm-wave origin-bottom-left' : ''}
          />
          <circle cx="85" cy="36" r="4.5" fill={SKIN_TONE} />
          <circle cx="88" cy="34" r="1.5" fill={SKIN_TONE} />

          {/* Head & Hair base */}
          <circle cx="50" cy="36" r="23" fill={SKIN_TONE} />

          {/* Short Dark Brown Hair with cute side fringe */}
          <path
            d="M 28 35 
               C 27 18, 38 12, 50 11 
               C 62 11, 73 18, 72 35
               C 68 27, 60 26, 54 30 
               C 48 25, 42 27, 36 32 Z"
            fill="#2D1E16"
          />
          {/* Director Beret/Cap (Mũ beret nghệ sĩ xanh lam nhỏ xinh) */}
          <path d="M 32 20 C 38 12, 62 12, 68 20 C 65 24, 35 24, 32 20 Z" fill="#0284C7" />
          <circle cx="50" cy="13" r="2.5" fill="#FBBF24" />

          {/* Big Sparkling Eyes */}
          <ellipse cx="42" cy="37" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="43.5" cy="35" r="2.2" fill="#FFFFFF" />
          <circle cx="40.5" cy="39" r="1.2" fill="#FFFFFF" />

          <ellipse cx="58" cy="37" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="59.5" cy="35" r="2.2" fill="#FFFFFF" />
          <circle cx="56.5" cy="39" r="1.2" fill="#FFFFFF" />

          {/* Eyebrows */}
          <path d="M 38 31 Q 42 29, 45 31" stroke="#2D1E16" strokeWidth="2" strokeLinecap="round" />
          <path d="M 55 31 Q 58 29, 62 31" stroke="#2D1E16" strokeWidth="2" strokeLinecap="round" />

          {/* Rosy Cheeks */}
          <ellipse cx="36" cy="43" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />
          <ellipse cx="64" cy="43" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />

          {/* Cheerful Smile */}
          <path d="M 45 42 Q 50 49, 55 42" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" fill="#FCA5A5" />
        </svg>
      );
    }

    case 'phuc-practice': {
      // Bé trai Phúc - Đeo băng rôn quyết tâm đỏ "AI", tay cầm bút lông thông minh và giơ tay chiến thắng
      return (
        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full drop-shadow-md select-none transition-transform duration-300 ${
            isHovered ? 'animate-chibi-dance' : ''
          } ${className}`}
        >
          {/* Legs & Shoes */}
          <rect x="40" y="88" width="6.5" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="42" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 36 107 Q 42 104, 48 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          <rect x="53.5" y="88" width="6.5" height="18" rx="3" fill={SKIN_TONE} />
          <ellipse cx="58" cy="107" rx="7" ry="5" fill={SHOES_WHITE} />
          <path d="M 52 107 Q 58 104, 64 107" stroke={SHOES_ORANGE} strokeWidth="2" strokeLinecap="round" />

          {/* Quần sooc nâu nhạt bé trai */}
          <path
            d="M 37 74 L 63 74 L 64 89 L 52 89 L 50 82 L 48 89 L 36 89 Z"
            fill={BROWN_BOTTOM}
          />
          <path d="M 50 74 L 50 82" stroke={BROWN_SHADOW} strokeWidth="1.5" />
          <rect x="36" y="72" width="28" height="3" rx="1.5" fill={BROWN_SHADOW} />

          {/* Body: Áo phông cam */}
          <path
            d="M 34 52 L 66 52 L 63 74 L 37 74 Z"
            fill={SHIRT_ORANGE}
          />
          {/* White Round Collar */}
          <path d="M 44 52 C 44 57, 56 57, 56 52 Z" fill={SHIRT_COLLAR} />

          {/* Red Determination Headband Knot (dải băng rôn bay) */}
          <path d="M 74 24 Q 84 22, 88 28" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
          <path d="M 74 26 Q 86 28, 90 34" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />

          {/* Left Arm: Cầm bút stylus / bút chì ma thuật */}
          <path d="M 34 55 Q 22 62, 24 72" stroke={SHIRT_ORANGE} strokeWidth="7" strokeLinecap="round" />
          <circle cx="25" cy="73" r="4.5" fill={SKIN_TONE} />
          {/* Pen */}
          <rect x="19" y="66" width="4" height="13" rx="1.5" fill="#3B82F6" transform="rotate(30 21 72)" />
          <polygon points="25,64 27,61 30,66" fill="#FBBF24" />

          {/* Right Arm: Giơ tay số 1 chiến thắng */}
          <path
            d="M 66 55 Q 76 46, 82 36"
            stroke={SHIRT_ORANGE}
            strokeWidth="7"
            strokeLinecap="round"
            className={isHovered ? 'animate-arm-wave origin-bottom-left' : ''}
          />
          <circle cx="83" cy="35" r="5" fill={SKIN_TONE} />
          <path d="M 83 35 L 85 28" stroke={SKIN_TONE} strokeWidth="3" strokeLinecap="round" />

          {/* Head & Hair base */}
          <circle cx="50" cy="36" r="23" fill={SKIN_TONE} />

          {/* Red Determination Headband on forehead */}
          <path d="M 28 27 C 35 22, 65 22, 72 27" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Gold Star on Headband */}
          <polygon points="50,22 52,26 56,26 53,28 54,32 50,29 46,32 47,28 44,26 48,26" fill="#FDE047" />

          {/* Hair Bangs */}
          <path
            d="M 28 32 C 28 16, 72 16, 72 32 C 68 28, 62 27, 56 31 C 50 27, 44 28, 38 31 Z"
            fill="#2D1E16"
          />

          {/* Big Sparkling Enthusiastic Eyes */}
          <ellipse cx="42" cy="37" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="43.5" cy="35" r="2.2" fill="#FFFFFF" />
          <circle cx="40.5" cy="39" r="1.2" fill="#FFFFFF" />

          <ellipse cx="58" cy="37" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="59.5" cy="35" r="2.2" fill="#FFFFFF" />
          <circle cx="56.5" cy="39" r="1.2" fill="#FFFFFF" />

          {/* Eyebrows determined */}
          <path d="M 37 30 L 46 32" stroke="#2D1E16" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 63 30 L 54 32" stroke="#2D1E16" strokeWidth="2.5" strokeLinecap="round" />

          {/* Rosy Cheeks */}
          <ellipse cx="36" cy="43" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />
          <ellipse cx="64" cy="43" rx="4.5" ry="3" fill={BLUSH} opacity="0.65" />

          {/* Cheerful Determined Smile */}
          <path d="M 45 42 Q 50 49, 55 42" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" fill="#FCA5A5" />
        </svg>
      );
    }

    case 'lan-community': {
      // Bé gái Lan - Cầm cờ kết nối trái tim cộng đồng, tóc tết bím nơ hoa, áo cam, váy nâu nhạt trên gối
      return (
        <svg
          viewBox="0 0 100 115"
          fill="none"
          className={`${className} ${isHovered ? 'animate-bounce' : ''}`}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="110" rx="20" ry="4" fill="#000000" opacity="0.12" />

          {/* Shoes */}
          <rect x="36" y="103" width="10" height="7" rx="3.5" fill={SHOES_WHITE} stroke="#E2E8F0" strokeWidth="1" />
          <ellipse cx="41" cy="104" rx="3.5" ry="1.5" fill={SHOES_ORANGE} />
          <rect x="54" y="103" width="10" height="7" rx="3.5" fill={SHOES_WHITE} stroke="#E2E8F0" strokeWidth="1" />
          <ellipse cx="59" cy="104" rx="3.5" ry="1.5" fill={SHOES_ORANGE} />

          {/* Legs */}
          <rect x="38" y="94" width="6" height="10" rx="3" fill={SKIN_TONE} />
          <rect x="56" y="94" width="6" height="10" rx="3" fill={SKIN_TONE} />

          {/* Skirt: Brownish beige, above knee */}
          <path d="M 33 80 L 67 80 L 71 96 L 29 96 Z" fill={BROWN_BOTTOM} />
          <path d="M 33 80 L 67 80 L 68 83 L 32 83 Z" fill={BROWN_SHADOW} />

          {/* Uniform Orange Shirt */}
          <path d="M 32 55 L 68 55 L 67 81 L 33 81 Z" fill={SHIRT_ORANGE} />
          {/* White Peter Pan Collar */}
          <path d="M 40 55 C 44 59, 48 59, 50 56 C 52 59, 56 59, 60 55 Z" fill={SHIRT_COLLAR} />

          {/* Right Arm: Waving hand */}
          <path d="M 68 58 Q 78 68, 76 76" stroke={SHIRT_ORANGE} strokeWidth="7" strokeLinecap="round" />
          <circle cx="76" cy="78" r="4" fill={SKIN_TONE} />

          {/* Left Arm: Holding Community Heart Flag */}
          <path d="M 32 58 Q 22 64, 24 72" stroke={SHIRT_ORANGE} strokeWidth="7" strokeLinecap="round" />
          <circle cx="24" cy="74" r="4" fill={SKIN_TONE} />
          {/* Flagpole */}
          <line x1="24" y1="40" x2="24" y2="88" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          {/* Flag with Heart */}
          <path d="M 24 42 L 6 48 L 24 55 Z" fill="#EF4444" />
          <circle cx="16" cy="48" r="2" fill="#FFFFFF" />

          {/* Hair behind shoulders */}
          <path d="M 26 40 C 20 60, 24 70, 32 75" stroke="#3A2012" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M 74 40 C 80 60, 76 70, 68 75" stroke="#3A2012" strokeWidth="6" strokeLinecap="round" fill="none" />

          {/* Head & Face */}
          <circle cx="50" cy="36" r="23" fill={SKIN_TONE} />

          {/* Hair Bangs with cute flower clip */}
          <path
            d="M 28 32 C 28 16, 72 16, 72 32 C 67 26, 60 26, 52 30 C 44 26, 36 26, 28 32 Z"
            fill="#3A2012"
          />

          {/* Flower Hairpin on left hair */}
          <circle cx="34" cy="22" r="3.5" fill="#F59E0B" />
          <circle cx="34" cy="22" r="1.5" fill="#FFFFFF" />

          {/* Big Sparkly Friendly Eyes */}
          <ellipse cx="42" cy="37" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="43.5" cy="35" r="2.2" fill="#FFFFFF" />
          <circle cx="40.5" cy="39" r="1.2" fill="#FFFFFF" />

          <ellipse cx="58" cy="37" rx="4.5" ry="6" fill="#2E1C11" />
          <circle cx="59.5" cy="35" r="2.2" fill="#FFFFFF" />
          <circle cx="56.5" cy="39" r="1.2" fill="#FFFFFF" />

          {/* Eyebrows */}
          <path d="M 38 29 Q 42 27, 46 29" stroke="#3A2012" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 54 29 Q 58 27, 62 29" stroke="#3A2012" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Sweet Rosy Cheeks */}
          <ellipse cx="36" cy="43" rx="4.5" ry="3" fill={BLUSH} opacity="0.7" />
          <ellipse cx="64" cy="43" rx="4.5" ry="3" fill={BLUSH} opacity="0.7" />

          {/* Cute Smile */}
          <path d="M 45 43 Q 50 49, 55 43" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" fill="#FCA5A5" />
        </svg>
      );
    }

    default:
      return null;
  }
};

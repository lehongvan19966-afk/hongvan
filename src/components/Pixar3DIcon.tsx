import React from 'react';

export type PixarIconType =
  | 'lesson'
  | 'magic'
  | 'academy'
  | 'english'
  | 'pack'
  | 'library'
  | 'quiz'
  | 'game'
  | 'community'
  | 'family'
  | 'sprout'
  | 'sparkle'
  | 'trophy'
  | 'video'
  | 'robot';

interface Pixar3DIconProps {
  name: PixarIconType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export const Pixar3DIcon: React.FC<Pixar3DIconProps> = ({
  name,
  size = 'md',
  className = '',
  animate = true,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const dim = sizeMap[size];

  // Render SVG 3D clay-style illustrated icon with warm caramel/terracotta/amber highlights
  const renderIcon = () => {
    switch (name) {
      case 'lesson':
        // 3D Cute Warm Book with bookmark & golden spark
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(194,65,12,0.22)]">
            <defs>
              <linearGradient id="bookCoverGrad" x1="8" y1="12" x2="56" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FB923C" />
                <stop offset="60%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#9A3412" />
              </linearGradient>
              <linearGradient id="bookPagesGrad" x1="16" y1="18" x2="48" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FEF3C7" />
              </linearGradient>
              <linearGradient id="bookRibbon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            {/* Book spine & back */}
            <rect x="10" y="14" width="44" height="38" rx="8" fill="url(#bookCoverGrad)" />
            {/* Shadow under page */}
            <rect x="14" y="16" width="38" height="32" rx="5" fill="#D97706" opacity="0.4" />
            {/* Soft Clay Pages */}
            <rect x="14" y="14" width="38" height="32" rx="5" fill="url(#bookPagesGrad)" />
            {/* Spine highlight */}
            <rect x="10" y="14" width="6" height="38" rx="3" fill="#FDBA74" opacity="0.6" />
            {/* Page line accents */}
            <line x1="24" y1="22" x2="44" y2="22" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
            <line x1="24" y1="28" x2="40" y2="28" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
            <line x1="24" y1="34" x2="44" y2="34" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
            {/* Sprout bookmark hanging out */}
            <path d="M28 12 C28 8, 36 8, 36 12 C36 18, 32 20, 32 20 C32 20, 28 18, 28 12 Z" fill="#84CC16" />
            <path d="M32 10 Q34 6 36 7" stroke="#4D7C0F" strokeWidth="1.5" strokeLinecap="round" />
            {/* Cute glossy specular on cover */}
            <ellipse cx="20" cy="18" rx="6" ry="2.5" fill="#FFFFFF" opacity="0.5" transform="rotate(-15 20 18)" />
            {/* Sparkle 3D star */}
            <polygon points="48,10 50,15 55,17 50,19 48,24 46,19 41,17 46,15" fill="#FBBF24" />
          </svg>
        );

      case 'magic':
        // 3D Cute Warm Magic Wand with glowing star & rainbow stardust
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(234,88,12,0.25)]">
            <defs>
              <linearGradient id="wandGrad" x1="12" y1="52" x2="38" y2="26" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#78350F" />
                <stop offset="50%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <linearGradient id="starGrad" x1="28" y1="10" x2="54" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="40%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
            </defs>
            {/* Wand shaft */}
            <rect x="14" y="44" width="8" height="20" rx="4" transform="rotate(-45 14 44)" fill="url(#wandGrad)" />
            <rect x="23" y="35" width="8" height="6" rx="2" transform="rotate(-45 23 35)" fill="#FDE68A" />
            {/* Big 3D Puffy Star Head */}
            <path
              d="M44 8 L47.5 18.5 L58 19 L49.5 26 L52.5 36.5 L44 30.5 L35.5 36.5 L38.5 26 L30 19 L40.5 18.5 Z"
              fill="url(#starGrad)"
            />
            {/* Specular 3D bulb on star */}
            <circle cx="41" cy="18" r="4" fill="#FFFFFF" opacity="0.6" />
            <circle cx="44" cy="24" r="2.5" fill="#FFFFFF" opacity="0.8" />
            {/* Magic sparkles */}
            <circle cx="56" cy="12" r="2.5" fill="#F59E0B" />
            <circle cx="28" cy="16" r="2" fill="#FB923C" />
            <circle cx="54" cy="42" r="2" fill="#FBBF24" />
            <circle cx="16" cy="28" r="2.5" fill="#F97316" />
          </svg>
        );

      case 'academy':
        // 3D Graduation Cap with warm tassel & golden medal
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(180,83,9,0.22)]">
            <defs>
              <linearGradient id="capGrad" x1="12" y1="18" x2="52" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C2410C" />
                <stop offset="70%" stopColor="#9A3412" />
                <stop offset="100%" stopColor="#7C2D12" />
              </linearGradient>
              <linearGradient id="tasselGrad" x1="48" y1="26" x2="54" y2="46" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            {/* Cap bottom skull */}
            <path d="M20 32 C20 40, 44 40, 44 32 L44 37 C44 45, 20 45, 20 37 Z" fill="#7C2D12" />
            {/* Cap Diamond Top (3D perspective) */}
            <polygon points="32,14 58,26 32,38 6,26" fill="url(#capGrad)" />
            {/* Diamond bevel highlight */}
            <polygon points="32,14 58,26 32,28 16,24" fill="#EA580C" opacity="0.6" />
            {/* Button on top */}
            <ellipse cx="32" cy="26" rx="4" ry="2.5" fill="#FEF08A" />
            {/* Tassel cord */}
            <path d="M34 26 C46 26, 48 32, 50 42" stroke="url(#tasselGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Tassel puff */}
            <rect x="47" y="40" width="6" height="10" rx="3" fill="#F59E0B" />
            {/* Little diploma roll on side */}
            <rect x="12" y="46" width="22" height="7" rx="3.5" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1" />
            <rect x="20" y="46" width="4" height="7" fill="#EA580C" />
          </svg>
        );

      case 'english':
        // 3D Cute Globe with Headphones (Warm English Buddy)
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(217,119,6,0.22)]">
            <defs>
              <linearGradient id="globeGrad" x1="14" y1="14" x2="50" y2="50" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FED7AA" />
                <stop offset="50%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
              <linearGradient id="continentGrad" x1="18" y1="18" x2="46" y2="46" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#86EFAC" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
            </defs>
            {/* Globe sphere */}
            <circle cx="32" cy="34" r="18" fill="url(#globeGrad)" />
            {/* Continents cute clay patches */}
            <ellipse cx="26" cy="30" rx="6" ry="7" fill="url(#continentGrad)" opacity="0.9" />
            <ellipse cx="39" cy="37" rx="5" ry="6" fill="url(#continentGrad)" opacity="0.9" />
            <circle cx="34" cy="25" r="3" fill="url(#continentGrad)" opacity="0.9" />
            {/* Specular glossy shine */}
            <ellipse cx="24" cy="24" rx="5" ry="3" fill="#FFFFFF" opacity="0.6" transform="rotate(-30 24 24)" />
            {/* Headphone band over globe */}
            <path d="M12 34 C12 18, 52 18, 52 34" stroke="#9A3412" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Left earphone pad */}
            <rect x="9" y="30" width="6" height="12" rx="3" fill="#F59E0B" />
            {/* Right earphone pad */}
            <rect x="49" y="30" width="6" height="12" rx="3" fill="#F59E0B" />
            {/* Speech bubble "ABC" */}
            <rect x="36" y="8" width="22" height="14" rx="6" fill="#FFFFFF" stroke="#FDBA74" strokeWidth="1.5" />
            <text x="40" y="18" fontSize="8" fontWeight="bold" fill="#C2410C" fontFamily="sans-serif">ABC</text>
          </svg>
        );

      case 'pack':
        // 3D Teaching Pack Box with overflowing cute toys & crayons
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(180,83,9,0.22)]">
            <defs>
              <linearGradient id="boxGrad" x1="12" y1="26" x2="52" y2="56" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FDBA74" />
                <stop offset="50%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
            </defs>
            {/* Items inside pack popping out */}
            {/* Crayon */}
            <rect x="20" y="12" width="6" height="16" rx="2" transform="rotate(-15 20 12)" fill="#38BDF8" />
            <polygon points="17,10 23,8 20,4" fill="#0284C7" />
            {/* Scissors / Ruler */}
            <rect x="38" y="10" width="5" height="18" rx="2" transform="rotate(20 38 10)" fill="#F43F5E" />
            {/* Star badge */}
            <polygon points="32,8 34,13 39,14 35,18 36,23 32,20 28,23 29,18 25,14 30,13" fill="#FBBF24" />
            {/* Box main body */}
            <rect x="12" y="24" width="40" height="28" rx="8" fill="url(#boxGrad)" />
            {/* Box open flap */}
            <rect x="10" y="22" width="44" height="8" rx="4" fill="#EA580C" />
            {/* Front label with cute heart/leaf */}
            <rect x="22" y="32" width="20" height="12" rx="4" fill="#FFFBEB" />
            <circle cx="32" cy="38" r="3" fill="#EA580C" />
            {/* Specular */}
            <rect x="14" y="26" width="36" height="2" fill="#FED7AA" opacity="0.7" />
          </svg>
        );

      case 'library':
        // 3D Folder Heart / Treasure Chest of learning
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(194,65,12,0.22)]">
            <defs>
              <linearGradient id="folderGrad" x1="10" y1="18" x2="54" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FED7AA" />
                <stop offset="40%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
            </defs>
            {/* Folder tab */}
            <path d="M12 20 L24 20 L28 25 L50 25 C52.5 25, 54 26.5, 54 29 L54 32 L10 32 L10 23 C10 21.3, 11 20, 12 20 Z" fill="#FB923C" />
            {/* Sheet sticking out */}
            <rect x="16" y="14" width="32" height="18" rx="3" fill="#FFFFFF" />
            <line x1="22" y1="19" x2="42" y2="19" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            {/* Folder front pocket */}
            <rect x="10" y="26" width="44" height="26" rx="8" fill="url(#folderGrad)" />
            {/* 3D Heart on front */}
            <path
              d="M32 46 C32 46, 22 40, 22 34 C22 30.5, 24.5 28, 28 28 C30 28, 31.5 29, 32 30 C32.5 29, 34 28, 36 28 C39.5 28, 42 30.5, 42 34 C42 40, 32 46, 32 46 Z"
              fill="#FFFBEB"
            />
            <path
              d="M32 44 C32 44, 24 39, 24 34 C24 31.5, 26 29.5, 28.5 29.5 C30 29.5, 31.5 30.5, 32 31.5 C32.5 30.5, 34 29.5, 35.5 29.5 C38 29.5, 40 31.5, 40 34 C40 39, 32 44, 32 44 Z"
              fill="#EA580C"
            />
          </svg>
        );

      case 'quiz':
        // 3D Question Block / Quiz Bulb with warm sparkles
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(217,119,6,0.22)]">
            <defs>
              <linearGradient id="quizGrad" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            {/* 3D Rounded Cube */}
            <rect x="12" y="12" width="40" height="40" rx="12" fill="url(#quizGrad)" />
            {/* Top bevel highlight */}
            <rect x="15" y="15" width="34" height="6" rx="3" fill="#FFFFFF" opacity="0.5" />
            {/* Question mark 3D */}
            <path
              d="M26 24 C26 20, 38 20, 38 25 C38 29, 32 30, 32 34"
              stroke="#78350F"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="32" cy="42" r="3" fill="#78350F" />
            {/* Small sparkle dots */}
            <circle cx="50" cy="14" r="2.5" fill="#EA580C" />
            <circle cx="12" cy="48" r="2" fill="#F59E0B" />
          </svg>
        );

      case 'game':
        // 3D Cute Gamepad Controller in warm terracotta
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(180,83,9,0.22)]">
            <defs>
              <linearGradient id="padGrad" x1="8" y1="20" x2="56" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FED7AA" />
                <stop offset="40%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
            </defs>
            {/* Gamepad body with cute grip ears */}
            <path
              d="M16 22 C10 22, 6 28, 8 38 C9 45, 14 50, 20 48 C25 46, 27 38, 32 38 C37 38, 39 46, 44 48 C50 50, 55 45, 56 38 C58 28, 54 22, 48 22 Z"
              fill="url(#padGrad)"
            />
            {/* D-Pad on left */}
            <rect x="18" y="29" width="4" height="12" rx="2" fill="#78350F" />
            <rect x="14" y="33" width="12" height="4" rx="2" fill="#78350F" />
            {/* Action buttons on right (candy colors) */}
            <circle cx="44" cy="30" r="3" fill="#22C55E" />
            <circle cx="49" cy="35" r="3" fill="#EF4444" />
            <circle cx="39" cy="35" r="3" fill="#3B82F6" />
            <circle cx="44" cy="40" r="3" fill="#EAB308" />
            {/* Glossy top reflection */}
            <path d="M22 25 Q32 28 42 25" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" fill="none" />
          </svg>
        );

      case 'community':
        // 3D Chat Bubbles with Hearts (Warm Community)
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(217,119,6,0.22)]">
            <defs>
              <linearGradient id="chatGrad1" x1="8" y1="12" x2="44" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
              <linearGradient id="chatGrad2" x1="24" y1="24" x2="56" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            {/* Main bubble */}
            <rect x="8" y="12" width="36" height="26" rx="12" fill="url(#chatGrad1)" />
            <polygon points="16,38 24,38 18,46" fill="#EA580C" />
            {/* Heart inside main bubble */}
            <path d="M26 28 C26 28, 19 24, 19 20 C19 18, 20.5 16.5, 22.5 16.5 C24 16.5, 25.5 17.5, 26 18.5 C26.5 17.5, 28 16.5, 29.5 16.5 C31.5 16.5, 33 18, 33 20 C33 24, 26 28, 26 28 Z" fill="#FFFBEB" />
            {/* Secondary bubble overlapping */}
            <rect x="28" y="24" width="28" height="22" rx="10" fill="url(#chatGrad2)" />
            <polygon points="46,46 52,46 48,52" fill="#F59E0B" />
            {/* 3 dots in second bubble */}
            <circle cx="36" cy="35" r="2" fill="#78350F" />
            <circle cx="42" cy="35" r="2" fill="#78350F" />
            <circle cx="48" cy="35" r="2" fill="#78350F" />
          </svg>
        );

      case 'family':
        // 3D Cute House with Sprout & Heart (Family Mode)
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(180,83,9,0.22)]">
            <defs>
              <linearGradient id="roofGrad" x1="12" y1="12" x2="52" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
            </defs>
            {/* Roof */}
            <path d="M12 28 L32 12 L52 28 Z" fill="url(#roofGrad)" />
            {/* House body */}
            <rect x="16" y="28" width="32" height="24" rx="6" fill="#FFFBEB" stroke="#FDBA74" strokeWidth="2" />
            {/* Door */}
            <rect x="26" y="38" width="12" height="14" rx="4" fill="#EA580C" />
            {/* Warm window with heart */}
            <circle cx="32" cy="22" r="4" fill="#FEF08A" />
            {/* Sprout on roof */}
            <path d="M32 12 Q38 6 36 3 Q30 3 32 12" fill="#84CC16" />
          </svg>
        );

      case 'sprout':
        // 3D Sprout Leaf in warm clay pot
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(132,204,22,0.25)]">
            {/* Pot */}
            <path d="M22 36 L42 36 L39 52 L25 52 Z" fill="#B45309" />
            <rect x="18" y="32" width="28" height="6" rx="3" fill="#D97706" />
            {/* Stem */}
            <path d="M32 32 Q32 20 32 16" stroke="#65A30D" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Left Leaf */}
            <path d="M32 22 C22 22, 18 12, 24 10 C30 10, 32 18, 32 22 Z" fill="#84CC16" />
            {/* Right Leaf */}
            <path d="M32 18 C40 18, 46 8, 38 8 C32 8, 32 14, 32 18 Z" fill="#A3E635" />
          </svg>
        );

      case 'sparkle':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(245,158,11,0.25)]">
            <polygon points="32,8 36,24 52,28 36,32 32,48 28,32 12,28 28,24" fill="#F59E0B" />
            <polygon points="46,38 48,46 56,48 48,50 46,58 44,50 36,48 44,46" fill="#FBBF24" />
          </svg>
        );

      case 'trophy':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(217,119,6,0.25)]">
            <defs>
              <linearGradient id="cupGrad" x1="16" y1="12" x2="48" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <path d="M20 14 L44 14 L40 32 C40 38, 24 38, 24 32 Z" fill="url(#cupGrad)" />
            {/* Handles */}
            <path d="M20 18 C14 18, 14 26, 21 28" stroke="#D97706" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M44 18 C50 18, 50 26, 43 28" stroke="#D97706" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Stem & base */}
            <rect x="30" y="36" width="4" height="8" rx="2" fill="#B45309" />
            <rect x="22" y="44" width="20" height="8" rx="4" fill="#78350F" />
            <circle cx="32" cy="24" r="4" fill="#FFFFFF" opacity="0.6" />
          </svg>
        );

      case 'video':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(234,88,12,0.22)]">
            <rect x="10" y="16" width="44" height="32" rx="10" fill="#EA580C" />
            <rect x="14" y="20" width="36" height="24" rx="6" fill="#FFFBEB" />
            <polygon points="28,26 38,32 28,38" fill="#EA580C" />
          </svg>
        );

      case 'robot':
      default:
        // Mini mascot robot head
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_6px_10px_rgba(194,65,12,0.22)]">
            <rect x="12" y="16" width="40" height="34" rx="14" fill="#FFFBEB" stroke="#FDBA74" strokeWidth="2.5" />
            {/* Sprout */}
            <path d="M32 16 Q36 8 40 10 Q38 16 32 16" fill="#84CC16" />
            <circle cx="32" cy="16" r="2.5" fill="#F59E0B" />
            {/* Eyes */}
            <circle cx="24" cy="30" r="4.5" fill="#7C2D12" />
            <circle cx="23" cy="29" r="1.5" fill="#FFFFFF" />
            <circle cx="40" cy="30" r="4.5" fill="#7C2D12" />
            <circle cx="39" cy="29" r="1.5" fill="#FFFFFF" />
            {/* Blush */}
            <ellipse cx="20" cy="37" rx="3.5" ry="2" fill="#FDBA74" opacity="0.8" />
            <ellipse cx="44" cy="37" rx="3.5" ry="2" fill="#FDBA74" opacity="0.8" />
            {/* Smile */}
            <path d="M28 36 Q32 40 36 36" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${dim} ${className} ${
        animate ? 'transition-transform duration-300 hover:scale-110 active:scale-95' : ''
      }`}
    >
      {renderIcon()}
    </div>
  );
};

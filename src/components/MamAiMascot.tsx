import React from 'react';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'idle' | 'happy' | 'thinking' | 'teaching' | 'celebrate';
  className?: string;
}

export const MamAiMascot: React.FC<MascotProps> = ({
  size = 'md',
  mood = 'idle',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}
      aria-label="Mascot Mầm AI"
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="60%" stop-color="#FFF8F0" />
            <stop offset="100%" stop-color="#FFEDD5" />
          </linearGradient>
          <linearGradient id="vestGrad" x1="30" y1="70" x2="90" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#EA580C" />
            <stop offset="60%" stop-color="#F97316" />
            <stop offset="100%" stop-color="#D97706" />
          </linearGradient>
          <linearGradient id="sproutGrad" x1="50" y1="5" x2="75" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#34D399" />
            <stop offset="100%" stop-color="#059669" />
          </linearGradient>
          <radialGradient id="cheekBlush" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stop-color="#FB923C" stop-opacity="0.75" />
            <stop offset="100%" stop-color="#FB923C" stop-opacity="0" />
          </radialGradient>
        </defs>

        {/* Soft Warm Aura Glow */}
        <circle cx="60" cy="65" r="48" fill="#FED7AA" fillOpacity="0.35" />

        {/* Little antenna stem on head */}
        <path d="M60 28V16" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" />

        {/* Sprout Leaves on top of antenna */}
        <g className="animate-wiggle origin-[60px_16px]">
          {/* Main Leaf */}
          <path
            d="M60 16C60 6 74 6 72 17C71 22 64 20 60 16Z"
            fill="url(#sproutGrad)"
            stroke="#047857"
            strokeWidth="1"
          />
          {/* Baby Leaf */}
          <path
            d="M60 16C58 9 48 11 50 18C51 22 56 19 60 16Z"
            fill="#86EFAC"
            stroke="#047857"
            strokeWidth="0.8"
          />
        </g>

        {/* Round Friendly Robot Head */}
        <rect
          x="22"
          y="24"
          width="76"
          height="64"
          rx="32"
          fill="url(#bodyGrad)"
          stroke="#FDBA74"
          strokeWidth="2.5"
        />

        {/* Soft Caramel Ears */}
        <rect x="16" y="46" width="8" height="18" rx="4" fill="#FB923C" />
        <rect x="96" y="46" width="8" height="18" rx="4" fill="#FB923C" />

        {/* Cheeks blush */}
        <ellipse cx="36" cy="64" rx="7" ry="4.5" fill="url(#cheekBlush)" />
        <ellipse cx="84" cy="64" rx="7" ry="4.5" fill="url(#cheekBlush)" />

        {/* Big Expressive Eyes */}
        {mood === 'happy' || mood === 'celebrate' ? (
          // Happy crescent curved eyes
          <g stroke="#334155" strokeWidth="3" strokeLinecap="round">
            <path d="M38 56C41 51 47 51 50 56" />
            <path d="M70 56C73 51 79 51 82 56" />
          </g>
        ) : mood === 'thinking' ? (
          // Curious wondering eyes looking up
          <g>
            <circle cx="44" cy="53" r="6.5" fill="#1E293B" />
            <circle cx="46" cy="51" r="2.2" fill="#FFFFFF" />
            <circle cx="76" cy="51" r="6.5" fill="#1E293B" />
            <circle cx="78" cy="49" r="2.2" fill="#FFFFFF" />
          </g>
        ) : (
          // Sparkling cute eyes
          <g>
            <circle cx="44" cy="55" r="7" fill="#1E293B" />
            <circle cx="46.5" cy="52.5" r="2.8" fill="#FFFFFF" />
            <circle cx="42.5" cy="57" r="1.2" fill="#FFFFFF" />

            <circle cx="76" cy="55" r="7" fill="#1E293B" />
            <circle cx="78.5" cy="52.5" r="2.8" fill="#FFFFFF" />
            <circle cx="74.5" cy="57" r="1.2" fill="#FFFFFF" />
          </g>
        )}

        {/* Sweet Smile */}
        <path
          d="M52 66C56 71 64 71 68 66"
          stroke="#475569"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Body Vest */}
        <path
          d="M36 86C36 82 46 80 60 80C74 80 84 82 84 86L86 106C86 111 80 114 60 114C40 114 34 111 34 106L36 86Z"
          fill="url(#vestGrad)"
        />

        {/* Little Storybook or Crayon in Hand */}
        {mood === 'teaching' || mood === 'celebrate' ? (
          // Little book
          <g transform="translate(68, 80) rotate(-10)">
            <rect width="24" height="20" rx="3" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
            <path d="M12 0V20" stroke="#FFFFFF" strokeWidth="1.5" />
            <path d="M4 6H9M4 10H8" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M15 6H20M15 10H19" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        ) : (
          // Little yellow pencil
          <g transform="translate(74, 82) rotate(25)">
            <rect width="6" height="18" rx="2" fill="#FACC15" />
            <polygon points="0,0 6,0 3,-5" fill="#FB923C" />
            <circle cx="3" cy="-4" r="1" fill="#1E293B" />
          </g>
        )}

        {/* Gentle Sparkles when celebrating */}
        {mood === 'celebrate' && (
          <g fill="#F59E0B">
            <path d="M18 30L20 35L25 37L20 39L18 44L16 39L11 37L16 35Z" />
            <path d="M102 24L103.5 28L108 29.5L103.5 31L102 35L100.5 31L96 29.5L100.5 28Z" />
          </g>
        )}
      </svg>
    </div>
  );
};

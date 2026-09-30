import React from 'react';

export type SproutMood = 'happy' | 'dancing' | 'vui' | 'buon' | 'de-thuong';

interface CuteSproutCharacterProps {
  mood?: SproutMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isDancing?: boolean;
}

export const CuteSproutCharacter: React.FC<CuteSproutCharacterProps> = ({
  mood = 'dancing',
  size = 'lg',
  className = '',
  isDancing = true,
}) => {
  const sizeMap = {
    sm: 'w-16 h-20',
    md: 'w-24 h-28',
    lg: 'w-36 h-44',
    xl: 'w-48 h-56',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${
        isDancing ? 'animate-bounce-gentle' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 140 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(101,163,13,0.22)]"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="sproutBody" x1="70" y1="45" x2="70" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A3E635" />
            <stop offset="45%" stopColor="#84CC16" />
            <stop offset="100%" stopColor="#65A30D" />
          </linearGradient>

          <linearGradient id="leafGradLeft" x1="50" y1="10" x2="70" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>

          <linearGradient id="leafGradRight" x1="90" y1="10" x2="70" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>

          <linearGradient id="bellyHighlight" x1="70" y1="75" x2="70" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ECFDF5" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#D9F99D" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Soft shadow on ground */}
        <ellipse cx="70" cy="148" rx="38" ry="8" fill="#1E293B" opacity="0.12" />

        {/* Little Stubby Feet (Hai chân nhỏ nhún nhảy) */}
        <ellipse cx="52" cy="138" rx="9" ry="6" fill="#4D7C0F" />
        <ellipse cx="88" cy="138" rx="9" ry="6" fill="#4D7C0F" />

        {/* Sprout Leaves on Head (2 Mầm lá non đung đưa) */}
        <g className="origin-bottom animate-leaf-sway">
          {/* Stem base */}
          <path d="M 68 50 C 69 38, 71 34, 70 28" stroke="#4D7C0F" strokeWidth="4.5" strokeLinecap="round" />

          {/* Left Leaf */}
          <path
            d="M 70 30 C 50 16, 32 26, 42 42 C 52 46, 65 38, 70 30 Z"
            fill="url(#leafGradLeft)"
            stroke="#15803D"
            strokeWidth="1.5"
          />
          {/* Left leaf vein */}
          <path d="M 46 36 C 54 34, 62 33, 70 30" stroke="#DCFCE7" strokeWidth="1.5" strokeLinecap="round" />

          {/* Right Leaf */}
          <path
            d="M 70 30 C 90 12, 108 22, 98 38 C 88 44, 75 36, 70 30 Z"
            fill="url(#leafGradRight)"
            stroke="#15803D"
            strokeWidth="1.5"
          />
          {/* Right leaf vein */}
          <path d="M 94 32 C 86 32, 78 31, 70 30" stroke="#DCFCE7" strokeWidth="1.5" strokeLinecap="round" />

          {/* Little Yellow Dewdrop / Flower on leaf */}
          <circle cx="70" cy="24" r="4.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
          <circle cx="71" cy="23" r="1.5" fill="#FFFFFF" />
        </g>

        {/* Main Body: Cute Chubby Pear Sprout Body */}
        <path
          d="M 70 48
             C 48 48, 38 68, 38 88
             C 38 114, 48 140, 70 140
             C 92 140, 102 114, 102 88
             C 102 68, 92 48, 70 48 Z"
          fill="url(#sproutBody)"
          stroke="#4D7C0F"
          strokeWidth="2.5"
        />

        {/* Highlight on Head (Ánh sáng bóng bẩy) */}
        <ellipse cx="54" cy="62" rx="9" ry="5" fill="#FFFFFF" opacity="0.35" transform="rotate(-25 54 62)" />

        {/* Cute Soft Belly (Bụng trắng mềm mại) */}
        <ellipse cx="70" cy="102" rx="22" ry="24" fill="url(#bellyHighlight)" />

        {/* Little Waving Arms / Hands */}
        <g>
          {/* Left Hand: Waving enthusiastically */}
          <path
            d="M 40 85 C 24 82, 16 68, 20 62 C 24 56, 32 66, 42 78"
            fill="#84CC16"
            stroke="#4D7C0F"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Right Hand: Waving high */}
          <path
            d="M 100 85 C 116 80, 124 64, 120 58 C 116 52, 108 64, 98 78"
            fill="#84CC16"
            stroke="#4D7C0F"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Rosy Cheeks (Má hồng đào ửng xinh) */}
        <ellipse cx="49" cy="94" rx="7" ry="5" fill="#FB7185" opacity="0.75" />
        <ellipse cx="91" cy="94" rx="7" ry="5" fill="#FB7185" opacity="0.75" />
        <circle cx="47" cy="92" r="1.5" fill="#FFFFFF" opacity="0.8" />
        <circle cx="89" cy="92" r="1.5" fill="#FFFFFF" opacity="0.8" />

        {/* Cute Tiny Nose (Mũi chấm xinh) */}
        <ellipse cx="70" cy="85" rx="2.5" ry="1.8" fill="#4D7C0F" />

        {/* FACIAL EXPRESSIONS BASED ON MOOD */}

        {/* 1. MOOD: 'happy' / 'dancing' / 'vui' */}
        {(mood === 'happy' || mood === 'dancing' || mood === 'vui') && (
          <g>
            {/* Big Sparkling Anime Eyes */}
            <ellipse cx="53" cy="78" rx="6.5" ry="8" fill="#1C1917" />
            <circle cx="55.5" cy="75" r="3" fill="#FFFFFF" />
            <circle cx="51.5" cy="80.5" r="1.5" fill="#FFFFFF" />

            <ellipse cx="87" cy="78" rx="6.5" ry="8" fill="#1C1917" />
            <circle cx="89.5" cy="75" r="3" fill="#FFFFFF" />
            <circle cx="85.5" cy="80.5" r="1.5" fill="#FFFFFF" />

            {/* Eyebrows */}
            <path d="M 47 67 Q 53 64, 58 67" stroke="#365314" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 82 67 Q 87 64, 93 67" stroke="#365314" strokeWidth="2.2" strokeLinecap="round" />

            {/* Big Joyful Smile with pink tongue */}
            <path
              d="M 60 92 Q 70 108, 80 92 Z"
              fill="#DC2626"
              stroke="#7F1D1D"
              strokeWidth="1.5"
            />
            {/* Tongue */}
            <path d="M 64 99 Q 70 95, 76 99 Q 70 106, 64 99 Z" fill="#F472B6" />
          </g>
        )}

        {/* 2. MOOD: 'buon' (Sad/Comforting - Needs a Hug) */}
        {mood === 'buon' && (
          <g>
            {/* Glossy empathic eyes */}
            <ellipse cx="53" cy="79" rx="6.5" ry="7.5" fill="#1C1917" />
            <circle cx="55" cy="76" r="3.2" fill="#FFFFFF" />
            <circle cx="51" cy="81" r="1.8" fill="#FFFFFF" />
            {/* Sparkling tear droplet */}
            <path
              d="M 43 83 C 43 80, 46 78, 46 80 C 46 82, 43 86, 43 83 Z"
              fill="#38BDF8"
              opacity="0.9"
            />

            <ellipse cx="87" cy="79" rx="6.5" ry="7.5" fill="#1C1917" />
            <circle cx="89" cy="76" r="3.2" fill="#FFFFFF" />
            <circle cx="85" cy="81" r="1.8" fill="#FFFFFF" />
            <path
              d="M 97 83 C 97 80, 94 78, 94 80 C 94 82, 97 86, 97 83 Z"
              fill="#38BDF8"
              opacity="0.9"
            />

            {/* Gentle curved sad brows */}
            <path d="M 47 66 Q 53 69, 58 66" stroke="#365314" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 82 66 Q 87 69, 93 66" stroke="#365314" strokeWidth="2.2" strokeLinecap="round" />

            {/* Pouting gentle mouth */}
            <path d="M 63 97 Q 70 91, 77 97" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* 3. MOOD: 'de-thuong' (Adorable Heart Eyes & Flower Ribbon) */}
        {mood === 'de-thuong' && (
          <g>
            {/* Heart Eyes */}
            <path
              d="M 53 73 
                 C 53 69, 48 68, 46 72 
                 C 44 68, 39 69, 39 73 
                 C 39 79, 46 84, 46 84 
                 C 46 84, 53 79, 53 73 Z"
              fill="#E11D48"
              transform="translate(8, 2)"
            />
            <path
              d="M 87 73 
                 C 87 69, 82 68, 80 72 
                 C 78 68, 73 69, 73 73 
                 C 73 79, 80 84, 80 84 
                 C 80 84, 87 79, 87 73 Z"
              fill="#E11D48"
              transform="translate(8, 2)"
            />

            {/* Cheerful Eyebrows */}
            <path d="M 46 66 Q 52 62, 57 66" stroke="#365314" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 83 66 Q 88 62, 94 66" stroke="#365314" strokeWidth="2.2" strokeLinecap="round" />

            {/* Sweet 'W' Shaped Cat Mouth */}
            <path
              d="M 63 94 Q 67 98, 70 94 Q 73 98, 77 94"
              stroke="#BE123C"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Cute Strawberry / Pink Ribbon on Head */}
            <path
              d="M 86 46 C 82 40, 80 48, 86 52 C 92 48, 90 40, 86 46 Z"
              fill="#FB7185"
            />
            <circle cx="86" cy="48" r="3" fill="#F43F5E" />
          </g>
        )}
      </svg>
    </div>
  );
};

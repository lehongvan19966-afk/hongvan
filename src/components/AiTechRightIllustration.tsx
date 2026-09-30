import React from 'react';

interface AiTechIllustrationProps {
  className?: string;
}

export const AiTechRightIllustration: React.FC<AiTechIllustrationProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Ambient Cyber Light Glow */}
      <div className="absolute w-44 h-44 -top-6 -right-6 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute w-36 h-36 bottom-0 left-0 bg-indigo-500/25 rounded-full blur-2xl pointer-events-none" />

      {/* Floating Hologram Chip 1: Top */}
      <div className="animate-bounce duration-1000 mb-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/70 backdrop-blur-md border border-sky-400/50 text-[11px] font-black text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.35)] transform rotate-3 hover:rotate-0 transition-transform">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>🎬 VIDEO & THƠ TRUYỆN AI</span>
      </div>

      {/* Main 3D Pixar Robot with Holographic Screen & Storybook Graphic */}
      <div className="relative w-48 sm:w-56 h-48 sm:h-52 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
        <svg viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            {/* Robot Body Pearlescent Metal Gradient */}
            <linearGradient id="rightBotBody" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E0F2FE" />
              <stop offset="70%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* Indigo/Cyan Neon Screen */}
            <linearGradient id="rightBotVisor" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="50%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>

            {/* Hologram Projection Beam Gradient */}
            <linearGradient id="holoBeam" x1="10" y1="90" x2="70" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.05" />
            </linearGradient>

            {/* Holographic Video Screen Gradient */}
            <linearGradient id="videoScreenGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0369A1" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            {/* Glowing Aura */}
            <radialGradient id="skyAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#1D4ED8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Futuristic Circuit Board Background Track */}
          <path
            d="M200 90 H150 L125 55 H80"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.6"
            className="animate-pulse"
          />
          <path
            d="M190 140 H140 L115 170 H60"
            stroke="#818CF8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.5"
          />
          <circle cx="200" cy="90" r="3.5" fill="#38BDF8" />
          <circle cx="80" cy="55" r="3.5" fill="#38BDF8" />
          <circle cx="60" cy="170" r="3" fill="#818CF8" />

          {/* Ambient Glowing Aura */}
          <circle cx="110" cy="105" r="75" fill="url(#skyAura)" />

          {/* Floating Holographic Video Screen (Top Left) */}
          <g transform="translate(15, 20)">
            {/* Hologram projection beam */}
            <polygon points="65,75 5,30 45,10" fill="url(#holoBeam)" />

            {/* Floating Glass Screen */}
            <rect
              x="5"
              y="10"
              width="50"
              height="36"
              rx="8"
              fill="url(#videoScreenGrad)"
              stroke="#E0F2FE"
              strokeWidth="2"
              className="drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]"
            />
            {/* Screen Header Bar */}
            <rect x="7" y="12" width="46" height="6" rx="2" fill="#0B132B" opacity="0.6" />
            <circle cx="12" cy="15" r="1.5" fill="#EF4444" />
            <circle cx="17" cy="15" r="1.5" fill="#FBBF24" />
            <circle cx="22" cy="15" r="1.5" fill="#10B981" />

            {/* Play Button in Center */}
            <polygon points="27,24 37,30 27,36" fill="#FFFFFF" />

            {/* Sparkles around screen */}
            <polygon points="56,6 58,10 62,11 58,13 56,17 54,13 50,11 54,10" fill="#FACC15" />
            <polygon points="2,38 4,41 7,42 4,43 2,46 1,43 -2,42 1,41" fill="#38BDF8" />
          </g>

          {/* 3D Cute AI Teacher Robot Companion */}
          <g transform="translate(75, 35)">
            {/* Robot Shadow */}
            <ellipse cx="60" cy="140" rx="42" ry="10" fill="#030E26" opacity="0.6" />

            {/* Left Hand Holding Hologram Projector */}
            <g transform="rotate(-15 15 80)">
              <rect x="5" y="65" width="14" height="24" rx="7" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
            </g>

            {/* Right Hand Waving Friendly */}
            <g transform="rotate(25 105 70)">
              <rect x="95" y="55" width="14" height="24" rx="7" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
              {/* Sparkle on hand */}
              <circle cx="102" cy="50" r="3" fill="#FACC15" className="animate-ping" />
            </g>

            {/* Robot Main Body Capsule */}
            <rect
              x="20"
              y="25"
              width="80"
              height="95"
              rx="40"
              fill="url(#rightBotBody)"
              stroke="#0284C7"
              strokeWidth="3"
            />

            {/* Cute DJ/Tech Headphones Band */}
            <path
              d="M16 55 C16 18, 104 18, 104 55"
              stroke="#F97316"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Headphone Ear Cups */}
            <rect x="12" y="44" width="10" height="22" rx="5" fill="#EA580C" stroke="#FED7AA" strokeWidth="1.5" />
            <rect x="98" y="44" width="10" height="22" rx="5" fill="#EA580C" stroke="#FED7AA" strokeWidth="1.5" />

            {/* Visor Screen (Gương mặt điện tử) */}
            <rect
              x="28"
              y="42"
              width="64"
              height="38"
              rx="18"
              fill="url(#rightBotVisor)"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />

            {/* Cyber Eyes: Smiling Winking Eyes */}
            {/* Left eye: Round happy glow */}
            <circle cx="46" cy="58" r="6" fill="#38BDF8" className="drop-shadow-[0_0_8px_#38BDF8]" />
            <circle cx="48" cy="56" r="2" fill="#FFFFFF" />

            {/* Right eye: Playful wink arc */}
            <path
              d="M68 60 Q74 52 80 60"
              stroke="#38BDF8"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_8px_#38BDF8]"
            />

            {/* Cute Cheek Blushes (Glowing Pink/Cyan) */}
            <circle cx="36" cy="68" r="3.5" fill="#F472B6" opacity="0.8" />
            <circle cx="84" cy="68" r="3.5" fill="#F472B6" opacity="0.8" />

            {/* Robot Chest Plate & Soundwave Equalizer */}
            <rect x="38" y="88" width="44" height="20" rx="8" fill="#0B132B" stroke="#0284C7" strokeWidth="1.5" />
            {/* Equalizer Bars */}
            <line x1="46" y1="102" x2="46" y2="94" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="52" y1="102" x2="52" y2="91" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="58" y1="102" x2="58" y2="96" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="64" y1="102" x2="64" y2="92" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="70" y1="102" x2="70" y2="95" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Floating Data Bits */}
          <text x="175" y="45" fill="#38BDF8" fontSize="9" fontFamily="monospace" opacity="0.7">
            AI 4.0
          </text>
          <text x="15" y="160" fill="#38BDF8" fontSize="9" fontFamily="monospace" opacity="0.6">
            100% OK
          </text>
        </svg>
      </div>

      {/* Floating Hologram Chips 2 & 3: Bottom */}
      <div className="flex flex-col gap-1.5 items-center mt-1">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-900/60 backdrop-blur-md border border-sky-400/40 text-[10px] sm:text-[11px] font-black text-sky-100 shadow-sm hover:scale-105 transition-all">
          <span>📚</span>
          <span>Giáo Án Chuẩn 5 Bước</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/50 backdrop-blur-xs border border-blue-500/30 text-[9px] font-bold text-blue-300">
          <span>🚀 Trợ Lý AI Đồng Hành Cô</span>
        </div>
      </div>
    </div>
  );
};

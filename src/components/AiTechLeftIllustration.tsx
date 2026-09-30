import React from 'react';

interface AiTechIllustrationProps {
  className?: string;
}

export const AiTechLeftIllustration: React.FC<AiTechIllustrationProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Ambient Cyber Light Glow */}
      <div className="absolute w-44 h-44 -top-6 -left-6 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute w-36 h-36 bottom-0 right-0 bg-blue-500/25 rounded-full blur-2xl pointer-events-none" />

      {/* Floating Hologram Chip 1: Top */}
      <div className="animate-bounce duration-1000 mb-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 backdrop-blur-md border border-cyan-400/50 text-[11px] font-black text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.35)] transform -rotate-3 hover:rotate-0 transition-transform">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>⚡ AI MẦM NON 4.0</span>
      </div>

      {/* Main 3D Pixar Robot & Neural Core Graphic */}
      <div className="relative w-48 sm:w-56 h-48 sm:h-52 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
        <svg viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            {/* Robot Body Pearlescent Metal Gradient */}
            <linearGradient id="leftBotBody" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E0F2FE" />
              <stop offset="70%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            {/* Cyan Neon Visor Screen */}
            <linearGradient id="leftBotVisor" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0B192C" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>

            {/* Neural Brain Gradient */}
            <linearGradient id="neuralGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>

            {/* Cyan Aura Ring */}
            <radialGradient id="cyanAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0284C7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Futuristic Circuit Board Background Track */}
          <path
            d="M20 100 H70 L95 65 H140"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.6"
            className="animate-pulse"
          />
          <path
            d="M30 140 H80 L105 170 H160"
            stroke="#818CF8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.5"
          />
          <circle cx="20" cy="100" r="3.5" fill="#38BDF8" />
          <circle cx="140" cy="65" r="3.5" fill="#38BDF8" />
          <circle cx="160" cy="170" r="3" fill="#818CF8" />

          {/* Ambient Glowing Aura */}
          <circle cx="110" cy="105" r="75" fill="url(#cyanAura)" />

          {/* Floating Neural Brain Orb (Top Right of Robot) */}
          <g transform="translate(135, 20)">
            <circle cx="25" cy="25" r="22" fill="#0C1F4A" stroke="#38BDF8" strokeWidth="2" />
            <path
              d="M16 26 C16 18, 22 14, 28 14 C32 14, 34 16, 35 18 C36 16, 38 14, 42 14 C48 14, 52 18, 52 26 C52 34, 38 42, 35 44 C32 42, 16 34, 16 26 Z"
              fill="url(#neuralGrad)"
              opacity="0.9"
            />
            {/* Neural nodes & synapses */}
            <circle cx="24" cy="22" r="2.5" fill="#FFFFFF" />
            <circle cx="34" cy="20" r="2" fill="#FFFFFF" />
            <circle cx="42" cy="25" r="2.5" fill="#FFFFFF" />
            <circle cx="32" cy="32" r="2" fill="#FFFFFF" />
            <line x1="24" y1="22" x2="34" y2="20" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
            <line x1="34" y1="20" x2="42" y2="25" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
            <line x1="24" y1="22" x2="32" y2="32" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
            <line x1="42" y1="25" x2="32" y2="32" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
            {/* Sparkles around brain */}
            <polygon points="46,10 48,14 52,15 48,17 46,21 44,17 40,15 44,14" fill="#FACC15" />
          </g>

          {/* 3D Cute AI Robot Companion */}
          <g transform="translate(45, 35)">
            {/* Robot Shadow */}
            <ellipse cx="60" cy="140" rx="42" ry="10" fill="#030E26" opacity="0.6" />

            {/* Left Hand / Magic Stylus */}
            <g transform="rotate(-15 15 80)">
              <rect x="0" y="65" width="14" height="24" rx="7" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
              {/* Glowing Stylus */}
              <line x1="5" y1="65" x2="-8" y2="40" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
              <circle cx="-8" cy="40" r="4" fill="#FACC15" className="animate-ping" />
              <polygon points="-8,34 -6,38 -2,40 -6,42 -8,46 -10,42 -14,40 -10,38" fill="#FEF08A" />
            </g>

            {/* Right Hand */}
            <g transform="rotate(20 100 80)">
              <rect x="100" y="70" width="14" height="24" rx="7" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
            </g>

            {/* Robot Main Body Capsule */}
            <rect
              x="20"
              y="25"
              width="80"
              height="95"
              rx="40"
              fill="url(#leftBotBody)"
              stroke="#0284C7"
              strokeWidth="3"
            />

            {/* Antenna with Sprout on Head */}
            <line x1="60" y1="25" x2="60" y2="8" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="60" cy="8" r="4.5" fill="#38BDF8" />
            {/* Sprout Leaves on top of robot */}
            <path
              d="M60 8 C68 2, 74 6, 72 12 C66 12, 62 10, 60 8 Z"
              fill="#22C55E"
              stroke="#15803D"
              strokeWidth="1"
            />
            <path
              d="M60 8 C52 4, 48 8, 50 14 C56 13, 58 10, 60 8 Z"
              fill="#4ADE80"
              stroke="#15803D"
              strokeWidth="1"
            />

            {/* Visor Screen (Gương mặt điện tử) */}
            <rect
              x="28"
              y="42"
              width="64"
              height="38"
              rx="18"
              fill="url(#leftBotVisor)"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />

            {/* Cyber Eyes: Glowing Happy Arcs */}
            <path
              d="M40 60 Q48 50 54 60"
              stroke="#38BDF8"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_8px_#38BDF8]"
            />
            <path
              d="M66 60 Q72 50 80 60"
              stroke="#38BDF8"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_8px_#38BDF8]"
            />

            {/* Cute Cheek Blushes (Glowing Pink/Cyan) */}
            <circle cx="36" cy="68" r="3.5" fill="#F472B6" opacity="0.8" />
            <circle cx="84" cy="68" r="3.5" fill="#F472B6" opacity="0.8" />

            {/* Robot Chest Plate & Glowing Core Indicator */}
            <rect x="42" y="88" width="36" height="20" rx="8" fill="#0F172A" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="50" cy="98" r="3.5" fill="#22C55E" />
            <circle cx="60" cy="98" r="3.5" fill="#FACC15" />
            <circle cx="70" cy="98" r="3.5" fill="#38BDF8" className="animate-pulse" />
          </g>

          {/* Floating Data Bits */}
          <text x="15" y="50" fill="#38BDF8" fontSize="9" fontFamily="monospace" opacity="0.7">
            01 AI
          </text>
          <text x="175" y="160" fill="#38BDF8" fontSize="9" fontFamily="monospace" opacity="0.6">
            &gt; prompt
          </text>
        </svg>
      </div>

      {/* Floating Hologram Chips 2 & 3: Bottom */}
      <div className="flex flex-col gap-1.5 items-center mt-1">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 backdrop-blur-md border border-blue-400/40 text-[10px] sm:text-[11px] font-black text-blue-100 shadow-sm hover:scale-105 transition-all">
          <span>🎨</span>
          <span>Sinh Tranh & Giáo Án AI</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/50 backdrop-blur-xs border border-cyan-500/30 text-[9px] font-bold text-cyan-300">
          <span>🧠 Trí Tuệ Nhân Tạo Mầm Non</span>
        </div>
      </div>
    </div>
  );
};

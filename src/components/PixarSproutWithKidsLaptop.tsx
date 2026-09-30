import React from 'react';

interface PixarSproutWithKidsLaptopProps {
  className?: string;
}

export const PixarSproutWithKidsLaptop: React.FC<PixarSproutWithKidsLaptopProps> = ({
  className = '',
}) => {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 520 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
      >
        <defs>
          {/* Pixar 3D Gradients - Sprout Body */}
          <radialGradient id="sprout3dBody" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#BEF264" />
            <stop offset="40%" stopColor="#84CC16" />
            <stop offset="85%" stopColor="#4D7C0F" />
            <stop offset="100%" stopColor="#365314" />
          </radialGradient>

          {/* Pixar 3D Gradients - Leaves */}
          <linearGradient id="leaf3dLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BBF7D0" />
            <stop offset="45%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <linearGradient id="leaf3dRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="50%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#14532D" />
          </linearGradient>

          {/* Pixar 3D Laptop Gradients */}
          <linearGradient id="laptopLidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="60%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="laptopScreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="60%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </linearGradient>
          <linearGradient id="laptopBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Screen Magical Glow */}
          <radialGradient id="screenMagicGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
          </radialGradient>

          {/* Children Skin Tones - Pixar Style */}
          <radialGradient id="skinKidGirl" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFF1E8" />
            <stop offset="50%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#FDBA74" />
          </radialGradient>
          <radialGradient id="skinKidBoy" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFF4ED" />
            <stop offset="50%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>

          {/* Hair Gradients */}
          <linearGradient id="hairGirlGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#582C12" />
            <stop offset="50%" stopColor="#3D1D09" />
            <stop offset="100%" stopColor="#241004" />
          </linearGradient>
          <linearGradient id="hairBoyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#451A03" />
            <stop offset="100%" stopColor="#1C0A00" />
          </linearGradient>

          {/* Soft Ground Shadow */}
          <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Ground Shadows */}
        <ellipse cx="260" cy="255" rx="190" ry="18" fill="url(#groundShadow)" />
        <ellipse cx="140" cy="245" rx="55" ry="12" fill="url(#groundShadow)" />
        <ellipse cx="380" cy="245" rx="55" ry="12" fill="url(#groundShadow)" />

        {/* 2. Magical Floating Particles from Laptop (AI Learning Magic) */}
        <g opacity="0.9">
          {/* Glowing Stars & AI Sparks */}
          <circle cx="260" cy="115" r="3.5" fill="#FEF08A" />
          <polygon points="260,85 263,94 272,94 265,100 268,109 260,103 252,109 255,100 248,94 257,94" fill="#FDE047" opacity="0.85" />
          <polygon points="215,95 217,101 223,101 218,105 220,111 215,107 210,111 212,105 207,101 213,101" fill="#F472B6" opacity="0.8" />
          <polygon points="305,95 307,101 313,101 308,105 310,111 305,107 300,111 302,105 297,101 303,101" fill="#38BDF8" opacity="0.8" />

          {/* Mini Alphabet Floating Badges (A, B, C, 1, 2, 3) */}
          <rect x="225" y="70" width="18" height="18" rx="5" fill="#EF4444" transform="rotate(-12 225 70)" />
          <text x="229" y="83" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="Quicksand, sans-serif" transform="rotate(-12 225 70)">A</text>

          <rect x="278" y="68" width="18" height="18" rx="5" fill="#3B82F6" transform="rotate(14 278 68)" />
          <text x="282" y="81" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="Quicksand, sans-serif" transform="rotate(14 278 68)">B</text>

          <rect x="252" y="52" width="16" height="16" rx="4" fill="#10B981" transform="rotate(5 252 52)" />
          <text x="256" y="64" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="Quicksand, sans-serif" transform="rotate(5 252 52)">★</text>
        </g>

        {/* ======================================================== */}
        {/* 3. BÉ GÁI MẦM NON (BÊN TRÁI BÉ MẦM)                      */}
        {/* ======================================================== */}
        <g id="KidGirlLeft">
          {/* Girl Body / Dress */}
          <path
            d="M 120 180 C 105 180 95 210 90 240 C 110 245 165 245 180 240 C 175 210 165 180 150 180 Z"
            fill="#F472B6"
          />
          {/* Overalls Straps & Details */}
          <path d="M 125 180 L 125 215" stroke="#BE185D" strokeWidth="3" strokeLinecap="round" />
          <path d="M 145 180 L 145 215" stroke="#BE185D" strokeWidth="3" strokeLinecap="round" />
          <circle cx="125" cy="212" r="2.5" fill="#FDE047" />
          <circle cx="145" cy="212" r="2.5" fill="#FDE047" />

          {/* Girl Arm & Hand: Leaning eagerly towards the laptop */}
          <path
            d="M 150 195 C 165 195 185 205 195 215"
            stroke="#FED7AA"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <circle cx="195" cy="215" r="7" fill="#FED7AA" />

          {/* Girl Head (Pixar Cute Style) */}
          <circle cx="135" cy="145" r="32" fill="url(#skinKidGirl)" />

          {/* Rosy Cheeks */}
          <ellipse cx="118" cy="155" rx="7" ry="4.5" fill="#FB7185" opacity="0.65" />
          <ellipse cx="152" cy="155" rx="7" ry="4.5" fill="#FB7185" opacity="0.65" />

          {/* Big Pixar Anime Eyes */}
          <ellipse cx="124" cy="142" rx="5.5" ry="7" fill="#1C1917" />
          <circle cx="126" cy="139" r="2.5" fill="#FFFFFF" />
          <circle cx="123" cy="144" r="1.2" fill="#FFFFFF" />

          <ellipse cx="146" cy="142" rx="5.5" ry="7" fill="#1C1917" />
          <circle cx="148" cy="139" r="2.5" fill="#FFFFFF" />
          <circle cx="145" cy="144" r="1.2" fill="#FFFFFF" />

          {/* Eyebrows */}
          <path d="M 119 133 Q 125 130 129 134" stroke="#582C12" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 141 133 Q 146 130 151 134" stroke="#582C12" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Tiny Nose */}
          <ellipse cx="135" cy="148" rx="2" ry="1.5" fill="#F97316" opacity="0.4" />

          {/* Joyful Open Smile */}
          <path d="M 129 154 Q 135 163 142 154 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
          <path d="M 131 157 Q 135 155 139 157 Q 135 161 131 157 Z" fill="#FDA4AF" />

          {/* Hair: Twin Buns (Búi tóc 2 chùm tròn xinh) */}
          {/* Main Hair bangs */}
          <path
            d="M 103 142 C 103 118 120 115 135 115 C 150 115 167 118 167 142 C 160 127 150 125 135 125 C 120 125 110 127 103 142 Z"
            fill="url(#hairGirlGrad)"
          />
          {/* Left Hair Bun + Red Ribbon */}
          <circle cx="106" cy="120" r="14" fill="url(#hairGirlGrad)" />
          <circle cx="106" cy="120" r="4.5" fill="#EF4444" />
          {/* Right Hair Bun + Red Ribbon */}
          <circle cx="164" cy="120" r="14" fill="url(#hairGirlGrad)" />
          <circle cx="164" cy="120" r="4.5" fill="#EF4444" />
        </g>

        {/* ======================================================== */}
        {/* 4. BÉ TRAI MẦM NON (BÊN PHẢI BÉ MẦM)                     */}
        {/* ======================================================== */}
        <g id="KidBoyRight">
          {/* Boy Body / Shirt */}
          <path
            d="M 370 180 C 355 180 345 210 340 240 C 360 245 415 245 430 240 C 425 210 415 180 400 180 Z"
            fill="#3B82F6"
          />
          {/* Collar */}
          <path d="M 375 180 L 385 195 L 395 180" fill="#FFFFFF" />

          {/* Boy Arm & Pointing Hand: Excitedly pointing at laptop screen */}
          <path
            d="M 370 195 C 355 195 335 205 325 212"
            stroke="#FED7AA"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <circle cx="325" cy="212" r="7" fill="#FED7AA" />
          {/* Pointing index finger */}
          <path d="M 325 212 L 315 210" stroke="#FED7AA" strokeWidth="4.5" strokeLinecap="round" />

          {/* Boy Head */}
          <circle cx="385" cy="145" r="32" fill="url(#skinKidBoy)" />

          {/* Rosy Cheeks */}
          <ellipse cx="368" cy="155" rx="7" ry="4.5" fill="#FB7185" opacity="0.65" />
          <ellipse cx="402" cy="155" rx="7" ry="4.5" fill="#FB7185" opacity="0.65" />

          {/* Big Pixar Anime Eyes */}
          <ellipse cx="374" cy="142" rx="5.5" ry="7" fill="#1C1917" />
          <circle cx="376" cy="139" r="2.5" fill="#FFFFFF" />
          <circle cx="373" cy="144" r="1.2" fill="#FFFFFF" />

          <ellipse cx="396" cy="142" rx="5.5" ry="7" fill="#1C1917" />
          <circle cx="398" cy="139" r="2.5" fill="#FFFFFF" />
          <circle cx="395" cy="144" r="1.2" fill="#FFFFFF" />

          {/* Eyebrows */}
          <path d="M 369 133 Q 375 130 380 134" stroke="#451A03" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 391 133 Q 396 130 401 134" stroke="#451A03" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Tiny Nose */}
          <ellipse cx="385" cy="148" rx="2" ry="1.5" fill="#F97316" opacity="0.4" />

          {/* Cheerful Laughing Mouth */}
          <path d="M 378 154 Q 385 164 393 154 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
          <path d="M 380 157 Q 385 155 390 157 Q 385 161 380 157 Z" fill="#FDA4AF" />

          {/* Cute Yellow Beret Hat (Mũ Beret vàng cam Pixar) */}
          <ellipse cx="385" cy="124" rx="30" ry="15" fill="#F59E0B" transform="rotate(-8 385 124)" />
          <path d="M 358 126 C 362 108 405 106 414 122 Z" fill="#FBBF24" />
          <circle cx="385" cy="106" r="3.5" fill="#D97706" />
        </g>

        {/* ======================================================== */}
        {/* 5. BÉ MẦM AI TO LỚN Ở TRUNG TÂM (CẦM MÁY TÍNH LAPTOP)   */}
        {/* ======================================================== */}
        <g id="BeMam3DPixarCenter">
          {/* Sprout Head Leaves (2 Mầm lá non đung đưa) */}
          <g className="animate-leaf-sway origin-bottom">
            {/* Stem */}
            <path d="M 260 75 C 258 55 262 48 260 40" stroke="#365314" strokeWidth="6" strokeLinecap="round" />

            {/* Left Leaf (3D Glossy) */}
            <path
              d="M 260 42 C 230 20 200 35 218 60 C 235 68 252 55 260 42 Z"
              fill="url(#leaf3dLeft)"
              stroke="#166534"
              strokeWidth="2"
            />
            {/* Vein highlight */}
            <path d="M 226 50 C 238 48 250 46 260 42" stroke="#DCFCE7" strokeWidth="2.5" strokeLinecap="round" />

            {/* Right Leaf (3D Glossy) */}
            <path
              d="M 260 42 C 290 15 320 30 302 55 C 285 65 268 52 260 42 Z"
              fill="url(#leaf3dRight)"
              stroke="#166534"
              strokeWidth="2"
            />
            <path d="M 294 48 C 282 46 270 44 260 42" stroke="#DCFCE7" strokeWidth="2.5" strokeLinecap="round" />

            {/* Glowing Golden Dewdrop / Flower on leaf */}
            <circle cx="260" cy="34" r="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="262" cy="32" r="2" fill="#FFFFFF" />
          </g>

          {/* Big Chubby Sprout Body (To, tròn mập mạp phong cách 3D Pixar) */}
          <path
            d="M 260 70
               C 215 70 195 105 195 145
               C 195 195 215 245 260 245
               C 305 245 325 195 325 145
               C 325 105 305 70 260 70 Z"
            fill="url(#sprout3dBody)"
            stroke="#365314"
            strokeWidth="3.5"
          />

          {/* 3D Highlight sheen on top of head */}
          <ellipse cx="235" cy="95" rx="16" ry="9" fill="#FFFFFF" opacity="0.45" transform="rotate(-20 235 95)" />

          {/* Soft White Belly (Bụng sữa mầm non) */}
          <ellipse cx="260" cy="180" rx="42" ry="46" fill="#F0FDF4" opacity="0.65" />

          {/* Rosy Glowing Cheeks (Má đào ửng hồng phấn to tròn) */}
          <ellipse cx="225" cy="138" rx="12" ry="8" fill="#FB7185" opacity="0.8" />
          <circle cx="222" cy="135" r="2.5" fill="#FFFFFF" opacity="0.9" />
          <ellipse cx="295" cy="138" rx="12" ry="8" fill="#FB7185" opacity="0.8" />
          <circle cx="292" cy="135" r="2.5" fill="#FFFFFF" opacity="0.9" />

          {/* Pixar Sparkling Disney Eyes (Mắt to tròn long lanh Disney Pixar) */}
          <g>
            {/* Left Eye */}
            <ellipse cx="234" cy="118" rx="9" ry="12" fill="#1C1917" />
            <circle cx="237" cy="113" r="4.5" fill="#FFFFFF" />
            <circle cx="231" cy="122" r="2.2" fill="#FFFFFF" />
            <path d="M 224 102 Q 234 97 242 102" stroke="#365314" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Right Eye */}
            <ellipse cx="286" cy="118" rx="9" ry="12" fill="#1C1917" />
            <circle cx="289" cy="113" r="4.5" fill="#FFFFFF" />
            <circle cx="283" cy="122" r="2.2" fill="#FFFFFF" />
            <path d="M 278 102 Q 286 97 296 102" stroke="#365314" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Cute Little Button Nose */}
            <ellipse cx="260" cy="128" rx="3.5" ry="2.5" fill="#365314" />

            {/* Wide Happy Laughing Mouth */}
            <path
              d="M 244 136 Q 260 160 276 136 Z"
              fill="#DC2626"
              stroke="#7F1D1D"
              strokeWidth="2"
            />
            {/* Tongue */}
            <path d="M 250 148 Q 260 142 270 148 Q 260 158 250 148 Z" fill="#F472B6" />
          </g>

          {/* Stubby Feet on ground */}
          <ellipse cx="235" cy="245" rx="14" ry="9" fill="#365314" />
          <ellipse cx="285" cy="245" rx="14" ry="9" fill="#365314" />

          {/* ==================================================== */}
          {/* MÁY TÍNH LAPTOP 3D PIXAR TRÊN TAY BÉ MẦM             */}
          {/* ==================================================== */}
          <g id="LaptopInHands">
            {/* Left Arm holding laptop */}
            <path
              d="M 205 145 C 195 160 205 190 225 190"
              stroke="#84CC16"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Right Arm holding laptop */}
            <path
              d="M 315 145 C 325 160 315 190 295 190"
              stroke="#84CC16"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Laptop Base (Bàn phím đặt phẳng hơi nghiêng) */}
            <path
              d="M 210 198 L 310 198 L 320 220 L 200 220 Z"
              fill="url(#laptopBaseGrad)"
              stroke="#94A3B8"
              strokeWidth="2"
            />
            {/* Keyboard keys preview (Các phím bấm sắc màu) */}
            <rect x="218" y="202" width="84" height="10" rx="2" fill="#E2E8F0" />
            <line x1="230" y1="202" x2="230" y2="212" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="245" y1="202" x2="245" y2="212" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="260" y1="202" x2="260" y2="212" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="275" y1="202" x2="275" y2="212" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="290" y1="202" x2="290" y2="212" stroke="#CBD5E1" strokeWidth="1" />
            {/* Touchpad */}
            <rect x="250" y="214" width="20" height="4" rx="1" fill="#CBD5E1" />

            {/* Laptop Screen / Lid (Mở đứng 3D đối diện các bạn nhỏ) */}
            <path
              d="M 215 140 L 305 140 L 310 198 L 210 198 Z"
              fill="url(#laptopLidGrad)"
              stroke="#0369A1"
              strokeWidth="2"
            />
            {/* Glowing Screen Inset */}
            <rect x="220" y="145" width="80" height="48" rx="4" fill="url(#laptopScreenGrad)" />

            {/* Screen Content: Big Sprout Logo & "MẦM AI" on Screen */}
            <circle cx="260" cy="166" r="14" fill="#FFFFFF" opacity="0.9" />
            {/* Sprout Icon on Screen */}
            <path d="M 260 172 C 255 166 250 166 254 160 C 257 160 260 164 260 172 Z" fill="#22C55E" />
            <path d="M 260 172 C 265 164 270 165 266 160 C 263 160 260 164 260 172 Z" fill="#16A34A" />
            <circle cx="260" cy="169" r="2" fill="#F59E0B" />
            {/* Screen text */}
            <text x="260" y="186" fill="#0369A1" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="Quicksand, sans-serif">
              MẦM AI ✨
            </text>

            {/* Screen Magic Light Aura / Reflection */}
            <ellipse cx="260" cy="169" rx="35" ry="25" fill="url(#screenMagicGlow)" pointerEvents="none" />

            {/* Green Stubby Hands resting securely on edge of laptop base */}
            <circle cx="212" cy="205" r="9" fill="#84CC16" stroke="#365314" strokeWidth="2" />
            <circle cx="308" cy="205" r="9" fill="#84CC16" stroke="#365314" strokeWidth="2" />
          </g>
        </g>

        {/* 6. Front Colorful Toy Blocks & Picture Books on Floor */}
        <g id="FrontFloorToys">
          {/* Toy Block A (Yellow) */}
          <rect x="175" y="235" width="22" height="20" rx="4" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <text x="181" y="250" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="Quicksand, sans-serif">A</text>

          {/* Toy Block B (Red) */}
          <rect x="325" y="234" width="22" height="20" rx="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          <text x="331" y="249" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="Quicksand, sans-serif">B</text>

          {/* Open Storybook in Front */}
          <path d="M 245 248 C 255 244 260 244 260 244 C 260 244 265 244 275 248 L 275 258 C 265 254 260 254 260 254 C 260 254 255 254 245 258 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
          <line x1="260" y1="244" x2="260" y2="254" stroke="#CBD5E1" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};

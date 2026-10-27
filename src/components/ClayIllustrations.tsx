import React from 'react';

/**
 * 3D-shaded Claymation Illustrations for PookieCal following the Clay.com Design System
 * Colors: Peach (#ffb084), Ochre (#e8b94a), Lavender (#b8a4ed), Mint (#a4d4c5), Pink (#ff4d8b), Teal (#1a3a3a), Cream (#fffaf0 / #faf5e8)
 */

export const ClayLogoMark: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="clayPinkSphere" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ff8a50" />
        <stop offset="55%" stopColor="#ff5722" />
        <stop offset="100%" stopColor="#c43000" />
      </radialGradient>
      <radialGradient id="clayOchreCube" cx="30%" cy="25%" r="75%">
        <stop offset="0%" stopColor="#fae08c" />
        <stop offset="55%" stopColor="#e8b94a" />
        <stop offset="100%" stopColor="#b58318" />
      </radialGradient>
      <radialGradient id="clayLavenderArch" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#dcd0fa" />
        <stop offset="60%" stopColor="#b8a4ed" />
        <stop offset="100%" stopColor="#7f65c7" />
      </radialGradient>
    </defs>
    {/* Sculpted 3D Clay blocks */}
    <rect x="3" y="14" width="18" height="18" rx="6" fill="url(#clayOchreCube)" />
    <rect x="15" y="4" width="18" height="18" rx="9" fill="url(#clayPinkSphere)" />
    <circle cx="24" cy="24" r="8" fill="url(#clayLavenderArch)" />
    {/* Soft clay highlight */}
    <ellipse cx="21" cy="9" rx="3.5" ry="2" transform="rotate(-20 21 9)" fill="#ffffff" fillOpacity="0.45" />
  </svg>
);

interface ClayHeroSceneProps {
  totalBirthdays: number;
  upcomingCount: number;
  eventsCount: number;
  nextPersonName?: string;
  nextPersonDays?: number;
}

export const ClayHeroScene: React.FC<ClayHeroSceneProps> = ({
  totalBirthdays,
  upcomingCount,
  eventsCount,
  nextPersonName = 'Maya Patel',
  nextPersonDays = 1
}) => {
  return (
    <div className="relative w-full rounded-[24px] bg-[#faf5e8] border border-[#e5e5e5] p-6 overflow-hidden select-none">
      {/* 3D Claymation Landscape SVG */}
      <svg
        viewBox="0 0 520 300"
        className="w-full h-auto rounded-[16px] block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="3D claymation illustration of mountains and celebration mascot"
      >
        <defs>
          {/* Warm Sky Gradient */}
          <linearGradient id="claySky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffaf0" />
            <stop offset="100%" stopColor="#f5f0e0" />
          </linearGradient>

          {/* 3D Clay Lavender Mountain */}
          <radialGradient id="mtnLavender" cx="35%" cy="25%" r="80%">
            <stop offset="0%" stopColor="#dfd3ff" />
            <stop offset="55%" stopColor="#b8a4ed" />
            <stop offset="100%" stopColor="#8b72cf" />
          </radialGradient>

          {/* 3D Clay Peach Mountain */}
          <radialGradient id="mtnPeach" cx="30%" cy="25%" r="80%">
            <stop offset="0%" stopColor="#ffd1b5" />
            <stop offset="55%" stopColor="#ffb084" />
            <stop offset="100%" stopColor="#d97b48" />
          </radialGradient>

          {/* 3D Clay Ochre Hill */}
          <radialGradient id="hillOchre" cx="40%" cy="25%" r="80%">
            <stop offset="0%" stopColor="#f7dc88" />
            <stop offset="55%" stopColor="#e8b94a" />
            <stop offset="100%" stopColor="#b8881e" />
          </radialGradient>

          {/* 3D Clay Mint Hill */}
          <radialGradient id="hillMint" cx="35%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#cef0e6" />
            <stop offset="60%" stopColor="#a4d4c5" />
            <stop offset="100%" stopColor="#6aa693" />
          </radialGradient>

          {/* 3D Clay Vibrant Tangerine Mascot */}
          <radialGradient id="mascotPink" cx="35%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#ff8a50" />
            <stop offset="55%" stopColor="#ff5722" />
            <stop offset="100%" stopColor="#c43000" />
          </radialGradient>

          {/* 3D Clay Sun */}
          <radialGradient id="claySun" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffe599" />
            <stop offset="60%" stopColor="#e8b94a" />
            <stop offset="100%" stopColor="#c7911e" />
          </radialGradient>

          {/* 3D Clay Coral Accent */}
          <radialGradient id="clayCoral" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff9e92" />
            <stop offset="60%" stopColor="#ff6b5a" />
            <stop offset="100%" stopColor="#c93b2b" />
          </radialGradient>
        </defs>

        {/* Background Canvas */}
        <rect width="520" height="300" rx="16" fill="url(#claySky)" />

        {/* Sculpted Clay Sun */}
        <circle cx="88" cy="68" r="34" fill="url(#claySun)" />
        <ellipse cx="77" cy="55" rx="10" ry="6" transform="rotate(-25 77 55)" fill="#ffffff" fillOpacity="0.4" />

        {/* Soft Puffy 3D Clay Clouds */}
        <g opacity="0.92">
          <rect x="160" y="42" width="76" height="28" rx="14" fill="#ffffff" />
          <circle cx="185" cy="42" r="16" fill="#ffffff" />
          <circle cx="210" cy="45" r="13" fill="#ffffff" />
        </g>
        <g opacity="0.9">
          <rect x="380" y="54" width="68" height="24" rx="12" fill="#ffffff" />
          <circle cx="404" cy="54" r="14" fill="#ffffff" />
        </g>

        {/* Back Lavender Clay Mountain */}
        <path
          d="M210 260 L315 88 C327 68 355 68 367 88 L470 260 Z"
          fill="url(#mtnLavender)"
        />
        {/* Snow / Cream Clay Cap on Lavender Mountain */}
        <path
          d="M315 88 C327 68 355 68 367 88 L385 118 C372 124 360 114 348 122 C336 130 324 116 302 120 Z"
          fill="#fffaf0"
          opacity="0.9"
        />

        {/* Left Peach Clay Mountain */}
        <path
          d="M-20 270 L95 108 C110 86 140 86 155 108 L270 270 Z"
          fill="url(#mtnPeach)"
        />

        {/* Mid Mint Clay Rolling Hill */}
        <ellipse cx="420" cy="265" rx="165" ry="78" fill="url(#hillMint)" />

        {/* Foreground Ochre Clay Hill */}
        <ellipse cx="165" cy="275" rx="210" ry="74" fill="url(#hillOchre)" />

        {/* Sculpted 3D Clay Trees */}
        <g transform="translate(68, 178)">
          <rect x="11" y="28" width="6" height="14" rx="3" fill="#1a3a3a" />
          <circle cx="14" cy="18" r="14" fill="url(#hillMint)" />
          <circle cx="10" cy="13" r="4" fill="#ffffff" fillOpacity="0.35" />
        </g>
        <g transform="translate(442, 168)">
          <rect x="11" y="28" width="6" height="14" rx="3" fill="#1a3a3a" />
          <circle cx="14" cy="18" r="14" fill="url(#clayCoral)" />
          <circle cx="10" cy="13" r="4" fill="#ffffff" fillOpacity="0.35" />
        </g>

        {/* Center 3D Clay Mascot Character ("Pookie" Clay Sculpt) */}
        <g transform="translate(216, 118)">
          {/* Mascot Shadow */}
          <ellipse cx="48" cy="126" rx="42" ry="10" fill="#0a0a0a" fillOpacity="0.12" />

          {/* Mascot Body */}
          <rect x="12" y="34" width="72" height="84" rx="36" fill="url(#mascotPink)" />
          {/* Specular Clay Highlight */}
          <ellipse cx="34" cy="52" rx="14" ry="8" transform="rotate(-22 34 52)" fill="#ffffff" fillOpacity="0.42" />

          {/* Party Hat in Teal & Ochre */}
          <path d="M32 37 L48 4 L64 37 Z" fill="#1a3a3a" />
          <circle cx="48" cy="4" r="6" fill="url(#claySun)" />

          {/* Friendly Clay Eyes & Smile */}
          <circle cx="36" cy="70" r="4.5" fill="#0a0a0a" />
          <circle cx="60" cy="70" r="4.5" fill="#0a0a0a" />
          <circle cx="37.5" cy="68.5" r="1.5" fill="#ffffff" />
          <circle cx="61.5" cy="68.5" r="1.5" fill="#ffffff" />
          {/* Rosy Clay Cheeks */}
          <ellipse cx="26" cy="76" rx="5" ry="3" fill="#ffb084" />
          <ellipse cx="70" cy="76" rx="5" ry="3" fill="#ffb084" />
          {/* Smile */}
          <path d="M41 78 Q48 85 55 78" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Mini 3D Birthday Cake held by Mascot */}
          <rect x="24" y="92" width="48" height="22" rx="8" fill="#fffaf0" stroke="#e5e5e5" strokeWidth="1.5" />
          <path d="M26 100 Q34 106 40 100 Q48 106 56 100 Q64 106 70 100" stroke="#ff5722" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Candle */}
          <rect x="45" y="80" width="6" height="12" rx="3" fill="#e8b94a" />
          <circle cx="48" cy="76" r="4" fill="#ff6b5a" />
        </g>
      </svg>

      {/* Embedded Product UI Fragment (`product-mockup-card`) */}
      <div className="mt-4 bg-[#fffaf0] border border-[#e5e5e5] rounded-[16px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#1a3a3a] text-white text-xs font-semibold flex items-center justify-center shrink-0">
            ✨
          </span>
          <div>
            <div className="text-[13px] font-semibold text-[#0a0a0a]">
              Next Up: {nextPersonName} ({nextPersonDays === 0 ? 'Today!' : nextPersonDays === 1 ? 'Tomorrow' : `In ${nextPersonDays} days`})
            </div>
            <div className="text-[12px] text-[#6a6a6a]">
              {totalBirthdays} birthdays tracked · {upcomingCount} this week · {eventsCount} visits & festivals
            </div>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#f5f0e0] text-[#0a0a0a] text-[12px] font-medium shrink-0">
          Auto-Reminders Active
        </span>
      </div>
    </div>
  );
};

export const ClayFooterMountains: React.FC = () => (
  <div className="w-full overflow-hidden pt-6 select-none" aria-hidden="true">
    <svg
      viewBox="0 0 1200 140"
      className="w-full h-auto block"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ftrPeach" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb084" />
          <stop offset="100%" stopColor="#e58e5e" />
        </linearGradient>
        <linearGradient id="ftrLavender" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8a4ed" />
          <stop offset="100%" stopColor="#947cd6" />
        </linearGradient>
        <linearGradient id="ftrOchre" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8b94a" />
          <stop offset="100%" stopColor="#c9982c" />
        </linearGradient>
        <linearGradient id="ftrMint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a4d4c5" />
          <stop offset="100%" stopColor="#7eb5a4" />
        </linearGradient>
      </defs>
      {/* Rolling 3D Clay Horizon Mountains */}
      <ellipse cx="200" cy="145" rx="280" ry="95" fill="url(#ftrPeach)" />
      <ellipse cx="520" cy="150" rx="310" ry="110" fill="url(#ftrLavender)" />
      <ellipse cx="860" cy="145" rx="290" ry="95" fill="url(#ftrOchre)" />
      <ellipse cx="1090" cy="150" rx="240" ry="85" fill="url(#ftrMint)" />
    </svg>
  </div>
);

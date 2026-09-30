import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`filter drop-shadow-[0_8px_16px_rgba(99,102,241,0.35)] ${className}`}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="bgGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="0.5" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>

        <linearGradient id="noteFront" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFBEB" />
          <stop offset="1" stopColor="#FEF08A" />
        </linearGradient>

        <linearGradient id="noteBack" x1="15" y1="15" x2="75" y2="75" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBCFE8" />
          <stop offset="1" stopColor="#F472B6" />
        </linearGradient>

        <linearGradient id="pinGrad" x1="45" y1="10" x2="55" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.6" stopColor="#EAB308" />
          <stop offset="1" stopColor="#CA8A04" />
        </linearGradient>
      </defs>

      {/* App Container Squircle */}
      <rect x="4" y="4" width="92" height="92" rx="26" fill="url(#bgGrad)" />
      
      {/* Glossy highlight line */}
      <path
        d="M20 8C12 8 8 12 8 20C8 28 14 36 28 36H72C86 36 92 28 92 20C92 12 88 8 80 8H20Z"
        fill="white"
        fillOpacity="0.16"
      />

      {/* Back Sticky Note (Rotated slightly) */}
      <rect
        x="22"
        y="24"
        width="54"
        height="54"
        rx="10"
        transform="rotate(-8 22 24)"
        fill="url(#noteBack)"
        fillOpacity="0.9"
      />

      {/* Front Yellow Sticky Note (Crisp with folded corner) */}
      <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.2))">
        {/* Main note body */}
        <path
          d="M 28 26 L 68 26 L 78 36 L 78 74 C 78 77 75 80 72 80 L 28 80 C 25 80 22 77 22 74 L 22 32 C 22 29 25 26 28 26 Z"
          fill="url(#noteFront)"
        />
        {/* Paper Folded Corner */}
        <path
          d="M 68 26 L 68 36 L 78 36 Z"
          fill="#FDE047"
          stroke="#F59E0B"
          strokeWidth="0.8"
        />
        {/* Note ruled lines / checkbox simulation */}
        <rect x="30" y="40" width="8" height="8" rx="2" fill="#F59E0B" fillOpacity="0.4" />
        <rect x="42" y="42" width="26" height="4" rx="2" fill="#B45309" fillOpacity="0.7" />

        <rect x="30" y="52" width="8" height="8" rx="2" fill="#10B981" fillOpacity="0.5" />
        <path d="M32 56L34 58L37 53" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="42" y="54" width="22" height="4" rx="2" fill="#78350F" fillOpacity="0.6" />

        <rect x="30" y="64" width="8" height="8" rx="2" fill="#F59E0B" fillOpacity="0.3" />
        <rect x="42" y="66" width="18" height="4" rx="2" fill="#92400E" fillOpacity="0.4" />
      </g>

      {/* Golden Thumbtack Pin at Top Center */}
      <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.35))">
        {/* Pin Needle Shadow */}
        <path d="M50 25L50 33" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        {/* Pin Head */}
        <ellipse cx="50" cy="20" rx="9" ry="5.5" fill="url(#pinGrad)" />
        <circle cx="50" cy="18" r="5" fill="#FEF08A" />
        <circle cx="48.5" cy="16.5" r="1.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

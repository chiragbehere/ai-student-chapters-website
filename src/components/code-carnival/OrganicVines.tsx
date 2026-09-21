// OrganicVines.tsx
// Procedural SVG vine and tentacle networks with organic breathing & growth animations
import React from 'react';

interface OrganicVinesProps {
  variant?: 'corner-tl' | 'corner-br' | 'edge-left' | 'edge-right' | 'card-border' | 'divider';
  className?: string;
  depth?: 'foreground' | 'midground' | 'background';
  pulseIntensity?: number;
}

export const OrganicVines: React.FC<OrganicVinesProps> = ({
  variant = 'corner-tl',
  className = '',
  depth = 'midground',
}) => {
  const depthClass =
    depth === 'foreground'
      ? 'z-20 opacity-85 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]'
      : depth === 'background'
      ? 'z-0 opacity-25 filter blur-[1px]'
      : 'z-10 opacity-55';

  if (variant === 'corner-tl') {
    return (
      <div
        className={`pointer-events-none absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 ${depthClass} ${className}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <defs>
            <linearGradient id="vineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a050d" />
              <stop offset="60%" stopColor="#150a12" />
              <stop offset="90%" stopColor="#3d0a0f" />
              <stop offset="100%" stopColor="#800a12" />
            </linearGradient>
          </defs>
          {/* Main trunk */}
          <path
            d="M 0,0 Q 80,40 140,110 T 220,240 T 280,380"
            fill="none"
            stroke="url(#vineGrad1)"
            strokeWidth="8"
            strokeLinecap="round"
            className="st-vine-path"
          />
          {/* Offshooting tentacles */}
          <path
            d="M 60,30 Q 120,60 180,50 T 290,90"
            fill="none"
            stroke="url(#vineGrad1)"
            strokeWidth="5"
            strokeLinecap="round"
            className="st-vine-path-alt"
          />
          <path
            d="M 140,110 Q 180,180 150,260 T 190,340"
            fill="none"
            stroke="url(#vineGrad1)"
            strokeWidth="4"
            strokeLinecap="round"
            className="st-vine-path"
          />
          <path
            d="M 0,90 Q 60,140 100,230 T 90,360"
            fill="none"
            stroke="url(#vineGrad1)"
            strokeWidth="6"
            strokeLinecap="round"
            className="st-vine-path-alt"
          />
          {/* Fine tendrils */}
          <path
            d="M 220,240 Q 250,290 320,310"
            fill="none"
            stroke="#5c060d"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 180,50 Q 220,40 260,20"
            fill="none"
            stroke="#5c060d"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'corner-br') {
    return (
      <div
        className={`pointer-events-none absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 rotate-180 ${depthClass} ${className}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <defs>
            <linearGradient id="vineGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#07030a" />
              <stop offset="70%" stopColor="#1e0914" />
              <stop offset="100%" stopColor="#630a10" />
            </linearGradient>
          </defs>
          <path
            d="M 0,0 Q 90,60 160,130 T 260,260 T 310,390"
            fill="none"
            stroke="url(#vineGrad2)"
            strokeWidth="8"
            strokeLinecap="round"
            className="st-vine-path"
          />
          <path
            d="M 90,60 Q 150,80 230,70 T 330,120"
            fill="none"
            stroke="url(#vineGrad2)"
            strokeWidth="5"
            strokeLinecap="round"
            className="st-vine-path-alt"
          />
          <path
            d="M 160,130 Q 210,190 190,290 T 240,370"
            fill="none"
            stroke="url(#vineGrad2)"
            strokeWidth="4"
            strokeLinecap="round"
            className="st-vine-path"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'divider') {
    return (
      <div className={`pointer-events-none relative w-full h-12 overflow-hidden ${depthClass} ${className}`} aria-hidden="true">
        <svg viewBox="0 0 1200 48" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M 0,24 Q 200,6 400,24 T 800,24 T 1200,24"
            fill="none"
            stroke="#1a050a"
            strokeWidth="4"
          />
          <path
            d="M 100,24 Q 300,42 500,24 T 900,24 T 1100,32"
            fill="none"
            stroke="#4a080e"
            strokeWidth="2.5"
            className="st-vine-path"
          />
          <path
            d="M 450,24 Q 520,38 600,20 T 680,24"
            fill="none"
            stroke="#e50914"
            strokeWidth="1.5"
            opacity="0.6"
            className="st-vine-path-alt"
          />
        </svg>
      </div>
    );
  }

  // Card border framing vines
  return (
    <div className={`pointer-events-none absolute -inset-2 ${depthClass} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" preserveAspectRatio="none" className="w-full h-full">
        <path
          d="M 0,30 Q 8,10 30,0"
          fill="none"
          stroke="#42060c"
          strokeWidth="3"
        />
        <path
          d="M 170,0 Q 192,8 200,30"
          fill="none"
          stroke="#42060c"
          strokeWidth="3"
        />
        <path
          d="M 0,170 Q 8,192 30,200"
          fill="none"
          stroke="#42060c"
          strokeWidth="3"
        />
        <path
          d="M 170,200 Q 192,192 200,170"
          fill="none"
          stroke="#42060c"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
};

export default OrganicVines;

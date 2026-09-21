// DimensionalCracks.tsx
// Glowing reality-rupture cracks with pulsating energy animations
import React from 'react';

interface DimensionalCracksProps {
  intensity?: number;
  className?: string;
  variant?: 'horizontal' | 'cluster' | 'corner';
}

export const DimensionalCracks: React.FC<DimensionalCracksProps> = ({
  intensity = 1.0,
  className = '',
  variant = 'cluster',
}) => {
  if (variant === 'horizontal') {
    return (
      <div className={`pointer-events-none relative w-full h-16 overflow-hidden ${className}`} aria-hidden="true">
        <svg viewBox="0 0 1000 60" preserveAspectRatio="none" className="w-full h-full filter drop-shadow-[0_0_8px_#e50914]">
          <path
            d="M 0,30 L 150,28 L 220,38 L 310,24 L 390,32 L 480,26 L 560,34 L 670,22 L 780,36 L 890,28 L 1000,30"
            fill="none"
            stroke="#ff1a26"
            strokeWidth="2"
            className="st-crack-line"
            style={{ opacity: 0.8 * intensity }}
          />
          <path
            d="M 220,38 L 240,48 L 270,52 M 480,26 L 500,12 L 530,8 M 670,22 L 690,14"
            fill="none"
            stroke="#ff5566"
            strokeWidth="1.2"
            className="st-crack-branch"
            style={{ opacity: 0.6 * intensity }}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'corner') {
    return (
      <div className={`pointer-events-none absolute w-48 h-48 ${className}`} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_0_10px_#e50914]">
          <path
            d="M 0,0 L 45,35 L 60,80 L 110,110 L 130,170 M 60,80 L 95,70 L 140,85 M 110,110 L 160,120"
            fill="none"
            stroke="#ff1a26"
            strokeWidth="1.8"
            className="st-crack-line"
          />
        </svg>
      </div>
    );
  }

  // Cluster variant
  return (
    <div className={`pointer-events-none absolute w-64 h-64 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 300 300" className="w-full h-full filter drop-shadow-[0_0_12px_rgba(229,9,20,0.7)]">
        <path
          d="M 150,150 L 120,90 L 80,60 L 40,50 M 150,150 L 190,100 L 250,80 M 150,150 L 140,210 L 100,260 M 150,150 L 210,180 L 270,220"
          fill="none"
          stroke="#ff1a26"
          strokeWidth="2"
          className="st-crack-line"
          style={{ opacity: 0.85 * intensity }}
        />
        <circle cx="150" cy="150" r="3" fill="#ffffff" filter="drop-shadow(0 0 6px #ff1a26)" />
      </svg>
    </div>
  );
};

export default DimensionalCracks;

// VHSOverlay.tsx
// Subtle 1980s analog scanlines, CRT curve vignette, and rare periodic glitch events
import React, { useEffect, useState } from 'react';

export const VHSOverlay: React.FC = () => {
  const [isGlitching, setIsGlitching] = useState(false);

  // Rare atmospheric glitch every 18-25 seconds
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => {
        setIsGlitching(false);
      }, 250);

      // Schedule next glitch randomly between 18 and 28 seconds
      const nextDelay = 18000 + Math.random() * 10000;
      timeoutId = setTimeout(triggerGlitch, nextDelay);
    };

    const initialDelay = 12000 + Math.random() * 8000;
    timeoutId = setTimeout(triggerGlitch, initialDelay);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden transition-all duration-150 ${
        isGlitching ? 'st-vhs-glitch-active' : ''
      }`}
      aria-hidden="true"
    >
      {/* 1. Fine CRT Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 2px)',
          backgroundSize: '100% 2px',
        }}
      />

      {/* 2. Analog Vignette & CRT Monitor curvature shadow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 65%, rgba(0, 0, 0, 0.6) 95%, rgba(0, 0, 0, 0.9) 100%)',
        }}
      />

      {/* 3. Subtle chromatic edge aberration during glitch */}
      {isGlitching && (
        <div
          className="absolute inset-0 opacity-20 mix-blend-screen"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,0,0,0.5) 0%, rgba(0,255,0,0.5) 50%, rgba(0,0,255,0.5) 100%)',
            transform: 'translateX(2px)',
          }}
        />
      )}

      {/* 4. Top-right Analog Status Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-none opacity-40 text-[10px] font-mono tracking-widest text-[#e50914]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e50914] animate-ping" />
        <span>SYS.CH.02 // REC</span>
      </div>
    </div>
  );
};

export default VHSOverlay;

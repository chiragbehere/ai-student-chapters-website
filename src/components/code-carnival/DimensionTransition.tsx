// DimensionTransition.tsx
// Signature multi-phase dimensional crossing animation sequence
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DimensionTransitionProps {
  active: boolean;
  onArrival: () => void;
}

export const DimensionTransition: React.FC<DimensionTransitionProps> = ({ active, onArrival }) => {
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    if (!active) {
      setPhase(0);
      return;
    }

    // Sequence timing
    // 0ms: Phase 1 (Approach & Darken)
    setPhase(1);

    // 400ms: Phase 2 (Instability & Energy Surge)
    const t2 = setTimeout(() => setPhase(2), 400);

    // 1000ms: Phase 3 (Corruption & Creeping Vines)
    const t3 = setTimeout(() => setPhase(3), 1000);

    // 1600ms: Phase 4 (Crossing - Radial Blur & Chromatic Aberration)
    const t4 = setTimeout(() => setPhase(4), 1600);

    // 2200ms: Phase 5 (Flash & Abyss)
    const t5 = setTimeout(() => setPhase(5), 2200);

    // 2700ms: Phase 6 (Arrival in Upside Down & Reveal)
    const t6 = setTimeout(() => {
      setPhase(6);
      onArrival();
    }, 2700);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [active, onArrival]);

  if (!active && phase === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {/* Phase 1-3: Red volumetric light surge */}
        {phase >= 2 && phase <= 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: phase === 4 ? 0.95 : 0.6, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at center, rgba(255, 20, 30, 0.85) 0%, rgba(139, 0, 0, 0.6) 45%, rgba(10, 0, 5, 0.9) 100%)',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Phase 3: Creeping organic corruption vines stretching across screen */}
        {phase >= 3 && phase <= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Top-left encroaching vines */}
            <svg viewBox="0 0 800 600" className="w-full h-full opacity-80 filter drop-shadow-[0_0_15px_#ff0a1a]">
              <path
                d="M 0,0 Q 200,80 350,220 T 550,450 T 800,600"
                fill="none"
                stroke="#0f0205"
                strokeWidth="24"
                strokeLinecap="round"
              />
              <path
                d="M 0,0 Q 180,60 300,180 T 500,400"
                fill="none"
                stroke="#8b0000"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 800,0 Q 600,120 450,280 T 200,550"
                fill="none"
                stroke="#0f0205"
                strokeWidth="20"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        )}

        {/* Phase 4: Warp / Tunnel distortion effect */}
        {phase === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 backdrop-blur-md"
            style={{
              background:
                'radial-gradient(circle at center, transparent 20%, rgba(229, 9, 20, 0.5) 70%, #000 100%)',
              transformOrigin: 'center center',
            }}
          />
        )}

        {/* Phase 5: Brief black abyss before the corrupted world resolves */}
        {phase === 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-[#030409]"
          />
        )}

        {/* Phase 6: Soft settling red atmospheric flash fading out */}
        {phase === 6 && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 bg-red-950/30"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DimensionTransition;

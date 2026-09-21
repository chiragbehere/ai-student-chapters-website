// EntryExperience.tsx
// First screen "The Other Side" gatekeeper & dimensional initialization loader
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Shield, ArrowDown } from 'lucide-react';

interface EntryExperienceProps {
  onEnter: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  isReady?: boolean;
}

export const EntryExperience: React.FC<EntryExperienceProps> = ({
  onEnter,
  onHoverStart,
  onHoverEnd,
  isReady = true,
}) => {
  const [loadProgress, setLoadProgress] = useState(15);
  const [isInitialized, setIsInitialized] = useState(false);
  const canEnter = isReady && isInitialized;

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsInitialized(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 15;
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  // Compute ASCII progress bar [████████░░░░]
  const totalBlocks = 16;
  const filledBlocks = Math.round((loadProgress / 100) * totalBlocks);
  const progressBar = '█'.repeat(filledBlocks) + '░'.repeat(totalBlocks - filledBlocks);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 z-20 select-none"
    >
      {/* 1. Dimensional Status Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-900/40 bg-red-950/20 backdrop-blur-md text-[#e8d5b5]/70 text-[11px] font-mono tracking-widest uppercase">
          <Shield size={12} className="text-[#e50914]" />
          <span>State Level Hackathon // Season 2.0</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#e50914] animate-pulse" />
        </div>
      </motion.div>

      {/* 2. Main Title: Large 1980s Serif with Atmospheric Red Rim Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
        className="relative mb-3"
      >
        <h1
          className="st-cinematic-title text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tight leading-none text-transparent bg-clip-text"
          style={{
            backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #ff858d 40%, #e50914 80%, #700208 100%)',
            fontFamily: "'Libre Baskerville', serif",
            textShadow: '0 0 40px rgba(229, 9, 20, 0.7), 0 0 80px rgba(229, 9, 20, 0.3)',
            letterSpacing: '0.04em',
          }}
        >
          CODE
          <br />
          CARNIVAL
        </h1>
      </motion.div>

      {/* 3. Subtitle / Dimensional Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.8 }}
        className="mb-8"
      >
        <p
          className="text-xs sm:text-sm tracking-[0.4em] uppercase font-mono text-[#e50914]"
          style={{ textShadow: '0 0 12px rgba(229, 9, 20, 0.8)' }}
        >
          {isInitialized ? 'THE GATE IS OPENING' : 'INITIALIZING DIMENSION...'}
        </p>

        {/* Terminal Loading Progress Bar */}
        {!isInitialized && (
          <div className="mt-3 font-mono text-[11px] text-[#e8d5b5]/50 tracking-widest">
            [{progressBar}] {Math.min(loadProgress, 100)}%
          </div>
        )}
      </motion.div>

      {/* 4. "ENTER CODE CARNIVAL" Interactive Dimensional Control CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: canEnter ? 1 : 0.4, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="relative z-30"
      >
        <button
          onClick={onEnter}
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
          disabled={!canEnter}
          className="st-dimensional-btn group relative px-8 py-4 sm:px-12 sm:py-5 rounded-none font-mono text-sm sm:text-base font-bold tracking-[0.25em] uppercase transition-all duration-500 overflow-hidden cursor-pointer"
          style={{
            background: 'rgba(8, 6, 14, 0.75)',
            border: '1px solid rgba(229, 9, 20, 0.6)',
            color: '#ffffff',
            boxShadow: '0 0 30px rgba(229, 9, 20, 0.35), inset 0 0 15px rgba(229, 9, 20, 0.2)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Animated red glow flare on hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff1a26]/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          {/* Subtle corner notches */}
          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ff1a26]" />
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#ff1a26]" />
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#ff1a26]" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ff1a26]" />

          <span className="relative z-10 flex items-center gap-3">
            <Eye size={16} className="text-[#ff1a26] group-hover:scale-125 transition-transform" />
            <span>ENTER CODE CARNIVAL</span>
            <Eye size={16} className="text-[#ff1a26] group-hover:scale-125 transition-transform" />
          </span>
        </button>

        <p className="mt-4 text-[11px] font-mono tracking-widest text-[#e8d5b5]/40 uppercase">
          [ CLICK TO BREACH REALITY ]
        </p>
      </motion.div>

      {/* 5. Scroll Prompt to peek through the rift */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2.0 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] font-mono tracking-widest text-[#e8d5b5]/40 uppercase"
      >
        <span>OR SCROLL TO APPROACH</span>
        <ArrowDown size={14} className="animate-bounce text-[#e50914]" />
      </motion.div>
    </section>
  );
};

export default EntryExperience;

// Title.jsx
// Displays code_carnival_logo.png / title_texture.png with fade/scale timed to the portal opening.
// Uses .webp when supported.
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Shield, ChevronDown } from 'lucide-react';

const BASE = '/CodeCarnival_3D_Assets/';

export function Title({ visible = false, onEnterExperience }) {
  const [useWebp, setUseWebp] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setUseWebp(true);
    img.onerror = () => setUseWebp(false);
    img.src = `${BASE}graphics/code_carnival_logo.webp`;
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.88, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 pointer-events-none z-20 flex flex-col items-center justify-center p-6 sm:p-10 select-none text-center"
        >
          {/* State Level Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-4 pointer-events-auto"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase text-[#ffd700] border border-[#ffd700]/40 bg-[#ffd700]/10 rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.25)]">
              <Shield size={12} />
              STATE LEVEL HACKATHON // SEASON 2.0
              <Shield size={12} />
            </span>
          </motion.div>

          {/* AI Student Chapter Presenter Line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xs sm:text-sm font-mono tracking-[0.35em] text-[#e8d5b5] uppercase mb-3"
          >
            AI STUDENT CHAPTER PRESENTS
          </motion.p>

          {/* 1. Official Logo Graphic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.0 }}
            className="max-w-xl sm:max-w-2xl px-4 mb-2"
          >
            <img
              src={`${BASE}graphics/code_carnival_logo.${useWebp ? 'webp' : 'png'}`}
              alt="Code Carnival 2.0"
              className="w-full h-auto max-h-36 sm:max-h-48 object-contain mx-auto filter drop-shadow-[0_0_35px_rgba(229,9,20,0.85)]"
              onError={(e) => {
                // If logo image fails, fallback to title_texture
                e.currentTarget.src = `${BASE}graphics/title_texture.png`;
              }}
            />
          </motion.div>

          {/* 2. Subtitle: ENTER THE WORLD OF INNOVATION */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.15em' }}
            animate={{ opacity: 1, letterSpacing: '0.35em' }}
            transition={{ delay: 0.9, duration: 1.0 }}
            className="text-xs sm:text-base md:text-lg font-bold uppercase text-[#ff2a14] mb-3 font-mono drop-shadow-[0_0_15px_rgba(255,42,20,0.8)]"
          >
            ENTER THE WORLD OF INNOVATION
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="text-xs sm:text-sm text-[#e8d5b5]/85 font-mono max-w-lg mb-8 leading-relaxed px-4"
          >
            Enter the Upside Down of code. 24 hours of adrenaline, algorithms, and glory.
            ₹50,000+ bounty across 5 tracks and 20 problem statements.
          </motion.p>

          {/* 3. Interactive Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="pointer-events-auto relative group"
          >
            <button
              onClick={onEnterExperience}
              className="relative px-9 sm:px-12 py-4 sm:py-5 bg-[#e50914] text-white font-mono text-sm sm:text-base font-bold tracking-[0.25em] uppercase rounded-sm shadow-[0_0_40px_rgba(229,9,20,0.85)] hover:bg-[#ff1b27] hover:shadow-[0_0_65px_rgba(255,27,39,1)] transition-all duration-300 transform active:scale-95 flex items-center gap-3 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 w-1/3 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-out" />
              <Flame size={18} className="text-[#ffd700] animate-pulse" />
              <span>ENTER THE EXPERIENCE</span>
              <Sparkles size={18} className="text-[#ffd700]" />
            </button>
          </motion.div>

          {/* Scroll / Dive Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="mt-6 flex flex-col items-center gap-1 text-[10px] sm:text-xs font-mono text-[#e8d5b5]/60 tracking-widest uppercase"
          >
            <span>CLICK TO DIVE THROUGH THE GATE • OR SCROLL DOWN</span>
            <ChevronDown size={14} className="text-[#e50914] animate-bounce" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Title;


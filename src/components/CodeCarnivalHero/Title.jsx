// Title.jsx
// Master AAA High-Contrast Cinematic Title Card for Code Carnival 2.0
// Solves text-readability against complex 3D red portal geometry with:
// - A dark frosted Hawkins Lab Tactical Terminal Card (backdrop blur + dark backing scrim)
// - High-contrast electric typography (white-hot core, vivid gold subtitles, crisp silver badges)
// - 4 key mission stat chips (24H, ₹50k+, 5 Tracks, 20 PS)
// - Timed two-stage emergence: Title Card reveals first, followed by the glowing CTA button
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Shield, ChevronDown, Terminal, Cpu, Award } from 'lucide-react';

const BASE = '/CodeCarnival_3D_Assets/';

export function Title({
  visible = false,
  ctaVisible = true,
  telemetryMessage = '',
  onEnterExperience,
}) {
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
          initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 pointer-events-none z-30 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 select-none"
        >
          {/* ── High-Contrast Hawkins Lab Tactical Terminal Card ── */}
          <div className="relative pointer-events-auto max-w-xl sm:max-w-2xl w-full mx-auto my-auto rounded-2xl bg-[#040108]/96 backdrop-blur-3xl border border-red-500/50 p-5 sm:p-7 md:p-8 text-center shadow-[0_0_150px_rgba(0,0,0,1),0_0_60px_rgba(229,9,20,0.45)] max-h-[90vh] overflow-y-auto">
            {/* Glowing Hawkins Corner Crosshair Brackets */}
            <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#e50914] shadow-[0_0_10px_#e50914]" />
            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-[#e50914] shadow-[0_0_10px_#e50914]" />
            <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-[#e50914] shadow-[0_0_10px_#e50914]" />
            <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#e50914] shadow-[0_0_10px_#e50914]" />

            {/* Top Telemetry Header Bar */}
            <div className="flex items-center justify-between border-b border-red-900/50 pb-2.5 mb-4 text-[10px] sm:text-[11px] font-mono tracking-widest">
              <div className="flex items-center gap-2 text-red-400 font-semibold truncate max-w-[80%]">
                <span className="w-2 h-2 rounded-full bg-[#e50914] animate-ping" />
                <Terminal size={12} className="text-[#e50914] shrink-0" />
                <span className="uppercase truncate">{telemetryMessage || 'HAWKINS LAB // RIFT ACTIVE'}</span>
              </div>
              <span className="hidden sm:inline-block text-[#ffd700] bg-[#ffd700]/10 border border-[#ffd700]/30 px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
                104.7 MHz
              </span>
            </div>

            {/* 1. State Level Gold Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mb-2.5 inline-block"
            >
              <span className="inline-flex items-center gap-2 px-3 py-0.5 text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-[#ffe066] border border-[#ffd700]/50 bg-[#ffd700]/15 rounded shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                <Shield size={11} className="text-[#ffd700]" />
                STATE LEVEL HACKATHON // SEASON 2.0
                <Shield size={11} className="text-[#ffd700]" />
              </span>
            </motion.div>

            {/* 2. Presenter Credit */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-[11px] sm:text-xs font-mono tracking-[0.35em] text-[#e2e8f0] font-semibold uppercase mb-1.5"
            >
              AI STUDENT CHAPTER PRESENTS
            </motion.p>

            {/* 3. Hero Emblem & Stranger Things Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="my-1.5 flex flex-col items-center"
            >
              <img
                src={`${BASE}graphics/code_carnival_logo.${useWebp ? 'webp' : 'png'}`}
                alt="Code Carnival 2.0"
                className="w-full max-h-16 sm:max-h-24 object-contain mx-auto filter drop-shadow-[0_0_25px_rgba(229,9,20,0.95)]"
                onError={(e) => {
                  e.currentTarget.src = `${BASE}graphics/title_texture.png`;
                }}
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-[0.14em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.95),0_0_40px_rgba(229,9,20,1)] mt-1 mb-0.5">
                CODE CARNIVAL <span className="text-[#e50914] drop-shadow-[0_0_25px_#e50914]">2.0</span>
              </h1>
            </motion.div>

            {/* 4. Subtitle: ENTER THE WORLD OF INNOVATION (High-Contrast Electric Gold) */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-sm sm:text-lg md:text-xl font-mono font-black tracking-[0.3em] uppercase text-[#ffde59] drop-shadow-[0_2px_8px_rgba(0,0,0,1)] mb-3"
            >
              ENTER THE WORLD OF INNOVATION
            </motion.h3>

            {/* 5. Mission Quick Stats Chips (High-Contrast Pills) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 my-3 font-mono text-[11px] sm:text-xs text-white"
            >
              <span className="px-2.5 py-1 rounded bg-red-950/70 border border-red-700/60 font-semibold flex items-center gap-1.5 shadow-[0_0_10px_rgba(229,9,20,0.3)]">
                <Flame size={12} className="text-[#e50914]" /> 24 HOURS ARENA
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-950/70 border border-amber-600/60 font-semibold text-[#ffe066] flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,215,0,0.25)]">
                <Award size={12} className="text-[#ffd700]" /> ₹50,000+ BOUNTY
              </span>
              <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 font-semibold flex items-center gap-1.5">
                <Cpu size={12} className="text-red-400" /> 5 TRACKS • 20 PROBLEM STATEMENTS
              </span>
            </motion.div>

            {/* 6. Tagline (Crisp Readable White Text) */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="text-xs sm:text-sm text-[#f1f5f9] font-mono max-w-lg mx-auto mb-6 leading-relaxed font-normal"
            >
              Enter the Upside Down of code. Will your squad conquer the breach and claim victory?
            </motion.p>

            {/* 7. Enter the Experience CTA (Emerges after title reveal) */}
            <AnimatePresence>
              {ctaVisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="flex flex-col items-center"
                >
                  <button
                    onClick={onEnterExperience}
                    className="group relative px-10 sm:px-14 py-4 sm:py-4.5 bg-[#e50914] text-white font-mono text-sm sm:text-base font-black tracking-[0.25em] uppercase rounded-sm shadow-[0_0_50px_rgba(229,9,20,0.95)] hover:bg-[#ff1b27] hover:shadow-[0_0_75px_rgba(255,27,39,1)] hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center gap-3 overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 w-1/3 bg-white/25 skew-x-12 -translate-x-full group-hover:translate-x-[450%] transition-transform duration-1000 ease-out" />
                    <Flame size={20} className="text-[#ffd700] animate-pulse" />
                    <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      ENTER THE EXPERIENCE
                    </span>
                    <Sparkles size={20} className="text-[#ffd700]" />
                  </button>

                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-[#cbd5e1] tracking-widest uppercase">
                    <span>CLICK TO DIVE THROUGH THE GATE</span>
                    <ChevronDown size={14} className="text-[#e50914] animate-bounce" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Title;

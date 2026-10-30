// CinematicOverlay.tsx
// Cinematic UI Overlay: Initial black screen reveal, Letter-by-letter CODE CARNIVAL title, and "ENTER THE EXPERIENCE" CTA
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, ChevronDown, Volume2, VolumeX, Flame } from 'lucide-react';

interface CinematicOverlayProps {
  cinematicPhase: 'SCENE_1_INTRO' | 'SCENE_2_AWAKEN' | 'SCENE_3_REVEAL' | 'SCENE_4_WARP' | 'EXPLORING_SITE';
  onEnterExperience: () => void;
  onHoverPortalStart: () => void;
  onHoverPortalEnd: () => void;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
}

export const CinematicOverlay: React.FC<CinematicOverlayProps> = ({
  cinematicPhase,
  onEnterExperience,
  onHoverPortalStart,
  onHoverPortalEnd,
  isPlayingAudio,
  onToggleAudio,
}) => {
  // Title characters for letter-by-letter appearance
  const titleLine1 = useMemo(() => 'CODE'.split(''), []);
  const titleLine2 = useMemo(() => 'CARNIVAL'.split(''), []);

  // If already exploring the site, hide the opening overlay completely
  if (cinematicPhase === 'EXPLORING_SITE') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col items-center justify-between p-6 sm:p-10 select-none">
      {/* 1. Scene 1 Initial Black Veil Reveal */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2.8, ease: 'easeOut', delay: 0.3 }}
        className="fixed inset-0 bg-black pointer-events-none z-50"
      />

      {/* 2. Top Bar: Hawkins Lab Telemetry + Sound Toggle */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 1.2 }}
        className="w-full max-w-6xl flex items-center justify-between pointer-events-auto"
      >
        {/* Telemetry pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-900/50 bg-[#070205]/70 backdrop-blur-md text-[11px] font-mono tracking-widest text-[#e8d5b5]/80">
          <span className="w-2 h-2 rounded-full bg-[#e50914] animate-ping" />
          <span className="text-[#e50914] font-bold">HAWKINS LAB</span>
          <span className="opacity-40">//</span>
          <span className="hidden sm:inline">DIMENSIONAL RIFT ACTIVE</span>
          <span className="sm:hidden">RIFT ACTIVE</span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleAudio}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-widest transition-all duration-300 ${
            isPlayingAudio
              ? 'border-red-600 bg-red-950/40 text-red-400 shadow-[0_0_15px_rgba(229,9,20,0.4)]'
              : 'border-[#e8d5b5]/30 bg-black/40 text-[#e8d5b5]/60 hover:text-white hover:border-[#e8d5b5]/60'
          }`}
          title={isPlayingAudio ? 'Mute Audio' : 'Unmute Cinematic Sound'}
          aria-label="Toggle Audio"
        >
          {isPlayingAudio ? <Volume2 size={14} className="text-[#e50914]" /> : <VolumeX size={14} />}
          <span className="hidden sm:inline">{isPlayingAudio ? 'SOUND ON' : 'ENABLE SOUND'}</span>
        </button>
      </motion.header>

      {/* 3. Center: CODE CARNIVAL Reveal (Scene 3 & 4) */}
      <div className="flex flex-col items-center justify-center text-center my-auto px-4 z-40 max-w-4xl">
        {/* State Level Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1 text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase text-[#ffd700] border border-[#ffd700]/30 bg-[#ffd700]/10 rounded-sm">
            <Shield size={12} />
            STATE LEVEL HACKATHON // SEASON 2.0
            <Shield size={12} />
          </span>
        </motion.div>

        {/* Presenter Line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 1.9 }}
          className="text-xs sm:text-sm font-mono tracking-[0.35em] text-[#e8d5b5] uppercase mb-2"
        >
          AI STUDENT CHAPTER PRESENTS
        </motion.p>

        {/* Main Title: Letter-by-letter reveal with red glow and subtle glitch */}
        <div className="relative mb-3 flex flex-col items-center">
          {/* Line 1: CODE */}
          <div className="flex justify-center gap-1 sm:gap-2">
            {titleLine1.map((char, index) => (
              <motion.span
                key={`line1-${index}`}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.6,
                  delay: 2.2 + index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="st-cinematic-letter text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tight"
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  color: '#ffffff',
                  textShadow:
                    '0 0 20px #e50914, 0 0 50px rgba(229, 9, 20, 0.8), 0 0 90px rgba(229, 9, 20, 0.5)',
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Line 2: CARNIVAL 2.0 */}
          <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
            {titleLine2.map((char, index) => (
              <motion.span
                key={`line2-${index}`}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.6,
                  delay: 2.7 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="st-cinematic-letter text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight"
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  color: '#ffffff',
                  textShadow:
                    '0 0 20px #e50914, 0 0 50px rgba(229, 9, 20, 0.8), 0 0 90px rgba(229, 9, 20, 0.5)',
                }}
              >
                {char}
              </motion.span>
            ))}

            {/* Glowing 2.0 */}
            <motion.span
              initial={{ opacity: 0, scale: 0.6, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{
                duration: 0.7,
                delay: 3.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-[#e50914] text-5xl sm:text-7xl md:text-8xl font-black ml-2 sm:ml-4 inline-block align-baseline"
              style={{
                fontFamily: "'Libre Baskerville', serif",
                textShadow:
                  '0 0 25px #e50914, 0 0 55px rgba(229, 9, 20, 0.9), 0 0 90px #ff2233',
              }}
            >
              2.0
            </motion.span>
          </div>
        </div>

        {/* Subtitle: ENTER THE WORLD OF INNOVATION */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.15em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ duration: 1.2, delay: 3.6 }}
          className="text-sm sm:text-lg md:text-xl font-bold uppercase text-[#e50914] mb-3 font-mono"
          style={{ textShadow: '0 0 16px rgba(229,9,20,0.8)' }}
        >
          ENTER THE WORLD OF INNOVATION
        </motion.p>

        {/* Short introductory tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 1.0, delay: 4.0 }}
          className="text-xs sm:text-sm text-[#e8d5b5]/80 font-mono max-w-lg mb-8 leading-relaxed"
        >
          Enter the Upside Down of code. 24 hours of adrenaline, algorithms, and glory.
          Will your creation survive the breach?
        </motion.p>

        {/* Scene 4: "ENTER THE EXPERIENCE" CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 4.3 }}
          className="pointer-events-auto relative group"
        >
          <button
            onClick={onEnterExperience}
            onMouseEnter={onHoverPortalStart}
            onMouseLeave={onHoverPortalEnd}
            className="st-btn-cinematic-enter relative px-9 sm:px-12 py-4 sm:py-5 bg-[#e50914] text-white font-mono text-sm sm:text-base font-bold tracking-[0.25em] uppercase rounded-sm shadow-[0_0_40px_rgba(229,9,20,0.8)] hover:bg-[#ff1b27] hover:shadow-[0_0_65px_rgba(255,27,39,1)] transition-all duration-300 transform active:scale-95 flex items-center gap-3 overflow-hidden"
          >
            {/* Holographic scanning laser bar */}
            <div className="absolute inset-0 w-1/3 bg-white/25 skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-out" />

            <Flame size={18} className="text-[#ffd700] animate-pulse" />
            <span>ENTER THE EXPERIENCE</span>
            <Sparkles size={18} className="text-[#ffd700]" />
          </button>
        </motion.div>
      </div>

      {/* 4. Bottom Hint: Scroll or Click */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.0, delay: 4.6 }}
        className="w-full flex flex-col items-center gap-1.5 text-[10px] sm:text-xs font-mono text-[#e8d5b5]/60 tracking-widest uppercase pb-2"
      >
        <span>CLICK TO DIVE THROUGH THE GATE • OR SCROLL DOWN</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={14} className="text-[#e50914]" />
        </motion.div>
      </motion.footer>
    </div>
  );
};

export default CinematicOverlay;

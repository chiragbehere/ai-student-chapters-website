import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink, Calendar, MapPin, Clock, Users, Zap, Code, Trophy,
  Skull, Shield, Flame, Eye, Target, Lightbulb, Award, Star,
  GitBranch, Cpu, Brain, Swords, Volume2, VolumeX, Fingerprint
} from 'lucide-react';
import SEO from '../components/SEO';
import './CodeCarnival.css';

// ═══════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════
const UNSTOP_URL = '#'; // ← Replace with your Unstop registration link

// ── Alphabet wall ─────────────────────────────────────
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LIGHT_COLORS = ['#e50914', '#ff6b35', '#f5a623', '#4ecdc4', '#45b7d1', '#96e6a1', '#dda0dd', '#ff69b4'];
const SPELL_WORD = 'CODECARNIVAL';

// ── Christmas light colors ────────────────────────────
const XMAS_COLORS = ['#e50914', '#f5a623', '#4ecdc4', '#45b7d1', '#96e6a1', '#dda0dd', '#ff69b4', '#ffd700', '#e50914', '#ff6b35', '#4ecdc4', '#f5a623'];

// ═══════════════════════════════════════════════════════
// LIGHTWEIGHT COMPONENTS
// ═══════════════════════════════════════════════════════

// ── Floating embers (reduced to 12) ───────────────────
const Embers = () => {
  const embers = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      opacity: 0.3 + Math.random() * 0.5,
    })),
  []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden="true">
      {embers.map((e) => (
        <span
          key={e.id}
          className="st-ember"
          style={{
            left: e.left,
            width: `${e.size}px`,
            height: `${e.size}px`,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            opacity: e.opacity,
          }}
        />
      ))}
    </div>
  );
};

// ── Alphabet Wall (kept as-is) ────────────────────────
const AlphabetWall = () => {
  const [litLetters, setLitLetters] = useState<Set<number>>(new Set());

  useEffect(() => {
    let charIndex = 0;
    const spellInterval = setInterval(() => {
      if (charIndex < SPELL_WORD.length) {
        const char = SPELL_WORD[charIndex];
        const alphaIndex = ALPHABET.indexOf(char);
        if (alphaIndex !== -1) {
          setLitLetters(prev => new Set(prev).add(alphaIndex));
        }
        charIndex++;
      } else {
        setTimeout(() => {
          setLitLetters(new Set());
          charIndex = 0;
        }, 2000);
      }
    }, 300);
    return () => clearInterval(spellInterval);
  }, []);

  return (
    <div className="st-alphabet-wall">
      {ALPHABET.map((letter, i) => (
        <span
          key={letter}
          className={`st-wall-letter ${litLetters.has(i) ? 'lit' : ''}`}
          style={{
            '--light-color': LIGHT_COLORS[i % LIGHT_COLORS.length],
            animationDelay: `${i * 0.1}s`,
          } as React.CSSProperties}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

// ── Christmas Lights ──────────────────────────────────
const ChristmasLights = () => (
  <div className="st-christmas-lights">
    {XMAS_COLORS.map((color, i) => (
      <div
        key={i}
        className="st-light-bulb"
        style={{
          background: color,
          boxShadow: `0 0 6px ${color}, 0 0 12px ${color}50`,
          '--duration': `${2 + Math.random() * 2}s`,
          '--delay': `${i * 0.2}s`,
        } as React.CSSProperties}
      />
    ))}
  </div>
);

// ── Demogorgon Petal Divider ──────────────────────────
const DemogorgonDivider = () => {
  const petals = 5;
  const angles = Array.from({ length: petals }, (_, i) => {
    const spread = 120; // total spread in degrees
    const start = -spread / 2;
    return start + (spread / (petals - 1)) * i;
  });

  return (
    <div className="st-demogorgon-divider">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, position: 'relative', height: '24px' }}>
        {angles.map((angle, i) => (
          <div
            key={i}
            className="st-petal"
            style={{ transform: `rotate(${angle}deg)` }}
          />
        ))}
      </div>
    </div>
  );
};

// ── Upside Down Spores ────────────────────────────────
const UpsideDownSpores = ({ count = 6 }: { count?: number }) => {
  const spores = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      delay: `${Math.random() * 5}s`,
      size: 1 + Math.random() * 2,
    })),
  [count]);

  return (
    <>
      {spores.map((s) => (
        <div
          key={s.id}
          className="st-spore"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: s.delay,
          }}
        />
      ))}
    </>
  );
};

// ── Splash Screen ─────────────────────────────────────
const SplashScreen = ({ onEnter }: { onEnter: () => void }) => {
  const [closing, setClosing] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [closed, setClosed] = useState(false);

  const handleScan = () => {
    if (closing) return;
    setScanning(true);
    // Scan animation, then open doors
    setTimeout(() => {
      setClosing(true);
      // Wait for door animation to complete
      setTimeout(() => {
        setClosed(true);
        onEnter();
      }, 1400);
    }, 800);
  };

  if (closed) return null;

  return (
    <div className={`st-splash ${closing ? 'closing' : ''}`}>
      {/* Top door panel */}
      <div className="st-door-top" />
      {/* Bottom door panel */}
      <div className="st-door-bottom" />

      {/* Content on top of doors */}
      <div className="st-splash-content">
        <h1 className="st-splash-title">
          CODE<br />CARNIVAL
        </h1>
        <p className="st-splash-subtitle">
          The Upside Down of Code
        </p>

        {/* Fingerprint Scanner Button */}
        <button
          className={`st-fingerprint-btn ${scanning ? 'scanning' : ''}`}
          onClick={handleScan}
          aria-label="Scan to enter"
        >
          <div className="st-fp-scan-line" />
          <Fingerprint size={40} />
        </button>
        <p className="st-fingerprint-label">Scan to Enter</p>
      </div>
    </div>
  );
};

// ── Audio Player Hook ─────────────────────────────────
function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const init = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio('/audio/strangerthings_theme.mp3');
      audio.loop = true;
      audio.volume = 0.4;
      audioRef.current = audio;
    }
  }, []);

  const play = useCallback(() => {
    init();
    audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [init]);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return { play, toggle, isPlaying };
}

// ── Simple section-reveal using IntersectionObserver (one observer for all) ──
function useSectionReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const registerRef = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observerRef.current?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
    }
    observerRef.current.observe(el);
  }, []);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return registerRef;
}

// ═══════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════
const CodeCarnival = () => {
  const [showSplash, setShowSplash] = useState(true);
  const audio = useAudioPlayer();
  const registerSection = useSectionReveal();

  const handleEnter = () => {
    setShowSplash(false);
    audio.play();
  };

  // ── Event Details ──
  const eventDetails = [
    { icon: <Calendar size={22} />, label: 'Date', value: 'Coming Soon' },
    { icon: <Clock size={22} />, label: 'Duration', value: '24 Hours' },
    { icon: <MapPin size={22} />, label: 'Venue', value: 'IMRDA Campus' },
    { icon: <Users size={22} />, label: 'Team Size', value: '2–4 Members' },
  ];

  // ── Stats ──
  const stats = [
    { value: '₹50K+', label: 'Prize Pool', icon: <Trophy size={24} /> },
    { value: '24H', label: 'Non-Stop Coding', icon: <Clock size={24} /> },
    { value: 'State', label: 'Level Competition', icon: <Shield size={24} /> },
    { value: '100+', label: 'Expected Hackers', icon: <Users size={24} /> },
  ];

  // ── Highlights ──
  const highlights = [
    { icon: <Code size={22} />, title: 'Build', desc: 'Create something extraordinary in 24 hours — apps, AI models, games, anything' },
    { icon: <Swords size={22} />, title: 'Battle', desc: 'Compete against the best coders from across the state' },
    { icon: <Trophy size={22} />, title: 'Win', desc: 'Prizes worth ₹50,000+ for the survivors of the Upside Down' },
    { icon: <Skull size={22} />, title: 'Survive', desc: 'Coding marathons, surprise challenges, and the Demogorgon round' },
  ];

  // ── Timeline ──
  const timeline = [
    { time: 'T-00:00', label: 'The Gate Opens', desc: 'Registration & check-in. Enter the Upside Down.', icon: <Eye size={16} />, active: true },
    { time: 'T+01:00', label: 'Opening Ceremony', desc: 'Problem statements revealed. The clock starts.', icon: <Flame size={16} /> },
    { time: 'T+02:00', label: 'Hack Begins', desc: '24 hours of non-stop coding frenzy.', icon: <Code size={16} /> },
    { time: 'T+08:00', label: 'Midnight Checkpoint', desc: 'First mentor round. Survive or pivot.', icon: <Target size={16} /> },
    { time: 'T+16:00', label: 'The Demogorgon Round', desc: 'Surprise twist challenge. Adapt or perish.', icon: <Skull size={16} /> },
    { time: 'T+24:00', label: 'Submissions Close', desc: 'Upload your project. No extensions.', icon: <GitBranch size={16} /> },
    { time: 'T+25:00', label: 'Presentations', desc: 'Pitch your creation to the judges.', icon: <Lightbulb size={16} /> },
    { time: 'T+27:00', label: 'The Closing Gate', desc: 'Winners announced. Prizes distributed.', icon: <Award size={16} /> },
  ];

  // ── Tracks ──
  const tracks = [
    { icon: <Brain size={24} />, name: 'AI / ML', desc: 'Build intelligent systems that think' },
    { icon: <Cpu size={24} />, name: 'IoT & Hardware', desc: 'Connect the physical to the digital' },
    { icon: <Shield size={24} />, name: 'Cybersecurity', desc: 'Defend against the Upside Down threats' },
    { icon: <Zap size={24} />, name: 'Open Innovation', desc: 'Any tech, any idea, no limits' },
  ];

  // ── Rules ──
  const rules = [
    'Teams of 2–4 members from any college in the state',
    'All coding must be done during the 24-hour window',
    'Pre-built templates and boilerplates are allowed',
    'Using AI tools (GitHub Copilot, ChatGPT, etc.) is permitted',
    'Projects will be judged on innovation, execution, and impact',
    'All code must be pushed to GitHub before the deadline',
    'Participants must be present for the full duration',
    'Judges\' decisions are final — no appeals in the Upside Down',
  ];

  return (
    <div className="st-page">
      <SEO
        title="Code Carnival 2.0 — The Upside Down of Code"
        description="Enter the Upside Down! Code Carnival 2.0 — a 24-hour State Level Hackathon with ₹50K+ prize pool by AI Student Chapters. Register now on Unstop."
      />

      {/* Subtle Stranger Things background images */}
      <div className="st-bg-upside-down" />
      <div className="st-bg-portal" style={{ top: '-5%', right: '-8%' }} />
      <div className="st-bg-portal" style={{ bottom: '20%', left: '-10%', width: '400px', height: '400px' }} />
      <div className="st-bg-demogorgon" style={{ top: '35%', right: '2%' }} />
      <div className="st-bg-demogorgon" style={{ bottom: '5%', left: '5%', width: '300px', height: '300px', opacity: 0.12 }} />

      {/* Splash Screen */}
      <SplashScreen onEnter={handleEnter} />

      {/* Audio Toggle */}
      {!showSplash && (
        <button
          className={`st-audio-toggle ${audio.isPlaying ? 'playing' : ''}`}
          onClick={audio.toggle}
          aria-label={audio.isPlaying ? 'Mute music' : 'Play music'}
          title={audio.isPlaying ? 'Mute' : 'Play music'}
        >
          {audio.isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      )}

      <Embers />

      {/* ═══════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 z-10">

        {/* Christmas Lights at top */}
        <div className="absolute top-16 left-0 right-0 z-20">
          <ChristmasLights />
        </div>

        {/* State-level badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] uppercase"
            style={{
              border: '1px solid rgba(255,215,0,0.3)',
              color: '#ffd700',
              fontFamily: "'DM Mono', monospace",
              background: 'rgba(255,215,0,0.05)',
            }}
          >
            <Shield size={12} />
            State Level Hackathon
            <Shield size={12} />
          </span>
        </motion.div>

        {/* Alphabet Wall — kept as-is with glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="mb-8"
        >
          <AlphabetWall />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="st-subtitle mb-4"
        >
          AI Student Chapters presents
        </motion.p>

        {/* Main Title with glitch + flicker — kept as-is */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.9, ease: 'easeOut' }}
        >
          <h1 className="st-title st-flicker text-5xl sm:text-7xl md:text-8xl lg:text-9xl mb-2 st-glitch" data-text="CODE CARNIVAL">
            CODE
            <br />
            CARNIVAL
          </h1>
        </motion.div>

        {/* Version badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="h-px w-12 bg-[#e50914]/40" />
          <span
            className="st-flicker-subtle px-4 py-1.5 text-sm tracking-[0.3em] uppercase font-bold"
            style={{
              border: '1px solid rgba(229,9,20,0.4)',
              color: '#e50914',
              fontFamily: "'Libre Baskerville', serif",
            }}
          >
            Season 2.0
          </span>
          <span className="h-px w-12 bg-[#e50914]/40" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9 }}
          className="text-lg sm:text-xl mb-6 max-w-lg mx-auto"
          style={{ color: 'rgba(232,213,181,0.75)', fontFamily: "'Libre Baskerville', serif" }}
        >
          Enter the <span className="text-[#e50914] font-bold st-flicker-subtle">Upside Down</span> of Code.
          <br />
          <span className="text-sm opacity-80">24 Hours. One Shot. Will you survive?</span>
        </motion.p>

        {/* Prize Pool */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1 }}
          className="mb-10"
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(232,213,181,0.55)' }}>
            Total Prize Pool
          </p>
          <p className="st-prize-amount nosebleed text-5xl sm:text-6xl md:text-7xl">₹50,000+</p>
        </motion.div>

        {/* Register Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          <a
            href={UNSTOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="st-btn-register"
          >
            Register on Unstop
            <ExternalLink size={18} />
          </a>
        </motion.div>

        {/* 24h badge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="mt-6 text-xs tracking-widest uppercase"
          style={{ color: 'rgba(229,9,20,0.5)' }}
        >
          🔥 24-Hour Non-Stop Hackathon 🔥
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-[#e50914]/30 flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 bg-[#e50914]/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════════════════ */}
      <section ref={registerSection} className="st-section-animate relative z-10 max-w-5xl mx-auto px-4 sm:px-6" style={{ animationDelay: '0.1s' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="st-stat-box">
              <div className="text-[#e50914] mb-2 flex justify-center">{s.icon}</div>
              <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}>
                {s.value}
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(232,213,181,0.65)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          EVENT DETAILS
          ═══════════════════════════════════════════════════ */}
      <section ref={registerSection} className="st-section-animate relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20" style={{ animationDelay: '0.2s' }}>
        <DemogorgonDivider />

        <div className="text-center mb-12">
          <span className="st-label">// hawkins_lab.details</span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-3"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}
          >
            What Awaits in the{' '}
            <span className="text-[#e50914] st-flicker-subtle st-upside-down-flip">Upside Down</span>
          </h2>
        </div>

        {/* Detail cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {eventDetails.map((d, i) => (
            <div key={i} className="st-card text-center" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-[#e50914] mb-3 flex justify-center">{d.icon}</div>
              <p className="st-label mb-1">{d.label}</p>
              <p className="text-base font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}>
                {d.value}
              </p>
            </div>
          ))}
        </div>

        {/* Static glitch bar */}
        <div className="st-static-bar" />

        {/* Highlights */}
        <div className="text-center mb-12 mt-16">
          <span className="st-label">// mission_briefing</span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-3"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}
          >
            The <span className="text-[#e50914]">Mission</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((h, i) => (
            <div key={i} className="st-card group" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-[#e50914] mb-4 transition-transform group-hover:scale-110 duration-300">
                {h.icon}
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}
              >
                {h.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(232,213,181,0.7)' }}>
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRACKS — UPSIDE DOWN ZONE
          ═══════════════════════════════════════════════════ */}
      <section ref={registerSection} className="st-section-animate st-upside-down-zone relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20" style={{ animationDelay: '0.3s' }}>
        <UpsideDownSpores count={8} />
        <DemogorgonDivider />

        <div className="text-center mb-12 mt-8">
          <span className="st-label">// experiment_tracks</span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-3"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}
          >
            Choose Your <span className="text-[#e50914]">Dimension</span>
          </h2>
          <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: 'rgba(232,213,181,0.65)' }}>
            Pick a track or go rogue with Open Innovation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tracks.map((t, i) => (
            <div
              key={i}
              className="st-neon-border p-6 text-center group cursor-default"
              style={{ background: 'rgba(10,10,10,0.7)' }}
            >
              <div className="text-[#e50914] mb-4 flex justify-center transition-transform group-hover:scale-125 duration-300">
                {t.icon}
              </div>
              <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}>
                {t.name}
              </h3>
              <p className="text-xs" style={{ color: 'rgba(232,213,181,0.65)' }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PRIZE POOL
          ═══════════════════════════════════════════════════ */}
      <section ref={registerSection} className="st-section-animate relative z-10 py-20 px-4" style={{ animationDelay: '0.2s' }}>
        <DemogorgonDivider />

        {/* Christmas lights above prizes */}
        <ChristmasLights />

        <div className="text-center mt-8">
          <span className="st-label">// rewards.exe</span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-3 mb-12"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}
          >
            The <span className="text-[#ffd700] st-gold-glow">Treasure</span> of Hawkins
          </h2>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1st Prize */}
          <div
            className="st-classified p-6 text-center md:order-2"
            style={{ border: '1px solid rgba(255,215,0,0.3)' }}
          >
            <Trophy size={40} className="mx-auto mb-4" style={{ color: '#ffd700' }} />
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(255,215,0,0.6)' }}>1st Place</p>
            <p className="st-prize-amount nosebleed text-4xl mb-2">₹25,000</p>
            <p className="text-xs" style={{ color: 'rgba(232,213,181,0.65)' }}>+ Trophy + Certificates</p>
            <div className="mt-4 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#ffd700" color="#ffd700" />)}
            </div>
          </div>

          {/* 2nd Prize */}
          <div className="st-card text-center md:order-1">
            <Award size={32} className="mx-auto mb-4" style={{ color: '#c0c0c0' }} />
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(192,192,192,0.6)' }}>2nd Place</p>
            <p className="text-3xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif", color: '#c0c0c0' }}>₹15,000</p>
            <p className="text-xs" style={{ color: 'rgba(232,213,181,0.65)' }}>+ Trophy + Certificates</p>
            <div className="mt-4 flex justify-center gap-1">
              {[...Array(4)].map((_, i) => <Star key={i} size={10} fill="#c0c0c0" color="#c0c0c0" />)}
            </div>
          </div>

          {/* 3rd Prize */}
          <div className="st-card text-center md:order-3">
            <Award size={32} className="mx-auto mb-4" style={{ color: '#cd7f32' }} />
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(205,127,50,0.6)' }}>3rd Place</p>
            <p className="text-3xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif", color: '#cd7f32' }}>₹10,000</p>
            <p className="text-xs" style={{ color: 'rgba(232,213,181,0.65)' }}>+ Trophy + Certificates</p>
            <div className="mt-4 flex justify-center gap-1">
              {[...Array(3)].map((_, i) => <Star key={i} size={10} fill="#cd7f32" color="#cd7f32" />)}
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-sm" style={{ color: 'rgba(232,213,181,0.65)' }}>
          + Certificates for all participants • Swag kits • Mentorship opportunities
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════
          TIMELINE
          ═══════════════════════════════════════════════════ */}
      <section ref={registerSection} className="st-section-animate relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20" style={{ animationDelay: '0.2s' }}>
        <DemogorgonDivider />

        <div className="text-center mb-12 mt-8">
          <span className="st-label">// experiment_log</span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-3"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}
          >
            Hawkins Lab <span className="text-[#e50914]">Timeline</span>
          </h2>
          <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: 'rgba(232,213,181,0.65)' }}>
            24 hours. 8 phases. Every minute counts.
          </p>
        </div>

        <div className="relative pl-10 sm:pl-14 space-y-6">
          <div className="st-timeline-line" />

          {timeline.map((item, i) => (
            <div key={i} className="relative">
              <div className={`st-timeline-dot ${item.active ? 'active' : ''}`} />
              <div className="st-card ml-6 sm:ml-8">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="px-2 py-0.5 text-[10px] font-bold tracking-widest"
                    style={{
                      background: 'rgba(229,9,20,0.15)',
                      color: '#e50914',
                      border: '1px solid rgba(229,9,20,0.2)',
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {item.time}
                  </span>
                  <span className="text-[#e50914]/60">{item.icon}</span>
                </div>
                <h3
                  className="text-base font-bold mb-1"
                  style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}
                >
                  {item.label}
                </h3>
                <p className="text-xs" style={{ color: 'rgba(232,213,181,0.65)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          RULES — CLASSIFIED FILES
          ═══════════════════════════════════════════════════ */}
      <section ref={registerSection} className="st-section-animate relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20" style={{ animationDelay: '0.2s' }}>
        <DemogorgonDivider />

        <div className="text-center mb-12 mt-8">
          <span className="st-label">// classified_rules.doc</span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-3"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}
          >
            Lab <span className="text-[#e50914]">Protocols</span>
          </h2>
        </div>

        <div className="st-classified p-6 sm:p-8">
          <div className="space-y-4">
            {rules.map((rule, i) => (
              <div
                key={i}
                className="flex items-start gap-3 pb-4"
                style={{ borderBottom: i < rules.length - 1 ? '1px solid rgba(229,9,20,0.1)' : 'none' }}
              >
                <span
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[10px] font-bold mt-0.5"
                  style={{
                    background: 'rgba(229,9,20,0.15)',
                    color: '#e50914',
                    border: '1px solid rgba(229,9,20,0.2)',
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(232,213,181,0.85)' }}>
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          BOTTOM CTA — "THE GATE IS CLOSING"
          ═══════════════════════════════════════════════════ */}
      <section ref={registerSection} className="st-section-animate relative z-10 py-24 text-center px-4" style={{ animationDelay: '0.2s' }}>
        <DemogorgonDivider />

        <div className="mt-16">
          <p className="st-label mb-4">// final_warning</p>
          <p
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}
          >
            Will you <span className="text-[#e50914] st-flicker-fast">survive</span> the
            <br />
            <span className="st-upside-down-flip">Upside Down</span>?
          </p>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'rgba(232,213,181,0.65)' }}>
            The gate is opening. 24 hours of chaos, code, and creation.
            <br />Secure your spot before it closes forever.
          </p>

          {/* Prize reminder */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="h-px w-10 bg-[#ffd700]/20" />
            <span className="st-prize-amount nosebleed text-2xl sm:text-3xl">₹50,000+</span>
            <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,215,0,0.4)' }}>in prizes</span>
            <span className="h-px w-10 bg-[#ffd700]/20" />
          </div>

          <a
            href={UNSTOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="st-btn-register"
          >
            Register on Unstop
            <ExternalLink size={18} />
          </a>

          <p className="mt-6 text-xs" style={{ color: 'rgba(229,9,20,0.4)' }}>
            Free entry • Open to all state-level college students
          </p>
        </div>

        {/* Static bar before footer */}
        <div className="st-static-bar max-w-5xl mx-auto mt-16" />

        <p className="mt-8 text-[10px] tracking-[0.2em]" style={{ color: 'rgba(232,213,181,0.35)', fontFamily: "'DM Mono', monospace" }}>
          CODE CARNIVAL 2.0 — AI STUDENT CHAPTERS — THE UPSIDE DOWN AWAITS — EST. 2025
        </p>
      </section>
    </div>
  );
};

export default CodeCarnival;

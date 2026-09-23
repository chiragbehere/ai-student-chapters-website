// CodeCarnival.tsx
// Cinematic 3D Upside-Down Experience with Fingerprint Scanner Vault Entrance
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink, Calendar, MapPin, Clock, Users, Zap, Code, Trophy,
  Skull, Shield, Flame, Eye, Target, Lightbulb, Award, Star,
  GitBranch, Cpu, Brain, Swords, Fingerprint
} from 'lucide-react';
import SEO from '../components/SEO';
import './CodeCarnival.css';

// 3D & Cinematic Components
import DimensionScene, { WebGLErrorBoundary } from '../components/code-carnival/DimensionScene';
import WebGLFallback from '../components/code-carnival/WebGLFallback';
import OrganicVines from '../components/code-carnival/OrganicVines';
import DimensionalCracks from '../components/code-carnival/DimensionalCracks';
import EventCard3D from '../components/code-carnival/EventCard3D';
import VHSOverlay from '../components/code-carnival/VHSOverlay';
import CinematicNavbar from '../components/code-carnival/CinematicNavbar';
import { detectPerformance, type PerformanceSettings } from '../components/code-carnival/PerformanceManager';

// ═══════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════
const UNSTOP_URL = 'https://unstop.com'; // Replace with exact registration URL if provided

// ── Alphabet wall ─────────────────────────────────────
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LIGHT_COLORS = ['#e50914', '#ff6b35', '#f5a623', '#4ecdc4', '#45b7d1', '#96e6a1', '#dda0dd', '#ff69b4'];
const SPELL_WORD = 'CODECARNIVAL';

// ── Christmas light colors ────────────────────────────
const XMAS_COLORS = ['#e50914', '#f5a623', '#4ecdc4', '#45b7d1', '#96e6a1', '#dda0dd', '#ff69b4', '#ffd700', '#e50914', '#ff6b35', '#4ecdc4', '#f5a623'];

// ── SplashScreen (Fingerprint Scanner Door) ────────────
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
          aria-label="Scan fingerprint to enter"
        >
          <div className="st-fp-scan-line" />
          <Fingerprint size={40} />
        </button>
        <p className="st-fingerprint-label">Scan to Enter</p>
      </div>
    </div>
  );
};

// ── Alphabet Wall ─────────────────────────────────────
const AlphabetWall = () => {
  const [litLetters, setLitLetters] = useState<Set<number>>(new Set());

  useEffect(() => {
    let charIndex = 0;
    const spellInterval = setInterval(() => {
      if (charIndex < SPELL_WORD.length) {
        const char = SPELL_WORD[charIndex];
        const alphaIndex = ALPHABET.indexOf(char);
        if (alphaIndex !== -1) {
          setLitLetters((prev) => new Set(prev).add(alphaIndex));
        }
        charIndex++;
      } else {
        setTimeout(() => {
          setLitLetters(new Set());
          charIndex = 0;
        }, 2000);
      }
    }, 320);
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
            animationDelay: `${i * 0.08}s`,
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
          boxShadow: `0 0 6px ${color}, 0 0 14px ${color}66`,
          '--duration': `${2 + (i % 3) * 0.8}s`,
          '--delay': `${i * 0.15}s`,
        } as React.CSSProperties}
      />
    ))}
  </div>
);

// ── Demogorgon Petal Divider ──────────────────────────
const DemogorgonDivider = () => {
  const petals = 5;
  const angles = Array.from({ length: petals }, (_, i) => {
    const spread = 120;
    const start = -spread / 2;
    return start + (spread / (petals - 1)) * i;
  });

  return (
    <div className="st-demogorgon-divider my-8">
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

// ── Audio Player Hook ─────────────────────────────────
function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const init = useCallback(() => {
    if (!audioRef.current && typeof window !== 'undefined') {
      const audio = new Audio('/audio/strangerthings_theme.mp3');
      audio.loop = true;
      audio.volume = 0.45;
      audioRef.current = audio;
    }
  }, []);

  const play = useCallback(() => {
    init();
    audioRef.current
      ?.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay policy restriction handled gracefully
      });
  }, [init]);

  const toggle = useCallback(() => {
    init();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [init, isPlaying]);

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

// ═══════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════
export const CodeCarnival: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [performance, setPerformance] = useState<PerformanceSettings>(() => detectPerformance());
  const [scrollY, setScrollY] = useState<number>(0);

  const audio = useAudioPlayer();

  // Lock scroll while splash screen doors are visible
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSplash]);

  useEffect(() => {
    setPerformance(detectPerformance());

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When fingerprint scan completes and vault doors open
  const handleEnter = () => {
    setShowSplash(false);
    audio.play();
  };

  // ── Event Data ──
  const stats = [
    { value: '₹50K+', label: 'Prize Pool', icon: <Trophy size={26} className="text-[#ffd700]" /> },
    { value: '24H', label: 'Non-Stop Coding', icon: <Clock size={26} className="text-[#e50914]" /> },
    { value: 'State', label: 'Level Competition', icon: <Shield size={26} className="text-[#60a5fa]" /> },
    { value: '100+', label: 'Expected Hackers', icon: <Users size={26} className="text-[#e50914]" /> },
  ];

  const eventDetails = [
    { icon: <Calendar size={22} />, label: 'Date', value: 'Coming Soon' },
    { icon: <Clock size={22} />, label: 'Duration', value: '24 Hours' },
    { icon: <MapPin size={22} />, label: 'Venue', value: 'IMRDA Campus, Shirpur' },
    { icon: <Users size={22} />, label: 'Team Size', value: '2–4 Members' },
  ];

  const highlights = [
    {
      icon: <Code size={24} />,
      title: 'Build',
      desc: 'Create something extraordinary in 24 hours — AI architectures, spatial algorithms, systems, or games.',
    },
    {
      icon: <Swords size={24} />,
      title: 'Battle',
      desc: 'Compete against the most skilled engineering and computer science minds from across the state.',
    },
    {
      icon: <Trophy size={24} />,
      title: 'Win',
      desc: 'Prizes worth ₹50,000+ along with prestigious trophies, official merit certificates, and swag kits.',
    },
    {
      icon: <Skull size={24} />,
      title: 'Survive',
      desc: '24-hour coding endurance, sudden midnight twist challenges, and the climactic Demogorgon round.',
    },
  ];

  const tracks = [
    {
      icon: <Brain size={28} />,
      name: 'AI / ML & Agents',
      desc: 'Build autonomous agents, generative models, neural architectures, or intelligent cognitive systems.',
    },
    {
      icon: <Cpu size={28} />,
      name: 'IoT & Hardware Systems',
      desc: 'Bridge physical and digital realities through smart sensors, robotics, and embedded hardware.',
    },
    {
      icon: <Shield size={28} />,
      name: 'Cybersecurity & Defense',
      desc: 'Fortify digital infrastructure, detect intrusions, and build resilient defense against anomaly threats.',
    },
    {
      icon: <Zap size={28} />,
      name: 'Open Innovation',
      desc: 'No technological boundaries. Any domain, any tech stack, any groundbreaking solution.',
    },
  ];

  const timeline = [
    { time: 'T-00:00', label: 'The Gate Opens', desc: 'Registration & check-in. Enter the Upside Down realm.', icon: <Eye size={16} />, active: true },
    { time: 'T+01:00', label: 'Opening Ceremony', desc: 'Problem statements revealed. The 24-hour clock commences.', icon: <Flame size={16} /> },
    { time: 'T+02:00', label: 'Hack Begins', desc: 'Non-stop creation, prototyping, and engineering marathon.', icon: <Code size={16} /> },
    { time: 'T+08:00', label: 'Midnight Checkpoint', desc: 'First technical mentor evaluation. Iterate, refactor, or pivot.', icon: <Target size={16} /> },
    { time: 'T+16:00', label: 'The Demogorgon Round', desc: 'Surprise twist challenge injected into the problem statement.', icon: <Skull size={16} /> },
    { time: 'T+24:00', label: 'Submissions Close', desc: 'Code freeze. Push final commits to GitHub repositories.', icon: <GitBranch size={16} /> },
    { time: 'T+25:00', label: 'Presentations & Demos', desc: 'Pitch and demonstrate live builds to the panel of judges.', icon: <Lightbulb size={16} /> },
    { time: 'T+27:00', label: 'The Closing Gate', desc: 'Winners announced. Felicitations, awards, and prize distribution.', icon: <Award size={16} /> },
  ];

  const rules = [
    'Teams must consist of 2 to 4 eligible student members from recognized colleges.',
    'All core code development must occur during the official 24-hour hackathon window.',
    'Open-source libraries, UI boilerplate frameworks, and public APIs are permitted.',
    'Modern AI development tools (Copilot, Gemini, ChatGPT) are allowed with proper attribution.',
    'Projects are evaluated on technical complexity, practical utility, UI/UX polish, and creativity.',
    'All repositories must be publicly accessible on GitHub before the final submission deadline.',
    'Teams must maintain continuous physical or active registered presence throughout the marathon.',
    'Judges’ final scoring determinations are absolute and binding across all challenge tracks.',
  ];

  const codeCarnivalSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Code Carnival 2.0 - The Upside Down of Code',
    description:
      'State Level 24-hour Hackathon organized by AI Student Chapters at RCPET\'s IMRD Shirpur with cash prizes worth ₹50,000+.',
    startDate: '2026-03-24T09:00:00+05:30',
    endDate: '2026-03-25T12:00:00+05:30',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: "RCPET's IMRD Campus",
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Shirpur',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'AI Student Chapters',
      url: 'https://aistudentchapter.vercel.app/',
    },
  };

  return (
    <div className="st-page relative min-h-screen bg-[#04050d] text-[#e8d5b5] font-mono overflow-x-hidden select-none">
      <SEO
        title="Code Carnival 2.0 | State Level Hackathon | AI Student Chapters"
        description="Enter the Upside Down! Code Carnival 2.0 — a 24-hour State Level Hackathon with ₹50,000+ prize pool organized by AI Student Chapters at RCPET's IMRD."
        url="https://aistudentchapter.vercel.app/code-carnival"
        schema={codeCarnivalSchema}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Events', item: '/events' },
          { name: 'Code Carnival 2.0', item: '/code-carnival' },
        ]}
      />

      {/* 1. Fingerprint Scanner Vault Door Splash Entrance */}
      <SplashScreen onEnter={handleEnter} />

      {/* 2. 1980s VHS & CRT Overlay */}
      <VHSOverlay />

      {/* 3. Floating Cinematic Navigation */}
      {!showSplash && (
        <CinematicNavbar
          isPlayingAudio={audio.isPlaying}
          onToggleAudio={audio.toggle}
          unstopUrl={UNSTOP_URL}
        />
      )}

      {/* 4. 3D WebGL Dimensional Canvas with Fallback */}
      <WebGLErrorBoundary
        fallback={<WebGLFallback intensity={1.0} entering={false} />}
      >
        <DimensionScene
          intensity={1.0}
          entering={false}
          scrollY={scrollY}
          performance={performance}
        />
      </WebGLErrorBoundary>

      {/* ═══════════════════════════════════════════════════
          HERO SECTION (Behind Opening Vault Doors)
          ═══════════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 z-10">
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

        {/* Alphabet Wall */}
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
          className="st-subtitle mb-4 text-xs tracking-widest text-[#e8d5b5]/60 uppercase"
        >
          AI Student Chapters presents
        </motion.p>

        {/* Main Title with 1980s retro aura + flicker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
        >
          <h1
            className="st-title st-flicker text-5xl sm:text-7xl md:text-8xl lg:text-9xl mb-2 st-glitch font-bold select-none"
            data-text="CODE CARNIVAL"
            style={{ fontFamily: "'Libre Baskerville', serif" }}
          >
            CODE
            <br />
            CARNIVAL
          </h1>
        </motion.div>

        {/* Version badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
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
          transition={{ delay: 1.3 }}
          className="text-lg sm:text-xl mb-6 max-w-lg mx-auto"
          style={{ color: 'rgba(232,213,181,0.75)', fontFamily: "'Libre Baskerville', serif" }}
        >
          Enter the <span className="text-[#e50914] font-bold st-flicker-subtle">Upside Down</span> of Code.
          <br />
          <span className="text-sm opacity-80 font-mono">24 Hours. One Shot. Will you survive?</span>
        </motion.p>

        {/* Total Prize Pool */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mb-8"
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-2 text-[#e8d5b5]/55 font-mono">
            Total Prize Pool
          </p>
          <p className="st-prize-amount nosebleed text-5xl sm:text-6xl md:text-7xl font-bold" style={{ color: '#e50914' }}>
            ₹50,000+
          </p>
        </motion.div>

        {/* Register Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
        >
          <a
            href={UNSTOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="st-btn-register inline-flex items-center gap-2"
          >
            Register on Unstop
            <ExternalLink size={18} />
          </a>
        </motion.div>

        {/* 24h badge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9 }}
          className="mt-6 text-xs tracking-widest uppercase font-mono text-[#e50914]/70"
        >
          🔥 24-Hour Non-Stop State Hackathon 🔥
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mt-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-[#e50914]/40 flex items-start justify-center p-1 mx-auto"
          >
            <div className="w-1 h-2 bg-[#e50914] rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CORRUPTED UPSIDE DOWN WORLD
          ═══════════════════════════════════════════════════ */}
      <div
        id="event-overview"
        className="st-corrupted-world relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-32"
      >
        {/* Procedural Organic Corner Vines & Background Cracks */}
        <OrganicVines variant="corner-tl" depth="foreground" />
        <OrganicVines variant="corner-br" depth="midground" />
        <DimensionalCracks variant="cluster" className="top-12 right-10" />

        {/* ── Stats Bar (3D Tilt Cards) ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {stats.map((s, i) => (
            <EventCard3D key={i} highlightBorder={i === 0}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">{s.icon}</div>
                <h3
                  className="text-3xl sm:text-4xl font-extrabold mb-1"
                  style={{ fontFamily: "'Libre Baskerville', serif", color: i === 0 ? '#ffd700' : '#ffffff' }}
                >
                  {s.value}
                </h3>
                <p className="text-[11px] tracking-[0.25em] uppercase text-[#e8d5b5]/60 font-mono">
                  {s.label}
                </p>
              </div>
            </EventCard3D>
          ))}
        </div>

        {/* ── Event Details ── */}
        <div className="mb-24">
          <DemogorgonDivider />
          <div className="text-center mb-12">
            <span className="st-label">// DIMENSIONAL_COORDINATES</span>
            <h2
              className="text-3xl sm:text-5xl font-bold mt-2 text-[#ffffff]"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Hawkins Lab <span className="text-[#e50914] st-upside-down-flip">Breach</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {eventDetails.map((d, i) => (
              <EventCard3D key={i}>
                <div className="text-center">
                  <div className="text-[#e50914] mb-3 flex justify-center">{d.icon}</div>
                  <p className="text-[10px] tracking-widest uppercase text-[#e8d5b5]/50 mb-1 font-mono">
                    {d.label}
                  </p>
                  <p
                    className="text-base sm:text-lg font-bold text-white"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                  >
                    {d.value}
                  </p>
                </div>
              </EventCard3D>
            ))}
          </div>
        </div>

        {/* ── Mission Briefing / Highlights ── */}
        <div className="mb-24">
          <DemogorgonDivider />
          <div className="text-center mb-12">
            <span className="st-label">// MISSION_DIRECTIVE</span>
            <h2
              className="text-3xl sm:text-5xl font-bold mt-2 text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              The <span className="text-[#e50914]">Protocol</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map((h, i) => (
              <EventCard3D key={i}>
                <div className="text-[#e50914] mb-4">{h.icon}</div>
                <h3
                  className="text-lg font-bold mb-2 text-white"
                  style={{ fontFamily: "'Libre Baskerville', serif" }}
                >
                  {h.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#e8d5b5]/70 font-mono">
                  {h.desc}
                </p>
              </EventCard3D>
            ))}
          </div>
        </div>

        {/* ── Challenge Tracks ── */}
        <div id="tracks" className="mb-24">
          <DemogorgonDivider />
          <div className="text-center mb-12">
            <span className="st-label">// EXPERIMENT_DOMAINS</span>
            <h2
              className="text-3xl sm:text-5xl font-bold mt-2 text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Choose Your <span className="text-[#e50914]">Dimension</span>
            </h2>
            <p className="text-xs sm:text-sm mt-3 text-[#e8d5b5]/60 max-w-md mx-auto font-mono">
              Select an experimental track or venture into uncharted reality with Open Innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tracks.map((t, i) => (
              <EventCard3D key={i}>
                <div className="text-[#e50914] mb-4 flex justify-center">{t.icon}</div>
                <h3
                  className="text-base font-bold mb-2 text-center text-white"
                  style={{ fontFamily: "'Libre Baskerville', serif" }}
                >
                  {t.name}
                </h3>
                <p className="text-xs text-center text-[#e8d5b5]/70 font-mono leading-relaxed">
                  {t.desc}
                </p>
              </EventCard3D>
            ))}
          </div>
        </div>

        {/* ── Prize Pool (Treasure of Hawkins) ── */}
        <div id="prizes" className="mb-24">
          <DemogorgonDivider />
          <ChristmasLights />
          <div className="text-center mt-6 mb-12">
            <span className="st-label">// REWARD_VAULT</span>
            <h2
              className="text-3xl sm:text-5xl font-bold mt-2 text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              The <span className="text-[#ffd700]">Bounty</span> of Hawkins
            </h2>
            <p className="text-xs sm:text-sm mt-2 text-[#e8d5b5]/60 font-mono">
              Over ₹50,000 in grand cash bounties, prestige trophies, and survival credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 2nd Place */}
            <div className="md:order-1">
              <EventCard3D>
                <div className="text-center py-2">
                  <Award size={36} className="mx-auto mb-3 text-[#c0c0c0]" />
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#c0c0c0] font-mono mb-1">
                    2nd Place
                  </p>
                  <p
                    className="text-3xl sm:text-4xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                  >
                    ₹15,000
                  </p>
                  <p className="text-xs text-[#e8d5b5]/60 font-mono">+ Trophy + Merit Certificates</p>
                  <div className="mt-4 flex justify-center gap-1">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} size={10} fill="#c0c0c0" color="#c0c0c0" />
                    ))}
                  </div>
                </div>
              </EventCard3D>
            </div>

            {/* 1st Place */}
            <div className="md:order-2">
              <EventCard3D glowColor="#ffd700" highlightBorder={true}>
                <div className="text-center py-3">
                  <Trophy size={46} className="mx-auto mb-3 text-[#ffd700]" />
                  <p className="text-[11px] tracking-[0.3em] uppercase text-[#ffd700] font-mono mb-1 font-bold">
                    1st Place Champion
                  </p>
                  <p
                    className="text-4xl sm:text-5xl font-extrabold text-[#ffd700] mb-2"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                  >
                    ₹25,000
                  </p>
                  <p className="text-xs text-white/90 font-mono font-bold">+ Grand Trophy + Certificates + Swag</p>
                  <div className="mt-4 flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#ffd700" color="#ffd700" />
                    ))}
                  </div>
                </div>
              </EventCard3D>
            </div>

            {/* 3rd Place */}
            <div className="md:order-3">
              <EventCard3D>
                <div className="text-center py-2">
                  <Award size={36} className="mx-auto mb-3 text-[#cd7f32]" />
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#cd7f32] font-mono mb-1">
                    3rd Place
                  </p>
                  <p
                    className="text-3xl sm:text-4xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                  >
                    ₹10,000
                  </p>
                  <p className="text-xs text-[#e8d5b5]/60 font-mono">+ Trophy + Merit Certificates</p>
                  <div className="mt-4 flex justify-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} size={10} fill="#cd7f32" color="#cd7f32" />
                    ))}
                  </div>
                </div>
              </EventCard3D>
            </div>
          </div>

          <p className="text-center mt-8 text-xs font-mono text-[#e8d5b5]/60">
            ✦ Participation certificates awarded to all valid submissions ✦ Direct mentorship from industry leaders ✦
          </p>
        </div>

        {/* ── Timeline ── */}
        <div id="timeline" className="mb-24">
          <DemogorgonDivider />
          <div className="text-center mb-12">
            <span className="st-label">// TEMPORAL_LOG</span>
            <h2
              className="text-3xl sm:text-5xl font-bold mt-2 text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Hawkins Lab <span className="text-[#e50914]">Timeline</span>
            </h2>
            <p className="text-xs sm:text-sm mt-2 text-[#e8d5b5]/60 font-mono">
              24 hours. 8 critical phases. Every second in the Upside Down counts.
            </p>
          </div>

          <div className="relative pl-8 sm:pl-12 space-y-6 max-w-3xl mx-auto">
            <div className="st-timeline-line" />

            {timeline.map((item, i) => (
              <div key={i} className="relative">
                <div className={`st-timeline-dot ${item.active ? 'active' : ''}`} />
                <EventCard3D>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="px-2.5 py-0.5 text-[10px] font-bold tracking-widest font-mono rounded"
                      style={{
                        background: 'rgba(229, 9, 20, 0.2)',
                        color: '#ff2233',
                        border: '1px solid rgba(229, 9, 20, 0.3)',
                      }}
                    >
                      {item.time}
                    </span>
                    <span className="text-[#e50914]">{item.icon}</span>
                  </div>
                  <h3
                    className="text-base font-bold text-white mb-1"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                  >
                    {item.label}
                  </h3>
                  <p className="text-xs text-[#e8d5b5]/70 font-mono">{item.desc}</p>
                </EventCard3D>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rules (Lab Protocols) ── */}
        <div id="protocols" className="mb-24">
          <DemogorgonDivider />
          <div className="text-center mb-12">
            <span className="st-label">// CLASSIFIED_DOSSIER.DOC</span>
            <h2
              className="text-3xl sm:text-5xl font-bold mt-2 text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Lab <span className="text-[#e50914]">Protocols</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto st-classified p-6 sm:p-10 rounded">
            <div className="space-y-4">
              {rules.map((rule, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 pb-4"
                  style={{
                    borderBottom: i < rules.length - 1 ? '1px solid rgba(229, 9, 20, 0.15)' : 'none',
                  }}
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[10px] font-bold font-mono text-[#ff2233] bg-red-950/40 border border-red-700/30 rounded"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm leading-relaxed text-[#e8d5b5]/85 font-mono">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Final Registration Gateway ── */}
        <div id="register" className="text-center py-16 relative">
          <DemogorgonDivider />
          <OrganicVines variant="divider" className="mb-8" />

          <p className="st-label mb-3">// FINAL_BREACH_WARNING</p>
          <h2
            className="text-4xl sm:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Libre Baskerville', serif" }}
          >
            Ready to Enter the{' '}
            <span className="text-[#e50914] st-flicker-fast">Unknown</span>?
          </h2>
          <p className="text-xs sm:text-sm text-[#e8d5b5]/70 max-w-lg mx-auto mb-8 font-mono leading-relaxed">
            The gate will not remain open forever. Assemble your squad, arm your development environments,
            and prepare for the state’s most intense 24-hour hackathon.
          </p>

          <div className="inline-block relative group">
            <a
              href={UNSTOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="st-btn-register inline-flex items-center gap-3 px-10 py-5 bg-[#e50914] text-white font-mono text-base font-bold tracking-[0.2em] uppercase rounded shadow-[0_0_35px_rgba(229,9,20,0.6)] hover:bg-[#ff1a26] transition-all"
            >
              <span>REGISTER ON UNSTOP</span>
              <ExternalLink size={18} />
            </a>
          </div>

          <p className="mt-6 text-xs text-[#e50914]/60 font-mono tracking-wider">
            FREE REGISTRATION • STATE LEVEL • CASH PRIZES • FOOD & SWAG PROVIDED
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodeCarnival;

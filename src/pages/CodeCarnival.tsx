import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink, Calendar, MapPin, Clock, Users, Zap, Code, Trophy,
  Skull, Shield, Flame, Eye, Target, Lightbulb, Award, Star,
  GitBranch, Cpu, Brain, Swords
} from 'lucide-react';
import SEO from '../components/SEO';
import './CodeCarnival.css';

// ═══════════════════════════════════════════════════════
// CONFIG — Update these for each event
// ═══════════════════════════════════════════════════════
const UNSTOP_URL = '#'; // ← Replace with your Unstop registration link

// ── Alphabet wall ─────────────────────────────────────
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LIGHT_COLORS = ['#e50914', '#ff6b35', '#f5a623', '#4ecdc4', '#45b7d1', '#96e6a1', '#dda0dd', '#ff69b4'];
const SPELL_WORD = 'CODECARNIVAL';

// ── Floating embers ───────────────────────────────────
const Embers = ({ count = 30 }: { count?: number }) => {
  const embers = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      duration: 6 + Math.random() * 10,
      delay: Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.7,
    })),
  [count]);

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

// ── Vine decorations ──────────────────────────────────
const Vines = () => {
  const vines = useMemo(() => [
    { top: '10%', left: '2%', height: '120px', delay: '0s', rotate: '-5deg' },
    { top: '25%', right: '3%', height: '180px', delay: '2s', rotate: '3deg' },
    { top: '40%', left: '1%', height: '160px', delay: '5s', rotate: '4deg' },
    { top: '55%', right: '2%', height: '140px', delay: '1s', rotate: '6deg' },
    { top: '70%', left: '4%', height: '100px', delay: '4s', rotate: '-8deg' },
    { top: '85%', right: '5%', height: '90px', delay: '3s', rotate: '-3deg' },
    { top: '15%', right: '8%', height: '110px', delay: '6s', rotate: '2deg' },
    { top: '50%', left: '3%', height: '130px', delay: '7s', rotate: '-4deg' },
  ], []);

  return (
    <>
      {vines.map((v, i) => (
        <div
          key={i}
          className="st-vine hidden md:block"
          style={{
            top: v.top,
            left: (v as any).left,
            right: (v as any).right,
            height: v.height,
            animationDelay: v.delay,
            transform: `rotate(${v.rotate})`,
          }}
        />
      ))}
    </>
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

// ── Fade animation presets ────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.8 },
};

// ═══════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════
const CodeCarnival = () => {

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

  // ── Tracks / Themes ──
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

      <Embers count={35} />
      <Vines />

      {/* Portal background glows */}
      <div className="st-portal" style={{ top: '-10%', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="st-portal" style={{ bottom: '10%', right: '-10%', width: '350px', height: '350px', animationDelay: '3s' }} />
      <div className="st-portal" style={{ top: '40%', left: '-15%', width: '400px', height: '400px', animationDelay: '5s' }} />

      {/* ═══════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 z-10">
        
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
          className="st-subtitle mb-4"
        >
          AI Student Chapters presents
        </motion.p>

        {/* Main Title with glitch effect */}
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

        {/* Prize Pool highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1 }}
          className="mb-10"
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(232,213,181,0.55)' }}>
            Total Prize Pool
          </p>
          <p className="st-prize-amount text-5xl sm:text-6xl md:text-7xl">₹50,000+</p>
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
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div {...fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          EVENT DETAILS
          ═══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="st-divider" />

        <motion.div {...fadeUp} className="text-center mb-12">
          <span className="st-label">// hawkins_lab.details</span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-3"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}
          >
            What Awaits in the{' '}
            <span className="text-[#e50914] st-flicker-subtle st-upside-down-flip">Upside Down</span>
          </h2>
        </motion.div>

        {/* Detail cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {eventDetails.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="st-card text-center"
            >
              <div className="text-[#e50914] mb-3 flex justify-center">{d.icon}</div>
              <p className="st-label mb-1">{d.label}</p>
              <p className="text-base font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}>
                {d.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="st-divider" />

        {/* Highlights */}
        <motion.div {...fadeUp} className="text-center mb-12 mt-16">
          <span className="st-label">// mission_briefing</span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-3"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}
          >
            The <span className="text-[#e50914]">Mission</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="st-card group"
            >
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRACKS / THEMES
          ═══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="st-divider" />

        <motion.div {...fadeUp} className="text-center mb-12 mt-8">
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
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tracks.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PRIZE POOL SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-4">
        <div className="st-divider max-w-5xl mx-auto" />

        <motion.div {...fadeUp} className="text-center mt-8">
          <span className="st-label">// rewards.exe</span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-3 mb-12"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}
          >
            The <span className="text-[#ffd700] st-gold-glow">Treasure</span> of Hawkins
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1st Prize */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="st-classified p-6 text-center md:order-2"
            style={{ border: '1px solid rgba(255,215,0,0.3)' }}
          >
            <Trophy size={40} className="mx-auto mb-4" style={{ color: '#ffd700' }} />
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(255,215,0,0.6)' }}>1st Place</p>
            <p className="st-prize-amount text-4xl mb-2">₹25,000</p>
            <p className="text-xs" style={{ color: 'rgba(232,213,181,0.65)' }}>+ Trophy + Certificates</p>
            <div className="mt-4 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#ffd700" color="#ffd700" />)}
            </div>
          </motion.div>

          {/* 2nd Prize */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="st-card text-center md:order-1"
          >
            <Award size={32} className="mx-auto mb-4" style={{ color: '#c0c0c0' }} />
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(192,192,192,0.6)' }}>2nd Place</p>
            <p className="text-3xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif", color: '#c0c0c0' }}>₹15,000</p>
            <p className="text-xs" style={{ color: 'rgba(232,213,181,0.65)' }}>+ Trophy + Certificates</p>
            <div className="mt-4 flex justify-center gap-1">
              {[...Array(4)].map((_, i) => <Star key={i} size={10} fill="#c0c0c0" color="#c0c0c0" />)}
            </div>
          </motion.div>

          {/* 3rd Prize */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="st-card text-center md:order-3"
          >
            <Award size={32} className="mx-auto mb-4" style={{ color: '#cd7f32' }} />
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(205,127,50,0.6)' }}>3rd Place</p>
            <p className="text-3xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif", color: '#cd7f32' }}>₹10,000</p>
            <p className="text-xs" style={{ color: 'rgba(232,213,181,0.65)' }}>+ Trophy + Certificates</p>
            <div className="mt-4 flex justify-center gap-1">
              {[...Array(3)].map((_, i) => <Star key={i} size={10} fill="#cd7f32" color="#cd7f32" />)}
            </div>
          </motion.div>
        </div>

        {/* Extra prizes */}
        <motion.p
          {...fadeIn}
          className="text-center mt-8 text-sm"
          style={{ color: 'rgba(232,213,181,0.65)' }}
        >
          + Certificates for all participants • Swag kits • Mentorship opportunities
        </motion.p>
      </section>

      {/* ═══════════════════════════════════════════════════
          TIMELINE — "HAWKINS LAB EXPERIMENT LOG"
          ═══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <div className="st-divider" />

        <motion.div {...fadeUp} className="text-center mb-12 mt-8">
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
        </motion.div>

        <div className="relative pl-10 sm:pl-14 space-y-6">
          <div className="st-timeline-line" />

          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative"
            >
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          RULES — "CLASSIFIED FILES"
          ═══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <div className="st-divider" />

        <motion.div {...fadeUp} className="text-center mb-12 mt-8">
          <span className="st-label">// classified_rules.doc</span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-3"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8d5b5' }}
          >
            Lab <span className="text-[#e50914]">Protocols</span>
          </h2>
        </motion.div>

        <motion.div {...fadeIn} className="st-classified p-6 sm:p-8">
          <div className="space-y-4">
            {rules.map((rule, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
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
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          BOTTOM CTA — "THE GATE IS CLOSING"
          ═══════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 text-center px-4">
        <div className="st-divider max-w-5xl mx-auto" />

        <motion.div {...fadeUp} className="mt-16">
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
            <span className="st-prize-amount text-2xl sm:text-3xl">₹50,000+</span>
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
        </motion.div>

        <div className="st-divider max-w-5xl mx-auto mt-16" />

        <p className="mt-8 text-[10px] tracking-[0.2em]" style={{ color: 'rgba(232,213,181,0.35)', fontFamily: "'DM Mono', monospace" }}>
          CODE CARNIVAL 2.0 — AI STUDENT CHAPTERS — THE UPSIDE DOWN AWAITS — EST. 2025
        </p>
      </section>
    </div>
  );
};

export default CodeCarnival;

// CinematicChapters.tsx
// AAA Cinematic Scroll Storyboard: 6 Distinct Alternate-Dimension Chapters
// The Breach -> The Transmission -> The Problem Statements -> The Reward Vault -> The Protocol -> The Final Gate
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, Trophy, Shield, Flame, Eye, Target, Lightbulb,
  Award, Star, GitBranch, Cpu, Brain, Zap, Swords, Lock, Radio,
  Terminal, AlertTriangle, ChevronDown, Mail, CheckCircle2,
  FileText, X, ChevronRight, Info
} from 'lucide-react';
import { IconInstagram, IconGithub, IconWhatsapp } from '../SocialIcons';
import { CHAPTER_INFO } from '../../data/chapterData';
import {
  PROBLEM_TRACKS,
  PROBLEM_STATEMENTS,
  JUDGING_CRITERIA,
  type ProblemStatement,
} from '../../data/codeCarnivalProblemStatements';

const UNSTOP_URL = 'https://unstop.com';

interface CinematicChaptersProps {
  scrollProgress: number; // 0.0 to 1.0
  activeZoneIndex: number;
  setActiveZoneIndex: (index: number) => void;
  onNavigateChapter: (chapterIndex: number) => void;
}

export const CinematicChapters: React.FC<CinematicChaptersProps> = ({
  scrollProgress,
  activeZoneIndex,
  setActiveZoneIndex,
  onNavigateChapter,
}) => {
  // Problem statement state
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | 'Beginner' | 'Intermediate' | 'Advanced'>('ALL');
  const [selectedStatement, setSelectedStatement] = useState<ProblemStatement | null>(null);

  // Sync scroll-driven active zone with user selection
  useEffect(() => {
    if (activeZoneIndex >= 0 && activeZoneIndex < PROBLEM_TRACKS.length) {
      setSelectedTrackIndex(activeZoneIndex);
    }
  }, [activeZoneIndex]);

  const currentTrack = PROBLEM_TRACKS[selectedTrackIndex] || PROBLEM_TRACKS[0];

  // Current active chapter (1 to 6)
  const currentChapter =
    scrollProgress < 0.15
      ? 1
      : scrollProgress < 0.30
      ? 2
      : scrollProgress < 0.50
      ? 3
      : scrollProgress < 0.70
      ? 4
      : scrollProgress < 0.85
      ? 5
      : 6;

  // Track icons
  const trackIcons = [
    <Shield size={20} className="text-[#ff0044]" />,
    <Brain size={20} className="text-[#00e5ff]" />,
    <Zap size={20} className="text-[#00ff66]" />,
    <Cpu size={20} className="text-[#ffaa00]" />,
    <Lightbulb size={20} className="text-[#a855f7]" />,
  ];

  // Filtered statements for the active track and level
  const displayedStatements = useMemo(() => {
    return PROBLEM_STATEMENTS.filter((ps) => {
      const matchTrack = ps.trackId === currentTrack.id;
      const matchLevel = selectedLevel === 'ALL' || ps.level === selectedLevel;
      return matchTrack && matchLevel;
    });
  }, [currentTrack.id, selectedLevel]);

  // Chapter 5: 24-Hour Timeline
  const timeline = [
    { time: 'T-00:00', label: 'The Gate Opens', desc: 'Bunker check-in & squad verification. Enter the Upside Down arena.', icon: <Eye size={15} /> },
    { time: 'T+01:00', label: 'Opening Ceremony', desc: 'Classified problem briefs unsealed. Operational timer starts.', icon: <Flame size={15} /> },
    { time: 'T+02:00', label: 'Hackathon Sprint Begins', desc: '24 hours of non-stop coding, model training, and debugging.', icon: <Zap size={15} /> },
    { time: 'T+08:00', label: 'Midnight Checkpoint', desc: 'Round 1 mentor evaluation. Defend your technical architecture or pivot.', icon: <Target size={15} /> },
    { time: 'T+16:00', label: 'The Demogorgon Round', desc: 'Surprise technical twist challenge. Adapt your deployment or perish.', icon: <Swords size={15} /> },
    { time: 'T+24:00', label: 'Submissions Freeze', desc: 'GitHub commits frozen. Repositories submitted. Zero extensions.', icon: <GitBranch size={15} /> },
    { time: 'T+25:00', label: 'Jury Pitches & Live Demos', desc: 'Live demonstrations in front of industry judges and faculty panels.', icon: <Lightbulb size={15} /> },
    { time: 'T+27:00', label: 'The Closing Gate', desc: 'Champions declared. Cash bounties and gold trophies presented.', icon: <Award size={15} /> },
  ];

  // Chapter 5: Official Lab Directives & Rules from PDF
  const directives = [
    'CRITICAL SELECTION RULE: Each squad may choose ONLY ONE of the 20 official problem statements across all tracks.',
    'SQUAD COMPOSITION: Squads of 2–4 verified members from any accredited state college.',
    'DATA PRIVACY & INTEGRITY: Use only public datasets or realistic simulated data. Never use real personal, financial, or health records.',
    'TRANSPARENT AI: Every submission must state data sources, assumptions and limitations. AI must contribute to analysis/prediction, not just text generation.',
    'ETHICAL & SAFETY BOUNDARIES: Health, safety, and finance tools provide guidance only and must never replace professionals or official channels.',
    'MEASURABLE BENCHMARKS: Squads must demonstrate at least one measurable result (e.g. accuracy, time saved, loss avoided, or users reached).',
    'SOURCE CONTROL FREEZE: All source code must be committed to a public GitHub repository prior to the T+24:00 freeze. Zero extensions.',
    'JURY RUBRIC: Technical Depth (25%), Problem Relevance (20%), Prototype Quality (20%), Explainability & Ethics (15%), Innovation (10%), Presentation (10%).',
  ];

  return (
    <div className="relative z-10 w-full text-[#e8d5b5] font-mono selection:bg-[#e50914] selection:text-white pointer-events-none">
      {/* ── Fixed Chapter HUD Tracker (Left side on desktop) ── */}
      <div className="fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 pointer-events-auto">
        {[
          { num: '01', title: 'THE BREACH' },
          { num: '02', title: 'TRANSMISSION' },
          { num: '03', title: 'STATEMENTS' },
          { num: '04', title: 'THE VAULT' },
          { num: '05', title: 'PROTOCOLS' },
          { num: '06', title: 'FINAL GATE' },
        ].map((ch, idx) => (
          <button
            key={ch.num}
            onClick={() => onNavigateChapter(idx)}
            className={`flex items-center gap-2.5 text-[10px] tracking-widest uppercase transition-all duration-300 text-left group ${
              currentChapter === idx + 1
                ? 'text-[#e50914] font-bold translate-x-1'
                : 'text-[#e8d5b5]/40 hover:text-white'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                currentChapter === idx + 1
                  ? 'bg-[#e50914] scale-150 shadow-[0_0_8px_#e50914]'
                  : 'bg-[#e8d5b5]/30 group-hover:bg-white'
              }`}
            />
            <span className="font-bold">{ch.num}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {ch.title}
            </span>
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════
          CHAPTER 01: THE BREACH (0% to 15% Scroll)
          ═══════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
        <motion.div
          style={{
            opacity: scrollProgress < 0.14 ? 1 - scrollProgress * 6.5 : 0,
            transform: `translateY(${scrollProgress * 150}px)`,
          }}
          className="max-w-4xl flex flex-col items-center pointer-events-auto"
        >
          {/* Classified Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-900/40 bg-black/60 backdrop-blur-md text-[11px] font-mono tracking-widest text-[#e8d5b5]/80 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#e50914] animate-ping" />
            <span className="text-[#e50914] font-bold">HAWKINS LAB TELEMETRY</span>
            <span className="opacity-30">//</span>
            <span>DIMENSIONAL ANOMALY CONFIRMED</span>
          </div>

          <p className="text-xs sm:text-sm font-mono tracking-[0.35em] text-[#e8d5b5]/80 uppercase mb-3">
            AI STUDENT CHAPTER PRESENTS
          </p>

          <h1
            className="st-cinematic-title text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none text-white mb-4"
            style={{
              fontFamily: "'Libre Baskerville', serif",
              textShadow: '0 0 25px #e50914, 0 0 60px rgba(229, 9, 20, 0.8), 0 0 100px rgba(229, 9, 20, 0.5)',
            }}
          >
            CODE
            <br />
            CARNIVAL <span className="text-[#e50914] text-5xl sm:text-7xl md:text-8xl drop-shadow-[0_0_35px_#e50914]">2.0</span>
          </h1>

          <p
            className="text-sm sm:text-lg md:text-xl font-bold tracking-[0.3em] uppercase text-[#e50914] mb-3"
            style={{ textShadow: '0 0 14px rgba(229,9,20,0.8)' }}
          >
            THE UPSIDE DOWN OF CODE • SEASON 2.0
          </p>

          <p className="text-xs sm:text-sm text-[#e8d5b5]/70 max-w-lg mb-8 leading-relaxed">
            Enter the 24-hour supernatural state-level hackathon arena. Travel through the breach to unseal the mission.
          </p>

          {/* Interactive Scroll Invitation */}
          <div className="inline-flex flex-col items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#e8d5b5]/50 animate-pulse">
            <span>SCROLL DOWN TO DIVE INTO THE UNKNOWN</span>
            <ChevronDown size={16} className="text-[#e50914]" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CHAPTER 02: THE TRANSMISSION (15% to 30% Scroll)
          ═══════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative py-20">
        <div className="w-full max-w-4xl border border-red-900/50 bg-[#060810]/90 backdrop-blur-xl rounded-sm p-6 sm:p-10 shadow-[0_0_50px_rgba(229,9,20,0.15)] pointer-events-auto relative overflow-hidden">
          {/* Holographic scanning overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/10 to-transparent pointer-events-none" />

          {/* CRT Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-900/30 pb-4 mb-6 text-xs text-[#e8d5b5]/70">
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-[#e50914] animate-pulse" />
              <span className="text-[#e50914] font-bold">INTERCEPTED TRANSMISSION</span>
              <span className="opacity-30">//</span>
              <span>FREQ: 104.3 MHz</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#22ff66]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22ff66] animate-ping" />
              <span>DEPT. OF ENERGY // HAWKINS BUNKER 04</span>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="space-y-4 mb-8">
            <h2
              className="text-2xl sm:text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Code Carnival 2.0: <span className="text-[#e50914]">The State-Level Breach</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#e8d5b5]/85 leading-relaxed font-mono">
              [DECRYPTED BROADCAST] The AI Student Chapter at <span className="text-white font-semibold">{CHAPTER_INFO.institution}</span> hereby issues an open summons to collegiate builders, system hackers, and algorithmic minds across the state.
            </p>
            <p className="text-xs sm:text-sm text-[#e8d5b5]/75 leading-relaxed font-mono">
              You will be sealed inside a high-intensity 24-hour development chamber. The environment is engineered to test your resilience, architectural ingenuity, and speed under supernatural constraints.
            </p>
          </div>

          {/* Intercepted Metrics Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-red-900/30 pt-6">
            <div className="p-3 bg-black/40 border border-red-950/60 rounded-sm">
              <span className="text-[10px] tracking-widest uppercase text-[#e8d5b5]/50 block mb-1">DURATION</span>
              <span className="text-lg font-bold text-white">24H NON-STOP</span>
            </div>
            <div className="p-3 bg-black/40 border border-red-950/60 rounded-sm">
              <span className="text-[10px] tracking-widest uppercase text-[#e8d5b5]/50 block mb-1">VENUE</span>
              <span className="text-lg font-bold text-white">IMRDA CAMPUS</span>
            </div>
            <div className="p-3 bg-black/40 border border-red-950/60 rounded-sm">
              <span className="text-[10px] tracking-widest uppercase text-[#e8d5b5]/50 block mb-1">SQUAD SIZE</span>
              <span className="text-lg font-bold text-white">2–4 CODERS</span>
            </div>
            <div className="p-3 bg-black/40 border border-red-950/60 rounded-sm">
              <span className="text-[10px] tracking-widest uppercase text-[#e8d5b5]/50 block mb-1">PRIZE POOL</span>
              <span className="text-lg font-bold text-[#ffd700]">₹50,000+</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CHAPTER 03: THE PROBLEM STATEMENTS (30% to 50% Scroll)
          ═══════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative py-20">
        <div className="w-full max-w-6xl pointer-events-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-900/40 bg-black/50 text-[11px] font-mono tracking-widest text-[#e50914] uppercase mb-2">
              <Terminal size={13} />
              <span>THE 20 OFFICIAL CHALLENGES // 5 HACKATHON TRACKS</span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-bold text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Choose Your <span className="text-[#e50914]">Problem Statement</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#e8d5b5]/60 max-w-xl mx-auto mt-2">
              Theme: Open Innovation • Real-world gaps waiting to be solved with AI, Web, Mobile, IoT, and Security.
            </p>
          </div>

          {/* ── CRITICAL DIRECTIVE BANNER: ONLY ONE PROBLEM STATEMENT CAN BE CHOSEN ── */}
          <div className="mb-6 p-4 sm:p-5 rounded-sm border-2 border-[#e50914] bg-gradient-to-r from-red-950/70 via-[#0a0204]/90 to-red-950/70 shadow-[0_0_35px_rgba(229,9,20,0.35)] flex items-start gap-3.5 text-left relative overflow-hidden">
            <div className="p-2 rounded bg-red-950/80 border border-red-700/60 text-[#ffd700] shrink-0 mt-0.5">
              <AlertTriangle size={20} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs sm:text-sm font-bold text-[#ffd700] tracking-widest uppercase">
                  MANDATORY RULE: ONLY ONE PROBLEM STATEMENT CAN BE CHOSEN
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-red-900/60 text-white font-mono uppercase tracking-wider">
                  1 PER SQUAD
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#e8d5b5]/90 leading-relaxed font-mono">
                Participants may select any single problem statement from any track below. Your squad must dedicate the entire 24-hour hackathon to delivering one deep, functioning, measurable solution for that specific challenge.
              </p>
            </div>
          </div>

          {/* 5 Track Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 mb-6">
            {PROBLEM_TRACKS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTrackIndex(idx);
                  setActiveZoneIndex(idx);
                }}
                className={`p-3 rounded-sm border text-left transition-all duration-300 flex flex-col justify-between gap-2 ${
                  selectedTrackIndex === idx
                    ? 'border-white bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-[1.02]'
                    : 'border-red-950/70 bg-black/60 text-[#e8d5b5]/60 hover:text-white hover:border-red-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest font-bold" style={{ color: t.accent }}>
                    {t.code}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/60 border border-white/10 text-white/70">
                    {t.statementCount} PS
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {trackIcons[idx]}
                  <span className="text-xs font-bold font-mono leading-tight">{t.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Track Summary & Difficulty Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-sm border border-red-900/30 bg-[#080914]/80 mb-6">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase block text-white/50">
                ACTIVE SECTOR
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ color: currentTrack.accent }}>
                {currentTrack.name}
              </h3>
              <p className="text-xs text-[#e8d5b5]/70 font-mono mt-0.5 max-w-lg">
                {currentTrack.tagline}
              </p>
            </div>

            {/* Level Filter Buttons */}
            <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto pb-1 sm:pb-0">
              {(['ALL', 'Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-3 py-1 rounded text-xs font-mono tracking-wider transition-all whitespace-nowrap ${
                    selectedLevel === level
                      ? 'bg-[#e50914] text-white font-bold shadow-[0_0_12px_rgba(229,9,20,0.6)]'
                      : 'bg-black/60 border border-white/10 text-[#e8d5b5]/60 hover:text-white hover:border-white/30'
                  }`}
                >
                  {level === 'ALL' ? 'All Levels' : level}
                </button>
              ))}
            </div>
          </div>

          {/* Problem Statements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {displayedStatements.map((ps) => {
              const levelColor =
                ps.level === 'Advanced'
                  ? 'text-[#ff2233] border-red-800/60 bg-red-950/40'
                  : ps.level === 'Intermediate'
                  ? 'text-[#ffaa00] border-amber-800/60 bg-amber-950/40'
                  : 'text-[#00ff66] border-emerald-800/60 bg-emerald-950/40';

              return (
                <div
                  key={ps.id}
                  onClick={() => setSelectedStatement(ps)}
                  className="group cursor-pointer border border-red-900/40 bg-[#060812]/90 backdrop-blur-xl rounded-sm p-5 sm:p-6 hover:border-[#e50914] transition-all duration-300 hover:shadow-[0_0_25px_rgba(229,9,20,0.25)] flex flex-col justify-between"
                >
                  <div>
                    {/* Card Header: PS Number & Level */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-black/80 border border-red-800/40 text-xs font-mono font-bold text-[#e50914]">
                          PS #{String(ps.number).padStart(2, '0')}
                        </span>
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase ${levelColor}`}>
                          {ps.level}
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-[#e8d5b5]/40 group-hover:text-[#e50914] group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Problem Title */}
                    <h4
                      className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#ff3b47] transition-colors"
                      style={{ fontFamily: "'Libre Baskerville', serif" }}
                    >
                      {ps.title}
                    </h4>

                    {/* Real-World Context Snippet */}
                    <p className="text-xs text-[#e8d5b5]/75 line-clamp-3 leading-relaxed font-mono mb-4">
                      {ps.context}
                    </p>
                  </div>

                  <div>
                    {/* Domains list */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                      {ps.domains.map((d, dIdx) => (
                        <span
                          key={dIdx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 border border-white/10 text-white/70"
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    {/* View Brief Prompt */}
                    <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-[#e50914] font-bold tracking-wider">
                      <span>INSPECT CHALLENGE BRIEF</span>
                      <FileText size={13} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {displayedStatements.length === 0 && (
            <div className="p-12 text-center border border-red-950 bg-black/60 rounded-sm">
              <p className="text-sm text-[#e8d5b5]/60 font-mono">
                No problem statements match the selected difficulty level in this track.
              </p>
            </div>
          )}

          {/* 6 Judging Rubric Breakdown Snippet */}
          <div className="mt-8 p-4 sm:p-5 rounded-sm border border-white/15 bg-black/60">
            <span className="text-[10px] font-mono tracking-widest text-[#ffd700] uppercase font-bold block mb-3">
              // OFFICIAL JUDGING RUBRIC (EVALUATION WEIGHTAGE)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {JUDGING_CRITERIA.map((crit, cIdx) => (
                <div key={cIdx} className="p-2.5 bg-[#0a0d18] border border-white/10 rounded-sm text-center">
                  <span className="text-lg font-black text-white block mb-0.5">{crit.weight}%</span>
                  <span className="text-[10px] text-[#e8d5b5]/70 leading-tight block">{crit.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem Statement Full Brief Modal ── */}
      <AnimatePresence>
        {selectedStatement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md pointer-events-auto overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-3xl my-8 border-2 border-[#e50914] bg-[#070914] rounded-sm p-6 sm:p-8 shadow-[0_0_60px_rgba(229,9,20,0.5)] relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/15 pb-4 mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded bg-[#e50914] text-white font-mono text-xs font-bold">
                      PS #{String(selectedStatement.number).padStart(2, '0')}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-black/60 border border-white/20 text-xs font-mono text-white/90">
                      {selectedStatement.trackName}
                    </span>
                    <span className="px-2 py-0.5 rounded border border-amber-500/50 bg-amber-950/40 text-amber-300 text-xs font-mono">
                      Level: {selectedStatement.level}
                    </span>
                  </div>
                  <h3
                    className="text-2xl sm:text-3xl font-black text-white"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                  >
                    {selectedStatement.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedStatement(null)}
                  className="p-2 rounded-sm bg-black/60 border border-white/20 text-white/70 hover:text-white hover:border-red-600 transition-colors shrink-0"
                  aria-label="Close Modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6 text-xs sm:text-sm font-mono leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                {/* Domains */}
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-[#e50914] font-bold block mb-1">
                    DOMAINS
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStatement.domains.map((d, i) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-white/10 border border-white/20 text-white font-bold text-xs">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Problem Context */}
                <div className="p-4 rounded-sm bg-black/50 border border-white/10">
                  <span className="text-[10px] tracking-widest uppercase text-[#ffd700] font-bold block mb-2 flex items-center gap-1.5">
                    <Info size={13} />
                    THE REAL-WORLD PROBLEM GAP
                  </span>
                  <p className="text-[#e8d5b5]/90">{selectedStatement.context}</p>
                </div>

                {/* Your Challenge */}
                <div className="p-4 rounded-sm bg-red-950/30 border border-red-700/50">
                  <span className="text-[10px] tracking-widest uppercase text-[#e50914] font-bold block mb-2 flex items-center gap-1.5">
                    <Target size={14} />
                    YOUR HACKATHON CHALLENGE
                  </span>
                  <p className="text-white font-medium">{selectedStatement.challenge}</p>
                </div>

                {/* Expected Outcome */}
                <div className="p-4 rounded-sm bg-emerald-950/30 border border-emerald-700/50">
                  <span className="text-[10px] tracking-widest uppercase text-[#00ff66] font-bold block mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    EXPECTED PROTOTYPE OUTCOME
                  </span>
                  <p className="text-white font-medium">{selectedStatement.expectedOutcome}</p>
                </div>

                {/* Critical Note & Constraints */}
                <div className="p-4 rounded-sm bg-amber-950/30 border border-amber-700/50">
                  <span className="text-[10px] tracking-widest uppercase text-[#ffd700] font-bold block mb-2 flex items-center gap-1.5">
                    <AlertTriangle size={14} />
                    RULES & ETHICAL CONSTRAINTS
                  </span>
                  <p className="text-[#ffd700]/90">{selectedStatement.note}</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-white/15">
                <div className="text-xs text-[#ffd700] font-mono font-bold">
                  ⚡ Squads can choose ONLY 1 problem statement for the hackathon.
                </div>
                <button
                  onClick={() => setSelectedStatement(null)}
                  className="px-6 py-2.5 rounded-sm bg-[#e50914] hover:bg-[#ff1b27] text-white font-mono text-xs font-bold tracking-widest uppercase transition-all"
                >
                  CLOSE BRIEF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════
          CHAPTER 04: THE REWARD VAULT (50% to 70% Scroll)
          ═══════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative py-20">
        <div className="w-full max-w-4xl pointer-events-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-yellow-700/40 bg-yellow-950/20 text-[11px] font-mono tracking-widest text-[#ffd700] uppercase mb-3">
              <Lock size={13} />
              <span>HIGH-SECURITY CONTAINMENT VAULT // BREACHED</span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-bold text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              The <span className="text-[#ffd700]">Rewards</span> of Hawkins
            </h2>
            <p className="text-xs sm:text-sm text-[#e8d5b5]/70 max-w-md mx-auto mt-2">
              ₹50,000+ bounty unsealed for the surviving squads.
            </p>
          </div>

          {/* Three Tier Vault Pedestals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* 1st Prize — Center Highlight */}
            <div className="md:order-2 border border-yellow-500/50 bg-gradient-to-b from-yellow-950/30 to-black/80 rounded-sm p-6 sm:p-8 text-center shadow-[0_0_40px_rgba(255,215,0,0.2)]">
              <Trophy size={48} className="mx-auto mb-3 text-[#ffd700]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#ffd700] font-bold block mb-1">
                1ST PLACE GRAND CHAMPION
              </span>
              <p
                className="text-4xl sm:text-5xl font-black text-[#ffd700] mb-2"
                style={{ fontFamily: "'Libre Baskerville', serif" }}
              >
                ₹25,000
              </p>
              <p className="text-xs text-[#e8d5b5]/90 mb-4 font-mono">
                + Grand Demogorgon Trophy + Merit Certificates + Industry Mentorship
              </p>
              <div className="flex justify-center gap-1 text-[#ffd700]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#ffd700" />
                ))}
              </div>
            </div>

            {/* 2nd Prize */}
            <div className="md:order-1 border border-white/25 bg-[#080914]/80 rounded-sm p-6 text-center">
              <Award size={38} className="mx-auto mb-3 text-[#c0c0c0]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#c0c0c0] font-bold block mb-1">
                2ND PLACE RUNNER-UP
              </span>
              <p
                className="text-3xl sm:text-4xl font-bold text-white mb-2"
                style={{ fontFamily: "'Libre Baskerville', serif" }}
              >
                ₹15,000
              </p>
              <p className="text-xs text-[#e8d5b5]/80 mb-4 font-mono">
                + Runner-up Trophy + Certificates
              </p>
              <div className="flex justify-center gap-1 text-[#c0c0c0]">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} size={12} fill="#c0c0c0" />
                ))}
              </div>
            </div>

            {/* 3rd Prize */}
            <div className="md:order-3 border border-orange-800/40 bg-[#080914]/80 rounded-sm p-6 text-center">
              <Award size={38} className="mx-auto mb-3 text-[#cd7f32]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#cd7f32] font-bold block mb-1">
                3RD PLACE
              </span>
              <p
                className="text-3xl sm:text-4xl font-bold text-white mb-2"
                style={{ fontFamily: "'Libre Baskerville', serif" }}
              >
                ₹10,000
              </p>
              <p className="text-xs text-[#e8d5b5]/80 mb-4 font-mono">
                + Trophy + Certificates
              </p>
              <div className="flex justify-center gap-1 text-[#cd7f32]">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} size={12} fill="#cd7f32" />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-[#e8d5b5]/60 font-mono">
            • State-level recognition • Developer survival swag kit • Food & refreshments provided
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CHAPTER 05: THE PROTOCOL & COUNTDOWN (70% to 85% Scroll)
          ═══════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative py-20">
        <div className="w-full max-w-5xl pointer-events-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-900/40 bg-black/60 text-[11px] font-mono tracking-widest text-[#e50914] uppercase mb-2">
              <AlertTriangle size={13} />
              <span>COMMAND RADAR // MISSION SCHEDULE & DIRECTIVES</span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-bold text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              24-Hour <span className="text-[#e50914]">Protocol</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: 8 Tactical Phases Timeline */}
            <div className="border border-red-900/30 bg-[#070914]/85 backdrop-blur-xl rounded-sm p-6 sm:p-8">
              <span className="text-xs font-mono tracking-widest text-[#e50914] uppercase block mb-4">
                // 8 OPERATIONAL TIMELINE PHASES
              </span>
              <div className="space-y-3.5">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-b-0">
                    <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest text-[#e50914] bg-red-950/50 border border-red-800/40 rounded shrink-0">
                      {item.time}
                    </span>
                    <div className="text-[#e50914] mt-0.5 shrink-0">{item.icon}</div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.label}</h4>
                      <p className="text-xs text-[#e8d5b5]/70 leading-relaxed font-mono">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Official Lab Directives (Rules from Document) */}
            <div className="border border-red-900/30 bg-[#070914]/85 backdrop-blur-xl rounded-sm p-6 sm:p-8">
              <span className="text-xs font-mono tracking-widest text-[#e50914] uppercase block mb-4">
                // OFFICIAL HACKATHON DIRECTIVES & RULES
              </span>
              <div className="space-y-3">
                {directives.map((directive, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-b-0">
                    <span className="w-5 h-5 rounded bg-red-950/60 border border-red-800/40 text-[#ff2233] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className="text-xs text-[#e8d5b5]/85 leading-relaxed font-mono">{directive}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CHAPTER 06: THE FINAL GATE (85% to 100% Scroll)
          ═══════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative py-20 text-center">
        <div className="w-full max-w-4xl pointer-events-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-700/50 bg-red-950/30 text-[11px] font-mono tracking-widest text-[#e50914] uppercase mb-4 animate-pulse">
            <Flame size={14} className="text-[#ffd700]" />
            <span>FINAL GATEWAY ACTIVE // ACCESS AUTHORIZED</span>
          </div>

          <h2
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
            style={{
              fontFamily: "'Libre Baskerville', serif",
              textShadow: '0 0 30px #e50914, 0 0 70px rgba(229, 9, 20, 0.9)',
            }}
          >
            Will You <span className="text-[#e50914]">Survive</span>
            <br />
            the Upside Down?
          </h2>

          <p className="text-sm sm:text-base text-[#e8d5b5]/80 max-w-lg mb-10 leading-relaxed font-mono">
            The dimensional rift is closing. Gather your squad, choose your single problem statement, and claim your place in the arena.
          </p>

          {/* Primary Action Button */}
          <a
            href={UNSTOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="st-btn-cinematic-enter inline-flex items-center gap-3 px-10 sm:px-14 py-5 bg-[#e50914] text-white font-mono text-base font-bold tracking-[0.25em] uppercase rounded-sm shadow-[0_0_50px_rgba(229,9,20,0.9)] hover:bg-[#ff1b27] hover:shadow-[0_0_80px_rgba(255,27,39,1)] transition-all duration-300 transform active:scale-95 mb-14"
          >
            <span>REGISTER ON UNSTOP</span>
            <ExternalLink size={20} />
          </a>

          {/* Base Personnel Log (Organizing Chapter & Contacts) */}
          <div className="w-full max-w-3xl border border-red-950/60 bg-black/60 rounded-sm p-6 text-xs text-[#e8d5b5]/70 font-mono">
            <p className="text-white font-bold tracking-wider mb-1">
              ORGANIZED BY {CHAPTER_INFO.name} ({CHAPTER_INFO.shortName} '26)
            </p>
            <p className="text-[#e8d5b5]/60 mb-4">{CHAPTER_INFO.institution}</p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-white/10 text-white/80">
              <a href={CHAPTER_INFO.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#e50914] flex items-center gap-1.5 transition-colors">
                <IconInstagram size={14} /> Instagram
              </a>
              <a href={CHAPTER_INFO.whatsappGroup} target="_blank" rel="noopener noreferrer" className="hover:text-[#e50914] flex items-center gap-1.5 transition-colors">
                <IconWhatsapp size={14} /> WhatsApp Community
              </a>
              <a href={CHAPTER_INFO.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#e50914] flex items-center gap-1.5 transition-colors">
                <IconGithub size={14} /> GitHub
              </a>
              <span className="flex items-center gap-1.5 text-[#e8d5b5]/60">
                <Mail size={14} className="text-[#e50914]" /> {CHAPTER_INFO.contactEmail}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CinematicChapters;

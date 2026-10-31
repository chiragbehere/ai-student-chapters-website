// CinematicChapters.tsx
// AAA Cinematic Scroll Storyboard: 6 Distinct Alternate-Dimension Chapters
// The Breach -> The Transmission -> The Official Guidelines -> The Reward Vault -> The Protocol -> The Final Gate
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, Trophy, Shield, Flame, Eye, Target, Lightbulb,
  Award, Star, GitBranch, Brain, Zap, Swords, Lock, Radio,
  Terminal, AlertTriangle, ChevronDown, Mail,
  FileText, X, ChevronRight, Users, Clock, Laptop, Wifi,
  Camera, HeartHandshake, Image as ImageIcon
} from 'lucide-react';
import { IconInstagram, IconGithub, IconWhatsapp } from '../SocialIcons';
import { CHAPTER_INFO } from '../../data/chapterData';
import { EVENT_RULES, POSTER_SLOGANS, type EventRule } from '../../data/codeCarnivalRules';

const UNSTOP_URL = 'https://unstop.com';
const POSTER_IMAGE = '/CodeCarnival_3D_Assets/graphics/event_warnings_poster.jpg';

interface CinematicChaptersProps {
  scrollProgress: number; // 0.0 to 1.0
  activeZoneIndex?: number;
  setActiveZoneIndex?: (index: number) => void;
  onNavigateChapter: (chapterIndex: number) => void;
}

export const CinematicChapters: React.FC<CinematicChaptersProps> = ({
  scrollProgress,
  onNavigateChapter,
}) => {
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<EventRule | null>(null);

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

  // Chapter 5: 24-Hour Timeline
  const timeline = [
    { time: 'T-00:00', label: 'The Gate Opens', desc: 'Bunker check-in & squad verification. Enter the Upside Down arena.', icon: <Eye size={15} /> },
    { time: 'T+01:00', label: 'Opening Ceremony', desc: 'Classified mission parameters unsealed. Operational timer starts.', icon: <Flame size={15} /> },
    { time: 'T+02:00', label: 'Hackathon Sprint Begins', desc: '24 hours of non-stop coding, model training, and building.', icon: <Zap size={15} /> },
    { time: 'T+08:00', label: 'Midnight Checkpoint', desc: 'Round 1 mentor evaluation. Defend your technical architecture.', icon: <Target size={15} /> },
    { time: 'T+16:00', label: 'The Demogorgon Round', desc: 'Surprise technical twist challenge. Adapt your deployment or perish.', icon: <Swords size={15} /> },
    { time: 'T+24:00', label: 'Submissions Freeze', desc: 'GitHub commits frozen. Repositories submitted. Zero extensions.', icon: <GitBranch size={15} /> },
    { time: 'T+25:00', label: 'Jury Pitches & Live Demos', desc: 'Live demonstrations in front of industry judges and faculty panels.', icon: <Lightbulb size={15} /> },
    { time: 'T+27:00', label: 'The Closing Gate', desc: 'Champions declared. Cash bounties and gold trophies presented.', icon: <Award size={15} /> },
  ];

  // Chapter 5: Official Lab Directives & Rules
  const directives = [
    'FAIR PLAY & ORIGINALITY: Projects must be your team\'s original idea and work. Zero plagiarism or misuse of AI tools.',
    'SQUAD COMPOSITION: Follow team size limits as stated. Zero team changes permitted after the event starts.',
    'STRICT SUBMISSION DEADLINE: Submissions freeze precisely at T+24:00. Late submissions will not be considered.',
    'SECURITY & ETHICS: Do not attempt to harm, hack, spam or disrupt the event, networks or other participants.',
    'NETWORK USAGE: Use only the provided internet. Avoid heavy downloads, streaming or non-event activities.',
    'RESPONSIBLE AI: Allowed tools must be used responsibly. Do not generate harmful, misleading or offensive content.',
    'CONDUCT & RESPECT: Maintain a respectful, inclusive and friendly environment. No hate speech or misconduct.',
    'JURY AUTHORITY: All jury decisions are final and binding. No arguments or disputes will be entertained.',
  ];

  // Rule icon helper
  const getRuleIcon = (id: number) => {
    switch (id) {
      case 1: return <Users size={22} className="text-[#ff1a2b]" />;
      case 2: return <FileText size={22} className="text-[#ff3b47]" />;
      case 3: return <Users size={22} className="text-[#ff1a2b]" />;
      case 4: return <Clock size={22} className="text-[#ff4d5a]" />;
      case 5: return <Laptop size={22} className="text-[#ff1a2b]" />;
      case 6: return <Wifi size={22} className="text-[#ff3b47]" />;
      case 7: return <Brain size={22} className="text-[#ff1a2b]" />;
      case 8: return <HeartHandshake size={22} className="text-[#ff4d5a]" />;
      case 9: return <Camera size={22} className="text-[#ff1a2b]" />;
      case 10: return <Lightbulb size={22} className="text-[#ff3b47]" />;
      case 11: return <Shield size={22} className="text-[#ffd700]" />;
      case 12: return <AlertTriangle size={22} className="text-[#ff1a2b]" />;
      default: return <Flame size={22} className="text-[#ff1a2b]" />;
    }
  };

  return (
    <div className="relative z-10 w-full text-[#e8d5b5] font-mono selection:bg-[#e50914] selection:text-white pointer-events-none">
      {/* ── Fixed Chapter HUD Tracker (Left side on desktop) ── */}
      <div className="fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 pointer-events-auto">
        {[
          { num: '01', title: 'THE BREACH' },
          { num: '02', title: 'TRANSMISSION' },
          { num: '03', title: 'GUIDELINES' },
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
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative pt-24 pb-16 text-center">
        <div className="w-full max-w-4xl pointer-events-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-900/60 bg-black/60 text-[11px] font-mono tracking-widest text-[#e50914] uppercase mb-6 animate-pulse shadow-[0_0_15px_rgba(229,9,20,0.3)]">
            <Radio size={13} />
            <span>HAWKINS LAB TELEMETRY // DIMENSIONAL ANOMALY CONFIRMED</span>
          </div>

          <p className="text-xs sm:text-sm font-mono tracking-[0.4em] uppercase text-[#e8d5b5]/80 mb-3">
            AI STUDENT CHAPTER PRESENTS
          </p>

          <h1
            className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-wider mb-2 leading-none"
            style={{
              fontFamily: "'Libre Baskerville', serif",
              textShadow: '0 0 30px #e50914, 0 0 60px rgba(229, 9, 20, 0.8)',
            }}
          >
            CODE
            <br />
            <span className="text-[#e50914] drop-shadow-[0_0_35px_#e50914]">CARNIVAL 2.0</span>
          </h1>

          <p className="text-sm sm:text-lg font-mono tracking-[0.25em] text-[#ff4d4d] uppercase font-bold my-4 drop-shadow-[0_0_10px_rgba(229,9,20,0.8)]">
            {POSTER_SLOGANS.header}
          </p>

          <p className="text-xs sm:text-sm text-[#e8d5b5]/75 max-w-lg font-mono leading-relaxed mb-8">
            Enter the 24-hour supernatural state-level hackathon arena. Travel through the breach to unseal the mission.
          </p>

          <div className="flex flex-col items-center gap-2 text-xs text-[#e8d5b5]/60 font-mono tracking-widest uppercase">
            <span>SCROLL DOWN TO DIVE INTO THE UNKNOWN</span>
            <ChevronDown size={16} className="text-[#e50914] animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CHAPTER 02: THE TRANSMISSION (15% to 30% Scroll)
          ═══════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative py-20">
        <div className="w-full max-w-4xl pointer-events-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-900/40 bg-black/50 text-[11px] font-mono tracking-widest text-[#e50914] uppercase mb-3">
              <Terminal size={13} />
              <span>INTERCEPTED TRANSMISSION // FREQ: 104.7 MHz</span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-bold text-white tracking-wide"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              The Hawkins <span className="text-[#e50914]">Lab Briefing</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#e8d5b5]/70 max-w-md mx-auto mt-2">
              Classified dispatch for registered squads across Maharashtra.
            </p>
          </div>

          {/* Interactive CRT Terminal Window */}
          <div className="border border-red-900/50 bg-[#070914]/90 backdrop-blur-xl rounded-sm p-6 sm:p-8 shadow-[0_0_40px_rgba(229,9,20,0.15)] relative overflow-hidden">
            {/* Terminal Window Header Bar */}
            <div className="flex items-center justify-between border-b border-red-950 pb-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-[#e8d5b5]/60">bunker_terminal_v2.0.sh</span>
              </div>
              <span className="text-[10px] text-[#e50914] font-mono tracking-widest uppercase">
                STATUS: BROADCASTING
              </span>
            </div>

            {/* Terminal Body */}
            <div className="space-y-4 text-xs sm:text-sm font-mono leading-relaxed">
              <p className="text-[#e50914] font-bold">
                &gt; INITIALIZING HAWKINS LAB PROTOCOL CC-2026...
              </p>
              <p className="text-[#e8d5b5]/90">
                A massive trans-dimensional breach has opened inside the IMRD campus in Shirpur. We are recruiting elite developer squads to reverse-engineer anomalous phenomena, deploy mission-critical systems, and restore stability before the rift becomes permanent.
              </p>
              <p className="text-[#e8d5b5]/90">
                You will have exactly <span className="text-white font-bold">24 continuous hours</span>. Food, fuel, caffeine, and high-speed network will be provided inside the containment perimeter.
              </p>
              <div className="p-3 bg-red-950/30 border border-red-900/40 rounded text-xs text-[#e8d5b5]/80 space-y-1">
                <div>• <span className="text-white font-bold">VENUE:</span> RCPET&apos;s IMRD Campus, Shirpur</div>
                <div>• <span className="text-white font-bold">ELIGIBILITY:</span> College students across Maharashtra (UG &amp; PG)</div>
                <div>• <span className="text-white font-bold">TEAM SIZE:</span> 2 to 4 developers per squad</div>
                <div>• <span className="text-white font-bold">REGISTRATION:</span> Exclusively on Unstop</div>
              </div>
            </div>

            {/* Quick Metrics Footer */}
            <div className="mt-8 pt-4 border-t border-red-950 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[10px] text-[#e8d5b5]/50 uppercase tracking-widest block">DURATION</span>
                <span className="text-lg font-bold text-white">24 HOURS</span>
              </div>
              <div>
                <span className="text-[10px] text-[#e8d5b5]/50 uppercase tracking-widest block">LEVEL</span>
                <span className="text-lg font-bold text-[#ffd700]">STATE-WIDE</span>
              </div>
              <div>
                <span className="text-[10px] text-[#e8d5b5]/50 uppercase tracking-widest block">SQUAD SIZE</span>
                <span className="text-lg font-bold text-white">2-4 MEMBERS</span>
              </div>
              <div>
                <span className="text-[10px] text-[#e8d5b5]/50 uppercase tracking-widest block">BOUNTY POOL</span>
                <span className="text-lg font-bold text-[#ffd700]">₹50,000+</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CHAPTER 03: EVENT WARNINGS // OFFICIAL GUIDELINES
          ═══════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative py-20">
        <div className="w-full max-w-6xl pointer-events-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-700/60 bg-red-950/40 text-[11px] font-mono tracking-widest text-[#ff2233] uppercase mb-3 shadow-[0_0_15px_rgba(229,9,20,0.35)]">
              <AlertTriangle size={14} className="text-[#ffd700] animate-pulse" />
              <span>{POSTER_SLOGANS.introTag}</span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-black text-white tracking-wide"
              style={{
                fontFamily: "'Libre Baskerville', serif",
                textShadow: '0 0 25px rgba(229,9,20,0.85)',
              }}
            >
              EVENT <span className="text-[#e50914]">WARNINGS</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#ffdd55] font-mono font-bold tracking-[0.15em] uppercase max-w-2xl mx-auto mt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {POSTER_SLOGANS.tagline}
            </p>

            {/* Poster Viewer Trigger Button */}
            <div className="mt-4">
              <button
                onClick={() => setShowPosterModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-red-700/70 bg-black/60 hover:bg-red-950/50 text-[#e8d5b5] hover:text-white text-xs font-mono tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(229,9,20,0.3)] cursor-pointer"
              >
                <ImageIcon size={14} className="text-[#e50914]" />
                <span>VIEW OFFICIAL POSTER ARTWORK</span>
              </button>
            </div>
          </div>

          {/* 12 Rules Grid (Exact poster replica) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5">
            {EVENT_RULES.map((rule) => (
              <div
                key={rule.id}
                onClick={() => setSelectedRule(rule)}
                className="group relative cursor-pointer border border-red-900/50 bg-[#060309]/92 backdrop-blur-xl rounded-xl p-5 hover:border-[#e50914] transition-all duration-300 hover:shadow-[0_0_30px_rgba(229,9,20,0.4)] flex flex-col justify-between hover:-translate-y-1"
              >
                {/* Glowing Corner Accents */}
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-700/60 rounded-tr group-hover:border-[#e50914]" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-700/60 rounded-bl group-hover:border-[#e50914]" />

                <div>
                  {/* Rule Header: Icon & Number */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800/40 group-hover:border-[#e50914] group-hover:shadow-[0_0_15px_rgba(229,9,20,0.5)] transition-all">
                      {getRuleIcon(rule.id)}
                    </div>
                    <span className="text-xs font-mono font-black text-red-500/80 group-hover:text-[#ffd700] tracking-widest">
                      #{rule.number}
                    </span>
                  </div>

                  {/* Rule Title */}
                  <h3
                    className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-[#ff3b47] transition-colors uppercase tracking-wider"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                  >
                    {rule.id}. {rule.title}
                  </h3>

                  {/* Rule Description */}
                  <p className="text-xs text-[#cbd5e1] leading-relaxed font-mono font-medium">
                    {rule.description}
                  </p>
                </div>

                {/* Footer Tag */}
                <div className="mt-4 pt-3 border-t border-red-950/60 flex items-center justify-between text-[10px] font-mono text-red-400 font-bold tracking-widest uppercase">
                  <span>{rule.tag}</span>
                  <ChevronRight size={13} className="text-red-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Poster Banner */}
          <div className="mt-10 p-5 sm:p-6 rounded-xl border border-red-600/50 bg-gradient-to-r from-red-950/70 via-black/90 to-red-950/70 text-center shadow-[0_0_35px_rgba(229,9,20,0.3)]">
            <p className="text-sm sm:text-base font-serif font-black tracking-[0.2em] text-[#ffde59] uppercase mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {POSTER_SLOGANS.bannerTop}
            </p>
            <p className="text-xs sm:text-sm font-mono tracking-[0.35em] text-white/90 uppercase font-bold">
              {POSTER_SLOGANS.bannerBottom}
            </p>
          </div>
        </div>
      </section>

      {/* ── Official Poster Modal ── */}
      <AnimatePresence>
        {showPosterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-2xl w-full max-h-[90vh] bg-[#070308] border-2 border-[#e50914] rounded-xl p-4 shadow-[0_0_80px_rgba(229,9,20,0.7)] flex flex-col items-center overflow-hidden"
            >
              <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-red-900/50">
                <span className="text-xs font-mono font-bold tracking-widest text-[#ffd700] uppercase flex items-center gap-2">
                  <Shield size={14} className="text-[#e50914]" />
                  CODE CARNIVAL 2.0 // OFFICIAL GUIDELINES POSTER
                </span>
                <button
                  onClick={() => setShowPosterModal(false)}
                  className="p-1.5 rounded bg-black/80 border border-red-800 text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close Poster Modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[75vh] w-full flex justify-center p-2 rounded bg-black/60">
                <img
                  src={POSTER_IMAGE}
                  alt="Code Carnival 2.0 Official Guidelines Poster"
                  className="max-w-full h-auto rounded shadow-2xl object-contain"
                />
              </div>

              <div className="mt-3 w-full flex items-center justify-between text-xs font-mono text-[#e8d5b5]/70 pt-2 border-t border-red-950">
                <span>IMRD SHIRPUR // AI STUDENT CHAPTER</span>
                <button
                  onClick={() => setShowPosterModal(false)}
                  className="px-4 py-1.5 rounded bg-[#e50914] text-white font-bold hover:bg-[#ff1b27] transition-all cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Rule Detail Modal ── */}
      <AnimatePresence>
        {selectedRule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="max-w-md w-full bg-[#070308] border-2 border-[#e50914] rounded-xl p-6 shadow-[0_0_50px_rgba(229,9,20,0.6)] relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-red-950 mb-4">
                <span className="text-xs font-mono text-[#ffd700] font-bold tracking-widest uppercase">
                  PROTOCOL RULE #{selectedRule.number}
                </span>
                <button
                  onClick={() => setSelectedRule(null)}
                  className="p-1 rounded bg-black/80 border border-white/20 text-white/80 hover:text-white cursor-pointer"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg bg-red-950/70 border border-red-700/60">
                  {getRuleIcon(selectedRule.id)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white uppercase font-serif">
                    {selectedRule.title}
                  </h4>
                  <span className="text-[10px] text-red-400 font-mono tracking-widest uppercase font-bold">
                    TAG: {selectedRule.tag}
                  </span>
                </div>
              </div>

              <p className="text-sm font-mono text-[#f1f5f9] leading-relaxed p-4 rounded bg-black/60 border border-red-900/40 my-4">
                {selectedRule.description}
              </p>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedRule(null)}
                  className="px-5 py-2 rounded bg-[#e50914] text-white text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#ff1b27] transition-all cursor-pointer"
                >
                  UNDERSTOOD
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

            {/* Right: Official Lab Directives */}
            <div className="border border-red-900/30 bg-[#070914]/85 backdrop-blur-xl rounded-sm p-6 sm:p-8">
              <span className="text-xs font-mono tracking-widest text-[#e50914] uppercase block mb-4">
                // CODE CARNIVAL 2.0 DIRECTIVES
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
            The dimensional rift is closing. Gather your squad, follow the directives, and claim your place in the arena.
          </p>

          {/* Primary Action Button */}
          <a
            href={UNSTOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto px-6 sm:px-14 py-3.5 sm:py-5 bg-[#e50914] text-white font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase rounded-sm shadow-[0_0_50px_rgba(229,9,20,0.8)] hover:bg-[#ff1b27] hover:scale-105 active:scale-95 transition-all duration-300 text-xs sm:text-base text-center"
          >
            <Flame size={20} className="text-[#ffd700] animate-pulse" />
            <span>ENTER THE ARENA — REGISTER ON UNSTOP</span>
            <ExternalLink size={18} />
          </a>

          {/* Footer Metadata */}
          <div className="mt-16 pt-8 border-t border-red-950/60 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#e8d5b5]/50 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#e50914] animate-pulse" />
              <span>AI STUDENT CHAPTER • RCPET&apos;S IMRD, SHIRPUR</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-[#e8d5b5]/70">
              <a href={CHAPTER_INFO.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#e50914] transition-colors" aria-label="Instagram">
                <IconInstagram size={16} />
              </a>
              <a href={CHAPTER_INFO.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#e50914] transition-colors" aria-label="GitHub">
                <IconGithub size={16} />
              </a>
              <a href={CHAPTER_INFO.whatsappGroup} target="_blank" rel="noopener noreferrer" className="hover:text-[#e50914] transition-colors" aria-label="WhatsApp Community">
                <IconWhatsapp size={16} />
              </a>
              <a href={`mailto:${CHAPTER_INFO.contactEmail}`} className="hover:text-[#e50914] transition-colors" aria-label="Email">
                <Mail size={16} />
              </a>
            </div>
            <span>ALL RIGHTS RESERVED © 2026</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CinematicChapters;

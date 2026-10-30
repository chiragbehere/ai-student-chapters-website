// CinematicChapters.tsx
// AAA Cinematic Scroll Storyboard: 6 Distinct Alternate-Dimension Chapters
// The Breach -> The Transmission -> The Challenges -> The Reward Vault -> The Protocol -> The Final Gate
import React from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink, Trophy, Shield, Flame, Eye, Target, Lightbulb,
  Award, Star, GitBranch, Cpu, Brain, Zap, Swords, Lock, Radio,
  Terminal, AlertTriangle, ChevronDown, Mail
} from 'lucide-react';
import { IconInstagram, IconGithub, IconWhatsapp } from '../SocialIcons';
import { CHAPTER_INFO } from '../../data/chapterData';

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

  // Chapter 3: 4 Challenge Tracks
  const tracks = [
    {
      id: 0,
      code: 'ZONE_01 // AI_ML',
      name: 'Artificial Intelligence',
      badge: 'Neural Architectures',
      icon: <Brain size={28} className="text-[#00e5ff]" />,
      accent: '#00e5ff',
      desc: 'Build autonomous agent workflows, local LLM architectures, predictive neural models, and real-time computer vision systems.',
      specs: ['Transformer Models', 'Agentic Systems', 'Quantized Inference', 'Neural APIs'],
    },
    {
      id: 1,
      code: 'ZONE_02 // IOT_HARDWARE',
      name: 'IoT & Cyber-Physical',
      badge: 'Hardware Interface',
      icon: <Cpu size={28} className="text-[#00ff66]" />,
      accent: '#00ff66',
      desc: 'Connect microcontrollers, sensor arrays, robotics, and edge computing nodes to build responsive physical-digital hybrids.',
      specs: ['Microcontrollers', 'Sensor Grids', 'Edge AI', 'Telemetry Streams'],
    },
    {
      id: 2,
      code: 'ZONE_03 // CYBERSECURITY',
      name: 'Cybersecurity Defense',
      badge: 'Threat Containment',
      icon: <Shield size={28} className="text-[#ff0044]" />,
      accent: '#ff0044',
      desc: 'Architect resilient vulnerability shields, automated forensic detection, cryptographic proofs, and defensive anomaly containment.',
      specs: ['Vulnerability Mitigation', 'Zero-Trust Architectures', 'Reverse Engineering', 'Anomaly Isolation'],
    },
    {
      id: 3,
      code: 'ZONE_04 // OPEN_INNOVATION',
      name: 'Open Innovation',
      badge: 'Rogue Protocol',
      icon: <Zap size={28} className="text-[#ffaa00]" />,
      accent: '#ffaa00',
      desc: 'Zero domain boundaries. Pure developer freedom. Any framework, any bold disruptive idea that solves a real-world problem.',
      specs: ['Unrestricted Tech Stack', 'Disruptive Products', 'Fullstack Software', 'Radical Utility'],
    },
  ];

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

  // Chapter 5: 8 Official Lab Directives
  const directives = [
    'Squads of 2–4 verified members from any accredited state college.',
    'All core coding and model engineering must occur inside the 24-hour sprint window.',
    'Pre-existing open-source libraries, UI boilerplates, and APIs are permitted.',
    'Modern AI developer tools (GitHub Copilot, Cursor, LLM APIs) are fully authorized.',
    'Evaluations are weighted on Technical Execution (40%), Innovation (35%), and Impact (25%).',
    'Source code must be pushed to a public GitHub repository prior to the freeze.',
    'Squads must remain on-site at the IMRDA Campus for the entire competition duration.',
    "Jury determinations are absolute — no appeals in the Upside Down.",
  ];

  return (
    <div className="relative z-10 w-full text-[#e8d5b5] font-mono selection:bg-[#e50914] selection:text-white pointer-events-none">
      {/* ── Fixed Chapter HUD Tracker (Left side on desktop) ── */}
      <div className="fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 pointer-events-auto">
        {[
          { num: '01', title: 'THE BREACH' },
          { num: '02', title: 'TRANSMISSION' },
          { num: '03', title: 'CHALLENGES' },
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
            Enter the 24-hour supernatural state-level hackathon arena. Travel through the breach to discover the mission.
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
          CHAPTER 03: THE CHALLENGE ZONES (30% to 50% Scroll)
          ═══════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative py-20">
        <div className="w-full max-w-5xl pointer-events-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-900/40 bg-black/50 text-[11px] font-mono tracking-widest text-[#e50914] uppercase mb-2">
              <Terminal size={13} />
              <span>SECTOR SELECTOR // 4 OPERATIONAL REALMS</span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-bold text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Choose Your <span className="text-[#e50914]">Dimension</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#e8d5b5]/60 max-w-md mx-auto mt-2">
              Select an experimental sector or scroll through each environment.
            </p>
          </div>

          {/* Interactive Zone Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
            {tracks.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setActiveZoneIndex(idx)}
                className={`px-4 py-2 rounded-sm border text-xs font-mono tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  activeZoneIndex === idx
                    ? 'border-white bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    : 'border-red-950 bg-black/50 text-[#e8d5b5]/60 hover:text-white hover:border-red-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.accent }} />
                <span>{t.badge}</span>
              </button>
            ))}
          </div>

          {/* Active Zone Full-Fidelity Holographic Chamber */}
          <div
            className="border bg-[#070914]/90 backdrop-blur-xl rounded-sm p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-500"
            style={{ borderColor: `${tracks[activeZoneIndex].accent}44` }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div
                  className="p-3.5 rounded-sm border"
                  style={{
                    backgroundColor: `${tracks[activeZoneIndex].accent}15`,
                    borderColor: `${tracks[activeZoneIndex].accent}40`,
                  }}
                >
                  {tracks[activeZoneIndex].icon}
                </div>
                <div>
                  <span
                    className="text-[11px] font-mono tracking-widest uppercase font-bold block"
                    style={{ color: tracks[activeZoneIndex].accent }}
                  >
                    {tracks[activeZoneIndex].code}
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-bold text-white"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                  >
                    {tracks[activeZoneIndex].name}
                  </h3>
                </div>
              </div>

              <span className="px-3 py-1 rounded bg-black/60 border border-white/20 text-xs font-mono text-white/80">
                STATE COMPETITION TRACK
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#e8d5b5]/90 leading-relaxed font-mono mb-8">
              {tracks[activeZoneIndex].desc}
            </p>

            {/* Technical Specifications */}
            <div className="flex flex-wrap gap-2">
              {tracks[activeZoneIndex].specs.map((spec, sIdx) => (
                <span
                  key={sIdx}
                  className="px-3 py-1 text-xs font-mono rounded-sm border border-white/15 bg-black/50 text-[#e8d5b5]/80"
                >
                  • {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

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

            {/* Right: 8 Official Lab Directives */}
            <div className="border border-red-900/30 bg-[#070914]/85 backdrop-blur-xl rounded-sm p-6 sm:p-8">
              <span className="text-xs font-mono tracking-widest text-[#e50914] uppercase block mb-4">
                // CLASSIFIED LAB DIRECTIVES (RULES)
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
            The dimensional rift is closing. Gather your squad, arm your development environments, and claim your place in the arena.
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


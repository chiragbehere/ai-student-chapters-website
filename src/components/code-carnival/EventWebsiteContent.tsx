// EventWebsiteContent.tsx
// Complete, authentic Code Carnival Event Website revealed after passing through the dimensional portal
import React from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink, Calendar, MapPin, Clock, Users, Zap, Code, Trophy,
  Skull, Shield, Flame, Eye, Target, Lightbulb, Award, Star,
  GitBranch, Cpu, Brain, Swords, Mail
} from 'lucide-react';
import EventCard3D from './EventCard3D';
import DimensionalCracks from './DimensionalCracks';
import OrganicVines from './OrganicVines';
import CinematicNavbar from './CinematicNavbar';
import { IconInstagram, IconGithub, IconWhatsapp } from '../SocialIcons';
import { CHAPTER_INFO } from '../../data/chapterData';

const UNSTOP_URL = 'https://unstop.com'; // Official registration gateway

interface EventWebsiteContentProps {
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
}

export const EventWebsiteContent: React.FC<EventWebsiteContentProps> = ({
  isPlayingAudio,
  onToggleAudio,
}) => {
  // ── Event Details ──
  const eventDetails = [
    { icon: <Calendar size={22} />, label: 'Date', value: 'Coming Soon' },
    { icon: <Clock size={22} />, label: 'Duration', value: '24 Hours' },
    { icon: <MapPin size={22} />, label: 'Venue', value: 'IMRDA Campus, Shirpur' },
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
    { icon: <Code size={22} />, title: 'Build', desc: 'Create something extraordinary in 24 hours — apps, AI models, games, anything.' },
    { icon: <Swords size={22} />, title: 'Battle', desc: 'Compete against the best coders and engineers from across the state.' },
    { icon: <Trophy size={22} />, title: 'Win', desc: 'Prizes worth ₹50,000+ for the surviving champions of the Upside Down.' },
    { icon: <Skull size={22} />, title: 'Survive', desc: 'Intense coding marathons, surprise mentor rounds, and the Demogorgon challenge.' },
  ];

  // ── Timeline ──
  const timeline = [
    { time: 'T-00:00', label: 'The Gate Opens', desc: 'Registration & check-in. Enter the Upside Down.', icon: <Eye size={16} />, active: true },
    { time: 'T+01:00', label: 'Opening Ceremony', desc: 'Problem statements revealed. The clock starts.', icon: <Flame size={16} /> },
    { time: 'T+02:00', label: 'Hack Begins', desc: '24 hours of non-stop coding and building frenzy.', icon: <Code size={16} /> },
    { time: 'T+08:00', label: 'Midnight Checkpoint', desc: 'First mentor review. Survive or pivot your architecture.', icon: <Target size={16} /> },
    { time: 'T+16:00', label: 'The Demogorgon Round', desc: 'Surprise twist challenge. Adapt or perish.', icon: <Skull size={16} /> },
    { time: 'T+24:00', label: 'Submissions Close', desc: 'Commit and push your final code to GitHub. No extensions.', icon: <GitBranch size={16} /> },
    { time: 'T+25:00', label: 'Presentations', desc: 'Pitch and demo your live creation to the jury.', icon: <Lightbulb size={16} /> },
    { time: 'T+27:00', label: 'The Closing Gate', desc: 'Winners announced. Prizes and trophies distributed.', icon: <Award size={16} /> },
  ];

  // ── Tracks ──
  const tracks = [
    { icon: <Brain size={26} />, name: 'AI / Machine Learning', desc: 'Build intelligent neural models, agentic workflows, and predictive tools.' },
    { icon: <Cpu size={26} />, name: 'IoT & Hardware', desc: 'Connect sensors, microcontrollers, and physical hardware to software.' },
    { icon: <Shield size={26} />, name: 'Cybersecurity', desc: 'Defend systems against vulnerabilities and Upside Down cyber-threats.' },
    { icon: <Zap size={26} />, name: 'Open Innovation', desc: 'Any technology stack, any bold idea. Zero constraints.' },
  ];

  // ── Rules ──
  const rules = [
    'Teams of 2–4 members from any accredited college in the state.',
    'All core coding and implementation must be done during the 24-hour window.',
    'Pre-built templates, open-source libraries, and boilerplates are fully allowed.',
    'Using modern AI developer tools (GitHub Copilot, Cursor, ChatGPT) is permitted.',
    'Projects will be evaluated on innovation, technical execution, and impact.',
    'All source repositories must be pushed to GitHub before the strict deadline.',
    'All team members must be present at the venue for the full duration.',
    "Judges' decisions are final — no appeals in the Upside Down.",
  ];

  return (
    <div className="relative z-20 w-full min-h-screen text-[#e8d5b5] font-mono selection:bg-[#e50914] selection:text-white">
      {/* 1. Cinematic Floating Navigation Bar */}
      <CinematicNavbar
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={onToggleAudio}
        unstopUrl={UNSTOP_URL}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        {/* ── Dimensional Cracks Header Accent ── */}
        <DimensionalCracks variant="horizontal" intensity={1.2} className="mb-6" />

        {/* ── Section: Welcome to the Other Side ── */}
        <section id="event-overview" className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3.5 py-1 text-[11px] font-bold tracking-[0.3em] uppercase text-[#e50914] bg-red-950/40 border border-red-800/40 rounded mb-4">
              // BREACH CONFIRMED • YOU HAVE ENTERED
            </span>
            <h1
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-4"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              CODE <span className="text-[#e50914]">CARNIVAL</span> 2.0
            </h1>
            <p className="text-sm sm:text-lg text-[#e8d5b5]/80 max-w-2xl mx-auto font-mono leading-relaxed mb-8">
              A 24-Hour State-Level Hackathon hosted by the <span className="text-white font-semibold">AI Student Chapter</span> at RCPET’s IMRD, Shirpur.
              Push your coding boundaries in a dark supernatural arena where only the most innovative solutions survive.
            </p>

            {/* Quick Unstop CTA */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={UNSTOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="st-btn-register inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#e50914] text-white font-bold tracking-widest text-sm rounded shadow-[0_0_25px_rgba(229,9,20,0.7)] hover:bg-[#ff1a26] transition-all"
              >
                <span>REGISTER ON UNSTOP</span>
                <ExternalLink size={16} />
              </a>
              <a
                href="#tracks"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-red-800/50 bg-black/40 text-[#e8d5b5] hover:text-white hover:border-red-600 rounded text-sm transition-all"
              >
                <span>EXPLORE TRACKS</span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── Section: Key Stats Bar ── */}
        <section className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <EventCard3D key={i} glowColor="#e50914">
                <div className="p-6 text-center">
                  <div className="text-[#e50914] mb-2 flex justify-center">{s.icon}</div>
                  <p
                    className="text-3xl sm:text-4xl font-extrabold text-white mb-1"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-[#e8d5b5]/70">
                    {s.label}
                  </p>
                </div>
              </EventCard3D>
            ))}
          </div>
        </section>

        {/* ── Section: Event Details (Venue, Date, Team) ── */}
        <section className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {eventDetails.map((d, i) => (
              <EventCard3D key={i} glowColor="#ff4455">
                <div className="p-5 text-center">
                  <div className="text-[#e50914] mb-2 flex justify-center">{d.icon}</div>
                  <p className="text-[10px] tracking-widest uppercase text-[#e8d5b5]/60 mb-1">{d.label}</p>
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
        </section>

        {/* ── Section: Mission Briefing / Highlights ── */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-[#e50914] tracking-widest uppercase">// HAWKINS_LAB.MISSION</span>
            <h2
              className="text-3xl sm:text-5xl font-bold mt-2 text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              The <span className="text-[#e50914]">Mission</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((h, i) => (
              <EventCard3D key={i}>
                <div className="p-6">
                  <div className="text-[#e50914] mb-3">{h.icon}</div>
                  <h3
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                  >
                    {h.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#e8d5b5]/75 leading-relaxed">{h.desc}</p>
                </div>
              </EventCard3D>
            ))}
          </div>
        </section>

        {/* ── Section: Tracks / Competitions ── */}
        <section id="tracks" className="mb-24">
          <OrganicVines variant="divider" className="mb-8" />
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-[#e50914] tracking-widest uppercase">// EXPERIMENT_TRACKS</span>
            <h2
              className="text-3xl sm:text-5xl font-bold mt-2 text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Choose Your <span className="text-[#e50914]">Dimension</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#e8d5b5]/70 max-w-md mx-auto mt-2">
              Select one specialized domain or unleash full creative freedom with Open Innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tracks.map((t, i) => (
              <EventCard3D key={i} glowColor="#ff2233">
                <div className="p-6 text-center">
                  <div className="text-[#e50914] mb-4 flex justify-center">{t.icon}</div>
                  <h3
                    className="text-lg font-bold text-white mb-2"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                  >
                    {t.name}
                  </h3>
                  <p className="text-xs text-[#e8d5b5]/70 leading-relaxed">{t.desc}</p>
                </div>
              </EventCard3D>
            ))}
          </div>
        </section>

        {/* ── Section: Prizes ── */}
        <section id="prizes" className="mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-[#ffd700] tracking-widest uppercase">// CLASSIFIED_REWARDS</span>
            <h2
              className="text-3xl sm:text-5xl font-bold mt-2 text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              The <span className="text-[#ffd700]">Treasure</span> of Hawkins
            </h2>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1st Prize */}
            <EventCard3D highlightBorder={true} glowColor="#ffd700" className="md:order-2">
              <div className="p-8 text-center bg-gradient-to-b from-yellow-950/20 to-black/60">
                <Trophy size={48} className="mx-auto mb-4 text-[#ffd700]" />
                <p className="text-xs tracking-[0.3em] uppercase text-[#ffd700] mb-2 font-bold">1ST PLACE CHAMPION</p>
                <p className="text-5xl font-black text-[#ffd700] mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  ₹25,000
                </p>
                <p className="text-xs text-[#e8d5b5]/80">+ Winner Trophy + Merit Certificates</p>
                <div className="mt-4 flex justify-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#ffd700" color="#ffd700" />
                  ))}
                </div>
              </div>
            </EventCard3D>

            {/* 2nd Prize */}
            <EventCard3D glowColor="#c0c0c0" className="md:order-1">
              <div className="p-6 text-center">
                <Award size={40} className="mx-auto mb-4 text-[#c0c0c0]" />
                <p className="text-xs tracking-[0.3em] uppercase text-[#c0c0c0] mb-2 font-bold">2ND PLACE</p>
                <p className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  ₹15,000
                </p>
                <p className="text-xs text-[#e8d5b5]/80">+ Runner-up Trophy + Certificates</p>
                <div className="mt-4 flex justify-center gap-1.5">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} size={12} fill="#c0c0c0" color="#c0c0c0" />
                  ))}
                </div>
              </div>
            </EventCard3D>

            {/* 3rd Prize */}
            <EventCard3D glowColor="#cd7f32" className="md:order-3">
              <div className="p-6 text-center">
                <Award size={40} className="mx-auto mb-4 text-[#cd7f32]" />
                <p className="text-xs tracking-[0.3em] uppercase text-[#cd7f32] mb-2 font-bold">3RD PLACE</p>
                <p className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  ₹10,000
                </p>
                <p className="text-xs text-[#e8d5b5]/80">+ Trophy + Certificates</p>
                <div className="mt-4 flex justify-center gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} size={12} fill="#cd7f32" color="#cd7f32" />
                  ))}
                </div>
              </div>
            </EventCard3D>
          </div>

          <p className="text-center mt-6 text-xs text-[#e8d5b5]/60">
            • Participation certificates for all verified attendees • Free food & developer swag kits • Mentor guidance
          </p>
        </section>

        {/* ── Section: Timeline ── */}
        <section id="timeline" className="mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-[#e50914] tracking-widest uppercase">// HAWKINS_LAB_TIMELINE</span>
            <h2
              className="text-3xl sm:text-5xl font-bold mt-2 text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              24-Hour <span className="text-[#e50914]">Schedule</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#e8d5b5]/70 max-w-md mx-auto mt-2">
              8 critical operational phases from gate breach to awards.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {timeline.map((item, i) => (
              <EventCard3D key={i} glowColor="#e50914">
                <div className="p-4 sm:p-5 flex items-start gap-4">
                  <span className="px-2.5 py-1 text-xs font-bold tracking-widest text-[#e50914] bg-red-950/40 border border-red-800/40 rounded shrink-0">
                    {item.time}
                  </span>
                  <div className="text-[#e50914] mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                      {item.label}
                    </h3>
                    <p className="text-xs text-[#e8d5b5]/75 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </EventCard3D>
            ))}
          </div>
        </section>

        {/* ── Section: Protocols / Rules ── */}
        <section id="protocols" className="mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-[#e50914] tracking-widest uppercase">// CLASSIFIED_RULES.DOC</span>
            <h2
              className="text-3xl sm:text-5xl font-bold mt-2 text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Lab <span className="text-[#e50914]">Protocols</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto border border-red-900/40 bg-[#080306]/80 p-6 sm:p-8 rounded backdrop-blur-md">
            <div className="space-y-4">
              {rules.map((rule, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 pb-4 border-b border-red-900/20 last:border-b-0"
                >
                  <span className="w-6 h-6 rounded bg-red-950/60 border border-red-700/40 text-[#ff2233] text-xs font-bold flex items-center justify-center shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-xs sm:text-sm text-[#e8d5b5]/85 leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section: Organizing Chapter & Venue Info ── */}
        <section className="mb-24">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-[#e50914] tracking-widest uppercase">// OPERATIONAL_BASE</span>
            <h2
              className="text-3xl sm:text-5xl font-bold mt-2 text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Organizing <span className="text-[#e50914]">Base</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <EventCard3D>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  {CHAPTER_INFO.name}
                </h3>
                <p className="text-xs text-[#e8d5b5]/75 leading-relaxed mb-4">
                  {CHAPTER_INFO.institution}
                </p>
                <p className="text-xs text-[#e8d5b5]/60 mb-6">
                  {CHAPTER_INFO.subTagline}
                </p>
                <div className="flex items-center gap-4 text-[#e8d5b5]/80 text-xs">
                  <a href={CHAPTER_INFO.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#e50914] flex items-center gap-1.5 transition-colors">
                    <IconInstagram size={14} /> Instagram
                  </a>
                  <a href={CHAPTER_INFO.whatsappGroup} target="_blank" rel="noopener noreferrer" className="hover:text-[#e50914] flex items-center gap-1.5 transition-colors">
                    <IconWhatsapp size={14} /> WhatsApp
                  </a>
                  <a href={CHAPTER_INFO.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#e50914] flex items-center gap-1.5 transition-colors">
                    <IconGithub size={14} /> GitHub
                  </a>
                </div>
              </div>
            </EventCard3D>

            <EventCard3D>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Contact & Support
                </h3>
                <p className="text-xs text-[#e8d5b5]/75 leading-relaxed mb-4">
                  Have questions about team formation, accommodations, or rules?
                </p>
                <div className="space-y-2.5 text-xs text-[#e8d5b5]/80">
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-[#e50914]" />
                    <span>{CHAPTER_INFO.contactEmail}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#e50914]" />
                    <span>IMRDA Campus, Karvand Road, Shirpur, MH</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Shield size={14} className="text-[#e50914]" />
                    <span>State Level Official Hackathon Event</span>
                  </p>
                </div>
              </div>
            </EventCard3D>
          </div>
        </section>

        {/* ── Section: Final Registration Portal CTA ── */}
        <section id="register" className="text-center py-16">
          <OrganicVines variant="divider" className="mb-8" />
          <p className="text-xs font-mono text-[#e50914] tracking-widest uppercase mb-3">// FINAL_BREACH_WARNING</p>
          <h2
            className="text-4xl sm:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Libre Baskerville', serif" }}
          >
            Ready to Enter the <span className="text-[#e50914]">Unknown</span>?
          </h2>
          <p className="text-xs sm:text-sm text-[#e8d5b5]/75 max-w-lg mx-auto mb-8 leading-relaxed font-mono">
            Assemble your team, prep your tools, and claim your place in the Upside Down.
            Free registration on Unstop.
          </p>

          <a
            href={UNSTOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="st-btn-register inline-flex items-center gap-3 px-10 py-5 bg-[#e50914] text-white font-mono text-base font-bold tracking-[0.2em] uppercase rounded shadow-[0_0_40px_rgba(229,9,20,0.7)] hover:bg-[#ff1a26] transition-all"
          >
            <span>REGISTER ON UNSTOP</span>
            <ExternalLink size={18} />
          </a>

          <p className="mt-6 text-[11px] text-[#e8d5b5]/40 font-mono tracking-widest uppercase">
            AISC '26 • HAWKINS PROTOCOL ACTIVE • ZERO EXTENSIONS
          </p>
        </section>
      </div>
    </div>
  );
};

export default EventWebsiteContent;

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  BrainCircuit,
  Terminal,
  Cpu,
  Globe2,
  Users2,
  Microscope,
  CheckCircle2,
  ArrowRight,
  Calendar,
  MapPin,
  Sparkles,
  Layers,
  Trophy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import JoinModal from '../components/JoinModal';
import EventRegistrationModal from '../components/EventRegistrationModal';
import {
  CHAPTER_INFO,
  HERO_CONTENT,
  CORE_PRINCIPLES,
  CHAPTER_STATS,
  INITIATIVES,
  EVENTS,
  TEAM_POSITION_HOLDERS,
  type EventItem,
} from '../data/chapterData';

// Animated Counter for Statistics (supports light beige and dark surfaces)
const StatCounter: React.FC<{ value: number; suffix: string; isLight?: boolean }> = ({ value, suffix, isLight = true }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1200;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = value / steps;
          const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className={`font-stat font-extrabold text-4xl sm:text-5xl tracking-tight ${isLight ? 'text-[#1F3D2B]' : 'text-[#E8DCC4]'}`}>
      {count}
      <span className="text-[#8B5CF6]">{suffix}</span>
    </div>
  );
};

export const Home: React.FC = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [registeringEvent, setRegisteringEvent] = useState<EventItem | null>(null);

  const homeSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollegeOrUniversity",
      "name": "AI Student Chapters",
      "alternateName": "AISC RCPIMRD",
      "url": "https://aistudentchapter.vercel.app/",
      "logo": "https://aistudentchapter.vercel.app/images/club-logo.webp",
      "sameAs": [
        "https://instagram.com/ai.student_chapters",
        "https://github.com/ai-student-chapters"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "IMRD Campus, Near Karvand Naka",
        "addressLocality": "Shirpur",
        "addressRegion": "Maharashtra",
        "postalCode": "425405",
        "addressCountry": "IN"
      },
      "description": HERO_CONTENT.description
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://aistudentchapter.vercel.app/",
      "name": "AI Student Chapters",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://aistudentchapter.vercel.app/events?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <div className="w-full text-[#E8DCC4] overflow-hidden">
      <SEO
        title={`${CHAPTER_INFO.name} | RCPIMRD – Build, Learn & Innovate with AI`}
        description={HERO_CONTENT.description}
        url="https://aistudentchapter.vercel.app/"
        schema={homeSchemas}
      />

      {/* ════════════════════════════════════════════════════════════
          1. HERO SECTION — FOREST GREEN (#1F3D2B)
          Features dual-tone hero with Sand Beige content card
      ════════════════════════════════════════════════════════════ */}
      <section className="w-full section-forest border-b border-[#E8DCC4]/15 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Main Headline */}
          <div className="border-b border-[#E8DCC4]/15 pb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#142B20] border border-[#E8DCC4]/15 text-[#8B5CF6] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping" />
              {HERO_CONTENT.badge}
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tight uppercase text-[#E8DCC4] leading-[0.95]">
              AISC <span className="text-[#8B5CF6]">’26</span>
            </h1>
            <p className="mt-4 text-xl sm:text-3xl font-heading font-black uppercase text-[#E8DCC4] tracking-tight">
              BUILD THE <span className="text-[#8B5CF6]">FUTURE</span> WITH ARTIFICIAL INTELLIGENCE.
            </p>
          </div>

          {/* Dual-Tone Layout: Image on Left + Sand Beige Content Card on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
            {/* Left: Atmospheric Image Container */}
            <div className="lg:col-span-7 card-forest p-3 sm:p-4 overflow-hidden flex flex-col justify-between group relative shadow-2xl">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] bg-[#142B20]">
                <img
                  src="/images/event3.webp"
                  alt="AISC Campus Session"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#142B20] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-[#E8DCC4] bg-[#142B20]/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#E8DCC4]/15">
                  <span className="flex items-center gap-2 font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                    RCPET'S IMRD • SHIRPUR, MH
                  </span>
                  <span className="text-[#C9BDA7] uppercase text-[10px] tracking-wider hidden sm:inline">IN-PERSON & HYBRID</span>
                </div>
              </div>
            </div>

            {/* Right: Premium Sand Beige Information Card */}
            <div className="lg:col-span-5 card-beige p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-2xl border-[#1F3D2B]/15">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
                  <Sparkles size={14} /> PREMIER STUDENT AI ECOSYSTEM
                </div>

                <h2 className="text-2xl sm:text-4xl font-display font-black text-[#1F3D2B] uppercase tracking-tight leading-snug">
                  Uniting student developers, autonomous agents, and production code.
                </h2>

                <p className="text-[#526457] text-sm sm:text-base font-body leading-relaxed">
                  A student-driven community exploring artificial intelligence, machine learning, research, innovation, and production software. From foundational machine learning theory to high-speed 6-hour hackathons and published research leagues.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#1F3D2B]/10">
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="btn-primary w-full py-3.5 sm:py-4 text-xs sm:text-sm font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_24px_rgba(139,92,246,0.35)]"
                >
                  <span>GET PASSES</span>
                  <ArrowUpRight size={16} />
                </button>

                <Link
                  to="/sessions"
                  className="btn-secondary-beige w-full py-3 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-[#1F3D2B]"
                >
                  <span>EXPLORE SESSIONS</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          2. PHILOSOPHY & ABOUT — FULL-WIDTH SAND BEIGE (#E8DCC4)
          Creates strong contrast against the hero section
      ════════════════════════════════════════════════════════════ */}
      <section className="w-full section-beige py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#1F3D2B]/10">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1F3D2B]/15 pb-6">
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                <Layers size={14} /> PHILOSOPHY / 01
              </span>
              <h2 className="text-4xl sm:text-6xl font-display font-black text-[#1F3D2B] uppercase tracking-tight leading-none">
                WE ARE BUILDING AN <span className="text-[#8B5CF6]">AI-FIRST</span> STUDENT COLLECTIVE.
              </h2>
            </div>
            <div className="space-y-2 max-w-sm">
              <p className="text-sm font-body text-[#526457] leading-relaxed">
                A serious launchpad for MCA and IMCA students exploring machine learning, Vibe Coding, autonomous pipelines, and production systems.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#8B5CF6] hover:text-[#7040D5] uppercase tracking-wider"
              >
                <span>Read Full Chapter Story</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* 5 Pillars in Sand Beige Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CORE_PRINCIPLES.map((principle) => (
              <div
                key={principle.number}
                className="card-beige p-6 sm:p-7 flex flex-col justify-between space-y-6 group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1F3D2B]/10 pb-3">
                    <span className="font-mono text-2xl font-black text-[#8B5CF6]">
                      {principle.number}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1F3D2B]/5 text-[#526457]">
                      Pillar
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xl text-[#1F3D2B] uppercase tracking-tight">
                      {principle.title}
                    </h3>
                    <p className="font-mono text-xs text-[#8B5CF6] font-bold mt-1">
                      {principle.subtitle}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm font-body text-[#526457] leading-relaxed">
                    {principle.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1F3D2B]/10 flex items-center justify-between font-mono text-[11px] text-[#526457] font-semibold group-hover:text-[#8B5CF6] transition-colors">
                  <span>AISC ECOSYSTEM</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          3. ACTIVITIES & INITIATIVES — FULL-WIDTH FOREST GREEN (#1F3D2B)
      ════════════════════════════════════════════════════════════ */}
      <section className="w-full section-forest py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E8DCC4]/15">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#8B5CF6]">
              INITIATIVES / 02
            </span>
            <h2 className="text-4xl sm:text-6xl font-display font-black text-[#E8DCC4] uppercase tracking-tight">
              CHAPTER <span className="text-[#8B5CF6]">TRACKS</span>
            </h2>
            <p className="text-sm sm:text-base font-body text-[#C9BDA7]">
              Hands-on machine learning masterclasses, timed build sprints, and student research pods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {INITIATIVES.map((initiative, idx) => {
              const icons = [BrainCircuit, Terminal, Microscope, Cpu, Globe2, Users2];
              const IconComp = icons[idx % icons.length];

              return (
                <div
                  key={initiative.title}
                  className="card-forest p-7 sm:p-8 flex flex-col justify-between space-y-6 group hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E8DCC4]/15 pb-4">
                      <div className="p-3 rounded-xl bg-[#142B20] text-[#8B5CF6] border border-[#E8DCC4]/15 group-hover:border-[#8B5CF6] transition-colors">
                        <IconComp size={22} />
                      </div>
                      <span className="font-mono text-xs font-bold text-[#C9BDA7]">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-extrabold text-[#E8DCC4] group-hover:text-white transition-colors">
                      {initiative.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-body text-[#C9BDA7] leading-relaxed">
                      {initiative.description}
                    </p>

                    <div className="pt-2 space-y-1.5">
                      {initiative.features.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-xs font-mono text-[#E8DCC4]">
                          <CheckCircle2 size={13} className="text-[#8B5CF6] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8DCC4]/15 flex items-center justify-between font-mono text-xs text-[#8B5CF6] font-bold group-hover:text-[#A78BFA] transition-colors">
                    <span>EXPLORE TRACK</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          4. MEASURABLE IMPACT & STATS — FULL-WIDTH SAND BEIGE (#E8DCC4)
          Bright beige backdrop with green headings & purple stat counters
      ════════════════════════════════════════════════════════════ */}
      <section className="w-full section-beige py-20 px-4 sm:px-6 lg:px-8 border-b border-[#1F3D2B]/10">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#8B5CF6]">
              BENCHMARKS / 03
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-[#1F3D2B] uppercase tracking-tight">
              MEASURABLE <span className="text-[#8B5CF6]">COMMUNITY IMPACT</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {CHAPTER_STATS.map((stat, idx) => (
              <div
                key={idx}
                className="card-beige p-6 sm:p-8 text-center space-y-2 shadow-lg border-[#1F3D2B]/15"
              >
                <StatCounter value={stat.value} suffix={stat.suffix} isLight={true} />
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#1F3D2B] uppercase tracking-wide">
                  {stat.label}
                </h3>
                <p className="text-xs font-mono text-[#526457]">
                  {stat.subtext}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          5. FEATURED EVENTS — FULL-WIDTH FOREST GREEN (#1F3D2B)
      ════════════════════════════════════════════════════════════ */}
      <section className="w-full section-forest py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E8DCC4]/15">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8DCC4]/15 pb-6">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#8B5CF6]">
                SPRINTS & TOURNAMENTS / 04
              </span>
              <h2 className="text-4xl sm:text-6xl font-display font-black text-[#E8DCC4] uppercase tracking-tight">
                FEATURED <span className="text-[#8B5CF6]">EVENTS</span>
              </h2>
            </div>
            <Link
              to="/events"
              className="font-mono text-xs font-bold text-[#8B5CF6] hover:text-[#A78BFA] flex items-center gap-1 uppercase tracking-wider"
            >
              <span>View All Events</span> <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {EVENTS.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="card-forest overflow-hidden flex flex-col justify-between group shadow-xl"
                >
                  {/* Event Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#142B20] border-b border-[#E8DCC4]/15">
                    <img
                      src={event.image || '/images/event1.jpg'}
                      alt={event.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/event1.jpg';
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 px-3.5 py-1 rounded-full bg-[#8B5CF6] text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                      {event.category}
                    </div>
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#142B20]/90 backdrop-blur-md border border-[#E8DCC4]/30 text-[#E8DCC4] font-mono text-[10px] font-bold uppercase tracking-wider">
                      {event.status}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 text-xs font-mono text-[#E8DCC4]/80">
                        <span className="flex items-center gap-1.5 text-[#E8DCC4]">
                          <Calendar size={13} className="text-[#8B5CF6]" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1.5 text-[#C9BDA7]">
                          <MapPin size={13} className="text-[#8B5CF6]" />
                          {event.location.split(',')[0]}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#E8DCC4] leading-snug group-hover:text-white transition-colors">
                        {event.title}
                      </h3>

                      <p className="text-sm font-body text-[#C9BDA7] line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E8DCC4]/15 flex items-center justify-between gap-3">
                      {event.hasDetailedReport ? (
                        <Link
                          to="/events/ai-research-league-2"
                          className="btn-primary py-2.5 px-5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_18px_rgba(139,92,246,0.35)]"
                        >
                          <Trophy size={14} />
                          <span>Official Report & Winners</span>
                          <ArrowUpRight size={14} />
                        </Link>
                      ) : (
                        <Link
                          to="/events"
                          className="btn-secondary py-2.5 px-5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
                        >
                          <span>Event Details</span>
                          <ArrowRight size={14} />
                        </Link>
                      )}

                      {event.participantsCount && (
                        <span className="text-xs font-mono text-[#E8DCC4]/90 bg-[#142B20] px-3 py-1 rounded-lg border border-[#E8DCC4]/15 shrink-0">
                          <strong className="text-[#8B5CF6] font-bold">{event.participantsCount}</strong> Builders
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          6. TEAM & FACULTY SHOWCASE — FULL-WIDTH SAND BEIGE (#E8DCC4)
      ════════════════════════════════════════════════════════════ */}
      <section className="w-full section-beige py-20 px-4 sm:px-6 lg:px-8 border-b border-[#1F3D2B]/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1F3D2B]/15 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#8B5CF6]">
                EXECUTIVE COUNCIL / 05
              </span>
              <h2 className="text-4xl sm:text-6xl font-display font-black text-[#1F3D2B] uppercase tracking-tight">
                CHAPTER <span className="text-[#8B5CF6]">LEADERSHIP</span>
              </h2>
            </div>
            <Link
              to="/team"
              className="font-mono text-xs font-bold text-[#8B5CF6] hover:text-[#7040D5] flex items-center gap-1 uppercase tracking-wider"
            >
              <span>View Full Team Directory</span> <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch">
            {TEAM_POSITION_HOLDERS.slice(0, 8).map((leader) => (
              <div
                key={leader.id}
                className="card-beige group overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#E8DCC4] border-b border-[#1F3D2B]/10 relative">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-[#1F3D2B]/90 backdrop-blur-sm text-[#E8DCC4] font-mono text-[10px] font-bold uppercase tracking-wider rounded-lg border border-[#E8DCC4]/20">
                    {leader.classCategory}
                  </div>
                </div>

                <div className="p-4 sm:p-5 font-mono text-xs flex flex-col space-y-1.5 flex-1 justify-between bg-white/70">
                  <div>
                    <h3 className="font-display font-bold text-[#1F3D2B] text-base uppercase tracking-tight leading-snug">
                      {leader.name}
                    </h3>
                    <p className="text-[#8B5CF6] font-bold text-[11px] uppercase tracking-wider">
                      {leader.role}, AISC
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          7. MOMENTS & MEMORIES — FULL-WIDTH FOREST GREEN (#1F3D2B)
      ════════════════════════════════════════════════════════════ */}
      <section className="w-full section-forest py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E8DCC4]/15">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex items-center justify-between border-b border-[#E8DCC4]/15 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#8B5CF6]">
                CAMPUS HIGHLIGHTS / 06
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-[#E8DCC4] uppercase tracking-tight">
                MOMENTS & <span className="text-[#8B5CF6]">MEMORIES</span>
              </h2>
            </div>
            <Link
              to="/gallery"
              className="font-mono text-xs font-bold text-[#8B5CF6] hover:text-[#A78BFA] flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Explore Full Gallery</span> <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card-forest overflow-hidden group aspect-[4/3] relative">
              <img
                src="/images/event1.jpg"
                alt="AISC Event 1"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#142B20]/90 via-transparent to-transparent flex items-end p-5">
                <span className="font-mono text-xs text-[#E8DCC4] font-bold">Code Carnival Hackathon</span>
              </div>
            </div>
            <div className="card-forest overflow-hidden group aspect-[4/3] relative">
              <img
                src="/images/event2.webp"
                alt="AISC Event 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#142B20]/90 via-transparent to-transparent flex items-end p-5">
                <span className="font-mono text-xs text-[#E8DCC4] font-bold">AI Research League 2.0</span>
              </div>
            </div>
            <div className="card-forest overflow-hidden group aspect-[4/3] relative">
              <img
                src="/images/event3.webp"
                alt="AISC Event 3"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#142B20]/90 via-transparent to-transparent flex items-end p-5">
                <span className="font-mono text-xs text-[#E8DCC4] font-bold">Hands-On Learning Labs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          8. FINAL CALL TO ACTION — FULL-WIDTH SAND BEIGE (#E8DCC4)
          Gives the bottom of the page a bright, welcoming finish before the dark footer
      ════════════════════════════════════════════════════════════ */}
      <section className="w-full section-beige py-24 px-4 sm:px-6 lg:px-8 border-b border-[#1F3D2B]/10">
        <div className="max-w-5xl mx-auto card-beige p-10 sm:p-20 text-center space-y-6 relative overflow-hidden shadow-2xl border-[#1F3D2B]/15">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1F3D2B] text-[#E8DCC4] text-xs font-mono font-bold uppercase tracking-wider">
            <span>OCTOBER 2026 / SHIRPUR</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-[#1F3D2B] uppercase tracking-tight leading-tight">
            YOUR NEXT IDEA <span className="text-[#8B5CF6]">STARTS HERE.</span>
          </h2>

          <p className="text-[#526457] text-base sm:text-lg font-body max-w-2xl mx-auto leading-relaxed">
            Join hundreds of student builders, researchers, and developers exploring artificial intelligence and shipping real software at RCPIMRD.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="btn-primary px-8 py-4 text-sm sm:text-base font-heading font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_28px_rgba(139,92,246,0.45)] cursor-pointer"
            >
              <span>GET PASSES / JOIN CHAPTER</span>
              <ArrowUpRight size={18} />
            </button>
            <Link
              to="/events"
              className="btn-secondary-beige px-8 py-4 text-sm sm:text-base font-mono font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <span>EXPLORE EVENTS</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <JoinModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
      {registeringEvent && (
        <EventRegistrationModal
          event={registeringEvent}
          onClose={() => setRegisteringEvent(null)}
        />
      )}
    </div>
  );
};

export default Home;

import React, { useState } from 'react';
import {
  ArrowUpRight,
  BrainCircuit,
  Code2,
  Zap,
  Users,
  GraduationCap,
  Microscope,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import JoinModal from '../components/JoinModal';
import {
  CHAPTER_INFO,
  HERO_CONTENT,
  CORE_PRINCIPLES,
  CHAPTER_STATS,
  INITIATIVES,
  TEAM_POSITION_HOLDERS,
  FACULTY_ADVISORS,
} from '../data/chapterData';

<<<<<<< Updated upstream
const Home = () => {
  const signals = ['AI labs', 'Hackathons', 'Build nights', 'Real community', 'Future-ready skills'];

  const homeSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AI Student Chapters",
      "alternateName": [
        "aistudentchapter",
        "aistudentchapter.vercel.app",
        "imrdaisc",
        "imrdaisc.vercel.app",
        "AI Student Chapters",
        "ai student chapters",
        "aistudentchapters",
        "AISC",
        "AISC RCPIMRD",
        "AI Student Chapters RCPIMRD"
      ],
      "url": "https://aistudentchapter.vercel.app/"
    },
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "AI Student Chapters",
      "alternateName": "AISC RCPIMRD",
      "url": "https://aistudentchapter.vercel.app/",
      "logo": "https://aistudentchapter.vercel.app/images/club-logo.png",
      "description": "Student-led innovation community at RCPET's IMRD, Shirpur focused on Artificial Intelligence, machine learning, and collaborative hackathons.",
      "parentOrganization": {
        "@type": "CollegeOrUniversity",
        "name": "RCPET's Institute of Management Research and Development (IMRD)",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Shirpur",
          "addressRegion": "Maharashtra",
          "addressCountry": "IN"
        }
      },
      "sameAs": [
        "https://www.instagram.com/ai.student_chapters/",
        "https://chat.whatsapp.com/IfBOfK4bE7l1D0N5C9KXYv"
      ]
    }
  ];

  return <div className="new-home">
    <SEO 
      title="AI Student Chapters | RCPIMRD – Learn, Build & Ship with AI" 
      description="Official website of AI Student Chapters at RCPIMRD. A student-led space to explore Artificial Intelligence, participate in hackathons, and build real-world AI projects."
      url="https://aistudentchapter.vercel.app/"
      schema={homeSchemas}
    />
    <section className="home-hero"><div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" /><div className="hero-noise" />
      <div className="home-shell home-hero-grid">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="eyebrow"><span /> RCPIMRD / STUDENT COLLECTIVE</div><h1>Make a dent in<br /><em>what's next.</em></h1>
          <p className="hero-copy">AI Student Chapters is the room for curious people who would rather build the future than wait for it.</p>
          <div className="hero-actions"><a className="solid-action" href="https://chat.whatsapp.com/IfBOfK4bE7l1D0N5C9KXYv" target="_blank" rel="noreferrer">Join the chapter <ArrowUpRight size={18} /></a><Link className="text-action" to="/events">See what we're making <ArrowUpRight size={17} /></Link></div>
        </motion.div>
        <motion.div className="hero-art" initial={{ opacity: 0, scale: 0.9, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.7, delay: 0.12 }}>
          <div className="art-corner art-corner-top">EST. 2025</div><img src="/images/club-logo.webp" alt="AI Student Chapters" /><div className="art-sphere"><BrainCircuit size={42} /></div><div className="art-caption"><span>01</span> IMAGINE<br />+ IMPLEMENT</div><div className="art-corner art-corner-bottom">AI / RCPIMRD</div>
        </motion.div>
      </div>
    </section>
    <div className="signal-strip" aria-label="What we do"><div className="signal-track">{[...signals, ...signals].map((signal, i) => <span key={i}><i /> {signal}</span>)}</div></div>
    <section className="home-shell home-intro"><div className="section-label">THE CHAPTER / 01</div><div><p className="intro-lede">Not another college club. <span>A launchpad for students who are serious about ideas.</span></p><Link className="underlined-link" to="/about">Meet the chapter <ArrowUpRight size={17} /></Link></div></section>
    <section className="home-shell feature-grid"><Link to="/events" className="feature-main"><div className="feature-topline"><span>FLAGSHIP FORMAT</span><ArrowUpRight size={22} /></div><div className="code-lines"><b>&lt;/&gt;</b><i /><i /><i /></div><div><p className="feature-kicker">CODE CARNIVAL</p><h2>Pressure. People.<br />Possibilities.</h2><p>Our high-energy AI hackathon where small teams turn rough ideas into working prototypes.</p></div></Link><div className="feature-side"><Link to="/sessions" className="mini-feature mini-feature-blue"><CalendarDays size={28} /><div><span>LEARN</span><h3>Sessions that<br />get practical.</h3></div><ArrowUpRight className="mini-arrow" size={20} /></Link><Link to="/team" className="mini-feature mini-feature-lime"><Users size={28} /><div><span>PEOPLE</span><h3>Find your<br />build circle.</h3></div><ArrowUpRight className="mini-arrow" size={20} /></Link></div></section>
    <section className="home-shell stats-row"><div><strong>30<span>+</span></strong><p>Curious builders</p></div><div><strong>5<span>+</span></strong><p>Experiences shipped</p></div><div><strong>01</strong><p>Shared obsession:<br />what AI makes possible</p></div></section>
    <section className="home-shell open-call"><div className="open-call-mark"><Sparkles size={36} /></div><div><div className="section-label">OPEN INVITATION / 02</div><h2>Bring your curiosity.<br /><em>We’ll bring the momentum.</em></h2></div><div className="open-call-end"><p>No prior experience required. Just show up ready to experiment, collaborate, and make something real.</p><Link to="/faq" className="solid-action">Start here <ArrowUpRight size={18} /></Link></div></section>
    <section className="home-shell home-footer-note"><Code2 size={17} /><span>Built by students, for students</span><MessagesSquare size={17} /><Link to="/gallery">See the moments</Link><Trophy size={17} /></section>
  </div>;
=======
export const Home: React.FC = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const homeSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: CHAPTER_INFO.name,
      alternateName: [CHAPTER_INFO.shortName, 'AISC RCPIMRD'],
      url: 'https://aistudentchapter.vercel.app/',
    },
  ];

  return (
    <div className="relative text-[#0a0a0a] overflow-hidden bg-[#ecefe9]">
      <SEO
        title={`${CHAPTER_INFO.name} | RCPIMRD – Build, Learn & Innovate with AI`}
        description={HERO_CONTENT.description}
        url="https://aistudentchapter.vercel.app/"
        schema={homeSchemas}
      />

      {/* ════════════════════════════════════════════════════════════
          HERO SECTION (GITHUB UNIVERSE '26 LIGHT EDITORIAL STYLE)
      ════════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#cdd6cd] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="border-b border-[#cdd6cd] pb-6">
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-extrabold tracking-tighter uppercase text-[#0a0a0a] leading-none">
              AISC <span className="text-[#008736]">’26</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
            <div className="lg:col-span-7 grid-box p-3 relative overflow-hidden group">
              <img
                src="/images/event1.jpg"
                alt="AI Student Chapter Event"
                className="w-full h-full min-h-[320px] max-h-[460px] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-[#ffffff]/90 backdrop-blur-md p-4 border border-[#cdd6cd] flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#0a0a0a]">RCPET'S IMRD • SHIRPUR, MH</span>
                <span className="text-[#008736] font-bold">IN-PERSON & HYBRID</span>
              </div>
            </div>

            <div className="lg:col-span-5 grid-box p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-mono font-bold text-[#008736] uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#008736] animate-ping" />
                  {HERO_CONTENT.badge}
                </div>

                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0a0a0a] leading-tight">
                  {HERO_CONTENT.headlineSecond}
                </h2>

                <p className="text-sm font-body text-[#4e554e] leading-relaxed">
                  {HERO_CONTENT.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#cdd6cd] space-y-3">
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="btn-green w-full py-4 px-6 text-sm sm:text-base font-heading font-bold uppercase tracking-wider flex items-center justify-between shadow-md"
                >
                  <span>{HERO_CONTENT.primaryCTA}</span>
                  <ArrowUpRight size={20} />
                </button>

                <Link
                  to="/events"
                  className="w-full py-3.5 px-6 grid-box font-mono font-bold text-xs uppercase tracking-wider text-[#0a0a0a] hover:bg-[#e2e7e2] transition-colors flex items-center justify-between"
                >
                  <span>{HERO_CONTENT.secondaryCTA}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDITORIAL ABOUT & 5 CORE PRINCIPLES */}
      <section className="border-b border-[#cdd6cd] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-8 space-y-2">
            <span className="font-mono text-xs text-[#008736] uppercase tracking-widest font-bold">
              PHILOSOPHY / 01
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-[#0a0a0a] leading-tight">
              WE ARE BUILDING AN <span className="text-[#008736]">AI-FIRST</span> STUDENT COLLECTIVE.
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-[#4e554e] text-sm font-body leading-relaxed mb-3">
              A serious launchpad for students exploring machine learning, Vibe Coding, and production systems.
            </p>
            <Link
              to="/about"
              className="font-mono text-xs font-bold text-[#008736] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              Read Full Chapter Story <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_PRINCIPLES.map((principle) => (
            <div
              key={principle.number}
              className="grid-box grid-box-hover p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#cdd6cd] pb-3">
                  <span className="font-mono text-3xl font-black text-[#0a0a0a]">
                    {principle.number}
                  </span>
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-[#e2e7e2] text-[#0a0a0a]">
                    PILLAR
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-[#0a0a0a]">
                    {principle.title}
                  </h3>
                  <p className="text-xs font-mono font-semibold text-[#008736] mt-0.5">{principle.subtitle}</p>
                </div>
                <p className="text-[#4e554e] text-sm font-body leading-relaxed">
                  {principle.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#cdd6cd] flex items-center justify-between text-xs font-mono font-bold text-[#0a0a0a]">
                <span>AISC ECOSYSTEM</span>
                <ArrowRight size={16} className="text-[#008736]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CHAPTER STATISTICS */}
      <section className="border-b border-[#cdd6cd] bg-[#f4f6f2] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {CHAPTER_STATS.map((stat, i) => (
              <div key={i} className="grid-box p-6 space-y-2">
                <div className="text-4xl sm:text-5xl font-display font-black text-[#0a0a0a]">
                  {stat.value}<span className="text-[#008736]">{stat.suffix}</span>
                </div>
                <div className="font-heading font-bold text-sm text-[#0a0a0a] uppercase tracking-wider">{stat.label}</div>
                <p className="text-xs text-[#525852] font-body max-w-[200px] mx-auto leading-tight">
                  {stat.subtext}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAJOR INITIATIVES */}
      <section className="border-b border-[#cdd6cd] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="font-mono text-xs text-[#008736] uppercase tracking-widest font-bold">
            INITIATIVES / 02
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-[#0a0a0a]">
            CHAPTER <span className="text-[#008736]">TRACKS</span>
          </h2>
          <p className="text-[#4e554e] text-base font-body">
            Hands-on machine learning masterclasses, timed build sprints, and student research pods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIATIVES.map((init) => {
            const IconComponent =
              init.icon === 'BrainCircuit'
                ? BrainCircuit
                : init.icon === 'Code2'
                ? Code2
                : init.icon === 'Microscope'
                ? Microscope
                : init.icon === 'Zap'
                ? Zap
                : init.icon === 'GraduationCap'
                ? GraduationCap
                : Users;

            return (
              <div
                key={init.id}
                className="grid-box grid-box-hover p-8 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#cdd6cd] pb-3">
                    <div className="p-3 bg-[#e2e7e2] text-[#008736]">
                      <IconComponent size={24} />
                    </div>
                    <span className="font-mono text-xs text-slate-500 font-bold">{init.number}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-bold text-[#0a0a0a]">
                      {init.title}
                    </h3>
                    <p className="text-[#4e554e] text-sm font-body mt-2 leading-relaxed">
                      {init.description}
                    </p>
                  </div>

                  <ul className="space-y-1.5 pt-2 border-t border-[#cdd6cd] text-xs font-mono text-[#0a0a0a]">
                    {init.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-[#008736] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-[#cdd6cd] flex items-center justify-between text-xs font-mono font-bold text-[#008736]">
                  <span>EXPLORE TRACK</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CHAPTER LEADERSHIP SECTION */}
      <section className="border-b border-[#cdd6cd] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[#008736] uppercase tracking-widest font-bold">
              EXECUTIVE COUNCIL / 03
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-[#0a0a0a]">
              CHAPTER <span className="text-[#008736]">LEADERSHIP</span>
            </h2>
          </div>
          <Link
            to="/team"
            className="font-mono text-xs font-bold text-[#008736] hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            View Full Team Directory <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_POSITION_HOLDERS.map((leader) => (
            <div
              key={leader.id}
              className="grid-box grid-box-hover group overflow-hidden flex flex-col justify-between border border-[#cdd6cd] bg-[#f7f9f7] hover:border-[#008736]/50 transition-all duration-300"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#e2e7e2] border-b border-[#cdd6cd] relative">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover object-top speaker-card-img transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/75 backdrop-blur-sm text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-sm">
                  {leader.classCategory}
                </div>
              </div>

              <div className="p-4 bg-white font-mono text-xs flex flex-col space-y-1">
                <span className="font-bold text-[#0a0a0a] text-sm uppercase tracking-tight">
                  {leader.name}
                </span>
                <span className="text-[#008736] font-semibold uppercase">
                  {leader.role}, AISC
                </span>
              </div>
            </div>
          ))}

          {FACULTY_ADVISORS.map((advisor, idx) => (
            <div
              key={idx}
              className="grid-box grid-box-hover group overflow-hidden flex flex-col justify-between border border-[#cdd6cd] bg-[#f7f9f7] hover:border-[#008736]/50 transition-all duration-300"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#e2e7e2] border-b border-[#cdd6cd] relative">
                <img
                  src={advisor.image || '/images/event3.webp'}
                  alt={advisor.name}
                  className="w-full h-full object-cover object-top speaker-card-img transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-4 bg-white font-mono text-xs flex flex-col space-y-1">
                <span className="font-bold text-[#0a0a0a] text-sm uppercase tracking-tight">
                  {advisor.name}
                </span>
                <span className="text-[#008736] font-semibold uppercase">
                  {advisor.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* JOIN CTA BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid-box p-10 sm:p-16 text-center space-y-6">
          <span className="font-mono text-xs text-[#008736] uppercase tracking-widest font-bold">
            OCTOBER 2026 / SHIRPUR
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-[#0a0a0a] uppercase tracking-tight leading-tight">
            YOUR NEXT IDEA <span className="text-[#008736]">STARTS HERE.</span>
          </h2>
          <p className="text-[#4e554e] text-base font-body max-w-2xl mx-auto leading-relaxed">
            Join students, researchers, and developers exploring artificial intelligence and building production systems at RCPIMRD.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="btn-green px-8 py-4 text-sm font-heading font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
            >
              <span>GET PASSES / JOIN CHAPTER</span>
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <JoinModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
    </div>
  );
>>>>>>> Stashed changes
};

export default Home;

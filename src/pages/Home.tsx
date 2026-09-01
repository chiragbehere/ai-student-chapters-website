import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Users, CalendarDays, Trophy, BrainCircuit, Code2, MessagesSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import EventRegistrationModal from '../components/EventRegistrationModal';

const Home = () => {
  const signals = ['AI labs', 'Hackathons', 'Build nights', 'Real community', 'Future-ready skills'];
  return <div className="new-home">
    <SEO title="AI Student Chapters" description="A student-led space to learn, build, and ship with AI." />
    <EventRegistrationModal />
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
};
export default Home;

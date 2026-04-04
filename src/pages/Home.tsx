import { motion } from 'framer-motion';
import { ArrowRight, Users, Zap, Rocket, Handshake, Trophy, TrendingUp, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const stats = [
    { label: 'Active Members', value: '30+', icon: <Users size={24} className="text-secondary" /> },
    { label: 'Hackathon', value: '1', icon: <Zap size={24} className="text-primary" /> },
    { label: 'Workshops', value: '5+', icon: <BookOpen size={24} className="text-accent" /> },
  ];

  const highlights = [
    { icon: <Rocket size={24} />, label: 'Innovation', color: 'text-secondary' },
    { icon: <Handshake size={24} />, label: 'Community', color: 'text-primary' },
    { icon: <Trophy size={24} />, label: 'Competitions', color: 'text-accent' },
    { icon: <TrendingUp size={24} />, label: 'Growth', color: 'text-green-400' },
  ];

  const testimonials = [
    {
      text: "Joining AI Student Chapters was the best decision I made in college. The hackathons gave me real project experience that landed my first internship.",
      name: "Chirag Behere",
      batch: "2nd Year • IMCA",
      initial: "C",
      gradient: "from-secondary to-primary",
    },
    {
      text: "The workshops here are on another level — real tools, real projects, and mentors who actually know what they're talking about.",
      name: "Tejas Panchbhai",
      batch: "4th Year • IMCA",
      initial: "T",
      gradient: "from-accent to-primary",
    },
  ];

  const tickerItems = [
    'Hackathons', 'Competitions', 'Workshops', 'AI', 'Code-Carnival',
    'Prompt Engineering', 'Events', 'Training', 'Team Work', 'Vibe Coding'
  ];

  return (
    <div className="w-full relative">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-secondary/20 bg-secondary/5 text-secondary font-medium text-sm tracking-wide"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            RCPIMRD • Est. 2025
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <img
              src="/images/club-logo.png"
              alt="AI Chapters Logo"
              className="w-28 h-28 md:w-40 md:h-40 object-contain"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(0,240,255,0.55)) drop-shadow(0 0 60px rgba(157,0,255,0.35))',
                animation: 'float 5s ease-in-out infinite, glowPulse 3s ease-in-out infinite alternate',
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-xs md:text-sm font-medium tracking-[0.15em] uppercase text-foreground/40 mb-4">Welcome to</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-heading leading-tight mb-6 text-foreground">
              <span className="grad-text">AI Student</span><br />Chapters
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-10 leading-relaxed font-body max-w-2xl mx-auto">
              Innovation-driven student community exploring the frontiers of Artificial Intelligence — through building, competing & growing together.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/events"
                className="bg-gradient-to-r from-secondary via-primary to-accent text-white px-8 py-4 rounded-xl font-bold font-heading transition-all hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:-translate-y-0.5 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Explore Events <ArrowRight size={20} />
              </Link>
              <a
                href="https://chat.whatsapp.com/IfBOfK4bE7l1D0N5C9KXYv"
                target="_blank"
                rel="noreferrer"
                className="border border-white/20 text-white px-8 py-4 rounded-xl font-medium font-heading transition-all hover:bg-white/5 hover:-translate-y-0.5 w-full sm:w-auto justify-center text-center"
              >
                Join Network
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="py-4 border-y border-border bg-background/50 overflow-hidden relative z-10 w-full">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex whitespace-nowrap gap-10 items-center" style={{ animation: 'tickerScroll 25s linear infinite' }}>
          {[1, 2].map((set) => (
            <div key={set} className="flex gap-10 items-center font-heading font-bold text-foreground/30 uppercase tracking-widest text-lg">
              {tickerItems.map((item, i) => (
                <span key={`${set}-${i}`} className="flex items-center gap-10">
                  <span>{item}</span>
                  <span className="text-secondary/30 text-sm">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Featured Event Banner */}
      <section className="py-12 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden border-green-500/20"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-400 via-secondary to-primary" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-bold tracking-wider uppercase mb-4">
              ✅ Event Completed
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-heading mb-2">Code-Carnival Hackathon</h3>
            <p className="text-foreground/60 text-sm md:text-base mb-4">
              The 6-hour build sprint was a massive success! 33 participants competed across UG & PG categories.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-secondary font-heading font-medium hover:gap-3 transition-all text-sm"
            >
              View Results <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-12 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlights.map((h, idx) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel rounded-2xl p-6 text-center hover:bg-white/5 hover:-translate-y-1 transition-all duration-300 cursor-default group"
              >
                <div className={`${h.color} mb-3 flex justify-center transition-transform duration-300 group-hover:scale-110`} style={{ animation: `float ${4 + idx * 0.5}s ease-in-out infinite alternate` }}>
                  {h.icon}
                </div>
                <span className="text-sm font-semibold text-foreground/80">{h.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats + Featured Card Section */}
      <section className="py-20 relative z-10 border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Big feature card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 glass-panel rounded-2xl p-8 lg:p-12 hover:border-white/20 transition-all flex flex-col justify-end relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary via-primary to-accent opacity-50" />
              <div className="relative z-10 max-w-lg mt-8 pt-8">
                <div className="inline-flex px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider mb-4">
                  Completed
                </div>
                <h3 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">Code Carnival Hackathon</h3>
                <p className="text-foreground/70 font-body mb-6 text-lg">Over 30+ participants executed a 6-hour build sprint. A display of rapid prototyping and technical excellence.</p>
                <Link to="/events" className="font-heading font-medium text-secondary flex items-center gap-2 hover:gap-4 transition-all w-fit">
                  View Results <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-6 rounded-2xl border-l-[3px] flex items-center gap-6 hover:border-white/20 transition-all"
                  style={{ borderLeftColor: idx === 0 ? '#00f0ff' : idx === 1 ? '#ff003c' : '#9d00ff' }}
                >
                  <div className="p-4 bg-background rounded-xl border border-white/5">
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black font-heading mb-1">{stat.value}</h3>
                    <p className="text-xs uppercase tracking-widest text-foreground/50 font-bold">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative z-10 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold tracking-wider uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" style={{ animation: 'pulseDot 1.5s infinite' }} />
              Member Voices
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-heading text-white">What Members Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel rounded-2xl p-8 hover:border-white/20 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary to-primary opacity-0 hover:opacity-100 transition-opacity" />
                <div className="relative pl-5 mb-6">
                  <span className="absolute left-0 top-0 text-3xl text-secondary font-heading leading-none">"</span>
                  <p className="text-foreground/70 font-body italic leading-relaxed">{t.text}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm text-white">{t.name}</div>
                    <div className="text-xs text-foreground/40">{t.batch}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(157,0,255,0.18), rgba(255,0,60,0.12))',
              border: '1px solid rgba(157,0,255,0.25)',
              boxShadow: '0 0 60px rgba(157,0,255,0.2)',
            }}
          >
            <div className="absolute top-[-40%] left-[-20%] w-[140%] h-[180%] bg-[radial-gradient(ellipse,rgba(157,0,255,0.1)_0%,transparent_65%)] pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold tracking-wider uppercase mb-6">
                🏆 Results Out
              </div>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-white mb-4">Code-Carnival Complete! 🎉</h2>
              <p className="text-foreground/60 font-body mb-8 max-w-lg mx-auto">
                The hackathon was a huge success! Check out the winners and their amazing projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/events" className="bg-gradient-to-r from-secondary via-primary to-accent text-white px-8 py-4 rounded-xl font-bold font-heading transition-all hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:-translate-y-0.5">
                  View Results
                </Link>
                <Link to="/about" className="border border-white/20 text-white px-8 py-4 rounded-xl font-medium font-heading transition-all hover:bg-white/5 hover:-translate-y-0.5">
                  View Workshops
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

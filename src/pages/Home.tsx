import { motion } from 'framer-motion';
import { ArrowRight, Users, Zap, Rocket, Trophy, Calendar, Info, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const tickerItems = [
    '🔥 Hackathons', '🤖 AI', '⚡ Code-Carnival', '🧠 Prompt Engineering',
    '🎯 Events', '💻 Workshops', '🤝 Team Work', '✨ Vibe Coding', '🚀 Innovation'
  ];

  return (
    <div className="w-full relative min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="pill bg-primary/10 text-primary border border-primary/20 mb-8 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            RCPIMRD • Est. 2025
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="flex justify-center mb-6"
          >
            <img
              src="/images/club-logo.png"
              alt="AI Chapters Logo"
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
              style={{
                filter: 'drop-shadow(0 0 25px rgba(168,85,247,0.45)) drop-shadow(0 0 50px rgba(56,189,248,0.25))',
                animation: 'float 5s ease-in-out infinite, glowPulse 3s ease-in-out infinite alternate',
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-black font-heading leading-[1.1] mb-4 text-white">
              <span className="grad-text">AI Student</span><br />Chapters
            </h1>
            <p className="text-base md:text-lg text-foreground/60 mb-8 leading-relaxed font-body max-w-xl mx-auto">
              The coolest student community exploring AI — we learn, we build, we compete, and we grow together 💜
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="https://chat.whatsapp.com/IfBOfK4bE7l1D0N5C9KXYv"
                target="_blank"
                rel="noreferrer"
                className="genz-btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Join us on WhatsApp 🚀
              </a>
              <Link
                to="/sessions"
                className="genz-btn-outline w-full sm:w-auto"
              >
                View Sessions →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="py-3 border-y border-white/[0.04] bg-card/30 overflow-hidden relative z-10 w-full mb-12">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex whitespace-nowrap gap-8 items-center" style={{ animation: 'tickerScroll 30s linear infinite' }}>
          {[1, 2].map((set) => (
            <div key={set} className="flex gap-8 items-center font-heading font-semibold text-foreground/25 text-sm">
              {tickerItems.map((item, i) => (
                <span key={`${set}-${i}`} className="hover:text-foreground/50 transition-colors cursor-default">
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bento Grid Architecture */}
      <section className="relative z-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          
          {/* Main Hero Card — Code Carnival (Spans 2x2) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 glass-panel p-8 relative overflow-hidden group card-hover flex flex-col justify-end"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-6 right-6 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none">
              <Zap size={120} className="text-primary" />
            </div>
            <div className="relative z-10">
              <div className="pill bg-lime/10 text-lime border border-lime/20 w-fit mb-4">
                ✅ Completed
              </div>
              <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tight mb-2 text-white">Code-Carnival</h2>
              <p className="text-foreground/50 text-sm mb-6 max-w-sm">
                33+ builders competed in our flagship 6-hour AI hackathon sprint. It was epic! 🔥
              </p>
              <Link to="/events" className="genz-btn bg-white text-background text-sm px-5 py-2.5 flex items-center gap-2 w-fit hover:bg-primary hover:text-white">
                See Winners <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Stat: Members */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 flex flex-col justify-center relative overflow-hidden card-hover"
          >
            <div className="absolute top-3 right-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users size={16} className="text-primary" />
              </div>
            </div>
            <h3 className="text-5xl font-black font-heading text-white">30<span className="text-primary">+</span></h3>
            <p className="text-xs text-foreground/40 font-semibold mt-1.5 uppercase tracking-wider">Active Members</p>
          </motion.div>

          {/* Quick Link: Workshops */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
            <Link to="/sessions" className="glass-panel h-full p-6 flex flex-col justify-between group card-hover block">
              <div className="flex justify-between items-start w-full">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Calendar size={20} className="text-accent" />
                </div>
                <ArrowRight size={18} className="text-foreground/30 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white group-hover:text-accent transition-colors">Workshops 🎓</h3>
                <p className="text-xs text-foreground/40 mt-1">Learn something new today</p>
              </div>
            </Link>
          </motion.div>

          {/* Innovation Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-panel p-6 relative overflow-hidden group card-hover bg-gradient-to-br from-card to-muted"
          >
             <div className="absolute right-[-5%] top-[-15%] opacity-[0.06] group-hover:rotate-6 transition-transform duration-700 pointer-events-none">
               <Rocket size={140} />
             </div>
             <div className="h-full flex flex-col justify-center relative z-10">
               <div className="flex items-center gap-2 mb-2">
                 <Star size={18} className="text-accent" />
                 <span className="text-xs text-foreground/40 font-semibold uppercase tracking-wider">What we do</span>
               </div>
               <h3 className="text-xl font-bold font-heading mb-1.5 text-white">We Build Cool Stuff 🛠️</h3>
               <p className="text-sm text-foreground/50">From prompt engineering to full-stack AI apps — if it's innovative, we're building it.</p>
             </div>
          </motion.div>

          {/* Quick Link: FAQ */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-1 h-full"
          >
            <Link to="/faq" className="glass-panel h-full p-6 flex flex-col justify-between group card-hover block">
              <div className="flex justify-between items-start w-full">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Info size={20} className="text-secondary" />
                </div>
                <ArrowRight size={18} className="text-foreground/30 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white group-hover:text-secondary transition-colors">FAQ 💬</h3>
                <p className="text-xs text-foreground/40 mt-1">Got q's? We got a's</p>
              </div>
            </Link>
          </motion.div>

           {/* Stat: Events */}
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-6 flex flex-col justify-center relative overflow-hidden card-hover"
          >
            <div className="absolute top-3 right-3">
              <div className="w-8 h-8 rounded-full bg-lime/10 flex items-center justify-center">
                <Trophy size={16} className="text-lime" />
              </div>
            </div>
            <h3 className="text-5xl font-black font-heading text-white">5<span className="text-lime">+</span></h3>
            <p className="text-xs text-foreground/40 font-semibold mt-1.5 uppercase tracking-wider">Events Done</p>
          </motion.div>

        </div>

        {/* Community CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 glass-panel p-8 md:p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart size={18} className="text-coral" />
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Join the community</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black font-heading text-white mb-2">
              Ready to level up? 🚀
            </h2>
            <p className="text-foreground/50 text-sm mb-6 max-w-md mx-auto">
              Join 30+ students who are already building the future with AI. No experience needed — just curiosity!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/events" className="genz-btn-primary">
                Explore Events ✨
              </Link>
              <Link to="/about" className="genz-btn-outline">
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;

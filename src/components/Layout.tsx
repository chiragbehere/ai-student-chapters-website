import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Camera, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home', emoji: '🏠' },
    { path: '/events', label: 'Events', emoji: '🏆' },
    { path: '/gallery', label: 'Gallery', emoji: '📸' },
    { path: '/team', label: 'Team', emoji: '👥' },
    { path: '/sessions', label: 'Sessions', emoji: '🎓' },
    { path: '/faq', label: 'FAQ', emoji: '💬' },
    { path: '/about', label: 'About', emoji: '✨' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-body bg-background text-foreground selection:bg-primary/30 selection:text-white">
      {/* Dynamic Background Layers */}
      <div className="bg-mesh" />
      <div className="bg-orb-accent" />
      <div className="bg-grid" />
      <div className="bg-noise" />

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-background/60 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src="/images/club-logo.png" alt="AI Student Chapters Logo" className="h-9 w-9 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" style={{ filter: 'drop-shadow(0 0 10px rgba(168,85,247,0.4))' }} />
              <span className="font-heading font-bold text-lg tracking-tight">
                <span className="grad-text">AI</span> <span className="text-white/90">Chapters</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-primary/15 text-primary border border-primary/20'
                      : 'text-foreground/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-foreground/80 hover:text-primary transition-all p-2 rounded-xl hover:bg-white/5"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-card/95 backdrop-blur-xl border-t border-white/[0.06] overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2 flex flex-col">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'bg-primary/10 text-primary border border-primary/15'
                        : 'text-foreground/70 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-base">{link.emoji}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06] bg-card/50 backdrop-blur-lg mt-20 overflow-hidden">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <img src="/images/club-logo.png" alt="Logo" className="h-8 w-8 opacity-80" style={{ filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.3))' }} />
                <h2 className="font-heading font-bold text-lg">
                  <span className="grad-text">AI Student Chapters</span>
                </h2>
              </div>
              <p className="text-foreground/40 text-sm leading-relaxed max-w-xs">
                Where curiosity meets code. Built for students who want to shape the future with AI. ✨
              </p>
            </div>

            {/* Links */}
            <div className="space-y-3">
              <h3 className="text-white/80 font-heading font-semibold text-sm">
                Quick Links
              </h3>
              <div className="flex flex-wrap gap-2">
                {links.map((link) => (
                  <Link key={link.path} to={link.path} className="px-3 py-1.5 rounded-full bg-white/[0.04] text-foreground/50 text-xs hover:bg-primary/10 hover:text-primary transition-all border border-white/[0.04]">
                    {link.emoji} {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Connect */}
            <div className="space-y-3">
              <h3 className="text-white/80 font-heading font-semibold text-sm">Let's Connect 🤝</h3>
              <a href="mailto:imrdaistudentclub@gmail.com" className="text-foreground/50 hover:text-primary transition-colors text-sm block truncate">
                imrdaistudentclub@gmail.com
              </a>
              <div className="flex items-center gap-2 pt-1">
                <a href="https://www.instagram.com/ai.student_chapters/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-foreground/50 hover:text-accent hover:border-accent/30 hover:bg-accent/10 transition-all duration-300">
                  <Camera size={15} />
                </a>
                <a href="mailto:imrdaistudentclub@gmail.com" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all duration-300">
                  <Mail size={15} />
                </a>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-3 text-foreground/25 text-xs">
            <p>© {new Date().getFullYear()} AI Student Chapters, RCPIMRD</p>
            <p className="flex items-center gap-1.5">made with 💜 by students</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

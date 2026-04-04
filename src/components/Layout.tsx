import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Camera, Mail, Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/team', label: 'Team' },
    { path: '/about', label: 'About' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-body bg-background text-foreground selection:bg-primary/30 selection:text-white">
      {/* Dynamic Background Layers */}
      <div className="bg-mesh" />
      <div className="bg-orb-accent" />
      <div className="bg-grid" />
      <div className="bg-noise" />

      {/* Navbar */}
      <nav className="fixed w-full z-50 glass-panel border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/images/club-logo.png" alt="AI Student Chapters Logo" className="h-10 w-10 transition-transform duration-500 group-hover:scale-110" style={{ filter: 'drop-shadow(0 0 12px rgba(0,240,255,0.4))' }} />
              <span className="font-bold font-heading text-xl tracking-tight text-white transition-all">
                AI <span className="text-secondary font-medium">Chapters</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-secondary'
                      : 'text-foreground/80 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-foreground hover:text-secondary transition-all"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
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
              className="md:hidden glass-panel border-t border-border overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 rounded-xl text-center font-bold tracking-wide transition-all ${
                      location.pathname === link.path
                        ? 'bg-secondary/10 text-secondary border border-secondary/20'
                        : 'text-foreground/80 border border-transparent hover:bg-white/5'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-border py-16 mt-20 relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/images/club-logo.png" alt="AI Student Chapters Logo" className="h-10 w-10 opacity-80" style={{ filter: 'drop-shadow(0 0 12px rgba(0,240,255,0.4))' }} />
            <h2 className="font-heading font-bold text-2xl">
              <span className="grad-text">AI Student Chapters</span>
            </h2>
          </div>
          <p className="text-foreground/50 text-sm mb-2 font-body">RCPIMRD</p>
          <a href="mailto:imrdaistudentclub@gmail.com" className="text-secondary/80 hover:text-secondary text-sm transition-colors">
            imrdaistudentclub@gmail.com
          </a>

          <p className="text-foreground/60 mt-6 mb-8 font-body max-w-lg mx-auto text-sm">
            Igniting the spark of innovation through Artificial Intelligence. Built for students, by students.
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-8">
            <a href="https://www.instagram.com/ai.student_chapters" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground/60 hover:text-secondary hover:border-secondary/30 hover:bg-secondary/5 transition-all duration-300">
              <Camera size={20} />
            </a>
            <a href="mailto:imrdaistudentclub@gmail.com" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
              <Mail size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground/60 hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all duration-300">
              <Briefcase size={20} />
            </a>
          </div>

          {/* Footer Nav */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {links.map((link) => (
              <Link key={link.path} to={link.path} className="text-foreground/40 hover:text-secondary transition-colors text-sm font-medium uppercase tracking-wider">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 text-foreground/30 text-xs font-body">
            © 2024–{new Date().getFullYear()} AI Student Chapters, RCPIMRD. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

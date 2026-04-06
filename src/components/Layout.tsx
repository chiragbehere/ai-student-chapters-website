import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Camera, Mail, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { path: '/', label: 'Home', emoji: '🏠' },
    { path: '/events', label: 'Events', emoji: '🏆' },
    { path: '/gallery', label: 'Gallery', emoji: '📸' },
    { path: '/team', label: 'Team', emoji: '👥' },
    { path: '/sessions', label: 'Sessions', emoji: '🎓' },
    { path: '/faq', label: 'FAQ', emoji: '💬' },
    { path: '/about', label: 'About', emoji: '✨' },
  ];

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-body bg-background text-foreground transition-colors duration-300 relative">
      <ScrollToTop />
      
      {/* Optimized Background Layers - GPU Accelerated, removed noise to reduce lag */}
      <div className="fixed inset-0 z-[-10] pointer-events-none transform-gpu bg-mesh" />
      <div className="fixed inset-0 z-[-5] pointer-events-none transform-gpu bg-orb-accent" />
      <div className="fixed inset-0 z-[-1] pointer-events-none transform-gpu bg-grid" />

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src="/images/club-logo.webp" alt="AI Student Chapters Logo" className="h-9 w-9 transition-transform duration-300 group-hover:rotate-6" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 10px rgba(168,85,247,0.4))' : 'none' }} />
              <span className="font-heading font-bold text-lg tracking-tight">
                <span className="grad-text">AI</span> <span className="text-heading">Chapters</span>
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
                      : 'text-foreground/60 hover:text-heading hover:bg-foreground/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <button
                onClick={toggleTheme}
                className="ml-2 p-2.5 rounded-full bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors border border-border group"
                aria-label="Toggle Theme"
              >
                <div className="transition-transform duration-300 scale-100 active:scale-95">
                  {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} className="text-amber-500" />}
                </div>
              </button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-foreground/5 text-foreground border border-border"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} className="text-amber-500" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-foreground hover:text-primary transition-all p-2 rounded-xl bg-foreground/5 border border-border"
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
              className="md:hidden bg-card/95 backdrop-blur-xl border-t border-border overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2 flex flex-col">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'bg-primary/10 text-primary border border-primary/15'
                        : 'text-foreground/70 hover:bg-foreground/5 hover:text-heading'
                    }`}
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
      <footer className="relative border-t border-border bg-card/50 backdrop-blur-lg mt-20 overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <img src="/images/club-logo.webp" alt="Logo" className="h-8 w-8 opacity-80" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px rgba(168,85,247,0.3))' : 'none' }} />
                <h2 className="font-heading font-bold text-lg text-heading">
                  <span className="grad-text">AI Student Chapters</span>
                </h2>
              </div>
              <p className="text-foreground/50 text-sm leading-relaxed max-w-xs">
                Where curiosity meets code. Built for students who want to shape the future with AI. ✨
              </p>
            </div>

            {/* Links */}
            <div className="space-y-3">
              <h3 className="text-heading font-heading font-semibold text-sm">
                Quick Links
              </h3>
              <div className="flex flex-wrap gap-2">
                {links.map((link) => (
                  <Link key={link.path} to={link.path} className="px-3 py-1.5 rounded-full bg-foreground/5 text-foreground/60 text-xs hover:bg-primary/10 hover:text-primary transition-all border border-border">
                    {link.emoji} {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Connect */}
            <div className="space-y-3">
              <h3 className="text-heading font-heading font-semibold text-sm">Let's Connect 🤝</h3>
              <a href="mailto:imrdaistudentclub@gmail.com" className="text-foreground/60 hover:text-primary transition-colors text-sm block truncate">
                imrdaistudentclub@gmail.com
              </a>
              <div className="flex items-center gap-2 pt-1">
                <a href="https://www.instagram.com/ai.student_chapters/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-foreground/5 border border-border flex items-center justify-center text-foreground/50 hover:text-accent hover:border-accent/30 hover:bg-accent/10 transition-all duration-300">
                  <Camera size={15} />
                </a>
                <a href="mailto:imrdaistudentclub@gmail.com" className="w-9 h-9 rounded-full bg-foreground/5 border border-border flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all duration-300">
                  <Mail size={15} />
                </a>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 text-foreground/30 text-xs">
            <p>© {new Date().getFullYear()} AI Student Chapters, RCPIMRD</p>
            <p className="flex items-center gap-1.5">made with 💜 by students</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

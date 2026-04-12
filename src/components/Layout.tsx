import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, Camera, Mail, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// Lazy load the heavy Three.js star background
const StarsCanvas = lazy(() => import('./StarBackground'));

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
    <>
      <ScrollToTop />

      {/* ═══ Fixed Background Layers (behind everything) ═══ */}

      {/* Stars Background (dark mode only via CSS) */}
      <Suspense fallback={null}>
        <StarsCanvas />
      </Suspense>

      {/* Blackhole Video Background (dark mode only via CSS, all pages) */}
      <div className="blackhole-video-wrapper" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            transform: 'rotate(180deg)',
            position: 'absolute',
            top: '-340px',
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        >
          <source src="/videos/blackhole.webm" type="video/webm" />
        </video>
      </div>

      {/* Light mode background layers (hidden in dark mode via CSS) */}
      <div className="bg-mesh" style={{ zIndex: 0 }} />
      <div className="bg-orb-accent" style={{ zIndex: 0 }} />
      <div className="bg-grid" style={{ zIndex: 0 }} />

      {/* ═══ Main App Shell ═══ */}
      <div className="min-h-screen flex flex-col font-body text-foreground transition-colors duration-300" style={{ position: 'relative', zIndex: 2 }}>

        {/* ═══════════════ Space Navbar ═══════════════ */}
        <nav className="space-navbar" style={{ zIndex: 50 }}>
          <div className="w-full h-full flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo + Name */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <img 
                src="/images/club-logo.webp" 
                alt="AI Student Chapters Logo" 
                className="h-9 w-9 transition-transform duration-300 group-hover:rotate-6" 
                style={{ 
                  filter: theme === 'dark' 
                    ? 'drop-shadow(0 0 10px rgba(168,85,247,0.4))' 
                    : 'none' 
                }} 
              />
              <span className="font-heading font-bold text-lg tracking-tight hidden sm:inline">
                <span className="grad-text">AI</span>{' '}
                <span className="text-heading">Chapters</span>
              </span>
            </Link>

            {/* Desktop Nav Links in Pill */}
            <div className="hidden lg:flex items-center">
              <div className="space-nav-pill">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`space-nav-link ${
                      location.pathname === link.path ? 'active' : 'text-foreground/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side: Theme toggle + Mobile hamburger */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-foreground/5 text-foreground hover:bg-foreground/10 transition-all duration-300 border border-border/10 group"
                aria-label="Toggle Theme"
              >
                <div className="transition-transform duration-300 scale-100 active:scale-95">
                  {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} className="text-amber-500" />}
                </div>
              </button>

              {/* Mobile Hamburger */}
              <button
                className="lg:hidden text-foreground hover:text-primary transition-all p-2 rounded-xl bg-foreground/5 border border-border/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="lg:hidden absolute top-[65px] left-0 w-full overflow-hidden"
                style={{
                  background: theme === 'dark' ? 'rgba(3,0,20,0.95)' : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                <div className="px-4 py-5 space-y-2 flex flex-col">
                  {links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
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

        {/* Main Content */}
        <main className="flex-grow pt-[65px]">
          {children}
        </main>

        {/* ═══════════════ Space Footer ═══════════════ */}
        <footer className="space-footer">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              
              {/* Brand */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/images/club-logo.webp" 
                    alt="Logo" 
                    className="h-8 w-8 opacity-80" 
                    style={{ 
                      filter: theme === 'dark' 
                        ? 'drop-shadow(0 0 8px rgba(168,85,247,0.3))' 
                        : 'none' 
                    }} 
                  />
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
                    <Link 
                      key={link.path} 
                      to={link.path} 
                      className="px-3 py-1.5 rounded-full bg-foreground/5 text-foreground/60 text-xs hover:bg-primary/10 hover:text-primary transition-all border border-border/8"
                    >
                      {link.emoji} {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Connect */}
              <div className="space-y-3">
                <h3 className="text-heading font-heading font-semibold text-sm">Let's Connect 🤝</h3>
                <a 
                  href="mailto:imrdaistudentclub@gmail.com" 
                  className="text-foreground/60 hover:text-primary transition-colors text-sm block truncate"
                >
                  imrdaistudentclub@gmail.com
                </a>
                <div className="flex items-center gap-2 pt-1">
                  <a 
                    href="https://www.instagram.com/ai.student_chapters/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-9 h-9 rounded-full bg-foreground/5 border border-border/10 flex items-center justify-center text-foreground/50 hover:text-accent hover:border-accent/30 hover:bg-accent/10 transition-all duration-300"
                  >
                    <Camera size={15} />
                  </a>
                  <a 
                    href="mailto:imrdaistudentclub@gmail.com" 
                    className="w-9 h-9 rounded-full bg-foreground/5 border border-border/10 flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all duration-300"
                  >
                    <Mail size={15} />
                  </a>
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-border/8 flex flex-col sm:flex-row justify-between items-center gap-3 text-foreground/30 text-xs">
              <p>© {new Date().getFullYear()} AI Student Chapters, RCPIMRD</p>
              <p className="flex items-center gap-1.5">made with 💜 by students</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;

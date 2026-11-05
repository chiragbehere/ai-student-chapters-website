import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, GraduationCap } from 'lucide-react';
import { CHAPTER_INFO } from '../data/chapterData';
import JoinModal from './JoinModal';
import { IconGithub, IconInstagram } from './SocialIcons';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const location = useLocation();

  // Smart Header: Auto-compact & subtle hide when scrolling down, re-reveal when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (isMobileMenuOpen || currentScrollY < 60) {
        setIsVisible(true);
      } else {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
          setIsVisible(false);
        } else if (lastScrollY - currentScrollY > 6) {
          setIsVisible(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsVisible(true);
  }, [location.pathname]);

  if (location.pathname === '/code-carnival') {
    return (
      <>
        <ScrollToTop />
        {children}
      </>
    );
  }

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT', path: '/about' },
    { label: 'EVENTS', path: '/events' },
    { label: 'TEAM', path: '/team' },
    { label: 'SESSIONS', path: '/sessions' },
    { label: 'TOOLS', path: '/tools' },
    { label: 'FAQ', path: '/faq' },
  ];

  return (
    <div className="min-h-screen bg-[#1F3D2B] bg-club-pattern text-[#E8DCC4] font-body relative selection:bg-[#8B5CF6]/30 selection:text-white flex flex-col justify-between">
      <ScrollToTop />

      {/* Sticky Minimal Premium Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-[#E8DCC4]/15 ${
          isVisible ? 'translate-y-0' : '-translate-y-full shadow-none'
        } ${
          isScrolled
            ? 'bg-[#142B20]/95 backdrop-blur-md shadow-2xl py-2.5 sm:py-3 border-[#E8DCC4]/20'
            : 'bg-[#1F3D2B]/90 backdrop-blur-sm py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <img
              src="/images/club-logo.webp"
              alt="AI Student Chapter"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-[#E8DCC4]/30 group-hover:border-[#8B5CF6] group-hover:scale-105 transition-all duration-300 shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-display font-black text-sm sm:text-lg tracking-tight text-[#E8DCC4] uppercase leading-none group-hover:text-white transition-colors">
                AISC <span className="text-[#8B5CF6]">’26</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#C9BDA7] uppercase hidden sm:block">
                RCPIMRD • SHIRPUR
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#142B20]/80 px-3 py-1.5 rounded-full border border-[#E8DCC4]/15 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 text-xs font-mono font-semibold tracking-wider rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] font-bold'
                      : 'text-[#E8DCC4]/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button: GET PASSES / JOIN */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="btn-primary px-3.5 py-2 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-heading font-bold rounded-xl uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_28px_rgba(139,92,246,0.55)] cursor-pointer active:scale-95 transition-all"
            >
              <span>GET PASSES</span>
              <ArrowUpRight size={14} className="shrink-0" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-[#E8DCC4]/20 bg-[#142B20] text-[#E8DCC4] hover:border-[#8B5CF6] hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Animated Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden bg-[#142B20] border-t border-[#E8DCC4]/15 overflow-hidden shadow-2xl"
            >
              <div className="px-4 py-3 space-y-1.5">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-2.5 text-xs font-mono font-semibold tracking-widest rounded-xl transition-all ${
                        isActive
                          ? 'bg-[#8B5CF6] text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                          : 'bg-[#193426] text-[#E8DCC4] border border-[#E8DCC4]/10 hover:border-[#8B5CF6]/50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-140px)] pt-18 sm:pt-24 flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative bg-[#142B20] border-t border-[#E8DCC4]/15 pt-16 pb-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#E8DCC4]/15">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/images/club-logo.webp"
                  alt="AI Student Chapter"
                  className="h-10 w-10 rounded-full border border-[#E8DCC4]/30"
                />
                <span className="font-display font-black text-2xl tracking-tight text-[#E8DCC4]">
                  AISC <span className="text-[#8B5CF6]">’26</span>
                </span>
              </div>
              <p className="text-[#C9BDA7] text-sm max-w-sm font-body leading-relaxed">
                Official AI Student Chapter community at RCPET&apos;s IMRD, Shirpur. Exploring artificial intelligence, machine learning, build sprints, and real-world code.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={CHAPTER_INFO.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-[#193426] border border-[#E8DCC4]/20 rounded-xl text-[#E8DCC4] hover:bg-[#8B5CF6] hover:text-white hover:border-[#8B5CF6] transition-all duration-200"
                  aria-label="Instagram"
                >
                  <IconInstagram size={18} />
                </a>
                <a
                  href={CHAPTER_INFO.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-[#193426] border border-[#E8DCC4]/20 rounded-xl text-[#E8DCC4] hover:bg-[#8B5CF6] hover:text-white hover:border-[#8B5CF6] transition-all duration-200"
                  aria-label="GitHub"
                >
                  <IconGithub size={18} />
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs text-[#E8DCC4] uppercase tracking-widest font-bold">NAVIGATION</h4>
              <ul className="space-y-2 text-sm text-[#C9BDA7] font-body">
                <li><Link to="/about" className="hover:text-[#8B5CF6] transition-colors">About AISC</Link></li>
                <li><Link to="/events" className="hover:text-[#8B5CF6] transition-colors">Events & Hackathons</Link></li>
                <li><Link to="/team" className="hover:text-[#8B5CF6] transition-colors">Team & Leadership</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs text-[#E8DCC4] uppercase tracking-widest font-bold">RESOURCES</h4>
              <ul className="space-y-2 text-sm text-[#C9BDA7] font-body">
                <li><Link to="/tools" className="hover:text-[#8B5CF6] transition-colors">Certificate Studio</Link></li>
                <li><a href="/studymeterial.pdf" download className="hover:text-[#8B5CF6] transition-colors">Study Material PDF</a></li>
                <li><Link to="/sessions" className="hover:text-[#8B5CF6] transition-colors">Presentation Decks</Link></li>
                <li><Link to="/faq" className="hover:text-[#8B5CF6] transition-colors">Student FAQ</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs text-[#E8DCC4] uppercase tracking-widest font-bold">CAMPUS</h4>
              <div className="text-sm text-[#C9BDA7] space-y-2 font-body">
                <p className="flex items-start gap-2 text-[#E8DCC4] font-medium">
                  <GraduationCap size={18} className="text-[#8B5CF6] shrink-0 mt-0.5" />
                  <span>RCPET&apos;s Institute of Management Research & Development</span>
                </p>
                <p className="text-xs text-[#C9BDA7]/80">Shirpur, Maharashtra, India</p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#C9BDA7] gap-4">
            <p>© {new Date().getFullYear()} {CHAPTER_INFO.name}. All Rights Reserved.</p>
            <p className="text-[#C9BDA7]/80">Crafted with Forest Green, Sand Beige & Electric Purple</p>
          </div>
        </div>
      </footer>

      <JoinModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
    </div>
  );
};

export default Layout;

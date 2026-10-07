import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, GraduationCap } from 'lucide-react';
import { CHAPTER_INFO } from '../data/chapterData';
import CustomCursor from './CustomCursor';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
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
    <div className="min-h-screen bg-[#ecefe9] text-[#0a0a0a] font-body relative selection:bg-[#008736]/20 selection:text-[#008736]">
      <ScrollToTop />
      <CustomCursor />

      {/* Structural Header Grid */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-[#cdd6cd] ${
          isScrolled ? 'bg-[#ecefe9]/95 backdrop-blur-md shadow-sm py-3' : 'bg-[#ecefe9] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex items-center justify-between gap-1 overflow-hidden">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-3 group shrink-0 min-w-0">
            <img
              src="/images/club-logo.webp"
              alt="AI Student Chapter"
              className="h-7 w-7 sm:h-9 sm:w-9 rounded-full object-cover border border-[#b8c6b8] group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-display font-black text-sm sm:text-xl tracking-tight text-[#0a0a0a] uppercase leading-none truncate">
                AISC <span className="text-[#008736]">’26</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-600 uppercase hidden sm:block">
                RCPIMRD • SHIRPUR
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center border-l border-r border-[#cdd6cd]">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2.5 text-xs font-mono font-semibold tracking-wider border-r last:border-r-0 border-[#cdd6cd] transition-colors ${
                    isActive
                      ? 'bg-[#008736] text-white font-bold'
                      : 'text-[#111111] hover:bg-[#e2e7e2] hover:text-[#008736]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button: GET PASSES / JOIN */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="btn-green px-2 py-1 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-heading font-bold rounded-none uppercase tracking-wider flex items-center gap-1 active:scale-95 shrink-0 leading-none"
            >
              <span className="hidden min-[340px]:inline">GET </span>
              <span>PASSES</span>
              <ArrowUpRight size={13} className="shrink-0" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1 sm:p-2 border border-[#cdd6cd] bg-[#f4f6f2] text-[#0a0a0a] hover:bg-[#e2e7e2] shrink-0"
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
              className="lg:hidden bg-[#ecefe9] border-t border-[#cdd6cd] overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-xs font-mono font-semibold tracking-widest border border-[#cdd6cd] mb-2 ${
                        isActive ? 'bg-[#008736] text-white' : 'bg-[#f4f6f2] text-[#0a0a0a]'
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
      <main className="relative z-10 pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-[#e5e9e5] border-t border-[#cdd6cd] pt-16 pb-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#cdd6cd]">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <img src="/images/club-logo.webp" alt="AI Student Chapter" className="h-10 w-10 rounded-full border border-[#b8c6b8]" />
                <span className="font-display font-black text-2xl tracking-tight text-[#0a0a0a]">
                  AISC <span className="text-[#008736]">’26</span>
                </span>
              </div>
              <p className="text-[#4e554e] text-sm max-w-sm font-body leading-relaxed">
                Official AI Student Chapter community at RCPET's IMRD, Shirpur. Exploring artificial intelligence, machine learning, build sprints, and real-world code.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={CHAPTER_INFO.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-[#f4f6f2] border border-[#cdd6cd] text-[#0a0a0a] hover:bg-[#008736] hover:text-white transition-colors"
                >
                  <IconInstagram size={18} />
                </a>
                <a
                  href={CHAPTER_INFO.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-[#f4f6f2] border border-[#cdd6cd] text-[#0a0a0a] hover:bg-[#008736] hover:text-white transition-colors"
                >
                  <IconGithub size={18} />
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs text-[#0a0a0a] uppercase tracking-widest font-bold">NAVIGATION</h4>
              <ul className="space-y-2 text-sm text-[#4e554e] font-body">
                <li><Link to="/about" className="hover:text-[#008736]">About AISC</Link></li>
                <li><Link to="/events" className="hover:text-[#008736]">Events & Hackathons</Link></li>
                <li><Link to="/team" className="hover:text-[#008736]">Team & Leadership</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs text-[#0a0a0a] uppercase tracking-widest font-bold">RESOURCES</h4>
              <ul className="space-y-2 text-sm text-[#4e554e] font-body">
                <li><Link to="/tools" className="hover:text-[#008736]">Certificate Studio</Link></li>
                <li><a href="/studymeterial.pdf" download className="hover:text-[#008736]">Study Material PDF</a></li>
                <li><Link to="/sessions" className="hover:text-[#008736]">Presentation Decks</Link></li>
                <li><Link to="/faq" className="hover:text-[#008736]">Student FAQ</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs text-[#0a0a0a] uppercase tracking-widest font-bold font-mono">CAMPUS</h4>
              <div className="text-sm text-[#4e554e] space-y-2 font-body">
                <p className="flex items-start gap-2 text-[#0a0a0a] font-medium">
                  <GraduationCap size={18} className="text-[#008736] shrink-0 mt-0.5" />
                  <span>RCPET's Institute of Management Research & Development</span>
                </p>
                <p className="text-xs text-slate-600">Shirpur, Maharashtra, India</p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-600 gap-4">
            <p>© {new Date().getFullYear()} {CHAPTER_INFO.name}. All Rights Reserved.</p>
            <p>Designed in GitHub Universe Light Editorial Style</p>
          </div>
        </div>
      </footer>

      <JoinModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
    </div>
  );
};

export default Layout;

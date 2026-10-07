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

<<<<<<< Updated upstream
  if (location.pathname === '/code-carnival') {
    return (
      <>
        <ScrollToTop />
        {children}
      </>
    );
  }
=======
  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT', path: '/about' },
    { label: 'EVENTS', path: '/events' },
    { label: 'TEAM', path: '/team' },
    { label: 'SESSIONS', path: '/sessions' },
    { label: 'TOOLS', path: '/tools' },
    { label: 'FAQ', path: '/faq' },
  ];
>>>>>>> Stashed changes

  return (
    <div className="min-h-screen bg-[#ecefe9] text-[#0a0a0a] font-body relative selection:bg-[#008736]/20 selection:text-[#008736]">
      <ScrollToTop />
      <CustomCursor />

<<<<<<< Updated upstream
      {/* ═══ Main App Shell ═══ */}
      <div className="min-h-screen flex flex-col" style={{ position: 'relative', zIndex: 2 }}>

        {/* ═══════════════ Editorial Navbar Header ═══════════════ */}
        <header role="banner" className="space-navbar" style={{ zIndex: 50 }}>
          <div className="w-full h-full flex items-center justify-between">
            {/* Logo + Name */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <img 
                src="/images/club-logo.webp" 
                alt="AI Student Chapters Logo" 
                className="club-logo h-9 w-9 transition-transform duration-300 group-hover:rotate-6" 
              />
              <span className="font-bold text-lg tracking-tight hidden sm:inline" style={{ fontFamily: "'Syne', sans-serif" }}>
                <span style={{ color: 'var(--acid)' }}>AI</span>{' '}
                <span style={{ color: 'rgb(var(--color-heading))' }}>Student Chapters</span>
=======
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
>>>>>>> Stashed changes
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-600 uppercase hidden sm:block">
                RCPIMRD • SHIRPUR
              </span>
            </div>
          </Link>

<<<<<<< Updated upstream
            {/* Right Side Nav Group */}
            <div className="flex items-center gap-4">
              {/* Desktop Nav Links */}
              <nav aria-label="Main Navigation" className="hidden lg:flex items-center">
                <div className="space-nav-pill">
                  {links.map((link) => (
=======
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                  ))}
                </div>
              </nav>
=======
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2.5 transition-all duration-300 border group"
                  aria-label="Toggle Theme"
                  style={{
                    borderRadius: 0,
                    background: 'transparent',
                    borderColor: 'rgb(var(--color-border))',
                    color: 'rgb(var(--color-heading))',
                  }}
                >
                  <div className="transition-transform duration-300 scale-100 active:scale-95">
                    {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                  </div>
                </button>

                {/* Mobile Hamburger */}
                <button
                  className="lg:hidden p-2 transition-all border"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  style={{
                    borderRadius: 0,
                    background: 'transparent',
                    borderColor: 'rgb(var(--color-border))',
                    color: 'rgb(var(--color-heading))',
                  }}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
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
                  background: theme === 'dark' ? 'rgba(18,16,12,0.98)' : 'rgba(243,240,233,0.98)',
                  borderBottom: '1px solid rgb(var(--color-border))',
                }}
              >
                <nav aria-label="Mobile Navigation" className="px-4 py-5 space-y-1 flex flex-col">
                  {links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-xs font-medium transition-all uppercase tracking-wider"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        borderRadius: 0,
                        background: location.pathname === link.path
                          ? 'var(--ink)'
                          : 'transparent',
                        color: location.pathname === link.path
                          ? 'var(--acid)'
                          : 'rgb(var(--color-foreground) / 0.6)',
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Main Content */}
        <main role="main" className="flex-grow pt-[65px]">
          {children}
        </main>

        {/* ═══════════════ New Editorial Footer ═══════════════ */}
        <footer className="space-footer">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            
            {/* Top section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-14">
              
              {/* Brand */}
              <div className="md:col-span-5 space-y-5">
                <div className="flex items-center gap-3">
                  <img 
                    src="/images/club-logo.webp" 
                    alt="Logo" 
                    className="h-8 w-8 opacity-90"
                  />
                  <h2 style={{ fontWeight: 800, fontSize: '18px', color: theme === 'dark' ? '#f3f0e9' : '#11110f', letterSpacing: '-0.03em' }}>
                    AI Student Chapters
                  </h2>
                </div>
                <p style={{ color: theme === 'dark' ? 'rgba(243,240,233,0.7)' : 'rgba(17,17,15,0.6)', fontSize: '12px', lineHeight: 1.7, maxWidth: '320px' }}>
                  Where curiosity meets code. Built for students who want to shape the future with AI.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <a 
                    href="https://www.instagram.com/ai.student_chapters/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center transition-all duration-300"
                    style={{ width: '36px', height: '36px', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(17,17,15,0.15)', color: theme === 'dark' ? 'rgba(243,240,233,0.7)' : 'rgba(17,17,15,0.6)', background: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme === 'dark' ? '#d8ff3e' : '#b500ff'; e.currentTarget.style.color = theme === 'dark' ? '#d8ff3e' : '#b500ff'; e.currentTarget.style.background = theme === 'dark' ? 'rgba(216,255,62,0.1)' : '#ecbcff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(17,17,15,0.15)'; e.currentTarget.style.color = theme === 'dark' ? 'rgba(243,240,233,0.7)' : 'rgba(17,17,15,0.6)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a 
                    href="mailto:imrdaistudentclub@gmail.com" 
                    className="flex items-center justify-center transition-all duration-300"
                    style={{ width: '36px', height: '36px', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(17,17,15,0.15)', color: theme === 'dark' ? 'rgba(243,240,233,0.7)' : 'rgba(17,17,15,0.6)', background: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme === 'dark' ? '#d8ff3e' : '#b500ff'; e.currentTarget.style.color = theme === 'dark' ? '#d8ff3e' : '#b500ff'; e.currentTarget.style.background = theme === 'dark' ? 'rgba(216,255,62,0.1)' : '#ecbcff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(17,17,15,0.15)'; e.currentTarget.style.color = theme === 'dark' ? 'rgba(243,240,233,0.7)' : 'rgba(17,17,15,0.6)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </a>
                  <a 
                    href="https://chat.whatsapp.com/IfBOfK4bE7l1D0N5C9KXYv" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center transition-all duration-300"
                    style={{ width: '36px', height: '36px', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(17,17,15,0.15)', color: theme === 'dark' ? 'rgba(243,240,233,0.7)' : 'rgba(17,17,15,0.6)', background: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme === 'dark' ? '#d8ff3e' : '#b500ff'; e.currentTarget.style.color = theme === 'dark' ? '#d8ff3e' : '#b500ff'; e.currentTarget.style.background = theme === 'dark' ? 'rgba(216,255,62,0.1)' : '#ecbcff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(17,17,15,0.15)'; e.currentTarget.style.color = theme === 'dark' ? 'rgba(243,240,233,0.7)' : 'rgba(17,17,15,0.6)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="md:col-span-3">
                <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme === 'dark' ? 'rgba(243,240,233,0.5)' : 'rgba(17,17,15,0.4)', marginBottom: '20px' }}>
                  Navigate
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {links.map((link) => (
                    <Link 
                      key={link.path} 
                      to={link.path} 
                      className="transition-all duration-200 block px-1.5 py-1 rounded"
                      style={{ fontSize: '12px', color: theme === 'dark' ? 'rgba(243,240,233,0.75)' : 'rgba(17,17,15,0.65)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = theme === 'dark' ? '#d8ff3e' : '#b500ff'; e.currentTarget.style.background = theme === 'dark' ? 'rgba(216,255,62,0.1)' : '#ecbcff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = theme === 'dark' ? 'rgba(243,240,233,0.75)' : 'rgba(17,17,15,0.65)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="md:col-span-4">
                <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme === 'dark' ? 'rgba(243,240,233,0.5)' : 'rgba(17,17,15,0.4)', marginBottom: '20px' }}>
                  Get in touch
                </h3>
                <a 
                  href="mailto:imrdaistudentclub@gmail.com" 
                  className="transition-colors duration-200 block"
                  style={{ fontSize: '12px', color: theme === 'dark' ? 'rgba(243,240,233,0.85)' : 'rgba(17,17,15,0.65)', marginBottom: '12px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = theme === 'dark' ? '#d8ff3e' : '#b500ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = theme === 'dark' ? 'rgba(243,240,233,0.85)' : 'rgba(17,17,15,0.65)'; }}
                >
                  imrdaistudentclub@gmail.com
                </a>
                <p style={{ fontSize: '12px', color: theme === 'dark' ? 'rgba(243,240,233,0.5)' : 'rgba(17,17,15,0.45)', lineHeight: 1.7 }}>
                  RCPIMRD, India
                </p>
=======
                <img src="/images/club-logo.webp" alt="AI Student Chapter" className="h-10 w-10 rounded-full border border-[#b8c6b8]" />
                <span className="font-display font-black text-2xl tracking-tight text-[#0a0a0a]">
                  AISC <span className="text-[#008736]">’26</span>
                </span>
              </div>
              <p className="text-[#4e554e] text-sm max-w-sm font-body leading-relaxed">
                Official AI Student Chapter community at RCPET's IMRD, Shirpur. Exploring artificial intelligence, machine learning, build sprints, and real-world code.
              </p>
              <div className="flex items-center gap-3 pt-2">
>>>>>>> Stashed changes
                <a
                  href={CHAPTER_INFO.instagram}
                  target="_blank"
                  rel="noreferrer"
<<<<<<< Updated upstream
                  className="inline-flex items-center gap-2 mt-4 transition-all duration-200"
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    background: theme === 'dark' ? '#d8ff3e' : '#ffffff',
                    color: theme === 'dark' ? '#000000' : '#11110f',
                    border: theme === 'dark' ? '1px solid #d8ff3e' : '1px solid #11110f',
                    padding: '10px 16px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translate(-2px,-2px)';
                    if (theme === 'dark') {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.color = '#000000';
                      e.currentTarget.style.borderColor = '#ffffff';
                      e.currentTarget.style.boxShadow = '3px 3px 0 #d8ff3e';
                    } else {
                      e.currentTarget.style.background = '#b500ff';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = '#b500ff';
                      e.currentTarget.style.boxShadow = '3px 3px 0 #ecbcff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.background = theme === 'dark' ? '#d8ff3e' : '#ffffff';
                    e.currentTarget.style.color = theme === 'dark' ? '#000000' : '#11110f';
                    e.currentTarget.style.borderColor = theme === 'dark' ? '#d8ff3e' : '#11110f';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
=======
                  className="p-2.5 bg-[#f4f6f2] border border-[#cdd6cd] text-[#0a0a0a] hover:bg-[#008736] hover:text-white transition-colors"
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
            {/* Bottom bar */}
            <div 
              className="flex flex-col sm:flex-row justify-between items-center gap-3 py-5"
              style={{ borderTop: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(17,17,15,0.1)' }}
            >
              <p style={{ fontSize: '10px', letterSpacing: '0.06em', color: theme === 'dark' ? 'rgba(243,240,233,0.5)' : 'rgba(17,17,15,0.5)', textTransform: 'uppercase' }}>
                © {new Date().getFullYear()} AI Student Chapters, RCPIMRD
              </p>
              <p style={{ fontSize: '11px', fontWeight: 600, color: theme === 'dark' ? 'rgba(243,240,233,0.7)' : 'rgba(17,17,15,0.65)', letterSpacing: '-0.01em' }}>
                Designed by <span style={{ color: theme === 'dark' ? '#d8ff3e' : '#b500ff', fontWeight: 700 }}>Team AISC</span>
              </p>
=======
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
>>>>>>> Stashed changes
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

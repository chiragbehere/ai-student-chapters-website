import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, Sun, Moon, ArrowUpRight } from 'lucide-react';
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
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/team', label: 'Team' },
    { path: '/sessions', label: 'Sessions' },
    { path: '/tools', label: 'Tools' },
    { path: '/faq', label: 'FAQ' },
    { path: '/about', label: 'About' },
  ];

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />

      {/* ═══ Main App Shell ═══ */}
      <div className="min-h-screen flex flex-col" style={{ position: 'relative', zIndex: 2 }}>

        {/* ═══════════════ Editorial Navbar ═══════════════ */}
        <nav className="space-navbar" style={{ zIndex: 50 }}>
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
              </span>
            </Link>

            {/* Right Side Nav Group */}
            <div className="flex items-center gap-4">
              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center">
                <div className="space-nav-pill">
                  {links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`space-nav-link ${
                        location.pathname === link.path ? 'active' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Theme toggle + Mobile hamburger */}
              <div className="flex items-center gap-3">
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
                <div className="px-4 py-5 space-y-1 flex flex-col">
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Main Content */}
        <main className="flex-grow pt-[65px]">
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
                  <h2 style={{ fontWeight: 800, fontSize: '18px', color: '#11110f', letterSpacing: '-0.03em' }}>
                    AI Student Chapters
                  </h2>
                </div>
                <p style={{ color: 'rgba(17,17,15,0.6)', fontSize: '12px', lineHeight: 1.7, maxWidth: '320px' }}>
                  Where curiosity meets code. Built for students who want to shape the future with AI.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <a 
                    href="https://www.instagram.com/ai.student_chapters/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center transition-all duration-300"
                    style={{ width: '36px', height: '36px', border: '1px solid rgba(17,17,15,0.15)', color: 'rgba(17,17,15,0.6)', background: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#b500ff'; e.currentTarget.style.color = '#b500ff'; e.currentTarget.style.background = '#ecbcff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(17,17,15,0.15)'; e.currentTarget.style.color = 'rgba(17,17,15,0.6)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a 
                    href="mailto:imrdaistudentclub@gmail.com" 
                    className="flex items-center justify-center transition-all duration-300"
                    style={{ width: '36px', height: '36px', border: '1px solid rgba(17,17,15,0.15)', color: 'rgba(17,17,15,0.6)', background: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#b500ff'; e.currentTarget.style.color = '#b500ff'; e.currentTarget.style.background = '#ecbcff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(17,17,15,0.15)'; e.currentTarget.style.color = 'rgba(17,17,15,0.6)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </a>
                  <a 
                    href="https://chat.whatsapp.com/IfBOfK4bE7l1D0N5C9KXYv" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center transition-all duration-300"
                    style={{ width: '36px', height: '36px', border: '1px solid rgba(17,17,15,0.15)', color: 'rgba(17,17,15,0.6)', background: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#b500ff'; e.currentTarget.style.color = '#b500ff'; e.currentTarget.style.background = '#ecbcff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(17,17,15,0.15)'; e.currentTarget.style.color = 'rgba(17,17,15,0.6)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="md:col-span-3">
                <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(17,17,15,0.4)', marginBottom: '20px' }}>
                  Navigate
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {links.map((link) => (
                    <Link 
                      key={link.path} 
                      to={link.path} 
                      className="transition-all duration-200 block px-1.5 py-1 rounded"
                      style={{ fontSize: '12px', color: 'rgba(17,17,15,0.65)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#b500ff'; e.currentTarget.style.background = '#ecbcff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(17,17,15,0.65)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="md:col-span-4">
                <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(17,17,15,0.4)', marginBottom: '20px' }}>
                  Get in touch
                </h3>
                <a 
                  href="mailto:imrdaistudentclub@gmail.com" 
                  className="transition-colors duration-200 block"
                  style={{ fontSize: '12px', color: 'rgba(17,17,15,0.65)', marginBottom: '12px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#b500ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(17,17,15,0.65)'; }}
                >
                  imrdaistudentclub@gmail.com
                </a>
                <p style={{ fontSize: '12px', color: 'rgba(17,17,15,0.45)', lineHeight: 1.7 }}>
                  RCPIMRD, India
                </p>
                <a
                  href="https://chat.whatsapp.com/IfBOfK4bE7l1D0N5C9KXYv"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-4 transition-all duration-200"
                  style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', background: '#ffffff', color: '#11110f', border: '1px solid #11110f', padding: '10px 16px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.background = '#b500ff'; e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = '#b500ff'; e.currentTarget.style.boxShadow = '3px 3px 0 #ecbcff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#11110f'; e.currentTarget.style.borderColor = '#11110f'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Join the chapter <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            {/* Bottom bar */}
            <div 
              className="flex flex-col sm:flex-row justify-between items-center gap-3 py-5"
              style={{ borderTop: '1px solid rgba(17,17,15,0.1)' }}
            >
              <p style={{ fontSize: '10px', letterSpacing: '0.06em', color: 'rgba(17,17,15,0.5)', textTransform: 'uppercase' }}>
                © {new Date().getFullYear()} AI Student Chapters, RCPIMRD
              </p>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(17,17,15,0.65)', letterSpacing: '-0.01em' }}>
                Designed by <span style={{ color: '#b500ff', fontWeight: 700 }}>Team AISC</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;

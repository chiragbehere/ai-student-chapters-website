// CinematicNavbar.tsx
// Floating translucent navigation bar with thin crimson border, smooth section scrolling, and audio control
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ExternalLink } from 'lucide-react';

interface CinematicNavbarProps {
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
  unstopUrl: string;
}

export const CinematicNavbar: React.FC<CinematicNavbarProps> = ({
  isPlayingAudio,
  onToggleAudio,
  unstopUrl,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'EVENT', href: '#event-overview' },
    { label: 'CHALLENGES', href: '#tracks' },
    { label: 'SCHEDULE', href: '#timeline' },
    { label: 'REWARDS', href: '#prizes' },
    { label: 'PROTOCOLS', href: '#protocols' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-5xl transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0710]/85 border-red-600/40 shadow-[0_8px_32px_rgba(229,9,20,0.15)] backdrop-blur-md'
          : 'bg-[#08060d]/60 border-red-600/25 backdrop-blur-sm'
      } border rounded-full px-5 py-2.5 flex items-center justify-between text-xs font-mono`}
    >
      {/* Brand Title */}
      <a
        href="#hero"
        onClick={(e) => handleNavClick(e, '#hero')}
        className="flex items-center gap-2 text-white font-bold tracking-widest hover:text-[#e50914] transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-[#e50914] shadow-[0_0_8px_#e50914] animate-pulse" />
        <span style={{ fontFamily: "'Libre Baskerville', serif", letterSpacing: '0.15em' }}>
          CODE CARNIVAL
        </span>
      </a>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6 text-[#e8d5b5]/80">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            className="tracking-widest hover:text-[#e50914] transition-colors relative py-1 group"
          >
            {item.label}
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e50914] transition-all duration-200 group-hover:w-full" />
          </a>
        ))}
      </div>

      {/* Right Controls: Audio Toggle & Register CTA */}
      <div className="flex items-center gap-3">
        {/* Audio Ambience Toggle */}
        <button
          onClick={onToggleAudio}
          className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-all duration-300 ${
            isPlayingAudio
              ? 'border-[#e50914] text-[#e50914] bg-[#e50914]/15 shadow-[0_0_10px_rgba(229,9,20,0.3)]'
              : 'border-[#e8d5b5]/20 text-[#e8d5b5]/60 hover:text-white hover:border-[#e8d5b5]/40'
          }`}
          title={isPlayingAudio ? 'Mute Ambience' : 'Play Ambience'}
          aria-label={isPlayingAudio ? 'Mute Ambience' : 'Play Ambience'}
        >
          {isPlayingAudio ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span className="hidden sm:inline text-[10px] tracking-wider uppercase">
            {isPlayingAudio ? 'AUDIO ON' : 'AUDIO OFF'}
          </span>
        </button>

        {/* Register CTA Button */}
        <a
          href={unstopUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e50914] text-white font-bold tracking-wider hover:bg-[#ff1a26] transition-all shadow-[0_0_12px_rgba(229,9,20,0.5)]"
        >
          <span>REGISTER</span>
          <ExternalLink size={12} />
        </a>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1 text-[#e8d5b5] hover:text-[#e50914]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-[#090610]/95 border border-red-600/30 rounded-2xl p-4 backdrop-blur-xl flex flex-col gap-3 shadow-2xl">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="px-3 py-2 rounded text-[#e8d5b5]/80 hover:text-[#e50914] hover:bg-red-950/20 tracking-wider text-center"
            >
              {item.label}
            </a>
          ))}
          <a
            href={unstopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full py-2 rounded-full bg-[#e50914] text-white font-bold tracking-wider text-center flex items-center justify-center gap-2"
          >
            <span>REGISTER ON UNSTOP</span>
            <ExternalLink size={13} />
          </a>
        </div>
      )}
    </nav>
  );
};

export default CinematicNavbar;

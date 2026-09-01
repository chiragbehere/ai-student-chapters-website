import React, { useState } from 'react';
import { X, Users, Rocket, ExternalLink, Sparkles, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const EventRegistrationModal: React.FC = () => {
  // Show overlay on every page load / reload
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const registrationUrl = 'https://forms.gle/8LXcmfnCHFUhRFHf8';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300"
          style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[560px] rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl font-sans border border-[#e2e8f0]"
            style={{
              backgroundColor: '#ffffff',
              color: '#11110f',
              boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.25), 0 0 30px rgba(181, 0, 255, 0.1)',
            }}
          >
            {/* Background Image Layer: abstract-design-background.jpg */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 pointer-events-none"
              style={{ backgroundImage: 'url("/images/abstract-design-background.jpg")' }}
            />

            {/* Subtle Gradient Backdrop for crisp high contrast text */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/98 pointer-events-none" />

            {/* Close Button (×) */}
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors z-20 cursor-pointer border border-slate-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Body */}
            <div className="relative z-10 flex flex-col items-center text-center">
              
              {/* Top Chapter Pill */}
              <div 
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border"
                style={{ 
                  backgroundColor: 'rgba(181, 0, 255, 0.08)', 
                  color: 'var(--color-primary, #b500ff)',
                  borderColor: 'rgba(181, 0, 255, 0.25)' 
                }}
              >
                <Brain className="w-3.5 h-3.5" style={{ color: 'var(--color-primary, #b500ff)' }} />
                <span>AI Student Chapter</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1.5 flex items-center justify-center gap-2 text-slate-900">
                <span>🚀</span>
                <span className="font-extrabold" style={{ color: 'var(--ink, #11110f)' }}>
                  AI Research League 2.0
                </span>
              </h2>

              {/* Subtitle */}
              <div 
                className="text-xs sm:text-sm font-bold tracking-widest uppercase font-mono mb-3"
                style={{ color: 'var(--color-primary, #b500ff)' }}
              >
                Team Registration Now Open
              </div>

              {/* Tagline / Description */}
              <p className="text-sm text-slate-600 leading-relaxed max-w-md mb-5 font-medium">
                Join our AI research and innovation competition.
              </p>

              {/* Key Features Pill Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6 w-full">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 shadow-sm">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>👥 Teams of 3 Members</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Research • Build • Compete</span>
                </div>
              </div>

              {/* Primary CTA Button (using global site button style) */}
              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="genz-btn-primary w-full sm:w-auto px-8 py-3 rounded-2xl font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 mb-4 group shadow-md"
              >
                <Rocket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Register Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Small Footnote */}
              <p className="text-[11px] sm:text-xs text-slate-500 font-mono leading-relaxed max-w-sm">
                Registration closes soon. Further details will be shared with registered teams.
              </p>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventRegistrationModal;

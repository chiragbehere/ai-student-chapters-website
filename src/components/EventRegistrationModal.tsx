<<<<<<< Updated upstream
import React, { useState } from 'react';
import { X, Users, Rocket, ExternalLink, Sparkles, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const EventRegistrationModal: React.FC = () => {
  // Show overlay on every page load / reload
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
=======
import React from 'react';
import { X, Users, Rocket, ExternalLink, Sparkles, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventRegistrationModalProps {
  event?: {
    title: string;
    description: string;
    date: string;
    registrationUrl?: string;
  };
  onClose?: () => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({ event, onClose }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
>>>>>>> Stashed changes
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

<<<<<<< Updated upstream
  const registrationUrl = 'https://forms.gle/8LXcmfnCHFUhRFHf8';
=======
  const registrationUrl = event?.registrationUrl || 'https://chat.whatsapp.com/IfBOfK4bE7l1D0N5C9KXYv';
  const title = event?.title || 'Code Carnival 2026: 6-Hour AI Build Sprint';
  const description = event?.description || 'Join our flagship AI build sprint where student teams turn ideas into working prototypes.';
>>>>>>> Stashed changes

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={handleBackdropClick}
<<<<<<< Updated upstream
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
=======
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-[#05070c]/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[540px] rounded-3xl p-6 sm:p-8 overflow-hidden glass-panel border border-white/15 shadow-[0_0_60px_rgba(0,240,255,0.2)] text-white"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
>>>>>>> Stashed changes
            >
              <X className="w-5 h-5" />
            </button>

<<<<<<< Updated upstream
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

=======
            {/* Modal Content */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                <Brain className="w-3.5 h-3.5" />
                <span>AI STUDENT CHAPTER • RCPIMRD</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-snug">
                {title}
              </h2>

              <p className="text-sm text-slate-300 font-body leading-relaxed max-w-md">
                {description}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-2">
                <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-mono flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>UG & PG Categories</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-mono flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#9d4edd]" />
                  <span>Live Pitch & Mentorship</span>
                </div>
              </div>

              <div className="w-full pt-4">
                <a
                  href={registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="w-full py-3.5 px-6 rounded-xl font-heading font-semibold text-sm bg-gradient-to-r from-[#00f0ff] to-[#9d4edd] text-black hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.4)]"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Register / Join Community</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
>>>>>>> Stashed changes
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventRegistrationModal;

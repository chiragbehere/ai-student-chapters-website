import React, { useState } from 'react';
import { X, Rocket, ExternalLink, Sparkles, Brain, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventRegistrationModalProps {
  event?: {
    title: string;
    description: string;
    date: string;
    registrationUrl?: string;
    location?: string;
  };
  onClose?: () => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({ event, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const registrationUrl = event?.registrationUrl || 'https://chat.whatsapp.com/IfBOfK4bE7l1D0N5C9KXYv';
  const title = event?.title || 'Code Carnival 2026: 6-Hour AI Build Sprint';
  const description = event?.description || 'Join our flagship AI build sprint where student teams turn ideas into working prototypes.';
  const date = event?.date || 'October 2026';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[540px] p-6 sm:p-8 overflow-hidden grid-box bg-white border border-[#cdd6cd] shadow-2xl text-[#0a0a0a]"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 bg-[#f4f6f2] hover:bg-[#e2e7e2] text-[#0a0a0a] transition-colors border border-[#cdd6cd]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold text-[#008736] uppercase tracking-wider bg-[#e6f4ea] border border-[#008736]/20">
                <Brain className="w-3.5 h-3.5" />
                <span>AI STUDENT CHAPTER • RCPIMRD</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0a0a0a] leading-tight">
                {title}
              </h2>

              <p className="text-sm text-[#4e554e] font-body leading-relaxed max-w-md">
                {description}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-1">
                <div className="px-3 py-1.5 bg-[#f4f6f2] border border-[#cdd6cd] text-[#0a0a0a] text-xs font-mono flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#008736]" />
                  <span>{date}</span>
                </div>
                <div className="px-3 py-1.5 bg-[#f4f6f2] border border-[#cdd6cd] text-[#0a0a0a] text-xs font-mono flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#008736]" />
                  <span>Mentorship & Labs</span>
                </div>
              </div>

              <div className="w-full pt-4">
                <a
                  href={registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="btn-green w-full py-3.5 px-6 font-heading font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Register / Join Community</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventRegistrationModal;

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Rocket, ExternalLink, Calendar, MapPin } from 'lucide-react';
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

  // Lock body scroll and mark modal open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.setAttribute('data-modal-open', 'true');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.removeAttribute('data-modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

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
  const location = event?.location || 'IMRD Campus, Shirpur';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[540px] p-5 sm:p-8 overflow-hidden bg-white border border-[#cdd6cd] shadow-2xl text-[#0a0a0a] rounded-sm my-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 bg-[#f4f6f2] hover:bg-[#e2e7e2] text-[#0a0a0a] transition-colors border border-[#cdd6cd] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Content */}
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold text-[#008736] uppercase tracking-wider bg-[#e6f4ea] border border-[#008736]/20">
                <Rocket className="w-3.5 h-3.5 text-[#008736]" />
                <span>OFFICIAL EVENT REGISTRATION</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-[#0a0a0a] leading-tight">
                {title}
              </h2>

              <p className="text-xs sm:text-sm text-[#4e554e] font-body leading-relaxed max-w-md">
                {description}
              </p>

              <div className="w-full bg-[#f4f6f2] border border-[#cdd6cd] p-3 text-xs font-mono text-[#0a0a0a] space-y-1.5 text-left">
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-[#008736] shrink-0" />
                  <span className="truncate">{date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#008736] shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
              </div>

              <div className="w-full pt-2 space-y-2">
                <a
                  href={registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-green w-full py-3.5 px-6 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Proceed to Registration</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={handleClose}
                  className="w-full py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#525852] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default EventRegistrationModal;

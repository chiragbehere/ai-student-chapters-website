import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: { src: string; caption?: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

const Lightbox = ({ images, currentIndex, isOpen, onClose, onNavigate }: LightboxProps) => {
  // Lock body scroll when open and mark modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('data-modal-open', 'true');
    } else {
      document.body.style.overflow = 'unset';
      document.body.removeAttribute('data-modal-open');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.removeAttribute('data-modal-open');
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  const handlePrev = () => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    onNavigate((currentIndex + 1) % images.length);
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#101A14]/95 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close image preview"
            className="absolute top-6 right-6 p-2.5 rounded-full bg-[#193426] hover:bg-[#8B5CF6] text-[#E8DCC4] hover:text-white border border-[#E8DCC4]/20 transition-all z-10 cursor-pointer shadow-lg"
          >
            <X size={22} />
          </button>

          {/* Prev button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous image"
              className="absolute left-6 p-3 rounded-full bg-[#193426] hover:bg-[#8B5CF6] text-[#E8DCC4] hover:text-white border border-[#E8DCC4]/20 transition-all z-10 cursor-pointer shadow-lg"
            >
              <ChevronLeft size={26} />
            </button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next image"
              className="absolute right-6 p-3 rounded-full bg-[#193426] hover:bg-[#8B5CF6] text-[#E8DCC4] hover:text-white border border-[#E8DCC4]/20 transition-all z-10 cursor-pointer shadow-lg"
            >
              <ChevronRight size={26} />
            </button>
          )}

          {/* Main image container */}
          <div 
            className="relative max-w-5xl max-h-[85vh] p-4 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={images[currentIndex].src}
              alt={images[currentIndex].caption || 'Enlarged gallery view'}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl border border-[#E8DCC4]/15 shadow-2xl"
            />
            
            {/* Caption */}
            {images[currentIndex].caption && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5 text-[#E8DCC4] text-center font-heading text-base sm:text-lg max-w-2xl px-4"
              >
                {images[currentIndex].caption}
                <div className="text-[#C9BDA7] text-xs font-mono mt-1">
                  {currentIndex + 1} / {images.length}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Lightbox;

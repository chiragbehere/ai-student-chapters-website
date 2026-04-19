import { useEffect } from 'react';
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
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 sm:backdrop-blur-xl"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>

          {images.length > 1 && (
            <>
              {/* Prev Button */}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 sm:left-8 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-white hover:bg-white/10 hover:scale-105 transition-all z-50 backdrop-blur-md"
                aria-label="Previous Image"
              >
                <ChevronLeft size={28} />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 sm:right-8 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-white hover:bg-white/10 hover:scale-105 transition-all z-50 backdrop-blur-md"
                aria-label="Next Image"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Image Container */}
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full px-4 sm:px-16 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent clicks on image from closing
          >
            <motion.div
              key={currentIndex} // forces re-render/animation on index change
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 max-h-[80vh] flex items-center justify-center"
            >
              <img 
                src={images[currentIndex].src} 
                alt={images[currentIndex].caption || "Gallery Image"} 
                className="max-h-[80vh] w-auto h-auto object-contain"
              />
            </motion.div>
            
            {/* Caption */}
            {images[currentIndex].caption && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-white text-center font-heading text-lg max-w-2xl px-4"
              >
                {images[currentIndex].caption}
                <div className="text-white/40 text-xs font-body mt-1">
                  {currentIndex + 1} / {images.length}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;

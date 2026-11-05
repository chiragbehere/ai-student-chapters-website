import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize, Minimize, Download, Presentation } from 'lucide-react';

interface SlideViewerProps {
  title: string;
  slides: string[];
  downloadUrl: string;
  fallbackEmbedUrl?: string;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  title,
  slides,
  downloadUrl,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-play timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && totalSlides > 0) {
      interval = setInterval(nextSlide, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide, totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, nextSlide, prevSlide]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!slides || slides.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={`club-card overflow-hidden flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-0 z-[100] bg-[#101A14] text-[#E8DCC4] p-4 sm:p-6 justify-center' : 'p-4 sm:p-6 md:p-8 space-y-4'
      }`}
    >
      {/* Title & Badge Header */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8DCC4]/15 pb-3 gap-2">
          <h3 className="text-base sm:text-lg font-heading font-bold text-[#E8DCC4] flex items-center gap-2 leading-snug">
            <Presentation size={18} className="text-[#8B5CF6] shrink-0" /> 
            <span>{title}</span>
          </h3>
          <span className="px-3 py-1 bg-[#8B5CF6] text-white font-mono text-[10px] sm:text-xs font-bold uppercase rounded-lg shrink-0 w-fit shadow-[0_0_12px_rgba(139,92,246,0.4)]">
            SLIDE DECK ({totalSlides} SLIDES)
          </span>
        </div>
      )}

      {/* Main Slide Display Stage */}
      <div className="relative aspect-[16/9] w-full bg-[#101A14] border border-[#E8DCC4]/15 rounded-xl overflow-hidden flex items-center justify-center group shadow-md">
        <img
          src={slides[currentIndex]}
          alt={`${title} - Slide ${currentIndex + 1}`}
          className="w-full h-full object-contain select-none transition-all duration-300"
        />

        {/* Overlay Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#142B20]/80 hover:bg-[#8B5CF6] text-[#E8DCC4] hover:text-white border border-[#E8DCC4]/20 flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-lg cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#142B20]/80 hover:bg-[#8B5CF6] text-[#E8DCC4] hover:text-white border border-[#E8DCC4]/20 flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-lg cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Top Floating Badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-3 py-1 bg-[#142B20]/85 backdrop-blur-md text-[#E8DCC4] font-mono text-[10px] sm:text-xs font-bold rounded-lg border border-[#E8DCC4]/20">
          Slide {currentIndex + 1} / {totalSlides}
        </div>
      </div>

      {/* Mobile-Responsive Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-2.5 sm:p-3 bg-[#142B20] border border-[#E8DCC4]/15 rounded-xl gap-2 overflow-hidden">
        {/* Navigation & Auto Play */}
        <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={prevSlide}
              className="px-2.5 py-1.5 bg-[#193426] border border-[#E8DCC4]/20 hover:border-[#8B5CF6] text-[#E8DCC4] font-mono text-[10px] sm:text-xs font-bold rounded-lg transition-all flex items-center gap-1 active:scale-95 shrink-0 cursor-pointer"
            >
              <ChevronLeft size={13} /> <span>Prev</span>
            </button>
            <button
              onClick={nextSlide}
              className="px-2.5 py-1.5 bg-[#193426] border border-[#E8DCC4]/20 hover:border-[#8B5CF6] text-[#E8DCC4] font-mono text-[10px] sm:text-xs font-bold rounded-lg transition-all flex items-center gap-1 active:scale-95 shrink-0 cursor-pointer"
            >
              <span>Next</span> <ChevronRight size={13} />
            </button>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 border font-mono text-[10px] sm:text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 active:scale-95 shrink-0 cursor-pointer ${
              isPlaying
                ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                : 'bg-[#193426] text-[#E8DCC4] border-[#E8DCC4]/20 hover:border-[#8B5CF6]'
            }`}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>
        </div>

        {/* Fullscreen & Download */}
        <div className="flex items-center justify-between sm:justify-end gap-2 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-[#E8DCC4]/10 shrink-0">
          <button
            onClick={toggleFullscreen}
            className="px-2.5 py-1.5 bg-[#193426] border border-[#E8DCC4]/20 hover:border-[#8B5CF6] text-[#E8DCC4] font-mono text-[10px] sm:text-xs font-bold rounded-lg transition-all flex items-center gap-1 active:scale-95 shrink-0 cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
            <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
          {!isFullscreen && (
            <a
              href={downloadUrl}
              download
              className="btn-primary px-3 py-1.5 text-[10px] sm:text-xs font-mono font-bold uppercase flex items-center gap-1.5 active:scale-95 shrink-0 leading-none"
            >
              <Download size={13} /> <span>(.PPTX)</span>
            </a>
          )}
        </div>
      </div>

      {/* Thumbnail Bar */}
      {!isFullscreen && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin pt-1">
          {slides.map((slideImg, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-16 sm:w-20 aspect-video rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'border-[#8B5CF6] scale-105 shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                  : 'border-[#E8DCC4]/20 opacity-60 hover:opacity-100 hover:border-[#E8DCC4]/40'
              }`}
            >
              <img src={slideImg} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              <span className="absolute bottom-0.5 right-0.5 px-1 bg-black/80 text-white font-mono text-[9px] font-bold rounded">
                {idx + 1}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlideViewer;

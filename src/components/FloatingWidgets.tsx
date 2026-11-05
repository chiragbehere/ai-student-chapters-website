import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageCircle, Mail, ChevronUp } from 'lucide-react';
import { IconInstagram } from './SocialIcons';
import ChatbotWidget from './ChatbotWidget';
import { CHAPTER_INFO } from '../data/chapterData';

export const FloatingWidgets = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hide on Code Carnival immersive page
  if (location.pathname === '/code-carnival') return null;

  // Watch for any open modal to hide floating widgets completely
  useEffect(() => {
    const checkModal = () => {
      setIsModalOpen(document.body.getAttribute('data-modal-open') === 'true');
    };

    checkModal();
    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-modal-open'] });

    return () => observer.disconnect();
  }, []);

  if (isModalOpen) return null;

  return (
    <>
      {/* AI Chatbot Window */}
      <ChatbotWidget
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
        hideTrigger={true}
      />

      {/* Unified Compact Floating Action Hub */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
        {/* Expanded Speed-Dial Card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.92 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mb-3 w-60 bg-[#142B20]/95 backdrop-blur-md border border-[#E8DCC4]/20 shadow-2xl rounded-2xl p-3 space-y-2 font-body"
            >
              <div className="flex items-center justify-between px-2 py-1 border-b border-[#E8DCC4]/15 mb-1">
                <span className="font-mono text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={11} /> AISC Connect
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-[#C9BDA7] hover:text-[#E8DCC4] transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={13} />
                </button>
              </div>

              {/* 1. AI Chatbot Trigger */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsChatOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#8B5CF6] text-white hover:bg-[#A78BFA] transition-all text-left text-xs font-heading font-bold uppercase tracking-wider group cursor-pointer shadow-md"
              >
                <div className="w-6 h-6 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0">
                  <Sparkles size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block leading-none">ChaptersBot AI</span>
                  <span className="text-[9px] font-mono font-normal opacity-90 block truncate">Instant Q&A Assistant</span>
                </div>
              </button>

              {/* 2. WhatsApp Community */}
              <a
                href={CHAPTER_INFO.whatsappGroup}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#193426] hover:bg-[#25D366] hover:text-white text-[#E8DCC4] border border-[#E8DCC4]/10 transition-all text-xs font-mono font-medium group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <MessageCircle size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold block leading-none">WhatsApp Group</span>
                  <span className="text-[9px] text-[#C9BDA7] group-hover:text-white/90 block truncate">Community & Updates</span>
                </div>
              </a>

              {/* 3. Email Us */}
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${CHAPTER_INFO.contactEmail}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#193426] hover:bg-[#EA4335] hover:text-white text-[#E8DCC4] border border-[#E8DCC4]/10 transition-all text-xs font-mono font-medium group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-[#EA4335] text-white flex items-center justify-center shrink-0">
                  <Mail size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold block leading-none">Email Club</span>
                  <span className="text-[9px] text-[#C9BDA7] group-hover:text-white/90 block truncate">Official Inquiries</span>
                </div>
              </a>

              {/* 4. Instagram */}
              <a
                href={CHAPTER_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#193426] hover:bg-[#dc2743] hover:text-white text-[#E8DCC4] border border-[#E8DCC4]/10 transition-all text-xs font-mono font-medium group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shrink-0">
                  <IconInstagram size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold block leading-none">Instagram</span>
                  <span className="text-[9px] text-[#C9BDA7] group-hover:text-white/90 block truncate">@ai.student_chapters</span>
                </div>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary Floating Action Pill / FAB */}
        <div className="flex items-center gap-2">
          {/* Direct AI trigger on desktop */}
          <button
            onClick={() => {
              setIsOpen(false);
              setIsChatOpen(true);
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:bg-[#A78BFA] hover:shadow-[0_0_28px_rgba(139,92,246,0.6)] transition-all duration-200 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer border border-[#8B5CF6]/50"
            title="Ask ChaptersBot AI"
          >
            <Sparkles size={14} className="animate-spin-slow" />
            <span>Ask AI</span>
          </button>

          {/* Social & Connect Hub Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-11 h-11 rounded-full text-[#E8DCC4] shadow-xl flex items-center justify-center border border-[#E8DCC4]/20 transition-all duration-200 cursor-pointer ${
              isOpen
                ? 'bg-[#8B5CF6] text-white rotate-90 scale-105 shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                : 'bg-[#142B20] hover:bg-[#193426] hover:text-white hover:scale-105'
            }`}
            aria-label={isOpen ? 'Close Quick Hub' : 'Open Connect Hub'}
            title="Connect & Social Hub"
          >
            {isOpen ? <X size={18} /> : <ChevronUp size={18} className="animate-bounce" />}
          </button>
        </div>
      </div>
    </>
  );
};

export default FloatingWidgets;

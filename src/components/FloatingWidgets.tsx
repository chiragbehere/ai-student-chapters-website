import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Sparkles } from 'lucide-react';
import ChatbotWidget from './ChatbotWidget';
import WhatsAppWidget from './WhatsAppWidget';
import EmailWidget from './EmailWidget';
import InstagramWidget from './InstagramWidget';

export const FloatingWidgets = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Hide on Code Carnival immersive page
  if (location.pathname === '/code-carnival') return null;

  return (
    <>
      {/* Desktop View: Render standard vertical floating stack */}
      <div className="hidden sm:block">
        <ChatbotWidget />
        <WhatsAppWidget />
        <EmailWidget />
        <InstagramWidget />
      </div>

      {/* Mobile / Small Screen View (< 640px): Seamless unified bottom dock */}
      <div className="sm:hidden">
        {/* Render Chatbot Modal with custom trigger */}
        <ChatbotWidget
          isOpen={isChatOpen}
          onOpenChange={setIsChatOpen}
          hideTrigger={true}
        />

        {/* Unified Bottom Floating Dock on Mobile */}
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5">
          {/* Quick Links Speed Dial */}
          <div className="relative">
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute bottom-full right-0 mb-3 flex flex-col items-end gap-2.5"
                >
                  {/* WhatsApp */}
                  <a
                    href="https://chat.whatsapp.com/FQdz9mHb4y37ooH1JxiYoF"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25D366] text-white shadow-lg text-xs font-bold font-mono active:scale-95 whitespace-nowrap"
                  >
                    <span>WhatsApp Group</span>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.488-1.761-1.663-2.059-.175-.297-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=imrdaistudentclub@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-[#0a0a0a] border border-[#cdd6cd] shadow-lg text-xs font-bold font-mono active:scale-95 whitespace-nowrap"
                  >
                    <span>Email Us</span>
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="url(#gmail-gradient-mob)"/>
                        <defs>
                          <linearGradient id="gmail-gradient-mob" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#EA4335"/>
                            <stop offset="0.33" stopColor="#FBBC04"/>
                            <stop offset="0.66" stopColor="#34A853"/>
                            <stop offset="1" stopColor="#4285F4"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/ai.student_chapters/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg text-xs font-bold font-mono active:scale-95 whitespace-nowrap"
                  >
                    <span>Instagram</span>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                    </div>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Links Toggle Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="w-11 h-11 rounded-full bg-[#0a0a0a] text-white shadow-lg flex items-center justify-center border-2 border-white active:scale-95 transition-transform"
              aria-label="Toggle Quick Links"
              title="Social & Contact Links"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Share2 size={18} />}
            </button>
          </div>

          {/* ChaptersBot AI Trigger Button */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsChatOpen(true);
            }}
            className="w-11 h-11 rounded-full bg-[#008736] text-white shadow-xl shadow-[#008736]/30 flex items-center justify-center border-2 border-white active:scale-95 transition-transform relative"
            aria-label="Open ChaptersBot AI"
            title="Chat with ChaptersBot AI"
          >
            <Sparkles size={18} />
            <span className="absolute -top-1 -left-1 px-1 py-0.5 bg-[#0a0a0a] text-white text-[7px] font-bold rounded-full uppercase tracking-wider shadow-sm">
              AI
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default FloatingWidgets;

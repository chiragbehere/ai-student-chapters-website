import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { CHAPTER_INFO } from '../data/chapterData';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    classStream: 'IMCA-I',
    primaryInterest: 'AI & Machine Learning',
  });
  const [submitted, setSubmitted] = useState(false);

  // Lock body scroll and mark modal open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.setAttribute('data-modal-open', 'true');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.removeAttribute('data-modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      classStream: 'IMCA-I',
      primaryInterest: 'AI & Machine Learning',
    });
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#193426] text-[#E8DCC4] border border-[#E8DCC4]/20 p-6 sm:p-8 shadow-2xl my-auto font-body max-h-[92vh] overflow-y-auto rounded-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#C9BDA7] hover:text-[#E8DCC4] bg-[#142B20] hover:bg-[#1F3D2B] border border-[#E8DCC4]/15 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {!submitted ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#8B5CF6] font-mono text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} /> JOIN THE CHAPTER
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#E8DCC4]">
                Get AISC Passes
              </h3>
              <p className="text-[#C9BDA7] text-sm font-body">
                Connect with student builders, participate in hackathons, and master cutting-edge AI.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#E8DCC4] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Aniruddha Landge"
                    className="club-input w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#E8DCC4] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@gmail.com"
                      className="club-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#E8DCC4] mb-1.5">
                      Class Stream *
                    </label>
                    <select
                      value={formData.classStream}
                      onChange={(e) => setFormData({ ...formData, classStream: e.target.value })}
                      className="club-input w-full"
                    >
                      <option value="IMCA-I" className="bg-[#142B20] text-[#E8DCC4]">IMCA 1st Year</option>
                      <option value="IMCA-II" className="bg-[#142B20] text-[#E8DCC4]">IMCA 2nd Year</option>
                      <option value="IMCA-III" className="bg-[#142B20] text-[#E8DCC4]">IMCA 3rd Year</option>
                      <option value="IMCA-IV" className="bg-[#142B20] text-[#E8DCC4]">IMCA 4th Year</option>
                      <option value="MCA-I" className="bg-[#142B20] text-[#E8DCC4]">MCA 1st Year</option>
                      <option value="MCA-II" className="bg-[#142B20] text-[#E8DCC4]">MCA 2nd Year</option>
                      <option value="Other" className="bg-[#142B20] text-[#E8DCC4]">Other Class</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#E8DCC4] mb-1.5">
                    Primary Interest
                  </label>
                  <select
                    value={formData.primaryInterest}
                    onChange={(e) => setFormData({ ...formData, primaryInterest: e.target.value })}
                    className="club-input w-full"
                  >
                    <option value="AI & Machine Learning" className="bg-[#142B20] text-[#E8DCC4]">AI & Machine Learning</option>
                    <option value="Vibe Coding & Web Apps" className="bg-[#142B20] text-[#E8DCC4]">Vibe Coding & Web Apps</option>
                    <option value="Hackathons & Build Sprints" className="bg-[#142B20] text-[#E8DCC4]">Hackathons & Build Sprints</option>
                    <option value="AI Research & Paper Reading" className="bg-[#142B20] text-[#E8DCC4]">AI Research & Paper Reading</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3.5 sm:py-4 px-6 text-sm font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  <span>Submit Application</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#E8DCC4]">Application Received!</h3>
              <p className="text-[#C9BDA7] text-sm">
                Welcome to <span className="text-[#8B5CF6] font-bold">{CHAPTER_INFO.name}</span>. Join our WhatsApp community group to get lab updates and hackathon passes.
              </p>
              <div className="space-y-3 pt-2">
                <a
                  href={CHAPTER_INFO.whatsappGroup}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full py-3.5 px-6 font-heading font-bold text-xs uppercase tracking-wider text-center block cursor-pointer"
                >
                  Join Official WhatsApp Group ↗
                </a>
                <button
                  onClick={handleReset}
                  className="text-xs font-mono text-[#C9BDA7] hover:text-[#E8DCC4] py-2 cursor-pointer transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default JoinModal;

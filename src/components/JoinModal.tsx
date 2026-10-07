import React, { useState } from 'react';
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-[#ffffff] text-[#0a0a0a] border border-[#cdd6cd] p-6 sm:p-8 shadow-2xl z-10 my-auto font-body"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-slate-500 hover:text-black bg-[#f4f6f2] hover:bg-[#e2e7e2] border border-[#cdd6cd]"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#008736] font-mono text-xs font-bold uppercase tracking-widest">
                  <Sparkles size={14} /> JOIN THE MOVEMENT
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0a0a0a]">
                  Get AISC Passes
                </h3>
                <p className="text-slate-600 text-sm font-body">
                  Connect with student builders, participate in hackathons, and master cutting-edge AI.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#0a0a0a] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Aniruddha Landge"
                      className="w-full px-4 py-3 bg-[#f4f6f2] border border-[#cdd6cd] text-[#0a0a0a] placeholder-slate-400 focus:outline-none focus:border-[#008736] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-[#0a0a0a] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@gmail.com"
                        className="w-full px-4 py-3 bg-[#f4f6f2] border border-[#cdd6cd] text-[#0a0a0a] placeholder-slate-400 focus:outline-none focus:border-[#008736] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-[#0a0a0a] mb-1">
                        Class Stream *
                      </label>
                      <select
                        value={formData.classStream}
                        onChange={(e) => setFormData({ ...formData, classStream: e.target.value })}
                        className="w-full px-4 py-3 bg-[#f4f6f2] border border-[#cdd6cd] text-[#0a0a0a] focus:outline-none focus:border-[#008736] text-sm"
                      >
                        <option value="IMCA-I">IMCA 1st Year</option>
                        <option value="IMCA-II">IMCA 2nd Year</option>
                        <option value="IMCA-III">IMCA 3rd Year</option>
                        <option value="IMCA-IV">IMCA 4th Year</option>
                        <option value="MCA-I">MCA 1st Year</option>
                        <option value="MCA-II">MCA 2nd Year</option>
                        <option value="Other">Other Class</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#0a0a0a] mb-1">
                      Primary Interest
                    </label>
                    <select
                      value={formData.primaryInterest}
                      onChange={(e) => setFormData({ ...formData, primaryInterest: e.target.value })}
                      className="w-full px-4 py-3 bg-[#f4f6f2] border border-[#cdd6cd] text-[#0a0a0a] focus:outline-none focus:border-[#008736] text-sm"
                    >
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Vibe Coding & Web Apps">Vibe Coding & Web Apps</option>
                      <option value="Hackathons & Build Sprints">Hackathons & Build Sprints</option>
                      <option value="AI Research & Paper Reading">AI Research & Paper Reading</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-green w-full py-4 px-6 text-sm font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Submit Application</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-[#e6f4ea] text-[#008736] border border-[#a8d5b5] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-display font-bold text-[#0a0a0a]">Application Received!</h3>
                <p className="text-slate-600 text-sm">
                  Welcome to <span className="text-[#008736] font-bold">{CHAPTER_INFO.name}</span>. Join our WhatsApp community group to get lab updates and hackathon passes.
                </p>
                <div className="space-y-2 pt-2">
                  <a
                    href={CHAPTER_INFO.whatsappGroup}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-green w-full py-3.5 px-6 font-heading font-bold text-xs uppercase tracking-wider text-center block"
                  >
                    Join Official WhatsApp Group ↗
                  </a>
                  <button
                    onClick={handleReset}
                    className="text-xs font-mono text-slate-500 hover:text-black py-2"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JoinModal;

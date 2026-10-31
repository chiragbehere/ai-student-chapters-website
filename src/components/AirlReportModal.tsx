// AirlReportModal.tsx
// Comprehensive Official Report & Winners Showcase Modal for AI Research League 2.0 (AY 2026-27)
import React, { useState } from 'react';
import {
  X,
  Trophy,
  Award,
  Medal,
  Download,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText,
  Briefcase,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIRL_2_REPORT } from '../data/airlReportData';

interface AirlReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AirlReportModal: React.FC<AirlReportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'winners' | 'matrix' | 'judges' | 'photos' | 'report'>('winners');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-5xl my-auto bg-[#ecefe9] text-[#0a0a0a] border border-[#cdd6cd] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Title Bar */}
          <div className="px-5 py-4 bg-[#f4f6f2] border-b border-[#cdd6cd] flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008736] animate-pulse shrink-0" />
              <div className="min-w-0">
                <span className="font-mono text-[11px] font-bold tracking-widest text-[#008736] uppercase block truncate">
                  AI STUDENT CHAPTER • IMRD SHIRPUR
                </span>
                <h2 className="font-display font-extrabold text-base sm:text-lg text-[#0a0a0a] truncate leading-tight">
                  AI Research League 2.0 — Official Report & Winners Declaration
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={AIRL_2_REPORT.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#cdd6cd] hover:border-[#008736] text-xs font-mono font-bold text-[#0a0a0a] transition-colors"
                title="Download Official Report PDF"
              >
                <Download size={13} className="text-[#008736]" />
                <span>Download Report PDF</span>
              </a>

              <button
                onClick={onClose}
                className="p-1.5 bg-white border border-[#cdd6cd] text-[#0a0a0a] hover:bg-[#e2e7e2] transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Key Stat Strips */}
          <div className="px-5 py-3 bg-white border-b border-[#cdd6cd] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono shrink-0">
            <div>
              <span className="text-[#525852] text-[10px] uppercase block">Date & Venue</span>
              <span className="font-bold text-[#0a0a0a]">{AIRL_2_REPORT.displayDate} • IMRD</span>
            </div>
            <div>
              <span className="text-[#525852] text-[10px] uppercase block">Participation</span>
              <span className="font-bold text-[#008736]">114 Registered (28 UG, 86 PG)</span>
            </div>
            <div>
              <span className="text-[#525852] text-[10px] uppercase block">Teams</span>
              <span className="font-bold text-[#0a0a0a]">36 Teams (7 UG, 29 PG)</span>
            </div>
            <div>
              <span className="text-[#525852] text-[10px] uppercase block">Framework</span>
              <span className="font-bold text-[#008736]">Combined Overall Ranking</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-5 bg-[#f4f6f2] border-b border-[#cdd6cd] flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
            {[
              { id: 'winners', label: '🏆 Winners & Podiums', icon: Trophy },
              { id: 'matrix', label: '📊 Summary Matrix', icon: Layers },
              { id: 'judges', label: '⚖️ Judges & Rubric', icon: Briefcase },
              { id: 'photos', label: '📸 Event Gallery', icon: ImageIcon },
              { id: 'report', label: '📑 Activity & Outcomes', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2.5 font-mono text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#008736] text-[#008736] bg-white'
                    : 'border-transparent text-[#525852] hover:text-[#0a0a0a]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
            {/* ══════════════════════════════════════════════════
                TAB 1: WINNERS & PODIUMS
               ══════════════════════════════════════════════════ */}
            {activeTab === 'winners' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#cdd6cd] pb-3">
                  <div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-[#0a0a0a]">
                      Official List of Winning Teams
                    </h3>
                    <p className="text-xs text-[#525852] font-mono mt-0.5">
                      Evaluated on a 50-point rubric across PPT research depth and interactive web prototypes.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-[#e6f4ea] text-[#008736] border border-[#008736]/30 text-xs font-mono font-bold uppercase shrink-0">
                    4 Awarded Positions
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {AIRL_2_REPORT.winners.map((team, idx) => (
                    <div
                      key={team.teamId}
                      className={`grid-box p-5 sm:p-6 space-y-4 border ${
                        idx === 0
                          ? 'border-[#ffd700] bg-gradient-to-br from-white via-amber-50/20 to-amber-100/30 shadow-md ring-1 ring-amber-300'
                          : idx === 1
                          ? 'border-slate-300 bg-white'
                          : 'border-[#cdd6cd] bg-white'
                      }`}
                    >
                      {/* Top Header Badge */}
                      <div className="flex items-center justify-between border-b border-[#cdd6cd] pb-2.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider ${
                            idx === 0
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : idx === 1
                              ? 'bg-slate-100 text-slate-800 border border-slate-300'
                              : idx === 2
                              ? 'bg-orange-100 text-orange-900 border border-orange-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}
                        >
                          {idx === 0 ? <Trophy size={13} /> : <Medal size={13} />}
                          <span>{team.rankBadge}</span>
                        </span>

                        <span className="font-mono text-xs font-bold text-[#525852]">
                          ID: {team.teamId}
                        </span>
                      </div>

                      {/* Team Name & Division */}
                      <div>
                        <h4 className="font-display font-extrabold text-xl text-[#0a0a0a] uppercase tracking-tight">
                          {team.teamName}
                        </h4>
                        <span className="text-xs font-mono font-semibold text-[#008736]">
                          {team.category}
                        </span>
                      </div>

                      {/* Project Topic */}
                      <div className="p-3 bg-[#f4f6f2] border border-[#cdd6cd]">
                        <span className="text-[10px] font-mono text-[#525852] uppercase font-bold block mb-1">
                          Research Topic / Project Title:
                        </span>
                        <p className="font-body text-xs sm:text-sm font-semibold text-[#0a0a0a] leading-snug">
                          {team.projectTitle}
                        </p>
                      </div>

                      {/* Team Members */}
                      <div>
                        <span className="text-[10px] font-mono text-[#525852] uppercase font-bold block mb-1.5">
                          Team Members:
                        </span>
                        <ul className="space-y-1 text-xs font-mono text-[#0a0a0a]">
                          {team.members.map((member, mIdx) => (
                            <li key={mIdx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#008736]" />
                              <span className={mIdx === 0 ? 'font-bold text-[#0a0a0a]' : ''}>
                                {member}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Special Note if any */}
                      {team.specialNote && (
                        <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-body leading-relaxed">
                          <strong>Jury Citation:</strong> {team.specialNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Prize Distribution Callout */}
                <div className="p-4 bg-white border border-[#cdd6cd] flex items-start gap-3">
                  <Award size={22} className="text-[#008736] shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs text-[#0a0a0a] font-body">
                    <strong className="block font-heading uppercase text-[#0a0a0a]">
                      Prize Distribution & Awards Ceremony
                    </strong>
                    <p className="text-[#4e554e] leading-relaxed">
                      Winning teams were awarded trophy mementos, official certificates of achievement, and cash prizes during the valedictory session by the Director, Department HODs, and invited guest judges.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                TAB 2: SUMMARY MATRIX TABLE
               ══════════════════════════════════════════════════ */}
            {activeTab === 'matrix' && (
              <div className="space-y-4">
                <div className="border-b border-[#cdd6cd] pb-2">
                  <h3 className="font-display font-bold text-xl text-[#0a0a0a]">
                    Official Winners Summary Matrix
                  </h3>
                  <p className="text-xs text-[#525852] font-mono">
                    Official record from AI Research League 2.0 evaluation documentation.
                  </p>
                </div>

                <div className="overflow-x-auto border border-[#cdd6cd] bg-white">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#f4f6f2] border-b border-[#cdd6cd] text-[#0a0a0a] uppercase font-bold text-[11px]">
                      <tr>
                        <th className="p-3 border-r border-[#cdd6cd]">Position / Award</th>
                        <th className="p-3 border-r border-[#cdd6cd]">Team Name</th>
                        <th className="p-3 border-r border-[#cdd6cd]">Team ID</th>
                        <th className="p-3 border-r border-[#cdd6cd]">Division & Class</th>
                        <th className="p-3">Project Domain / Research Title</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#cdd6cd]">
                      {AIRL_2_REPORT.winners.map((team) => (
                        <tr key={team.teamId} className="hover:bg-[#f9faf8]">
                          <td className="p-3 border-r border-[#cdd6cd] font-bold text-[#008736] whitespace-nowrap">
                            {team.rank}
                          </td>
                          <td className="p-3 border-r border-[#cdd6cd] font-bold text-[#0a0a0a] whitespace-nowrap">
                            {team.teamName}
                          </td>
                          <td className="p-3 border-r border-[#cdd6cd] text-[#525852] whitespace-nowrap">
                            {team.teamId}
                          </td>
                          <td className="p-3 border-r border-[#cdd6cd] text-[#0a0a0a] whitespace-nowrap">
                            {team.category.replace(' Division', '')}
                          </td>
                          <td className="p-3 font-body font-medium text-[#0a0a0a]">
                            {team.projectTitle}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Division Breakdown Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs font-mono">
                  <div className="p-4 bg-white border border-[#cdd6cd]">
                    <span className="font-bold text-[#008736] block mb-1">
                      UG DIVISION (7 TEAMS / 28 PARTICIPANTS)
                    </span>
                    <p className="text-[#525852] leading-relaxed">
                      MCA (Integrated) 2nd & 3rd years. Focused on campus communication, water quality monitoring, community safety, and fraud detection.
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-[#cdd6cd]">
                    <span className="font-bold text-[#008736] block mb-1">
                      PG DIVISION (29 TEAMS / 86 PARTICIPANTS)
                    </span>
                    <p className="text-[#525852] leading-relaxed">
                      MCA (Integrated) 4th & 5th years, and regular MCA 1st & 2nd years. Covered kernel security, sign language translation, ATM demand prediction, and clinical support.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                TAB 3: JUDGES & RUBRIC
               ══════════════════════════════════════════════════ */}
            {activeTab === 'judges' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#0a0a0a] mb-1">
                    Chief Guests & Industry Expert Judges
                  </h3>
                  <p className="text-xs text-[#525852] font-mono">
                    Evaluation conducted by distinguished industry practitioners and alumni:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {AIRL_2_REPORT.judges.map((judge, idx) => (
                    <div key={idx} className="grid-box p-5 bg-white space-y-3 border border-[#cdd6cd]">
                      <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#008736] flex items-center justify-center font-display font-extrabold text-sm border border-[#008736]/20">
                        0{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-base text-[#0a0a0a]">
                          {judge.name}
                        </h4>
                        <span className="text-xs font-mono font-semibold text-[#008736] block">
                          {judge.designation}
                        </span>
                        <span className="text-xs font-mono text-[#525852] block font-bold mt-0.5">
                          {judge.company}
                        </span>
                      </div>
                      <p className="text-xs text-[#525852] font-body leading-relaxed pt-2 border-t border-[#cdd6cd]">
                        {judge.note}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Scoring Rubric Section */}
                <div className="pt-4 border-t border-[#cdd6cd]">
                  <h3 className="font-display font-bold text-xl text-[#0a0a0a] mb-2">
                    50-Point Evaluation Rubric
                  </h3>
                  <p className="text-xs text-[#525852] font-mono mb-4">
                    Teams were judged across five core criteria (1 to 10 points each):
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {AIRL_2_REPORT.scoringRubric.map((criterion, idx) => (
                      <div key={idx} className="p-4 bg-white border border-[#cdd6cd] space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-[#008736]">CRITERION #{idx + 1}</span>
                          <span className="px-2 py-0.5 bg-[#e2e7e2] font-bold text-[#0a0a0a] rounded">
                            {criterion.points} PTS
                          </span>
                        </div>
                        <h5 className="font-heading font-bold text-sm text-[#0a0a0a]">
                          {criterion.name}
                        </h5>
                        <p className="text-xs text-[#525852] font-body leading-relaxed">
                          {criterion.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                TAB 4: EVENT GALLERY
               ══════════════════════════════════════════════════ */}
            {activeTab === 'photos' && (
              <div className="space-y-4">
                <div className="border-b border-[#cdd6cd] pb-2">
                  <h3 className="font-display font-bold text-xl text-[#0a0a0a]">
                    Official Event Photo Documentation
                  </h3>
                  <p className="text-xs text-[#525852] font-mono">
                    Captured moments from presentations, evaluations, and the valedictory award session.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {AIRL_2_REPORT.photos.map((photo, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPhoto(photo.url)}
                      className="grid-box group overflow-hidden bg-white border border-[#cdd6cd] cursor-pointer flex flex-col justify-between"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-[#181818] relative">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 text-white text-[10px] font-mono uppercase tracking-wider backdrop-blur-sm">
                          {photo.category}
                        </span>
                      </div>
                      <div className="p-3 bg-white border-t border-[#cdd6cd]">
                        <p className="text-xs text-[#0a0a0a] font-mono leading-snug line-clamp-2">
                          {photo.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                TAB 5: ACTIVITY REPORT & OUTCOMES
               ══════════════════════════════════════════════════ */}
            {activeTab === 'report' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#0a0a0a] mb-2">
                    Need of Activity & Core Objectives
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4e554e] font-body leading-relaxed bg-white p-4 border border-[#cdd6cd]">
                    {AIRL_2_REPORT.needOfActivity}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Objectives */}
                  <div className="p-5 bg-white border border-[#cdd6cd] space-y-3">
                    <span className="font-mono text-xs font-bold text-[#008736] uppercase tracking-wider block">
                      KEY OBJECTIVES
                    </span>
                    <ul className="space-y-2 text-xs font-body text-[#0a0a0a]">
                      {AIRL_2_REPORT.objectives.map((obj, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-[#008736] shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Outcomes */}
                  <div className="p-5 bg-white border border-[#cdd6cd] space-y-3">
                    <span className="font-mono text-xs font-bold text-[#008736] uppercase tracking-wider block">
                      MEASURABLE OUTCOMES
                    </span>
                    <ul className="space-y-2.5 text-xs font-body text-[#0a0a0a]">
                      {AIRL_2_REPORT.outcomes.map((out, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Sparkles size={14} className="text-[#008736] shrink-0 mt-0.5" />
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Preparatory Workshops Timeline */}
                <div className="p-5 bg-white border border-[#cdd6cd] space-y-3">
                  <span className="font-mono text-xs font-bold text-[#008736] uppercase tracking-wider block">
                    PREPARATORY WORKSHOPS & TIMELINE
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {AIRL_2_REPORT.preparatoryWorkshops.map((ws, idx) => (
                      <div key={idx} className="p-3 bg-[#f4f6f2] border border-[#cdd6cd] space-y-1">
                        <h5 className="font-heading font-bold text-xs text-[#0a0a0a]">
                          {ws.title}
                        </h5>
                        <p className="text-[11px] text-[#525852] font-body leading-relaxed">
                          {ws.description}
                        </p>
                        <span className="text-[10px] font-mono text-[#008736] block font-semibold pt-1">
                          Led by: {ws.leads}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 12 Problem Statement Domains */}
                <div className="p-5 bg-white border border-[#cdd6cd] space-y-3">
                  <span className="font-mono text-xs font-bold text-[#008736] uppercase tracking-wider block">
                    12 RESEARCH DOMAINS IN PROBLEM BANK
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    {AIRL_2_REPORT.problemStatementDomains.map((dom, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[#f4f6f2] border border-[#cdd6cd] text-[#0a0a0a]">
                        • {dom}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-5 py-3.5 bg-[#f4f6f2] border-t border-[#cdd6cd] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono shrink-0">
            <span className="text-[#525852]">
              R. C. Patel Educational Trust&apos;s IMRD, Shirpur • AI Student Chapter
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={AIRL_2_REPORT.pdfUrl}
                download
                className="btn-green py-2 px-4 text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                <Download size={14} />
                <span>Download Report PDF</span>
              </a>
              <button
                onClick={onClose}
                className="py-2 px-4 grid-box font-mono font-bold text-xs uppercase tracking-wider text-[#0a0a0a] hover:bg-[#e2e7e2] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>

        {/* Lightbox for Single Photo View */}
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 cursor-zoom-out"
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <img
                src={selectedPhoto}
                alt="Enlarged event moment"
                className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-2 right-2 p-2 bg-black/70 text-white rounded-full hover:bg-black"
                aria-label="Close Preview"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default AirlReportModal;

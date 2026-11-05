// AirlReportPage.tsx
// Dedicated Full-Page Report & Winners Showcase for AI Research League 2.0 (AY 2026-27)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
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
  ArrowLeft,
  X,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { AIRL_2_REPORT, type WinningTeam, type IndustryJudge, type ScoringCriterion } from '../data/airlReportData';

export const AirlReportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'winners' | 'matrix' | 'judges' | 'photos' | 'report'>('winners');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${AIRL_2_REPORT.eventName} Report & Winners Declaration`,
        text: `Check out the official report and winners of AI Research League 2.0 at IMRD Shirpur!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reportSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${AIRL_2_REPORT.eventName} — Official Report & Winners Declaration`,
    "description": "Comprehensive official competition report, winners matrix, jury citation, and 50-point rubric breakdown for AI Research League 2.0 at RCPET's IMRD, Shirpur.",
    "datePublished": "2026-09-19",
    "author": {
      "@type": "EducationalOrganization",
      "name": "AI Student Chapters, RCPET's IMRD, Shirpur"
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#1F3D2B] text-[#E8DCC4] font-body py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO
        title={`${AIRL_2_REPORT.eventName} — Official Report & Winners | RCPIMRD`}
        description="Official results, winning teams, industry jury panel, 50-point rubric, and 13-page report documentation for AI Research League 2.0 at RCPET's IMRD, Shirpur."
        url="https://aistudentchapter.vercel.app/events/ai-research-league-2"
        schema={reportSchema}
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Events", item: "/events" },
          { name: "AI Research League 2.0 Report", item: "/events/ai-research-league-2" },
        ]}
      />

      {/* ── Top Navigation Bar ── */}
      <nav className="flex items-center justify-between pb-6 mb-8 border-b border-[#E8DCC4]/15">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#8B5CF6] hover:text-[#A78BFA] uppercase tracking-wider group transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Events</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#142B20] border border-[#E8DCC4]/15 hover:border-[#8B5CF6] rounded-xl text-xs font-mono font-bold text-[#E8DCC4] transition-colors cursor-pointer shadow-xs"
            title="Share page"
          >
            <Share2 size={13} className="text-[#8B5CF6]" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <a
            href={AIRL_2_REPORT.pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider cursor-pointer shadow-md"
            title="Download Official 13-Page PDF"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Download Report PDF</span>
            <span className="sm:hidden">PDF</span>
          </a>
        </div>
      </nav>

      {/* ── Main Hero Card ── */}
      <header className="club-card p-6 sm:p-10 mb-8 space-y-6 relative overflow-hidden bg-club-dots border-[#E8DCC4]/20 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DCC4]/15 pb-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest bg-[#142B20] px-3.5 py-1 rounded-full border border-[#E8DCC4]/15">
            <Sparkles size={14} /> OFFICIAL POST-EVENT REPORT • AY 2026–27
          </div>
          <span className="font-mono text-xs text-[#C9BDA7] font-semibold">
            ORG: {AIRL_2_REPORT.organizedBy}
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-[#E8DCC4] uppercase tracking-tight leading-none">
            {AIRL_2_REPORT.eventName}
          </h1>
          <p className="text-base sm:text-lg text-[#C9BDA7] font-body max-w-4xl leading-relaxed">
            Premier campus research tournament where 114 participants across 36 UG & PG student teams built working AI web prototypes, defended their methodologies before industry judges from Tata Technologies, Hitachi Energy, and Aditya Birla Capital, and competed under a unified 50-point rubric.
          </p>
        </div>

        {/* Key Event Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E8DCC4]/15 font-mono">
          <div className="bg-[#142B20] p-4 rounded-xl border border-[#E8DCC4]/15 space-y-1">
            <span className="text-[10px] text-[#C9BDA7] uppercase block tracking-wider">Date & Venue</span>
            <span className="font-bold text-sm text-[#E8DCC4] block">{AIRL_2_REPORT.displayDate}</span>
            <span className="text-[11px] text-[#C9BDA7] block truncate">{AIRL_2_REPORT.venue}</span>
          </div>

          <div className="bg-[#142B20] p-4 rounded-xl border border-[#E8DCC4]/15 space-y-1">
            <span className="text-[10px] text-[#C9BDA7] uppercase block tracking-wider">Participation</span>
            <span className="font-bold text-sm text-[#8B5CF6] block">114 Builders</span>
            <span className="text-[11px] text-[#C9BDA7] block">28 UG + 86 PG Students</span>
          </div>

          <div className="bg-[#142B20] p-4 rounded-xl border border-[#E8DCC4]/15 space-y-1">
            <span className="text-[10px] text-[#C9BDA7] uppercase block tracking-wider">Squad Count</span>
            <span className="font-bold text-sm text-[#E8DCC4] block">36 Teams</span>
            <span className="text-[11px] text-[#C9BDA7] block">7 UG Teams + 29 PG Teams</span>
          </div>

          <div className="bg-[#142B20] p-4 rounded-xl border border-[#E8DCC4]/15 space-y-1">
            <span className="text-[10px] text-[#C9BDA7] uppercase block tracking-wider">Evaluation</span>
            <span className="font-bold text-sm text-[#8B5CF6] block">50-Point Rubric</span>
            <span className="text-[11px] text-[#C9BDA7] block">Combined Overall Ranking</span>
          </div>
        </div>
      </header>

      {/* ── In-Page Tab Navigation ── */}
      <div className="w-full pb-4 border-b border-[#E8DCC4]/15 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'winners', label: '🏆 Podiums & Winning Teams', icon: Trophy },
            { id: 'matrix', label: '📊 Official Summary Matrix', icon: Layers },
            { id: 'judges', label: '⚖️ Industry Judges & Rubric', icon: Briefcase },
            { id: 'photos', label: '📸 Event Photo Documentation', icon: ImageIcon },
            { id: 'report', label: '📑 Activity & Outcomes', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 rounded-xl border transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                    : 'bg-[#142B20] text-[#E8DCC4] border-[#E8DCC4]/15 hover:border-[#8B5CF6]/50 hover:bg-[#193426]'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-white' : 'text-[#8B5CF6]'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content Area ── */}
      <main className="space-y-8">
        {/* TAB 1: 🏆 PODIUMS & WINNERS */}
        {activeTab === 'winners' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E8DCC4]/15 pb-3">
              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#E8DCC4]">
                  Official List of Winning Teams
                </h2>
                <p className="text-xs sm:text-sm text-[#C9BDA7] font-mono mt-1">
                  Evaluated across presentation depth, methodology, and working interactive web prototypes.
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-[#8B5CF6] bg-[#142B20] px-3 py-1 rounded-full border border-[#E8DCC4]/15 uppercase">
                4 Awarded Positions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {AIRL_2_REPORT.winners.map((team: WinningTeam) => (
                <article
                  key={team.teamId}
                  className="club-card club-card-hover p-6 sm:p-7 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Position Header */}
                    <div className="flex items-center justify-between border-b border-[#E8DCC4]/15 pb-3">
                      <div className="flex items-center gap-2">
                        {team.rank.includes('1st') ? (
                          <Trophy size={18} className="text-amber-400" />
                        ) : team.rank.includes('2nd') ? (
                          <Award size={18} className="text-sky-400" />
                        ) : team.rank.includes('3rd') ? (
                          <Medal size={18} className="text-amber-600" />
                        ) : (
                          <CheckCircle2 size={18} className="text-[#8B5CF6]" />
                        )}
                        <span className="font-heading font-black text-xs uppercase tracking-wider text-[#E8DCC4]">
                          {team.rankBadge}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#C9BDA7] bg-[#142B20] px-2.5 py-0.5 rounded border border-[#E8DCC4]/15">
                        ID: {team.teamId}
                      </span>
                    </div>

                    {/* Team Name & Division */}
                    <div>
                      <h3 className="font-display font-black text-2xl text-[#E8DCC4]">
                        {team.teamName}
                      </h3>
                      <p className="font-mono text-xs text-[#8B5CF6] font-bold mt-1">
                        {team.category}
                      </p>
                    </div>

                    {/* Project Topic */}
                    <div className="p-3.5 bg-[#142B20] rounded-xl border border-[#E8DCC4]/15 space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9BDA7] block font-bold">
                        RESEARCH TOPIC / PROJECT TITLE:
                      </span>
                      <p className="font-heading font-bold text-sm text-[#E8DCC4] leading-snug">
                        {team.projectTitle}
                      </p>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9BDA7] block font-bold">
                        TEAM MEMBERS:
                      </span>
                      <ul className="space-y-1 text-xs font-body">
                        {team.members.map((m: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-[#E8DCC4]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shrink-0" />
                            <span className={m.includes('(Team Leader)') ? 'font-bold text-[#8B5CF6]' : ''}>
                              {m}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Special Jury Note */}
                    {team.specialNote && (
                      <div className="p-3 bg-[#142B20] rounded-xl border border-[#8B5CF6]/30 text-xs font-body text-[#E8DCC4] space-y-1">
                        <span className="font-mono text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider block">
                          JURY COMMENDATION:
                        </span>
                        <p className="text-[#C9BDA7]">{team.specialNote}</p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: 📊 SUMMARY MATRIX */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="border-b border-[#E8DCC4]/15 pb-3">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#E8DCC4]">
                Official Winners Summary Matrix
              </h2>
              <p className="text-xs sm:text-sm text-[#C9BDA7] font-mono mt-1">
                Official institutional record from the AI Research League 2.0 evaluation documentation.
              </p>
            </div>

            <div className="club-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead className="bg-[#142B20] border-b border-[#E8DCC4]/15 text-[#E8DCC4] uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-3.5 border-r border-[#E8DCC4]/15">Position / Award</th>
                      <th className="p-3.5 border-r border-[#E8DCC4]/15">Team Name</th>
                      <th className="p-3.5 border-r border-[#E8DCC4]/15">Team ID</th>
                      <th className="p-3.5 border-r border-[#E8DCC4]/15">Division & Class</th>
                      <th className="p-3.5">Project Domain / Research Title</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DCC4]/10 bg-[#193426]">
                    {AIRL_2_REPORT.winners.map((team: WinningTeam) => (
                      <tr key={team.teamId} className="hover:bg-[#142B20] transition-colors">
                        <td className="p-3.5 border-r border-[#E8DCC4]/15 font-bold text-[#8B5CF6] whitespace-nowrap">
                          {team.rank}
                        </td>
                        <td className="p-3.5 border-r border-[#E8DCC4]/15 font-bold text-[#E8DCC4] whitespace-nowrap">
                          {team.teamName}
                        </td>
                        <td className="p-3.5 border-r border-[#E8DCC4]/15 text-[#C9BDA7] whitespace-nowrap">
                          {team.teamId}
                        </td>
                        <td className="p-3.5 border-r border-[#E8DCC4]/15 text-[#E8DCC4] whitespace-nowrap">
                          {team.category}
                        </td>
                        <td className="p-3.5 text-[#E8DCC4] font-medium leading-relaxed">
                          {team.projectTitle}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Division Breakdown Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="club-card p-6 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8DCC4]/15 pb-2">
                  <span className="font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
                    UG DIVISION (7 TEAMS / 28 PARTICIPANTS)
                  </span>
                  <span className="font-mono text-xs font-bold bg-[#142B20] px-2 py-0.5 rounded border border-[#E8DCC4]/15">
                    IMCA 2nd & 3rd Yr
                  </span>
                </div>
                <p className="text-xs text-[#C9BDA7] font-body leading-relaxed">
                  Focused on campus-centric automation, water monitoring, student management systems, and computer vision utilities. Outstanding achievement by Team AQUASAKSHAM securing 2nd Rank overall in the combined open ranking.
                </p>
              </div>

              <div className="club-card p-6 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8DCC4]/15 pb-2">
                  <span className="font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
                    PG DIVISION (29 TEAMS / 86 PARTICIPANTS)
                  </span>
                  <span className="font-mono text-xs font-bold bg-[#142B20] px-2 py-0.5 rounded border border-[#E8DCC4]/15">
                    MCA & IMCA 4th/5th Yr
                  </span>
                </div>
                <p className="text-xs text-[#C9BDA7] font-body leading-relaxed">
                  Investigated deep kernel-level HID security, automated sign language translation, ATM cash prediction, predictive maintenance, and enterprise ML pipelines with fully deployed web apps.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ⚖️ JUDGES & RUBRIC */}
        {activeTab === 'judges' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="border-b border-[#E8DCC4]/15 pb-3">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#E8DCC4]">
                  Distinguished Industry Jury Panel
                </h2>
                <p className="text-xs sm:text-sm text-[#C9BDA7] font-mono mt-1">
                  Evaluated with rigorous industry benchmark criteria across classroom presentations and live code demos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {AIRL_2_REPORT.judges.map((judge: IndustryJudge, idx: number) => (
                  <div
                    key={idx}
                    className="club-card club-card-hover p-6 space-y-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#142B20] text-[#8B5CF6] border border-[#8B5CF6]/30 flex items-center justify-center font-bold text-sm shadow-sm">
                      {judge.name.charAt(3)}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#E8DCC4]">
                        {judge.name}
                      </h3>
                      <p className="font-mono text-xs text-[#8B5CF6] font-bold">
                        {judge.designation}
                      </p>
                      <p className="font-mono text-xs text-[#C9BDA7] mt-0.5">
                        {judge.company}
                      </p>
                    </div>
                    {judge.note && (
                      <p className="text-xs text-[#C9BDA7] font-body pt-2 border-t border-[#E8DCC4]/10">
                        {judge.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 50-Point Evaluation Rubric */}
            <div className="space-y-4 pt-4 border-t border-[#E8DCC4]/15">
              <div className="border-b border-[#E8DCC4]/15 pb-3">
                <h3 className="font-display font-extrabold text-2xl text-[#E8DCC4]">
                  50-Point Official Evaluation Rubric
                </h3>
                <p className="text-xs text-[#C9BDA7] font-mono mt-1">
                  Standardized 5-criteria grading scale (10 points each) applied across all 36 teams.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {AIRL_2_REPORT.scoringRubric.map((item: ScoringCriterion, idx: number) => (
                  <div
                    key={idx}
                    className="club-card p-5 flex flex-col justify-between space-y-2"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-[#E8DCC4]/15 pb-1.5">
                        <span className="font-stat text-lg font-bold text-[#8B5CF6]">
                          {item.points} pts
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-[#142B20] px-2 py-0.5 rounded font-bold text-[#C9BDA7]">
                          PARAM #{idx + 1}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-xs uppercase text-[#E8DCC4] leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#C9BDA7] font-body leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 📸 EVENT GALLERY */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="border-b border-[#E8DCC4]/15 pb-3">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#E8DCC4]">
                Official Event Photo Documentation
              </h2>
              <p className="text-xs sm:text-sm text-[#C9BDA7] font-mono mt-1">
                Authentic documentation captured during presentations, classroom evaluations, and valedictory awards. Tap any image to enlarge.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {AIRL_2_REPORT.photos.map((photo, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(photo.url)}
                  className="club-card club-card-hover overflow-hidden group cursor-pointer"
                >
                  <div className="relative aspect-video sm:aspect-4/3 overflow-hidden bg-[#142B20]">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-1 bg-[#142B20]/90 text-[#8B5CF6] font-mono text-[9px] uppercase tracking-wider font-bold rounded">
                      {photo.category}
                    </div>
                  </div>
                  <div className="p-4 space-y-1 bg-[#193426]">
                    <p className="font-body text-xs text-[#E8DCC4] font-medium leading-snug">
                      {photo.caption}
                    </p>
                    <span className="text-[10px] font-mono text-[#8B5CF6] font-bold block pt-1">
                      Click to expand ↗
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: 📑 ACTIVITY & OUTCOMES */}
        {activeTab === 'report' && (
          <div className="space-y-8">
            <div className="border-b border-[#E8DCC4]/15 pb-3">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#E8DCC4]">
                Comprehensive Activity Report & Outcomes
              </h2>
              <p className="text-xs sm:text-sm text-[#C9BDA7] font-mono mt-1">
                Documented institutional background, learning goals, preparatory phases, and outcomes.
              </p>
            </div>

            {/* Need of Activity */}
            <div className="club-card p-6 sm:p-8 space-y-3">
              <span className="font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest block">
                1. NEED OF ACTIVITY
              </span>
              <p className="text-sm text-[#C9BDA7] font-body leading-relaxed">
                {AIRL_2_REPORT.needOfActivity}
              </p>
            </div>

            {/* 6 Key Objectives */}
            <div className="club-card p-6 sm:p-8 space-y-4">
              <span className="font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest block">
                2. SIX KEY OBJECTIVES
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                {AIRL_2_REPORT.objectives.map((obj: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 p-3.5 bg-[#142B20] rounded-xl border border-[#E8DCC4]/15">
                    <span className="font-bold text-[#8B5CF6] shrink-0">0{i + 1}.</span>
                    <span className="text-[#E8DCC4] leading-relaxed font-body">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparatory Workshops */}
            <div className="club-card p-6 sm:p-8 space-y-4">
              <span className="font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest block">
                3. PREPARATORY WORKSHOPS CONDUCTED
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AIRL_2_REPORT.preparatoryWorkshops.map((w, i: number) => (
                  <div key={i} className="p-4 bg-[#142B20] rounded-xl border border-[#E8DCC4]/15 space-y-1">
                    <span className="font-heading font-bold text-xs uppercase text-[#E8DCC4] block">
                      {w.title}
                    </span>
                    <p className="text-[11px] text-[#C9BDA7] font-body leading-relaxed">
                      {w.description}
                    </p>
                    <span className="font-mono text-[10px] text-[#8B5CF6] block font-semibold pt-1">
                      Conducted by: {w.leads}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 12 Problem Domains */}
            <div className="club-card p-6 sm:p-8 space-y-4">
              <span className="font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest block">
                4. TWELVE INNOVATION DOMAINS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 font-mono text-xs">
                {AIRL_2_REPORT.problemStatementDomains.map((d: string, i: number) => (
                  <div key={i} className="p-3 bg-[#142B20] rounded-xl border border-[#E8DCC4]/15 text-[#E8DCC4] font-medium flex items-center gap-2">
                    <span className="text-[#8B5CF6] font-bold">#{i + 1}</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Outcomes */}
            <div className="club-card p-6 sm:p-8 space-y-4">
              <span className="font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest block">
                5. MEASURABLE OUTCOMES
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-body">
                {AIRL_2_REPORT.outcomes.map((outcome: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 p-3.5 bg-[#142B20] rounded-xl border border-[#8B5CF6]/30">
                    <CheckCircle2 size={16} className="text-[#8B5CF6] shrink-0 mt-0.5" />
                    <span className="text-[#E8DCC4] font-medium leading-relaxed">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Bottom Download & Navigation Banner ── */}
      <footer className="mt-14 pt-8 border-t border-[#E8DCC4]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-heading font-bold text-sm text-[#E8DCC4]">
            Need the official institutional signed document?
          </p>
          <p className="text-xs text-[#C9BDA7] font-mono">
            Contains all student names, attendance rosters, jury rubrics, and formal citations.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href={AIRL_2_REPORT.pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary py-3 px-5 text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md flex-1 sm:flex-none cursor-pointer"
          >
            <Download size={14} />
            <span>Download Official PDF (13 Pages)</span>
          </a>
          <Link
            to="/events"
            className="btn-secondary py-3 px-5 font-mono font-bold text-xs uppercase tracking-wider text-[#E8DCC4] flex-1 sm:flex-none text-center"
          >
            Back to Events
          </Link>
        </div>
      </footer>

      {/* ── Photo Lightbox ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#101A14]/95 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto}
                alt="Enlarged report photo"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-[#E8DCC4]/20 shadow-2xl"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-2 bg-[#142B20]/90 hover:bg-[#8B5CF6] text-white rounded-full transition-colors cursor-pointer border border-[#E8DCC4]/20"
                aria-label="Close Preview"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AirlReportPage;

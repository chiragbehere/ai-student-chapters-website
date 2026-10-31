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

  // Scroll to top on page mount
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
    <div className="w-full min-h-screen bg-[#ecefe9] text-[#0a0a0a] font-body py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
      <nav className="flex items-center justify-between pb-6 mb-8 border-b border-[#cdd6cd]">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#008736] hover:text-[#00722d] uppercase tracking-wider group transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Events</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#cdd6cd] hover:border-[#008736] text-xs font-mono font-bold text-[#0a0a0a] transition-colors cursor-pointer shadow-xs"
            title="Share page"
          >
            <Share2 size={13} className="text-[#008736]" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <a
            href={AIRL_2_REPORT.pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-heading font-bold uppercase tracking-wider cursor-pointer shadow-xs"
            title="Download Official 13-Page PDF"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Download Report PDF</span>
            <span className="sm:hidden">PDF</span>
          </a>
        </div>
      </nav>

      {/* ── Main Hero Card ── */}
      <header className="grid-box p-6 sm:p-10 mb-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#cdd6cd] pb-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#008736] uppercase tracking-widest bg-[#e6f4ea] px-3 py-1 border border-[#008736]/20">
            <Sparkles size={14} /> OFFICIAL POST-EVENT REPORT • AY 2026–27
          </div>
          <span className="font-mono text-xs text-[#525852] font-semibold">
            ORG: {AIRL_2_REPORT.organizedBy}
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-[#0a0a0a] uppercase tracking-tight leading-none">
            {AIRL_2_REPORT.eventName}
          </h1>
          <p className="text-base sm:text-lg text-[#4e554e] font-body max-w-4xl leading-relaxed">
            Premier campus research tournament where 114 participants across 36 UG & PG student teams built working AI web prototypes, defended their methodologies before industry judges from Tata Technologies, Hitachi Energy, and Aditya Birla Capital, and competed under a unified 50-point rubric.
          </p>
        </div>

        {/* Key Event Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#cdd6cd] font-mono">
          <div className="bg-[#f4f6f2] p-3.5 border border-[#cdd6cd] space-y-1">
            <span className="text-[10px] text-[#525852] uppercase block tracking-wider">Date & Venue</span>
            <span className="font-bold text-sm text-[#0a0a0a] block">{AIRL_2_REPORT.displayDate}</span>
            <span className="text-[11px] text-[#525852] block truncate">{AIRL_2_REPORT.venue}</span>
          </div>

          <div className="bg-[#f4f6f2] p-3.5 border border-[#cdd6cd] space-y-1">
            <span className="text-[10px] text-[#525852] uppercase block tracking-wider">Participation</span>
            <span className="font-bold text-sm text-[#008736] block">114 Builders</span>
            <span className="text-[11px] text-[#525852] block">28 UG + 86 PG Students</span>
          </div>

          <div className="bg-[#f4f6f2] p-3.5 border border-[#cdd6cd] space-y-1">
            <span className="text-[10px] text-[#525852] uppercase block tracking-wider">Squad Count</span>
            <span className="font-bold text-sm text-[#0a0a0a] block">36 Teams</span>
            <span className="text-[11px] text-[#525852] block">7 UG Teams + 29 PG Teams</span>
          </div>

          <div className="bg-[#f4f6f2] p-3.5 border border-[#cdd6cd] space-y-1">
            <span className="text-[10px] text-[#525852] uppercase block tracking-wider">Evaluation</span>
            <span className="font-bold text-sm text-[#008736] block">50-Point Rubric</span>
            <span className="text-[11px] text-[#525852] block">Combined Overall Ranking</span>
          </div>
        </div>
      </header>

      {/* ── In-Page Tab Navigation (STATIC — scrolls naturally with the page, never floats over content) ── */}
      <div className="w-full pb-4 border-b border-[#cdd6cd] mb-8">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
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
                className={`px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 border transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#008736] text-white border-[#008736] shadow-xs'
                    : 'bg-white text-[#0a0a0a] border-[#cdd6cd] hover:bg-[#e2e7e2]'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-white' : 'text-[#008736]'} />
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
            <div className="flex items-center justify-between border-b border-[#cdd6cd] pb-3">
              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0a0a0a]">
                  Official List of Winning Teams
                </h2>
                <p className="text-xs sm:text-sm text-[#525852] font-mono mt-1">
                  Evaluated across presentation depth, methodology, and working interactive web prototypes.
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-[#008736] bg-[#e6f4ea] px-3 py-1 border border-[#008736]/20 uppercase">
                4 Awarded Positions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {AIRL_2_REPORT.winners.map((team: WinningTeam) => (
                <article
                  key={team.teamId}
                  className="grid-box p-6 sm:p-7 flex flex-col justify-between space-y-5 bg-white border border-[#cdd6cd] hover:border-[#008736] transition-all shadow-xs"
                >
                  <div className="space-y-4">
                    {/* Position Header */}
                    <div className="flex items-center justify-between border-b border-[#cdd6cd] pb-3">
                      <div className="flex items-center gap-2">
                        {team.rank.includes('1st') ? (
                          <Trophy size={18} className="text-[#d97706]" />
                        ) : team.rank.includes('2nd') ? (
                          <Award size={18} className="text-[#0284c7]" />
                        ) : team.rank.includes('3rd') ? (
                          <Medal size={18} className="text-[#b45309]" />
                        ) : (
                          <CheckCircle2 size={18} className="text-[#008736]" />
                        )}
                        <span className="font-heading font-black text-xs uppercase tracking-wider text-[#0a0a0a]">
                          {team.rankBadge}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#525852] bg-[#f4f6f2] px-2 py-0.5 border border-[#cdd6cd]">
                        ID: {team.teamId}
                      </span>
                    </div>

                    {/* Team Name & Division */}
                    <div>
                      <h3 className="font-display font-black text-2xl text-[#0a0a0a]">
                        {team.teamName}
                      </h3>
                      <p className="font-mono text-xs text-[#008736] font-bold mt-1">
                        {team.category}
                      </p>
                    </div>

                    {/* Project Topic */}
                    <div className="p-3.5 bg-[#f4f6f2] border border-[#cdd6cd] space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#525852] block font-bold">
                        RESEARCH TOPIC / PROJECT TITLE:
                      </span>
                      <p className="font-heading font-bold text-sm text-[#0a0a0a] leading-snug">
                        {team.projectTitle}
                      </p>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#525852] block font-bold">
                        TEAM MEMBERS:
                      </span>
                      <ul className="space-y-1 text-xs font-body">
                        {team.members.map((m: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-[#0a0a0a]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#008736] shrink-0" />
                            <span className={m.includes('(Team Leader)') ? 'font-bold text-[#008736]' : ''}>
                              {m}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Special Jury Note */}
                    {team.specialNote && (
                      <div className="p-3 bg-[#e6f4ea] border border-[#a8d5b5] text-xs font-body text-[#0a0a0a] space-y-1">
                        <span className="font-mono text-[10px] font-bold text-[#008736] uppercase tracking-wider block">
                          JURY COMMENDATION:
                        </span>
                        <p>{team.specialNote}</p>
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
            <div className="border-b border-[#cdd6cd] pb-3">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0a0a0a]">
                Official Winners Summary Matrix
              </h2>
              <p className="text-xs sm:text-sm text-[#525852] font-mono mt-1">
                Official institutional record from the AI Research League 2.0 evaluation documentation.
              </p>
            </div>

            <div className="grid-box overflow-hidden bg-white border border-[#cdd6cd]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead className="bg-[#f4f6f2] border-b border-[#cdd6cd] text-[#0a0a0a] uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-3.5 border-r border-[#cdd6cd]">Position / Award</th>
                      <th className="p-3.5 border-r border-[#cdd6cd]">Team Name</th>
                      <th className="p-3.5 border-r border-[#cdd6cd]">Team ID</th>
                      <th className="p-3.5 border-r border-[#cdd6cd]">Division & Class</th>
                      <th className="p-3.5">Project Domain / Research Title</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#cdd6cd]">
                    {AIRL_2_REPORT.winners.map((team: WinningTeam) => (
                      <tr key={team.teamId} className="hover:bg-[#f9faf8] transition-colors">
                        <td className="p-3.5 border-r border-[#cdd6cd] font-bold text-[#008736] whitespace-nowrap">
                          {team.rank}
                        </td>
                        <td className="p-3.5 border-r border-[#cdd6cd] font-bold text-[#0a0a0a] whitespace-nowrap">
                          {team.teamName}
                        </td>
                        <td className="p-3.5 border-r border-[#cdd6cd] text-[#525852] whitespace-nowrap">
                          {team.teamId}
                        </td>
                        <td className="p-3.5 border-r border-[#cdd6cd] text-[#0a0a0a] whitespace-nowrap">
                          {team.category}
                        </td>
                        <td className="p-3.5 text-[#0a0a0a] font-medium leading-relaxed">
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
              <div className="grid-box p-6 bg-white border border-[#cdd6cd] space-y-3">
                <div className="flex items-center justify-between border-b border-[#cdd6cd] pb-2">
                  <span className="font-mono text-xs font-bold text-[#008736] uppercase tracking-wider">
                    UG DIVISION (7 TEAMS / 28 PARTICIPANTS)
                  </span>
                  <span className="font-mono text-xs font-bold bg-[#f4f6f2] px-2 py-0.5 border border-[#cdd6cd]">
                    IMCA 2nd & 3rd Yr
                  </span>
                </div>
                <p className="text-xs text-[#4e554e] font-body leading-relaxed">
                  Focused on campus-centric automation, water monitoring, student management systems, and computer vision utilities. Outstanding achievement by Team AQUASAKSHAM securing 2nd Rank overall in the combined open ranking.
                </p>
              </div>

              <div className="grid-box p-6 bg-white border border-[#cdd6cd] space-y-3">
                <div className="flex items-center justify-between border-b border-[#cdd6cd] pb-2">
                  <span className="font-mono text-xs font-bold text-[#008736] uppercase tracking-wider">
                    PG DIVISION (29 TEAMS / 86 PARTICIPANTS)
                  </span>
                  <span className="font-mono text-xs font-bold bg-[#f4f6f2] px-2 py-0.5 border border-[#cdd6cd]">
                    MCA & IMCA 4th/5th Yr
                  </span>
                </div>
                <p className="text-xs text-[#4e554e] font-body leading-relaxed">
                  Investigated deep kernel-level HID security, automated sign language translation, ATM cash prediction, predictive maintenance, and enterprise ML pipelines with fully deployed web apps.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ⚖️ JUDGES & RUBRIC */}
        {activeTab === 'judges' && (
          <div className="space-y-8">
            {/* Industry Jury Panel */}
            <div className="space-y-4">
              <div className="border-b border-[#cdd6cd] pb-3">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0a0a0a]">
                  Distinguished Industry Jury Panel
                </h2>
                <p className="text-xs sm:text-sm text-[#525852] font-mono mt-1">
                  Evaluated with rigorous industry benchmark criteria across classroom presentations and live code demos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {AIRL_2_REPORT.judges.map((judge: IndustryJudge, idx: number) => (
                  <div
                    key={idx}
                    className="grid-box p-6 bg-white border border-[#cdd6cd] space-y-3 hover:border-[#008736] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#008736] flex items-center justify-center font-bold text-sm">
                      {judge.name.charAt(3)}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#0a0a0a]">
                        {judge.name}
                      </h3>
                      <p className="font-mono text-xs text-[#008736] font-bold">
                        {judge.designation}
                      </p>
                      <p className="font-mono text-xs text-[#525852] mt-0.5">
                        {judge.company}
                      </p>
                    </div>
                    {judge.note && (
                      <p className="text-xs text-[#4e554e] font-body pt-2 border-t border-[#cdd6cd]">
                        {judge.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 50-Point Evaluation Rubric */}
            <div className="space-y-4 pt-4 border-t border-[#cdd6cd]">
              <div className="border-b border-[#cdd6cd] pb-3">
                <h3 className="font-display font-extrabold text-2xl text-[#0a0a0a]">
                  50-Point Official Evaluation Rubric
                </h3>
                <p className="text-xs text-[#525852] font-mono mt-1">
                  Standardized 5-criteria grading scale (10 points each) applied across all 36 teams.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {AIRL_2_REPORT.scoringRubric.map((item: ScoringCriterion, idx: number) => (
                  <div
                    key={idx}
                    className="grid-box p-5 bg-white border border-[#cdd6cd] flex flex-col justify-between space-y-2"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-[#cdd6cd] pb-1.5">
                        <span className="font-mono text-lg font-bold text-[#008736]">
                          {item.points} pts
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-[#f4f6f2] px-2 py-0.5 font-bold text-[#525852]">
                          PARAM #{idx + 1}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-xs uppercase text-[#0a0a0a] leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#4e554e] font-body leading-relaxed">
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
            <div className="border-b border-[#cdd6cd] pb-3">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0a0a0a]">
                Official Event Photo Documentation
              </h2>
              <p className="text-xs sm:text-sm text-[#525852] font-mono mt-1">
                Authentic documentation captured during presentations, classroom evaluations, and valedictory awards. Tap any image to enlarge.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {AIRL_2_REPORT.photos.map((photo, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(photo.url)}
                  className="grid-box bg-white border border-[#cdd6cd] overflow-hidden group cursor-pointer hover:border-[#008736] transition-all shadow-xs"
                >
                  <div className="relative aspect-video sm:aspect-4/3 overflow-hidden bg-[#e2e7e2]">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-white font-mono text-[9px] uppercase tracking-wider font-bold">
                      {photo.category}
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="font-body text-xs text-[#0a0a0a] font-medium leading-snug">
                      {photo.caption}
                    </p>
                    <span className="text-[10px] font-mono text-[#008736] font-bold block pt-1">
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
            <div className="border-b border-[#cdd6cd] pb-3">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0a0a0a]">
                Comprehensive Activity Report & Outcomes
              </h2>
              <p className="text-xs sm:text-sm text-[#525852] font-mono mt-1">
                Documented institutional background, learning goals, preparatory phases, and outcomes.
              </p>
            </div>

            {/* Need of Activity */}
            <div className="grid-box p-6 sm:p-8 bg-white border border-[#cdd6cd] space-y-3">
              <span className="font-mono text-xs font-bold text-[#008736] uppercase tracking-widest block">
                1. NEED OF ACTIVITY
              </span>
              <p className="text-sm text-[#4e554e] font-body leading-relaxed">
                {AIRL_2_REPORT.needOfActivity}
              </p>
            </div>

            {/* 6 Key Objectives */}
            <div className="grid-box p-6 sm:p-8 bg-white border border-[#cdd6cd] space-y-4">
              <span className="font-mono text-xs font-bold text-[#008736] uppercase tracking-widest block">
                2. SIX KEY OBJECTIVES
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                {AIRL_2_REPORT.objectives.map((obj: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-[#f4f6f2] border border-[#cdd6cd]">
                    <span className="font-bold text-[#008736] shrink-0">0{i + 1}.</span>
                    <span className="text-[#0a0a0a] leading-relaxed font-body">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparatory Workshops */}
            <div className="grid-box p-6 sm:p-8 bg-white border border-[#cdd6cd] space-y-4">
              <span className="font-mono text-xs font-bold text-[#008736] uppercase tracking-widest block">
                3. PREPARATORY WORKSHOPS CONDUCTED
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AIRL_2_REPORT.preparatoryWorkshops.map((w, i: number) => (
                  <div key={i} className="p-4 bg-[#f4f6f2] border border-[#cdd6cd] space-y-1">
                    <span className="font-heading font-bold text-xs uppercase text-[#0a0a0a] block">
                      {w.title}
                    </span>
                    <p className="text-[11px] text-[#4e554e] font-body leading-relaxed">
                      {w.description}
                    </p>
                    <span className="font-mono text-[10px] text-[#008736] block font-semibold pt-1">
                      Conducted by: {w.leads}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 12 Problem Domains */}
            <div className="grid-box p-6 sm:p-8 bg-white border border-[#cdd6cd] space-y-4">
              <span className="font-mono text-xs font-bold text-[#008736] uppercase tracking-widest block">
                4. TWELVE INNOVATION DOMAINS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 font-mono text-xs">
                {AIRL_2_REPORT.problemStatementDomains.map((d: string, i: number) => (
                  <div key={i} className="p-3 bg-white border border-[#cdd6cd] text-[#0a0a0a] font-medium flex items-center gap-2">
                    <span className="text-[#008736] font-bold">#{i + 1}</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Outcomes */}
            <div className="grid-box p-6 sm:p-8 bg-white border border-[#cdd6cd] space-y-4">
              <span className="font-mono text-xs font-bold text-[#008736] uppercase tracking-widest block">
                5. MEASURABLE OUTCOMES
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-body">
                {AIRL_2_REPORT.outcomes.map((outcome: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 p-3.5 bg-[#e6f4ea] border border-[#a8d5b5]">
                    <CheckCircle2 size={16} className="text-[#008736] shrink-0 mt-0.5" />
                    <span className="text-[#0a0a0a] font-medium leading-relaxed">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Bottom Download & Navigation Banner ── */}
      <footer className="mt-14 pt-8 border-t border-[#cdd6cd] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-heading font-bold text-sm text-[#0a0a0a]">
            Need the official institutional signed document?
          </p>
          <p className="text-xs text-[#525852] font-mono">
            Contains all student names, attendance rosters, jury rubrics, and formal citations.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href={AIRL_2_REPORT.pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green py-3 px-5 text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm flex-1 sm:flex-none cursor-pointer"
          >
            <Download size={14} />
            <span>Download Official PDF (13 Pages)</span>
          </a>
          <Link
            to="/events"
            className="py-3 px-5 grid-box font-mono font-bold text-xs uppercase tracking-wider text-[#0a0a0a] hover:bg-[#e2e7e2] transition-colors flex-1 sm:flex-none text-center"
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
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
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
                className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
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

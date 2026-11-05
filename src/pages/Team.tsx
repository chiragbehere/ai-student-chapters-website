import React from 'react';
import { Sparkles, ShieldCheck, Users } from 'lucide-react';
import SEO from '../components/SEO';
import { TEAM_POSITION_HOLDERS, TEAM_MEMBERS, FACULTY_ADVISORS } from '../data/chapterData';

export const Team: React.FC = () => {
  const teamSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AI Student Chapters Core Committee",
    "description": "Leadership and core team members of AI Student Chapters at RCPET's IMRD, Shirpur.",
    "itemListElement": [...TEAM_POSITION_HOLDERS, ...TEAM_MEMBERS].map((member, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Person",
        "name": member.name,
        "jobTitle": member.role,
        "affiliation": {
          "@type": "EducationalOrganization",
          "name": "AI Student Chapters, RCPET's IMRD"
        },
        "image": member.image?.startsWith('http') ? member.image : `https://aistudentchapter.vercel.app${member.image}`
      }
    }))
  };

  return (
    <div className="w-full text-[#E8DCC4] overflow-hidden">
      <SEO
        title="Leadership & Core Team | AI Student Chapters RCPIMRD"
        description="Meet the core committee, student council, and technical innovators guiding the AI Student Chapters community at RCPIMRD."
        url="https://aistudentchapter.vercel.app/team"
        schema={teamSchema}
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Team", item: "/team" }
        ]}
      />

      {/* ════════════════════════════════════════════════════════════
          1. HEADER & FACULTY ADVISORS — FOREST GREEN (#1F3D2B)
      ════════════════════════════════════════════════════════════ */}
      <section className="w-full section-forest border-b border-[#E8DCC4]/15 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto border-b border-[#E8DCC4]/15 pb-8">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest bg-[#142B20] px-4 py-1.5 rounded-full border border-[#E8DCC4]/15 shadow-sm">
              <Sparkles size={14} /> EXECUTIVE DIRECTORY • 2026
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-[#E8DCC4] uppercase tracking-tight leading-none">
              AISC <span className="text-[#8B5CF6]">LEADERSHIP</span> & TEAM
            </h1>
            <p className="text-[#C9BDA7] text-base sm:text-lg font-body leading-relaxed max-w-2xl mx-auto">
              The student council leads, engineers, and organizers powering artificial intelligence initiatives and community builds at RCPIMRD.
            </p>
          </div>

          {/* Faculty Advisor Highlight */}
          {FACULTY_ADVISORS.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#8B5CF6] font-mono text-xs uppercase tracking-widest font-bold">
                <ShieldCheck size={16} /> FACULTY PATRON & CHIEF ADVISOR
              </div>
              {FACULTY_ADVISORS.map((advisor, idx) => (
                <div
                  key={idx}
                  className="card-forest p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl"
                >
                  <img
                    src={advisor.image || '/images/event3.webp'}
                    alt={advisor.name}
                    className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl object-cover object-top border-2 border-[#8B5CF6]/40 shrink-0 shadow-lg"
                  />
                  <div className="space-y-3 text-center md:text-left">
                    <span className="inline-block px-3 py-1 bg-[#8B5CF6] text-white text-xs font-mono font-bold uppercase rounded-lg shadow-sm">
                      {advisor.role}
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-display font-extrabold text-[#E8DCC4] pt-1">
                      {advisor.name}
                    </h3>
                    <p className="text-sm font-bold text-[#8B5CF6] font-mono">
                      {advisor.title} • {advisor.department}
                    </p>
                    <p className="text-[#C9BDA7] text-sm sm:text-base font-body leading-relaxed max-w-3xl pt-1">
                      {advisor.contribution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          2. EXECUTIVE COUNCIL & HEADS — FULL-WIDTH SAND BEIGE (#E8DCC4)
      ════════════════════════════════════════════════════════════ */}
      <section className="w-full section-beige border-b border-[#1F3D2B]/10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1F3D2B]/15 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-wider mb-2">
                <Sparkles size={14} /> PILLAR LEADERSHIP
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-[#1F3D2B] uppercase tracking-tight">
                EXECUTIVE COUNCIL & HEADS
              </h2>
            </div>
            <span className="font-mono text-xs text-[#526457] font-bold uppercase tracking-widest bg-white/60 px-3 py-1 rounded-md border border-[#1F3D2B]/10">
              {TEAM_POSITION_HOLDERS.length} OFFICERS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 items-stretch">
            {TEAM_POSITION_HOLDERS.map((leader) => (
              <div
                key={leader.id}
                className="card-beige group overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#E8DCC4] border-b border-[#1F3D2B]/10 relative">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-[#1F3D2B]/90 backdrop-blur-sm text-[#E8DCC4] font-mono text-[10px] font-bold uppercase tracking-wider rounded-lg border border-[#E8DCC4]/20">
                    {leader.classCategory}
                  </div>
                </div>

                <div className="p-5 font-mono text-xs flex flex-col space-y-3 flex-1 justify-between bg-white/70">
                  <div>
                    <h3 className="font-display font-bold text-[#1F3D2B] text-lg uppercase tracking-tight leading-snug">
                      {leader.name}
                    </h3>
                    <p className="text-[#8B5CF6] font-bold text-xs uppercase tracking-wider pt-0.5">
                      {leader.role}, AISC
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1F3D2B]/10">
                    {leader.expertise.map((exp, eIdx) => (
                      <span
                        key={eIdx}
                        className="px-2 py-0.5 bg-[#F4EBDD] text-[#1F3D2B] border border-[#1F3D2B]/10 text-[10px] font-semibold rounded"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          3. CORE TEAM MEMBERS — FOREST GREEN (#1F3D2B)
      ════════════════════════════════════════════════════════════ */}
      <section className="w-full section-forest py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8DCC4]/15 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-wider mb-2">
                <Users size={14} /> COMMUNITY BUILDERS
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-[#E8DCC4] uppercase tracking-tight">
                CORE TEAM MEMBERS
              </h2>
            </div>
            <span className="font-mono text-xs text-[#C9BDA7] font-bold uppercase tracking-widest bg-[#142B20] px-3 py-1 rounded-md border border-[#E8DCC4]/15">
              {TEAM_MEMBERS.length} MEMBERS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="card-forest group overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#142B20] border-b border-[#E8DCC4]/15 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-[#142B20]/90 backdrop-blur-sm text-[#8B5CF6] font-mono text-[10px] font-bold uppercase tracking-wider rounded-lg border border-[#E8DCC4]/15">
                    {member.classCategory}
                  </div>
                </div>

                <div className="p-5 font-mono text-xs flex flex-col space-y-3 flex-1 justify-between bg-[#193426]">
                  <div>
                    <h3 className="font-display font-bold text-[#E8DCC4] text-lg uppercase tracking-tight leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-[#8B5CF6] font-bold text-xs uppercase tracking-wider pt-0.5">
                      {member.role}, AISC
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E8DCC4]/10">
                    {member.expertise.map((exp, eIdx) => (
                      <span
                        key={eIdx}
                        className="px-2 py-0.5 bg-[#142B20] text-[#C9BDA7] border border-[#E8DCC4]/10 text-[10px] font-semibold rounded"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;

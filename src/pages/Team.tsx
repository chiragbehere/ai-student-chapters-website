import React from 'react';
import { Sparkles, ShieldCheck, Users } from 'lucide-react';
import SEO from '../components/SEO';
import { TEAM_POSITION_HOLDERS, TEAM_MEMBERS, FACULTY_ADVISORS } from '../data/chapterData';

<<<<<<< Updated upstream
  const teamSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AI Student Chapters Core Committee",
    "description": "Leadership and core team members of AI Student Chapters at RCPET's IMRD.",
    "itemListElement": leaders.map((member, index) => ({
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
    <div className="w-full relative">
      <SEO 
        title="Core Team & Leadership | AI Student Chapters RCPIMRD" 
        description="Meet the core committee, student leaders, and technical innovators powering the AI Student Chapters community at RCPIMRD."
        url="https://aistudentchapter.vercel.app/team"
        schema={teamSchema}
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Team", item: "/team" }
        ]}
      />
      {/* Hero */}
      <section className="editorial-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pill mx-auto w-fit mb-6 flex items-center gap-2" style={{ border: '1px solid rgb(var(--color-border))', color: 'rgb(var(--color-foreground) / 0.6)' }}>
            <Star size={14} /> the crew
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-3"
          >
            Meet the <span className="grad-text">Team</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-base max-w-lg mx-auto"
            style={{ color: 'rgb(var(--color-foreground) / 0.5)', fontFamily: "'DM Mono', monospace", fontSize: '13px' }}
          >
            The amazing humans behind AI Student Chapters.
          </motion.p>
=======
export const Team: React.FC = () => {
  return (
    <div className="w-full relative text-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#ecefe9]">
      <SEO
        title="Leadership & Core Team | AI Student Chapter"
        description="Meet the student council, heads, and core members guiding the AI Student Chapter at RCPIMRD."
        url="https://aistudentchapter.vercel.app/team"
      />

      {/* Header */}
      <section className="text-center space-y-3 max-w-3xl mx-auto mb-16 pt-8 border-b border-[#cdd6cd] pb-8">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#008736] uppercase tracking-widest">
          <Sparkles size={14} /> EXECUTIVE DIRECTORY • 2026
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-[#0a0a0a] uppercase tracking-tight leading-none">
          AISC <span className="text-[#008736]">LEADERSHIP</span> & TEAM
        </h1>
        <p className="text-[#4e554e] text-base font-body leading-relaxed max-w-2xl mx-auto">
          The student council leads, engineers, and organizers powering artificial intelligence initiatives and community builds at RCPIMRD.
        </p>
      </section>

      {/* Faculty Advisor Highlight (if available) */}
      {FACULTY_ADVISORS.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6 text-[#008736] font-mono text-xs uppercase tracking-widest font-bold">
            <ShieldCheck size={16} /> FACULTY PATRON & CHIEF ADVISOR
          </div>
          {FACULTY_ADVISORS.map((advisor, idx) => (
            <div
              key={idx}
              className="grid-box p-8 flex flex-col md:flex-row items-center gap-8 border border-[#cdd6cd]"
            >
              <img
                src={advisor.image || '/images/event3.webp'}
                alt={advisor.name}
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover object-top speaker-card-img border border-[#cdd6cd] shrink-0"
              />
              <div className="space-y-2 text-center md:text-left font-mono">
                <span className="px-3 py-1 bg-[#008736] text-white text-xs font-bold uppercase">
                  {advisor.role}
                </span>
                <h3 className="text-3xl font-display font-extrabold text-[#0a0a0a]">{advisor.name}</h3>
                <p className="text-xs font-bold text-[#008736]">{advisor.title} • {advisor.department}</p>
                <p className="text-[#4e554e] text-sm font-body leading-relaxed max-w-2xl pt-1">
                  {advisor.contribution}
                </p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Executive Council & Leadership */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6 border-b border-[#cdd6cd] pb-3">
          <div className="flex items-center gap-2 text-[#0a0a0a] font-mono text-xs uppercase tracking-widest font-bold">
            <Sparkles size={16} className="text-[#008736]" /> EXECUTIVE COUNCIL & HEADS
          </div>
          <span className="font-mono text-[11px] text-[#4e554e] font-semibold">
            {TEAM_POSITION_HOLDERS.length} OFFICERS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 items-stretch">
          {TEAM_POSITION_HOLDERS.map((leader) => (
            <div
              key={leader.id}
              className="grid-box grid-box-hover group overflow-hidden flex flex-col justify-between border border-[#cdd6cd] bg-[#f7f9f7] hover:border-[#008736]/50 transition-all duration-300"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#e2e7e2] border-b border-[#cdd6cd] relative">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover object-top speaker-card-img transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/75 backdrop-blur-sm text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-sm">
                  {leader.classCategory}
                </div>
              </div>

              <div className="p-4 sm:p-5 font-mono text-xs flex flex-col space-y-2 flex-1 justify-between bg-white">
                <div>
                  <h3 className="font-display font-extrabold text-[#0a0a0a] text-lg uppercase tracking-tight leading-snug">
                    {leader.name}
                  </h3>
                  <p className="text-[#008736] font-bold text-xs uppercase tracking-wider pt-0.5">
                    {leader.role}, AISC
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-2 border-t border-[#edf1ed]">
                  {leader.expertise.map((exp, eIdx) => (
                    <span
                      key={eIdx}
                      className="px-2 py-0.5 bg-[#edf1ed] text-[#2c332c] text-[10px] font-semibold rounded-sm"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
>>>>>>> Stashed changes
        </div>
      </section>


      {/* Team Members */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6 border-b border-[#cdd6cd] pb-3">
          <div className="flex items-center gap-2 text-[#0a0a0a] font-mono text-xs uppercase tracking-widest font-bold">
            <Users size={16} className="text-[#008736]" /> CORE TEAM MEMBERS
          </div>
          <span className="font-mono text-[11px] text-[#4e554e] font-semibold">
            {TEAM_MEMBERS.length} MEMBERS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="grid-box grid-box-hover group overflow-hidden flex flex-col justify-between border border-[#cdd6cd] bg-[#f7f9f7] hover:border-[#008736]/50 transition-all duration-300"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#e2e7e2] border-b border-[#cdd6cd] relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top speaker-card-img transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/75 backdrop-blur-sm text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-sm">
                  {member.classCategory}
                </div>
              </div>

              <div className="p-4 sm:p-5 font-mono text-xs flex flex-col space-y-2 flex-1 justify-between bg-white">
                <div>
                  <h3 className="font-display font-extrabold text-[#0a0a0a] text-lg uppercase tracking-tight leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-[#008736] font-bold text-xs uppercase tracking-wider pt-0.5">
                    {member.role}, AISC
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-2 border-t border-[#edf1ed]">
                  {member.expertise.map((exp, eIdx) => (
                    <span
                      key={eIdx}
                      className="px-2 py-0.5 bg-[#edf1ed] text-[#2c332c] text-[10px] font-semibold rounded-sm"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Team;

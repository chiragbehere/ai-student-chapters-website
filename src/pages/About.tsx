import React, { useState } from 'react';
import { ChevronDown, Sparkles, Layers } from 'lucide-react';
import SEO from '../components/SEO';
import { CHAPTER_INFO, CORE_PRINCIPLES } from '../data/chapterData';

export const About: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { q: 'Who can join AI Student Chapter?', a: 'Any student enrolled at RCPIMRD across MCA and IMCA courses! All skill levels are welcome.' },
    { q: 'Is there any registration fee?', a: 'No, joining the AISC community and participating in workshops or hackathons is 100% free of charge.' },
    { q: 'Do I need prior programming experience?', a: 'Not at all! We host beginner-friendly sessions and pair new members with experienced student mentors.' },
    { q: 'What is Vibe Coding?', a: 'Vibe coding is an intent-driven approach to building software using AI assistants and modern scaffolding to turn ideas into code fast.' },
  ];

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About AI Student Chapters",
    "description": "Information about AI Student Chapters at RCPET's IMRD, Shirpur, covering AI workshops, hackathons, and educational mission.",
    "url": "https://aistudentchapter.vercel.app/about",
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "AI Student Chapters",
      "url": "https://aistudentchapter.vercel.app/",
      "parentOrganization": {
        "@type": "CollegeOrUniversity",
        "name": "RCPET's Institute of Management Research and Development, Shirpur"
      }
    }
  };

  const aboutFaqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  } : null;

  return (
    <div className="w-full text-[#E8DCC4] overflow-hidden">
      <SEO 
        title="About AI Student Chapters | RCPIMRD" 
        description="Learn about AI Student Chapters at RCPIMRD — our mission, hands-on AI workshops, hackathons, and student collective exploring cutting-edge artificial intelligence."
        url="https://aistudentchapter.vercel.app/about"
        schema={aboutFaqSchema ? [aboutSchema, aboutFaqSchema] : [aboutSchema]}
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "About", item: "/about" }
        ]}
      />

      {/* 1. Header & Origin — FOREST GREEN */}
      <section className="w-full section-forest py-16 px-4 sm:px-6 lg:px-8 border-b border-[#E8DCC4]/15">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4 max-w-4xl border-b border-[#E8DCC4]/15 pb-8">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest bg-[#142B20] px-3.5 py-1 rounded-full border border-[#E8DCC4]/15">
              <Sparkles size={14} /> ABOUT OUR COMMUNITY
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-black text-[#E8DCC4] uppercase tracking-tight leading-none">
              WE ARE BUILDING AN <span className="text-[#8B5CF6]">AI-FIRST</span> STUDENT COLLECTIVE.
            </h1>
            <p className="text-[#C9BDA7] text-base sm:text-lg font-body leading-relaxed">
              {CHAPTER_INFO.subTagline}
            </p>
          </div>

          {/* Origin & Mission in Sand Beige Card */}
          <div className="card-beige p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="font-mono text-xs text-[#8B5CF6] uppercase tracking-widest font-bold flex items-center gap-2">
                  <Layers size={14} /> ORIGIN & MISSION
                </span>
                <h2 className="text-2xl sm:text-4xl font-display font-black text-[#1F3D2B] leading-snug">
                  Demystifying Artificial Intelligence through Hands-On Engineering.
                </h2>
                <p className="text-[#526457] text-sm sm:text-base font-body leading-relaxed">
                  Founded at RCPET's Institute of Management Research & Development (IMRD), Shirpur under the guidance of Hon. Head of Department Dr. M. N. Behere, the AI Student Chapter bridges the gap between academic theory and modern AI product engineering.
                </p>
              </div>

              <div className="lg:col-span-4 bg-[#E8DCC4] p-6 text-center space-y-2 rounded-2xl border border-[#1F3D2B]/15 shadow-md">
                <span className="block text-4xl sm:text-5xl font-stat font-black text-[#8B5CF6]">300+</span>
                <span className="font-mono text-xs text-[#1F3D2B] font-bold uppercase tracking-wider">Students Reached</span>
                <p className="text-[11px] text-[#526457] font-body">Through hackathons, guest seminars & workshops</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Methodology & 5 Core Pillars — FULL-WIDTH SAND BEIGE */}
      <section className="w-full section-beige py-20 px-4 sm:px-6 lg:px-8 border-b border-[#1F3D2B]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="font-mono text-xs text-[#8B5CF6] uppercase tracking-widest font-bold">METHODOLOGY</span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#1F3D2B]">FIVE CORE PILLARS</h2>
            <p className="text-[#526457] text-sm font-body">The strategic framework driving all student initiatives and hackathons</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORE_PRINCIPLES.map((principle) => (
              <div key={principle.number} className="card-beige p-7 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1F3D2B]/12 pb-3">
                    <span className="font-stat text-2xl font-black text-[#8B5CF6]">{principle.number}</span>
                    <span className="text-[10px] font-mono uppercase bg-[#E8DCC4] px-2.5 py-0.5 rounded font-bold text-[#1F3D2B] border border-[#1F3D2B]/15">PILLAR</span>
                  </div>
                  <h3 className="text-lg font-heading font-extrabold text-[#1F3D2B]">{principle.title}</h3>
                  <p className="text-[#526457] text-xs font-body leading-relaxed">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Common Questions & FAQ — FULL-WIDTH FOREST GREEN */}
      <section className="w-full section-forest py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <span className="font-mono text-xs text-[#8B5CF6] uppercase tracking-widest font-bold">COMMON QUESTIONS</span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#E8DCC4]">STUDENT FAQ</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="card-forest overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-[#142B20] transition-colors cursor-pointer"
                >
                  <span className="font-heading font-bold text-sm sm:text-base text-[#E8DCC4]">{faq.q}</span>
                  <ChevronDown size={18} className={`text-[#8B5CF6] shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#C9BDA7] font-body border-t border-[#E8DCC4]/15 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
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

<<<<<<< Updated upstream
  const { data: faqsData } = useFaqs('about');
  const faqs = faqsData.map(f => ({ q: f.question, a: f.answer }));

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
    <div className="w-full relative">
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
      {/* Hero */}
      <section className="editorial-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-3"
          >
            About <span className="grad-text">AI Chapters</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-base max-w-xl mx-auto"
            style={{ color: 'rgb(var(--color-foreground) / 0.5)', fontFamily: "'DM Mono', monospace", fontSize: '13px' }}
          >
            From hackathons to workshops — we cover every dimension of AI education. Here's what we're about.
          </motion.p>
=======
  return (
    <div className="w-full relative text-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#ecefe9]">
      <SEO
        title={`About ${CHAPTER_INFO.name} | RCPIMRD`}
        description={`Learn about ${CHAPTER_INFO.name} at RCPIMRD—our mission, AI workshops, hackathons, and student collective.`}
        url="https://aistudentchapter.vercel.app/about"
      />

      {/* Header */}
      <section className="space-y-4 max-w-4xl mx-auto mb-16 pt-8 border-b border-[#cdd6cd] pb-8">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#008736] uppercase tracking-widest">
          <Sparkles size={14} /> ABOUT OUR COMMUNITY
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-[#0a0a0a] uppercase tracking-tight leading-none">
          WE ARE BUILDING AN <span className="text-[#008736]">AI-FIRST</span> STUDENT COLLECTIVE.
        </h1>
        <p className="text-[#4e554e] text-base sm:text-lg font-body leading-relaxed">
          {CHAPTER_INFO.subTagline}
        </p>
      </section>

      {/* Origin */}
      <section className="grid-box p-8 sm:p-12 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="font-mono text-xs text-[#008736] uppercase tracking-widest font-bold">
              ORIGIN & MISSION
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[#0a0a0a]">
              Demystifying Artificial Intelligence through Hands-On Engineering.
            </h2>
            <p className="text-[#4e554e] text-sm sm:text-base font-body leading-relaxed">
              Founded at RCPET's Institute of Management Research & Development (IMRD), Shirpur under the guidance of Hon. Head of Department Dr. M. N. Behere, the AI Student Chapter bridges the gap between academic theory and modern AI product engineering.
            </p>
          </div>

          <div className="lg:col-span-4 grid-box p-6 text-center space-y-2">
            <span className="block text-4xl font-display font-black text-[#008736]">300+</span>
            <span className="font-mono text-xs text-[#0a0a0a] font-bold uppercase">Students Reached</span>
          </div>
>>>>>>> Stashed changes
        </div>
      </section>

      {/* Pillars */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-1">
          <span className="font-mono text-xs text-[#008736] uppercase tracking-widest font-bold">METHODOLOGY</span>
          <h2 className="text-3xl font-display font-extrabold text-[#0a0a0a]">FIVE CORE PILLARS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CORE_PRINCIPLES.map((principle) => (
            <div key={principle.number} className="grid-box grid-box-hover p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-[#cdd6cd] pb-2">
                  <span className="font-mono text-2xl font-bold text-[#008736]">{principle.number}</span>
                  <span className="text-[10px] font-mono uppercase bg-[#e2e7e2] px-2 py-0.5 font-bold text-[#0a0a0a]">PILLAR</span>
                </div>
                <h3 className="text-lg font-heading font-bold text-[#0a0a0a]">{principle.title}</h3>
                <p className="text-[#4e554e] text-xs font-body leading-relaxed">{principle.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto">
        <div className="text-center mb-8 space-y-1">
          <span className="font-mono text-xs text-[#008736] uppercase tracking-widest font-bold">COMMON QUESTIONS</span>
          <h2 className="text-3xl font-display font-extrabold text-[#0a0a0a]">STUDENT FAQ</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="grid-box overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-[#e2e7e2] transition-colors"
              >
                <span className="font-heading font-bold text-base text-[#0a0a0a]">{faq.q}</span>
                <ChevronDown size={18} className={`text-[#008736] shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-[#4e554e] font-body border-t border-[#cdd6cd] pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;

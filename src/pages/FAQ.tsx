import React, { useState } from 'react';
import { ChevronDown, Sparkles, Mail } from 'lucide-react';
import SEO from '../components/SEO';
import { useFaqs } from '../hooks/useSupabaseData';
import { CHAPTER_INFO } from '../data/chapterData';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { data: faqsData } = useFaqs('faq');

  const faqs = faqsData.length > 0
    ? faqsData.map((f) => ({ question: f.question, answer: f.answer }))
    : [
        { question: 'What is AI Student Chapter? 🤔', answer: "We're a student-led AI community at RCPIMRD. We host 6-hour hackathons, Vibe Coding labs, workshops, and build real-world AI projects together!" },
        { question: 'Who can join the chapter? 🙋', answer: "Any student at RCPIMRD (MCA and IMCA)! Whether you've never written a line of code or build apps daily, everyone is welcome." },
        { question: 'Do I need prior coding experience? 💻', answer: 'Nope! We run beginner-friendly masterclasses and pair new members with experienced student mentors.' },
        { question: 'What kind of events do you organize? 🎉', answer: "Hands-on workshops, PyTorch sessions, Vibe Coding masterclasses, and our flagship 'Code-Carnival' Hackathon." },
        { question: 'How do I stay updated? 📱', answer: 'Join our official WhatsApp community and follow us on Instagram (@ai.student_chapters).' },
      ];

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  return (
    <div className="w-full text-[#E8DCC4] overflow-hidden">
      <SEO 
        title="Frequently Asked Questions (FAQ) | AI Student Chapters" 
        description="Find answers to common questions about joining AI Student Chapters at RCPIMRD, hackathon registrations, skill requirements, and activities."
        url="https://aistudentchapter.vercel.app/faq"
        schema={faqSchema || undefined}
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "FAQ", item: "/faq" }
        ]}
      />

      {/* Hero Header */}
      <section className="w-full section-forest border-b border-[#E8DCC4]/15 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest bg-[#142B20] px-4 py-1.5 rounded-full border border-[#E8DCC4]/15 shadow-sm">
            <Sparkles size={14} /> KNOWLEDGE BASE
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black text-[#E8DCC4] uppercase tracking-tight leading-none">
            FREQUENTLY ASKED <span className="text-[#8B5CF6]">QUESTIONS</span>
          </h1>
          <p className="text-[#C9BDA7] text-base sm:text-lg font-body max-w-xl mx-auto">
            Everything you need to know about joining, building, and participating in AISC events at RCPIMRD.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section — Sand Beige */}
      <section className="w-full section-beige border-b border-[#1F3D2B]/10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="card-beige overflow-hidden transition-all duration-200 shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-white/80 transition-colors cursor-pointer"
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-[#1F3D2B]">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#8B5CF6] text-white' : 'bg-[#1F3D2B]/10 text-[#1F3D2B]'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-[#526457] font-body border-t border-[#1F3D2B]/10 pt-4 leading-relaxed bg-white/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Banner — Forest Green */}
      <section className="w-full section-forest py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center card-forest p-8 sm:p-12 space-y-5 shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-display font-black text-[#E8DCC4]">Still have questions?</h3>
          <p className="text-[#C9BDA7] text-sm sm:text-base font-body max-w-md mx-auto leading-relaxed">
            Reach out directly to our student leaders or drop us an email anytime.
          </p>
          <div className="pt-2">
            <a
              href={`mailto:${CHAPTER_INFO.contactEmail}`}
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-xs sm:text-sm font-heading font-bold uppercase tracking-wider shadow-[0_0_24px_rgba(139,92,246,0.4)]"
            >
              <Mail size={16} /> Contact AISC Team ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;

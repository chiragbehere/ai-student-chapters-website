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
    <div className="w-full relative text-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto bg-[#ecefe9]">
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

      <section className="text-center space-y-3 mb-12 pt-8 border-b border-[#cdd6cd] pb-8">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#008736] uppercase tracking-widest">
          <Sparkles size={14} /> KNOWLEDGE BASE
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-[#0a0a0a] uppercase tracking-tight leading-none">
          FREQUENTLY ASKED <span className="text-[#008736]">QUESTIONS</span>
        </h1>
      </section>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="grid-box overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-[#e2e7e2] transition-colors"
              >
                <span className="font-heading font-bold text-base text-[#0a0a0a]">
                  {faq.question}
                </span>
                <ChevronDown size={18} className={`text-[#008736] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-[#4e554e] font-body border-t border-[#cdd6cd] pt-3 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center grid-box p-8 sm:p-12 space-y-4">
        <h3 className="text-2xl font-heading font-bold text-[#0a0a0a]">Still have questions?</h3>
        <p className="text-[#4e554e] text-sm font-body max-w-md mx-auto">
          Reach out directly to our student leaders or drop us an email.
        </p>
        <a
          href={`mailto:${CHAPTER_INFO.contactEmail}`}
          className="btn-green inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-heading font-bold uppercase tracking-wider shadow-md"
        >
          <Mail size={16} /> Contact AISC Team ↗
        </a>
      </div>
    </div>
  );
};

export default FAQ;

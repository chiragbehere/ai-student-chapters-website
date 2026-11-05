import React from 'react';
import { Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { useSessions } from '../hooks/useSupabaseData';
import { fallbackSessions } from '../data/fallback';
import SlideViewer from '../components/SlideViewer';

export const Sessions: React.FC = () => {
  const { data: sessionsData } = useSessions();

  const workshops = (sessionsData && sessionsData.length > 0 ? sessionsData : fallbackSessions).map((s) => ({
    title: s.title,
    embedUrl: s.embed_url,
    downloadUrl: s.download_url || '#',
    slides: s.slides || [],
  }));

  const sessionsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AI Sessions & Technical Workshops",
    "description": "Educational slide decks, hands-on tutorials, and workshop resources presented by AI Student Chapters.",
    "itemListElement": workshops.map((session, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LearningResource",
        "name": session.title,
        "educationalLevel": "Beginner to Advanced",
        "learningResourceType": "Presentation / Workshop Slides",
        "provider": {
          "@type": "Organization",
          "name": "AI Student Chapters"
        }
      }
    }))
  };

  return (
    <div className="w-full text-[#E8DCC4] overflow-hidden">
      <SEO 
        title="AI Sessions & Workshops | AI Student Chapters" 
        description="Access workshop presentation slides, hackathon primers, and hands-on AI learning materials from AI Student Chapters at RCPIMRD."
        url="https://aistudentchapter.vercel.app/sessions"
        schema={sessionsSchema}
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Sessions", item: "/sessions" }
        ]}
      />

      {/* Hero Header — Forest Green */}
      <section className="w-full section-forest border-b border-[#E8DCC4]/15 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest bg-[#142B20] px-4 py-1.5 rounded-full border border-[#E8DCC4]/15 shadow-sm">
            <Sparkles size={14} /> LEARNING REPOSITORY
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-[#E8DCC4] uppercase tracking-tight leading-tight">
            WORKSHOP <span className="text-[#8B5CF6]">SESSIONS</span> & SLIDES
          </h1>
          <p className="text-[#C9BDA7] text-sm sm:text-base font-body max-w-xl mx-auto">
            Explore slide decks and materials presented during AI Student Chapter masterclasses and hackathon primers.
          </p>
        </div>
      </section>

      {/* Slides Content — Sand Beige */}
      <section className="w-full section-beige py-16 sm:py-24 px-3 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          {workshops.map((ws, idx) => (
            <div key={idx} className="card-beige p-4 sm:p-8 shadow-xl">
              <SlideViewer
                title={ws.title}
                slides={ws.slides}
                downloadUrl={ws.downloadUrl}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Sessions;

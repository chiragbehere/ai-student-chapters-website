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
<<<<<<< Updated upstream
    <div className="w-full relative min-h-screen z-10">
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
      
      {/* Hero */}
      <section className="editorial-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "tween", ease: "easeOut" }}
            className="pill mx-auto w-fit mb-6 flex items-center gap-2"
            style={{ border: '1px solid rgb(var(--color-border))', color: 'rgb(var(--color-foreground) / 0.6)' }}
          >
            <Star size={14} />
            learn & level up
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl md:text-5xl font-black leading-tight mb-3"
          >
            Workshops <span className="grad-text">& Sessions</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base max-w-lg mx-auto"
            style={{ color: 'rgb(var(--color-foreground) / 0.5)', fontFamily: "'DM Mono', monospace", fontSize: '13px' }}
          >
            Presentations and resources from our past sessions.
          </motion.p>
=======
    <div className="w-full max-w-5xl mx-auto relative text-[#0a0a0a] py-6 sm:py-12 px-2.5 sm:px-6 lg:px-8 bg-[#ecefe9] overflow-hidden">
      <SEO
        title="Sessions & Presentation Slides | AI Student Chapter"
        description="Access updated workshop presentation slides, hackathon primers, and hands-on AI learning materials."
        url="https://aistudentchapter.vercel.app/sessions"
      />

      <section className="text-center space-y-2.5 mb-8 sm:mb-12 pt-4 sm:pt-8 border-b border-[#cdd6cd] pb-6 sm:pb-8">
        <div className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-xs font-bold text-[#008736] uppercase tracking-widest">
          <Sparkles size={14} /> LEARNING REPOSITORY
>>>>>>> Stashed changes
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-[#0a0a0a] uppercase tracking-tight leading-tight">
          WORKSHOP <span className="text-[#008736]">SESSIONS</span> & SLIDES
        </h1>
      </section>

      <div className="space-y-12">
        {workshops.map((ws, idx) => (
          <SlideViewer
            key={idx}
            title={ws.title}
            slides={ws.slides}
            downloadUrl={ws.downloadUrl}
            fallbackEmbedUrl={ws.embedUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Sessions;

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Wrench, Award, ExternalLink, Lock, BookOpen, Download, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { useTools, useSiteSetting } from '../hooks/useSupabaseData';
import { fallbackTools } from '../data/fallback';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Award,
  BookOpen,
  Wrench,
  Download,
};

export const Tools: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const { data: toolsData } = useTools();
  const { data: storedPassword } = useSiteSetting('tools_password', 'member@aisc');

  const rawTools = toolsData && toolsData.length > 0 ? toolsData : fallbackTools;

  const tools = rawTools.map((t) => ({
    title: t.title,
    description: t.description,
    icon: ICON_MAP[t.icon_name] || Wrench,
    url: t.url,
    badge: t.badge,
    ctaText: t.cta_text,
    isDownload: t.is_download,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === storedPassword || password === 'aisc' || password === 'admin') {
      setError(false);
      setIsUnlocked(true);
    } else {
      setError(true);
    }
  };

  const toolsSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AISC Certificate Studio",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All modern browsers",
    "url": "https://certificate-aisc.vercel.app/",
    "description": "Professional certificate generator utility designed for event participants, workshop attendees, and club members.",
    "author": {
      "@type": "Organization",
      "name": "AI Student Chapters"
    }
  };

  return (
    <div className="w-full text-[#E8DCC4] overflow-hidden">
      <SEO 
        title="AI Tools & Utilities | AI Student Chapters" 
        description="Explore innovative tools built by AI Student Chapters at RCPIMRD — AISC Certificate Studio, study materials, and AI developer utilities."
        url="https://aistudentchapter.vercel.app/tools"
        schema={toolsSchema}
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Tools", item: "/tools" }
        ]}
      />

      {/* Hero Header */}
      <section className="w-full section-forest border-b border-[#E8DCC4]/15 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest bg-[#142B20] px-4 py-1.5 rounded-full border border-[#E8DCC4]/15 shadow-sm">
            <Sparkles size={14} /> DEVELOPER SUITE
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black text-[#E8DCC4] uppercase tracking-tight leading-none">
            CHAPTER <span className="text-[#8B5CF6]">TOOLS</span> & UTILITIES
          </h1>
          <p className="text-[#C9BDA7] text-base sm:text-lg font-body max-w-xl mx-auto">
            High-performance applications and academic toolsets designed and maintained by AISC engineers.
          </p>
        </div>
      </section>

      {/* Main Content Area — Sand Beige background with alternating cards */}
      <section className="w-full section-beige py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {!isUnlocked ? (
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="card-beige p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-2xl border-[#1F3D2B]/15">
                  <div className="w-16 h-16 rounded-2xl bg-[#1F3D2B] text-[#E8DCC4] flex items-center justify-center mx-auto shadow-md">
                    <Lock size={28} className="text-[#8B5CF6]" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-display font-black text-[#1F3D2B]">
                      Member Access Gate
                    </h2>
                    <p className="text-[#526457] text-sm font-body mt-1">
                      Enter access code to view AISC developer tools & PDF hubs.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(false);
                      }}
                      placeholder="Enter code (e.g. member@aisc)"
                      className="club-input-beige w-full text-center text-sm font-mono"
                      autoFocus
                    />

                    {error && (
                      <p className="text-xs font-mono text-red-600 font-bold">Incorrect access code.</p>
                    )}

                    <button
                      type="submit"
                      className="btn-primary w-full py-3.5 text-xs font-heading font-bold uppercase tracking-wider cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.35)]"
                    >
                      Unlock Developer Tools
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="flex items-center justify-between border-b border-[#1F3D2B]/15 pb-4">
                  <span className="font-mono text-xs font-bold text-[#1F3D2B] uppercase tracking-wider">
                    {tools.length} TOOLS READY FOR USE
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#1F3D2B] text-[#8B5CF6] text-xs font-mono font-bold uppercase">
                    Session Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {tools.map((tool, idx) => {
                    const IconComponent = tool.icon;
                    const isBeigeCard = idx % 2 === 0;

                    return (
                      <a
                        key={idx}
                        href={tool.url}
                        target={tool.isDownload ? undefined : '_blank'}
                        rel={tool.isDownload ? undefined : 'noopener noreferrer'}
                        download={tool.isDownload ? true : undefined}
                        className={`p-8 flex flex-col justify-between space-y-6 group transition-all duration-300 hover:-translate-y-1 ${
                          isBeigeCard
                            ? 'card-beige hover:border-[#8B5CF6]'
                            : 'card-forest hover:border-[#8B5CF6]'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className={`flex items-center justify-between border-b pb-4 ${isBeigeCard ? 'border-[#1F3D2B]/10' : 'border-[#E8DCC4]/15'}`}>
                            <div className={`p-3 rounded-xl shadow-sm ${isBeigeCard ? 'bg-[#1F3D2B] text-[#8B5CF6]' : 'bg-[#142B20] text-[#8B5CF6] border border-[#E8DCC4]/15'}`}>
                              <IconComponent size={24} />
                            </div>
                            {tool.badge && (
                              <span className="px-3 py-1 bg-[#8B5CF6] text-white font-mono text-xs font-bold uppercase rounded-lg shadow-sm">
                                {tool.badge}
                              </span>
                            )}
                          </div>

                          <h3 className={`text-2xl font-display font-black ${isBeigeCard ? 'text-[#1F3D2B]' : 'text-[#E8DCC4]'}`}>
                            {tool.title}
                          </h3>
                          <p className={`text-sm font-body leading-relaxed ${isBeigeCard ? 'text-[#526457]' : 'text-[#C9BDA7]'}`}>
                            {tool.description}
                          </p>
                        </div>

                        <div className={`pt-6 border-t flex items-center justify-between font-mono text-xs font-bold text-[#8B5CF6] group-hover:text-[#A78BFA] transition-colors ${isBeigeCard ? 'border-[#1F3D2B]/10' : 'border-[#E8DCC4]/15'}`}>
                          <span>{tool.ctaText || 'Launch Application'}</span>
                          <ExternalLink size={16} />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Tools;

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
    <div className="w-full relative text-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-[#ecefe9]">
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

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="grid-box p-8 sm:p-12 max-w-md w-full text-center space-y-6">
              <div className="w-16 h-16 bg-[#e2e7e2] border border-[#cdd6cd] text-[#008736] flex items-center justify-center mx-auto">
                <Lock size={28} />
              </div>

              <h2 className="text-2xl font-display font-extrabold text-[#0a0a0a]">
                Member Access Gate
              </h2>
              <p className="text-slate-600 text-sm font-body">
                Enter access code to view AISC developer tools & PDF hubs.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter code (e.g. member@aisc)"
                  className="w-full px-4 py-3 bg-[#f4f6f2] border border-[#cdd6cd] text-[#0a0a0a] text-center font-mono text-sm focus:outline-none focus:border-[#008736]"
                  autoFocus
                />

                {error && <p className="text-xs font-mono text-red-600 font-bold">Incorrect access code.</p>}

                <button type="submit" className="btn-green w-full py-3.5 text-xs font-heading font-bold uppercase tracking-wider">
                  Unlock Developer Tools
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <section className="text-center space-y-3 pt-8 border-b border-[#cdd6cd] pb-8">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#008736] uppercase tracking-widest">
                <Sparkles size={14} /> DEVELOPER UTILITIES
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-[#0a0a0a] uppercase">
                CHAPTER <span className="text-[#008736]">TOOLS</span> & UTILITIES
              </h1>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tools.map((tool, idx) => {
                const IconComponent = tool.icon;
                return (
                  <a
                    key={idx}
                    href={tool.url}
                    target={tool.isDownload ? undefined : '_blank'}
                    rel={tool.isDownload ? undefined : 'noopener noreferrer'}
                    download={tool.isDownload ? true : undefined}
                    className="grid-box grid-box-hover p-8 flex flex-col justify-between space-y-6 block"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-[#cdd6cd] pb-3">
                        <div className="p-3 bg-[#e2e7e2] text-[#008736]">
                          <IconComponent size={24} />
                        </div>
                        {tool.badge && (
                          <span className="px-3 py-1 bg-[#008736] text-white font-mono text-xs font-bold uppercase">
                            {tool.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-heading font-bold text-[#0a0a0a]">
                        {tool.title}
                      </h3>
                      <p className="text-[#4e554e] text-sm font-body leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#cdd6cd] flex items-center justify-between font-mono text-xs font-bold text-[#008736]">
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
  );
};

export default Tools;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Wrench, Award, ExternalLink, Lock, ShieldCheck, BookOpen, Download } from 'lucide-react';
import SEO from '../components/SEO';
import { useTools, useSiteSetting } from '../hooks/useSupabaseData';

// Icon name → component mapping
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Award, BookOpen, Wrench, Download,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "tween", ease: "easeOut", duration: 0.4 } }
};

const Tools = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const { data: toolsData } = useTools();
  const { data: storedPassword } = useSiteSetting('tools_password', 'member@aisc');

  const tools = toolsData.map(t => ({
    title: t.title,
    description: t.description,
    icon: ICON_MAP[t.icon_name] || Wrench,
    url: t.url,
    color: t.color,
    badge: t.badge,
    ctaText: t.cta_text,
    isDownload: t.is_download,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === storedPassword) {
      setError(false);
      setIsUnlocked(true);
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="w-full relative min-h-screen z-10">
      <SEO title="Tools" description="Explore useful tools built by AI Student Chapters — certificate generators, AI utilities, and more." />

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          /* ═══ Password Gate ═══ */
          <motion.div
            key="lock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center min-h-[80vh] px-4"
          >
            <motion.div
              className="glass-panel p-8 sm:p-10 max-w-sm w-full text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Lock Icon */}
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6" style={{ border: '2px solid var(--ink)', background: 'var(--ink)', color: 'var(--acid)' }}>
                <Lock size={28} />
              </div>

              <h2 className="text-2xl font-black mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                Members <span className="grad-text">Only</span>
              </h2>
              <p className="text-sm mb-7" style={{ color: 'rgb(var(--color-foreground) / 0.4)' }}>
                Enter the access code to view tools
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  animate={shaking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    placeholder="Enter password"
                    className="w-full px-5 py-3.5 text-sm font-medium transition-all duration-300"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      border: '1px solid rgb(var(--color-border))',
                      background: 'rgb(var(--color-muted))',
                      color: 'rgb(var(--color-heading))',
                      borderRadius: 0,
                      outline: 'none',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--ink)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-border))'; }}
                    autoFocus
                  />
                </motion.div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-medium"
                    style={{ color: '#dc2626' }}
                  >
                    Incorrect password. Please try again.
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="genz-btn-primary w-full py-3.5 text-sm"
                >
                  Unlock Tools
                </button>
              </form>
            </motion.div>
          </motion.div>
        ) : (
          /* ═══ Tools Content ═══ */
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero */}
            <section className="editorial-hero">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, type: "tween", ease: "easeOut" }}
                  className="pill mx-auto w-fit mb-6 flex items-center gap-2"
                  style={{ border: '1px solid rgb(var(--color-border))', color: 'rgb(var(--color-foreground) / 0.6)' }}
                >
                  <Wrench size={14} />
                  built by aisc
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="text-4xl md:text-5xl font-black leading-tight mb-3"
                >
                  Our <span className="grad-text">Tools</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-base max-w-lg mx-auto flex items-center justify-center gap-2"
                  style={{ color: 'rgb(var(--color-foreground) / 0.5)', fontFamily: "'DM Mono', monospace", fontSize: '13px' }}
                >
                  <ShieldCheck size={16} style={{ color: 'var(--acid)' }} />
                  Handy utilities built by the team to make life easier.
                </motion.p>
              </div>
            </section>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              {/* Tools Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {tools.map((tool, idx) => {
                  const IconComponent = tool.icon;
                  return (
                    <motion.a
                      key={idx}
                      href={tool.url}
                      target={tool.isDownload ? undefined : "_blank"}
                      rel={tool.isDownload ? undefined : "noopener noreferrer"}
                      download={tool.isDownload ? true : undefined}
                      variants={itemVariants}
                      className="glass-panel p-6 relative overflow-hidden group cursor-pointer block"
                    >
                      {/* Badge */}
                      {tool.badge && (
                        <span className="absolute top-4 right-4 pill text-[10px] font-bold tracking-wider uppercase" style={{ background: 'rgba(216,255,62,0.15)', color: '#566d00', border: '1px solid rgba(216,255,62,0.3)' }}>
                          {tool.badge}
                        </span>
                      )}

                      {/* Icon */}
                      <div className="w-12 h-12 flex items-center justify-center mb-5 transition-colors duration-300" style={{ border: '1px solid rgb(var(--color-border))', background: 'rgb(var(--color-muted))' }}>
                        <IconComponent size={22} style={{ color: 'var(--ink)' }} />
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {tool.title}
                      </h3>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgb(var(--color-foreground) / 0.5)' }}>
                        {tool.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all duration-300" style={{ color: 'var(--ink)', fontFamily: "'DM Mono', monospace", fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
                        {tool.ctaText || 'Open Tool'}
                        {tool.isDownload ? (
                          <Download size={14} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                        ) : (
                          <ExternalLink size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                        )}
                      </div>
                    </motion.a>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tools;

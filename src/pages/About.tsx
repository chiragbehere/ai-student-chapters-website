import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ChevronDown, Zap, Lightbulb, Users, Target } from 'lucide-react';
import SEO from '../components/SEO';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "tween", ease: "easeOut", duration: 0.4 } 
  }
};

import { useFaqs } from '../hooks/useSupabaseData';

const About = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activities = [
    { name: 'Hackathons', percent: 90, icon: <Zap size={24} style={{ color: 'var(--acid)' }} />, color: 'bg-[#11110f]', desc: 'High-intensity coding competitions where teams solve real-world challenges with AI.' },
    { name: 'Workshops', percent: 85, icon: <Lightbulb size={24} style={{ color: 'var(--sky)' }} />, color: 'bg-[#a9c7ff]', desc: 'Hands-on sessions covering the latest AI tools — led by mentors & experienced peers.' },
    { name: 'Research & Training', percent: 75, icon: <Target size={24} style={{ color: 'var(--acid)' }} />, color: 'bg-[#d8ff3e]', desc: 'Collaborative AI projects you can actually put on your resume.' },
    { name: 'Networking', percent: 80, icon: <Users size={24} style={{ color: 'var(--sky)' }} />, color: 'bg-[#a9c7ff]', desc: 'Connect with AI enthusiasts, alumni, and professionals to build lasting tech relationships.' }
  ];

  const { data: faqsData } = useFaqs('about');
  const faqs = faqsData.map(f => ({ q: f.question, a: f.answer }));

  return (
    <div className="w-full relative">
      <SEO title="About" description="From hackathons to workshops — we cover every dimension of AI education." />
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
        </div>
      </section>

      {/* Core Modules */}
      <section className="py-16 editorial-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold">What We Do</h2>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activities.map((act) => (
              <motion.div
                key={act.name}
                variants={itemVariants}
                className="glass-panel p-7 flex flex-col sm:flex-row items-start gap-5 group relative overflow-hidden"
              >
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0" style={{ border: '1px solid rgb(var(--color-border))' }}>
                  {act.icon}
                </div>

                <div className="flex-1 w-full">
                  <h3 className="text-lg font-bold mb-2">{act.name}</h3>
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgb(var(--color-foreground) / 0.45)' }}>{act.desc}</p>

                  <div className="w-full">
                    <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase mb-1.5">
                      <span style={{ color: 'rgb(var(--color-foreground) / 0.3)' }}>Engagement</span>
                      <span>{act.percent}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden" style={{ background: 'rgb(var(--color-muted))', border: '1px solid rgb(var(--color-border))' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${act.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                        className={`h-full ${act.color}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 editorial-section editorial-divider">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold">Quick FAQ</h2>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="space-y-3">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`glass-panel overflow-hidden transition-all duration-300 ${openFaq === idx ? 'border-[var(--ink)]' : ''}`}
                style={openFaq === idx ? { boxShadow: '4px 4px 0 var(--sky)' } : {}}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center group"
                >
                  <span className="font-semibold text-sm transition-colors" style={{ fontFamily: "'Syne', sans-serif", color: openFaq === idx ? 'rgb(var(--color-heading))' : 'rgb(var(--color-foreground) / 0.7)' }}>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.3, type: "tween", ease: "easeOut" }}
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center transition-colors"
                    style={{
                      background: openFaq === idx ? 'var(--ink)' : 'rgb(var(--color-muted))',
                      color: openFaq === idx ? 'var(--acid)' : 'rgb(var(--color-foreground) / 0.3)',
                    }}
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-4 pt-1 text-sm leading-relaxed" style={{ color: 'rgb(var(--color-foreground) / 0.5)', borderTop: '1px solid rgb(var(--color-border) / 0.3)' }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;

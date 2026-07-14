import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Download, Star } from 'lucide-react';
import SEO from '../components/SEO';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "tween", ease: "easeOut", duration: 0.4 } }
};

import { useSessions } from '../hooks/useSupabaseData';

const Sessions = () => {
  const { data: sessionsData } = useSessions();

  const workshops = sessionsData.map(s => ({
    title: s.title,
    embedUrl: s.embed_url,
    downloadUrl: s.download_url || '',
  }));

  return (
    <div className="w-full relative min-h-screen z-10">
      <SEO title="Sessions & Workshops" description="Presentations and resources from our past AI sessions and workshops." />
      
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
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Workshop PPTs */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-6"
        >
          {workshops.map((ws, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="glass-panel p-6 relative overflow-hidden"
            >
              <h3 className="text-base font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>{ws.title}</h3>
              <div className="overflow-hidden mb-4" style={{ border: '1px solid rgb(var(--color-border))' }}>
                <iframe
                  src={ws.embedUrl}
                  frameBorder="0"
                  width="100%"
                  height="400px"
                  allowFullScreen
                  style={{ border: 'none' }}
                  title={ws.title}
                />
              </div>
              <div className="text-center">
                <a href={ws.downloadUrl} className="genz-btn-primary inline-flex items-center gap-2 text-sm py-2.5">
                  <Download size={14} />
                  Download PPT
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Sessions;

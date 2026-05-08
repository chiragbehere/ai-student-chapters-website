import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Wrench, Award, ExternalLink, Lock, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

const PASSWORD = 'member@aisc';

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

const tools = [
  {
    title: 'AISC Certificate Studio',
    description: 'Generate professional certificates for event participants, workshop attendees, and club members. Paste names from Excel/PDF and download beautifully designed certificates instantly.',
    icon: Award,
    url: 'https://certificate-aisc.vercel.app/',
    color: 'primary',
    badge: 'Live',
  },
];

const Tools = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setError(false);
      setIsUnlocked(true);
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="w-full relative min-h-screen pt-28 pb-24 z-10 transition-colors duration-300">
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
            className="flex items-center justify-center min-h-[60vh] px-4"
          >
            <motion.div
              className="glass-panel p-8 sm:p-10 max-w-sm w-full text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Lock Icon */}
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <Lock size={28} className="text-primary" />
              </div>

              <h2 className="text-2xl font-black font-heading text-heading mb-2">
                Members <span className="grad-text">Only</span>
              </h2>
              <p className="text-foreground/40 text-sm mb-7">
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
                    className="w-full px-5 py-3.5 rounded-xl bg-foreground/5 border border-border/15 text-heading text-sm font-medium placeholder:text-foreground/30 focus:outline-none focus:border-primary/40 focus:bg-foreground/8 transition-all duration-300"
                    autoFocus
                  />
                </motion.div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-coral text-xs font-medium"
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
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* Header */}
              <div className="text-center mb-14">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, type: "tween", ease: "easeOut" }}
                  className="pill bg-primary/10 text-primary border border-primary/20 mx-auto w-fit mb-6 flex items-center gap-2"
                >
                  <Wrench size={14} />
                  built by aisc
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="text-4xl md:text-5xl font-black font-heading leading-tight mb-3 text-heading transition-colors"
                >
                  Our <span className="grad-text">Tools</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-foreground/50 text-base max-w-lg mx-auto flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} className="text-lime" />
                  Handy utilities built by the team to make life easier 🛠️
                </motion.p>
              </div>

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
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={itemVariants}
                      className="glass-panel p-6 relative overflow-hidden card-hover group cursor-pointer block"
                    >
                      {/* Badge */}
                      {tool.badge && (
                        <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-lime/15 text-lime border border-lime/20">
                          {tool.badge}
                        </span>
                      )}

                      {/* Icon */}
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                        <IconComponent size={22} className="text-primary" />
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-bold font-heading mb-2 text-heading transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-foreground/50 text-sm leading-relaxed mb-5">
                        {tool.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center gap-1.5 text-primary text-sm font-semibold group-hover:gap-2.5 transition-all duration-300">
                        Open Tool
                        <ExternalLink size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
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

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Lightbulb, Users, Target } from 'lucide-react';

const About = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activities = [
    { name: 'Hackathons 🔥', percent: 90, icon: <Zap size={24} className="text-primary" />, color: 'bg-primary', desc: 'High-intensity coding competitions where teams solve real-world challenges with AI.' },
    { name: 'Workshops 💡', percent: 85, icon: <Lightbulb size={24} className="text-secondary" />, color: 'bg-secondary', desc: 'Hands-on sessions covering the latest AI tools — led by mentors & experienced peers.' },
    { name: 'Research & Training 🎯', percent: 75, icon: <Target size={24} className="text-accent" />, color: 'bg-accent', desc: 'Collaborative AI projects you can actually put on your resume.' },
    { name: 'Networking 🤝', percent: 80, icon: <Users size={24} className="text-lime" />, color: 'bg-lime', desc: 'Connect with AI enthusiasts, alumni, and professionals to build lasting tech relationships.' }
  ];

  const faqs = [
    { q: "Who can join AI Student Chapters?", a: "Any student at RCPIMRD, from MCA and IMCA (1st year), can apply. We welcome all backgrounds — technical or not!" },
    { q: "Is there any fee to join?", a: "Nope, absolutely free! No hidden costs. Everything is open to students." },
    { q: "Do I need to know coding?", a: "Not necessarily! We have roles for designers, speakers, content creators, and event managers too." },
    { q: "What is Vibe Coding?", a: "Vibe coding is an intuitive approach to building software where you focus on flow, logic, and AI-assisted generation rather than writing every single line." },
    { q: "How often do you host events?", a: "Typically one major event per month — from hackathons to guest speakers and workshops." },
    { q: "How do I register for Code-Carnival?", a: "Click the \"Register Now\" button on the Events page and fill out the form. But hurry — spots are limited! ⚡" }
  ];

  return (
    <div className="w-full relative">
      {/* Hero */}
      <section className="pt-24 pb-14 bg-card/30 border-b border-border relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" }}
            className="text-4xl md:text-5xl font-black font-heading mb-3 text-heading transition-colors duration-300"
          >
            About <span className="grad-text">AI Chapters</span> ✨
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/50 text-base max-w-xl mx-auto"
          >
            From hackathons to workshops — we cover every dimension of AI education. Here's what we're about.
          </motion.p>
        </div>
      </section>

      {/* Core Modules */}
      <section className="py-16 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-heading text-heading transition-colors">What We Do 🛠️</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activities.map((act, idx) => (
              <motion.div
                key={act.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.04 * idx, type: "spring" }}
                className="glass-panel p-7 flex flex-col sm:flex-row items-start gap-5 group card-hover relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {act.icon}
                </div>

                <div className="flex-1 w-full">
                  <h3 className="text-lg font-bold font-heading mb-2 text-heading transition-colors">{act.name}</h3>
                  <p className="text-foreground/45 text-sm mb-4 leading-relaxed">{act.desc}</p>

                  <div className="w-full">
                    <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase mb-1.5">
                      <span className="text-foreground/30">Engagement</span>
                      <span className="text-heading/70 transition-colors">{act.percent}%</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${act.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                        className={`h-full ${act.color} rounded-full shadow-sm`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-border relative z-10 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-heading text-heading transition-colors">Quick FAQ 💬</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.02 }}
                className={`glass-panel overflow-hidden transition-all duration-300 ${openFaq === idx ? 'border-primary/40 ring-1 ring-primary/10' : ''}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center group"
                >
                  <span className={`font-heading font-semibold text-sm transition-colors ${openFaq === idx ? 'text-heading' : 'text-foreground/70 group-hover:text-heading'}`}>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${openFaq === idx ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-foreground/5 text-foreground/30'}`}
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
                      <div className="px-6 pb-4 pt-1 text-foreground/50 text-sm leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

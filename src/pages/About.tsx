import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Lightbulb, Users, Target } from 'lucide-react';

const About = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activities = [
    { name: 'Hackathons', percent: 90, icon: <Zap size={28} className="text-secondary" />, color: 'bg-secondary', desc: 'High-intensity coding competitions where teams solve real-world challenges with AI in a limited time frame.' },
    { name: 'Workshops', percent: 85, icon: <Lightbulb size={28} className="text-primary" />, color: 'bg-primary', desc: 'Hands-on technical learning sessions led by industry mentors and experienced peers covering the latest AI tools.' },
    { name: 'Research & Training', percent: 75, icon: <Target size={28} className="text-accent" />, color: 'bg-accent', desc: 'Collaborative real-world AI training programs and research projects you can include in your portfolio.' },
    { name: 'Networking', percent: 80, icon: <Users size={28} className="text-white" />, color: 'bg-white', desc: 'Connect with fellow AI enthusiasts, alumni, and professionals to build lasting relationships in the tech space.' }
  ];

  const faqs = [
    { q: "Who can join AI Student Chapters?", a: "Any student at RCPIMRD, from MCA and IMCA (1st year), can apply. We welcome students from all technical and non-technical backgrounds who are passionate about AI." },
    { q: "Is there any fee to join?", a: "No, there is absolutely no fee required to become a member or participate in our events. Everything is free and open to students." },
    { q: "Do I need to know coding to join?", a: "Not necessarily! We have roles for designers, speakers, content creators, and event managers too. We'll help you learn coding if you're interested." },
    { q: "What is Vibe Coding?", a: "Vibe coding is an intuitive approach to building software where you focus more on the flow, logic, and AI-assisted generation rather than typing every single brace." },
    { q: "How often do you host events?", a: "We typically host one major event per month, ranging from hackathons to guest speaker series and workshops." },
    { q: "How do I register for Code-Carnival?", a: "Click the \"Register Now\" button in the Event section and fill out the Google Form, but spots are limited so register early!" }
  ];

  const workshops = [
    {
      title: '1. What is Hackathon',
      embedUrl: 'https://docs.google.com/presentation/d/1mLfETYAr32KgcQeict9f856BxBwgRPye/embed?start=false&loop=false&delayms=3000',
      downloadUrl: '/ppt/What is hackathon.pptx',
    },
    {
      title: '2. What is Vibe Coding',
      embedUrl: 'https://docs.google.com/presentation/d/11B9NhHo_G7Jhv9G807eqxSyIQhddXCWh/embed?start=false&loop=false&delayms=3000',
      downloadUrl: '/ppt/What is Vibe coding.pptx',
    },
  ];

  return (
    <div className="w-full relative">
      {/* Hero */}
      <section className="pt-24 pb-16 glass-panel border-b border-border/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-6xl font-black font-heading mb-6 tracking-wide text-white"
          >
            About <span className="text-primary">AI Chapters</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 font-body text-lg max-w-2xl mx-auto"
          >
            From intense hackathons to hands-on workshops — we cover every dimension of AI education.
          </motion.p>
        </div>
      </section>

      {/* Activities / Core Modules */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-16 justify-center">
            <div className="h-[1px] w-20 bg-border" />
            <h2 className="text-3xl font-black font-heading tracking-widest text-white uppercase text-center">Core Modules</h2>
            <div className="h-[1px] w-20 bg-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activities.map((act, idx) => (
              <motion.div
                key={act.name}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="glass-panel rounded-2xl p-8 border border-white/5 flex flex-col sm:flex-row items-start gap-6 group hover:border-white/20 transition-all hover:bg-white/5 relative overflow-hidden"
              >
                <div className="p-4 bg-background rounded-2xl border border-white/5 relative shadow-inner group-hover:scale-110 transition-transform duration-500 z-10">
                  {act.icon}
                </div>

                <div className="flex-1 w-full z-10">
                  <h3 className="text-2xl font-black font-heading mb-3 tracking-wide">{act.name}</h3>
                  <p className="text-foreground/70 font-body text-sm mb-6 leading-relaxed bg-background/50 p-3 rounded-lg border border-white/5">{act.desc}</p>

                  <div className="w-full">
                    <div className="flex justify-between text-xs font-bold tracking-widest uppercase mb-2">
                      <span className="text-foreground/50">Engagement</span>
                      <span className="text-white">{act.percent}%</span>
                    </div>
                    <div className="h-3 w-full bg-background rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${act.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                        className={`h-full ${act.color} rounded-full`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshops */}
      <section className="py-24 border-t border-border bg-muted/30 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold tracking-wider uppercase mb-4">
              Learn & Build
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-heading text-white">Workshops</h2>
            <p className="text-foreground/60 font-body mt-3 max-w-lg mx-auto">
              Explore our resources on Hackathons and Vibe Coding.
            </p>
          </div>

          <div className="space-y-8">
            {workshops.map((ws, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden hover:border-white/20 transition-all"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary to-primary" />
                <h3 className="text-xl font-bold font-heading mb-4 text-white">{ws.title}</h3>
                <div className="rounded-xl overflow-hidden border border-white/10 mb-4">
                  <iframe
                    src={ws.embedUrl}
                    frameBorder="0"
                    width="100%"
                    height="450px"
                    allowFullScreen
                    style={{ border: 'none' }}
                    title={ws.title}
                  />
                </div>
                <div className="text-center">
                  <a
                    href={ws.downloadUrl}
                    className="inline-block px-6 py-3 rounded-xl border border-white/20 text-foreground/80 font-medium hover:bg-white/5 hover:text-white transition-all text-sm"
                  >
                    Download Presentation
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-border bg-background relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold font-body tracking-wider uppercase text-primary mb-4">FAQs</h2>
            <h3 className="text-3xl font-black font-heading text-white">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`border rounded-xl overflow-hidden glass-panel transition-all duration-300 ${openFaq === idx ? 'border-primary/50' : 'border-white/5 hover:border-white/20'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center bg-transparent group"
                >
                  <span className={`font-bold font-heading tracking-wide transition-colors ${openFaq === idx ? 'text-white' : 'text-foreground/80 group-hover:text-white'}`}>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                    className={`p-1 rounded-full flex-shrink-0 ${openFaq === idx ? 'bg-primary/20 text-primary' : 'bg-white/5 text-foreground/50'}`}
                  >
                    <ChevronDown size={20} />
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
                      <div className="px-6 pb-6 pt-2 text-foreground/70 font-body text-sm leading-relaxed border-t border-white/5 bg-background/50 mx-2 mb-2 rounded-b-lg">
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

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ChevronDown, MessageCircleQuestion, Send } from 'lucide-react';
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

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <motion.div 
      variants={itemVariants}
      className={`glass-panel overflow-hidden mb-3 card-hover transition-all duration-300 ${isOpen ? 'ring-1 ring-primary/20 border-primary/20 shadow-lg shadow-primary/5' : ''}`}
    >
      <button
        onClick={onClick}
        className="w-full text-left px-6 py-5 flex justify-between items-center group"
      >
        <span className={`font-heading font-semibold text-base transition-colors duration-300 pr-4 ${isOpen ? 'text-heading' : 'text-foreground/70 group-hover:text-heading'}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "tween", ease: "easeOut" }}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-foreground/5 text-foreground/40'}`}
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5 pt-1 text-foreground/60 text-sm leading-relaxed border-t border-border/50">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is AI Student Chapters? 🤔",
      answer: "We're a student-led community at RCPIMRD that's all about AI. Think hackathons, workshops, building cool projects, and just vibing with people who love tech. No boring lectures, we promise."
    },
    {
      question: "Who can join the club? 🙋",
      answer: "Literally anyone at RCPIMRD! Doesn't matter if you've never written a line of code — if you're curious about AI and want to learn, you're in. We welcome all skill levels."
    },
    {
      question: "Do I need coding experience? 💻",
      answer: "Nope! We run beginner-friendly workshops to get you started. All you need is a laptop and the willingness to learn. We'll handle the rest."
    },
    {
      question: "What kind of events do you organize? 🎉",
      answer: "We do hands-on workshops, guest sessions, coding bootcamps, and our legendary 'Code-Carnival' Hackathon. Check out the Sessions page for what's coming up next!"
    },
    {
      question: "How do I stay updated? 📱",
      answer: "Join our WhatsApp group — that's where all the action happens. We also post on our Instagram (@ai.student_chapters). Links are on the Home page!"
    }
  ];

  return (
    <div className="w-full relative min-h-screen pt-28 pb-24 z-10 transition-colors duration-300">
      <SEO title="FAQ" description="Frequently asked questions about AI Student Chapters" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "tween", ease: "easeOut" }}
            className="pill bg-accent/10 text-accent border border-accent/20 mx-auto w-fit mb-6 flex items-center gap-2"
          >
            <MessageCircleQuestion size={14} />
            you asked, we answered
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl md:text-5xl font-black font-heading leading-tight mb-3 text-heading transition-colors"
          >
            FAQ <span className="grad-text">💬</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-foreground/50 text-base max-w-lg mx-auto"
          >
            Everything you need to know about joining and being part of our community.
          </motion.p>
        </div>

        {/* FAQ List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-0"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center glass-panel p-8 md:p-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="relative z-10">
            <h3 className="text-xl font-bold font-heading text-heading mb-2 transition-colors">Still curious? 🤷‍♀️</h3>
            <p className="text-foreground/50 text-sm mb-5">Drop us a message — we're super approachable, promise.</p>
            <a
              href="mailto:imrdaistudentclub@gmail.com"
              className="genz-btn-primary inline-flex items-center gap-2"
            >
              <Send size={16} />
              Reach Out
            </a>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default FAQ;

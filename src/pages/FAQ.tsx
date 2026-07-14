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
      className={`glass-panel overflow-hidden mb-3 transition-all duration-300`}
      style={isOpen ? { borderColor: 'var(--ink)', boxShadow: '4px 4px 0 var(--sky)' } : {}}
    >
      <button
        onClick={onClick}
        className="w-full text-left px-6 py-5 flex justify-between items-center group"
      >
        <span className="font-semibold text-base transition-colors duration-300 pr-4" style={{ fontFamily: "'Syne', sans-serif", color: isOpen ? 'rgb(var(--color-heading))' : 'rgb(var(--color-foreground) / 0.7)' }}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "tween", ease: "easeOut" }}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-colors"
          style={{
            background: isOpen ? 'var(--ink)' : 'rgb(var(--color-muted))',
            color: isOpen ? 'var(--acid)' : 'rgb(var(--color-foreground) / 0.4)',
          }}
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
            <div className="px-6 pb-5 pt-1 text-sm leading-relaxed" style={{ color: 'rgb(var(--color-foreground) / 0.6)', borderTop: '1px solid rgb(var(--color-border) / 0.5)' }}>
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

import { useFaqs } from '../hooks/useSupabaseData';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { data: faqsData } = useFaqs('faq');

  const faqs = faqsData.map(f => ({
    question: f.question,
    answer: f.answer,
  }));

  return (
    <div className="w-full relative min-h-screen z-10">
      <SEO title="FAQ" description="Frequently asked questions about AI Student Chapters" />
      
      {/* Hero */}
      <section className="editorial-hero">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "tween", ease: "easeOut" }}
            className="pill mx-auto w-fit mb-6 flex items-center gap-2"
            style={{ border: '1px solid rgb(var(--color-border))', color: 'rgb(var(--color-foreground) / 0.6)' }}
          >
            <MessageCircleQuestion size={14} />
            you asked, we answered
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl md:text-5xl font-black leading-tight mb-3"
          >
            Frequently Asked <span className="grad-text">Questions</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base max-w-lg mx-auto"
            style={{ color: 'rgb(var(--color-foreground) / 0.5)', fontFamily: "'DM Mono', monospace", fontSize: '13px' }}
          >
            Everything you need to know about joining and being part of our community.
          </motion.p>
        </div>
      </section>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
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
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Still curious?</h3>
            <p className="text-sm mb-5" style={{ color: 'rgb(var(--color-foreground) / 0.5)' }}>Drop us a message — we're super approachable, promise.</p>
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

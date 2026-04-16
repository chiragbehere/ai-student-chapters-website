import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Megaphone, Download, FileText, Calendar, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

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
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
};

interface Announcement {
  title: string;
  description: string;
  date: string;
  downloadUrl: string;
  fileName: string;
  fileSize: string;
  tag: string;
}

const announcements: Announcement[] = [
  {
    title: 'Study Material — AI & ML Fundamentals',
    description: 'Download the latest study material covering core AI & Machine Learning concepts. Perfect for exam prep and self-study!',
    date: 'April 2026',
    downloadUrl: '/studymeterial.pdf',
    fileName: 'studymeterial.pdf',
    fileSize: '~1.7 MB',
    tag: '📚 Study Material',
  },
];

const Announcements = () => {
  return (
    <div className="w-full relative min-h-screen pt-28 pb-24 z-10 transition-colors duration-300">
      <SEO title="Announcements" description="Latest announcements, study materials, and updates from AI Student Chapters." />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="pill bg-accent/10 text-accent border border-accent/20 mx-auto w-fit mb-6 flex items-center gap-2"
          >
            <Megaphone size={14} />
            stay updated
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl md:text-5xl font-black font-heading leading-tight mb-3 text-heading transition-colors"
          >
            Announce<span className="grad-text">ments</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-foreground/50 text-base max-w-lg mx-auto"
          >
            Important updates, resources & study materials from the club 🚀
          </motion.p>
        </div>

        {/* Announcements List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-6"
        >
          {announcements.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="glass-panel p-6 sm:p-8 relative overflow-hidden card-hover group"
            >
              {/* Decorative glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/8 rounded-full blur-3xl group-hover:bg-primary/15 transition-all duration-500 pointer-events-none" />

              {/* Tag + Date */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/15">
                  <Sparkles size={12} />
                  {item.tag}
                </span>
                <span className="inline-flex items-center gap-1.5 text-foreground/40 text-xs">
                  <Calendar size={12} />
                  {item.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold font-heading mb-2 text-heading transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-foreground/55 text-sm leading-relaxed mb-6 max-w-2xl">
                {item.description}
              </p>

              {/* File info + Download button */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* File preview chip */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-foreground/[0.03] border border-border/10 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/15 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-red-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-heading text-sm font-medium truncate">{item.fileName}</p>
                    <p className="text-foreground/40 text-xs">{item.fileSize} • PDF</p>
                  </div>
                </div>

                {/* Download button */}
                <a
                  href={item.downloadUrl}
                  download
                  className="genz-btn-primary inline-flex items-center justify-center gap-2 text-sm py-3 px-6 shrink-0"
                >
                  <Download size={16} />
                  Download PDF
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state hint */}
        {announcements.length === 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-foreground/25 text-sm mt-10"
          >
            More announcements coming soon ✨
          </motion.p>
        )}

      </div>
    </div>
  );
};

export default Announcements;

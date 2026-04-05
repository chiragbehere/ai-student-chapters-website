import { motion } from 'framer-motion';
import { Download, Star } from 'lucide-react';

const Sessions = () => {
  const workshops = [
    { title: '1. What is Hackathon', embedUrl: 'https://docs.google.com/presentation/d/1mLfETYAr32KgcQeict9f856BxBwgRPye/embed?start=false&loop=false&delayms=3000', downloadUrl: '/ppt/What is hackathon.pptx' },
    { title: '2. What is Vibe Coding', embedUrl: 'https://docs.google.com/presentation/d/11B9NhHo_G7Jhv9G807eqxSyIQhddXCWh/embed?start=false&loop=false&delayms=3000', downloadUrl: '/ppt/What is Vibe coding.pptx' },
  ];

  return (
    <div className="w-full relative min-h-screen pt-28 pb-24 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="pill bg-secondary/10 text-secondary border border-secondary/20 mx-auto w-fit mb-6 flex items-center gap-2"
          >
            <Star size={14} />
            learn & level up
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-heading leading-tight mb-3"
          >
            Workshops <span className="grad-text">& Sessions</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-foreground/50 text-base max-w-lg mx-auto"
          >
            Presentations and resources from our past sessions 📖
          </motion.p>
        </div>

        {/* Workshop PPTs */}
        <div className="space-y-6">
          {workshops.map((ws, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-6 relative overflow-hidden card-hover"
            >
              <h3 className="text-base font-bold font-heading mb-4 text-white">{ws.title}</h3>
              <div className="rounded-xl overflow-hidden border border-white/[0.06] mb-4">
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
                <a href={ws.downloadUrl} className="genz-btn-outline inline-flex items-center gap-2 text-sm py-2.5">
                  <Download size={14} />
                  Download PPT
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Sessions;

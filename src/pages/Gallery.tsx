import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Film } from 'lucide-react';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');

  const images = [
    { src: '/images/event1.jpg', caption: 'Workshop on IMCA classes' },
    { src: '/images/event2.jpg', caption: 'Workshop on MCA classes' },
    { src: '/images/event3.jpg', caption: 'Workshop by Hon. HOD Dr. M. N. Behere' },
    { src: '/images/event4.jpg', caption: 'Mentors Meet' },
    { src: '/images/event5.jpg', caption: 'Team AISC' },
    { src: '/images/event6.jpg', caption: 'Inauguration' },
  ];

  const videos = [
    { src: '/Hackthon Highlights/hacakthon.mp4', title: '🏆 Hackathon Moments', desc: 'Best highlights from the competition' },
    { src: '/Hackthon Highlights/invetations.mp4', title: '🎤 Invites & Guests', desc: 'The team invited special guests' },
    { src: '/Hackthon Highlights/session.mp4', title: '💻 Live Session', desc: 'Workshop session on classes' },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="pt-24 pb-12 bg-card/30 border-b border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pill bg-accent/10 text-accent border border-accent/20 mx-auto w-fit mb-6 flex items-center gap-2"
          >
            <Image size={14} />
            captured moments
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" }}
            className="text-4xl md:text-5xl font-black font-heading mb-3 text-heading transition-colors"
          >
            Gallery <span className="grad-text">📸</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/50 text-base max-w-lg mx-auto"
          >
            All the moments that made our journey special ✨
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Switcher */}
          <div className="flex justify-center mb-10">
            <div className="bg-card p-1.5 rounded-full inline-flex border border-border shadow-sm">
              <button
                onClick={() => setActiveTab('images')}
                className={`relative px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all z-10 flex items-center gap-2 ${activeTab === 'images' ? 'text-white' : 'text-foreground/50 hover:text-heading'}`}
              >
                {activeTab === 'images' && (
                  <motion.div layoutId="galleryTab" className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/20 -z-10" />
                )}
                <Image size={14} /> Photos
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`relative px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all z-10 flex items-center gap-2 ${activeTab === 'videos' ? 'text-white' : 'text-foreground/50 hover:text-heading'}`}
              >
                {activeTab === 'videos' && (
                  <motion.div layoutId="galleryTab" className="absolute inset-0 bg-accent rounded-full shadow-lg shadow-accent/20 -z-10" />
                )}
                <Film size={14} /> Videos
              </button>
            </div>
          </div>

          {/* Images Grid */}
          {activeTab === 'images' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {images.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  className="relative group overflow-hidden glass-panel aspect-[4/3] card-hover"
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-heading font-semibold drop-shadow-md">{img.caption}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Videos Grid */}
          {activeTab === 'videos' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {videos.map((video, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04 }}
                  className="glass-panel overflow-hidden card-hover"
                >
                  <div className="aspect-video bg-black relative">
                    <video controls preload="metadata" playsInline className="w-full h-full object-cover">
                      <source src={video.src} type="video/mp4" />
                    </video>
                  </div>
                  <div className="p-4 border-t border-border bg-card/30">
                    <h3 className="font-bold font-heading text-base text-heading mb-0.5 transition-colors">{video.title}</h3>
                    <p className="text-foreground/40 text-xs">{video.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;

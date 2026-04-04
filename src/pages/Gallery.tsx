import { useState } from 'react';
import { motion } from 'framer-motion';

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
    { src: '/Hackthon Highlights/hacakthon.mp4', title: '🏆 Hackathon Moments', desc: 'The best highlights from our intense coding competition.' },
    { src: '/Hackthon Highlights/invetations.mp4', title: '🎤 Invitations', desc: 'The team has given invitations to the guests.' },
    { src: '/Hackthon Highlights/session.mp4', title: '💻 Session', desc: 'Session on classes.' },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="pt-20 pb-12 glass-panel border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold tracking-wider uppercase mb-6"
          >
            AI Research League
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white"
          >
            Media <span className="text-secondary font-light">Gallery</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 font-body text-lg max-w-2xl mx-auto"
          >
            Moments captured from our past events and workshops.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Switcher */}
          <div className="flex justify-center mb-12">
            <div className="glass-panel p-1 rounded-full inline-flex relative border border-white/5">
              <button
                onClick={() => setActiveTab('images')}
                className={`relative px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all z-10 ${activeTab === 'images' ? 'text-white' : 'text-foreground/60 hover:text-white'}`}
              >
                {activeTab === 'images' && (
                  <motion.div layoutId="activeGalleryTab" className="absolute inset-0 bg-primary/80 rounded-full -z-10" />
                )}
                Images
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`relative px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all z-10 ${activeTab === 'videos' ? 'text-white' : 'text-foreground/60 hover:text-white'}`}
              >
                {activeTab === 'videos' && (
                  <motion.div layoutId="activeGalleryTab" className="absolute inset-0 bg-secondary/80 rounded-full -z-10" />
                )}
                Videos
              </button>
            </div>
          </div>

          {/* Images Grid */}
          {activeTab === 'images' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {images.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="relative group overflow-hidden rounded-2xl glass-panel aspect-[4/3] border-white/5"
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-heading font-bold">{img.caption}</p>
                  </div>
                  {/* Border glow on hover */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-primary/50 transition-all z-20 pointer-events-none rounded-2xl" />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Videos Grid */}
          {activeTab === 'videos' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {videos.map((video, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel rounded-2xl overflow-hidden border-white/5 hover:border-secondary/50 transition-all"
                >
                  <div className="aspect-video bg-black relative">
                    <video controls preload="metadata" playsInline className="w-full h-full object-cover">
                      <source src={video.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="p-5 border-t border-border bg-background">
                    <h3 className="font-bold font-heading text-lg text-white mb-1">{video.title}</h3>
                    <p className="text-foreground/50 text-sm">{video.desc}</p>
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

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Image as ImageIcon, Film } from 'lucide-react';
import SEO from '../components/SEO';
import Image from '../components/Image';
import Lightbox from '../components/Lightbox';

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

import { useGalleryImages, useGalleryVideos } from '../hooks/useSupabaseData';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: galleryImages } = useGalleryImages();
  const { data: galleryVideos } = useGalleryVideos();

  const images = galleryImages.map(img => ({
    src: img.url,
    caption: img.caption || '',
  }));

  const videos = galleryVideos.map(v => ({
    src: v.url,
    title: v.title || '',
    desc: v.description || '',
  }));

  return (
    <div className="w-full">
      <SEO title="Gallery" description="Photos and videos from AI Student Chapters events." />
      {/* Hero */}
      <section className="editorial-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pill mx-auto w-fit mb-6 flex items-center gap-2"
            style={{ border: '1px solid rgb(var(--color-border))', color: 'rgb(var(--color-foreground) / 0.6)' }}
          >
            <ImageIcon size={14} />
            captured moments
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-3"
          >
            Our <span className="grad-text">Gallery</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-base max-w-lg mx-auto"
            style={{ color: 'rgb(var(--color-foreground) / 0.5)', fontFamily: "'DM Mono', monospace", fontSize: '13px' }}
          >
            All the moments that made our journey special.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 editorial-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Switcher */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex" style={{ border: '1px solid rgb(var(--color-border))' }}>
              <button
                onClick={() => setActiveTab('images')}
                className="px-6 py-2.5 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  background: activeTab === 'images' ? 'var(--ink)' : 'transparent',
                  color: activeTab === 'images' ? 'var(--acid)' : 'rgb(var(--color-foreground) / 0.5)',
                }}
              >
                <ImageIcon size={14} /> Photos
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className="px-6 py-2.5 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  background: activeTab === 'videos' ? 'var(--ink)' : 'transparent',
                  color: activeTab === 'videos' ? 'var(--acid)' : 'rgb(var(--color-foreground) / 0.5)',
                  borderLeft: '1px solid rgb(var(--color-border))',
                }}
              >
                <Film size={14} /> Videos
              </button>
            </div>
          </div>

          {/* Images Grid */}
          {activeTab === 'images' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {images.map((img, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="relative group overflow-hidden glass-panel aspect-[4/3] cursor-pointer"
                  onClick={() => {
                    setCurrentImageIndex(idx);
                    setIsLightboxOpen(true);
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-semibold drop-shadow-md" style={{ fontFamily: "'Syne', sans-serif" }}>{img.caption}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Videos Grid */}
          {activeTab === 'videos' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {videos.map((video, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="glass-panel overflow-hidden"
                >
                  <div className="aspect-video bg-black relative">
                    <video controls preload="metadata" playsInline className="w-full h-full object-cover">
                      <source src={video.src} type="video/mp4" />
                    </video>
                  </div>
                  <div className="p-4" style={{ borderTop: '1px solid rgb(var(--color-border))' }}>
                    <h3 className="font-bold text-base mb-0.5" style={{ fontFamily: "'Syne', sans-serif" }}>{video.title}</h3>
                    <p className="text-xs" style={{ color: 'rgb(var(--color-foreground) / 0.4)' }}>{video.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Lightbox 
        images={images}
        isOpen={isLightboxOpen}
        currentIndex={currentImageIndex}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={(newIdx) => setCurrentImageIndex(newIdx)}
      />
    </div>
  );
};

export default Gallery;

import React, { useState } from 'react';
import { Image as ImageIcon, Film, Sparkles, Play } from 'lucide-react';
import SEO from '../components/SEO';
import Image from '../components/Image';
import Lightbox from '../components/Lightbox';
import { useGalleryImages, useGalleryVideos } from '../hooks/useSupabaseData';

export const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: galleryImages } = useGalleryImages();
  const { data: galleryVideos } = useGalleryVideos();

  const images = galleryImages.map((img) => ({
    src: img.url,
    caption: img.caption || 'AISC Event Moment',
  }));

  const videos = galleryVideos.map((v) => ({
    src: v.url,
    title: v.title || 'Event Highlight Video',
    desc: v.description || 'Captured moments from hackathons and sessions',
  }));

  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "AI Student Chapters Media Gallery",
    "description": "Photographs and event video highlights from workshops, guest lectures, and hackathons at RCPET's IMRD.",
    "url": "https://aistudentchapter.vercel.app/gallery"
  };

  return (
    <div className="w-full text-[#E8DCC4] overflow-hidden">
      <SEO
        title="Event Gallery & Highlights | AI Student Chapters"
        description="View event photos and video recaps from AI Student Chapters hackathons, workshops, and student tech meetups at RCPIMRD."
        url="https://aistudentchapter.vercel.app/gallery"
        schema={gallerySchema}
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Gallery", item: "/gallery" }
        ]}
      />

      {/* Hero Header — Forest Green */}
      <section className="w-full section-forest border-b border-[#E8DCC4]/15 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest bg-[#142B20] px-4 py-1.5 rounded-full border border-[#E8DCC4]/15 shadow-sm">
            <Sparkles size={14} /> CAPTURED MOMENTS
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black text-[#E8DCC4] uppercase tracking-tight leading-none">
            CHAPTER <span className="text-[#8B5CF6]">GALLERY</span> & MEDIA
          </h1>
          <p className="text-[#C9BDA7] text-base sm:text-lg font-body max-w-xl mx-auto">
            Photographic and video retrospective of AI Student Chapter sprints, project reviews, and workshops.
          </p>
        </div>
      </section>

      {/* Gallery Showcase — Sand Beige */}
      <section className="w-full section-beige py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Tab Selector */}
          <div className="flex justify-center">
            <div className="flex items-center bg-[#1F3D2B] p-1.5 rounded-2xl border border-[#1F3D2B]/20 shadow-lg">
              <button
                onClick={() => setActiveTab('images')}
                className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'images'
                    ? 'bg-[#8B5CF6] text-white shadow-[0_0_16px_rgba(139,92,246,0.5)]'
                    : 'text-[#E8DCC4] hover:text-white'
                }`}
              >
                <ImageIcon size={14} /> Photos ({images.length})
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'videos'
                    ? 'bg-[#8B5CF6] text-white shadow-[0_0_16px_rgba(139,92,246,0.5)]'
                    : 'text-[#E8DCC4] hover:text-white'
                }`}
              >
                <Film size={14} /> Videos ({videos.length})
              </button>
            </div>
          </div>

          {activeTab === 'images' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentImageIndex(idx);
                    setIsLightboxOpen(true);
                  }}
                  className="card-beige group overflow-hidden aspect-[4/3] cursor-pointer relative shadow-lg hover:border-[#8B5CF6] hover:-translate-y-1 transition-all duration-300"
                >
                  <Image
                    src={img.src}
                    alt={img.caption}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2B]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-xs font-mono text-[#E8DCC4] font-medium">{img.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {videos.map((video, idx) => (
                <div key={idx} className="card-beige overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-video bg-black">
                    <video controls preload="metadata" playsInline className="w-full h-full object-cover">
                      <source src={video.src} type="video/mp4" />
                    </video>
                  </div>
                  <div className="p-5 space-y-2 bg-white/70">
                    <h3 className="font-display font-bold text-[#1F3D2B] text-base flex items-center gap-2">
                      <Play size={16} className="text-[#8B5CF6]" /> {video.title}
                    </h3>
                    <p className="text-xs text-[#526457] font-body">{video.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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

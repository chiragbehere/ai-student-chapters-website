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
    <div className="w-full relative text-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#ecefe9]">
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

      <section className="text-center space-y-3 max-w-3xl mx-auto mb-10 pt-8 border-b border-[#cdd6cd] pb-8">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#008736] uppercase tracking-widest">
          <Sparkles size={14} /> CAPTURED MOMENTS
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-[#0a0a0a] uppercase tracking-tight leading-none">
          CHAPTER <span className="text-[#008736]">GALLERY</span> & MEDIA
        </h1>
      </section>

      <div className="flex justify-center mb-10">
        <div className="flex items-center border border-[#cdd6cd]">
          <button
            onClick={() => setActiveTab('images')}
            className={`px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'images' ? 'bg-[#008736] text-white' : 'bg-[#f4f6f2] text-[#0a0a0a]'
            }`}
          >
            <ImageIcon size={14} /> Photos ({images.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-l border-[#cdd6cd] ${
              activeTab === 'videos' ? 'bg-[#008736] text-white' : 'bg-[#f4f6f2] text-[#0a0a0a]'
            }`}
          >
            <Film size={14} /> Videos ({videos.length})
          </button>
        </div>
      </div>

      {activeTab === 'images' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => {
                setCurrentImageIndex(idx);
                setIsLightboxOpen(true);
              }}
              className="grid-box group overflow-hidden aspect-[4/3] cursor-pointer"
            >
              <Image
                src={img.src}
                alt={img.caption}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, idx) => (
            <div key={idx} className="grid-box overflow-hidden">
              <div className="aspect-video bg-black">
                <video controls preload="metadata" playsInline className="w-full h-full object-cover">
                  <source src={video.src} type="video/mp4" />
                </video>
              </div>
              <div className="p-4 space-y-1 bg-[#f7f9f7]">
                <h3 className="font-heading font-bold text-[#0a0a0a] text-sm flex items-center gap-2">
                  <Play size={14} className="text-[#008736]" /> {video.title}
                </h3>
                <p className="text-xs text-[#525852] font-body">{video.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

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

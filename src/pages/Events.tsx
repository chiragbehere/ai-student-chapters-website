import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Trophy, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import EventRegistrationModal from '../components/EventRegistrationModal';
import { EVENTS, type EventItem } from '../data/chapterData';

export const Events: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [registeringEvent, setRegisteringEvent] = useState<EventItem | null>(null);

  const categories = ['All', 'Research League', 'Hackathon', 'Workshop', 'Guest Lecture'];

  const filteredEvents =
    selectedCategory === 'All'
      ? EVENTS
      : EVENTS.filter((e) => e.category === selectedCategory);

  const eventsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AI Hackathons & Events at RCPIMRD",
    "description": "Calendar of upcoming and completed AI workshops, hackathons, and competitions hosted by AI Student Chapters.",
    "itemListElement": EVENTS.map((event, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Event",
        "name": event.title,
        "description": event.description,
        "startDate": event.date,
        "eventStatus": event.status === 'Completed' ? 'https://schema.org/EventCompleted' : 'https://schema.org/EventScheduled',
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "Place",
          "name": event.location,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Shirpur",
            "addressRegion": "Maharashtra",
            "addressCountry": "IN"
          }
        },
        "organizer": {
          "@type": "Organization",
          "name": "AI Student Chapters",
          "url": "https://aistudentchapter.vercel.app/"
        }
      }
    }))
  };

  return (
    <div className="w-full relative text-[#E8DCC4] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO 
        title="AI Hackathons & Events | AI Student Chapters RCPIMRD" 
        description="Explore upcoming and past AI hackathons, Code Carnival sprints, AI Research Leagues, and technical competitions at RCPIMRD."
        url="https://aistudentchapter.vercel.app/events"
        schema={eventsSchema}
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Events", item: "/events" }
        ]}
      />

      {/* Header */}
      <section className="text-center space-y-3 max-w-3xl mx-auto mb-12 pt-8 border-b border-[#E8DCC4]/15 pb-8">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest bg-[#142B20] px-3.5 py-1 rounded-full border border-[#E8DCC4]/15">
          <Sparkles size={14} /> SPRINTS & HACKATHONS
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-black text-[#E8DCC4] uppercase tracking-tight leading-none">
          CHAPTER <span className="text-[#8B5CF6]">EVENTS</span> & LABS
        </h1>
        <p className="text-[#C9BDA7] text-base font-body leading-relaxed">
          6-hour offline build sprints, hands-on PyTorch & LLM workshops, and guest lectures hosted by AISC at RCPIMRD.
        </p>
      </section>

      {/* Filter Tabs in Sand Beige & Purple */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                : 'bg-[#E8DCC4] text-[#1F3D2B] border-[#1F3D2B]/15 hover:border-[#8B5CF6] hover:bg-[#F4EBDD]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid with Intelligent Alternating Beige & Dark Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event, idx) => {
          const isBeige = idx % 2 === 1;
          return (
            <div
              key={event.id}
              className={`${
                isBeige ? 'card-beige' : 'card-forest'
              } overflow-hidden flex flex-col justify-between group shadow-xl`}
            >
              {/* Event Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#142B20] border-b border-[#E8DCC4]/15">
                <img
                  src={event.image || '/images/event1.jpg'}
                  alt={event.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/event1.jpg';
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-3.5 py-1 rounded-full bg-[#8B5CF6] text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                  {event.category}
                </div>
                <div
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full backdrop-blur-md font-mono text-[10px] font-bold uppercase tracking-wider ${
                    isBeige
                      ? 'bg-[#E8DCC4]/90 text-[#1F3D2B] border border-[#1F3D2B]/20'
                      : 'bg-[#142B20]/90 text-[#E8DCC4] border border-[#E8DCC4]/30'
                  }`}
                >
                  {event.status}
                </div>
              </div>

              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-3">
                  <div
                    className={`flex items-center gap-4 text-xs font-mono ${
                      isBeige ? 'text-[#526457]' : 'text-[#E8DCC4]/80'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Calendar size={13} className="text-[#8B5CF6]" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#8B5CF6]" />
                      {event.location.split(',')[0]}
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-heading font-extrabold leading-snug transition-colors ${
                      isBeige ? 'text-[#1F3D2B] group-hover:text-[#8B5CF6]' : 'text-[#E8DCC4] group-hover:text-white'
                    }`}
                  >
                    {event.title}
                  </h3>

                  <p
                    className={`text-sm font-body leading-relaxed line-clamp-3 ${
                      isBeige ? 'text-[#526457]' : 'text-[#C9BDA7]'
                    }`}
                  >
                    {event.description}
                  </p>
                </div>

                <div className={`pt-5 border-t ${isBeige ? 'border-[#1F3D2B]/12' : 'border-[#E8DCC4]/15'} space-y-2.5`}>
                  {event.hasDetailedReport ? (
                    <div className="space-y-2">
                      <Link
                        to="/events/ai-research-league-2"
                        className="btn-primary w-full py-3 text-xs font-heading font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(139,92,246,0.35)]"
                      >
                        <Trophy size={14} />
                        <span>View Full Report & Winners 🏆 ↗</span>
                      </Link>
                      {event.reportPdfUrl && (
                        <a
                          href={event.reportPdfUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${
                            isBeige ? 'btn-secondary-beige' : 'btn-secondary'
                          } w-full py-2 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors`}
                        >
                          <Download size={13} className="text-[#8B5CF6]" />
                          <span>Download Official PDF (13 Pages)</span>
                        </a>
                      )}
                    </div>
                  ) : event.registrationUrl?.startsWith('/') ? (
                    <Link
                      to={event.registrationUrl}
                      className="btn-primary w-full py-3 text-xs font-heading font-bold uppercase tracking-wider text-center block shadow-[0_0_18px_rgba(139,92,246,0.35)]"
                    >
                      Explore Event Details ↗
                    </Link>
                  ) : event.status === 'Registration Open' ? (
                    <button
                      onClick={() => setRegisteringEvent(event)}
                      className="btn-primary w-full py-3 text-xs font-heading font-bold uppercase tracking-wider text-center cursor-pointer shadow-[0_0_18px_rgba(139,92,246,0.35)]"
                    >
                      Register Now
                    </button>
                  ) : (
                    <button
                      onClick={() => setRegisteringEvent(event)}
                      className={`${
                        isBeige ? 'btn-secondary-beige' : 'btn-secondary'
                      } w-full py-3 font-mono font-bold text-xs uppercase tracking-wider text-center cursor-pointer`}
                    >
                      View Event Summary
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {registeringEvent && (
        <EventRegistrationModal
          event={registeringEvent as any}
          onClose={() => setRegisteringEvent(null)}
        />
      )}
    </div>
  );
};

export default Events;

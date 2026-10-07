import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import EventRegistrationModal from '../components/EventRegistrationModal';
import { EVENTS, type EventItem } from '../data/chapterData';

export const Events: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [registeringEvent, setRegisteringEvent] = useState<EventItem | null>(null);

  const categories = ['All', 'Hackathon', 'Workshop', 'Guest Lecture'];

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
    <div className="w-full relative text-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#ecefe9]">
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
      <section className="text-center space-y-3 max-w-3xl mx-auto mb-12 pt-8 border-b border-[#cdd6cd] pb-8">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#008736] uppercase tracking-widest">
          <Sparkles size={14} /> SPRINTS & HACKATHONS
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-[#0a0a0a] uppercase tracking-tight leading-none">
          CHAPTER <span className="text-[#008736]">EVENTS</span> & LABS
        </h1>
        <p className="text-[#4e554e] text-base font-body leading-relaxed">
          6-hour offline build sprints, hands-on PyTorch & LLM workshops, and guest lectures hosted by AISC at RCPIMRD.
        </p>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all border border-[#cdd6cd] ${
              selectedCategory === cat
                ? 'bg-[#008736] text-white'
                : 'bg-[#f4f6f2] text-[#0a0a0a] hover:bg-[#e2e7e2]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <div key={event.id} className="grid-box grid-box-hover p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#cdd6cd] pb-3">
                <span className="px-3 py-1 bg-[#e2e7e2] text-[#0a0a0a] font-mono text-xs font-bold uppercase">
                  {event.category}
                </span>
                <span className="text-xs font-mono font-bold text-[#008736] uppercase">
                  {event.status}
                </span>
              </div>

              <h3 className="text-xl font-heading font-bold text-[#0a0a0a] leading-snug">
                {event.title}
              </h3>

              <p className="text-[#4e554e] text-sm font-body leading-relaxed">
                {event.description}
              </p>

              <div className="space-y-1.5 pt-2 text-xs font-mono text-[#0a0a0a]">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#008736]" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#008736]" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#cdd6cd]">
              {event.registrationUrl?.startsWith('/') ? (
                <Link
                  to={event.registrationUrl}
                  className="btn-green w-full py-3 text-xs font-heading font-bold uppercase tracking-wider text-center block"
                >
                  Explore Event Details ↗
                </Link>
              ) : (
                <button
                  onClick={() => setRegisteringEvent(event)}
                  className="w-full py-3 grid-box font-mono font-bold text-xs uppercase tracking-wider text-[#0a0a0a] hover:bg-[#e2e7e2] text-center"
                >
                  View Event Summary
                </button>
              )}
            </div>
          </div>
        ))}
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

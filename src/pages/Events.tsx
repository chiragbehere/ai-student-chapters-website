import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Medal, Award, Star, Calendar, Clock, Users, MapPin, ChevronDown, ChevronUp, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useEvents, useAllEventWinners, useAllEventTimelines } from '../hooks/useSupabaseData';
import Image from '../components/Image';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, y: 0, 
    transition: { type: "tween", ease: "easeOut", duration: 0.4 } 
  }
};

const Events = () => {
  const { data: eventsData, loading: eventsLoading } = useEvents();
  const { data: allWinners } = useAllEventWinners();
  const { data: allTimelines } = useAllEventTimelines();

  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Separate events by status
  const upcomingEvents = eventsData.filter(e => e.status !== 'completed');
  const completedEvents = eventsData.filter(e => e.status === 'completed');

  // Auto-expand the first upcoming event, or the first completed if no upcoming
  useEffect(() => {
    if (eventsData && eventsData.length > 0 && expandedId === null) {
      const firstActive = upcomingEvents[0] || completedEvents[0];
      if (firstActive) setExpandedId(firstActive.id);
    }
  }, [eventsData, expandedId]);

  const medalMap: Record<string, React.ReactNode> = {
    gold: <Medal size={24} className="text-yellow-400" />,
    silver: <Medal size={24} className="text-gray-300" />,
    bronze: <Medal size={24} className="text-amber-600" />,
    runner: <Award size={24} style={{ color: 'var(--sky)' }} />,
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  const renderWinnerCard = (winner: any) => (
    <motion.div
      key={winner.team}
      variants={itemVariants}
      className="glass-panel p-6 relative overflow-hidden group"
    >
      <div className={`absolute top-0 left-0 w-1 h-full
        ${winner.medalKey === 'gold' ? 'bg-yellow-400' : ''}
        ${winner.medalKey === 'silver' ? 'bg-gray-400' : ''}
        ${winner.medalKey === 'bronze' ? 'bg-amber-600' : ''}
        ${winner.medalKey === 'runner' ? 'bg-[#a9c7ff]' : ''}
      `} />
      
      <div className="flex justify-between items-start mb-5 ml-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center" style={{ border: '1px solid rgb(var(--color-border))' }}>
            {medalMap[winner.medalKey] || medalMap.runner}
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{winner.team}</h3>
            <p className="text-xs font-medium" style={{ color: 'rgb(var(--color-foreground) / 0.4)' }}>{winner.rank}</p>
          </div>
        </div>
        {winner.prize && (
          <span className="pill" style={{ background: 'rgba(234,179,8,0.1)', color: '#ca8a04', border: '1px solid rgba(234,179,8,0.2)' }}>
            {winner.prize}
          </span>
        )}
      </div>

      <div className="space-y-2 p-3 ml-3" style={{ background: 'rgb(var(--color-muted))', border: '1px solid rgb(var(--color-border) / 0.5)' }}>
        {winner.members && winner.members.map((member: any, i: number) => (
          <div key={i} className="flex flex-wrap gap-2 justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Star size={10} style={{ color: winner.medalKey === 'gold' ? '#facc15' : 'rgb(var(--color-foreground) / 0.3)' }} />
              <span className="text-xs font-medium" style={{ color: 'rgb(var(--color-foreground) / 0.8)' }}>{member.name}</span>
            </div>
            <span className="px-2 py-0.5 text-[10px]" style={{ border: '1px solid rgb(var(--color-border))', color: 'rgb(var(--color-foreground) / 0.4)' }}>{member.class}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderEventCard = (event: typeof eventsData[0]) => {
    const isExpanded = expandedId === event.id;
    const eventWinners = allWinners[event.id] || [];
    const ugWinners = eventWinners.filter(w => w.category === 'UG');
    const pgWinners = eventWinners.filter(w => w.category === 'PG');
    const schedule = allTimelines[event.id] || [];
    const isUpcoming = event.status !== 'completed';

    return (
      <motion.div 
        key={event.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden transition-all duration-500"
        style={{
          border: isExpanded ? '1px solid var(--ink)' : '1px solid rgb(var(--color-border))',
          background: isExpanded ? 'rgb(var(--color-card) / 0.6)' : 'rgb(var(--color-card) / 0.4)',
          boxShadow: isExpanded ? '6px 6px 0 var(--sky)' : 'none',
          cursor: isExpanded ? 'default' : 'pointer',
        }}
        onClick={() => !isExpanded && setExpandedId(event.id)}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 flex items-center justify-between gap-6 transition-colors" style={isExpanded ? { borderBottom: '1px solid rgb(var(--color-border))' } : {}}>
          <div className="flex items-center gap-5">
            {event.logo_url && (
              <div className="hidden sm:flex w-14 h-14 overflow-hidden flex-shrink-0 items-center justify-center" style={{ border: '1px solid rgb(var(--color-border))' }}>
                <Image src={event.logo_url} alt={event.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="pill text-[10px] uppercase tracking-wider font-bold" style={{
                  background: isUpcoming ? 'rgba(216,255,62,0.15)' : 'rgb(var(--color-muted))',
                  color: isUpcoming ? '#566d00' : 'rgb(var(--color-foreground) / 0.5)',
                  border: isUpcoming ? '1px solid rgba(216,255,62,0.3)' : '1px solid rgb(var(--color-border))',
                }}>
                  {isUpcoming ? 'Upcoming' : 'Completed'}
                </span>
                <span className="text-xs font-medium" style={{ color: 'rgb(var(--color-foreground) / 0.4)', fontFamily: "'DM Mono', monospace" }}>{formatDate(event.date)}</span>
              </div>
              <h2 className={`font-black ${isExpanded ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`} style={{ fontFamily: "'Syne', sans-serif" }}>{event.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {isUpcoming && event.registration_open && event.registration_url && !isExpanded && (
              <a
                href={event.registration_url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex genz-btn-primary py-2 px-4 text-xs items-center gap-2 cursor-pointer"
              >
                Register <ExternalLink size={12} className="pointer-events-none" />
              </a>
            )}
            <button 
              type="button"
              aria-label={isExpanded ? "Collapse event details" : "Expand event details"}
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation(); 
                setExpandedId(prev => prev === event.id ? null : event.id); 
              }}
              className="w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-200 z-10"
              style={{ 
                border: '1px solid rgb(var(--color-border))', 
                color: isExpanded ? '#b500ff' : 'rgb(var(--color-foreground) / 0.7)',
                background: isExpanded ? '#ecbcff' : 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#b500ff';
                e.currentTarget.style.color = '#b500ff';
                e.currentTarget.style.background = '#ecbcff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgb(var(--color-border))';
                e.currentTarget.style.color = isExpanded ? '#b500ff' : 'rgb(var(--color-foreground) / 0.7)';
                e.currentTarget.style.background = isExpanded ? '#ecbcff' : 'transparent';
              }}
            >
              {isExpanded ? <ChevronUp size={20} className="pointer-events-none" /> : <ChevronDown size={20} className="pointer-events-none" />}
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-14">
                
                {/* Event Details */}
                <div className="flex flex-col md:flex-row gap-10 items-center">
                  <div className="flex-1 space-y-6">
                    {event.description && (
                      <p className="text-base leading-relaxed" style={{ color: 'rgb(var(--color-foreground) / 0.7)', fontFamily: "'Syne', sans-serif" }}>
                        {event.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <div className="pill flex items-center gap-1.5" style={{ border: '1px solid rgb(var(--color-border))', color: 'rgb(var(--color-foreground) / 0.6)' }}><Calendar size={14}/> {formatDate(event.date)}</div>
                      {event.duration && <div className="pill flex items-center gap-1.5" style={{ border: '1px solid rgb(var(--color-border))', color: 'rgb(var(--color-foreground) / 0.6)' }}><Clock size={14}/> {event.duration}</div>}
                      {(event.participants_count ?? 0) > 0 && <div className="pill flex items-center gap-1.5" style={{ border: '1px solid rgb(var(--color-border))', color: 'rgb(var(--color-foreground) / 0.6)' }}><Users size={14}/> {event.participants_count} Participants</div>}
                      {event.location && <div className="pill flex items-center gap-1.5" style={{ border: '1px solid rgb(var(--color-border))', color: 'rgb(var(--color-foreground) / 0.6)' }}><MapPin size={14}/> {event.location}</div>}
                    </div>

                    {/* Register Button — shown prominently when expanded for upcoming events */}
                    {isUpcoming && event.registration_open && event.registration_url && (
                      <a
                        href={event.registration_url}
                        target="_blank"
                        rel="noreferrer"
                        className="genz-btn-primary inline-flex items-center gap-2 text-sm"
                      >
                        Register Now <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  {event.logo_url && (
                    <div className="flex-shrink-0">
                      <Image 
                        src={event.logo_url} 
                        alt={event.title} 
                        className="w-40 h-40 sm:w-52 sm:h-52 object-contain"
                        style={{ border: '3px solid rgb(var(--color-border))', boxShadow: '8px 8px 0 var(--sky)' }}
                      />
                    </div>
                  )}
                </div>

                {/* Winners Section */}
                {eventWinners.length > 0 && (
                  <div className="space-y-10">
                    {ugWinners.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <h3 className="text-xl font-bold flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif" }}>
                            UG Winners
                          </h3>
                          <div className="h-px flex-1 ml-2" style={{ background: 'rgb(var(--color-border))' }}></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {ugWinners.map(renderWinnerCard)}
                        </div>
                      </div>
                    )}

                    {pgWinners.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <h3 className="text-xl font-bold flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif" }}>
                            PG Winners
                          </h3>
                          <div className="h-px flex-1 ml-2" style={{ background: 'rgb(var(--color-border))' }}></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {pgWinners.map(renderWinnerCard)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Schedule Section */}
                {schedule.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <h3 className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Event Timeline</h3>
                      <div className="h-px flex-1 ml-4" style={{ background: 'rgb(var(--color-border))' }}></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {schedule.map((item: any, idx: number) => (
                        <motion.div key={idx} variants={itemVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-panel p-6 relative overflow-hidden">
                          <div className="text-xs font-bold tracking-wider mb-2" style={{ color: 'var(--acid)', fontFamily: "'DM Mono', monospace", background: 'var(--ink)', display: 'inline-block', padding: '4px 10px' }}>{item.time}</div>
                          <h4 className="text-base font-bold mb-1 mt-3" style={{ fontFamily: "'Syne', sans-serif" }}>{item.label}</h4>
                          {item.sub_text && <p className="text-xs" style={{ color: 'rgb(var(--color-foreground) / 0.4)' }}>{item.sub_text}</p>}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (eventsLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-t-[var(--ink)] rounded-full animate-spin" style={{ borderColor: 'rgb(var(--color-border))', borderTopColor: 'var(--ink)' }} />
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-screen pb-20">
      <SEO title="Events" description="Explore our upcoming and past events, hackathons, and results." />
      
      {/* Page Header */}
      <section className="editorial-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pill mx-auto w-fit mb-6 flex items-center gap-2" style={{ border: '1px solid rgb(var(--color-border))', color: 'rgb(var(--color-foreground) / 0.6)' }}>
            <Calendar size={14} /> all events
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            Our <span className="grad-text">Events</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-base max-w-lg mx-auto"
            style={{ color: 'rgb(var(--color-foreground) / 0.5)', fontFamily: "'DM Mono', monospace", fontSize: '13px' }}
          >
            Hackathons, workshops, and competitions — all in one place.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {eventsData.length === 0 ? (
          <div className="text-center py-20 glass-panel">
            <Calendar className="mx-auto mb-4" size={40} style={{ color: 'rgb(var(--color-foreground) / 0.3)' }} />
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>No Events Yet</h2>
            <p className="text-sm" style={{ color: 'rgb(var(--color-foreground) / 0.5)' }}>Check back later for upcoming events!</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Upcoming / Ongoing Events */}
            {upcomingEvents.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                    <span className="w-2 h-2" style={{ background: 'var(--acid)' }}></span>
                    Upcoming Events
                  </h2>
                  <div className="h-px flex-1" style={{ background: 'rgb(var(--color-border))' }}></div>
                </div>
                {upcomingEvents.map(renderEventCard)}
              </div>
            )}

            {/* Completed / Previous Events */}
            {completedEvents.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                    <span className="w-2 h-2" style={{ background: 'rgb(var(--color-border))' }}></span>
                    Previous Events
                  </h2>
                  <div className="h-px flex-1" style={{ background: 'rgb(var(--color-border))' }}></div>
                </div>
                {completedEvents.map(renderEventCard)}
              </div>
            )}
          </div>
        )}

        {/* Gallery CTA */}
        <section className="py-12 px-6 sm:px-10 mt-14 text-center glass-panel border border-[rgb(var(--color-border))] rounded-none max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Want to see more?</h2>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'rgb(var(--color-foreground) / 0.6)' }}>
            Check out our exclusive photo and video gallery from past events and workshops.
          </p>
          <Link 
            to="/gallery" 
            className="inline-flex items-center gap-2.5 px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md cursor-pointer"
            style={{
              background: '#ffffff',
              color: '#11110f',
              border: '1px solid #11110f',
              boxShadow: '4px 4px 0 #ecbcff',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#b500ff';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = '#b500ff';
              e.currentTarget.style.transform = 'translate(-3px, -3px)';
              e.currentTarget.style.boxShadow = '6px 6px 0 #ecbcff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = '#11110f';
              e.currentTarget.style.borderColor = '#11110f';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '4px 4px 0 #ecbcff';
            }}
          >
            Go to Gallery <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Events;

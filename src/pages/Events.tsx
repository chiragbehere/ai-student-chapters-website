import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Medal, Award, Star, Calendar, Clock, Users, MapPin, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
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
  const { theme } = useTheme();
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
    runner: <Award size={24} className="text-secondary" />,
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  const renderWinnerCard = (winner: any) => (
    <motion.div
      key={winner.team}
      variants={itemVariants}
      className="glass-panel p-6 relative overflow-hidden group card-hover"
    >
      <div className={`absolute top-0 left-0 w-1 h-full rounded-r
        ${winner.medalKey === 'gold' ? 'bg-yellow-400' : ''}
        ${winner.medalKey === 'silver' ? 'bg-gray-400' : ''}
        ${winner.medalKey === 'bronze' ? 'bg-amber-600' : ''}
        ${winner.medalKey === 'runner' ? 'bg-secondary' : ''}
      `} />
      
      <div className="flex justify-between items-start mb-5 ml-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            {medalMap[winner.medalKey] || medalMap.runner}
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-heading transition-colors duration-300">{winner.team}</h3>
            <p className="text-foreground/40 text-xs font-medium">{winner.rank}</p>
          </div>
        </div>
        {winner.prize && (
          <span className="pill bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
            {winner.prize}
          </span>
        )}
      </div>

      <div className="space-y-2 bg-background/40 p-3 rounded-xl ml-3">
        {winner.members && winner.members.map((member: any, i: number) => (
          <div key={i} className="flex flex-wrap gap-2 justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Star size={10} className={winner.medalKey === 'gold' ? 'text-yellow-400' : 'text-primary/60'} />
              <span className="text-foreground/80 text-xs font-medium">{member.name}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-card text-foreground/40 text-[10px] border border-border">{member.class}</span>
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
        className={`border rounded-3xl overflow-hidden transition-all duration-500 ${
          isExpanded 
            ? 'border-primary/20 bg-card/20 shadow-2xl shadow-primary/5' 
            : 'border-border bg-card/40 hover:bg-card/60 hover:border-border/60 cursor-pointer'
        }`}
        onClick={() => !isExpanded && setExpandedId(event.id)}
      >
        {/* Header */}
        <div className={`p-6 sm:p-8 flex items-center justify-between gap-6 transition-colors ${isExpanded ? 'border-b border-border bg-card/50' : ''}`}>
          <div className="flex items-center gap-5">
            {event.logo_url && (
              <div className="hidden sm:flex w-14 h-14 rounded-2xl overflow-hidden bg-background border border-border flex-shrink-0 items-center justify-center">
                <Image src={event.logo_url} alt={event.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                  isUpcoming 
                    ? 'bg-lime/10 text-lime border-lime/20 animate-pulse' 
                    : 'bg-foreground/5 text-foreground/50 border-border'
                }`}>
                  {isUpcoming ? '🔴 Upcoming' : '✅ Completed'}
                </span>
                <span className="text-xs text-foreground/40 font-medium">{formatDate(event.date)}</span>
              </div>
              <h2 className={`font-black font-heading text-heading ${isExpanded ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>{event.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {isUpcoming && event.registration_open && event.registration_url && !isExpanded && (
              <a
                href={event.registration_url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hidden sm:flex genz-btn-primary py-2 px-4 text-xs items-center gap-2"
              >
                Register <ExternalLink size={12} />
              </a>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : event.id); }}
              className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/50 hover:bg-foreground/10 hover:text-heading transition-colors"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
                      <p className="text-foreground/70 text-base leading-relaxed">
                        {event.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <div className="pill flex items-center gap-1.5 bg-foreground/5 border border-border text-foreground/60"><Calendar size={14}/> {formatDate(event.date)}</div>
                      {event.duration && <div className="pill flex items-center gap-1.5 bg-foreground/5 border border-border text-foreground/60"><Clock size={14}/> {event.duration}</div>}
                      {(event.participants_count ?? 0) > 0 && <div className="pill flex items-center gap-1.5 bg-foreground/5 border border-border text-foreground/60"><Users size={14}/> {event.participants_count} Participants</div>}
                      {event.location && <div className="pill flex items-center gap-1.5 bg-foreground/5 border border-border text-foreground/60"><MapPin size={14}/> {event.location}</div>}
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
                        className="w-40 h-40 sm:w-52 sm:h-52 object-contain rounded-full border-4 border-card shadow-2xl"
                        style={{ boxShadow: theme === 'dark' ? '0 0 40px rgba(168,85,247,0.2)' : '0 10px 40px rgba(168,85,247,0.1)' }}
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
                          <h3 className="text-xl font-bold font-heading text-heading flex items-center gap-3">
                            <span>🎓</span> UG Winners
                          </h3>
                          <div className="h-px bg-border flex-1 ml-2"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {ugWinners.map(renderWinnerCard)}
                        </div>
                      </div>
                    )}

                    {pgWinners.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <h3 className="text-xl font-bold font-heading text-heading flex items-center gap-3">
                            <span>🔹</span> PG Winners
                          </h3>
                          <div className="h-px bg-border flex-1 ml-2"></div>
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
                      <h3 className="text-xl font-bold font-heading text-heading">Event Timeline ⏰</h3>
                      <div className="h-px bg-border flex-1 ml-4"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {schedule.map((item: any, idx: number) => (
                        <motion.div key={idx} variants={itemVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-panel p-6 relative overflow-hidden card-hover">
                          <span className="text-3xl mb-3 block">{item.emoji || '📌'}</span>
                          <div className="text-primary font-bold text-xs tracking-wider mb-2">{item.time}</div>
                          <h4 className="text-base font-bold font-heading text-heading mb-1 transition-colors">{item.label}</h4>
                          {item.sub_text && <p className="text-foreground/40 text-xs">{item.sub_text}</p>}
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
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-screen pb-20">
      <SEO title="Events" description="Explore our upcoming and past events, hackathons, and results." />
      
      {/* Page Header */}
      <section className="pt-28 pb-10 bg-card/30 border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pill bg-primary/10 text-primary border border-primary/20 mx-auto w-fit mb-6 flex items-center gap-2">
            <Calendar size={14} /> all events
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black font-heading mb-4 text-heading"
          >
            Our <span className="grad-text">Events</span> 🚀
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/50 text-base max-w-lg mx-auto"
          >
            Hackathons, workshops, and competitions — all in one place.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {eventsData.length === 0 ? (
          <div className="text-center py-20 bg-card/30 border border-border rounded-3xl">
            <Calendar className="mx-auto text-foreground/30 mb-4" size={40} />
            <h2 className="text-xl font-heading text-heading mb-2">No Events Yet</h2>
            <p className="text-foreground/50 text-sm">Check back later for upcoming events!</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Upcoming / Ongoing Events */}
            {upcomingEvents.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold font-heading text-heading flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-lime animate-pulse"></span>
                    Upcoming Events
                  </h2>
                  <div className="h-px bg-border flex-1"></div>
                </div>
                {upcomingEvents.map(renderEventCard)}
              </div>
            )}

            {/* Completed / Previous Events */}
            {completedEvents.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold font-heading text-heading flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-foreground/30"></span>
                    Previous Events
                  </h2>
                  <div className="h-px bg-border flex-1"></div>
                </div>
                {completedEvents.map(renderEventCard)}
              </div>
            )}
          </div>
        )}

        {/* Gallery CTA */}
        <section className="py-16 mt-10 text-center">
          <h2 className="text-2xl font-bold font-heading text-heading mb-3 transition-colors">Want to see more? 📸</h2>
          <p className="text-foreground/50 text-sm mb-6">Check out our exclusive photo and video gallery from the events.</p>
          <Link to="/gallery" className="genz-btn-primary inline-block">
            Go to Gallery →
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Events;

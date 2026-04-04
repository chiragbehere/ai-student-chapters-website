import { motion } from 'framer-motion';
import { Medal, Award, Star, Calendar, Clock, Users, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events = () => {
  const ugWinners = [
    {
      team: 'STAR', rank: '1st Rank', prize: '₹500 Prize',
      medal: <Medal size={28} className="text-yellow-400" />, medalKey: 'gold',
      members: [{ name: 'Vishwakarma Rishabh Pandurang', class: 'IMCA 2' }]
    },
    {
      team: 'The Ultron', rank: '2nd Rank', prize: '₹500 Prize',
      medal: <Medal size={28} className="text-gray-300" />, medalKey: 'silver',
      members: [
        { name: 'Yash Mahendra Patil', class: 'IMCA 2' },
        { name: 'Hrishikesh Sambhaji Bari', class: 'IMCA 2' },
        { name: 'Tejas Haresh Sonavane', class: 'IMCA 2' }
      ]
    },
    {
      team: 'Code Warriors', rank: '1st Runner-up',
      medal: <Medal size={28} className="text-amber-600" />, medalKey: 'bronze',
      members: [
        { name: 'Tiwari Mehul Sanjay', class: 'IMCA 3' },
        { name: 'Bhavesh Mahendra Borse', class: 'IMCA 2' },
        { name: 'Moin Altaf Ansari', class: 'IMCA 2' }
      ]
    },
    {
      team: 'PAYLO4D_C4RT3L', rank: '2nd Runner-up',
      medal: <Award size={28} className="text-secondary" />, medalKey: 'runner',
      members: [
        { name: 'Aniruddha Balaji Landge', class: 'IMCA 3' },
        { name: 'Aastha Vilas Deshmukh', class: 'IMCA 2' },
        { name: 'Vaibhav Jaywantrao Patil', class: 'IMCA 4' }
      ]
    }
  ];

  const pgWinners = [
    {
      team: 'SoloStack', rank: '1st Rank', prize: '₹500 Prize',
      medal: <Medal size={28} className="text-yellow-400" />, medalKey: 'gold',
      members: [{ name: 'Pratik Mahajan', class: 'IMCA 4' }]
    },
    {
      team: 'DRAG', rank: '2nd Rank', prize: '₹500 Prize',
      medal: <Medal size={28} className="text-gray-300" />, medalKey: 'silver',
      members: [
        { name: 'Aditya Wagh', class: 'MCA 1 B' },
        { name: 'Akshay Borase', class: 'MCA 1 B' }
      ]
    },
    {
      team: 'Nova Zen Coders', rank: '1st Runner-up',
      medal: <Medal size={28} className="text-amber-600" />, medalKey: 'bronze',
      members: [
        { name: 'Chirag Kishor Borse', class: 'MCA 1 B' },
        { name: 'Kalpesh Dnyaneshwar Sonawane', class: 'MCA 1 B' }
      ]
    },
    {
      team: 'Hackathon Horizon', rank: '2nd Runner-up',
      medal: <Award size={28} className="text-secondary" />, medalKey: 'runner',
      members: [
        { name: 'Monika Anil Patil', class: 'MCA 1 B' },
        { name: 'Jayashree Mukunda Patil', class: 'MCA 1 B' },
        { name: 'Divya Madhukar Patil', class: 'MCA 2 B' }
      ]
    }
  ];

  const schedule = [
    { time: '09:00 - 10:00', label: 'Reporting', sub: 'Verification, Workstation Setup, Opening Brief.', emoji: '🚪' },
    { time: '10:00 - 04:00', label: 'Coding Phase', sub: '6 Hours of Continuous Development (Lunch at Desk).', emoji: '🧑‍💻' },
    { time: '04:00 - 05:00', label: 'Evaluation', sub: 'Live Demos, Jury Q&A, and Result Declaration.', emoji: '🎤' },
  ];

  const infoChips = [
    { icon: <Calendar size={14} />, text: 'March 24, 2026' },
    { icon: <Clock size={14} />, text: '6 Hours' },
    { icon: <Users size={14} />, text: '33 Participants' },
    { icon: <MapPin size={14} />, text: 'On Campus' },
    { icon: <CheckCircle size={14} />, text: 'Completed', special: true },
  ];

  const videos = [
    { src: '/Hackthon Highlights/hacakthon.mp4', title: '🏆 Hackathon Moments', desc: 'The best highlights from our intense coding competition.' },
    { src: '/Hackthon Highlights/invetations.mp4', title: '🎤 Invitations', desc: 'The team has given invitations to the guests.' },
    { src: '/Hackthon Highlights/session.mp4', title: '💻 Session', desc: 'Session on classes.' },
  ];

  const renderWinnerCard = (winner: typeof ugWinners[0], idx: number) => (
    <motion.div
      key={winner.team}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="glass-panel rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all hover:-translate-y-1"
    >
      <div className={`absolute top-0 left-0 w-1 h-full 
        ${winner.medalKey === 'gold' && 'bg-yellow-500'}
        ${winner.medalKey === 'silver' && 'bg-gray-400'}
        ${winner.medalKey === 'bronze' && 'bg-amber-600'}
        ${winner.medalKey === 'runner' && 'bg-secondary'}
      `} />
      
      <div className="flex justify-between items-start mb-6 ml-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-background rounded-xl border border-white/5">
            {winner.medal}
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading">{winner.team}</h3>
            <p className="text-foreground/50 font-medium text-sm">{winner.rank}</p>
          </div>
        </div>
        {winner.prize && (
          <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
            {winner.prize}
          </span>
        )}
      </div>

      <div className="space-y-2 bg-muted p-4 rounded-xl ml-4">
        {winner.members.map((member, i) => (
          <div key={i} className="flex flex-wrap gap-2 justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Star size={12} className={winner.medalKey === 'gold' ? 'text-yellow-400' : 'text-primary'} />
              <span className="font-medium text-foreground">{member.name}</span>
            </div>
            <span className="px-2 py-1 rounded bg-background text-foreground/60 text-xs border border-white/5">{member.class}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="w-full relative">
      {/* Hero Banner */}
      <section className="pt-24 pb-16 relative z-10 glass-panel border-b border-border text-center md:text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 space-y-6"
            >
              <div className="inline-flex px-4 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium tracking-wide">
                ✅ Completed
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-heading leading-tight text-foreground">
                Code Carnival <span className="text-primary">Results</span>
              </h1>
              <p className="text-foreground/70 font-body text-lg max-w-xl mx-auto md:mx-0">
                The 6-hour build sprint was a massive success! 33 participants competed across UG & PG categories.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-10 md:mt-0 flex-shrink-0"
            >
              <img
                src="/images/code-carnival-logo.png"
                alt="Code Carnival Logo"
                className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-full border-2 border-white/15"
                style={{
                  boxShadow: '0 0 28px rgba(0,240,255,0.5), 0 0 56px rgba(157,0,255,0.3), 0 0 12px rgba(255,0,60,0.2)',
                  animation: 'glowPulse 3s ease-in-out infinite alternate',
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Chips + Prize Pool */}
      <section className="py-12 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Info Chips */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {infoChips.map((chip, i) => (
              <div
                key={i}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
                  chip.special
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-white/5 border-white/10 text-foreground/70'
                }`}
              >
                {chip.icon}
                {chip.text}
              </div>
            ))}
          </div>

          {/* Completed badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-5 border-green-500/20 mb-8 max-w-md mx-auto"
          >
            <p className="text-xl font-bold text-green-400 font-heading">🎉 Event Successfully Completed!</p>
          </motion.div>

          {/* Prize Pool */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[
              { medal: '🥇', amount: '₹500', label: '1st Place' },
              { medal: '🥈', amount: '₹500', label: '2nd Place' },
              { medal: '🥉', amount: '🏆', label: 'Runner-up' },
            ].map((prize, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel rounded-xl p-4 text-center hover:bg-white/5 transition-all"
              >
                <span className="text-3xl block mb-2">{prize.medal}</span>
                <div className="font-bold text-white text-lg">{prize.amount}</div>
                <div className="text-[10px] uppercase tracking-widest text-foreground/40 mt-1">{prize.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* UG Winners */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold font-heading text-foreground border-l-4 border-secondary pl-4 py-1 inline-block">
              🎓 UG Winners
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ugWinners.map((w, i) => renderWinnerCard(w, i))}
          </div>
        </div>
      </section>

      {/* PG Winners */}
      <section className="py-20 bg-muted/30 border-t border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold font-heading text-foreground border-l-4 border-primary pl-4 py-1 inline-block">
              🔹 PG Winners
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pgWinners.map((w, i) => renderWinnerCard(w, i))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-8 relative z-10">
        <div className="max-w-md mx-auto px-4 text-center">
          <a
            href="https://chat.whatsapp.com/FQdz9mHb4y37ooH1JxiYoF"
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold font-heading transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 text-center"
          >
            JOIN WHATSAPP GROUP
          </a>
        </div>
      </section>

      {/* Video Highlights */}
      <section className="py-20 border-t border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold tracking-wider uppercase mb-4">
              🎬 Highlights
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">Hackathon Highlights</h2>
            <p className="text-foreground/60 font-body mt-3 max-w-lg mx-auto">
              Relive the best moments from Code-Carnival 2026!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel rounded-2xl overflow-hidden hover:border-white/20 transition-all"
              >
                <div className="aspect-video bg-black relative">
                  <video controls preload="metadata" playsInline className="w-full h-full object-cover">
                    <source src={video.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="p-5 border-t border-border">
                  <h3 className="font-bold font-heading text-lg text-white mb-1">{video.title}</h3>
                  <p className="text-foreground/50 text-sm">{video.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule/Timeline */}
      <section className="py-20 border-t border-border bg-muted/30 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold tracking-wider uppercase mb-4">
              Timeline
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">Hackathon Schedule</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {schedule.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="glass-panel rounded-2xl p-6 relative overflow-hidden hover:border-white/20 transition-all group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-secondary to-primary rounded-r" />
                <div className="ml-4">
                  <span className="text-3xl mb-4 block">{item.emoji}</span>
                  <div className="text-secondary font-bold text-sm tracking-wide mb-2">{item.time}</div>
                  <h3 className="text-lg font-bold font-heading text-white mb-2">{item.label}</h3>
                  <p className="text-foreground/50 text-sm">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery CTA */}
      <section className="py-20 relative z-10 glass-panel border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">View Event Highlights</h2>
          <p className="text-foreground/70 font-body mb-8 text-lg">Did you miss out on the coding action? View our exclusive photo and video gallery from the event.</p>
          <Link to="/gallery" className="inline-block bg-white text-background px-8 py-4 rounded-xl font-bold font-heading transition-all hover:bg-foreground w-full sm:w-auto text-center">
            Go to Gallery
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Events;

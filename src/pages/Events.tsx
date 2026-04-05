import { motion } from 'framer-motion';
import { Medal, Award, Star, Calendar, Clock, Users, MapPin, CheckCircle, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events = () => {
  const ugWinners = [
    { team: 'STAR', rank: '1st Rank', prize: '₹500', medal: <Medal size={24} className="text-yellow-400" />, medalKey: 'gold', members: [{ name: 'Vishwakarma Rishabh Pandurang', class: 'IMCA 2' }] },
    { team: 'The Ultron', rank: '2nd Rank', prize: '₹500', medal: <Medal size={24} className="text-gray-300" />, medalKey: 'silver', members: [{ name: 'Yash Mahendra Patil', class: 'IMCA 2' }, { name: 'Hrishikesh Sambhaji Bari', class: 'IMCA 2' }, { name: 'Tejas Haresh Sonavane', class: 'IMCA 2' }] },
    { team: 'Code Warriors', rank: '1st Runner-up', medal: <Medal size={24} className="text-amber-600" />, medalKey: 'bronze', members: [{ name: 'Tiwari Mehul Sanjay', class: 'IMCA 3' }, { name: 'Bhavesh Mahendra Borse', class: 'IMCA 2' }, { name: 'Moin Altaf Ansari', class: 'IMCA 2' }] },
    { team: 'PAYLO4D_C4RT3L', rank: '2nd Runner-up', medal: <Award size={24} className="text-secondary" />, medalKey: 'runner', members: [{ name: 'Aniruddha Balaji Landge', class: 'IMCA 3' }, { name: 'Aastha Vilas Deshmukh', class: 'IMCA 2' }, { name: 'Vaibhav Jaywantrao Patil', class: 'IMCA 4' }] }
  ];

  const pgWinners = [
    { team: 'SoloStack', rank: '1st Rank', prize: '₹500', medal: <Medal size={24} className="text-yellow-400" />, medalKey: 'gold', members: [{ name: 'Pratik Mahajan', class: 'IMCA 4' }] },
    { team: 'DRAG', rank: '2nd Rank', prize: '₹500', medal: <Medal size={24} className="text-gray-300" />, medalKey: 'silver', members: [{ name: 'Aditya Wagh', class: 'MCA 1 B' }, { name: 'Akshay Borase', class: 'MCA 1 B' }] },
    { team: 'Nova Zen Coders', rank: '1st Runner-up', medal: <Medal size={24} className="text-amber-600" />, medalKey: 'bronze', members: [{ name: 'Chirag Kishor Borse', class: 'MCA 1 B' }, { name: 'Kalpesh Dnyaneshwar Sonawane', class: 'MCA 1 B' }] },
    { team: 'Hackathon Horizon', rank: '2nd Runner-up', medal: <Award size={24} className="text-secondary" />, medalKey: 'runner', members: [{ name: 'Monika Anil Patil', class: 'MCA 1 B' }, { name: 'Jayashree Mukunda Patil', class: 'MCA 1 B' }, { name: 'Divya Madhukar Patil', class: 'MCA 2 B' }] }
  ];

  const schedule = [
    { time: '09:00 - 10:00', label: 'Check-in', sub: 'Verification, setup, and briefing', emoji: '🚪' },
    { time: '10:00 - 04:00', label: 'Build Time', sub: '6 hours of non-stop coding', emoji: '🧑‍💻' },
    { time: '04:00 - 05:00', label: 'Demos & Results', sub: 'Live demos, Q&A, and winners', emoji: '🎤' },
  ];

  const infoChips = [
    { icon: <Calendar size={13} />, text: 'March 24, 2026' },
    { icon: <Clock size={13} />, text: '6 Hours' },
    { icon: <Users size={13} />, text: '33 Participants' },
    { icon: <MapPin size={13} />, text: 'On Campus' },
    { icon: <CheckCircle size={13} />, text: 'Completed', special: true },
  ];

  const videos = [
    { src: '/Hackthon Highlights/hacakthon.mp4', title: '🏆 Hackathon Moments', desc: 'Best highlights from the competition' },
    { src: '/Hackthon Highlights/invetations.mp4', title: '🎤 Invites & Guests', desc: 'The team invited special guests' },
    { src: '/Hackthon Highlights/session.mp4', title: '💻 Live Session', desc: 'Workshop session on classes' },
  ];

  const renderWinnerCard = (winner: typeof ugWinners[0], idx: number) => (
    <motion.div
      key={winner.team}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08, type: "spring" }}
      className="glass-panel p-6 relative overflow-hidden group card-hover"
    >
      <div className={`absolute top-0 left-0 w-1 h-full rounded-r
        ${winner.medalKey === 'gold' && 'bg-yellow-400'}
        ${winner.medalKey === 'silver' && 'bg-gray-400'}
        ${winner.medalKey === 'bronze' && 'bg-amber-600'}
        ${winner.medalKey === 'runner' && 'bg-secondary'}
      `} />
      
      <div className="flex justify-between items-start mb-5 ml-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-card border border-white/[0.06] flex items-center justify-center">
            {winner.medal}
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-white">{winner.team}</h3>
            <p className="text-foreground/40 text-xs font-medium">{winner.rank}</p>
          </div>
        </div>
        {winner.prize && (
          <span className="pill bg-yellow-500/10 text-yellow-400 border border-yellow-500/15">
            {winner.prize}
          </span>
        )}
      </div>

      <div className="space-y-2 bg-background/40 p-3 rounded-xl ml-3">
        {winner.members.map((member, i) => (
          <div key={i} className="flex flex-wrap gap-2 justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Star size={10} className={winner.medalKey === 'gold' ? 'text-yellow-400' : 'text-primary/60'} />
              <span className="text-foreground/80 text-xs font-medium">{member.name}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-card text-foreground/40 text-[10px] border border-white/[0.04]">{member.class}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="w-full relative">
      {/* Hero */}
      <section className="pt-24 pb-14 relative z-10 bg-card/30 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 space-y-5 text-center md:text-left">
              <div className="pill bg-lime/10 text-lime border border-lime/20 w-fit mx-auto md:mx-0">✅ Completed</div>
              <h1 className="text-4xl md:text-6xl font-black font-heading leading-tight text-white">
                Code Carnival <span className="grad-text">Results</span> 🏆
              </h1>
              <p className="text-foreground/50 text-base max-w-xl mx-auto md:mx-0">
                The 6-hour build sprint was a massive success! 33 participants competed across UG & PG categories.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="flex-shrink-0">
              <img
                src="/images/code-carnival-logo.png"
                alt="Code Carnival Logo"
                className="w-40 h-40 md:w-52 md:h-52 object-contain rounded-full border-2 border-white/10"
                style={{ boxShadow: '0 0 30px rgba(168,85,247,0.3), 0 0 60px rgba(56,189,248,0.15)', animation: 'glowPulse 3s ease-in-out infinite alternate' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Chips + Prize */}
      <section className="py-10 relative z-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {infoChips.map((chip, i) => (
              <div key={i} className={`pill flex items-center gap-1.5 ${chip.special ? 'bg-lime/10 border border-lime/20 text-lime' : 'bg-white/[0.04] border border-white/[0.04] text-foreground/50'}`}>
                {chip.icon} {chip.text}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {[
              { medal: '🥇', amount: '₹500', label: '1st Place' },
              { medal: '🥈', amount: '₹500', label: '2nd Place' },
              { medal: '🥉', amount: '🏆', label: 'Runner-up' },
            ].map((prize, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-panel p-4 text-center card-hover">
                <span className="text-2xl block mb-1">{prize.medal}</span>
                <div className="font-bold text-white text-base">{prize.amount}</div>
                <div className="text-[10px] uppercase tracking-widest text-foreground/30 mt-1">{prize.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* UG Winners */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold font-heading text-white mb-8 flex items-center gap-3">
            <span className="text-2xl">🎓</span> UG Winners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ugWinners.map((w, i) => renderWinnerCard(w, i))}
          </div>
        </div>
      </section>

      {/* PG Winners */}
      <section className="py-16 bg-card/20 border-y border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold font-heading text-white mb-8 flex items-center gap-3">
            <span className="text-2xl">🔹</span> PG Winners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pgWinners.map((w, i) => renderWinnerCard(w, i))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-8 relative z-10">
        <div className="max-w-md mx-auto px-4 text-center">
          <a href="https://chat.whatsapp.com/FQdz9mHb4y37ooH1JxiYoF" target="_blank" rel="noreferrer" className="genz-btn-primary block w-full text-center">
            Join WhatsApp Group 💬
          </a>
        </div>
      </section>

      {/* Video Highlights */}
      <section className="py-16 border-t border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="pill bg-secondary/10 text-secondary border border-secondary/20 mx-auto w-fit mb-4 flex items-center gap-2">
              <Play size={12} /> highlights
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-white">Hackathon Highlights 🎬</h2>
            <p className="text-foreground/40 text-sm mt-2">Relive the best moments from Code-Carnival 2026!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((video, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="glass-panel overflow-hidden card-hover">
                <div className="aspect-video bg-black relative">
                  <video controls preload="metadata" playsInline className="w-full h-full object-cover">
                    <source src={video.src} type="video/mp4" />
                  </video>
                </div>
                <div className="p-4 border-t border-white/[0.04]">
                  <h3 className="font-bold font-heading text-base text-white mb-0.5">{video.title}</h3>
                  <p className="text-foreground/40 text-xs">{video.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-16 border-t border-white/[0.04] bg-card/20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-heading text-white">Event Timeline ⏰</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {schedule.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.12 }} className="glass-panel p-6 relative overflow-hidden card-hover">
                <span className="text-3xl mb-3 block">{item.emoji}</span>
                <div className="text-primary font-bold text-xs tracking-wider mb-2">{item.time}</div>
                <h3 className="text-base font-bold font-heading text-white mb-1">{item.label}</h3>
                <p className="text-foreground/40 text-xs">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery CTA */}
      <section className="py-16 relative z-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold font-heading text-white mb-3">Want to see more? 📸</h2>
          <p className="text-foreground/50 text-sm mb-6">Check out our exclusive photo and video gallery from the event.</p>
          <Link to="/gallery" className="genz-btn-primary inline-block">
            Go to Gallery →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Events;

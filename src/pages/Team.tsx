import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Team = () => {
  const leaders = [
    { name: 'Kartik Sharad Valhe', role: 'President', class: 'IMCA-IV', emoji: '👑' },
    { name: 'Krushnali Vanusing Jadhav', role: 'Vice President', class: 'IMCA-II', emoji: '⭐' },
    { name: 'Tejas Dipak Panchbhai', role: 'Secretary', class: 'IMCA-IV', emoji: '📋' },
    { name: 'Aastha Vilas Deshmukh', role: 'Treasurer', class: 'IMCA-II', emoji: '💰' },
    { name: 'Chirag Rajesh Behere', role: 'Event Manager', class: 'IMCA-II', emoji: '🎯' },
    { name: 'Aniruddha Balaji Landge', role: 'Tech Lead', class: 'IMCA-III', emoji: '💻' },
    { name: 'Moin Altaf Ansari', role: 'Documentation Head', class: 'IMCA-II', emoji: '📝' },
    { name: 'Shreyash Sunil Patil', role: 'Camera Lead', class: 'IMCA-IV', emoji: '📸' },
    { name: 'Bhumika Vilas Patil', role: 'Social Media', class: 'IMCA-II', emoji: '📱' }
  ];

  const members = [
    { name: 'Vaibhav Jaywantorao Patil', class: 'IMCA-IV' },
    { name: 'Sejal Prashant Patil', class: 'IMCA-II' },
    { name: 'Sai Paresh Upakare', class: 'IMCA-IV' },
    { name: 'Bhumika Nitin Patil', class: 'IMCA-IV' },
    { name: 'Tejaswini Pravin Pawar', class: 'IMCA-I' },
    { name: 'Tejas Aaba Bagul', class: 'IMCA-I' },
    { name: 'Shrikant Dinesh Borase', class: 'IMCA-I' },
    { name: 'Manasi Dipak Bhamare', class: 'IMCA-I' },
    { name: 'Ruchita Prabhakar Chaudhari', class: 'IMCA-I' },
    { name: 'Radhika Vijay Patil', class: 'IMCA-I' },
    { name: 'Yogesh Adhikar Badgujar', class: 'IMCA-I' },
    { name: 'Harshada Manohar Bagul', class: 'IMCA-I' },
    { name: 'Om Bhaskar Borse', class: 'IMCA-I' },
    { name: 'Harsh Naresh Fulari', class: 'IMCA-I' },
    { name: 'Purushottam Kishor Patil', class: 'IMCA-I' },
    { name: 'Ketana Ambalal Lohar', class: 'MCA-I' },
    { name: 'Karuna Nitin Soni', class: 'MCA-I' },
    { name: 'Pushpanjali Manohar Patil', class: 'MCA-I' },
    { name: 'Utkarsha Manohar Patil', class: 'MCA-I' }
  ];

  const colors = ['from-primary to-secondary', 'from-accent to-primary', 'from-secondary to-lime', 'from-coral to-accent', 'from-primary to-accent'];

  return (
    <div className="w-full relative">
      {/* Hero */}
      <section className="pt-24 pb-14 bg-card/30 border-b border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pill bg-primary/10 text-primary border border-primary/20 mx-auto w-fit mb-6 flex items-center gap-2">
            <Star size={14} /> the crew
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black font-heading mb-3 text-white"
          >
            Meet the <span className="grad-text">Team</span> 👥
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/50 text-base max-w-lg mx-auto"
          >
            The amazing humans behind AI Student Chapters ✨
          </motion.p>
        </div>
      </section>

      {/* Leaders */}
      <section className="py-14 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {leaders.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, type: "spring" }}
                className="glass-panel p-5 text-center group card-hover relative overflow-hidden"
              >
                <div className={`mx-auto rounded-2xl bg-gradient-to-br ${colors[idx % colors.length]} w-14 h-14 flex items-center justify-center text-2xl mb-3 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                  {member.emoji}
                </div>
                <h3 className="font-heading font-bold text-sm text-white leading-tight mb-1">{member.name}</h3>
                <p className="text-primary text-[10px] uppercase font-bold tracking-wider mb-0.5">{member.role}</p>
                <p className="text-foreground/30 text-[10px] uppercase font-medium">{member.class}</p>
              </motion.div>
            ))}
          </div>

          {/* Separator */}
          <div className="my-12 flex items-center gap-4">
            <div className="h-px bg-white/[0.06] flex-1"></div>
            <span className="pill bg-white/[0.04] text-foreground/40 border border-white/[0.04]">members 💜</span>
            <div className="h-px bg-white/[0.06] flex-1"></div>
          </div>

          {/* Members */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {members.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className="glass-panel p-4 text-center group card-hover"
              >
                <div className="mx-auto w-10 h-10 rounded-full bg-card border border-white/[0.06] flex items-center justify-center text-white font-bold font-heading text-sm mb-2.5 group-hover:scale-110 transition-transform">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-heading font-semibold text-xs text-white/80 leading-tight mb-0.5">{member.name}</h3>
                <p className="text-foreground/30 text-[10px] uppercase font-medium">{member.class}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;

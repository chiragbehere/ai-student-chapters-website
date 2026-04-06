import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Star } from 'lucide-react';
import SEO from '../components/SEO';

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
  hidden: { opacity: 0, scale: 0.9 },
  show: { 
    opacity: 1, 
    scale: 1, 
    transition: { type: "spring", stiffness: 150, damping: 15 } 
  }
};


const Team = () => {
  const leaders = [
    { name: 'Kartik Sharad Valhe', role: 'President', class: 'IMCA-IV', emoji: '👑', image: '/team/Kartik-Valhe.webp' },
    { name: 'Krushnali Vanusing Jadhav', role: 'Vice President', class: 'IMCA-II', emoji: '⭐', image: '/team/Krushnali-Jadhav.webp' },
    { name: 'Tejas Dipak Panchbhai', role: 'Secretary', class: 'IMCA-IV', emoji: '📋', image: '/team/Tejas-Panchbhai.webp' },
    { name: 'Aastha Vilas Deshmukh', role: 'Treasurer', class: 'IMCA-II', emoji: '💰', image: '/team/Aastha-Deshmukh.webp' },
    { name: 'Chirag Rajesh Behere', role: 'Event Manager', class: 'IMCA-II', emoji: '🎯', image: '/team/Chirag-Behere.webp' },
    { name: 'Aniruddha Balaji Landge', role: 'Tech Lead', class: 'IMCA-III', emoji: '💻', image: '/team/Aniruddha-Landge.webp' },
    { name: 'Moin Altaf Ansari', role: 'Documentation Head', class: 'IMCA-II', emoji: '📝', image: '/team/Moin-Ansari.webp' },
    { name: 'Shreyash Sunil Patil', role: 'Camera Lead', class: 'IMCA-IV', emoji: '📸', image: '/team/Shreyash-Patil.webp' },
    { name: 'Bhumika Vilas Patil', role: 'Social Media', class: 'IMCA-II', emoji: '📱', image: '/team/Bhumika-Patil-I-2.webp' }
  ];

  const members = [
    { name: 'Vaibhav Jaywantorao Patil', class: 'IMCA-IV', image: '/team/Vaibhav-Patil.webp' },
    { name: 'Sejal Prashant Patil', class: 'IMCA-II', image: '/team/Sejal-Patil.webp' },
    { name: 'Sai Paresh Upakare', class: 'IMCA-IV', image: '/team/Sai-Upakare.webp' },
    { name: 'Bhumika Nitin Patil', class: 'IMCA-IV', image: '/team/Bhumika-Patil.webp' },
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
      <SEO title="Team" description="Meet the people behind the AI Student Chapters." />
      {/* Hero */}
      <section className="pt-24 pb-14 bg-card/30 border-b border-border relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pill bg-primary/10 text-primary border border-primary/20 mx-auto w-fit mb-6 flex items-center gap-2">
            <Star size={14} /> the crew
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black font-heading mb-3 text-heading transition-colors"
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
      <section className="py-14 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {leaders.map((member, idx) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="glass-panel p-5 text-center group card-hover relative overflow-hidden"
              >
                <div className={`mx-auto rounded-full bg-gradient-to-br ${colors[idx % colors.length]} w-20 h-20 flex items-center justify-center text-2xl mb-4 transition-transform duration-500 hover:scale-105 border-2 border-border shadow-lg overflow-hidden`}>
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      loading="lazy"
                      className="w-full h-full object-cover scale-[1.7] object-[center_40%] translate-y-1 group-hover:scale-[1.8] group-hover:rotate-2 transition-transform duration-500"
                    />
                  ) : (
                    <span className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">{member.emoji}</span>
                  )
                  }
                </div>
                <h3 className="font-heading font-bold text-sm text-heading leading-tight mb-1 transition-colors">{member.name}</h3>
                <p className="text-primary text-[10px] uppercase font-bold tracking-wider mb-0.5">{member.role}</p>
                <p className="text-foreground/30 text-[10px] uppercase font-medium">{member.class}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Separator */}
          <div className="my-12 flex items-center gap-4">
            <div className="h-px bg-border flex-1"></div>
            <span className="pill bg-background/5 text-foreground/40 border border-border">members 💜</span>
            <div className="h-px bg-border flex-1"></div>
          </div>

          {/* Members */}
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {members.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="glass-panel p-4 text-center group card-hover"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-heading font-bold font-heading text-sm mb-3 group-hover:scale-105 transition-transform overflow-hidden">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      loading="lazy"
                      className="w-full h-full object-cover scale-[1.7] object-[center_40%] translate-y-1 group-hover:scale-[1.8] transition-transform duration-500"
                    />
                  ) : (
                    member.name.charAt(0)
                  )
                  }
                </div>
                <h3 className="font-heading font-semibold text-xs text-heading/80 leading-tight mb-0.5 transition-colors">{member.name}</h3>
                <p className="text-foreground/30 text-[10px] uppercase font-medium">{member.class}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Team;

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Star } from 'lucide-react';
import SEO from '../components/SEO';
import Image from '../components/Image';

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
  hidden: { opacity: 0, y: 16 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "tween", ease: "easeOut", duration: 0.4 } 
  }
};

import { useTeamLeaders, useTeamMembers } from '../hooks/useSupabaseData';

const Team = () => {
  const { data: leadersData } = useTeamLeaders();
  const { data: membersData } = useTeamMembers();

  // Map DB shape to component shape
  const leaders = leadersData.map(l => ({
    name: l.name,
    role: l.role || '',
    class: l.class,
    emoji: l.emoji || '',
    image: l.image_url || undefined,
  }));

  const members = membersData.map(m => ({
    name: m.name,
    class: m.class,
    image: m.image_url || undefined,
  }));

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
                <div className={`mx-auto rounded-full bg-gradient-to-br ${colors[idx % colors.length]} w-20 h-20 flex items-center justify-center text-2xl mb-4 border-2 border-border shadow-lg overflow-hidden`}>
                  {member.image ? (
                    <Image 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{member.emoji}</span>
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
                <div className="mx-auto w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-heading font-bold font-heading text-sm mb-3 overflow-hidden">
                  {member.image ? (
                    <Image 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
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

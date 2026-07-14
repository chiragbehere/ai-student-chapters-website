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

  const gradients = ['#11110f', '#a9c7ff', '#d8ff3e', '#11110f', '#a9c7ff'];

  return (
    <div className="w-full relative">
      <SEO title="Team" description="Meet the people behind the AI Student Chapters." />
      {/* Hero */}
      <section className="editorial-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pill mx-auto w-fit mb-6 flex items-center gap-2" style={{ border: '1px solid rgb(var(--color-border))', color: 'rgb(var(--color-foreground) / 0.6)' }}>
            <Star size={14} /> the crew
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-3"
          >
            Meet the <span className="grad-text">Team</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-base max-w-lg mx-auto"
            style={{ color: 'rgb(var(--color-foreground) / 0.5)', fontFamily: "'DM Mono', monospace", fontSize: '13px' }}
          >
            The amazing humans behind AI Student Chapters.
          </motion.p>
        </div>
      </section>

      {/* Leaders */}
      <section className="py-14 editorial-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {leaders.map((member, idx) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="glass-panel p-5 text-center group relative overflow-hidden"
              >
                <div 
                  className="mx-auto w-20 h-20 flex items-center justify-center text-2xl mb-4 overflow-hidden"
                  style={{ border: '2px solid rgb(var(--color-border))', background: gradients[idx % gradients.length], color: gradients[idx % gradients.length] === '#11110f' ? '#d8ff3e' : '#11110f' }}
                >
                  {member.image ? (
                    <Image 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '28px' }}>{member.name.charAt(0)}</span>
                  )
                  }
                </div>
                <h3 className="font-bold text-sm leading-tight mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{member.name}</h3>
                <p className="text-[10px] uppercase font-bold tracking-wider mb-0.5" style={{ color: 'var(--acid)', fontFamily: "'DM Mono', monospace" }}>{member.role}</p>
                <p className="text-[10px] uppercase font-medium" style={{ color: 'rgb(var(--color-foreground) / 0.3)', fontFamily: "'DM Mono', monospace" }}>{member.class}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Separator */}
          <div className="my-12 flex items-center gap-4">
            <div className="h-px flex-1" style={{ background: 'rgb(var(--color-border))' }}></div>
            <span className="pill" style={{ border: '1px solid rgb(var(--color-border))', color: 'rgb(var(--color-foreground) / 0.4)' }}>members</span>
            <div className="h-px flex-1" style={{ background: 'rgb(var(--color-border))' }}></div>
          </div>

          {/* Members */}
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {members.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="glass-panel p-4 text-center group"
              >
                <div className="mx-auto w-12 h-12 flex items-center justify-center font-bold text-sm mb-3 overflow-hidden" style={{ border: '1px solid rgb(var(--color-border))', fontFamily: "'Syne', sans-serif" }}>
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
                <h3 className="font-semibold text-xs leading-tight mb-0.5" style={{ fontFamily: "'Syne', sans-serif" }}>{member.name}</h3>
                <p className="text-[10px] uppercase font-medium" style={{ color: 'rgb(var(--color-foreground) / 0.3)', fontFamily: "'DM Mono', monospace" }}>{member.class}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Team;

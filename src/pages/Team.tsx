import { motion } from 'framer-motion';

const Team = () => {
  const leaders = [
    { name: 'Kartik Sharad Valhe', role: 'President', class: 'IMCA-IV' },
    { name: 'Krushnali Vanusing Jadhav', role: 'Vice President', class: 'IMCA-II' },
    { name: 'Tejas Dipak Panchbhai', role: 'Secretary', class: 'IMCA-IV' },
    { name: 'Aastha Vilas Deshmukh', role: 'Treasurer', class: 'IMCA-II' },
    { name: 'Chirag Rajesh Behere', role: 'Event Manager', class: 'IMCA-II' },
    { name: 'Aniruddha Balaji Landge', role: 'Technical Department Head', class: 'IMCA-III' },
    { name: 'Moin Altaf Ansari', role: 'Documentation and Report Head', class: 'IMCA-II' },
    { name: 'Shreyash Sunil Patil', role: 'Camera Team Head', class: 'IMCA-IV' },
    { name: 'Bhumika Vilas Patil', role: 'Social Media Head', class: 'IMCA-II' }
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

  const renderCard = (member: any, idx: number, isLeader: boolean) => (
    <motion.div
      key={member.name}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05 }}
      className="glass-panel rounded-lg border border-white/5 p-5 shadow-sm hover:border-white/20 transition-all text-center group cursor-default relative overflow-hidden"
    >
      <div className="mx-auto rounded-full bg-muted border border-white/10 flex items-center justify-center text-white font-black font-heading w-16 h-16 text-2xl mb-4 relative z-10 transition-transform duration-500 group-hover:scale-110">
        {member.name.charAt(0)}
      </div>
      
      <h3 className="font-bold font-heading tracking-wide mb-1 relative z-10 text-base leading-tight text-white">
        {member.name}
      </h3>
      {isLeader && (
        <p className="text-secondary text-xs uppercase font-bold relative z-10 mb-1">{member.role}</p>
      )}
      <p className="text-foreground/50 text-[10px] uppercase font-bold relative z-10">Class: {member.class}</p>
    </motion.div>
  );

  return (
    <div className="w-full relative">
      <section className="pt-24 pb-16 glass-panel border-b border-border/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black font-heading mb-4 tracking-wide text-white"
          >
            Meet the <span className="text-secondary">Core Team</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 font-body text-base max-w-2xl mx-auto tracking-wide"
          >
            The passionate individuals who make the magic happen.
          </motion.p>
        </div>
      </section>

      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Leaders Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {leaders.map((member, idx) => renderCard(member, idx, true))}
          </div>

          {/* Separator */}
          <div className="my-12 flex items-center gap-4 opacity-50">
            <div className="h-px bg-white/10 flex-1"></div>
            <h2 className="text-lg font-bold font-heading text-white uppercase tracking-[0.2em]">Members</h2>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          {/* Members Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {members.map((member, idx) => renderCard(member, idx, false))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Team;

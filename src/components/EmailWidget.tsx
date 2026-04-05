import { motion } from 'framer-motion';


const EmailWidget = () => {
  return (
    <motion.a
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.7 }}
      href="mailto:imrdaistudentclub@gmail.com"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[5.5rem] right-6 w-14 h-14 rounded-full bg-white shadow-lg shadow-black/10 border border-black/5 flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-transform duration-300 group"
      aria-label="Send Email"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" 
        alt="Gmail" 
        className="w-7 h-7 object-contain" 
      />
    </motion.a>
  );
};

export default EmailWidget;

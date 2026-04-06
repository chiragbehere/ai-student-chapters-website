import { motion } from 'framer-motion';

const EmailWidget = () => {
  return (
    <motion.a
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.7 }}
      href="https://mail.google.com/mail/?view=cm&fs=1&to=imrdaistudentclub@gmail.com"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[5.5rem] right-6 w-14 h-14 rounded-full bg-white shadow-lg shadow-black/10 border border-border/20 flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-transform duration-300 group"
      aria-label="Send Email via Gmail"
    >
      {/* Official Gmail logo SVG */}
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="url(#gmail-gradient)"/>
        <defs>
          <linearGradient id="gmail-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EA4335"/>
            <stop offset="0.33" stopColor="#FBBC04"/>
            <stop offset="0.66" stopColor="#34A853"/>
            <stop offset="1" stopColor="#4285F4"/>
          </linearGradient>
        </defs>
      </svg>
    </motion.a>
  );
};

export default EmailWidget;

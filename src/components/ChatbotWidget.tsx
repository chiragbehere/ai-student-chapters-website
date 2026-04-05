import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Bot, User, Sparkles } from 'lucide-react';

type Message = {
  id: string;
  role: 'bot' | 'user';
  text: string;
};

const QA = [
  { q: "Who can join AI Chapters?", a: "Any student at RCPIMRD, from MCA and IMCA, can apply. We welcome all backgrounds — technical or not!" },
  { q: "Is there any fee to join?", a: "Nope, absolutely free! No hidden costs. Everything is open to students." },
  { q: "Do I need to know coding?", a: "Not necessarily! We have roles for designers, speakers, content creators, and event managers too." },
  { q: "What is Vibe Coding?", a: "Vibe coding is building software intuitively with AI. Focus on flow and logic rather than writing every line." },
  { q: "How often are events?", a: "Typically one major event per month — from hackathons to guest speakers and workshops." },
  { q: "How do I register?", a: "Just click the 'Register' button on the Events page. Spots fill up quick!" },
  { q: "Who leads the club?", a: "Our core team is led by students primarily from IMCA and MCA. You can meet them all on our Team page!" },
  { q: "Where do we chat?", a: "We mainly communicate on our WhatsApp group! You can find the link on the home page." },
];

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial-1', role: 'bot', text: 'Hey there! 👋 I am the AI Chapters Bot. How can I help you today?' },
    { id: 'initial-2', role: 'bot', text: 'Tap any of the questions below to get quick answers!' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleQuestionClick = (q: string, a: string) => {
    // Add user message
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: q }]);

    // Simulated bot typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: a }]);
    }, 400);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[5.5rem] right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center z-50 hover:scale-[1.05] active:scale-95 transition-transform duration-300 ${isOpen ? 'hidden' : 'flex'} group`}
        aria-label="Open Chat"
      >
        <MessageCircle size={26} className="group-hover:animate-pulse" />
        {/* Unread badge / ping */}
        <span className="absolute top-0 right-0 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-accent border-2 border-background"></span>
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-[5.5rem] right-6 w-[90vw] sm:w-[380px] h-[600px] max-h-[75vh] bg-card border border-border/20 shadow-2xl rounded-2xl flex flex-col overflow-hidden z-[60] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-primary/10 border-b border-border/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-heading text-sm">AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/50 hover:text-heading flex items-center justify-center transition-colors"
                aria-label="Close Chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat History area */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin space-y-4">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-white mt-1 ${msg.role === 'user' ? 'bg-secondary' : 'bg-primary'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-secondary text-white rounded-tr-sm' : 'bg-foreground/5 text-foreground/80 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Questions Picker */}
            <div className="p-4 border-t border-border/10 bg-background/50 backdrop-blur-md">
              <p className="text-[11px] font-bold tracking-widest text-foreground/40 uppercase mb-3 pl-1">Ask a question</p>
              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1 pb-1 scrollbar-thin">
                {QA.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuestionClick(item.q, item.a)}
                    className="text-xs text-left px-3 py-2 rounded-xl bg-card border border-border/40 text-foreground/70 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all shadow-sm"
                  >
                    {item.q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;

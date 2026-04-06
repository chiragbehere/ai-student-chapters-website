import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, User, Sparkles, Send, RotateCcw } from 'lucide-react';

type Message = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
};

// AI Chatbot Logic and UI for AI Student Chapters website

const QUICK_QUESTIONS = [
  "What is AI Student Chapters?",
  "How do I join the club?",
  "Who leads the club?",
  "What events have you done?",
  "Do I need coding skills?",
  "What's Vibe Coding?",
  "When is the next event?",
  "How do I contact you?",
];

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial-1', role: 'assistant', text: 'Hey there! 👋 I\'m ChaptersBot, your AI assistant for AI Student Chapters!' },
    { id: 'initial-2', role: 'assistant', text: 'Ask me anything about the club, events, team, or how to join. Or tap a quick question below! ⚡' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Knowledge base - keyword patterns mapped to answers
  const QA_DATABASE: { keywords: string[]; answer: string }[] = [
    {
      keywords: ['what is', 'about', 'tell me about', 'what are', 'who are you', 'introduce'],
      answer: "AI Student Chapters is a student-run tech club at RCPIMRD college focused on AI, ML, and emerging technologies! 🚀 We host hackathons, workshops, coding sessions, and tech talks to help students explore the world of tech."
    },
    {
      keywords: ['join', 'member', 'sign up', 'register', 'enroll', 'how to join', 'become'],
      answer: "Joining is super easy! 🎉 You don't need any coding experience — we welcome everyone. Just reach out to us on Instagram @ai.student_chapters or email us at imrdaistudentclub@gmail.com and we'll get you onboard!"
    },
    {
      keywords: ['team', 'lead', 'president', 'who leads', 'members', 'committee', 'core'],
      answer: "Here's our awesome team! 🌟\n👑 President: Kartik Kulkarni\n🤝 Vice President: Krushnali Ghodake\n📝 Secretary: Tejas Suradkar\n💰 Treasurer: Aastha Shirke\n🎯 Events Manager: Chirag Behere\n💻 Technical Lead: Aniruddha Deshmukh"
    },
    {
      keywords: ['event', 'hackathon', 'workshop', 'session', 'activity', 'done', 'past'],
      answer: "We've hosted some amazing events! 🎪\n🏆 Code-Carnival Hackathon (March 2026) — our flagship event!\n💻 Vibe Coding Workshop — hands-on coding fun\n🤖 AI/ML Workshops — learn cutting-edge tech\n🎤 Guest lectures from industry experts\nStay tuned on our Instagram for upcoming events!"
    },
    {
      keywords: ['coding', 'code', 'programming', 'skill', 'experience', 'beginner', 'need'],
      answer: "Nope, you don't need any coding skills to join! 💪 We welcome complete beginners and experienced coders alike. Our workshops start from the basics, so everyone can learn and grow together."
    },
    {
      keywords: ['vibe coding', 'vibe'],
      answer: "Vibe Coding is our signature workshop format! 🎶 It's all about coding in a chill, collaborative environment with music, snacks, and good vibes. We make learning to code fun and stress-free!"
    },
    {
      keywords: ['next event', 'upcoming', 'when', 'schedule', 'next'],
      answer: "Follow us on Instagram @ai.student_chapters to stay updated on upcoming events! 📱 You can also email us at imrdaistudentclub@gmail.com to get on our mailing list. Exciting things are always in the works! 🔥"
    },
    {
      keywords: ['contact', 'reach', 'email', 'instagram', 'social', 'connect', 'talk'],
      answer: "You can reach us through:\n📧 Email: imrdaistudentclub@gmail.com\n📸 Instagram: @ai.student_chapters\nFeel free to DM us or drop an email — we'd love to hear from you! 💬"
    },
    {
      keywords: ['kartik'],
      answer: "Kartik Kulkarni is our President! 👑 He leads the club and drives our vision forward. A passionate tech enthusiast who's always looking for ways to make the club better!"
    },
    {
      keywords: ['krushnali'],
      answer: "Krushnali Ghodake is our Vice President! 🤝 She supports the president and helps coordinate all club activities. An amazing leader and organizer!"
    },
    {
      keywords: ['tejas'],
      answer: "Tejas Suradkar is our Secretary! 📝 He manages club communications and keeps everything organized. Always on top of things!"
    },
    {
      keywords: ['aastha'],
      answer: "Aastha Shirke is our Treasurer! 💰 She manages the club's finances and makes sure our events are budgeted perfectly."
    },
    {
      keywords: ['chirag'],
      answer: "Chirag Behere is our Events Manager! 🎯 He plans and executes all our amazing events, from hackathons to workshops. The mastermind behind our events!"
    },
    {
      keywords: ['aniruddha'],
      answer: "Aniruddha Deshmukh is our Technical Lead! 💻 He handles all the tech infrastructure and leads our technical workshops. A coding wizard!"
    },
    {
      keywords: ['hi', 'hello', 'hey', 'hii', 'hiii', 'sup', 'yo', 'hola', 'greetings'],
      answer: "Hey there! 👋 Welcome to AI Student Chapters! How can I help you today? You can ask me about the club, events, team, or how to join!"
    },
    {
      keywords: ['thanks', 'thank', 'thx', 'ty', 'appreciate'],
      answer: "You're welcome! 😊 Happy to help! If you have more questions, feel free to ask anytime. See you at our next event! ⚡"
    },
    {
      keywords: ['bye', 'goodbye', 'see you', 'later', 'cya'],
      answer: "See you later! 👋 Don't forget to follow us on Instagram @ai.student_chapters for updates. Have an awesome day! 🌟"
    },
    {
      keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning'],
      answer: "We're all about AI & ML! 🤖 Our club explores artificial intelligence, machine learning, deep learning, and other emerging technologies through hands-on workshops and projects. Join us to dive into the world of AI!"
    },
    {
      keywords: ['college', 'rcpimrd', 'school', 'university'],
      answer: "AI Student Chapters is based at RCPIMRD college! 🏫 We're a student-run tech club that's open to all students of the college. Come join our tech community!"
    },
  ];

  const getAnswer = (question: string): string => {
    const q = question.toLowerCase().trim();

    // Check each Q&A entry for keyword matches
    for (const qa of QA_DATABASE) {
      for (const keyword of qa.keywords) {
        if (q.includes(keyword.toLowerCase())) {
          return qa.answer;
        }
      }
    }

    // Default fallback response
    return "Great question! 🤔 I don't have a specific answer for that, but our team would love to help! Reach out to us:\n📧 Email: imrdaistudentclub@gmail.com\n📸 Instagram: @ai.student_chapters\n\nOr try asking about: the club, events, team, how to join, or coding skills!";
  };

  const sendMessage = useCallback((userText: string) => {
    if (isLoading || !userText.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Simulate a brief "thinking" delay for natural feel
    setTimeout(() => {
      const reply = getAnswer(userText);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: reply,
      }]);
      setIsLoading(false);
    }, 500 + Math.random() * 700);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([
      { id: 'initial-1', role: 'assistant', text: 'Hey there! 👋 I\'m ChaptersBot, your AI assistant for AI Student Chapters!' },
      { id: 'initial-2', role: 'assistant', text: 'Ask me anything about the club, events, team, or how to join. Or tap a quick question below! ⚡' }
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[13.5rem] right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center z-50 hover:scale-[1.05] active:scale-95 transition-transform duration-300 ${isOpen ? 'hidden' : 'flex'} group`}
        aria-label="Open AI Chat"
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
        {/* AI badge */}
        <span className="absolute -top-1 -left-1 px-1.5 py-0.5 bg-accent text-white text-[8px] font-bold rounded-full uppercase tracking-wider shadow-sm">
          AI
        </span>
        {/* Ping indicator */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-accent border-2 border-background"></span>
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
            className="fixed bottom-[5.5rem] right-6 w-[90vw] sm:w-[400px] h-[620px] max-h-[78vh] bg-card border border-border/20 shadow-2xl rounded-2xl flex flex-col overflow-hidden z-[60] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-primary/15 via-accent/10 to-secondary/10 border-b border-border/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/30 relative">
                  <Sparkles size={18} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-lime border-2 border-card" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-heading text-sm flex items-center gap-1.5">
                    ChaptersBot
                    <span className="px-1.5 py-0.5 bg-primary/15 text-primary text-[8px] font-bold rounded-full uppercase">AI</span>
                  </h3>
                  <span className="text-[10px] text-foreground/40 font-medium">Powered by AI • Always online</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={handleReset}
                  className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/40 hover:text-heading flex items-center justify-center transition-colors"
                  aria-label="Reset Chat"
                  title="Reset conversation"
                >
                  <RotateCcw size={14} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/40 hover:text-heading flex items-center justify-center transition-colors"
                  aria-label="Close Chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin space-y-3">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex gap-2.5 max-w-[88%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-white mt-0.5 shadow-sm ${msg.role === 'user' ? 'bg-secondary' : 'bg-gradient-to-br from-primary to-accent'}`}>
                    {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-secondary text-white rounded-tr-sm' 
                      : 'bg-foreground/[0.06] text-foreground/80 rounded-tl-sm border border-border/10'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 mr-auto"
                >
                  <div className="w-7 h-7 flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white mt-0.5 shadow-sm">
                    <Bot size={13} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-foreground/[0.06] border border-border/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions (show only when few messages) */}
            {messages.length <= 4 && !isLoading && (
              <div className="px-4 pb-2 pt-1 border-t border-border/10">
                <p className="text-[10px] font-bold tracking-widest text-foreground/30 uppercase mb-2 pl-0.5">Quick questions</p>
                <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto scrollbar-thin">
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-[11px] text-left px-2.5 py-1.5 rounded-xl bg-card border border-border/30 text-foreground/60 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-border/10 bg-background/50 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 bg-card border border-border/20 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-primary/20"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[9px] text-foreground/25 text-center mt-1.5 font-medium">
                Powered by AI • Responses may vary
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;

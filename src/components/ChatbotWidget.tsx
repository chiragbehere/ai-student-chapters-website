import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, User, Sparkles, Send, RotateCcw } from 'lucide-react';
import { useChatbotQA } from '../hooks/useSupabaseData';

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

  // Load Q&A from Supabase (with fallback to hardcoded data)
  const { data: qaDatabase } = useChatbotQA();

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

  const getAnswer = useCallback((question: string): string => {
    const q = question.toLowerCase().trim();

    // Check each Q&A entry for keyword matches
    for (const qa of qaDatabase) {
      for (const keyword of qa.keywords) {
        if (q.includes(keyword.toLowerCase())) {
          return qa.answer;
        }
      }
    }

    // Default fallback response
    return "Great question! 🤔 I don't have a specific answer for that, but our team would love to help! Reach out to us:\n📧 Email: imrdaistudentclub@gmail.com\n📸 Instagram: @ai.student_chapters\n\nOr try asking about: the club, events, team, how to join, or coding skills!";
  }, [qaDatabase]);

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
        transition={{ type: "tween", ease: "easeOut", duration: 0.4, delay: 0.3 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[10rem] right-6 w-10 h-10 rounded-full bg-primary text-white shadow-md shadow-primary/30 flex items-center justify-center z-50 hover:scale-[1.05] active:scale-95 transition-transform duration-300 ${isOpen ? 'hidden' : 'flex'} group`}
        aria-label="Open AI Chat"
      >
        <Sparkles size={18} className="group-hover:animate-pulse" />
        {/* AI badge */}
        <span className="absolute -top-1 -left-1 px-1 py-0.5 bg-accent text-white text-[7px] font-bold rounded-full uppercase tracking-wider shadow-sm">
          AI
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: "tween", ease: "circOut", duration: 0.3 }}
            className="fixed bottom-[5.5rem] right-6 w-[90vw] sm:w-[400px] h-[620px] max-h-[78vh] bg-card border border-border/20 shadow-2xl rounded-2xl flex flex-col overflow-hidden z-[60]"
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
            <form onSubmit={handleSubmit} className="p-3 border-t border-border/10 bg-background">
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

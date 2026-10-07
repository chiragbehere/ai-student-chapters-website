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

export interface ChatbotWidgetProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  isOpen: externalIsOpen,
  onOpenChange,
  hideTrigger = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalIsOpen(value);
    }
  };

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
  }, [isLoading, getAnswer]);

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
      {!hideTrigger && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.4, delay: 0.3 }}
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-[12.5rem] right-6 w-11 h-11 rounded-full bg-[#008736] text-white shadow-xl shadow-[#008736]/30 flex items-center justify-center z-40 hover:bg-[#00722d] hover:scale-110 active:scale-95 transition-all duration-300 ${isOpen ? 'hidden' : 'flex'} group`}
          aria-label="Open AI Chat"
          title="Open ChaptersBot AI"
        >
          <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
          {/* AI badge */}
          <span className="absolute -top-1 -left-1 px-1.5 py-0.5 bg-[#0a0a0a] text-white text-[8px] font-bold rounded-full uppercase tracking-wider shadow-sm">
            AI
          </span>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "tween", ease: "circOut", duration: 0.3 }}
            className="fixed bottom-3 right-3 left-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[420px] h-[560px] sm:h-[640px] max-h-[85vh] bg-white/95 backdrop-blur-2xl border-2 border-[#cdd6cd] shadow-[0_20px_60px_rgba(0,0,0,0.25)] rounded-2xl flex flex-col overflow-hidden z-[60]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-4 bg-[#f4f6f2] border-b border-[#cdd6cd] gap-1.5">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#008736] flex items-center justify-center text-white shadow-md relative shrink-0">
                  <Sparkles size={16} className="sm:w-5 sm:h-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-bold text-[#0a0a0a] text-xs sm:text-base flex items-center gap-1 sm:gap-2 leading-tight">
                    <span className="truncate">ChaptersBot</span>
                    <span className="px-1.5 py-0.5 bg-[#008736]/15 text-[#008736] text-[8px] sm:text-[9px] font-bold rounded-full uppercase tracking-wider shrink-0">AI</span>
                  </h3>
                  <span className="text-[9px] sm:text-[11px] text-[#4e554e] font-medium block truncate max-w-[110px] sm:max-w-none">Powered by AI • Always online</span>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button 
                  onClick={handleReset}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#eaefea] hover:bg-[#dce4dc] text-[#4e554e] hover:text-[#0a0a0a] flex items-center justify-center transition-colors shrink-0"
                  aria-label="Reset Chat"
                  title="Reset conversation"
                >
                  <RotateCcw size={14} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#eaefea] hover:bg-[#dce4dc] text-[#4e554e] hover:text-[#0a0a0a] flex items-center justify-center transition-colors shrink-0"
                  aria-label="Close Chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#ffffff]">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex gap-2.5 max-w-[88%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-white mt-0.5 shadow-sm ${msg.role === 'user' ? 'bg-[#0a0a0a]' : 'bg-[#008736]'}`}>
                    {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#008736] text-white rounded-tr-sm shadow-md font-medium' 
                      : 'bg-[#f4f6f2] text-[#0a0a0a] rounded-tl-sm border border-[#cdd6cd] shadow-sm font-medium whitespace-pre-line'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 mr-auto"
                >
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[#008736] flex items-center justify-center text-white mt-0.5 shadow-sm">
                    <Bot size={15} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[#f4f6f2] border border-[#cdd6cd] flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 bg-[#008736] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#008736] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#008736] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 4 && !isLoading && (
              <div className="px-4 pb-3 pt-2.5 border-t border-[#cdd6cd] bg-[#f8faf8]">
                <p className="text-[10px] font-bold tracking-widest text-[#4e554e] uppercase mb-2 pl-0.5">Quick questions</p>
                <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto scrollbar-thin">
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-[11px] text-left px-3 py-1.5 rounded-xl bg-white border border-[#cdd6cd] text-[#0a0a0a] font-semibold hover:text-white hover:bg-[#008736] hover:border-[#008736] transition-all shadow-sm active:scale-95"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3.5 border-t border-[#cdd6cd] bg-[#f4f6f2]">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 bg-white border-2 border-[#cdd6cd] rounded-xl px-4 py-2.5 text-sm text-[#0a0a0a] font-medium placeholder:text-[#717a71] focus:outline-none focus:border-[#008736] focus:ring-2 focus:ring-[#008736]/20 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-11 h-11 rounded-xl bg-[#008736] hover:bg-[#00722d] text-white flex items-center justify-center active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-[#008736]/20"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-[#717a71] text-center mt-2 font-medium">
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

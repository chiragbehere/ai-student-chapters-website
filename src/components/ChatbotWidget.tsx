import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, User, Sparkles, Send, RotateCcw } from 'lucide-react';
import { useChatbotQA } from '../hooks/useSupabaseData';

type Message = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
};

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

    for (const qa of qaDatabase) {
      for (const keyword of qa.keywords) {
        if (q.includes(keyword.toLowerCase())) {
          return qa.answer;
        }
      }
    }

    return "Great question! 🤔 I don't have a specific answer for that, but our team would love to help! Reach out to us:\n📧 Email: imrdaistudentclub@gmail.com\n📸 Instagram: @ai.student_chapters\n\nOr try asking about: the club, events, team, how to join, or coding skills!";
  }, [qaDatabase]);

  const sendMessage = useCallback((userText: string) => {
    if (isLoading || !userText.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const reply = getAnswer(userText);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: reply,
      }]);
      setIsLoading(false);
    }, 450 + Math.random() * 500);
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
      {!hideTrigger && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.4, delay: 0.3 }}
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-[12.5rem] right-6 w-11 h-11 rounded-full bg-[#8B5CF6] text-white shadow-xl shadow-[#8B5CF6]/30 flex items-center justify-center z-40 hover:bg-[#A78BFA] hover:scale-110 active:scale-95 transition-all duration-300 ${isOpen ? 'hidden' : 'flex'} group`}
          aria-label="Open AI Chat"
          title="Open ChaptersBot AI"
        >
          <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -left-1 px-1.5 py-0.5 bg-[#142B20] text-[#E8DCC4] text-[8px] font-bold rounded-full uppercase tracking-wider shadow-sm border border-[#E8DCC4]/20">
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
            className="fixed bottom-3 right-3 left-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[420px] h-[560px] sm:h-[640px] max-h-[85vh] bg-[#142B20]/95 backdrop-blur-2xl border border-[#E8DCC4]/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-2xl flex flex-col overflow-hidden z-[60]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 bg-[#193426] border-b border-[#E8DCC4]/15 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white shadow-md relative shrink-0">
                  <Sparkles size={17} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#193426]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-bold text-[#E8DCC4] text-sm sm:text-base flex items-center gap-2 leading-tight">
                    <span className="truncate">ChaptersBot</span>
                    <span className="px-1.5 py-0.5 bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40 text-[9px] font-bold rounded-full uppercase tracking-wider shrink-0">AI</span>
                  </h3>
                  <span className="text-[10px] sm:text-[11px] text-[#C9BDA7] font-medium block truncate">Always online • Ask questions</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button 
                  onClick={handleReset}
                  className="w-8 h-8 rounded-xl bg-[#142B20] hover:bg-[#1F3D2B] text-[#C9BDA7] hover:text-[#E8DCC4] border border-[#E8DCC4]/10 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                  aria-label="Reset Chat"
                  title="Reset conversation"
                >
                  <RotateCcw size={14} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-xl bg-[#142B20] hover:bg-[#1F3D2B] text-[#C9BDA7] hover:text-[#E8DCC4] border border-[#E8DCC4]/10 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                  aria-label="Close Chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#1F3D2B]/90">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex gap-2.5 max-w-[88%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-white mt-0.5 shadow-sm ${msg.role === 'user' ? 'bg-[#101A14] text-[#E8DCC4]' : 'bg-[#8B5CF6]'}`}>
                    {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#8B5CF6] text-white rounded-tr-sm shadow-md font-medium' 
                      : 'bg-[#193426] text-[#E8DCC4] rounded-tl-sm border border-[#E8DCC4]/15 shadow-sm font-medium whitespace-pre-line'
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
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white mt-0.5 shadow-sm">
                    <Bot size={15} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[#193426] border border-[#E8DCC4]/15 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 4 && !isLoading && (
              <div className="px-4 pb-3 pt-2.5 border-t border-[#E8DCC4]/15 bg-[#142B20]">
                <p className="text-[10px] font-bold tracking-widest text-[#C9BDA7] uppercase mb-2 pl-0.5">Quick questions</p>
                <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto scrollbar-thin">
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-[11px] text-left px-3 py-1.5 rounded-xl bg-[#193426] border border-[#E8DCC4]/15 text-[#E8DCC4] font-semibold hover:text-white hover:bg-[#8B5CF6] hover:border-[#8B5CF6] transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3.5 border-t border-[#E8DCC4]/15 bg-[#142B20]">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 club-input text-sm"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-11 h-11 rounded-xl bg-[#8B5CF6] hover:bg-[#A78BFA] text-white flex items-center justify-center active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-[#8B5CF6]/30 cursor-pointer"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-[#C9BDA7]/80 text-center mt-2 font-medium">
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

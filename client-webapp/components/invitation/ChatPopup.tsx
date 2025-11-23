'use client';

import { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  UserCircle2,
  GraduationCap,
  ScrollText,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
}

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  graduateId: string | null;
}

const API_URL =
  'https://invitation-backend.jollysea-6ff72832.southeastasia.azurecontainerapps.io/api';

const SUGGESTED_QUESTIONS = [
  { icon: <Clock className="h-3 w-3" />, text: 'Mấy giờ check-in?' },
  { icon: <UserCircle2 className="h-3 w-3" />, text: 'Trang phục?' },
  { icon: <MapPin className="h-3 w-3" />, text: 'Địa điểm ở đâu?' },
];

export default function ChatPopup({ isOpen, onClose, graduateId }: ChatPopupProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input.trim();

    if (!messageText) return;

    setMessages((prev) => [...prev, { text: messageText, sender: 'user', timestamp: new Date() }]);
    setInput('');
    // Check ID sau khi đã hiện tin nhắn user để có feedback
    if (!graduateId) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: 'Lỗi hệ thống: Không tìm thấy ID khách mời. Vui lòng tải lại trang.',
            sender: 'bot',
            timestamp: new Date(),
            isError: true,
          },
        ]);
      }, 500);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/graduates/${graduateId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { text: data.response, sender: 'bot', timestamp: new Date() },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Kết nối không ổn định. Xin vui lòng thử lại.',
          sender: 'bot',
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  if (!isOpen) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex items-end justify-center font-sans sm:items-center sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="pointer-events-auto absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ y: '100%', opacity: 0, scale: 0.95 }}
        animate={{ y: '0%', opacity: 1, scale: 1 }}
        exit={{ y: '100%', opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="pointer-events-auto relative flex h-[85vh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-white/10 bg-[#0f0f0f] shadow-2xl sm:h-[650px] sm:max-w-md sm:rounded-2xl"
      >
        {/* HEADER */}
        <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/5 bg-[#0a0a0a] p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#000] shadow-inner">
                <GraduationCap className="h-5 w-5 text-amber-500" />
              </div>
              <div className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a0a] bg-green-500"></div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Hỗ trợ Khách mời</h3>
              <p className="text-[10px] tracking-widest text-amber-500/80 uppercase">Trực tuyến</p>
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-10 w-10 rounded-full text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* CHAT BODY */}
        <div className="relative flex-1 space-y-6 overflow-y-auto scroll-smooth bg-[#0f0f0f] p-4">
          {/* Empty State */}
          {messages.length === 0 && (
            <div className="mt-8 space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/20 bg-gradient-to-b from-amber-500/10 to-transparent">
                <Sparkles className="h-6 w-6 text-amber-400" />
              </div>
              <p className="px-6 text-sm text-gray-400">
                Tôi có thể giúp gì cho Quý khách về lịch trình, địa điểm của buổi lễ?
              </p>
              <div className="flex flex-wrap justify-center gap-2 px-2">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSend(q.text)}
                    className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-2 text-xs text-gray-300 transition-all hover:border-amber-500/30 hover:bg-amber-900/20 hover:text-amber-200"
                  >
                    <span className="text-amber-500/70">{q.icon}</span>
                    {q.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages List */}
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#1a1a1a]">
                    {m.isError ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <ScrollText className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                )}

                <div className={`max-w-[85%] space-y-1`}>
                  <div
                    className={`p-3.5 text-sm leading-relaxed shadow-sm backdrop-blur-sm ${
                      m.sender === 'user'
                        ? 'rounded-2xl rounded-tr-sm bg-amber-700 text-white'
                        : m.isError
                          ? 'rounded-2xl rounded-tl-sm border border-red-500/30 bg-red-900/20 text-red-200'
                          : 'rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 text-gray-100'
                    }`}
                  >
                    {m.text}
                  </div>
                  <div
                    className={`text-[10px] text-gray-500 ${m.sender === 'user' ? 'text-right' : 'text-left'} px-1`}
                  >
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#1a1a1a]">
                <ScrollText className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex h-10 items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500/50 [animation-delay:-0.3s]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500/50 [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500/50"></span>
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        {/* INPUT FORM */}
        <div className="z-20 shrink-0 border-t border-white/10 bg-[#0a0a0a] p-4">
          <form onSubmit={onSubmit} className="relative flex w-full items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi..."
              disabled={loading}
              className="h-12 w-full rounded-xl border-white/10 bg-white/5 pr-12 text-white placeholder:text-gray-600 focus:border-amber-500/50 focus:ring-0"
            />
            {/* Nút Submit: Chắc chắn hoạt động vì type="submit" và nằm trong form */}
            <Button
              type="submit"
              disabled={!input.trim() || loading}
              className={`absolute top-1 right-1 z-20 h-10 w-10 rounded-lg p-0 transition-all ${
                input.trim()
                  ? 'bg-amber-600 text-white hover:bg-amber-500'
                  : 'bg-transparent text-gray-600'
              }`}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

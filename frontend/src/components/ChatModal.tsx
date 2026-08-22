import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Clock, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Astrologer, ChatMessage } from '../types';
import { generateAstrologicalAIResponse } from '../utils/aiAstrologyResponse';

interface ChatModalProps {
  astrologer: Astrologer;
  walletBalance: number;
  onDeductBalance: (amount: number) => boolean;
  onClose: () => void;
  onOpenRecharge: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  astrologer,
  walletBalance,
  onDeductBalance,
  onClose,
  onOpenRecharge
}) => {
  const isAI = astrologer.isAI;

  const initialGreeting = isAI
    ? `নমস্কার! আমি ${astrologer.name}। আপনার জন্ম বিবরণ (তারিখ, সময়, স্থান) এবং কী বিষয়ে জানতে চান বলুন। (বাংলা, English বা যেকোনো ভাষায় জিজ্ঞেস করতে পারেন!)`
    : `নমস্কার! আমি ${astrologer.name} (${astrologer.specialty})। বলুন আজ আপনাকে কীভাবে সাহায্য করতে পারি?`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'system',
      text: `Connected with ${astrologer.name}. Rate: ₹${astrologer.chatRatePerMin}/min.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: '2',
      sender: 'astrologer',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Session Ticker & Per-minute Wallet Deduction
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => {
        const nextSec = prev + 1;
        // Every 60 seconds, deduct 1 minute fee
        if (nextSec > 0 && nextSec % 60 === 0) {
          const success = onDeductBalance(astrologer.chatRatePerMin);
          if (!success) {
            setMessages((m) => [
              ...m,
              {
                id: Date.now().toString(),
                sender: 'system',
                text: '⚠️ Insufficient wallet balance to continue consultation. Please recharge to resume.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }
        }
        return nextSec;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [astrologer.chatRatePerMin, onDeductBalance]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = input;
    setInput('');
    setIsTyping(true);

    // Dynamic Intelligent Multilingual Astrological Responses
    setTimeout(() => {
      const isTarot = astrologer.skills.some((s) => s.toLowerCase().includes('tarot'));
      const reply = generateAstrologicalAIResponse(query, astrologer.name, isTarot);

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'astrologer',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, isAI ? 1200 : 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={astrologer.avatar}
                alt={astrologer.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                {astrologer.name}
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              </h3>
              <p className="text-[11px] text-amber-400 font-medium">₹{astrologer.chatRatePerMin}/min • Live Chat</p>
            </div>
          </div>

          {/* Session Timer & Balance Info */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs text-amber-400 font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatTimer(secondsElapsed)}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Low Balance Alert Banner if balance is low */}
        {walletBalance < astrologer.chatRatePerMin * 2 && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>Low Balance: <b>₹{walletBalance.toFixed(2)}</b> (less than 2 mins left)</span>
            </div>
            <button
              onClick={onOpenRecharge}
              className="px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] hover:bg-amber-400"
            >
              Quick Recharge
            </button>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-slate-900 to-slate-950">
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="inline-block bg-slate-800/80 text-slate-400 text-[11px] px-3 py-1 rounded-full border border-slate-700">
                    {msg.text}
                  </span>
                </div>
              );
            }

            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none shadow-md shadow-amber-500/10'
                      : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic bg-slate-800/40 px-3 py-1.5 rounded-full w-fit border border-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{astrologer.name} আপনার জন্মছক ও প্রশ্ন পর্যবেক্ষণ করছেন...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="bg-slate-950 p-3 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="আপনার প্রশ্ন লিখুন (যেমন: আমার বিয়ে কবে হবে? বা চাকরি কবে পাব?)..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

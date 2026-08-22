import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Clock, Sparkles, CheckCircle2, Crown, ShieldCheck } from 'lucide-react';
import { Astrologer, ChatMessage } from '../types';
import { processHumanAstrologerChat, ChatSessionState } from '../utils/aiAstrologyResponse';
import { LanguageSelector } from './LanguageSelector';
import { SupportedLanguageCode } from '../data/languages';

interface ChatModalProps {
  astrologer: Astrologer;
  walletBalance: number;
  onDeductBalance: (amount: number) => boolean;
  onClose: () => void;
  onOpenRecharge: () => void;
  currentLanguage: SupportedLanguageCode;
  onSelectLanguage: (code: SupportedLanguageCode) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  astrologer,
  walletBalance,
  onDeductBalance,
  onClose,
  onOpenRecharge,
  currentLanguage,
  onSelectLanguage
}) => {
  const isAI = astrologer.isAI;

  const getInitialGreeting = (lang: SupportedLanguageCode) => {
    switch (lang) {
      case 'ta':
        return `வணக்கம்! 🙏 நான் ${astrologer.name}. உங்கள் பிறந்த தேதி, நேரம் மற்றும் இடம் (DOB, Time, Place) குறித்து என்ன கேள்வி கேட்க விரும்புகிறீர்கள்?`;
      case 'te':
        return `నమస్కారం! 🙏 నేను ${astrologer.name}. మీ పుట్టిన తేదీ, సమయం మరియు ఊరు (DOB, Time, Place) వివరాలు తెలిపి మీ ప్రశ్న అడగండి.`;
      case 'hi':
        return `नमस्ते! 🙏 मैं ${astrologer.name}। अपनी जन्म तिथि, समय और स्थान (DOB, Time, Place) बताएं और आज आप क्या जानना चाहते हैं?`;
      case 'gu':
        return `નમસ્તે! 🙏 હું ${astrologer.name} છું. તમારી જન્મ વિગતો (DOB, Time, Place) જણાવી પ્રશ્ન પૂછો.`;
      case 'mr':
        return `नमस्कार! 🙏 मी ${astrologer.name}. आपली जन्म तारीख, वेळ आणि ठिकाण (DOB, Time, Place) सांगा.`;
      case 'bn':
        return `নমস্কার! 🙏 আমি ${astrologer.name}। আপনার জন্ম বিবরণ (তারিখ, সময়, স্থান) এবং আজ কী বিষয় নিয়ে জানতে চান বলুন।`;
      case 'en':
      default:
        return `Namaste! 🙏 I am ${astrologer.name}. Please share your birth details (Date, Time, Place) and what question is on your mind today?`;
    }
  };

  const [sessionState, setSessionState] = useState<ChatSessionState>({
    hasCollectedBirthDetails: false,
    birthDetails: {},
    preferredLanguage: currentLanguage
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'system',
      text: `Connected with ${astrologer.name}. 👑 VIP Unlimited Consultation Active.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: '2',
      sender: 'astrologer',
      text: getInitialGreeting(currentLanguage),
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

  // Session Ticker (Timer Only)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (code: SupportedLanguageCode) => {
    onSelectLanguage(code);
    setSessionState((prev) => ({ ...prev, preferredLanguage: code }));
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'system',
        text: `Language updated to ${code.toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
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
    const userInput = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processHumanAstrologerChat(
        userInput,
        astrologer.name,
        astrologer.specialty,
        sessionState
      );

      setSessionState(response.updatedSessionState);

      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'astrologer',
        text: response.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, replyMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl h-[85vh] sm:h-[650px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Top Chat Header */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between z-10 shrink-0">
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
              <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <Crown className="w-3 h-3 text-[#f7e034] fill-[#f7e034]" /> VIP Unlimited Consultation
              </p>
            </div>
          </div>

          {/* Session Timer, Language Selector & Close */}
          <div className="flex items-center gap-2">
            <LanguageSelector
              currentLanguage={sessionState.preferredLanguage}
              onSelectLanguage={handleLanguageChange}
              compact
            />

            <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs text-[#f7e034] font-mono font-bold">
              <Clock className="w-3 h-3 text-slate-400" />
              {formatTimer(secondsElapsed)}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user'
                  ? 'items-end'
                  : msg.sender === 'system'
                  ? 'items-center'
                  : 'items-start'
              }`}
            >
              {msg.sender === 'system' ? (
                <div className="bg-slate-900/90 text-amber-300 text-[11px] font-bold px-3 py-1.5 rounded-full border border-amber-500/30 my-1 shadow-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {msg.text}
                </div>
              ) : (
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-[#f7e034] text-slate-950 font-medium rounded-tr-none'
                      : isAI
                      ? 'bg-purple-950/40 border border-purple-800/60 text-purple-100 rounded-tl-none font-sans'
                      : 'bg-slate-800 text-slate-100 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right font-mono ${
                      msg.sender === 'user' ? 'text-slate-800/80' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic bg-slate-900/80 py-1.5 px-3 rounded-full w-fit border border-slate-800">
              <Sparkles className="w-3 h-3 text-[#f7e034] animate-spin" />
              <span>{astrologer.name} is preparing your Vedic answer...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Type your question (marriage, career, love)...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#f7e034] transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-[#f7e034] hover:bg-[#ffe838] text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold cursor-pointer"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};

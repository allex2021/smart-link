import React, { useState } from 'react';
import { Send, Sparkles, X, Crown, ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import { processHumanAstrologerChat, ChatSessionState } from '../utils/aiAstrologyResponse';

interface AIAstrologerModalProps {
  onClose: () => void;
}

export const AIAstrologerModal: React.FC<AIAstrologerModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'नमस्ते! 🙏 मैं महर्षि आर्यभट्ट (Vedic AI Acharya) हूँ। अपनी जन्म कुंडली, विवाह, नौकरी, सरकारी परीक्षा (UPSC/Govt Job), व्यापार, धनयोग या शनि साढ़े साती को लेकर कोई भी प्रश्न हिन्दी, English या किसी भी भाषा में पूछें।'
    }
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionState, setSessionState] = useState<ChatSessionState>({
    hasCollectedBirthDetails: false,
    birthDetails: {},
    preferredLanguage: 'hi'
  });

  const quickPrompts = [
    { label: '💍 विवाह व दांपत्य योग', query: 'मेरा विवाह कब होगा और जीवनसाथी का स्वभाव व करियर कैसा रहेगा?' },
    { label: '💼 सरकारी नौकरी / करियर', query: 'क्या मेरी कुंडली में सरकारी नौकरी (Govt Job/UPSC/Bank) का योग है?' },
    { label: '💰 धनयोग व व्यापार सफलता', query: 'मेरी कुंडली में कौन सा राजयोग या धनयोग है? व्यापार बेहतर रहेगा या नौकरी?' },
    { label: '🪐 शनि साढ़े साती के सरल उपाय', query: 'शनि साढ़े साती और मांगलिक दोष के वैदिक शांति उपाय क्या हैं?' },
    { label: '✈️ विदेश यात्रा व वीज़ा योग', query: 'मेरी कुंडली में विदेश यात्रा, पढ़ाई या स्थायी निवास (PR) का योग है क्या?' },
    { label: '💎 भाग्यशाली रत्न व रुद्राक्ष', query: 'मेरी राशि और लग्न के अनुसार सबसे उपयुक्त भाग्यशाली रत्न व रुद्राक्ष कौन सा है?' }
  ];

  const handleAsk = (userQuery: string) => {
    if (!userQuery.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setQuery('');
    setLoading(true);

    setTimeout(() => {
      const response = processHumanAstrologerChat(
        userQuery,
        'Maharshi Aryabhata',
        'Vedic AI Acharya',
        sessionState
      );
      setSessionState(response.updatedSessionState);
      setLoading(false);
      setMessages((prev) => [...prev, { sender: 'ai', text: response.replyText }]);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl h-[88vh] bg-slate-900 border-2 border-amber-400/60 rounded-3xl flex flex-col overflow-hidden shadow-[0_0_50px_rgba(247,224,52,0.25)]">
        
        {/* Header */}
        <div className="bg-slate-950 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/sadhu_maharaj_center.jpg"
                alt="Maharshi Aryabhata"
                className="w-11 h-11 rounded-full object-cover border-2 border-[#f7e034] shadow-md shadow-amber-400/30"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-white text-sm">महर्षि आर्यभट्ट</h3>
                <span className="bg-gradient-to-r from-amber-500 to-[#f7e034] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-slate-950" />
                  <span>VEDIC AI ACHARYA</span>
                </span>
              </div>
              <p className="text-[11px] text-amber-400/90 font-medium">पराशर, जैमिनी व भृगु संहिता विशेषज्ञ • लाइव सक्रिय</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Prompts Bar (VedAstro inspired) */}
        <div className="bg-slate-950/60 px-3 py-2 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-[#f7e034]" /> त्वरित प्रश्न:
          </span>
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAsk(item.query)}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-400/50 text-[11px] text-slate-200 hover:text-amber-300 font-medium whitespace-nowrap transition-all cursor-pointer shrink-0"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <img
                  src="/sadhu_maharaj_center.jpg"
                  alt="Aryabhata"
                  className="w-7 h-7 rounded-full object-cover border border-[#f7e034] shrink-0 mt-1 shadow-sm"
                />
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 whitespace-pre-wrap leading-relaxed shadow-md ${
                  m.sender === 'user'
                    ? 'bg-[#f7e034] text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none font-normal'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
              <Sparkles className="w-4 h-4 animate-spin text-[#f7e034]" />
              <span>महर्षि आर्यभट्ट ग्रह दशा व शास्त्र गणना कर रहे हैं...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk(query)}
            placeholder="विवाह, करियर, नौकरी বা আপনার প্রশ্ন এখানে লিখুন..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#f7e034]"
          />
          <button
            onClick={() => handleAsk(query)}
            className="p-2.5 bg-[#f7e034] hover:bg-[#ffe838] text-slate-950 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer shadow-md shadow-[#f7e034]/20"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

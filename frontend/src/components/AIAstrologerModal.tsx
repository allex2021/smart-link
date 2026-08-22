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
      text: 'নমস্কার! 🙏 আমি মহর্ষি আর্যভট্ট (Vedic AI Acharya)। আপনার জন্মকুণ্ডলী, বিবাহ, ক্যারিয়ার, সরকারি চাকরি, ধনযোগ বা শনি সাড়ে সাতি নিয়ে যে কোনো প্রশ্ন বাংলায় বা ইংরেজিতে জিজ্ঞাসা করতে পারেন।'
    }
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionState, setSessionState] = useState<ChatSessionState>({
    hasCollectedBirthDetails: false,
    birthDetails: {},
    preferredLanguage: 'bn'
  });

  const quickPrompts = [
    { label: '💍 বিয়ে ও দাম্পত্য যোগ', query: 'আমার বিয়ে কবে হবে এবং পাত্র/পাত্রী কেমন হবে?' },
    { label: '💼 সরকারি চাকরি / ক্যারিয়ার', query: 'আমার কি সরকারি চাকরি বা BCS/UPSC পাওয়ার যোগ আছে?' },
    { label: '💰 ধনযোগ ও আর্থিক সমৃদ্ধি', query: 'আমার কুণ্ডলীতে কি রাজযোগ বা ধনযোগ আছে? ব্যবসা ভালো হবে না চাকরি?' },
    { label: '🪐 শনি সাড়ে সাতির সহজ প্রতিকার', query: 'শনি সাড়ে সাতি ও মাঙ্গলিক দোষের বৈদিক প্রতিকার কি?' },
    { label: '✈️ বিদেশ যাত্রা ও ভিসা', query: 'আমার কুণ্ডলীতে বিদেশ যাত্রা ও স্থায়ী বসবাসের যোগ আছে কি?' },
    { label: '💎 লাকি রত্ন ও রুদ্রাক্ষ', query: 'আমার জন্য সবচেয়ে উপযুক্ত লাকি রত্ন ও রুদ্রাক্ষ কোনটি?' }
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
                src="/sadhu_acharya_left.jpg"
                alt="Maharshi Aryabhata"
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Maharshi Aryabhata (মহর্ষি আর্যভট্ট)
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              </h3>
              <p className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
                <Crown className="w-3 h-3 text-[#f7e034] fill-[#f7e034]" /> 24/7 Vedic AI Acharya • Parashara & Jaimini
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/70">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-md ${
                  m.sender === 'user'
                    ? 'bg-[#f7e034] text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-amber-300 text-xs italic bg-slate-900/90 px-3.5 py-2 rounded-full w-fit border border-amber-500/30">
              <Sparkles className="w-4 h-4 text-[#f7e034] animate-spin" />
              <span>মহর্ষি আর্যভট্ট বৈদিক পরাশর শাস্ত্র ও গ্রহ অবস্থান নিরীক্ষণ করছেন...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Categories (Like VedAstro) */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Award className="w-3 h-3 text-[#f7e034]" /> বৈদিক প্রশ্নোত্তর বিষয়সমূহ (Quick Questions):
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(p.query)}
                className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-amber-400 text-xs whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Query Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="আপনার প্রশ্ন লিখুন (যেমন: বিয়ে, চাকরি, প্রেম, প্রতিকার)..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#f7e034] transition-colors"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="p-2.5 rounded-xl bg-[#f7e034] hover:bg-[#ffe838] text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold cursor-pointer"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};

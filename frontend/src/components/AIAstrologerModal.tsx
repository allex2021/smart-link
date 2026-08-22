import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, MessageSquare, Compass, Zap } from 'lucide-react';

interface AIAstrologerModalProps {
  onClose: () => void;
}

export const AIAstrologerModal: React.FC<AIAstrologerModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Namaste! I am your 24/7 AI Vedic Astrologer. Ask me anything about your Horoscope, Zodiac sign, Mahadasha, Sade Sati, or remedies!'
    }
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'How will 2026 be for Aries?',
    'What are the remedies for Shani Sade Sati?',
    'Which gemstone is best for career growth?',
    'How to check if I have Mangal Dosha?'
  ];

  const handleAsk = (userQuery: string) => {
    if (!userQuery.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setQuery('');
    setLoading(true);

    setTimeout(() => {
      let response = `Based on classical Vedic principles, planetary alignments for ${userQuery} indicate strong supportive influences from Jupiter. Focus on disciplined efforts and wear silver/pearl for mental serenity.`;

      if (userQuery.toLowerCase().includes('sade sati') || userQuery.toLowerCase().includes('shani')) {
        response = `Shani (Saturn) tests discipline and integrity. To mitigate Sade Sati effects: 1) Light a mustard oil lamp under a Peepal tree on Saturdays, 2) Recite Hanuman Chalisa daily, 3) Donate black sesame seeds or black blankets to the needy.`;
      } else if (userQuery.toLowerCase().includes('gemstone') || userQuery.toLowerCase().includes('career')) {
        response = `For career elevation, astrologers generally evaluate the 10th house and the Sun/Mercury. Blue Sapphire (Neelam) or Emerald (Panna) are powerful, but must only be worn after calculating the exact degree of your Lagna lord.`;
      } else if (userQuery.toLowerCase().includes('mangal') || userQuery.toLowerCase().includes('dosha')) {
        response = `Mangal Dosha occurs when Mars is placed in the 1st, 4th, 7th, 8th, or 12th house from the Lagna or Moon. However, if Mars is in its own sign (Aries/Scorpio) or exalted in Capricorn, the dosha gets cancelled (Dosha Bhanga).`;
      }

      setLoading(false);
      setMessages((prev) => [...prev, { sender: 'ai', text: response }]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl h-[85vh] bg-slate-900 border border-purple-500/40 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-950 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                AI Vedic Astrologer 24/7
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                  Instant Answers
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Trained on Parashara Hora & Jaimini Sutras</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-slate-900 to-slate-950">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-purple-600 text-white font-medium rounded-br-none'
                    : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-purple-300 text-xs italic bg-purple-950/40 px-3 py-2 rounded-full w-fit border border-purple-500/30">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              <span>Analyzing Vedic scriptures & astronomical ephemeris...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleAsk(p)}
              className="text-[11px] text-purple-300 hover:text-white bg-purple-900/30 hover:bg-purple-900/60 border border-purple-700/50 px-2.5 py-1 rounded-full whitespace-nowrap transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="bg-slate-950 p-3 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your astrology question..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

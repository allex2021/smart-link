import React from 'react';
import { Sparkles, Wallet, Flame, MessageSquare, Compass, HeartHandshake, Bot } from 'lucide-react';

interface NavbarProps {
  activeTab: 'astrologers' | 'kundli' | 'matchmaking' | 'ai-astro';
  setActiveTab: (tab: 'astrologers' | 'kundli' | 'matchmaking' | 'ai-astro') => void;
  walletBalance: number;
  openWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  walletBalance,
  openWallet
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 px-4 py-1.5 text-center text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-sm">
        <Flame className="w-3.5 h-3.5 animate-bounce" />
        <span>SPECIAL OFFER: First 5 Minutes FREE Chat with Top Vedic Astrologers!</span>
        <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Limited Time</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('astrologers')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">ASTRO<span className="text-amber-400">TALK</span></span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">LIVE</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider">India's #1 Astrology Platform</p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('astrologers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'astrologers'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Talk to Astrologer
            </button>

            <button
              onClick={() => setActiveTab('kundli')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'kundli'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              Free Kundli
            </button>

            <button
              onClick={() => setActiveTab('matchmaking')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'matchmaking'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              Matchmaking (Kundli Milan)
            </button>

            <button
              onClick={() => setActiveTab('ai-astro')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ai-astro'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-purple-300 hover:text-purple-200 hover:bg-purple-950/40'
              }`}
            >
              <Bot className="w-4 h-4" />
              AI Astrologer 24/7
            </button>
          </nav>

          {/* Right Actions: Wallet & Login */}
          <div className="flex items-center gap-3">
            <button
              onClick={openWallet}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 transition-all hover:border-amber-500/50 group shadow-sm"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-slate-400 font-medium leading-none">Wallet</span>
                <span className="text-sm font-bold text-amber-400 leading-tight">₹{walletBalance.toFixed(2)}</span>
              </div>
              <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full ml-1 hover:bg-amber-400">
                + Add
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('astrologers')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'astrologers' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            Astrologers
          </button>
          <button
            onClick={() => setActiveTab('kundli')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'kundli' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            Kundli
          </button>
          <button
            onClick={() => setActiveTab('matchmaking')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'matchmaking' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            Matchmaking
          </button>
          <button
            onClick={() => setActiveTab('ai-astro')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'ai-astro' ? 'bg-purple-600 text-white' : 'text-purple-300'
            }`}
          >
            AI Astro
          </button>
        </div>
      </div>
    </header>
  );
};

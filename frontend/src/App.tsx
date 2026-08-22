import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { AstrologerCard } from './components/AstrologerCard';
import { KundliCalculator } from './components/KundliCalculator';
import { MatchmakingTool } from './components/MatchmakingTool';
import { ChatModal } from './components/ChatModal';
import { AIAstrologerModal } from './components/AIAstrologerModal';
import { WalletModal } from './components/WalletModal';
import { MOCK_ASTROLOGERS } from './data/mockData';
import { Astrologer, Transaction } from './types';
import { Search, Filter, Sparkles, MessageSquare, PhoneCall, Bot, Shield, Award, Heart } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'astrologers' | 'kundli' | 'matchmaking' | 'ai-astro'>('astrologers');
  const [astrologers] = useState<Astrologer[]>(MOCK_ASTROLOGERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');

  // Wallet State
  const [walletBalance, setWalletBalance] = useState(150.0);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx_1',
      amount: 150,
      type: 'BONUS',
      description: 'Welcome promotional signup credit',
      timestamp: 'Today, 10:00 AM'
    }
  ]);

  // Modals State
  const [activeChatAstrologer, setActiveChatAstrologer] = useState<Astrologer | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  const filterSkills = ['All', 'Vedic Astrology', 'Tarot Cards', 'KP Astrology', 'Vastu Shastra', 'Palmistry'];

  const filteredAstrologers = astrologers.filter((astro) => {
    const matchesSearch =
      astro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      astro.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      astro.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkill =
      selectedSkillFilter === 'All' || astro.skills.includes(selectedSkillFilter);

    return matchesSearch && matchesSkill;
  });

  const handleRechargeWallet = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: `tx_${Date.now()}`,
        amount,
        type: 'RECHARGE',
        description: `Wallet recharge via UPI`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
  };

  const handleDeductBalance = (amount: number): boolean => {
    if (walletBalance < amount) {
      return false;
    }
    setWalletBalance((prev) => prev - amount);
    setTransactions((prev) => [
      {
        id: `tx_${Date.now()}`,
        amount: -amount,
        type: 'CONSULTATION_DEBIT',
        description: `Live consultation charge`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
    return true;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'ai-astro') {
            setIsAIOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        walletBalance={walletBalance}
        openWallet={() => setIsWalletOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'astrologers' && (
          <div>
            <HeroBanner
              onStartConsultation={() => {
                const onlineAstro = astrologers.find((a) => a.isOnline) || astrologers[0];
                setActiveChatAstrologer(onlineAstro);
              }}
              onOpenKundli={() => setActiveTab('kundli')}
            />

            {/* Astrologers Directory Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {/* Filter and Search Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Talk to Top Astrologers
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Select an expert for live 1-on-1 audio call or chat
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search astrologer or problem..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
                {filterSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setSelectedSkillFilter(skill)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      selectedSkillFilter === skill
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              {/* Astrologers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredAstrologers.map((astro) => (
                  <AstrologerCard
                    key={astro.id}
                    astrologer={astro}
                    onInitiateChat={(a) => setActiveChatAstrologer(a)}
                    onInitiateCall={(a) => setActiveChatAstrologer(a)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kundli' && <KundliCalculator />}

        {activeTab === 'matchmaking' && <MatchmakingTool />}
      </main>

      {/* Floating AI Astrologer Trigger Button */}
      <button
        onClick={() => setIsAIOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-2xl shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all glow-amber"
      >
        <Bot className="w-5 h-5 animate-pulse" />
        <span className="hidden sm:inline">Ask AI Astrologer 24/7</span>
      </button>

      {/* Active Consultation Chat Modal */}
      {activeChatAstrologer && (
        <ChatModal
          astrologer={activeChatAstrologer}
          walletBalance={walletBalance}
          onDeductBalance={handleDeductBalance}
          onClose={() => setActiveChatAstrologer(null)}
          onOpenRecharge={() => setIsWalletOpen(true)}
        />
      )}

      {/* AI Astrologer Modal */}
      {isAIOpen && <AIAstrologerModal onClose={() => setIsAIOpen(false)} />}

      {/* Wallet Modal */}
      {isWalletOpen && (
        <WalletModal
          balance={walletBalance}
          transactions={transactions}
          onRecharge={handleRechargeWallet}
          onClose={() => setIsWalletOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-300">ASTROTALK WEB</span>
            <span>•</span>
            <span>Accurate Vedic Astrology & Instant Guidance</span>
          </div>
          <p>© 2026 AstroTalk Platform. Built for high-speed astrology consultations.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

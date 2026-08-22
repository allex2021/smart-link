import React, { useState, useEffect } from 'react';
import { Navbar, AppNavTab } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { AstrologerCard } from './components/AstrologerCard';
import { KundliCalculator } from './components/KundliCalculator';
import { MatchmakingTool } from './components/MatchmakingTool';
import { DailyHoroscopeSection } from './components/DailyHoroscopeSection';
import { AstroShopSection } from './components/AstroShopSection';
import { CalculatorsHub } from './components/CalculatorsHub';
import { TopicsSection } from './components/TopicsSection';
import { HomePageTrustSection } from './components/HomePageTrustSection';
import { FaqSection } from './components/FaqSection';
import { ChatModal } from './components/ChatModal';
import { CallModal } from './components/CallModal';
import { AIAstrologerModal } from './components/AIAstrologerModal';
import { WalletModal } from './components/WalletModal';
import { AuthModal } from './components/AuthModal';
import { MOCK_ASTROLOGERS } from './data/mockData';
import { Astrologer, Transaction, UserProfile } from './types';
import { SupportedLanguageCode } from './data/languages';
import { Search, Sparkles, Bot, Globe } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<AppNavTab>('astrologers');
  const [astrologers] = useState<Astrologer[]>(MOCK_ASTROLOGERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState('All');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguageCode>('bn');

  // User Authentication State
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('astrotalk_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('astrotalk_wallet');
    return saved ? parseFloat(saved) : 150.0;
  });

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
  const [activeCallAstrologer, setActiveCallAstrologer] = useState<Astrologer | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Sync state with LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('astrotalk_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('astrotalk_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('astrotalk_wallet', walletBalance.toString());
  }, [walletBalance]);

  const filterSkills = ['All', 'Vedic Astrology', 'Tarot Cards', 'KP Astrology', 'Vastu Shastra', 'Palmistry'];
  const languageFilters = ['All', 'English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Gujarati'];

  const filteredAstrologers = astrologers.filter((astro) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      astro.name.toLowerCase().includes(query) ||
      astro.specialty.toLowerCase().includes(query) ||
      astro.skills.some((s) => s.toLowerCase().includes(query)) ||
      astro.languages.some((l) => l.toLowerCase().includes(query));

    const matchesSkill =
      selectedSkillFilter === 'All' || astro.skills.some((s) => s.toLowerCase().includes(selectedSkillFilter.toLowerCase()));

    const matchesLang =
      selectedLanguageFilter === 'All' || astro.languages.some((l) => l.toLowerCase().includes(selectedLanguageFilter.toLowerCase()));

    return matchesSearch && matchesSkill && matchesLang;
  });

  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setWalletBalance(newUser.walletBalance);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setWalletBalance(150.0);
  };

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

  const handleInitiateChat = (astro: Astrologer) => {
    setActiveChatAstrologer(astro);
  };

  const handleInitiateCall = (astro: Astrologer) => {
    setActiveCallAstrologer(astro);
  };

  const handleTopicSelect = (topicTitle: string) => {
    setSearchQuery(topicTitle.split(' ')[0]);
    const el = document.getElementById('astrologers-section');
    el?.scrollIntoView({ behavior: 'smooth' });
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        walletBalance={walletBalance}
        openWallet={() => setIsWalletOpen(true)}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'astrologers' && (
          <div>
            {/* 1. Astrotalk Cosmic Hero Banner */}
            <HeroBanner
              onStartConsultation={() => {
                const onlineAstro = astrologers.find((a) => a.isOnline) || astrologers[0];
                handleInitiateChat(onlineAstro);
              }}
              onNavigateTab={(tab) => {
                if (tab === 'ai-astro') {
                  setIsAIOpen(true);
                } else {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />

            {/* 2. Problem Solving Topics Strip */}
            <TopicsSection onSelectTopic={handleTopicSelect} />

            {/* 3. Astrologers Directory Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" id="astrologers-section">
              {/* Filter and Search Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6">
                <div>
                  <h2 className="text-xl sm:text-3xl font-black text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                    Talk to Verified Astrologers
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Connect 1-on-1 with experts via Chat or Audio Call (English, বাংলা, हिन्दी, தமிழ், తెలుగు)
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search astrologer, tarot, marriage..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Skills Filter & Language Filter */}
              <div className="space-y-3 mb-8">
                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {filterSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => setSelectedSkillFilter(skill)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                        selectedSkillFilter === skill
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>

                {/* Language Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 shrink-0">
                    <Globe className="w-3.5 h-3.5" /> Language:
                  </span>
                  {languageFilters.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguageFilter(lang)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all border ${
                        selectedLanguageFilter === lang
                          ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Astrologers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredAstrologers.map((astro) => (
                  <AstrologerCard
                    key={astro.id}
                    astrologer={astro}
                    onInitiateChat={handleInitiateChat}
                    onInitiateCall={handleInitiateCall}
                  />
                ))}
              </div>

              {filteredAstrologers.length === 0 && (
                <div className="text-center py-12 text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <p className="text-sm">No astrologers found matching your search or filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSkillFilter('All');
                      setSelectedLanguageFilter('All');
                    }}
                    className="mt-3 text-xs text-amber-400 font-bold hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>

            {/* 4. Trust, Stats & User Testimonials Section */}
            <HomePageTrustSection />

            {/* 5. Astrotalk FAQ Section */}
            <FaqSection />
          </div>
        )}

        {activeTab === 'horoscope' && <DailyHoroscopeSection />}

        {activeTab === 'kundli' && <KundliCalculator />}

        {activeTab === 'matchmaking' && <MatchmakingTool />}

        {activeTab === 'calculators' && <CalculatorsHub />}

        {activeTab === 'shop' && <AstroShopSection />}
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
          currentLanguage={currentLanguage}
          onSelectLanguage={setCurrentLanguage}
        />
      )}

      {/* Active Consultation Call Modal */}
      {activeCallAstrologer && (
        <CallModal
          astrologer={activeCallAstrologer}
          walletBalance={walletBalance}
          onDeductBalance={handleDeductBalance}
          onClose={() => setActiveCallAstrologer(null)}
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

      {/* User Login/Signup Modal */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Astrotalk Grand Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Consultations</h4>
            <ul className="space-y-2">
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => { setActiveTab('astrologers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Chat with Astrologer</li>
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => { setActiveTab('astrologers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Call with Astrologer</li>
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => setIsAIOpen(true)}>AI Astrologer 24/7</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Horoscope & Kundli</h4>
            <ul className="space-y-2">
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => { setActiveTab('horoscope'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Daily Horoscope (12 Signs)</li>
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => { setActiveTab('kundli'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Free Janam Kundli</li>
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => { setActiveTab('matchmaking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Kundli Milan (Matching)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Calculators Hub</h4>
            <ul className="space-y-2">
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => { setActiveTab('calculators'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Love Match Calculator</li>
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => { setActiveTab('calculators'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Lo Shu Grid Numerology</li>
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => { setActiveTab('calculators'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Today's Shubh Muhurat</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">AstroShop</h4>
            <ul className="space-y-2">
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Certified Gemstones</li>
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Rudraksha Malas</li>
              <li className="hover:text-amber-400 cursor-pointer" onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Shree Yantras</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-center text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-300">ASTROTALK LIVE PLATFORM</span>
            <span>•</span>
            <span>Accurate Multilingual Vedic Astrology & Instant 24/7 Guidance</span>
          </div>
          <p>© 2026 AstroTalk Platform. English • বাংলা • हिन्दी • தமிழ் • తెలుగు • ગુજરાતી • मराठी</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

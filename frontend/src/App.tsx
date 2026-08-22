import React, { useState, useEffect } from 'react';
import { Navbar, AppNavTab } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { AstrologerCard } from './components/AstrologerCard';
import { KundliCalculator } from './components/KundliCalculator';
import { MatchmakingTool } from './components/MatchmakingTool';
import { DailyHoroscopeSection } from './components/DailyHoroscopeSection';
import { CalculatorsHub } from './components/CalculatorsHub';
import { TopicsSection } from './components/TopicsSection';
import { TarotReadingSection } from './components/TarotReadingSection';
import { HomePageTrustSection } from './components/HomePageTrustSection';
import { FaqSection } from './components/FaqSection';
import { ChatModal } from './components/ChatModal';
import { CallModal } from './components/CallModal';
import { AIAstrologerModal } from './components/AIAstrologerModal';
import { WalletModal } from './components/WalletModal';
import { AuthModal } from './components/AuthModal';
import { LifetimeVipModal } from './components/LifetimeVipModal';
import { MOCK_ASTROLOGERS } from './data/mockData';
import { Astrologer, Transaction, UserProfile } from './types';
import { SupportedLanguageCode } from './data/languages';
import { Search, Sparkles, Bot, Globe, Tag, Filter, Crown, ArrowRight, X } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<AppNavTab>('astrologers');
  const [astrologers] = useState<Astrologer[]>(MOCK_ASTROLOGERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');
  const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] = useState('All');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState('All');
  const [selectedSortBy, setSelectedSortBy] = useState<'recommended' | 'rating' | 'experience' | 'price_asc'>('recommended');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguageCode>('bn');
  const [showTopVipStrip, setShowTopVipStrip] = useState(true);

  // VIP Lifetime State
  const [isLifetimeVIP, setIsLifetimeVIP] = useState<boolean>(() => {
    return localStorage.getItem('astrotalk_vip') === 'true';
  });
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);

  // Theme State: Dark / Light Mode
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('astrotalk_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('astrotalk_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

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

  const handleVipSuccess = () => {
    setIsLifetimeVIP(true);
    localStorage.setItem('astrotalk_vip', 'true');
    setTransactions((prev) => [
      {
        id: `tx_${Date.now()}`,
        amount: -99,
        type: 'CONSULTATION_DEBIT',
        description: 'Lifetime VIP Gold Pass Activation',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
  };

  // Filter Categories & Sub-Categories
  const mainCategories = ['All', 'Vedic Astrology', 'Tarot Cards', 'KP Astrology', 'Vastu Shastra', 'Palmistry', 'Numerology'];
  const subCategories = ['All', 'Love & Relationship', 'Marriage & Kundli', 'Career & Job', 'Wealth & Finance', 'Health & Well-being'];
  const languageFilters = ['All', 'English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Gujarati'];

  const filteredAstrologers = astrologers
    .filter((astro) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        astro.name.toLowerCase().includes(query) ||
        astro.specialty.toLowerCase().includes(query) ||
        astro.skills.some((s) => s.toLowerCase().includes(query)) ||
        astro.languages.some((l) => l.toLowerCase().includes(query));

      const matchesSkill =
        selectedSkillFilter === 'All' || astro.skills.some((s) => s.toLowerCase().includes(selectedSkillFilter.toLowerCase()));

      const matchesSubCategory =
        selectedSubCategoryFilter === 'All' ||
        astro.specialty.toLowerCase().includes(selectedSubCategoryFilter.toLowerCase().split(' ')[0]) ||
        astro.bio.toLowerCase().includes(selectedSubCategoryFilter.toLowerCase().split(' ')[0]);

      const matchesLang =
        selectedLanguageFilter === 'All' || astro.languages.some((l) => l.toLowerCase().includes(selectedLanguageFilter.toLowerCase()));

      return matchesSearch && matchesSkill && matchesSubCategory && matchesLang;
    })
    .sort((a, b) => {
      if (selectedSortBy === 'rating') return b.rating - a.rating;
      if (selectedSortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (selectedSortBy === 'price_asc') return a.chatRatePerMin - b.chatRatePerMin;
      return 0; // recommended default
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
    setSelectedSubCategoryFilter(topicTitle.split(' ')[0]);
    const el = document.getElementById('astrologers-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* 👑 Top Sticky VIP Flash Announcement Bar */}
      {showTopVipStrip && !isLifetimeVIP && (
        <div className="bg-gradient-to-r from-amber-600 via-[#f7e034] to-amber-500 text-slate-950 py-1.5 px-4 text-xs font-black flex items-center justify-center gap-2 shadow-md relative z-50">
          <Crown className="w-4 h-4 fill-slate-950 animate-bounce" />
          <span>
            <b>FLASH LAUNCH:</b> Get Lifetime VIP Pass (50+ Page Kundli PDF + 24/7 AI Astrologer) for just <b>₹99</b> only!
          </span>
          <button
            onClick={() => setIsVipModalOpen(true)}
            className="ml-2 px-2.5 py-0.5 rounded-full bg-slate-950 hover:bg-slate-900 text-[#f7e034] text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
          >
            <span>Unlock VIP ₹99</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => setShowTopVipStrip(false)}
            className="absolute right-3 p-1 text-slate-950/70 hover:text-slate-950"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation Bar with Sub-categories & Functional Theme Switcher */}
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
        theme={theme}
        onToggleTheme={toggleTheme}
        isLifetimeVIP={isLifetimeVIP}
        onOpenVipModal={() => setIsVipModalOpen(true)}
        onSelectSubCategory={(mainTab, sub) => {
          if (mainTab === 'astrologers' && sub) {
            const el = document.getElementById('astrologers-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
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

            {/* 3. Astrologers Directory Section with Multi-layer Categories & Sub-Categories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" id="astrologers-section">
              
              {/* Header & Search Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6">
                <div>
                  <h2 className={`text-xl sm:text-3xl font-black flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <Sparkles className="w-6 h-6 text-[#f7e034]" />
                    Talk to Verified Astrologers
                  </h2>
                  <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
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
                      className={`w-full rounded-xl pl-9 pr-4 py-2.5 text-xs placeholder-slate-400 focus:outline-none focus:border-[#f7e034] transition-colors ${
                        isLight ? 'bg-white border border-slate-300 text-slate-900' : 'bg-slate-900 border border-slate-700 text-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Multi-layer Filter System: Main Categories + Sub-Categories + Sorting */}
              <div className={`rounded-3xl p-5 mb-8 space-y-4 shadow-xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
              }`}>
                
                {/* 1. Main Categories Row */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#f7e034]" />
                    Main Category (প্রধান ক্যাটাগরি)
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {mainCategories.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => setSelectedSkillFilter(skill)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                          selectedSkillFilter === skill
                            ? 'bg-[#f7e034] text-slate-950 border-[#f7e034] shadow-md font-bold'
                            : isLight
                            ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-950'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Sub-Categories (Specializations & Problem Topics) */}
                <div className="pt-2 border-t border-slate-800/20">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-500" />
                    Sub-Category / Specialization (সাব-ক্যাটাগরি ও বিষয়)
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {subCategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubCategoryFilter(sub)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                          selectedSubCategoryFilter === sub
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                            : isLight
                            ? 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
                            : 'bg-slate-950/70 text-slate-400 border-slate-800/80 hover:text-slate-200'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Language & Sorting Row */}
                <div className="pt-2 border-t border-slate-800/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  
                  {/* Language Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
                    <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0 text-[11px]">
                      <Globe className="w-3.5 h-3.5" /> Language:
                    </span>
                    {languageFilters.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguageFilter(lang)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                          selectedLanguageFilter === lang
                            ? 'bg-purple-600 text-white font-bold'
                            : isLight
                            ? 'text-slate-600 hover:text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>

                  {/* Sorting Dropdown */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-slate-400 text-[11px]">Sort By:</span>
                    <select
                      value={selectedSortBy}
                      onChange={(e) => setSelectedSortBy(e.target.value as any)}
                      className={`border rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#f7e034] ${
                        isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
                      }`}
                    >
                      <option value="recommended">⭐ Recommended</option>
                      <option value="rating">🌟 Highest Rating</option>
                      <option value="experience">⏳ Most Experienced</option>
                      <option value="price_asc">💰 Lowest Rate / min</option>
                    </select>
                  </div>
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
                <div className={`text-center py-12 rounded-2xl border ${
                  isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-900/50 border-slate-800 text-slate-400'
                }`}>
                  <p className="text-sm">No astrologers found matching the selected category and sub-category.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSkillFilter('All');
                      setSelectedSubCategoryFilter('All');
                      setSelectedLanguageFilter('All');
                    }}
                    className="mt-3 text-xs text-[#f7e034] font-bold hover:underline"
                  >
                    Reset all filters (সব ফিল্টার ক্লিয়ার করুন)
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

        {activeTab === 'kundli' && (
          <KundliCalculator
            isLifetimeVIP={isLifetimeVIP}
            onOpenVipModal={() => setIsVipModalOpen(true)}
          />
        )}

        {activeTab === 'matchmaking' && <MatchmakingTool />}

        {activeTab === 'calculators' && <CalculatorsHub />}

        {activeTab === 'tarot' && <TarotReadingSection />}
      </main>

      {/* Floating AI Astrologer Trigger Button */}
      <button
        onClick={() => setIsAIOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-2xl shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all glow-amber cursor-pointer"
      >
        <Bot className="w-5 h-5 animate-pulse" />
        <span className="hidden sm:inline">Ask AI Astrologer 24/7</span>
      </button>

      {/* 👑 Lifetime VIP Pass Modal for Rs 99 */}
      <LifetimeVipModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        onSuccessPayment={handleVipSuccess}
        isAlreadyVip={isLifetimeVIP}
      />

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
      <footer className={`border-t py-12 px-4 sm:px-6 text-xs ${
        isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 pb-10 border-b border-slate-800/40">
          <div>
            <h4 className={`font-bold text-sm mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Consultations</h4>
            <ul className="space-y-2">
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('astrologers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Chat with Astrologer</li>
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('astrologers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Call with Astrologer</li>
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => setIsAIOpen(true)}>AI Astrologer 24/7</li>
            </ul>
          </div>

          <div>
            <h4 className={`font-bold text-sm mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Horoscope & Kundli</h4>
            <ul className="space-y-2">
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('horoscope'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Daily Horoscope (12 Signs)</li>
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('kundli'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Vedic Janam Kundli</li>
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('matchmaking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Kundli Milan (Matching)</li>
            </ul>
          </div>

          <div>
            <h4 className={`font-bold text-sm mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Calculators Hub</h4>
            <ul className="space-y-2">
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('calculators'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Love Match Calculator</li>
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('calculators'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Lo Shu Grid Numerology</li>
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('calculators'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Today's Shubh Muhurat</li>
            </ul>
          </div>

          <div>
            <h4 className={`font-bold text-sm mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Lifetime VIP Pass</h4>
            <ul className="space-y-2">
              <li className="text-amber-400 font-bold hover:underline cursor-pointer" onClick={() => setIsVipModalOpen(true)}>👑 Unlock Lifetime VIP for ₹99</li>
              <li className="hover:text-[#f7e034] cursor-pointer">50+ Page PDF Kundli Report</li>
              <li className="hover:text-[#f7e034] cursor-pointer">16 Shodashavarga Charts (D1-D60)</li>
              <li className="hover:text-[#f7e034] cursor-pointer">100% Private & 256-Bit SSL Encrypted</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-center text-slate-500">
          <div className="flex items-center gap-2">
            <span className={`font-black ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>ASTROTALK LIVE PLATFORM</span>
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

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
import { VipAccessGateOverlay } from './components/VipAccessGateOverlay';
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
  const [selectedSortBy, setSelectedSortBy] = useState<'recommended' | 'rating' | 'experience' | 'online_now'>('recommended');
  
  // Set default primary language to Hindi (hi)
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguageCode>('hi');
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
      description: 'स्वागत प्रोमोशनल क्रेडिट (Welcome Bonus)',
      timestamp: 'आज, 10:00 AM'
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
        description: 'लाइफटाइम वीआईपी गोल्ड पास एक्टिवेशन',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
  };

  // Filter Categories & Sub-Categories in Hindi
  const mainCategories = ['All', 'Vedic Astrology', 'Tarot Cards', 'KP Astrology', 'Vastu Shastra', 'Palmistry', 'Numerology'];
  const mainCategoryLabels: Record<string, string> = {
    'All': 'सभी (All)',
    'Vedic Astrology': 'वैदिक ज्योतिष',
    'Tarot Cards': 'टैरो कार्ड्स',
    'KP Astrology': 'केपी ज्योतिष',
    'Vastu Shastra': 'वास्तु शास्त्र',
    'Palmistry': 'हस्तरेखा',
    'Numerology': 'अंकशास्त्र'
  };

  const subCategories = ['All', 'Love & Relationship', 'Marriage & Kundli', 'Career & Job', 'Wealth & Finance', 'Health & Well-being'];
  const subCategoryLabels: Record<string, string> = {
    'All': 'सभी विषय (All)',
    'Love & Relationship': 'प्रेम व संबंध (Love)',
    'Marriage & Kundli': 'विवाह व कुंडली (Marriage)',
    'Career & Job': 'करियर व नौकरी (Career)',
    'Wealth & Finance': 'धन व वित्त (Finance)',
    'Health & Well-being': 'स्वास्थ्य व दीर्घायु (Health)'
  };

  const languageFilters = ['All', 'Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 'Gujarati'];
  const languageLabels: Record<string, string> = {
    'All': 'सभी',
    'Hindi': 'हिन्दी',
    'English': 'English',
    'Bengali': 'বাংলা',
    'Tamil': 'தமிழ்',
    'Telugu': 'తెలుగు',
    'Gujarati': 'ગુજરાતી'
  };

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
      if (selectedSortBy === 'online_now') return (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0);
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
        description: `यूपीआई द्वारा वॉलेट रिचार्ज`,
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
        description: `लाइव परामर्श शुल्क`,
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
      
      {/* 👑 Top Sticky VIP Flash Announcement Bar in Hindi */}
      {showTopVipStrip && !isLifetimeVIP && (
        <div className="bg-gradient-to-r from-amber-600 via-[#f7e034] to-amber-500 text-slate-950 py-1.5 px-4 text-xs font-black flex items-center justify-center gap-2 shadow-md relative z-50">
          <Crown className="w-4 h-4 fill-slate-950 animate-bounce" />
          <span>
            <b>फ़्लैश लॉन्च:</b> लाइफटाइम वीआईपी पास (50+ पेज कुंडली PDF + 24/7 एआई आचार्य) मात्र <b>₹99</b> में!
          </span>
          <button
            onClick={() => setIsVipModalOpen(true)}
            className="ml-2 px-2.5 py-0.5 rounded-full bg-slate-950 hover:bg-slate-900 text-[#f7e034] text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
          >
            <span>वीआईपी अनलॉक करें ₹99</span>
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
            {/* 1. Astrotalk Cosmic Hero Banner in Hindi */}
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

            {/* 3. Astrologers Directory Section in Hindi */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" id="astrologers-section">
              
              {/* Header & Search Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6">
                <div>
                  <h2 className={`text-xl sm:text-3xl font-black flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <Sparkles className="w-6 h-6 text-[#f7e034]" />
                    सत्यापित ज्योतिषियों से परामर्श लें
                  </h2>
                  <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    चैट या ऑडियो कॉल के माध्यम से विशेषज्ञों से 1-on-1 गोपनीय परामर्श (हिन्दी, English, বাংলা, தமிழ், తెలుగు)
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="ज्योतिषी, टैरो, विवाह, नौकरी खोजें..."
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
                
                {/* 1. Main Categories Row in Hindi */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#f7e034]" />
                    मुख्य श्रेणी (Main Category)
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
                        {mainCategoryLabels[skill] || skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Sub-Categories in Hindi */}
                <div className="pt-2 border-t border-slate-800/20">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-500" />
                    उप-श्रेणी व विशेषज्ञता (Sub-Category)
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
                        {subCategoryLabels[sub] || sub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Language & Sorting Row in Hindi */}
                <div className="pt-2 border-t border-slate-800/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  
                  {/* Language Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
                    <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0 text-[11px]">
                      <Globe className="w-3.5 h-3.5" /> भाषा (Language):
                    </span>
                    {languageFilters.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguageFilter(lang)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                          selectedLanguageFilter === lang
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                            : isLight
                            ? 'text-slate-600 hover:text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {languageLabels[lang] || lang}
                      </button>
                    ))}
                  </div>

                  {/* Sorting Dropdown in Hindi */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-slate-400 text-[11px]">क्रमबद्ध करें (Sort By):</span>
                    <select
                      value={selectedSortBy}
                      onChange={(e) => setSelectedSortBy(e.target.value as any)}
                      className={`border rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#f7e034] ${
                        isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
                      }`}
                    >
                      <option value="recommended">⭐ अनुशंसित (Recommended)</option>
                      <option value="rating">🌟 उच्चतम रेटिंग (Highest Rating)</option>
                      <option value="experience">⏳ सर्वाधिक अनुभवी (Experience)</option>
                      <option value="online_now">⚡ अभी ऑनलाइन (Online Now)</option>
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
                  <p className="text-sm">चयनित श्रेणी और उप-श्रेणी से मेल खाने वाला कोई ज्योतिषी नहीं मिला।</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSkillFilter('All');
                      setSelectedSubCategoryFilter('All');
                      setSelectedLanguageFilter('All');
                    }}
                    className="mt-3 text-xs text-[#f7e034] font-bold hover:underline"
                  >
                    सभी फ़िल्टर रीसेट करें (Reset all filters)
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

      {/* Floating AI Acharya Trigger Button */}
      <button
        onClick={() => setIsAIOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-[#f7e034] to-amber-500 text-slate-950 font-black text-xs shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all glow-amber cursor-pointer"
      >
        <Sparkles className="w-5 h-5 fill-slate-950 animate-pulse" />
        <span className="hidden sm:inline">पूछें एआई आचार्य 24/7</span>
      </button>

      {/* 👑 High-Converting Semi-Transparent VIP Access Gate Overlay with Secret Key */}
      <VipAccessGateOverlay
        isUnlocked={isLifetimeVIP}
        onUnlockSuccess={(key) => {
          handleVipSuccess();
        }}
      />

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

      {/* Astrotalk Grand Footer in Hindi */}
      <footer className={`border-t py-12 px-4 sm:px-6 text-xs ${
        isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 pb-10 border-b border-slate-800/40">
          <div>
            <h4 className={`font-bold text-sm mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>परामर्श (Consultations)</h4>
            <ul className="space-y-2">
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('astrologers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>ज्योतिषी से चैट करें</li>
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('astrologers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>ज्योतिषी से कॉल करें</li>
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => setIsAIOpen(true)}>वैदिक एआई आचार्य 24/7</li>
            </ul>
          </div>

          <div>
            <h4 className={`font-bold text-sm mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>राशिफल व कुंडली</h4>
            <ul className="space-y-2">
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('horoscope'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>दैनिक राशिफल (12 राशियां)</li>
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('kundli'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>वैदिक जन्म कुंडली</li>
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('matchmaking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>कुंडली मिलान (36 गुण)</li>
            </ul>
          </div>

          <div>
            <h4 className={`font-bold text-sm mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>कैलकुलेटर हब</h4>
            <ul className="space-y-2">
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('calculators'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>लव मैच कैलकुलेटर</li>
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('calculators'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>लो शू ग्रिड अंकशास्त्र</li>
              <li className="hover:text-[#f7e034] cursor-pointer" onClick={() => { setActiveTab('calculators'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>आज का शुभ मुहूर्त</li>
            </ul>
          </div>

          <div>
            <h4 className={`font-bold text-sm mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>लाइफटाइम वीआईपी पास</h4>
            <ul className="space-y-2">
              <li className="text-amber-400 font-bold hover:underline cursor-pointer" onClick={() => setIsVipModalOpen(true)}>👑 मात्र ₹99 में लाइफटाइम वीआईपी लें</li>
              <li className="hover:text-[#f7e034] cursor-pointer">50+ पेज रंगीन कुंडली PDF रिपोर्ट</li>
              <li className="hover:text-[#f7e034] cursor-pointer">16 षोडशवर्ग चक्र (D1-D60)</li>
              <li className="hover:text-[#f7e034] cursor-pointer">100% गोपनीय व 256-बिट सुरक्षित</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-center text-slate-500">
          <div className="flex items-center gap-2">
            <span className={`font-black ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>ASTROTALK VEDIC PLATFORM</span>
            <span>•</span>
            <span>सटीक बहुभाषी वैदिक ज्योतिष व त्वरित 24/7 मार्गदर्शन</span>
          </div>
          <p>© 2026 AstroTalk Platform. हिन्दी • English • বাংলা • தமிழ் • తెలుగు • ગુજરાતી • मराठी</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

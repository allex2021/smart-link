import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Moon, Sun, ChevronDown, User, LogOut, CheckCircle2, 
  Calendar, Clock, MapPin, ArrowRight, MessageSquare, Phone, 
  Bot, Compass, HeartHandshake, Grid, Award, 
  Heart, ShieldCheck, Flame, Star, Crown
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { SupportedLanguageCode } from '../data/languages';
import { UserProfile } from '../types';

export type AppNavTab = 'astrologers' | 'kundli' | 'matchmaking' | 'horoscope' | 'calculators' | 'ai-astro' | 'tarot';

interface NavbarProps {
  activeTab: AppNavTab;
  setActiveTab: (tab: AppNavTab) => void;
  walletBalance: number;
  openWallet: () => void;
  currentLanguage: SupportedLanguageCode;
  onSelectLanguage: (code: SupportedLanguageCode) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSelectSubCategory?: (mainTab: AppNavTab, subCategory?: string) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  isLifetimeVIP?: boolean;
  onOpenVipModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  walletBalance,
  openWallet,
  currentLanguage,
  onSelectLanguage,
  user,
  onOpenAuth,
  onLogout,
  onSelectSubCategory,
  theme = 'dark',
  onToggleTheme,
  isLifetimeVIP = false,
  onOpenVipModal
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubItemClick = (tab: AppNavTab, sub?: string) => {
    setActiveDropdown(null);
    if (tab === 'ai-astro') {
      setActiveTab('ai-astro');
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (onSelectSubCategory && sub) {
      onSelectSubCategory(tab, sub);
    }
  };

  const isLight = theme === 'light';

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${
      isLight ? 'bg-white/95 text-slate-900 border-b border-slate-200' : 'bg-[#07080b]/95 text-white border-b border-slate-800/80'
    } backdrop-blur-xl`} ref={dropdownRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          
          {/* 1. Left: Astrotalk Logo */}
          <div 
            onClick={() => handleSubItemClick('astrologers')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f7e034] flex items-center justify-center shadow-md shadow-[#f7e034]/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className={`text-xl sm:text-2xl font-bold tracking-tight font-sans ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Astrotalk
            </span>
          </div>

          {/* 2. Center: Dropdown Navigation Links with Sub-Categories */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            
            {/* 1. Consultations Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('consultations')}
            >
              <button
                onClick={() => handleSubItemClick('astrologers')}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'astrologers'
                    ? 'text-slate-950 bg-[#f7e034]'
                    : isLight
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>Consultations</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {activeDropdown === 'consultations' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className={`absolute top-full left-0 mt-1 w-64 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in space-y-1 ${
                    isLight ? 'bg-white border border-slate-200' : 'bg-slate-900 border border-slate-700'
                  }`}
                >
                  <div 
                    onClick={() => handleSubItemClick('astrologers', 'Chat')}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer group transition-colors ${
                      isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Chat with Astrologer</div>
                      <div className="text-[10px] text-slate-500">Live 1-on-1 private messaging</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleSubItemClick('astrologers', 'Call')}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer group transition-colors ${
                      isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Call with Astrologer</div>
                      <div className="text-[10px] text-slate-500">High clarity audio consultation</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleSubItemClick('ai-astro')}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer group transition-colors ${
                      isLight ? 'hover:bg-purple-50' : 'hover:bg-purple-950/40'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold flex items-center gap-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Vedic AI Acharya 24/7
                        <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 rounded">NEW</span>
                      </div>
                      <div className="text-[10px] text-slate-500">Maharshi Aryabhata (Instant Guidance)</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Horoscope Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('horoscope')}
            >
              <button
                onClick={() => handleSubItemClick('horoscope')}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'horoscope'
                    ? 'text-slate-950 bg-[#f7e034]'
                    : isLight
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>Horoscope</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {activeDropdown === 'horoscope' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className={`absolute top-full left-0 mt-1 w-60 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in space-y-1 ${
                    isLight ? 'bg-white border border-slate-200' : 'bg-slate-900 border border-slate-700'
                  }`}
                >
                  <div 
                    onClick={() => handleSubItemClick('horoscope', 'Daily')}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer group transition-colors ${
                      isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Today's Horoscope</div>
                      <div className="text-[10px] text-slate-500">Love, career & lucky numbers</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleSubItemClick('horoscope', 'Tomorrow')}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer group transition-colors ${
                      isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-sky-500" />
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Tomorrow's Horoscope</div>
                      <div className="text-[10px] text-slate-500">Plan ahead with transits</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleSubItemClick('horoscope', 'Yearly')}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer group transition-colors ${
                      isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                    }`}
                  >
                    <Award className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Yearly 2026 Forecast</div>
                      <div className="text-[10px] text-slate-500">Comprehensive yearly guide</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Vedic Services Dropdown (Kundli & Matchmaking) */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('free_services')}
            >
              <button
                onClick={() => handleSubItemClick('kundli')}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'kundli' || activeTab === 'matchmaking'
                    ? 'text-slate-950 bg-[#f7e034]'
                    : isLight
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>Vedic Services</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {activeDropdown === 'free_services' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className={`absolute top-full left-0 mt-1 w-64 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in space-y-1 ${
                    isLight ? 'bg-white border border-slate-200' : 'bg-slate-900 border border-slate-700'
                  }`}
                >
                  <div 
                    onClick={() => handleSubItemClick('kundli', 'D1')}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer group transition-colors ${
                      isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Vedic Janam Kundli</div>
                      <div className="text-[10px] text-slate-500">Birth chart, Lagna & planets</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleSubItemClick('matchmaking')}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer group transition-colors ${
                      isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Kundli Milan (Matching)</div>
                      <div className="text-[10px] text-slate-500">36 Guna Milan & Radar Chart</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleSubItemClick('kundli', 'Yogas')}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer group transition-colors ${
                      isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>1000+ Vedic Yogas</div>
                      <div className="text-[10px] text-slate-500">Rajyoga & Dhan Yoga detector</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Calculators Hub Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('calculators')}
            >
              <button
                onClick={() => handleSubItemClick('calculators')}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'calculators'
                    ? 'text-slate-950 bg-[#f7e034]'
                    : isLight
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>Calculators</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {activeDropdown === 'calculators' && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className={`absolute top-full left-0 mt-1 w-64 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in space-y-1 ${
                    isLight ? 'bg-white border border-slate-200' : 'bg-slate-900 border border-slate-700'
                  }`}
                >
                  <div 
                    onClick={() => handleSubItemClick('calculators', 'love')}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer group transition-colors ${
                      isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Love Match Calculator</div>
                      <div className="text-[10px] text-slate-500">Compatibility score & tips</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleSubItemClick('calculators', 'loshu')}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer group transition-colors ${
                      isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                    }`}
                  >
                    <Grid className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Lo Shu Grid 3x3</div>
                      <div className="text-[10px] text-slate-500">Numerological life planes</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleSubItemClick('calculators', 'muhurat')}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer group transition-colors ${
                      isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                    }`}
                  >
                    <Award className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Shubh Muhurat Finder</div>
                      <div className="text-[10px] text-slate-500">Auspicious timing windows</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Panchang Direct */}
            <button
              onClick={() => handleSubItemClick('kundli')}
              className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                isLight ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span>Panchang</span>
            </button>

            {/* 6. AI Acharya 24/7 */}
            <button
              onClick={() => handleSubItemClick('ai-astro')}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-800/60 hover:bg-amber-900/60 transition-all cursor-pointer shadow-sm flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#f7e034]" />
              <span>AI Acharya</span>
            </button>

            {/* 7. Tarot Reading */}
            <button
              onClick={() => handleSubItemClick('tarot')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                activeTab === 'tarot'
                  ? 'text-red-400 bg-red-950/40 border-red-800/60'
                  : isLight
                  ? 'text-slate-700 hover:text-slate-950 border-transparent hover:bg-slate-100'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border-transparent'
              }`}
            >
              🔮 Tarot
            </button>
          </nav>

          {/* 3. Right: VIP Button, Theme Toggle, Language, Profile & CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Glowing VIP Pass Button */}
            {isLifetimeVIP ? (
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black shadow-md border border-amber-300">
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span className="hidden sm:inline">VIP MEMBER</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenVipModal}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-[#f7e034] to-amber-500 text-slate-950 text-xs font-black shadow-[0_0_20px_rgba(247,224,52,0.4)] hover:shadow-[0_0_28px_rgba(247,224,52,0.6)] transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>VIP Pass ₹99</span>
              </button>
            )}

            {/* Functional Dark / Light Theme Toggle Icon */}
            <button
              type="button"
              onClick={onToggleTheme}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                isLight 
                  ? 'bg-amber-100 border-amber-300 text-amber-600 hover:bg-amber-200' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? (
                <Sun className="w-4 h-4 fill-amber-500 stroke-[2.5]" />
              ) : (
                <Moon className="w-4 h-4 fill-slate-300 stroke-[2.5]" />
              )}
            </button>

            {/* Language Selector (অ/A) */}
            <LanguageSelector
              currentLanguage={currentLanguage}
              onSelectLanguage={onSelectLanguage}
              compact
            />

            {/* User Profile / Account Icon */}
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden border border-amber-400 focus:outline-none cursor-pointer"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </button>

                {isProfileMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in ${
                    isLight ? 'bg-white border border-slate-200' : 'bg-slate-900 border border-slate-700'
                  }`}>
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/40">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover border border-amber-400"
                      />
                      <div className="min-w-0">
                        <h4 className={`text-xs font-bold truncate flex items-center gap-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {user.name}
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">{user.phone}</p>
                      </div>
                    </div>

                    {user.dateOfBirth && (
                      <div className="py-2.5 space-y-1 text-[11px] text-slate-400 border-b border-slate-800/40">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-500" /> {user.dateOfBirth}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-500" /> {user.timeOfBirth || '12:00 PM'}
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" /> {user.placeOfBirth || 'Not set'}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full mt-2.5 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
                title="Account Login"
              >
                <User className="w-4 h-4" />
              </button>
            )}

            {/* Glowing Yellow CTA Button: "Talk now | First Chat Free ->" */}
            <button
              onClick={() => {
                const el = document.getElementById('astrologers-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleSubItemClick('astrologers');
                }
              }}
              className="px-4 py-2 rounded-full bg-[#f7e034] hover:bg-[#ffe838] text-slate-950 font-bold text-xs shadow-[0_0_25px_rgba(247,224,52,0.5)] hover:shadow-[0_0_35px_rgba(247,224,52,0.7)] flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            >
              <span>Talk now</span>
              <span className="text-slate-950/50 font-normal">|</span>
              <span className="text-[11px]">₹99 VIP Access</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-800/40 gap-1 overflow-x-auto">
          <button
            onClick={() => handleSubItemClick('astrologers')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap ${
              activeTab === 'astrologers' ? 'bg-[#f7e034] text-slate-950' : 'text-slate-400'
            }`}
          >
            Consultations
          </button>
          <button
            onClick={() => handleSubItemClick('horoscope')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap ${
              activeTab === 'horoscope' ? 'bg-[#f7e034] text-slate-950' : 'text-slate-400'
            }`}
          >
            Horoscope
          </button>
          <button
            onClick={() => handleSubItemClick('kundli')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap ${
              activeTab === 'kundli' ? 'bg-[#f7e034] text-slate-950' : 'text-slate-400'
            }`}
          >
            Kundli
          </button>
          <button
            onClick={() => handleSubItemClick('calculators')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap ${
              activeTab === 'calculators' ? 'bg-[#f7e034] text-slate-950' : 'text-slate-400'
            }`}
          >
            Calculators
          </button>
          <button
            onClick={() => handleSubItemClick('ai-astro')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap ${
              activeTab === 'ai-astro' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-amber-300'
            }`}
          >
            AI Acharya
          </button>
          <button
            onClick={() => handleSubItemClick('tarot')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap ${
              activeTab === 'tarot' ? 'bg-[#f7e034] text-slate-950' : 'text-slate-400'
            }`}
          >
            Tarot
          </button>
        </div>
      </div>
    </header>
  );
};

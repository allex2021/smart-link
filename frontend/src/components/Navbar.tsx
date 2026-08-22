import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Moon, ChevronDown, User, LogOut, CheckCircle2, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { SupportedLanguageCode } from '../data/languages';
import { UserProfile } from '../types';

export type AppNavTab = 'astrologers' | 'kundli' | 'matchmaking' | 'horoscope' | 'calculators' | 'shop' | 'ai-astro';

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
  onLogout
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#07080b]/95 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          
          {/* 1. Left: Astrotalk Logo */}
          <div 
            onClick={() => {
              setActiveTab('astrologers');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f7e034] flex items-center justify-center shadow-md shadow-[#f7e034]/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              Astrotalk
            </span>
          </div>

          {/* 2. Center: Dropdown Navigation Links (Astrotalk Official Tabs) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            
            {/* Consultations */}
            <button
              onClick={() => {
                setActiveTab('astrologers');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'astrologers'
                  ? 'text-[#f7e034] bg-slate-900'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span>Consultations</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {/* Horoscope */}
            <button
              onClick={() => {
                setActiveTab('horoscope');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'horoscope'
                  ? 'text-[#f7e034] bg-slate-900'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span>Horoscope</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {/* Free Services (Kundli & Matchmaking) */}
            <button
              onClick={() => {
                setActiveTab('kundli');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'kundli' || activeTab === 'matchmaking'
                  ? 'text-[#f7e034] bg-slate-900'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span>Free Services</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {/* Calculators */}
            <button
              onClick={() => {
                setActiveTab('calculators');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'calculators'
                  ? 'text-[#f7e034] bg-slate-900'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span>Calculators</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {/* Panchang */}
            <button
              onClick={() => {
                setActiveTab('kundli');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900/60 transition-all"
            >
              <span>Panchang</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {/* Shop */}
            <button
              onClick={() => {
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'shop'
                  ? 'text-[#f7e034] bg-slate-900'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              Shop
            </button>

            {/* AI Astro */}
            <button
              onClick={() => {
                setActiveTab('ai-astro');
              }}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-purple-300 bg-purple-950/40 border border-purple-800/60 hover:bg-purple-900/50 transition-all"
            >
              AI Astro 24/7
            </button>
          </nav>

          {/* 3. Right: Icons & Glowing "Talk now | First Chat Free" Button */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle Icon */}
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              title="Theme Mode"
            >
              <Moon className="w-4 h-4" />
            </button>

            {/* Language Selector (अ/A) */}
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
                  className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 focus:outline-none"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover border border-amber-400"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate flex items-center gap-1">
                          {user.name}
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">{user.phone}</p>
                      </div>
                    </div>

                    {user.dateOfBirth && (
                      <div className="py-2.5 space-y-1 text-[11px] text-slate-300 border-b border-slate-800/80">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Calendar className="w-3 h-3 text-slate-500" /> {user.dateOfBirth}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Clock className="w-3 h-3 text-slate-500" /> {user.timeOfBirth || '12:00 PM'}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-300 truncate">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" /> {user.placeOfBirth || 'Not set'}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full mt-2.5 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
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
                  setActiveTab('astrologers');
                }
              }}
              className="px-4 py-2 rounded-full bg-[#f7e034] hover:bg-[#ffe838] text-slate-950 font-bold text-xs shadow-[0_0_25px_rgba(247,224,52,0.5)] hover:shadow-[0_0_35px_rgba(247,224,52,0.7)] flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 shrink-0"
            >
              <span>Talk now</span>
              <span className="text-slate-950/50 font-normal">|</span>
              <span className="text-[11px]">First Chat Free</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-800/80 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('astrologers')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'astrologers' ? 'bg-[#f7e034] text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Consultations
          </button>
          <button
            onClick={() => setActiveTab('horoscope')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'horoscope' ? 'bg-[#f7e034] text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Horoscope
          </button>
          <button
            onClick={() => setActiveTab('kundli')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'kundli' ? 'bg-[#f7e034] text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Kundli
          </button>
          <button
            onClick={() => setActiveTab('calculators')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'calculators' ? 'bg-[#f7e034] text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Calculators
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'shop' ? 'bg-[#f7e034] text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Shop
          </button>
        </div>
      </div>
    </header>
  );
};

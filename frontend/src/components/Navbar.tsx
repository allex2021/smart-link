import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Wallet, Flame, MessageSquare, Compass, HeartHandshake, Bot, User, LogOut, CheckCircle2, ChevronDown, Calendar, Clock, MapPin, ShoppingBag, Grid, Heart, Award } from 'lucide-react';
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
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('astrologers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'astrologers'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Talk to Astrologer
            </button>

            <button
              onClick={() => setActiveTab('horoscope')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'horoscope'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Horoscope
            </button>

            <button
              onClick={() => setActiveTab('kundli')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'kundli'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Free Kundli
            </button>

            <button
              onClick={() => setActiveTab('matchmaking')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'matchmaking'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              Matchmaking
            </button>

            <button
              onClick={() => setActiveTab('calculators')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'calculators'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Calculators
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'shop'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              AstroShop
            </button>

            <button
              onClick={() => setActiveTab('ai-astro')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ai-astro'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-purple-300 hover:text-purple-200 hover:bg-purple-950/40'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              AI Astro 24/7
            </button>
          </nav>

          {/* Right Actions: Language, Wallet & User Profile */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <LanguageSelector
              currentLanguage={currentLanguage}
              onSelectLanguage={onSelectLanguage}
            />

            {/* Wallet Button */}
            <button
              onClick={openWallet}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 transition-all hover:border-amber-500/50 group shadow-sm"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-[10px] text-slate-400 font-medium leading-none">Wallet</span>
                <span className="text-xs font-bold text-amber-400 leading-tight">₹{walletBalance.toFixed(2)}</span>
              </div>
              <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full hover:bg-amber-400">
                +
              </span>
            </button>

            {/* User Profile / Login Button */}
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500/50 transition-all text-xs font-semibold text-slate-200"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-amber-400"
                  />
                  <span className="max-w-20 sm:max-w-28 truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
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

                    {/* Saved Birth Details */}
                    {user.dateOfBirth && (
                      <div className="py-2.5 space-y-1 text-[11px] text-slate-300 border-b border-slate-800/80">
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 text-amber-400" /> Saved Birth Details
                        </div>
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
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-800/80 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('astrologers')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'astrologers' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Astrologers
          </button>
          <button
            onClick={() => setActiveTab('horoscope')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'horoscope' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Horoscope
          </button>
          <button
            onClick={() => setActiveTab('kundli')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'kundli' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Kundli
          </button>
          <button
            onClick={() => setActiveTab('calculators')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'calculators' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Calculators
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'shop' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Shop
          </button>
        </div>
      </div>
    </header>
  );
};

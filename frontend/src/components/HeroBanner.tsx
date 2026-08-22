import React from 'react';
import { 
  Sparkles, MessageSquare, Phone, Compass, HeartHandshake, 
  ShoppingBag, Bot, ShieldCheck, Star, Users, Flame, ArrowRight, 
  CheckCircle2, Clock
} from 'lucide-react';
import { AppNavTab } from './Navbar';

interface HeroBannerProps {
  onStartConsultation: () => void;
  onNavigateTab: (tab: AppNavTab) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartConsultation,
  onNavigateTab
}) => {
  const quickServices = [
    {
      id: 'chat',
      title: 'Chat with Astrologer',
      subtitle: 'First 5 Mins Free',
      icon: MessageSquare,
      color: 'from-amber-500 to-orange-500',
      badge: 'POPULAR',
      action: () => {
        const el = document.getElementById('astrologers-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'call',
      title: 'Talk / Audio Call',
      subtitle: 'Instant Connect',
      icon: Phone,
      color: 'from-emerald-500 to-teal-500',
      badge: 'LIVE',
      action: () => {
        const el = document.getElementById('astrologers-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'horoscope',
      title: 'Today Horoscope',
      subtitle: '12 Zodiac Signs',
      icon: Sparkles,
      color: 'from-amber-400 to-yellow-500',
      badge: 'FREE',
      action: () => onNavigateTab('horoscope')
    },
    {
      id: 'kundli',
      title: 'Free Janam Kundli',
      subtitle: 'Detailed Chart & Dasha',
      icon: Compass,
      color: 'from-blue-500 to-indigo-500',
      badge: 'FREE',
      action: () => onNavigateTab('kundli')
    },
    {
      id: 'matchmaking',
      title: 'Kundli Milan',
      subtitle: '36 Guna Matching',
      icon: HeartHandshake,
      color: 'from-rose-500 to-pink-500',
      badge: 'FREE',
      action: () => onNavigateTab('matchmaking')
    },
    {
      id: 'ai-astro',
      title: 'AI Astrologer 24/7',
      subtitle: 'Zero Waiting Queue',
      icon: Bot,
      color: 'from-purple-500 to-violet-600',
      badge: 'NEW',
      action: () => onNavigateTab('ai-astro')
    },
    {
      id: 'shop',
      title: 'AstroShop',
      subtitle: 'Certified Gemstones',
      icon: ShoppingBag,
      color: 'from-orange-500 to-amber-600',
      badge: 'OFFER',
      action: () => onNavigateTab('shop')
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-orange-500/15 to-purple-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 relative z-10">
        {/* Main Hero Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10">
          <div className="max-w-2xl text-center lg:text-left space-y-4">
            {/* Offer Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm animate-pulse">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>FIRST 5 MINUTES FREE CONSULTATION</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Talk to India's Best <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Vedic Astrologers Online
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Get genuine, confidential answers for <b className="text-white">Love, Marriage, Career, Health & Wealth</b> from 15,000+ verified Vedic experts. Available 24/7 in English, বাংলা, हिन्दी & 5+ languages.
            </p>

            {/* CTA Button & Trust Badges */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartConsultation}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-2.5 transform hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>Chat with Astrologer (₹150 Free)</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/80 border border-slate-800 px-4 py-3 rounded-2xl">
                <div className="flex items-center text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-1 text-sm font-black text-white">4.8</span>/5
                </div>
                <span className="text-slate-600">|</span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>50 Million+ Consultations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Live Astrologer Showcase Card */}
          <div className="w-full lg:w-96 bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-amber-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-emerald-400">1,240+ Astrologers Online Now</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                Live Queue: 0s
              </span>
            </div>

            <div className="py-4 flex items-center gap-3.5">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
                  alt="Top Astrologer"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-bold text-white">Acharya Sunita Sharma</h4>
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                </div>
                <p className="text-xs text-amber-400 font-medium">Vedic & Marriage Expert</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span className="text-slate-300 font-semibold">16 Yrs Exp</span>
                  <span>•</span>
                  <span className="text-amber-300 font-bold">₹25/min</span>
                </div>
              </div>
            </div>

            <button
              onClick={onStartConsultation}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect Live Consultation</span>
            </button>
          </div>
        </div>

        {/* Quick Astrotalk Services Strip (Icons Row) */}
        <div className="pt-2">
          <div className="text-center sm:text-left mb-3">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
              Popular Astrotalk Services
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {quickServices.map((srv) => {
              const Icon = srv.icon;
              return (
                <button
                  key={srv.id}
                  onClick={srv.action}
                  className="bg-slate-900/90 border border-slate-800/90 hover:border-amber-500/50 hover:bg-slate-800/80 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 group hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 relative"
                >
                  <span className="absolute top-2 right-2 text-[8px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {srv.badge}
                  </span>

                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${srv.color} flex items-center justify-center text-white shadow-md mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors leading-tight">
                    {srv.title}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {srv.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

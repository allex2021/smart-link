import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { AppNavTab } from './Navbar';

interface HeroBannerProps {
  onStartConsultation: () => void;
  onNavigateTab: (tab: AppNavTab) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartConsultation,
  onNavigateTab
}) => {
  return (
    <div className="relative min-h-[640px] lg:min-h-[700px] bg-[#07080b] overflow-hidden flex flex-col justify-between pt-6 pb-12">
      {/* 1. Astrological Geometric Chart / Zodiac Wheel Background Watermark */}
      <div className="absolute right-[-5%] lg:right-[0%] top-[-5%] lg:top-[0%] w-[680px] h-[680px] lg:w-[850px] lg:h-[850px] pointer-events-none opacity-[0.18]">
        <svg viewBox="0 0 800 800" className="w-full h-full stroke-[#f7e034]" fill="none">
          <circle cx="400" cy="400" r="380" strokeWidth="1.5" strokeDasharray="4 6" />
          <circle cx="400" cy="400" r="340" strokeWidth="1" />
          <circle cx="400" cy="400" r="270" strokeWidth="1" />
          <circle cx="400" cy="400" r="180" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="400" cy="400" r="90" strokeWidth="1" />
          
          {/* 12 Zodiac Radial Sectors */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 400 + 180 * Math.cos(angle);
            const y1 = 400 + 180 * Math.sin(angle);
            const x2 = 400 + 380 * Math.cos(angle);
            const y2 = 400 + 380 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1" />;
          })}

          {/* Geometric Diamond Kundli Lines */}
          <polygon points="400,130 670,400 400,670 130,400" strokeWidth="1" />
          <polygon points="400,220 580,400 400,580 220,400" strokeWidth="0.8" />
          <line x1="130" y1="130" x2="670" y2="670" strokeWidth="0.8" strokeDasharray="4 4" />
          <line x1="130" y1="670" x2="670" y2="130" strokeWidth="0.8" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* 2. Golden Ambient Glows */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-1/3 w-[600px] h-[300px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-[15%] w-[450px] h-[450px] bg-[#f7e034]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* 3. Twinkling Golden Dust Stars */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-[12%] w-1.5 h-1.5 bg-[#f7e034] rounded-full shadow-sm shadow-[#f7e034] animate-pulse" />
        <div className="absolute top-28 left-[35%] w-1 h-1 bg-amber-300/90 rounded-full" />
        <div className="absolute top-44 left-[20%] w-1.5 h-1.5 bg-white/80 rounded-full" />
        <div className="absolute top-64 left-[48%] w-1 h-1 bg-[#f7e034]/80 rounded-full animate-pulse" />
        <div className="absolute top-20 right-[45%] w-1.5 h-1.5 bg-[#f7e034] rounded-full shadow-md shadow-[#f7e034]" />
        <div className="absolute top-52 right-[32%] w-1 h-1 bg-amber-100/80 rounded-full animate-ping opacity-60" />
        <div className="absolute top-80 right-[8%] w-1.5 h-1.5 bg-[#f7e034]/80 rounded-full" />
        <div className="absolute bottom-28 left-[18%] w-1.5 h-1.5 bg-[#f7e034] rounded-full shadow-sm shadow-[#f7e034]" />
        <div className="absolute bottom-36 right-[35%] w-1 h-1 bg-white/80 rounded-full animate-pulse" />
      </div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Pill, Checkmarks & CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Online Astrologers Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg shadow-black/40">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-slate-300">
                <b className="text-emerald-400 font-bold">1,240</b> ज्योतिषी अभी ऑनलाइन हैं
              </span>
              {/* Overlapping Sadhu avatars */}
              <div className="flex items-center -space-x-2 ml-1">
                <img
                  src="/sadhu_acharya_left.jpg"
                  alt="Astro Sadhu"
                  className="w-5 h-5 rounded-full object-cover border border-slate-900"
                />
                <img
                  src="/sadhu_maharaj_center.jpg"
                  alt="Astro Maharaj"
                  className="w-5 h-5 rounded-full object-cover border border-slate-900"
                />
                <img
                  src="/sadhu_guruji_right.jpg"
                  alt="Astro Guruji"
                  className="w-5 h-5 rounded-full object-cover border border-slate-900"
                />
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-white tracking-tight leading-[1.14]">
              भारत का सबसे सटीक <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7e034] via-yellow-400 to-orange-400">
                वैदिक ज्योतिष मंच
              </span>
            </h1>

            {/* Bullet Checkmarks */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#f7e034] flex items-center justify-center text-slate-950 shrink-0 shadow-sm shadow-[#f7e034]/40">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-sm sm:text-base text-slate-300 font-medium">
                  50+ पेज वीआईपी जन्म कुंडली व 1000+ वैदिक योग
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#f7e034] flex items-center justify-center text-slate-950 shrink-0 shadow-sm shadow-[#f7e034]/40">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-sm sm:text-base text-slate-300 font-medium">
                  औसत उत्तर मात्र <b className="text-white font-bold">12 सेकंड के भीतर</b>
                </span>
              </div>
            </div>

            {/* Big Glowing Yellow CTA Button */}
            <div className="pt-3">
              <button
                onClick={onStartConsultation}
                className="px-7 py-3.5 rounded-2xl bg-[#f7e034] hover:bg-[#ffe838] text-slate-950 font-black text-sm sm:text-base shadow-[0_0_30px_rgba(247,224,52,0.45)] hover:shadow-[0_0_40px_rgba(247,224,52,0.65)] flex items-center gap-2.5 transition-all transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                <span>वीआईपी परामर्श शुरू करें</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Right Column: 3 Authentic AI Sadhu / Vedic Rishi / Acharya Portraits with Hindi Badges */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-end py-6 lg:py-0">
            <div className="relative w-full max-w-[500px] h-[340px] sm:h-[390px] flex items-center justify-center">
              
              {/* Left Capsule: AI Sadhu Acharya in Saffron Attire */}
              <div className="absolute left-[4%] sm:left-[8%] top-[10%] z-10 w-[140px] sm:w-[170px] h-[220px] sm:h-[270px] rounded-[90px] overflow-hidden border-2 border-[#f7e034]/50 shadow-2xl bg-slate-900 group transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <img
                  src="/sadhu_acharya_left.jpg"
                  alt="Vedic Sadhu Acharya"
                  className="w-full h-full object-cover object-center filter brightness-100 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 inset-x-0 text-center">
                  <span className="text-[11px] font-black text-[#f7e034] bg-slate-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-md">
                    आचार्य देव
                  </span>
                </div>
              </div>

              {/* Center Main Circle: AI Revered Sadhu Pandit Maharaj with Radiant Glowing Ring */}
              <div className="relative z-20 w-[200px] sm:w-[250px] h-[200px] sm:h-[250px] rounded-full overflow-hidden border-[4px] border-[#f7e034] shadow-[0_0_55px_rgba(247,224,52,0.55)] bg-slate-950 transform hover:scale-105 transition-transform duration-300">
                <img
                  src="/sadhu_maharaj_center.jpg"
                  alt="Chief Sadhu Pandit Maharaj"
                  className="w-full h-full object-cover object-center scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
                  <span className="text-xs font-black text-slate-950 bg-[#f7e034] border border-amber-300 px-3.5 py-1 rounded-full shadow-xl tracking-wide">
                    पंडित महाराज
                  </span>
                </div>
              </div>

              {/* Right Capsule: AI Vedic Yogi Sadhu Guruji */}
              <div className="absolute right-[4%] sm:right-[8%] top-[14%] z-10 w-[140px] sm:w-[170px] h-[220px] sm:h-[270px] rounded-[90px] overflow-hidden border-2 border-[#f7e034]/50 shadow-2xl bg-slate-900 group transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <img
                  src="/sadhu_guruji_right.jpg"
                  alt="Vedic Sadhu Guruji"
                  className="w-full h-full object-cover object-center filter brightness-100 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 inset-x-0 text-center">
                  <span className="text-[11px] font-black text-[#f7e034] bg-slate-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-md">
                    गुरुजी
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Stats Bar (Exact Astrotalk Numbers) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-6 border-t border-slate-800/80 text-left">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">5Cr+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">संतुष्ट उपयोगकर्ता</div>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">50,000+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">सत्यापित ज्योतिषी</div>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">13+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">भारतीय भाषाएं</div>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">60+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">देशों में सक्रिय</div>
          </div>
        </div>
      </div>
    </div>
  );
};

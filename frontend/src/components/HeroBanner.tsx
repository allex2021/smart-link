import React from 'react';
import { Sparkles, Check, ArrowRight, Star } from 'lucide-react';
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
    <div className="relative min-h-[620px] lg:min-h-[680px] bg-[#07080b] overflow-hidden flex flex-col justify-between pt-6 pb-12">
      {/* 1. Astrological Geometric Chart / Zodiac Wheel Background Watermark (Right side) */}
      <div className="absolute right-[-10%] top-[-10%] w-[750px] h-[750px] lg:w-[900px] lg:h-[900px] pointer-events-none opacity-[0.14]">
        <svg viewBox="0 0 800 800" className="w-full h-full stroke-amber-400" fill="none">
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
      <div className="absolute top-1/3 right-[15%] w-[450px] h-[450px] bg-amber-400/8 rounded-full blur-[130px] pointer-events-none" />

      {/* 3. Twinkling Golden Dust Stars */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-[12%] w-1 h-1 bg-amber-200/80 rounded-full shadow-sm shadow-amber-300 animate-pulse" />
        <div className="absolute top-28 left-[35%] w-1.5 h-1.5 bg-amber-300/90 rounded-full shadow-md shadow-amber-400" />
        <div className="absolute top-44 left-[20%] w-1 h-1 bg-white/70 rounded-full" />
        <div className="absolute top-64 left-[48%] w-1 h-1 bg-amber-200/80 rounded-full animate-pulse" />
        <div className="absolute top-20 right-[42%] w-1.5 h-1.5 bg-amber-400/90 rounded-full" />
        <div className="absolute top-52 right-[28%] w-1 h-1 bg-amber-100/80 rounded-full animate-ping opacity-60" />
        <div className="absolute top-80 right-[10%] w-1.5 h-1.5 bg-amber-300/80 rounded-full" />
        <div className="absolute bottom-28 left-[18%] w-1.5 h-1.5 bg-amber-300/90 rounded-full shadow-sm shadow-amber-400" />
        <div className="absolute bottom-36 right-[35%] w-1 h-1 bg-white/80 rounded-full animate-pulse" />
      </div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline, Pill, Checkmarks & CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Online Astrologers Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg shadow-black/40">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-slate-300">
                <b className="text-emerald-400 font-bold">1,240</b> astrologers online now
              </span>
              {/* Overlapping small avatar circles */}
              <div className="flex items-center -space-x-2 ml-1">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50"
                  alt="Astro"
                  className="w-5 h-5 rounded-full object-cover border border-slate-900"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50"
                  alt="Astro"
                  className="w-5 h-5 rounded-full object-cover border border-slate-900"
                />
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50"
                  alt="Astro"
                  className="w-5 h-5 rounded-full object-cover border border-slate-900"
                />
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-white tracking-tight leading-[1.12]">
              India's most accurate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400">
                astrology platform
              </span>
            </h1>

            {/* Bullet Checkmarks */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 shrink-0 shadow-sm shadow-amber-400/40">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-sm sm:text-base text-slate-300 font-medium">
                  Get Free detailed kundli
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 shrink-0 shadow-sm shadow-amber-400/40">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-sm sm:text-base text-slate-300 font-medium">
                  Average reply under <b className="text-white font-bold">12 seconds</b>
                </span>
              </div>
            </div>

            {/* Big Glowing Yellow CTA Button */}
            <div className="pt-3">
              <button
                onClick={onStartConsultation}
                className="px-7 py-3.5 rounded-2xl bg-[#f7e034] hover:bg-[#ffe838] text-slate-950 font-black text-sm sm:text-base shadow-[0_0_30px_rgba(247,224,52,0.45)] hover:shadow-[0_0_40px_rgba(247,224,52,0.65)] flex items-center gap-2.5 transition-all transform hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>Start Free Chat</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Right Column: 3 Overlapping Astrologer Portraits */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end min-h-[380px] sm:min-h-[440px] pt-4 lg:pt-0">
            
            {/* Left Astrologer Oval */}
            <div className="absolute left-[5%] sm:left-[15%] lg:left-[10%] top-[18%] z-10 w-36 h-48 sm:w-44 sm:h-56 rounded-[100px] overflow-hidden border border-amber-500/30 shadow-2xl bg-slate-900 group transform -rotate-3 hover:rotate-0 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
                alt="Vedic Astrologer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Center Hero Astrologer (Large Circle with Glowing Border) */}
            <div className="relative z-20 w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden border-[3px] border-[#f7e034] shadow-[0_0_45px_rgba(247,224,52,0.35)] bg-slate-900 transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
                alt="Acharya Guru"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Right Astrologer Oval */}
            <div className="absolute right-[5%] sm:right-[15%] lg:right-[-2%] top-[25%] z-10 w-36 h-48 sm:w-44 sm:h-56 rounded-[100px] overflow-hidden border border-amber-500/30 shadow-2xl bg-slate-900 group transform rotate-3 hover:rotate-0 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
                alt="Acharya Astrologer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Stats Bar (Exact Astrotalk Numbers) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-6 border-t border-slate-800/80 text-left">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">5Cr+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">Users guided</div>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">50,000+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">Verified astrologers</div>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">13+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">Languages</div>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">60+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">Countries</div>
          </div>
        </div>
      </div>
    </div>
  );
};

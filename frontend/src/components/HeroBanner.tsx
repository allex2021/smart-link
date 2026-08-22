import React from 'react';
import { ShieldCheck, Users, Award, Star, PhoneCall, Sparkles, MessageCircleHeart } from 'lucide-react';

interface HeroBannerProps {
  onStartConsultation: () => void;
  onOpenKundli: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartConsultation,
  onOpenKundli
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950 border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>10,000+ Verified Certified Astrologers</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Get Instant Clarity on <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                Career, Love & Marriage
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0">
              Connect 1-on-1 with India’s leading Vedic Astrologers, Tarot Readers, and Numerologists. Get accurate planetary predictions & remedies 24/7.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onStartConsultation}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-amber-300 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <PhoneCall className="w-4 h-4" />
                Chat with Astrologer (₹100 Free)
              </button>

              <button
                onClick={onOpenKundli}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white font-semibold text-sm border border-slate-700 transition-all"
              >
                <MessageCircleHeart className="w-4 h-4 text-rose-400" />
                Check Free Kundli
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <div className="text-lg font-black text-white flex items-center justify-center lg:justify-start gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  4.9/5
                </div>
                <span className="text-[11px] text-slate-400">500k+ Reviews</span>
              </div>
              <div>
                <div className="text-lg font-black text-white flex items-center justify-center lg:justify-start gap-1">
                  <Users className="w-4 h-4 text-sky-400" />
                  5M+
                </div>
                <span className="text-[11px] text-slate-400">Happy Users</span>
              </div>
              <div>
                <div className="text-lg font-black text-white flex items-center justify-center lg:justify-start gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  100%
                </div>
                <span className="text-[11px] text-slate-400">Privacy Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Right Live Consultation Preview Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-sm relative glow-amber">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128"
                      alt="Acharya"
                      className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-800 rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Acharya Devrat</h3>
                    <p className="text-[11px] text-amber-400">Live • Vedic Master (16 yrs exp)</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                  AVAILABLE NOW
                </span>
              </div>

              {/* Sample Live Dialogue Simulation */}
              <div className="py-4 space-y-2.5 text-xs">
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/50 text-slate-300">
                  <span className="font-semibold text-slate-400 block text-[10px] mb-0.5">User asked:</span>
                  "When will I switch jobs, and is overseas relocation possible this year?"
                </div>
                <div className="bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30 text-amber-200">
                  <span className="font-semibold text-amber-400 block text-[10px] mb-0.5">Acharya Devrat:</span>
                  "Your Jupiter Mahadasha in 10th house indicates an ideal breakthrough window starting from October 2026..."
                </div>
              </div>

              <button
                onClick={onStartConsultation}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                Start Live Consultation (₹20/min)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

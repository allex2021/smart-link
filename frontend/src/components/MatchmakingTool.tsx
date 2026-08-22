import React, { useState } from 'react';
import { HeartHandshake, CheckCircle, AlertTriangle, Sparkles, Heart } from 'lucide-react';
import { calculateGunaMilanClient, ZODIAC_SIGNS, NAKSHATRAS } from '../utils/astrology';
import { GunaMilanResult } from '../types';

export const MatchmakingTool: React.FC = () => {
  const [boySign, setBoySign] = useState(0); // Aries (0)
  const [boyNak, setBoyNak] = useState(0);   // Ashwini (0)
  const [girlSign, setGirlSign] = useState(4); // Leo (4)
  const [girlNak, setGirlNak] = useState(10); // Purva Phalguni (10)

  const [result, setResult] = useState<GunaMilanResult>(() => {
    return calculateGunaMilanClient(0, 0, 4, 10);
  });

  const handleMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateGunaMilanClient(boySign, boyNak, girlSign, girlNak);
    setResult(res);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold mb-2">
          <Heart className="w-3.5 h-3.5" />
          <span>Ashtakoota 36 Guna Milan</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">Horoscope Matching for Marriage</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate Vedic marriage compatibility score across 8 Kootas including Nadi, Bhakoot, Gana, and Graha Maitri.
        </p>
      </div>

      {/* Input Selection Forms */}
      <form onSubmit={handleMatch} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Boy Details */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
              👦 Boy's Astrological Details
            </h3>
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">Moon Sign (Rashi)</label>
              <select
                value={boySign}
                onChange={(e) => setBoySign(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {ZODIAC_SIGNS.map((sign, idx) => (
                  <option key={sign} value={idx}>{idx + 1}. {sign}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">Birth Nakshatra</label>
              <select
                value={boyNak}
                onChange={(e) => setBoyNak(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {NAKSHATRAS.map((nak, idx) => (
                  <option key={nak} value={idx}>{idx + 1}. {nak}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Girl Details */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              👧 Girl's Astrological Details
            </h3>
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">Moon Sign (Rashi)</label>
              <select
                value={girlSign}
                onChange={(e) => setGirlSign(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {ZODIAC_SIGNS.map((sign, idx) => (
                  <option key={sign} value={idx}>{idx + 1}. {sign}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">Birth Nakshatra</label>
              <select
                value={girlNak}
                onChange={(e) => setGirlNak(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {NAKSHATRAS.map((nak, idx) => (
                  <option key={nak} value={idx}>{idx + 1}. {nak}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          <HeartHandshake className="w-4 h-4" />
          Check 36 Guna Milan Score
        </button>
      </form>

      {/* Result Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center pb-6 border-b border-slate-800">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block mb-1">Total Compatibility Score</span>
          <div className="flex items-center justify-center gap-2">
            <span className={`text-4xl sm:text-5xl font-black ${result.totalScore >= 18 ? 'text-amber-400' : 'text-rose-400'}`}>
              {result.totalScore}
            </span>
            <span className="text-xl text-slate-500 font-bold">/ 36 Gunas</span>
          </div>

          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border">
            {result.isRecommended ? (
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border-emerald-500/30 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" /> Highly Auspicious Match for Marriage
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-400 bg-rose-500/10 border-rose-500/30 px-3 py-1 rounded-full">
                <AlertTriangle className="w-4 h-4" /> Average / Astrological Remedy Recommended
              </span>
            )}
          </div>
        </div>

        {/* 8 Kootas Detailed Table */}
        <div className="mt-6">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Ashtakoota Score Breakdown (8 Parameters)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(result.kootaBreakdown).map(([koota, score]) => (
              <div key={koota} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 capitalize font-medium block">
                  {koota.replace(/([A-Z])/g, ' $1')}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-base font-black text-amber-400">{score.obtained}</span>
                  <span className="text-[10px] text-slate-500">/ {score.max} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

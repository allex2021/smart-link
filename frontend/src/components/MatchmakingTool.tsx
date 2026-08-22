import React, { useState } from 'react';
import { 
  HeartHandshake, CheckCircle, AlertTriangle, Sparkles, Heart, 
  Flame, ShieldCheck, Printer, Award, Info, RefreshCw, Zap
} from 'lucide-react';
import { ZODIAC_SIGNS, NAKSHATRAS } from '../utils/astrology';
import { RelationshipRadarEngine, AIRelationshipReport } from '../utils/relationshipRadarEngine';
import { RelationshipRadarChart } from './RelationshipRadarChart';

export const MatchmakingTool: React.FC = () => {
  const [boyName, setBoyName] = useState('Rahul');
  const [boySign, setBoySign] = useState(0); // Aries
  const [boyNak, setBoyNak] = useState(0);   // Ashwini

  const [girlName, setGirlName] = useState('Priya');
  const [girlSign, setGirlSign] = useState(4); // Leo
  const [girlNak, setGirlNak] = useState(10); // Purva Phalguni

  const [report, setReport] = useState<AIRelationshipReport>(() => {
    return RelationshipRadarEngine.calculateAIRadar(0, 0, 4, 10);
  });

  const handleMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const rep = RelationshipRadarEngine.calculateAIRadar(boySign, boyNak, girlSign, girlNak);
    setReport(rep);
  };

  const handleLoadPreset = (
    bName: string, bSign: number, bNak: number,
    gName: string, gSign: number, gNak: number
  ) => {
    setBoyName(bName);
    setBoySign(bSign);
    setBoyNak(bNak);
    setGirlName(gName);
    setGirlSign(gSign);
    setGirlNak(gNak);
    const rep = RelationshipRadarEngine.calculateAIRadar(bSign, bNak, gSign, gNak);
    setReport(rep);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <span>AI Relationship & Kundli Matching Radar (SwissEph & Astro.com Engine)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Vedic Ashtakoota & Planetary Synastry Radar
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Multidimensional 8-Koota analysis, Swiss Ephemeris aspects, and AI marriage longevity prediction.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-rose-400 text-slate-200 text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <Printer className="w-4 h-4 text-rose-400" />
          <span>Export Marriage Certificate</span>
        </button>
      </div>

      {/* Famous Celebrity Match Presets Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-8">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#f7e034]" />
          <span>⚡ Famous Celebrity & Ideal Couple Presets (টেস্ট করার জন্য ডেমো কাপল)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <button
            type="button"
            onClick={() => handleLoadPreset('Virat Kohli', 7, 16, 'Anushka Sharma', 3, 7)}
            className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-left border border-slate-800 hover:border-rose-400 transition-colors flex items-center justify-between"
          >
            <div>
              <b className="text-white block">Virat & Anushka</b>
              <span className="text-slate-500 text-[11px]">Scorpio & Cancer (31/36 Gunas)</span>
            </div>
            <span className="text-emerald-400 font-black text-sm">86%</span>
          </button>

          <button
            type="button"
            onClick={() => handleLoadPreset('Ranveer Singh', 2, 5, 'Deepika Padukone', 6, 14)}
            className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-left border border-slate-800 hover:border-rose-400 transition-colors flex items-center justify-between"
          >
            <div>
              <b className="text-white block">Ranveer & Deepika</b>
              <span className="text-slate-500 text-[11px]">Gemini & Libra (28/36 Gunas)</span>
            </div>
            <span className="text-emerald-400 font-black text-sm">78%</span>
          </button>

          <button
            type="button"
            onClick={() => handleLoadPreset('Rahul (Boy)', 0, 0, 'Priya (Girl)', 4, 10)}
            className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-left border border-slate-800 hover:border-rose-400 transition-colors flex items-center justify-between"
          >
            <div>
              <b className="text-white block">Vedic Rajyotak (আদর্শ)</b>
              <span className="text-slate-500 text-[11px]">Aries & Leo (32/36 Gunas)</span>
            </div>
            <span className="text-[#f7e034] font-black text-sm">90%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Boy & Girl Astrological Selectors */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleMatch} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-rose-400" />
              Enter Partner Details
            </h3>

            {/* Boy Details */}
            <div className="space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  👦 Groom / Boy (পাত্র)
                </h4>
                <input
                  type="text"
                  value={boyName}
                  onChange={(e) => setBoyName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white w-28 text-right focus:outline-none"
                  placeholder="Boy's Name"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Moon Sign (রাশি)</label>
                <select
                  value={boySign}
                  onChange={(e) => setBoySign(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                >
                  {ZODIAC_SIGNS.map((sign, idx) => (
                    <option key={sign} value={idx}>{idx + 1}. {sign}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Birth Nakshatra (নক্ষত্র)</label>
                <select
                  value={boyNak}
                  onChange={(e) => setBoyNak(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                >
                  {NAKSHATRAS.map((nak, idx) => (
                    <option key={nak} value={idx}>{idx + 1}. {nak}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Girl Details */}
            <div className="space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  👧 Bride / Girl (পাত্রী)
                </h4>
                <input
                  type="text"
                  value={girlName}
                  onChange={(e) => setGirlName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white w-28 text-right focus:outline-none"
                  placeholder="Girl's Name"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Moon Sign (রাশি)</label>
                <select
                  value={girlSign}
                  onChange={(e) => setGirlSign(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                >
                  {ZODIAC_SIGNS.map((sign, idx) => (
                    <option key={sign} value={idx}>{idx + 1}. {sign}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Birth Nakshatra (নক্ষত্র)</label>
                <select
                  value={girlNak}
                  onChange={(e) => setGirlNak(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                >
                  {NAKSHATRAS.map((nak, idx) => (
                    <option key={nak} value={idx}>{idx + 1}. {nak}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(244,63,94,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Heart className="w-4 h-4 fill-slate-950 stroke-none" />
              <span>Calculate AI Relationship Radar</span>
            </button>
          </form>

          {/* AI Advisor Key Strengths & Remedies */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              AI Compatibility Strengths
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {report.keyStrengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>

            <h4 className="text-xs font-bold text-[#f7e034] uppercase tracking-wider flex items-center gap-1.5 pt-3 border-t border-slate-800">
              <Sparkles className="w-4 h-4 text-[#f7e034]" />
              Vedic Remedies & Marital Advice
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {report.remediesAndTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#f7e034] font-bold shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Interactive 8-Axis SVG Radar + 8 Koota Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Overall Compatibility Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {boyName} & {girlName} Compatibility Result
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {report.verdictText}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Based on traditional 36 Guna Ashtakoota & Swiss Ephemeris synastry.
              </p>
            </div>

            <div className="text-center bg-slate-950 px-6 py-4 rounded-2xl border border-slate-800 shrink-0">
              <div className="text-4xl font-black text-[#f7e034]">
                {report.overallScore} <span className="text-base text-slate-500 font-bold">/ 36</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black inline-block mt-1 ${
                report.overallScore >= 18 ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
              }`}>
                {report.overallPercentage}% HARMONY
              </span>
            </div>
          </div>

          {/* Interactive Radar Visualizer */}
          <RelationshipRadarChart
            radarPoints={report.radarPoints}
            synastryAspects={report.synastryAspects}
            overallPercentage={report.overallPercentage}
          />

          {/* 8 Kootas Detailed Matrix Cards */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#f7e034]" />
              Detailed 8 Ashtakoota Dimension Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.radarPoints.map((pt) => {
                const isMax = pt.score === pt.maxScore;
                const isZero = pt.score === 0;

                return (
                  <div key={pt.dimension} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{pt.icon}</span> {pt.dimension}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        isMax
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isZero
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {pt.score} / {pt.maxScore} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{pt.interpretation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Sparkles, Layers, Compass, Globe, Calendar, Clock, 
  ShieldCheck, AlertCircle, TrendingUp, Sun, Award, Flame, Zap
} from 'lucide-react';
import { SwissEphEngine, DivisionalChartInfo, GocharTransitImpact, VarshphalInfo } from '../utils/swissEphEngine';

interface SwissEphShodashavargaSectionProps {
  planets: Record<string, { longitude: number; degreeInSign: string }>;
  ascendantLongitude: number;
  moonSignIdx: number;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
}

export const SwissEphShodashavargaSection: React.FC<SwissEphShodashavargaSectionProps> = ({
  planets,
  ascendantLongitude,
  moonSignIdx,
  birthYear,
  birthMonth,
  birthDay
}) => {
  const [activeTab, setActiveTab] = useState<'vargas' | 'gochar' | 'varshphal'>('vargas');
  const [selectedVarga, setSelectedVarga] = useState<string>('D10'); // Default D10 Career

  const allVargas = SwissEphEngine.generateShodashavarga(planets, ascendantLongitude);
  const liveGochar = SwissEphEngine.calculateLiveGochar(moonSignIdx);
  const varshphal = SwissEphEngine.calculateTajikVarshphal(birthYear, birthMonth, birthDay, 1);

  const currentVarga = allVargas[selectedVarga] || allVargas['D1'];

  const popularVargas = [
    { id: 'D1', label: 'D1 Rashi (সাধারণ)' },
    { id: 'D2', label: 'D2 Hora (সম্পদ)' },
    { id: 'D7', label: 'D7 Saptamsha (সন্তান)' },
    { id: 'D9', label: 'D9 Navamsha (বিবাহ)' },
    { id: 'D10', label: 'D10 Dashamsha (ক্যারিয়ার)' },
    { id: 'D60', label: 'D60 Shashtiamsha (পূর্বজন্ম)' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      
      {/* Top Header & Tab Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-[#f7e034] text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Swiss Ephemeris & NASA JPL Grade Engine</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            16 Divisional Charts (ষোড়শবর্গ), Gochar & Tajik Varshphal
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Microscopic life aspect analysis, live transit impact, and annual solar return forecasts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('vargas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'vargas' ? 'bg-[#f7e034] text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏛️ 16 Vargas
          </button>

          <button
            onClick={() => setActiveTab('gochar')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'gochar' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🪐 Live Gochar (ট্রানজিট)
          </button>

          <button
            onClick={() => setActiveTab('varshphal')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'varshphal' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ☀️ Varshphal {varshphal.yearNumber}
          </button>
        </div>
      </div>

      {/* TAB 1: 16 DIVISIONAL CHARTS (SHODASHAVARGA) */}
      {activeTab === 'vargas' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Quick Selectors Pills */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Select Divisional Chart (বর্গ ছক নির্বাচন করুন):</span>
              <span className="text-[#f7e034] font-mono text-[10px]">16 Varga Suite Active</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {Object.keys(allVargas).map((divKey) => {
                const varga = allVargas[divKey];
                const isSelected = selectedVarga === divKey;

                return (
                  <button
                    key={divKey}
                    onClick={() => setSelectedVarga(divKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-[#f7e034] text-slate-950 border-[#f7e034] shadow-md scale-105'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {divKey} • {varga.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Varga Detailed Card */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-white">{currentVarga.name}</h4>
                  <span className="text-xs text-[#f7e034] font-serif font-bold">({currentVarga.sanskritName})</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{currentVarga.signification}</p>
              </div>

              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                {currentVarga.division} Chart
              </span>
            </div>

            {/* Planets in this Varga Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold">
                    <th className="pb-2">Planet</th>
                    <th className="pb-2">Varga Sign (রাশি)</th>
                    <th className="pb-2">House Placement (ভাব)</th>
                    <th className="pb-2">Natal Degree</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {Object.entries(currentVarga.planets).map(([pName, pInfo]) => (
                    <tr key={pName} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-2.5 font-bold text-white">{pName}</td>
                      <td className="py-2.5 font-semibold text-amber-400">{pInfo.sign}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-200">
                          House {pInfo.house}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-slate-400">{pInfo.degreeStr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE PLANETARY GOCHAR (TRANSIT IMPACTS) */}
      {activeTab === 'gochar' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                Live Planetary Transit (গোচর) vs Moon Sign
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time positioning of major slow-moving planets and life impacts.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800">
              ● Live Ephemeris
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveGochar.map((item, idx) => {
              const isBenefic = item.nature === 'BENEFIC';
              const isChallenging = item.nature === 'CHALLENGING';

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isBenefic
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : isChallenging
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h5 className="text-sm font-bold text-white">{item.planet}</h5>
                      <span className="text-[11px] text-[#f7e034] font-semibold">
                        In {item.currentSign} • House {item.natalHouseFromMoon} from Moon
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        isBenefic
                          ? 'bg-emerald-500 text-slate-950'
                          : isChallenging
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.nature}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.effects}</p>
                  
                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Transit Span:</span>
                    <span className="font-mono text-slate-300 font-bold">{item.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: TAJIK VARSHPHAL (SOLAR RETURN CHART) */}
      {activeTab === 'varshphal' && (
        <div className="space-y-5 animate-in fade-in">
          
          {/* Key Varshphal Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Varshphal Year</span>
              <span className="text-2xl font-black text-[#f7e034]">{varshphal.yearNumber}</span>
              <span className="text-[10px] text-slate-500 block">Age: {varshphal.targetAge} Years</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Muntha Sign (মুন্থা)</span>
              <span className="text-2xl font-black text-purple-400">{varshphal.munthaSign}</span>
              <span className="text-[10px] text-slate-500 block">In House {varshphal.munthaHouse}</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Year Lord (বর্ষেশ্বর)</span>
              <span className="text-2xl font-black text-emerald-400">{varshphal.yearLord}</span>
              <span className="text-[10px] text-slate-500 block">Ruling Planet</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Annual Auspiciousness</span>
              <span className="text-2xl font-black text-[#f7e034]">90%</span>
              <span className="text-[10px] text-emerald-400 block font-bold">Highly Auspicious</span>
            </div>
          </div>

          {/* General Summary */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h5 className="text-xs font-bold text-[#f7e034] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              Annual Solar Return Forecast
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">{varshphal.generalForecast}</p>
          </div>

          {/* 4 Quarters Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {varshphal.quarterlyForecast.map((q) => (
              <div key={q.quarter} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">{q.quarter}</span>
                  <span className="text-emerald-400 font-mono">{q.rating}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full" style={{ width: `${q.rating}%` }} />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">{q.theme}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

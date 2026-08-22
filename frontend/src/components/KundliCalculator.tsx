import React, { useState } from 'react';
import { Compass, Calendar, Clock, MapPin, Sparkles, User, AlertTriangle, CheckCircle2, ShieldCheck, Sun, Moon } from 'lucide-react';
import { calculateKundliClient, calculateDailyPanchang } from '../utils/astrology';
import { KundliChartSVG } from './KundliChartSVG';

export const KundliCalculator: React.FC = () => {
  const [name, setName] = useState('Rahul Sharma');
  const [dob, setDob] = useState('1998-05-15');
  const [tob, setTob] = useState('14:30');
  const [place, setPlace] = useState('New Delhi, India');
  const [lat, setLat] = useState('28.6139');
  const [lon, setLon] = useState('77.2090');
  const [activeChartType, setActiveChartType] = useState<'D1' | 'D9'>('D1');

  const [kundliResult, setKundliResult] = useState(() => {
    return calculateKundliClient(1998, 5, 15, 14, 30, 28.6139, 77.209, 'New Delhi, India');
  });

  const panchang = calculateDailyPanchang();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const [yearStr, monthStr, dayStr] = dob.split('-');
    const [hourStr, minStr] = tob.split(':');

    const result = calculateKundliClient(
      parseInt(yearStr, 10),
      parseInt(monthStr, 10),
      parseInt(dayStr, 10),
      parseInt(hourStr, 10),
      parseInt(minStr, 10),
      parseFloat(lat) || 28.6139,
      parseFloat(lon) || 77.209,
      place
    );
    setKundliResult(result);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Panchang Live Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2.5 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Sun className="w-4 h-4" />
            <span>Today's Daily Vedic Panchang (আজকের পঞ্জিকা)</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">{panchang.vara}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-3 text-xs">
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block">Tithi (তিথি)</span>
            <span className="font-bold text-slate-200">{panchang.tithi}</span>
          </div>
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block">Nakshatra (নক্ষত্র)</span>
            <span className="font-bold text-amber-400">{panchang.nakshatra}</span>
          </div>
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block">Yoga & Karana</span>
            <span className="font-bold text-slate-300">{panchang.yoga}</span>
          </div>
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-emerald-400 block font-semibold">Abhijit Muhurat (শুভ)</span>
            <span className="font-bold text-emerald-300">{panchang.abhijitMuhurat}</span>
          </div>
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-rose-400 block font-semibold">Rahu Kaalam (রাহু কাল)</span>
            <span className="font-bold text-rose-300">{panchang.rahuKaal}</span>
          </div>
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block">Sun Rise / Set</span>
            <span className="font-bold text-slate-300">{panchang.sunRise} / {panchang.sunSet}</span>
          </div>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Vedic Ephemeris & Dasha Calculation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">Free Complete Janam Kundli & Dosha Analysis</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Accurate Lagna chart (D1), Navamsha (D9), Vimshottari Mahadasha periods, and Manglik/Sade Sati check.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Enter Birth Details
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" /> Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="Enter full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Time of Birth
                </label>
                <input
                  type="time"
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Birth Place
              </label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="e.g. New Delhi, Dhaka, Kolkata"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 transition-all mt-2"
            >
              Calculate Kundli & Dasha
            </button>
          </form>

          {/* Dosha Status Overview */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Dosha & Sade Sati Check</h4>
            
            {/* Manglik Badge */}
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              kundliResult.doshas.isManglik 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}>
              {kundliResult.doshas.isManglik ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <span className="font-bold block">
                  {kundliResult.doshas.isManglik ? `Mangal Dosha Detected (${kundliResult.doshas.manglikPercentage}%)` : 'No Mangal Dosha (Non-Manglik)'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {kundliResult.doshas.cancellationReasons[0] || kundliResult.doshas.factors[0] || 'Mars in neutral placement.'}
                </span>
              </div>
            </div>

            {/* Sade Sati Badge */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Shani Sade Sati:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  kundliResult.doshas.sadeSati.isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {kundliResult.doshas.sadeSati.phase}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{kundliResult.doshas.sadeSati.description}</p>
            </div>
          </div>
        </div>

        {/* Right Charts & Dasha Summary */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Ascendant (Lagna)</span>
              <span className="text-sm font-black text-amber-400">{kundliResult.ascendant.sign}</span>
              <span className="text-[10px] text-slate-500 block">{kundliResult.ascendant.degree}°</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Moon Sign (Rashi)</span>
              <span className="text-sm font-black text-amber-400">{kundliResult.moonSign}</span>
              <span className="text-[10px] text-slate-500 block">Chandra Rashi</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Nakshatra</span>
              <span className="text-sm font-black text-amber-400">{kundliResult.nakshatra}</span>
              <span className="text-[10px] text-slate-500 block">Pada {kundliResult.pada}</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Lahiri Ayanamsha</span>
              <span className="text-sm font-black text-amber-400">{kundliResult.ayanamsa}°</span>
              <span className="text-[10px] text-slate-500 block">Vedic Sidereal</span>
            </div>
          </div>

          {/* Kundli SVG Visualization & Chart Type Switcher */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">
                Vedic Birth Chart ({activeChartType === 'D1' ? 'D1 Rashi Lagna' : 'D9 Navamsha Chart'})
              </h3>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveChartType('D1')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeChartType === 'D1' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  D1 Lagna
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartType('D9')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeChartType === 'D9' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  D9 Navamsha
                </button>
              </div>
            </div>

            <KundliChartSVG kundli={kundliResult} />
          </div>

          {/* Vimshottari Mahadasha Timeline */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Vimshottari Dasha Periods (120 Years Cycle)
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {kundliResult.dashas.map((dasha) => (
                <div
                  key={dasha.lord}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    dasha.isActive
                      ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <span className={`text-xs font-black block ${dasha.isActive ? 'text-amber-400' : 'text-slate-200'}`}>
                    {dasha.lord}
                  </span>
                  <span className="text-[10px] block mt-0.5">{dasha.startDate} - {dasha.endDate}</span>
                  {dasha.isActive && (
                    <span className="inline-block mt-1 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Planetary Degrees Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 overflow-x-auto">
            <h3 className="text-sm font-bold text-white mb-3">Planetary Degrees & Navamsha (D9) Signs</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-2">Planet</th>
                  <th className="pb-2">Rashi (D1)</th>
                  <th className="pb-2">Degree</th>
                  <th className="pb-2">Nakshatra</th>
                  <th className="pb-2">Navamsha (D9)</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {Object.entries(kundliResult.planets).map(([planet, details]) => (
                  <tr key={planet} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 font-bold text-white">{planet}</td>
                    <td className="py-2.5 text-amber-300">{details.sign}</td>
                    <td className="py-2.5 font-mono">{details.degreeInSign}</td>
                    <td className="py-2.5">{details.nakshatra}</td>
                    <td className="py-2.5 text-purple-300 font-semibold">{kundliResult.navamsha[planet] || details.sign}</td>
                    <td className="py-2.5">
                      {details.isRetrograde ? (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">Retrograde</span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-bold">Direct</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

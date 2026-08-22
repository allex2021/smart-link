import React, { useState } from 'react';
import { Compass, Calendar, Clock, MapPin, Sparkles, User } from 'lucide-react';
import { calculateKundliClient } from '../utils/astrology';
import { KundliData } from '../types';
import { KundliChartSVG } from './KundliChartSVG';

export const KundliCalculator: React.FC = () => {
  const [name, setName] = useState('Rahul Sharma');
  const [dob, setDob] = useState('1998-05-15');
  const [tob, setTob] = useState('14:30');
  const [place, setPlace] = useState('New Delhi, India');
  const [lat, setLat] = useState('28.6139');
  const [lon, setLon] = useState('77.2090');

  const [kundliResult, setKundliResult] = useState<KundliData>(() => {
    return calculateKundliClient(1998, 5, 15, 14, 30, 28.6139, 77.209, 'New Delhi, India');
  });

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
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Vedic Ephemeris Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">Free Online Kundli (Janam Patrika)</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Generate accurate birth chart, planetary degrees, Lagna chart, and Nakshatra placements based on ancient Sidereal calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
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
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
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
                placeholder="e.g. New Delhi, Mumbai, Kolkata"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Latitude</label>
                <input
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Longitude</label>
                <input
                  type="text"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 transition-all mt-2"
            >
              Generate Kundli Chart
            </button>
          </form>
        </div>

        {/* Right Chart & Planetary Summary */}
        <div className="lg:col-span-7 space-y-6">
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

          {/* Kundli SVG Visualization */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white text-center mb-4">
              North-Indian Vedic Birth Chart (D1 Lagna Kundli)
            </h3>
            <KundliChartSVG kundli={kundliResult} />
          </div>

          {/* Planetary Degrees Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 overflow-x-auto">
            <h3 className="text-sm font-bold text-white mb-3">Planetary Degrees & Nakshatra Placements</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-2">Planet</th>
                  <th className="pb-2">Sign (Rashi)</th>
                  <th className="pb-2">Degree</th>
                  <th className="pb-2">Nakshatra</th>
                  <th className="pb-2">Motion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {Object.entries(kundliResult.planets).map(([planet, details]) => (
                  <tr key={planet} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 font-bold text-white">{planet}</td>
                    <td className="py-2.5 text-amber-300">{details.sign}</td>
                    <td className="py-2.5 font-mono">{details.degreeInSign}</td>
                    <td className="py-2.5">{details.nakshatra}</td>
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

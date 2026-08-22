import React, { useState } from 'react';
import { Compass, Calendar, Clock, MapPin, Sparkles, User, AlertTriangle, CheckCircle2, Sun, Award, BarChart3, Hash, ShieldCheck, Flame } from 'lucide-react';
import { calculateKundliClient, calculateDailyPanchang } from '../utils/astrology';
import { VedAstroEngine, VedicYoga, AshtakavargaScore, NumerologyReport } from '../utils/vedAstroEngine';
import { KundliChartSVG } from './KundliChartSVG';

export const KundliCalculator: React.FC = () => {
  const [name, setName] = useState('Rahul Sharma');
  const [dob, setDob] = useState('1998-05-15');
  const [tob, setTob] = useState('14:30');
  const [place, setPlace] = useState('New Delhi, India');
  const [lat, setLat] = useState('28.6139');
  const [lon, setLon] = useState('77.2090');
  const [activeChartType, setActiveChartType] = useState<'D1' | 'D9'>('D1');
  const [selectedSubTab, setSelectedSubTab] = useState<'chart' | 'yogas' | 'ashtakavarga' | 'numerology'>('chart');

  const [kundliResult, setKundliResult] = useState(() => {
    return calculateKundliClient(1998, 5, 15, 14, 30, 28.6139, 77.209, 'New Delhi, India');
  });

  const [yogas, setYogas] = useState<VedicYoga[]>(() => {
    const initial = calculateKundliClient(1998, 5, 15, 14, 30, 28.6139, 77.209, 'New Delhi, India');
    return VedAstroEngine.detectYogas(initial.planets, initial.ascendant.sign ? 1 : 1);
  });

  const [ashtakavarga, setAshtakavarga] = useState<AshtakavargaScore[]>(() => {
    return VedAstroEngine.calculateAshtakavarga(9, 1);
  });

  const [numerology, setNumerology] = useState<NumerologyReport>(() => {
    return VedAstroEngine.calculateNumerology(15, 5, 1998, 'Rahul Sharma');
  });

  const panchang = calculateDailyPanchang();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const [yearStr, monthStr, dayStr] = dob.split('-');
    const [hourStr, minStr] = tob.split(':');

    const yearNum = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);
    const dayNum = parseInt(dayStr, 10);

    const result = calculateKundliClient(
      yearNum,
      monthNum,
      dayNum,
      parseInt(hourStr, 10),
      parseInt(minStr, 10),
      parseFloat(lat) || 28.6139,
      parseFloat(lon) || 77.209,
      place
    );
    setKundliResult(result);

    const detected = VedAstroEngine.detectYogas(result.planets, result.ascendant.degree ? 1 : 1);
    setYogas(detected);

    const av = VedAstroEngine.calculateAshtakavarga(1, 1);
    setAshtakavarga(av);

    const num = VedAstroEngine.calculateNumerology(dayNum, monthNum, yearNum, name);
    setNumerology(num);
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
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by VedAstro Vedic Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">Advanced Kundli, 1000+ Yogas & Numerology</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Complete planetary calculation with Rajyoga detection, Ashtakavarga strength score, and Chaldean lucky numbers.
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
              Analyze Full Kundli & Yogas
            </button>
          </form>

          {/* Dosha Status Overview */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Dosha & Sade Sati Status</h4>
            
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
                  {kundliResult.doshas.cancellationReasons[0] || kundliResult.doshas.factors[0] || 'Mars in neutral house.'}
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

        {/* Right Tabbed Results Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setSelectedSubTab('chart')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubTab === 'chart'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" /> Kundli & Dasha
            </button>

            <button
              onClick={() => setSelectedSubTab('yogas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubTab === 'yogas'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" /> 1000+ Vedic Yogas ({yogas.filter((y) => y.isFormed).length} Active)
            </button>

            <button
              onClick={() => setSelectedSubTab('ashtakavarga')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubTab === 'ashtakavarga'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Ashtakavarga Matrix
            </button>

            <button
              onClick={() => setSelectedSubTab('numerology')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubTab === 'numerology'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Hash className="w-4 h-4" /> Chaldean Numerology
            </button>
          </div>

          {/* TAB 1: KUNDLI CHART & DASHA */}
          {selectedSubTab === 'chart' && (
            <div className="space-y-6 animate-in fade-in">
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

              {/* Chart SVG */}
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
            </div>
          )}

          {/* TAB 2: 1000+ VEDIC YOGAS */}
          {selectedSubTab === 'yogas' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    Vedic Planetary Yogas (রাজযোগ ও গ্রহ সমাহার)
                  </h3>
                  <p className="text-xs text-slate-400">Classical Parashara & VedAstro combinations formed in your chart</p>
                </div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold">
                  {yogas.filter((y) => y.isFormed).length} Auspicious Yogas Found
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {yogas.map((yoga, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      yoga.isFormed
                        ? yoga.type === 'DOSHA'
                          ? 'bg-rose-950/20 border-rose-800/50'
                          : 'bg-slate-900 border-amber-500/30 hover:border-amber-400'
                        : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{yoga.name}</h4>
                        <span className="text-[11px] font-serif text-amber-400">{yoga.sanskritName}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        yoga.isFormed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {yoga.isFormed ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{yoga.description}</p>
                    
                    {yoga.isFormed && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Impact:</span>
                        <p className="text-xs text-slate-400">{yoga.positiveImpact}</p>
                        {yoga.remedy && (
                          <div className="mt-2 p-2 bg-rose-500/10 rounded-lg text-[11px] text-rose-300 border border-rose-500/20">
                            <b>প্রতিকার (Remedy):</b> {yoga.remedy}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ASHTAKAVARGA SCORE */}
          {selectedSubTab === 'ashtakavarga' && (
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4 animate-in fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  Sarvashtakavarga Strength Matrix (337 Total Points)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Identifies which signs have the maximum planetary benefic points (28+ points are highly auspicious).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ashtakavarga.map((item) => (
                  <div key={item.sign} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{item.sign}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        item.strength === 'EXCELLENT'
                          ? 'bg-amber-500 text-slate-950'
                          : item.strength === 'STRONG'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.strength}
                      </span>
                    </div>
                    <div className="text-xl font-black text-amber-400">{item.totalPoints} pts</div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{item.recommendedActions}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CHALDEAN NUMEROLOGY */}
          {selectedSubTab === 'numerology' && (
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-5 animate-in fade-in">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Hash className="w-4 h-4 text-purple-400" />
                    Chaldean & Vedic Numerology Report
                  </h3>
                  <p className="text-xs text-slate-400">Derived from your Birth Date & Name Vibration</p>
                </div>
                <span className="text-xs font-bold text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800">
                  Ruling Planet: {numerology.rulingPlanet}
                </span>
              </div>

              {/* Number Badges */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Radical / Moolank</span>
                  <span className="text-3xl font-black text-amber-400">{numerology.radicalNumber}</span>
                  <span className="text-[10px] text-slate-500 block">Day of Birth</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Destiny / Bhagyank</span>
                  <span className="text-3xl font-black text-purple-400">{numerology.destinyNumber}</span>
                  <span className="text-[10px] text-slate-500 block">Life Path Number</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Name Number</span>
                  <span className="text-3xl font-black text-sky-400">{numerology.nameNumber}</span>
                  <span className="text-[10px] text-slate-500 block">Chaldean Value</span>
                </div>
              </div>

              {/* Lucky Elements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 font-semibold block">🌟 Lucky Gemstone:</span>
                  <span className="font-bold text-amber-300 text-sm">{numerology.luckyGemstone}</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 font-semibold block">🎨 Lucky Colors:</span>
                  <span className="font-bold text-emerald-300">{numerology.luckyColors.join(', ')}</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 font-semibold block">📅 Lucky Days:</span>
                  <span className="font-bold text-sky-300">{numerology.luckyDays.join(', ')}</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 font-semibold block">💼 Career Incline:</span>
                  <span className="font-bold text-slate-200">{numerology.careerSuggestions.join(', ')}</span>
                </div>
              </div>

              <div className="p-4 bg-purple-950/20 border border-purple-800/40 rounded-xl text-xs text-purple-200 leading-relaxed">
                <b>Life Path Assessment:</b> {numerology.lifePathDescription}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

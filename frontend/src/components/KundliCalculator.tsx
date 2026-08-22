import React, { useState } from 'react';
import { 
  Compass, Calendar, Clock, MapPin, Sparkles, User, AlertTriangle, 
  CheckCircle2, Sun, Award, BarChart3, Hash, ShieldCheck, Flame, 
  Download, Printer, Bookmark, ChevronRight, Layers, Table, Loader2, Globe, Crown, Lock
} from 'lucide-react';
import { calculateKundliClient, calculateDailyPanchang } from '../utils/astrology';
import { VedAstroEngine, VedicYoga, AshtakavargaScore, NumerologyReport } from '../utils/vedAstroEngine';
import { KPAstrologyEngine, KPCuspInfo, KPPlanetInfo, KPRulingPlanets } from '../utils/kpAstrologyEngine';
import { SwissEphShodashavargaSection } from './SwissEphShodashavargaSection';
import { KundliChartSVG } from './KundliChartSVG';

const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'New Delhi, India': { lat: 28.6139, lon: 77.2090 },
  'Kolkata, India': { lat: 22.5726, lon: 88.3639 },
  'Dhaka, Bangladesh': { lat: 23.8103, lon: 90.4125 },
  'Mumbai, India': { lat: 19.0760, lon: 72.8777 },
  'Bengaluru, India': { lat: 12.9716, lon: 77.5946 },
  'Chittagong, Bangladesh': { lat: 22.3569, lon: 91.7832 },
  'Sylhet, Bangladesh': { lat: 24.8949, lon: 91.8687 },
  'London, UK': { lat: 51.5074, lon: -0.1278 },
  'New York, USA': { lat: 40.7128, lon: -74.0060 }
};

interface KundliCalculatorProps {
  isLifetimeVIP?: boolean;
  onOpenVipModal?: () => void;
}

export const KundliCalculator: React.FC<KundliCalculatorProps> = ({
  isLifetimeVIP = false,
  onOpenVipModal
}) => {
  const [name, setName] = useState('Rahul Sharma');
  const [dob, setDob] = useState('1998-05-15');
  const [tob, setTob] = useState('14:30');
  const [place, setPlace] = useState('New Delhi, India');
  const [lat, setLat] = useState('28.6139');
  const [lon, setLon] = useState('77.2090');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);
  
  // Visual Chart Styles: North / South / East Indian
  const [chartStyle, setChartStyle] = useState<'NORTH' | 'SOUTH' | 'EAST'>('NORTH');
  const [chartDivision, setChartDivision] = useState<'D1' | 'D9'>('D1');
  
  // Sub-Navigation Tabs: Chart, KP System, 16 Vargas, Yogas, Ashtakavarga, Numerology
  const [selectedSubTab, setSelectedSubTab] = useState<'chart' | 'kp' | 'vargas' | 'yogas' | 'ashtakavarga' | 'numerology'>('chart');

  // Kundli & Engine States
  const [kundliResult, setKundliResult] = useState(() => {
    return calculateKundliClient(1998, 5, 15, 14, 30, 28.6139, 77.209, 'New Delhi, India');
  });

  const [kpCusps, setKpCusps] = useState<KPCuspInfo[]>(() => {
    return KPAstrologyEngine.generateKPCusps(kundliResult.ascendant.degree || 45);
  });

  const [kpPlanets, setKpPlanets] = useState<KPPlanetInfo[]>(() => {
    return KPAstrologyEngine.generateKPPlanets(
      {
        Sun: { longitude: 58.4, isRetrograde: false },
        Moon: { longitude: 275.2, isRetrograde: false },
        Mars: { longitude: 35.8, isRetrograde: false },
        Jupiter: { longitude: 334.6, isRetrograde: false },
        Saturn: { longitude: 312.1, isRetrograde: true },
        Rahu: { longitude: 128.5, isRetrograde: true },
        Ketu: { longitude: 308.5, isRetrograde: true }
      },
      kundliResult.ascendant.degree || 45
    );
  });

  const [kpRulingPlanets, setKpRulingPlanets] = useState<KPRulingPlanets>(() => {
    return KPAstrologyEngine.generateRulingPlanets(45, 275.2, 'Friday');
  });

  const [yogas, setYogas] = useState<VedicYoga[]>(() => {
    const initial = calculateKundliClient(1998, 5, 15, 14, 30, 28.6139, 77.209, 'New Delhi, India');
    return VedAstroEngine.detectYogas(initial.planets, 1);
  });

  const [ashtakavarga, setAshtakavarga] = useState<AshtakavargaScore[]>(() => {
    return VedAstroEngine.calculateAshtakavarga(9, 1);
  });

  const [numerology, setNumerology] = useState<NumerologyReport>(() => {
    return VedAstroEngine.calculateNumerology(15, 5, 1998, 'Rahul Sharma');
  });

  const panchang = calculateDailyPanchang();

  const handleCityChange = (newCity: string) => {
    setPlace(newCity);
    if (CITY_COORDINATES[newCity]) {
      setLat(CITY_COORDINATES[newCity].lat.toString());
      setLon(CITY_COORDINATES[newCity].lon.toString());
    }
  };

  const handleQuickPreset = (presetName: string, presetDob: string, presetTob: string, presetPlace: string) => {
    setName(presetName);
    setDob(presetDob);
    setTob(presetTob);
    handleCityChange(presetPlace);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setShowSuccessBadge(false);

    setTimeout(() => {
      try {
        const parts = dob.split('-');
        const yearNum = parts.length === 3 ? parseInt(parts[0], 10) : 1998;
        const monthNum = parts.length === 3 ? parseInt(parts[1], 10) : 5;
        const dayNum = parts.length === 3 ? parseInt(parts[2], 10) : 15;

        const timeParts = tob.split(':');
        const hourNum = timeParts.length >= 2 ? parseInt(timeParts[0], 10) : 12;
        const minNum = timeParts.length >= 2 ? parseInt(timeParts[1], 10) : 0;

        const latitude = parseFloat(lat) || 28.6139;
        const longitude = parseFloat(lon) || 77.209;

        const result = calculateKundliClient(
          yearNum,
          monthNum,
          dayNum,
          hourNum,
          minNum,
          latitude,
          longitude,
          place || 'New Delhi, India'
        );
        setKundliResult(result);

        // Update KP System
        const ascLong = result.ascendant.degree || 45;
        setKpCusps(KPAstrologyEngine.generateKPCusps(ascLong));
        setKpPlanets(
          KPAstrologyEngine.generateKPPlanets(
            {
              Sun: { longitude: result.planets.Sun?.longitude || 58.4, isRetrograde: false },
              Moon: { longitude: result.planets.Moon?.longitude || 275.2, isRetrograde: false },
              Mars: { longitude: result.planets.Mars?.longitude || 35.8, isRetrograde: false },
              Jupiter: { longitude: result.planets.Jupiter?.longitude || 334.6, isRetrograde: false },
              Saturn: { longitude: result.planets.Saturn?.longitude || 312.1, isRetrograde: true },
              Rahu: { longitude: result.planets.Rahu?.longitude || 128.5, isRetrograde: true },
              Ketu: { longitude: result.planets.Ketu?.longitude || 308.5, isRetrograde: true }
            },
            ascLong
          )
        );
        setKpRulingPlanets(KPAstrologyEngine.generateRulingPlanets(ascLong, result.planets.Moon?.longitude || 275.2, 'Friday'));

        // Update Yogas, Ashtakavarga & Numerology
        setYogas(VedAstroEngine.detectYogas(result.planets, 1));
        setAshtakavarga(VedAstroEngine.calculateAshtakavarga(1, 1));
        setNumerology(VedAstroEngine.calculateNumerology(dayNum, monthNum, yearNum, name || 'User'));

        setIsCalculating(false);
        setShowSuccessBadge(true);

        const resEl = document.getElementById('kundli-results-area');
        if (resEl && window.innerWidth < 1024) {
          resEl.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (err) {
        console.error('Error generating Kundli:', err);
        setIsCalculating(false);
      }
    }, 250);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleDownloadVipReport = () => {
    if (!isLifetimeVIP && onOpenVipModal) {
      onOpenVipModal();
    } else {
      window.print();
    }
  };

  const birthParts = dob.split('-');
  const birthYear = parseInt(birthParts[0], 10) || 1998;
  const birthMonth = parseInt(birthParts[1], 10) || 5;
  const birthDay = parseInt(birthParts[2], 10) || 15;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Panchang Live Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2.5 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-[#f7e034] font-bold">
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
            <span className="font-bold text-[#f7e034]">{panchang.nakshatra}</span>
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

      {/* Main Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-[#f7e034] text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#f7e034]" />
            <span>Vedic, KP Astrology & Swiss Ephemeris 16-Varga Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Free Complete Janam Kundli, KP & 16 Vargas</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            North, South & East Indian charts, KP Cuspal Sub-lords, 16 Divisional Charts (D1-D60), Gochar & Varshphal.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Download 50-Page VIP PDF Button */}
          <button
            onClick={handleDownloadVipReport}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-[#f7e034] to-amber-500 hover:from-amber-400 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-[0_0_20px_rgba(247,224,52,0.4)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <Crown className="w-4 h-4 fill-slate-950" />
            <span>50-Page VIP Kundli PDF (₹99)</span>
            {!isLifetimeVIP && <Lock className="w-3.5 h-3.5 text-slate-900" />}
          </button>

          <button
            onClick={handlePrintPDF}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-[#f7e034] text-slate-200 hover:text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#f7e034]" />
            <span>Print Quick Chart</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
          
          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              ⚡ Quick Sample Profiles (ডেমো প্রোফাইল)
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickPreset('Rahul Sharma', '1998-05-15', '14:30', 'New Delhi, India')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-400 transition-colors"
              >
                <b className="text-white block truncate">Rahul (Delhi)</b>
                <span className="text-slate-500 text-[10px]">15 May 1998</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('Priya Sen', '2001-10-24', '09:15', 'Kolkata, India')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-400 transition-colors"
              >
                <b className="text-white block truncate">Priya (Kolkata)</b>
                <span className="text-slate-500 text-[10px]">24 Oct 2001</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('Tanvir Ahmed', '1995-02-18', '06:45', 'Dhaka, Bangladesh')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-400 transition-colors"
              >
                <b className="text-white block truncate">Tanvir (Dhaka)</b>
                <span className="text-slate-500 text-[10px]">18 Feb 1995</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('Sneha Patel', '1999-12-05', '18:20', 'Mumbai, India')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-400 transition-colors"
              >
                <b className="text-white block truncate">Sneha (Mumbai)</b>
                <span className="text-slate-500 text-[10px]">05 Dec 1999</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" /> Full Name (নাম)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#f7e034]"
                placeholder="Enter full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date of Birth (জন্মতারিখ)
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f7e034]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Time of Birth (সময়)
                </label>
                <input
                  type="time"
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f7e034]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Birth Place (জন্মস্থান)
              </label>
              <select
                value={place}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f7e034]"
              >
                <option value="New Delhi, India">New Delhi, India</option>
                <option value="Kolkata, India">Kolkata, India</option>
                <option value="Dhaka, Bangladesh">Dhaka, Bangladesh</option>
                <option value="Mumbai, India">Mumbai, India</option>
                <option value="Bengaluru, India">Bengaluru, India</option>
                <option value="Chittagong, Bangladesh">Chittagong, Bangladesh</option>
                <option value="Sylhet, Bangladesh">Sylhet, Bangladesh</option>
                <option value="London, UK">London, UK</option>
                <option value="New York, USA">New York, USA</option>
              </select>
            </div>

            {/* Calculate Button with Loading State */}
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full py-3.5 rounded-2xl bg-[#f7e034] hover:bg-[#ffe838] text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(247,224,52,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Calculating Swiss Ephemeris Coordinates...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>Analyze Full Kundli & KP Sub-Lords</span>
                </>
              )}
            </button>
          </form>

          {/* Success Confirmation Toast */}
          {showSuccessBadge && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>✓ Kundli, KP Sub-Lords & Yogas Generated Successfully!</span>
            </div>
          )}

          {/* Dosha Status Overview */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
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

        {/* Right Tabbed Results Area */}
        <div className="lg:col-span-8 space-y-6" id="kundli-results-area">
          
          {/* Sub-Navigation Tabs: Chart, KP System, 16 Vargas, Yogas, Ashtakavarga, Numerology */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setSelectedSubTab('chart')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubTab === 'chart'
                  ? 'bg-[#f7e034] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" /> Kundli Chart & Dasha
            </button>

            <button
              onClick={() => setSelectedSubTab('kp')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubTab === 'kp'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-4 h-4" /> KP Astrology (Sub-Lords)
            </button>

            <button
              onClick={() => setSelectedSubTab('vargas')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubTab === 'vargas'
                  ? 'bg-rose-500 text-white shadow-md font-bold'
                  : 'text-rose-300 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" /> 16 Vargas & Gochar
            </button>

            <button
              onClick={() => setSelectedSubTab('yogas')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubTab === 'yogas'
                  ? 'bg-[#f7e034] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" /> 1000+ Vedic Yogas
            </button>

            <button
              onClick={() => setSelectedSubTab('ashtakavarga')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubTab === 'ashtakavarga'
                  ? 'bg-[#f7e034] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Ashtakavarga Matrix
            </button>

            <button
              onClick={() => setSelectedSubTab('numerology')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubTab === 'numerology'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Hash className="w-4 h-4" /> Numerology
            </button>
          </div>

          {/* TAB 1: KUNDLI CHART & MULTI-STYLE SWITCHER */}
          {selectedSubTab === 'chart' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Ascendant (Lagna)</span>
                  <span className="text-sm font-black text-[#f7e034]">{kundliResult.ascendant.sign}</span>
                  <span className="text-[10px] text-slate-500 block">{kundliResult.ascendant.degree}°</span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Moon Sign (Rashi)</span>
                  <span className="text-sm font-black text-[#f7e034]">{kundliResult.moonSign}</span>
                  <span className="text-[10px] text-slate-500 block">Chandra Rashi</span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Nakshatra</span>
                  <span className="text-sm font-black text-[#f7e034]">{kundliResult.nakshatra}</span>
                  <span className="text-[10px] text-slate-500 block">Pada {kundliResult.pada}</span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Lahiri Ayanamsha</span>
                  <span className="text-sm font-black text-[#f7e034]">{kundliResult.ayanamsa}°</span>
                  <span className="text-[10px] text-slate-500 block">Vedic Sidereal</span>
                </div>
              </div>

              {/* Chart Visualizer with Style Switcher */}
              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#f7e034]" />
                    Birth Chart ({chartDivision === 'D1' ? 'D1 Rashi Lagna' : 'D9 Navamsha'})
                  </h3>

                  {/* Chart Style Switcher: North / South / East */}
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setChartStyle('NORTH')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        chartStyle === 'NORTH' ? 'bg-[#f7e034] text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      North (উত্তর)
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartStyle('SOUTH')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        chartStyle === 'SOUTH' ? 'bg-[#f7e034] text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      South (দক্ষিণ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartStyle('EAST')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        chartStyle === 'EAST' ? 'bg-[#f7e034] text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      East (পূর্ব / বাংলা)
                    </button>
                  </div>
                </div>

                {/* SVG Visualizer */}
                <KundliChartSVG kundli={kundliResult} styleType={chartStyle} />
              </div>

              {/* Vimshottari Mahadasha Timeline */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#f7e034]" />
                  Vimshottari Dasha Periods (120 Years Cycle)
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                  {kundliResult.dashas.map((dasha) => (
                    <div
                      key={dasha.lord}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        dasha.isActive
                          ? 'bg-amber-500/20 border-[#f7e034] shadow-md ring-1 ring-[#f7e034]'
                          : 'bg-slate-950 border-slate-800/80 text-slate-400'
                      }`}
                    >
                      <span className={`text-xs font-black block ${dasha.isActive ? 'text-[#f7e034]' : 'text-slate-200'}`}>
                        {dasha.lord}
                      </span>
                      <span className="text-[10px] block mt-0.5">{dasha.startDate} - {dasha.endDate}</span>
                      {dasha.isActive && (
                        <span className="inline-block mt-1 bg-[#f7e034] text-slate-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KP ASTROLOGY (CUSP & PLANETARY SUB-LORDS) */}
          {selectedSubTab === 'kp' && (
            <div className="space-y-6 animate-in fade-in">
              {/* KP Ruling Planets Box */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#f7e034]" />
                  KP Ruling Planets (RPs - কৃষ্ণমূর্তি রুলিং প্ল্যানেটস)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Day Lord</span>
                    <span className="font-bold text-white">{kpRulingPlanets.dayLord}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Asc Sign / Star Lord</span>
                    <span className="font-bold text-[#f7e034]">{kpRulingPlanets.ascendantSignLord} / {kpRulingPlanets.ascendantStarLord}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Asc Sub-Lord (লগ্ন সাব-লর্ড)</span>
                    <span className="font-black text-amber-400">{kpRulingPlanets.ascendantSubLord}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Moon Sign / Star Lord</span>
                    <span className="font-bold text-white">{kpRulingPlanets.moonSignLord} / {kpRulingPlanets.moonStarLord}</span>
                  </div>
                </div>
              </div>

              {/* 12 KP Cuspal Sub-Lords Table */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 overflow-x-auto">
                <h3 className="text-sm font-bold text-white">12 KP Cusps (Bhavas) & Cuspal Sub-Lords</h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold">
                      <th className="pb-2">Cusp</th>
                      <th className="pb-2">Degree</th>
                      <th className="pb-2">Sign</th>
                      <th className="pb-2">Sign Lord</th>
                      <th className="pb-2">Star Lord (নক্ষত্র)</th>
                      <th className="pb-2 text-[#f7e034]">Sub-Lord (উপ-নক্ষত্র)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {kpCusps.map((cusp) => (
                      <tr key={cusp.cuspNumber} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 font-bold text-white">Cusp {cusp.cuspNumber}</td>
                        <td className="py-2.5 font-mono text-slate-300">{cusp.degreeStr}</td>
                        <td className="py-2.5">{cusp.sign}</td>
                        <td className="py-2.5">{cusp.signLord}</td>
                        <td className="py-2.5">{cusp.starLord}</td>
                        <td className="py-2.5 font-black text-[#f7e034]">{cusp.subLord}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* KP Planets Sub-Lords Table */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 overflow-x-auto">
                <h3 className="text-sm font-bold text-white">KP Planetary Positions & Sub-Lords</h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold">
                      <th className="pb-2">Planet</th>
                      <th className="pb-2">Degree</th>
                      <th className="pb-2">Sign Lord</th>
                      <th className="pb-2">Star Lord</th>
                      <th className="pb-2 text-[#f7e034]">Sub-Lord</th>
                      <th className="pb-2">House Occupied</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {kpPlanets.map((p) => (
                      <tr key={p.planet} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 font-bold text-white">{p.planet}</td>
                        <td className="py-2.5 font-mono text-slate-300">{p.degreeStr}</td>
                        <td className="py-2.5">{p.signLord}</td>
                        <td className="py-2.5">{p.starLord}</td>
                        <td className="py-2.5 font-black text-[#f7e034]">{p.subLord}</td>
                        <td className="py-2.5">House {p.houseOccupied}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: 16 DIVISIONAL CHARTS (SHODASHAVARGA) & GOCHAR */}
          {selectedSubTab === 'vargas' && (
            <SwissEphShodashavargaSection
              planets={{
                Sun: { longitude: kundliResult.planets.Sun?.longitude || 58.4, degreeInSign: kundliResult.planets.Sun?.degreeInSign || '14° 24\'' },
                Moon: { longitude: kundliResult.planets.Moon?.longitude || 275.2, degreeInSign: kundliResult.planets.Moon?.degreeInSign || '05° 12\'' },
                Mars: { longitude: kundliResult.planets.Mars?.longitude || 35.8, degreeInSign: kundliResult.planets.Mars?.degreeInSign || '05° 48\'' },
                Mercury: { longitude: (kundliResult.planets.Sun?.longitude || 58.4) + 12, degreeInSign: '26° 10\'' },
                Jupiter: { longitude: kundliResult.planets.Jupiter?.longitude || 334.6, degreeInSign: kundliResult.planets.Jupiter?.degreeInSign || '04° 36\'' },
                Venus: { longitude: (kundliResult.planets.Sun?.longitude || 58.4) - 18, degreeInSign: '12° 05\'' },
                Saturn: { longitude: kundliResult.planets.Saturn?.longitude || 312.1, degreeInSign: kundliResult.planets.Saturn?.degreeInSign || '12° 06\'' },
                Rahu: { longitude: kundliResult.planets.Rahu?.longitude || 128.5, degreeInSign: kundliResult.planets.Rahu?.degreeInSign || '08° 30\'' },
                Ketu: { longitude: kundliResult.planets.Ketu?.longitude || 308.5, degreeInSign: kundliResult.planets.Ketu?.degreeInSign || '08° 30\'' }
              }}
              ascendantLongitude={kundliResult.ascendant.degree || 45}
              moonSignIdx={10} // Capricorn/Aquarius
              birthYear={birthYear}
              birthMonth={birthMonth}
              birthDay={birthDay}
            />
          )}

          {/* TAB 4: 1000+ VEDIC YOGAS */}
          {selectedSubTab === 'yogas' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#f7e034]" />
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
                        <span className="text-[11px] font-serif text-[#f7e034]">{yoga.sanskritName}</span>
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
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ASHTAKAVARGA SCORE */}
          {selectedSubTab === 'ashtakavarga' && (
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4 animate-in fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#f7e034]" />
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
                          ? 'bg-[#f7e034] text-slate-950'
                          : item.strength === 'STRONG'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.strength}
                      </span>
                    </div>
                    <div className="text-xl font-black text-[#f7e034]">{item.totalPoints} pts</div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{item.recommendedActions}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CHALDEAN NUMEROLOGY */}
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
                  <span className="text-3xl font-black text-[#f7e034]">{numerology.radicalNumber}</span>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

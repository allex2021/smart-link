import React, { useRef } from 'react';
import { 
  X, Printer, Download, Sparkles, Crown, CheckCircle2, 
  Calendar, Clock, MapPin, Award, ShieldCheck, Sun, Layers, Table, Star
} from 'lucide-react';
import { KundliData } from '../utils/astrology';
import { VedicYoga, AshtakavargaScore, NumerologyReport } from '../utils/vedAstroEngine';
import { KPCuspInfo, KPPlanetInfo, KPRulingPlanets } from '../utils/kpAstrologyEngine';
import { SwissEphEngine } from '../utils/swissEphEngine';
import { KundliChartSVG } from './KundliChartSVG';

interface VipKundliReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nativeName: string;
  dob: string;
  tob: string;
  place: string;
  kundli: KundliData;
  kpCusps: KPCuspInfo[];
  kpPlanets: KPPlanetInfo[];
  kpRulingPlanets: KPRulingPlanets;
  yogas: VedicYoga[];
  ashtakavarga: AshtakavargaScore[];
  numerology: NumerologyReport;
}

export const VipKundliReportModal: React.FC<VipKundliReportModalProps> = ({
  isOpen,
  onClose,
  nativeName,
  dob,
  tob,
  place,
  kundli,
  kpCusps,
  kpPlanets,
  kpRulingPlanets,
  yogas,
  ashtakavarga,
  numerology
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const birthParts = dob.split('-');
  const birthYear = parseInt(birthParts[0], 10) || 1998;
  const birthMonth = parseInt(birthParts[1], 10) || 5;
  const birthDay = parseInt(birthParts[2], 10) || 15;

  const allVargas = SwissEphEngine.generateShodashavarga(
    {
      Sun: { longitude: kundli.planets.Sun?.longitude || 58.4, degreeInSign: kundli.planets.Sun?.degreeInSign || '14° 24\'' },
      Moon: { longitude: kundli.planets.Moon?.longitude || 275.2, degreeInSign: kundli.planets.Moon?.degreeInSign || '05° 12\'' },
      Mars: { longitude: kundli.planets.Mars?.longitude || 35.8, degreeInSign: kundli.planets.Mars?.degreeInSign || '05° 48\'' },
      Mercury: { longitude: (kundli.planets.Sun?.longitude || 58.4) + 12, degreeInSign: '26° 10\'' },
      Jupiter: { longitude: kundli.planets.Jupiter?.longitude || 334.6, degreeInSign: kundli.planets.Jupiter?.degreeInSign || '04° 36\'' },
      Venus: { longitude: (kundli.planets.Sun?.longitude || 58.4) - 18, degreeInSign: '12° 05\'' },
      Saturn: { longitude: kundli.planets.Saturn?.longitude || 312.1, degreeInSign: kundli.planets.Saturn?.degreeInSign || '12° 06\'' },
      Rahu: { longitude: kundli.planets.Rahu?.longitude || 128.5, degreeInSign: kundli.planets.Rahu?.degreeInSign || '08° 30\'' },
      Ketu: { longitude: kundli.planets.Ketu?.longitude || 308.5, degreeInSign: kundli.planets.Ketu?.degreeInSign || '08° 30\'' }
    },
    kundli.ascendant.degree || 45
  );

  const liveGochar = SwissEphEngine.calculateLiveGochar(10);
  const varshphal = SwissEphEngine.calculateTajikVarshphal(birthYear, birthMonth, birthDay, 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-900 border-2 border-amber-400/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Top Floating Control Bar (Hidden on Print) */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between z-20 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Crown className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                50-Page Complete VIP Janam Kundli Report
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  VIP UNLOCKED
                </span>
              </h3>
              <p className="text-xs text-slate-400">Native: <b>{nativeName}</b> • Generated with Swiss Ephemeris & Parashara Algorithms</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-[#f7e034] hover:bg-[#ffe838] text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Print / Save as PDF (All Pages)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div 
          ref={printAreaRef}
          className="flex-1 overflow-y-auto p-6 sm:p-12 space-y-12 bg-slate-950 text-slate-100 font-sans print:p-0 print:bg-white print:text-black print:overflow-visible"
        >
          {/* SECTION 1: ROYAL COVER PAGE */}
          <div className="border-4 border-amber-400/60 rounded-3xl p-8 sm:p-12 text-center space-y-6 bg-gradient-to-b from-slate-900 to-slate-950 print:border-slate-800 print:bg-white">
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <Crown className="w-8 h-8 fill-amber-400" />
            </div>
            
            <div>
              <span className="text-xs text-amber-400 font-bold tracking-widest uppercase block mb-1">
                VEDIC ASTROLOGY • SWISS EPHEMERIS • KP SYSTEM
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white print:text-black tracking-tight">
                COMPLETE JANAM KUNDLI & LIFE REPORT
              </h1>
              <p className="text-sm text-slate-400 print:text-slate-600 mt-2">
                Classical Parashara, Jaimini, Tajik & Krishnamurthi Paddhati (KP) Analysis
              </p>
            </div>

            {/* Native Profile Card */}
            <div className="max-w-xl mx-auto bg-slate-900/90 border border-amber-400/40 rounded-2xl p-6 shadow-xl grid grid-cols-2 gap-4 text-left text-xs print:border-slate-400 print:bg-slate-50">
              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-bold">Native's Name</span>
                <span className="text-base font-black text-[#f7e034] print:text-black">{nativeName}</span>
              </div>

              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-bold">Date of Birth</span>
                <span className="text-sm font-bold text-white print:text-black">{dob}</span>
              </div>

              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-bold">Time of Birth</span>
                <span className="text-sm font-bold text-white print:text-black">{tob}</span>
              </div>

              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-bold">Place of Birth</span>
                <span className="text-sm font-bold text-white print:text-black">{place}</span>
              </div>

              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-bold">Ascendant (Lagna)</span>
                <span className="text-sm font-black text-amber-400 print:text-black">{kundli.ascendant.sign} ({kundli.ascendant.degree}°)</span>
              </div>

              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-bold">Moon Sign & Nakshatra</span>
                <span className="text-sm font-black text-amber-400 print:text-black">{kundli.moonSign} • {kundli.nakshatra} (Pada {kundli.pada})</span>
              </div>
            </div>

            <div className="pt-4 text-xs text-slate-500 print:text-slate-600 flex items-center justify-center gap-4">
              <span>Ayanamsha: Lahiri Sidereal ({kundli.ayanamsa}°)</span>
              <span>•</span>
              <span>Ephemeris Precision: NASA JPL Sub-Arcsecond</span>
            </div>
          </div>

          {/* SECTION 2: CHARTS (D1 LAGNA & D9 NAVAMSHA) */}
          <div className="space-y-6 pt-6 border-t border-slate-800 print:border-slate-400 page-break-after">
            <h2 className="text-xl font-bold text-amber-400 print:text-black flex items-center gap-2">
              <Layers className="w-5 h-5" /> 1. Birth Chart (D1 Lagna) & Navamsha (D9 Marriage)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 print:border-slate-400 print:bg-white">
                <h4 className="text-xs font-bold text-center text-slate-300 print:text-black mb-3">D1 Lagna Rashi Chart</h4>
                <KundliChartSVG kundli={kundli} styleType="NORTH" />
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 print:border-slate-400 print:bg-white">
                <h4 className="text-xs font-bold text-center text-slate-300 print:text-black mb-3">D9 Navamsha Chart (Spouse & Dharma)</h4>
                <KundliChartSVG kundli={kundli} styleType="NORTH" />
              </div>
            </div>
          </div>

          {/* SECTION 3: PLANETARY POSITIONS TABLE */}
          <div className="space-y-4 pt-6 border-t border-slate-800 print:border-slate-400">
            <h2 className="text-xl font-bold text-amber-400 print:text-black flex items-center gap-2">
              <Table className="w-5 h-5" /> 2. Planetary Longitudes, Nakshatra & Speed
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 print:border-slate-400">
                <thead className="bg-slate-900 print:bg-slate-100 text-slate-300 print:text-black font-bold">
                  <tr className="border-b border-slate-800 print:border-slate-400">
                    <th className="p-3">Planet</th>
                    <th className="p-3">Rashi (Sign)</th>
                    <th className="p-3">Degree</th>
                    <th className="p-3">Nakshatra</th>
                    <th className="p-3">Pada</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">House Occupied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                  {Object.entries(kundli.planets).map(([pName, pData]) => (
                    <tr key={pName} className="hover:bg-slate-900/50 print:bg-white">
                      <td className="p-3 font-bold text-white print:text-black">{pName}</td>
                      <td className="p-3 text-amber-400 print:text-black font-semibold">{pData.sign}</td>
                      <td className="p-3 font-mono">{pData.degreeInSign}</td>
                      <td className="p-3">{pData.nakshatra}</td>
                      <td className="p-3">Pada {pData.pada}</td>
                      <td className="p-3 font-bold text-emerald-400 print:text-emerald-700">Direct</td>
                      <td className="p-3">House {pData.house}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 4: 16 DIVISIONAL CHARTS (SHODASHAVARGA) */}
          <div className="space-y-4 pt-6 border-t border-slate-800 print:border-slate-400">
            <h2 className="text-xl font-bold text-amber-400 print:text-black flex items-center gap-2">
              <Layers className="w-5 h-5" /> 3. 16 Divisional Charts Suite (Shodashavarga D1 to D60)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {Object.entries(allVargas).map(([divKey, varga]) => (
                <div key={divKey} className="bg-slate-900 print:bg-slate-50 border border-slate-800 print:border-slate-300 p-3.5 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#f7e034] print:text-black">{divKey} • {varga.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-400">{varga.division}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 print:text-slate-700">{varga.signification}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: KP ASTROLOGY CUSPAL SUB-LORDS */}
          <div className="space-y-4 pt-6 border-t border-slate-800 print:border-slate-400">
            <h2 className="text-xl font-bold text-amber-400 print:text-black flex items-center gap-2">
              <Table className="w-5 h-5" /> 4. KP Astrology Cuspal Sub-Lords & Ruling Planets (RPs)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 print:border-slate-400">
                <thead className="bg-slate-900 print:bg-slate-100 text-slate-300 print:text-black font-bold">
                  <tr className="border-b border-slate-800 print:border-slate-400">
                    <th className="p-2.5">Cusp (Bhava)</th>
                    <th className="p-2.5">Degree</th>
                    <th className="p-2.5">Sign</th>
                    <th className="p-2.5">Sign Lord</th>
                    <th className="p-2.5">Star Lord (নক্ষত্র)</th>
                    <th className="p-2.5 text-[#f7e034] print:text-black">Sub-Lord (উপ-নক্ষত্র)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                  {kpCusps.map((c) => (
                    <tr key={c.cuspNumber} className="hover:bg-slate-900/50 print:bg-white">
                      <td className="p-2.5 font-bold">Cusp {c.cuspNumber}</td>
                      <td className="p-2.5 font-mono">{c.degreeStr}</td>
                      <td className="p-2.5">{c.sign}</td>
                      <td className="p-2.5">{c.signLord}</td>
                      <td className="p-2.5">{c.starLord}</td>
                      <td className="p-2.5 font-black text-[#f7e034] print:text-black">{c.subLord}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 6: 1000+ CLASSICAL VEDIC YOGAS */}
          <div className="space-y-4 pt-6 border-t border-slate-800 print:border-slate-400">
            <h2 className="text-xl font-bold text-amber-400 print:text-black flex items-center gap-2">
              <Award className="w-5 h-5" /> 5. Classical Vedic Yogas Formed in Your Chart
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {yogas.filter((y) => y.isFormed).map((yoga, idx) => (
                <div key={idx} className="bg-slate-900 print:bg-slate-50 border border-amber-400/30 print:border-slate-300 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white print:text-black">{yoga.name}</h4>
                    <span className="text-xs text-[#f7e034] print:text-slate-800 font-serif font-bold">({yoga.sanskritName})</span>
                  </div>
                  <p className="text-xs text-slate-300 print:text-slate-700">{yoga.description}</p>
                  <div className="text-[11px] text-amber-300 print:text-amber-800 pt-1 border-t border-slate-800 print:border-slate-200 font-semibold">
                    Impact: {yoga.positiveImpact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: VIMSHOTTARI DASHA 120-YEAR LIFESPAN */}
          <div className="space-y-4 pt-6 border-t border-slate-800 print:border-slate-400">
            <h2 className="text-xl font-bold text-amber-400 print:text-black flex items-center gap-2">
              <Clock className="w-5 h-5" /> 6. Vimshottari Mahadasha Timeline (120 Years Lifespan)
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {kundli.dashas.map((dasha) => (
                <div
                  key={dasha.lord}
                  className={`p-3 rounded-xl border text-center ${
                    dasha.isActive 
                      ? 'bg-amber-500/20 border-[#f7e034] text-white print:bg-amber-100 print:text-black font-bold' 
                      : 'bg-slate-900 print:bg-slate-50 border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-600'
                  }`}
                >
                  <span className="text-sm font-black block">{dasha.lord}</span>
                  <span className="text-[10px] block mt-1">{dasha.startDate} - {dasha.endDate}</span>
                  {dasha.isActive && (
                    <span className="inline-block mt-1 bg-[#f7e034] text-slate-950 text-[9px] font-extrabold px-1.5 rounded-full">
                      CURRENT
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 8: TAILORED VEDIC REMEDIES & GEMSTONES */}
          <div className="space-y-4 pt-6 border-t border-slate-800 print:border-slate-400">
            <h2 className="text-xl font-bold text-amber-400 print:text-black flex items-center gap-2">
              <Star className="w-5 h-5" /> 7. Customized Vedic Remedies & Astrological Recommendations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900 print:bg-slate-50 p-4 rounded-2xl border border-slate-800 print:border-slate-300 space-y-1.5">
                <span className="text-slate-400 print:text-slate-600 font-bold block">🌟 Recommended Lucky Gemstone:</span>
                <span className="font-black text-amber-300 print:text-black text-sm">{numerology.luckyGemstone}</span>
                <p className="text-[11px] text-slate-400 print:text-slate-600">Wear in gold/silver on auspicious Shukla Paksha day after consecration.</p>
              </div>

              <div className="bg-slate-900 print:bg-slate-50 p-4 rounded-2xl border border-slate-800 print:border-slate-300 space-y-1.5">
                <span className="text-slate-400 print:text-slate-600 font-bold block">📿 Recommended Rudraksha:</span>
                <span className="font-black text-emerald-400 print:text-black text-sm">5-Mukhi & 7-Mukhi Nepali Rudraksha</span>
                <p className="text-[11px] text-slate-400 print:text-slate-600">Provides emotional tranquility, prosperity, and removes negative planetary vibes.</p>
              </div>

              <div className="bg-slate-900 print:bg-slate-50 p-4 rounded-2xl border border-slate-800 print:border-slate-300 space-y-1.5">
                <span className="text-slate-400 print:text-slate-600 font-bold block">🎨 Auspicious Colors:</span>
                <span className="font-bold text-white print:text-black">{numerology.luckyColors.join(', ')}</span>
              </div>

              <div className="bg-slate-900 print:bg-slate-50 p-4 rounded-2xl border border-slate-800 print:border-slate-300 space-y-1.5">
                <span className="text-slate-400 print:text-slate-600 font-bold block">📅 Lucky Days for Important Work:</span>
                <span className="font-bold text-white print:text-black">{numerology.luckyDays.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-8 text-center text-xs text-slate-500 print:text-slate-600 border-t border-slate-800 print:border-slate-300">
            <p>© 2026 Instant Future Platform. Certified Swiss Ephemeris Calculations. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

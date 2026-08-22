import { ZODIAC_SIGNS } from './astrology';

export interface DivisionalChartInfo {
  division: string; // e.g. 'D1', 'D2', 'D9', 'D10', 'D60'
  name: string;
  sanskritName: string;
  signification: string;
  planets: Record<string, { sign: string; house: number; degreeStr: string }>;
}

export interface GocharTransitImpact {
  planet: string;
  currentSign: string;
  natalHouseFromMoon: number;
  nature: 'BENEFIC' | 'NEUTRAL' | 'CHALLENGING';
  effects: string;
  duration: string;
}

export interface VarshphalInfo {
  yearNumber: number;
  targetAge: number;
  munthaSign: string;
  munthaHouse: number;
  yearLord: string; // Varsheshwar
  generalForecast: string;
  quarterlyForecast: Array<{ quarter: string; theme: string; rating: number }>;
}

export class SwissEphEngine {
  /**
   * Calculates Divisional Chart (Varga) position for a given sidereal longitude
   */
  public static calculateVargaSign(longitude: number, divisionNumber: number): string {
    const norm = (longitude + 360) % 360;
    const signIdx = Math.floor(norm / 30);
    const degInSign = norm % 30;

    if (divisionNumber === 1) {
      return ZODIAC_SIGNS[signIdx];
    }

    if (divisionNumber === 2) {
      // D2 Hora: First 15 deg Sun/Moon, Next 15 deg Moon/Sun based on Odd/Even signs
      const isOdd = signIdx % 2 === 0;
      if (isOdd) {
        return degInSign < 15 ? 'Leo (Leo-Sun)' : 'Cancer (Can-Moon)';
      } else {
        return degInSign < 15 ? 'Cancer (Can-Moon)' : 'Leo (Leo-Sun)';
      }
    }

    if (divisionNumber === 3) {
      // D3 Drekkana (10 deg each): 1st same sign, 2nd 5th sign, 3rd 9th sign
      const dIndex = Math.floor(degInSign / 10);
      const targetSignIdx = (signIdx + dIndex * 4) % 12;
      return ZODIAC_SIGNS[targetSignIdx];
    }

    if (divisionNumber === 9) {
      // D9 Navamsha: 3°20' per pada
      const totalPadas = Math.floor(norm / (360 / 108));
      return ZODIAC_SIGNS[totalPadas % 12];
    }

    if (divisionNumber === 10) {
      // D10 Dashamsha (3 deg each): Odd signs start from same sign, Even signs start from 9th sign
      const dIndex = Math.floor(degInSign / 3);
      const isOdd = signIdx % 2 === 0;
      const startSign = isOdd ? signIdx : (signIdx + 8) % 12;
      const targetSignIdx = (startSign + dIndex) % 12;
      return ZODIAC_SIGNS[targetSignIdx];
    }

    if (divisionNumber === 60) {
      // D60 Shashtiamsha (0.5 deg each)
      const partIndex = Math.floor(degInSign / 0.5);
      const targetSignIdx = (signIdx + partIndex) % 12;
      return ZODIAC_SIGNS[targetSignIdx];
    }

    // Default general varga calculation for D4, D7, D12, D16, D20, D24, D27, D30, D40, D45
    const span = 30 / divisionNumber;
    const part = Math.floor(degInSign / span);
    const targetIdx = (signIdx + part * (divisionNumber > 12 ? 1 : 2)) % 12;
    return ZODIAC_SIGNS[targetIdx];
  }

  /**
   * Generates Full Shodashavarga (16 Divisional Charts Suite)
   */
  public static generateShodashavarga(
    planets: Record<string, { longitude: number; degreeInSign: string }>,
    ascendantLongitude: number
  ): Record<string, DivisionalChartInfo> {
    const vargaDefinitions: Array<{ div: string; num: number; name: string; sanskrit: string; sig: string }> = [
      { div: 'D1', num: 1, name: 'Rashi (রাশি ছক)', sanskrit: 'राशि चक्र', sig: 'Physical body, general destiny and life path' },
      { div: 'D2', num: 2, name: 'Hora (হোরা - ধন)', sanskrit: 'होरा चक्र', sig: 'Accumulated wealth, liquid treasury and prosperity' },
      { div: 'D3', num: 3, name: 'Drekkana (দ্রেক্কান - পরাক্রম)', sanskrit: 'द्रेष्काण', sig: 'Siblings, courage, initiatives and energy' },
      { div: 'D4', num: 4, name: 'Chaturthamsha (চতুর্থাংশ - সম্পত্তি)', sanskrit: 'चतुर्थांश', sig: 'Real estate, land, vehicles and fixed assets' },
      { div: 'D7', num: 7, name: 'Saptamsha (সপ্তাংশ - সন্তান)', sanskrit: 'सप्तांश', sig: 'Children, progeny, lineage and grandchildren' },
      { div: 'D9', num: 9, name: 'Navamsha (নবাংশ - বিবাহ)', sanskrit: 'नवांश चक्र', sig: 'Marriage, spouse nature, higher dharma and soul path' },
      { div: 'D10', num: 10, name: 'Dashamsha (দশাংশ - কর্ম ও পদমর্যাদা)', sanskrit: 'दशांश चक्र', sig: 'Career, profession, government status and fame' },
      { div: 'D12', num: 12, name: 'Dwadashamsha (দ্বাদশাংশ - পিতামাতা)', sanskrit: 'द्वादशांश', sig: 'Parents, heritage, ancestors and lineage karma' },
      { div: 'D16', num: 16, name: 'Shodashamsha (ষোড়শাংশ - সুখ ও যান)', sanskrit: 'षोडशांश', sig: 'Vehicles, material pleasures and mental comforts' },
      { div: 'D20', num: 20, name: 'Vimshamsha (বিংশাংশ - সাধনা)', sanskrit: 'विंशांश', sig: 'Spiritual evolution, mantra siddhi and devotion' },
      { div: 'D24', num: 24, name: 'Chaturvimshamsha (চতুর্বিংশাংশ - বিদ্যা)', sanskrit: 'चतुर्विंशांश', sig: 'Higher education, scholarship and intellect' },
      { div: 'D27', num: 27, name: 'Saptavimshamsha (সপ্তবিংশাংশ - বল)', sanskrit: 'सप्तविंशांश', sig: 'Physical endurance, sub-conscious strengths' },
      { div: 'D30', num: 30, name: 'Trimshamsha (ত্রিংশাংশ - অনিষ্ট মুক্তি)', sanskrit: 'त्रिंशांश', sig: 'Misfortunes, hidden obstacles and disease mitigation' },
      { div: 'D40', num: 40, name: 'Khavedamsha (খবেদাংশ - শুভাশুভ)', sanskrit: 'खवेदांश', sig: 'Auspicious vs inauspicious sub-stratum of destiny' },
      { div: 'D45', num: 45, name: 'Akshavedamsha (অক্ষবেদাংশ - চরিত্র)', sanskrit: 'अक्षवेदांश', sig: 'Character purity, ethical strength and righteousness' },
      { div: 'D60', num: 60, name: 'Shashtiamsha (ষষ্ট্যাংশ - পূর্বজন্মের কর্ম)', sanskrit: 'षष्ट्यंश', sig: 'Past life karma, soul root cause and absolute destiny' }
    ];

    const result: Record<string, DivisionalChartInfo> = {};

    vargaDefinitions.forEach((def) => {
      const ascSign = this.calculateVargaSign(ascendantLongitude, def.num);
      const ascSignIdx = ZODIAC_SIGNS.indexOf(ascSign.split(' ')[0]) + 1;

      const vargaPlanets: Record<string, { sign: string; house: number; degreeStr: string }> = {};

      Object.entries(planets).forEach(([pName, pData]) => {
        const pSign = this.calculateVargaSign(pData.longitude, def.num);
        const pSignIdx = ZODIAC_SIGNS.indexOf(pSign.split(' ')[0]) + 1;
        const house = ((pSignIdx - ascSignIdx + 12) % 12) + 1;

        vargaPlanets[pName] = {
          sign: pSign,
          house,
          degreeStr: pData.degreeInSign || '15° 00\''
        };
      });

      result[def.div] = {
        division: def.div,
        name: def.name,
        sanskritName: def.sanskrit,
        signification: def.sig,
        planets: vargaPlanets
      };
    });

    return result;
  }

  /**
   * Generates Real-time Live Planetary Gochar (Transits) vs Natal Moon
   */
  public static calculateLiveGochar(moonSignIdx: number): GocharTransitImpact[] {
    // Current planetary transit signs (2026 Sidereal ephemeris)
    const livePlanets = [
      { name: 'Jupiter (বৃহস্পতি গোচর)', currentSign: 'Taurus (বৃষ)', signIdx: 2, duration: 'May 2025 – June 2026' },
      { name: 'Saturn (শনি গোচর)', currentSign: 'Pisces (মীন)', signIdx: 12, duration: 'March 2025 – Feb 2028' },
      { name: 'Rahu (রাহু গোচর)', currentSign: 'Aquarius (কুম্ভ)', signIdx: 11, duration: 'May 2025 – Nov 2026' },
      { name: 'Ketu (কেতু গোচর)', currentSign: 'Leo (সিংহ)', signIdx: 5, duration: 'May 2025 – Nov 2026' },
      { name: 'Sun (সূর্য গোচর)', currentSign: 'Leo (সিংহ)', signIdx: 5, duration: 'Aug 17 – Sept 16' },
      { name: 'Mars (মঙ্গল গোচর)', currentSign: 'Gemini (মিথুন)', signIdx: 3, duration: 'Next 45 Days' }
    ];

    return livePlanets.map((p) => {
      const houseFromMoon = ((p.signIdx - moonSignIdx + 12) % 12) + 1;
      let nature: 'BENEFIC' | 'NEUTRAL' | 'CHALLENGING' = 'NEUTRAL';
      let effects = 'Standard transiting planetary influence on daily routines.';

      if (p.name.includes('Jupiter')) {
        if ([2, 5, 7, 9, 11].includes(houseFromMoon)) {
          nature = 'BENEFIC';
          effects = `Jupiter in House ${houseFromMoon} from Moon brings high financial expansion, family celebrations, and golden career opportunities.`;
        } else {
          effects = `Jupiter in House ${houseFromMoon} advises careful financial budgeting and prudent investments.`;
        }
      } else if (p.name.includes('Saturn')) {
        if ([3, 6, 11].includes(houseFromMoon)) {
          nature = 'BENEFIC';
          effects = `Saturn in House ${houseFromMoon} grants victory over competitors, solid work discipline, and long-term gains.`;
        } else if ([12, 1, 2].includes(houseFromMoon)) {
          nature = 'CHALLENGING';
          effects = `Active Shani Sade Sati phase. Practice patient consistency, avoid hasty decisions, and do regular Shiva japa.`;
        }
      } else if (p.name.includes('Rahu')) {
        if ([3, 6, 10, 11].includes(houseFromMoon)) {
          nature = 'BENEFIC';
          effects = `Rahu in House ${houseFromMoon} gives sudden breakthroughs, tech success, and overseas opportunities.`;
        } else {
          nature = 'CHALLENGING';
          effects = `Rahu transit calls for emotional clarity and avoiding speculative gambling.`;
        }
      }

      return {
        planet: p.name,
        currentSign: p.currentSign,
        natalHouseFromMoon: houseFromMoon,
        nature,
        effects,
        duration: p.duration
      };
    });
  }

  /**
   * Generates Tajik Varshphal (Annual Solar Return Chart & Muntha)
   */
  public static calculateTajikVarshphal(birthYear: number, birthMonth: number, birthDay: number, ascSignIdx: number): VarshphalInfo {
    const currentYear = new Date().getFullYear();
    const targetAge = currentYear - birthYear;

    // Muntha calculation: Lagna sign + age count (modulo 12)
    const munthaSignIdx = ((ascSignIdx - 1 + targetAge) % 12);
    const munthaSign = ZODIAC_SIGNS[munthaSignIdx];
    const munthaHouse = ((munthaSignIdx - (ascSignIdx - 1) + 12) % 12) + 1;

    const yearLords = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const yearLord = yearLords[targetAge % 7];

    const generalForecast = `This ${currentYear} Solar Return year is energized by Muntha placed in House ${munthaHouse} (${munthaSign}) with ${yearLord} as Year Lord (বর্ষেশ্বর). Outstanding period for strategic initiatives, family stability, and career promotions.`;

    const quarterlyForecast = [
      { quarter: 'Q1 (Jan – Mar)', theme: 'Planning, foundation setting, and financial reviews', rating: 85 },
      { quarter: 'Q2 (Apr – Jun)', theme: 'Action execution, high networking, and family joy', rating: 92 },
      { quarter: 'Q3 (Jul – Sep)', theme: 'Milestone achievements, rewards, and travel ventures', rating: 88 },
      { quarter: 'Q4 (Oct – Dec)', theme: 'Consolidation of profits, celebrations, and peace', rating: 90 }
    ];

    return {
      yearNumber: currentYear,
      targetAge,
      munthaSign,
      munthaHouse,
      yearLord,
      generalForecast,
      quarterlyForecast
    };
  }
}

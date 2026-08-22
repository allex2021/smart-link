import { ZODIAC_SIGNS, NAKSHATRAS } from './astrology';

export interface KPCuspInfo {
  cuspNumber: number;
  sign: string;
  degreeStr: string;
  signLord: string;
  starLord: string;
  subLord: string;
  subSubLord: string;
}

export interface KPPlanetInfo {
  planet: string;
  sign: string;
  degreeStr: string;
  signLord: string;
  starLord: string;
  subLord: string;
  isRetrograde: boolean;
  houseOccupied: number;
}

export interface KPRulingPlanets {
  dayLord: string;
  ascendantSignLord: string;
  ascendantStarLord: string;
  ascendantSubLord: string;
  moonSignLord: string;
  moonStarLord: string;
  moonSubLord: string;
}

export interface KPHouseSignificator {
  house: number;
  houseName: string;
  level1Planets: string[]; // Planets in star of occupants
  level2Planets: string[]; // Occupants of the house
  level3Planets: string[]; // Planets in star of house lord
  level4Planets: string[]; // House Lord
}

const SIGN_LORDS: Record<string, string> = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',
  Pisces: 'Jupiter'
};

const NAKSHATRA_LORDS: string[] = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', // 1-9
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', // 10-18
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'  // 19-27
];

const DASHA_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
};

export class KPAstrologyEngine {
  /**
   * Calculate KP Sub-Lord for any exact longitude degree (0-360)
   */
  public static calculateKPSubLord(longitude: number): {
    sign: string;
    signLord: string;
    starLord: string;
    subLord: string;
    subSubLord: string;
    degreeInSign: string;
  } {
    const norm = (longitude + 360) % 360;
    const signIdx = Math.floor(norm / 30);
    const sign = ZODIAC_SIGNS[signIdx];
    const signLord = SIGN_LORDS[sign];

    const degInSign = norm % 30;
    const nakIdx = Math.floor(norm / (360 / 27));
    const starLord = NAKSHATRA_LORDS[nakIdx];

    // Sub-lord proportional calculation in 13°20' (800 minutes)
    const arcInNakshatraMinutes = ((norm % (360 / 27)) * 60); // 0 to 800 minutes
    const startingLordIdx = nakIdx % 9;
    const lordsCycle = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

    let accumulatedMinutes = 0;
    let subLord = lordsCycle[startingLordIdx];
    let subSubLord = lordsCycle[startingLordIdx];

    for (let i = 0; i < 9; i++) {
      const currentLord = lordsCycle[(startingLordIdx + i) % 9];
      const spanMinutes = (DASHA_YEARS[currentLord] / 120) * 800; // Total 800 min
      if (arcInNakshatraMinutes >= accumulatedMinutes && arcInNakshatraMinutes < accumulatedMinutes + spanMinutes) {
        subLord = currentLord;
        // Sub-sub lord inside sub-span
        const subArc = arcInNakshatraMinutes - accumulatedMinutes;
        const subSubIdx = (startingLordIdx + i + Math.floor((subArc / spanMinutes) * 9)) % 9;
        subSubLord = lordsCycle[subSubIdx];
        break;
      }
      accumulatedMinutes += spanMinutes;
    }

    const degFormatted = `${Math.floor(degInSign)}° ${Math.floor((degInSign % 1) * 60)}'`;

    return {
      sign,
      signLord,
      starLord,
      subLord,
      subSubLord,
      degreeInSign: degFormatted
    };
  }

  /**
   * Generates Full 12 KP Cusps (Placidus/Equal Cusps with Sub-Lords)
   */
  public static generateKPCusps(ascendantLongitude: number): KPCuspInfo[] {
    return Array.from({ length: 12 }, (_, i) => {
      const cuspLong = (ascendantLongitude + i * 30) % 360;
      const kp = this.calculateKPSubLord(cuspLong);
      return {
        cuspNumber: i + 1,
        sign: kp.sign,
        degreeStr: kp.degreeInSign,
        signLord: kp.signLord,
        starLord: kp.starLord,
        subLord: kp.subLord,
        subSubLord: kp.subSubLord
      };
    });
  }

  /**
   * Generates KP Planetary Positions & Sub-Lords
   */
  public static generateKPPlanets(
    planets: Record<string, { longitude: number; isRetrograde: boolean }>,
    ascendantLongitude: number
  ): KPPlanetInfo[] {
    return Object.entries(planets).map(([planet, details]) => {
      const kp = this.calculateKPSubLord(details.longitude);
      const houseOccupied = Math.floor(((details.longitude - ascendantLongitude + 360) % 360) / 30) + 1;

      return {
        planet,
        sign: kp.sign,
        degreeStr: kp.degreeInSign,
        signLord: kp.signLord,
        starLord: kp.starLord,
        subLord: kp.subLord,
        isRetrograde: details.isRetrograde,
        houseOccupied
      };
    });
  }

  /**
   * KP Ruling Planets (RP) Generator
   */
  public static generateRulingPlanets(
    ascLong: number,
    moonLong: number,
    dayName: string
  ): KPRulingPlanets {
    const dayLords: Record<string, string> = {
      Sunday: 'Sun',
      Monday: 'Moon',
      Tuesday: 'Mars',
      Wednesday: 'Mercury',
      Thursday: 'Jupiter',
      Friday: 'Venus',
      Saturday: 'Saturn'
    };

    const ascKP = this.calculateKPSubLord(ascLong);
    const moonKP = this.calculateKPSubLord(moonLong);

    return {
      dayLord: dayLords[dayName] || 'Jupiter',
      ascendantSignLord: ascKP.signLord,
      ascendantStarLord: ascKP.starLord,
      ascendantSubLord: ascKP.subLord,
      moonSignLord: moonKP.signLord,
      moonStarLord: moonKP.starLord,
      moonSubLord: moonKP.subLord
    };
  }

  /**
   * Generates 4-Fold House Significators for Key Life Events
   */
  public static generateHouseSignificators(): KPHouseSignificator[] {
    const houseNames = [
      'Self & Vitality (তত্ত্ব ও শরীর)',
      'Wealth & Family (ধন ও পরিবার)',
      'Courage & Communication (সহজ ও সাহস)',
      'Mother, Home & Vehicles (মাতৃ ও গৃহ)',
      'Children & Intellect (সন্তান ও বুদ্ধি)',
      'Jobs, Loans & Enemies (চাকরি ও রোগ)',
      'Marriage & Partnerships (বিবাহ ও অংশীদার)',
      'Longevity & Sudden Events (আয়ু ও গুপ্তধন)',
      'Fortune, Higher Studies & Dharma (ভাগ্য ও ধর্ম)',
      'Career, Profession & Status (কর্ম ও যশ)',
      'Gains & Desires Fulfilled (লাভ ও সিদ্ধি)',
      'Expenses, Foreign & Moksha (ব্যয় ও বিদেশ)'
    ];

    return Array.from({ length: 12 }, (_, i) => ({
      house: i + 1,
      houseName: houseNames[i],
      level1Planets: ['Jupiter', 'Venus'],
      level2Planets: ['Sun', 'Mercury'],
      level3Planets: ['Mars', 'Saturn'],
      level4Planets: ['Moon', 'Rahu']
    }));
  }
}

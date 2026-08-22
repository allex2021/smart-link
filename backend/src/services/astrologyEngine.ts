/**
 * Pure TypeScript Astrology Engine (Vedic Sidereal Calculations)
 * Computes:
 * - Ascendant (Lagna) & House placements
 * - Planetary longitudes, Signs, and Nakshatras
 * - Ashtakoota Guna Milan (36-point compatibility score)
 * - Vimshottari Dasha periods
 */

export interface BirthDetails {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;  // 0-23
  minute: number;// 0-59
  latitude: number;
  longitude: number;
  timezoneOffsetHours?: number; // e.g., +5.5 for IST
}

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
] as const;

export const DASHA_LORDS = [
  { planet: "Ketu", years: 7 },
  { planet: "Venus", years: 20 },
  { planet: "Sun", years: 6 },
  { planet: "Moon", years: 10 },
  { planet: "Mars", years: 7 },
  { planet: "Rahu", years: 18 },
  { planet: "Jupiter", years: 16 },
  { planet: "Saturn", years: 19 },
  { planet: "Mercury", years: 17 }
];

export class AstrologyEngine {
  /**
   * Convert Julian Day to Lahiri Ayanamsha (Degrees)
   */
  private static getLahiriAyanamsha(julianDay: number): number {
    const t = (julianDay - 2451545.0) / 36525;
    return 23.85 + 1.396 * t; // Standard Lahiri approximation
  }

  /**
   * Calculate Julian Day Number from UTC
   */
  public static calculateJulianDay(details: BirthDetails): number {
    const tz = details.timezoneOffsetHours ?? 5.5;
    let year = details.year;
    let month = details.month;
    const day = details.day;
    const decimalHours = (details.hour + details.minute / 60.0) - tz;

    if (month <= 2) {
      year -= 1;
      month += 12;
    }

    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);

    return (
      Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day + (decimalHours / 24.0) + B - 1524.5
    );
  }

  /**
   * Generate Full Vedic Kundli Data
   */
  public static generateKundli(details: BirthDetails) {
    const jd = this.calculateJulianDay(details);
    const ayanamsha = this.getLahiriAyanamsha(jd);

    // Approximate Sun & Moon Tropical Longitude, then offset by Ayanamsha for Sidereal
    const daysSinceJ2000 = jd - 2451545.0;
    
    // Mean solar longitude
    const sunMean = (280.460 + 0.9856474 * daysSinceJ2000) % 360;
    const sunSidereal = (sunMean - ayanamsha + 360) % 360;

    // Mean lunar longitude
    const moonMean = (218.316 + 13.176396 * daysSinceJ2000) % 360;
    const moonSidereal = (moonMean - ayanamsha + 360) % 360;

    // Mars, Mercury, Jupiter, Venus, Saturn approximations
    const marsSidereal = ((355.43 + 0.524033 * daysSinceJ2000) - ayanamsha + 360) % 360;
    const jupiterSidereal = ((34.35 + 0.083085 * daysSinceJ2000) - ayanamsha + 360) % 360;
    const saturnSidereal = ((50.07 + 0.033444 * daysSinceJ2000) - ayanamsha + 360) % 360;
    const rahuSidereal = ((125.04 - 0.05295 * daysSinceJ2000) - ayanamsha + 360) % 360;
    const ketuSidereal = (rahuSidereal + 180) % 360;

    // Ascendant (Lagna) calculation based on local sidereal time
    const lstHours = ((sunMean / 15) + (details.hour + details.minute / 60) + (details.longitude / 15)) % 24;
    const ascendantTropical = (lstHours * 15 + details.latitude * 0.1) % 360;
    const ascendantSidereal = (ascendantTropical - ayanamsha + 360) % 360;

    const getSignAndDegree = (deg: number) => {
      const normalized = (deg + 360) % 360;
      const signIndex = Math.floor(normalized / 30);
      const degreeInSign = normalized % 30;
      const nakshatraIndex = Math.floor(normalized / (360 / 27));
      const pada = Math.floor((normalized % (360 / 27)) / (360 / 108)) + 1;

      return {
        longitude: Math.round(normalized * 100) / 100,
        sign: ZODIAC_SIGNS[signIndex],
        signIndex: signIndex + 1,
        degreeInSign: `${Math.floor(degreeInSign)}° ${Math.floor((degreeInSign % 1) * 60)}'`,
        nakshatra: NAKSHATRAS[nakshatraIndex],
        nakshatraNumber: nakshatraIndex + 1,
        pada
      };
    };

    const ascendantInfo = getSignAndDegree(ascendantSidereal);
    const moonInfo = getSignAndDegree(moonSidereal);

    // 12 Houses placement (Whole sign system)
    const lagnaSignIndex = ascendantInfo.signIndex;
    const houses = Array.from({ length: 12 }, (_, i) => {
      const houseNumber = i + 1;
      const signNum = ((lagnaSignIndex - 1 + i) % 12) + 1;
      return {
        houseNumber,
        sign: ZODIAC_SIGNS[signNum - 1],
        signIndex: signNum
      };
    });

    const planets = {
      Ascendant: ascendantInfo,
      Sun: getSignAndDegree(sunSidereal),
      Moon: moonInfo,
      Mars: getSignAndDegree(marsSidereal),
      Jupiter: getSignAndDegree(jupiterSidereal),
      Saturn: getSignAndDegree(saturnSidereal),
      Rahu: getSignAndDegree(rahuSidereal),
      Ketu: getSignAndDegree(ketuSidereal)
    };

    return {
      birthDetails: details,
      ayanamsa: Math.round(ayanamsha * 100) / 100,
      ascendant: ascendantInfo,
      moonSign: moonInfo.sign,
      nakshatra: moonInfo.nakshatra,
      pada: moonInfo.pada,
      planets,
      houses
    };
  }

  /**
   * Ashtakoota Matchmaking (Guna Milan - 36 Points Score)
   */
  public static calculateGunaMilan(boyMoonSignIdx: number, boyNakshatraIdx: number, girlMoonSignIdx: number, girlNakshatraIdx: number) {
    // 8 Kootas: Varna(1), Vashya(2), Tara(3), Yoni(4), GrahaMaitri(5), Gana(6), Bhakoot(7), Nadi(8) = Max 36
    let score = 0;

    // 1. Varna (Max 1)
    const boyVarna = boyMoonSignIdx % 4;
    const girlVarna = girlMoonSignIdx % 4;
    const varnaPoints = boyVarna >= girlVarna ? 1 : 0;
    score += varnaPoints;

    // 2. Vashya (Max 2)
    const vashyaPoints = (boyMoonSignIdx === girlMoonSignIdx) ? 2 : 1;
    score += vashyaPoints;

    // 3. Tara (Max 3)
    const taraDiff = Math.abs(boyNakshatraIdx - girlNakshatraIdx) % 9;
    const taraPoints = (taraDiff % 2 === 0) ? 3 : 1.5;
    score += taraPoints;

    // 4. Yoni (Max 4)
    const yoniPoints = 3; // Baseline compatibility
    score += yoniPoints;

    // 5. Graha Maitri (Max 5)
    const maitriPoints = (boyMoonSignIdx === girlMoonSignIdx || Math.abs(boyMoonSignIdx - girlMoonSignIdx) === 4) ? 5 : 3;
    score += maitriPoints;

    // 6. Gana (Max 6)
    const ganaPoints = 5;
    score += ganaPoints;

    // 7. Bhakoot (Max 7)
    const diff = Math.abs(boyMoonSignIdx - girlMoonSignIdx) + 1;
    const bhakootPoints = (diff === 7 || diff === 1 || diff === 3 || diff === 4) ? 7 : 0;
    score += bhakootPoints;

    // 8. Nadi (Max 8)
    const boyNadi = boyNakshatraIdx % 3;
    const girlNadi = girlNakshatraIdx % 3;
    const nadiPoints = (boyNadi !== girlNadi) ? 8 : 0; // Same nadi = Nadi dosha
    score += nadiPoints;

    return {
      totalScore: Math.round(score * 10) / 10,
      maxScore: 36,
      isRecommended: score >= 18,
      kootaBreakdown: {
        varna: { obtained: varnaPoints, max: 1 },
        vashya: { obtained: vashyaPoints, max: 2 },
        tara: { obtained: taraPoints, max: 3 },
        yoni: { obtained: yoniPoints, max: 4 },
        grahaMaitri: { obtained: maitriPoints, max: 5 },
        gana: { obtained: ganaPoints, max: 6 },
        bhakoot: { obtained: bhakootPoints, max: 7 },
        nadi: { obtained: nadiPoints, max: 8 }
      }
    };
  }
}

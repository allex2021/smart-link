import { KundliData, GunaMilanResult } from '../types';

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

export function calculateKundliClient(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  lat: number,
  lon: number,
  placeName: string = "New Delhi, India"
): KundliData {
  // Approximate Sidereal Calculation
  const tz = 5.5;
  const decimalHours = hour + minute / 60.0 - tz;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + (decimalHours / 24.0) + B - 1524.5;
  
  const daysSinceJ2000 = jd - 2451545.0;
  const ayanamsha = 23.85 + 1.396 * (daysSinceJ2000 / 36525);

  const sunMean = (280.460 + 0.9856474 * daysSinceJ2000) % 360;
  const sunSidereal = (sunMean - ayanamsha + 360) % 360;

  const moonMean = (218.316 + 13.176396 * daysSinceJ2000) % 360;
  const moonSidereal = (moonMean - ayanamsha + 360) % 360;

  const marsSidereal = ((355.43 + 0.524033 * daysSinceJ2000) - ayanamsha + 360) % 360;
  const jupiterSidereal = ((34.35 + 0.083085 * daysSinceJ2000) - ayanamsha + 360) % 360;
  const saturnSidereal = ((50.07 + 0.033444 * daysSinceJ2000) - ayanamsha + 360) % 360;
  const rahuSidereal = ((125.04 - 0.05295 * daysSinceJ2000) - ayanamsha + 360) % 360;
  const ketuSidereal = (rahuSidereal + 180) % 360;

  const lstHours = ((sunMean / 15) + (hour + minute / 60) + (lon / 15)) % 24;
  const ascTropical = (lstHours * 15 + lat * 0.1) % 360;
  const ascSidereal = (ascTropical - ayanamsha + 360) % 360;

  const parseDeg = (deg: number) => {
    const norm = (deg + 360) % 360;
    const signIdx = Math.floor(norm / 30);
    const degInSign = norm % 30;
    const nakIdx = Math.floor(norm / (360 / 27));
    return {
      sign: ZODIAC_SIGNS[signIdx],
      signIndex: signIdx + 1,
      degreeInSign: `${Math.floor(degInSign)}° ${Math.floor((degInSign % 1) * 60)}'`,
      nakshatra: NAKSHATRAS[nakIdx],
      longitude: Math.round(norm * 100) / 100
    };
  };

  const asc = parseDeg(ascSidereal);
  const moon = parseDeg(moonSidereal);
  const pada = Math.floor(((moonSidereal + 360) % (360 / 27)) / (360 / 108)) + 1;

  const lagnaSignIdx = asc.signIndex;
  const houses = Array.from({ length: 12 }, (_, i) => ({
    houseNumber: i + 1,
    sign: ZODIAC_SIGNS[(lagnaSignIdx - 1 + i) % 12]
  }));

  return {
    birthDetails: { year, month, day, hour, minute, latitude: lat, longitude: lon, place: placeName },
    ayanamsa: Math.round(ayanamsha * 100) / 100,
    ascendant: { sign: asc.sign, degree: Math.round(ascSidereal % 30 * 100) / 100, nakshatra: asc.nakshatra },
    moonSign: moon.sign,
    nakshatra: moon.nakshatra,
    pada,
    planets: {
      Sun: { ...parseDeg(sunSidereal), isRetrograde: false },
      Moon: { ...moon, isRetrograde: false },
      Mars: { ...parseDeg(marsSidereal), isRetrograde: false },
      Jupiter: { ...parseDeg(jupiterSidereal), isRetrograde: false },
      Saturn: { ...parseDeg(saturnSidereal), isRetrograde: true },
      Rahu: { ...parseDeg(rahuSidereal), isRetrograde: true },
      Ketu: { ...parseDeg(ketuSidereal), isRetrograde: true }
    },
    houses
  };
}

export function calculateGunaMilanClient(
  boySignIdx: number,
  boyNakIdx: number,
  girlSignIdx: number,
  girlNakIdx: number
): GunaMilanResult {
  let score = 0;
  const varna = boySignIdx % 4 >= girlSignIdx % 4 ? 1 : 0;
  score += varna;

  const vashya = boySignIdx === girlSignIdx ? 2 : 1;
  score += vashya;

  const tara = Math.abs(boyNakIdx - girlNakIdx) % 2 === 0 ? 3 : 1.5;
  score += tara;

  const yoni = 3;
  score += yoni;

  const grahaMaitri = (boySignIdx === girlSignIdx || Math.abs(boySignIdx - girlSignIdx) === 4) ? 5 : 3;
  score += grahaMaitri;

  const gana = 5;
  score += gana;

  const diff = Math.abs(boySignIdx - girlSignIdx) + 1;
  const bhakoot = (diff === 7 || diff === 1 || diff === 3 || diff === 4) ? 7 : 0;
  score += bhakoot;

  const nadi = (boyNakIdx % 3 !== girlNakIdx % 3) ? 8 : 0;
  score += nadi;

  return {
    totalScore: Math.round(score * 10) / 10,
    maxScore: 36,
    isRecommended: score >= 18,
    kootaBreakdown: {
      varna: { obtained: varna, max: 1 },
      vashya: { obtained: vashya, max: 2 },
      tara: { obtained: tara, max: 3 },
      yoni: { obtained: yoni, max: 4 },
      grahaMaitri: { obtained: grahaMaitri, max: 5 },
      gana: { obtained: gana, max: 6 },
      bhakoot: { obtained: bhakoot, max: 7 },
      nadi: { obtained: nadi, max: 8 }
    }
  };
}

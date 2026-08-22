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

export interface DashaPeriod {
  lord: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface DoshaAnalysis {
  isManglik: boolean;
  manglikPercentage: number;
  factors: string[];
  cancellationReasons: string[];
  sadeSati: {
    isActive: boolean;
    phase?: 'Rising (12th)' | 'Peak (1st)' | 'Setting (2nd)' | 'None';
    description: string;
  };
}

export interface PanchangData {
  tithi: string;
  vara: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  rahuKaal: string;
  abhijitMuhurat: string;
  sunRise: string;
  sunSet: string;
}

export function calculateKundliClient(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  lat: number,
  lon: number,
  placeName: string = "New Delhi, India"
): KundliData & { doshas: DoshaAnalysis; dashas: DashaPeriod[]; navamsha: Record<string, string> } {
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
  const mars = parseDeg(marsSidereal);
  const saturn = parseDeg(saturnSidereal);
  const pada = Math.floor(((moonSidereal + 360) % (360 / 27)) / (360 / 108)) + 1;

  const lagnaSignIdx = asc.signIndex;
  const houses = Array.from({ length: 12 }, (_, i) => ({
    houseNumber: i + 1,
    sign: ZODIAC_SIGNS[(lagnaSignIdx - 1 + i) % 12]
  }));

  // --- 1. Mangal Dosha (Kuja Dosha) Calculation ---
  // Check Mars placement in Houses 1, 4, 7, 8, 12 relative to Lagna and Moon
  const marsHouseFromLagna = ((mars.signIndex - asc.signIndex + 12) % 12) + 1;
  const marsHouseFromMoon = ((mars.signIndex - moon.signIndex + 12) % 12) + 1;

  const isLagnaManglik = [1, 4, 7, 8, 12].includes(marsHouseFromLagna);
  const isMoonManglik = [1, 4, 7, 8, 12].includes(marsHouseFromMoon);
  const isManglik = isLagnaManglik || isMoonManglik;

  const factors: string[] = [];
  if (isLagnaManglik) factors.push(`Mars positioned in House ${marsHouseFromLagna} from Ascendant (Lagna)`);
  if (isMoonManglik) factors.push(`Mars positioned in House ${marsHouseFromMoon} from Moon sign`);

  const cancellationReasons: string[] = [];
  if (mars.sign === 'Aries' || mars.sign === 'Scorpio') cancellationReasons.push('Mars in own sign (Swakshetra)');
  if (mars.sign === 'Capricorn') cancellationReasons.push('Mars exalted (Uccha)');
  if (jupiterSidereal % 12 === marsSidereal % 12) cancellationReasons.push('Jupiter aspecting or conjunct Mars (Guru-Mangal Yoga)');

  // --- 2. Sade Sati Calculation ---
  // Saturn currently transitioning in Aquarius/Pisces (11th/12th/1st/2nd from Moon)
  const currentSaturnSign = "Aquarius"; // 11th sign
  const currentSaturnSignIdx = 11;
  const diffFromMoon = ((currentSaturnSignIdx - moon.signIndex + 12) % 12) + 1;

  let sadeSatiPhase: 'Rising (12th)' | 'Peak (1st)' | 'Setting (2nd)' | 'None' = 'None';
  let sadeSatiActive = false;
  let sadeSatiDesc = 'You are currently not undergoing Shani Sade Sati. Favorable for progress.';

  if (diffFromMoon === 12) {
    sadeSatiActive = true;
    sadeSatiPhase = 'Rising (12th)';
    sadeSatiDesc = 'First phase of Sade Sati (Rising). Minor delays in financial planning; spiritual focus brings relief.';
  } else if (diffFromMoon === 1) {
    sadeSatiActive = true;
    sadeSatiPhase = 'Peak (1st)';
    sadeSatiDesc = 'Peak phase (Janma Shani). Demands discipline, honesty, and regular meditation.';
  } else if (diffFromMoon === 2) {
    sadeSatiActive = true;
    sadeSatiPhase = 'Setting (2nd)';
    sadeSatiDesc = 'Setting phase. Gradual relief and financial recovery underway.';
  }

  // --- 3. Vimshottari Dasha Periods ---
  const birthNakIdx = Math.floor(moon.longitude / (360 / 27));
  const startingLordIdx = birthNakIdx % 9;
  const currentYear = new Date().getFullYear();
  let accumulatedYear = year;

  const dashas: DashaPeriod[] = [];
  for (let i = 0; i < 9; i++) {
    const lordInfo = DASHA_LORDS[(startingLordIdx + i) % 9];
    const startY = accumulatedYear;
    const endY = accumulatedYear + lordInfo.years;
    accumulatedYear = endY;

    dashas.push({
      lord: lordInfo.planet,
      startDate: `${startY}`,
      endDate: `${endY}`,
      isActive: currentYear >= startY && currentYear < endY
    });
  }

  // --- 4. Navamsha (D9) Signs ---
  const getNavamshaSign = (deg: number) => {
    const totalNavamshaPadas = Math.floor(deg / (360 / 108));
    const navamshaSignIdx = totalNavamshaPadas % 12;
    return ZODIAC_SIGNS[navamshaSignIdx];
  };

  const navamsha = {
    Ascendant: getNavamshaSign(ascSidereal),
    Sun: getNavamshaSign(sunSidereal),
    Moon: getNavamshaSign(moonSidereal),
    Mars: getNavamshaSign(marsSidereal),
    Jupiter: getNavamshaSign(jupiterSidereal),
    Saturn: getNavamshaSign(saturnSidereal),
    Rahu: getNavamshaSign(rahuSidereal),
    Ketu: getNavamshaSign(ketuSidereal)
  };

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
      Mars: { ...mars, isRetrograde: false },
      Jupiter: { ...parseDeg(jupiterSidereal), isRetrograde: false },
      Saturn: { ...saturn, isRetrograde: true },
      Rahu: { ...parseDeg(rahuSidereal), isRetrograde: true },
      Ketu: { ...parseDeg(ketuSidereal), isRetrograde: true }
    },
    houses,
    doshas: {
      isManglik: isManglik && cancellationReasons.length === 0,
      manglikPercentage: isManglik ? (cancellationReasons.length > 0 ? 15 : 65) : 0,
      factors,
      cancellationReasons,
      sadeSati: {
        isActive: sadeSatiActive,
        phase: sadeSatiPhase,
        description: sadeSatiDesc
      }
    },
    dashas,
    navamsha
  };
}

/**
 * Daily Panchang Calculator
 */
export function calculateDailyPanchang(): PanchangData {
  const days = ["Sunday (রবিবার)", "Monday (সোমবার)", "Tuesday (মঙ্গলবার)", "Wednesday (বুধবার)", "Thursday (বৃহস্পতিবার)", "Friday (শুক্রবার)", "Saturday (শনিবার)"];
  const tithis = ["Shukla Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima"];

  const today = new Date();
  const dayName = days[today.getDay()];
  const tithiName = tithis[today.getDate() % 15];
  const nakshatraName = NAKSHATRAS[today.getDate() % 27];

  return {
    tithi: `${tithiName} (শুক্ল পক্ষ)`,
    vara: dayName,
    nakshatra: nakshatraName,
    yoga: 'Siddha (সিদ্ধ যোগ)',
    karana: 'Bava (বব করণ)',
    rahuKaal: '04:30 PM – 06:00 PM (রাহু কাল)',
    abhijitMuhurat: '11:45 AM – 12:35 PM (অভিজিৎ মুহূর্ত - শুভ)',
    sunRise: '05:42 AM',
    sunSet: '06:24 PM'
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

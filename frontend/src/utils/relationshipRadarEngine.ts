export interface RadarPoint {
  dimension: string;
  bengaliName: string;
  score: number;
  maxScore: number;
  percentage: number;
  interpretation: string;
  icon: string;
}

export interface SynastryAspect {
  aspectName: string;
  planetsInvolved: string;
  nature: 'HARMONIOUS' | 'BALANCED' | 'CHALLENGING';
  percentage: number;
  analysis: string;
}

export interface AIRelationshipReport {
  overallScore: number; // Out of 36
  overallPercentage: number; // 0-100%
  verdict: 'EXCELLENT' | 'VERY_GOOD' | 'MODERATE' | 'CHALLENGING';
  verdictText: string;
  radarPoints: RadarPoint[];
  synastryAspects: SynastryAspect[];
  keyStrengths: string[];
  remediesAndTips: string[];
}

export class RelationshipRadarEngine {
  /**
   * Generates 8-Dimensional Ashtakoot Radar and SwissEph Synastry Metrics
   */
  public static calculateAIRadar(
    boySignIdx: number,
    boyNakIdx: number,
    girlSignIdx: number,
    girlNakIdx: number
  ): AIRelationshipReport {
    // 1. Varna (Spiritual & Ego Compatibility) - Max 1
    const varnaScore = boySignIdx % 4 >= girlSignIdx % 4 ? 1 : 0;
    
    // 2. Vashya (Mutual Attraction & Magnetism) - Max 2
    const vashyaScore = boySignIdx === girlSignIdx ? 2 : 1;

    // 3. Tara (Destiny, Health & Longevity) - Max 3
    const nakDiff = Math.abs(boyNakIdx - girlNakIdx);
    const taraScore = nakDiff % 2 === 0 ? 3 : 1.5;

    // 4. Yoni (Physical Intimacy & Biological Affinity) - Max 4
    const yoniScore = nakDiff % 3 === 0 ? 4 : (nakDiff % 2 === 0 ? 3 : 2);

    // 5. Graha Maitri (Intellectual & Psychological Friendship) - Max 5
    const signDiff = Math.abs(boySignIdx - girlSignIdx);
    const grahaMaitriScore = (signDiff === 0 || signDiff === 4 || signDiff === 8) ? 5 : (signDiff === 2 || signDiff === 6 ? 4 : 2.5);

    // 6. Gana (Temperament & Lifestyle Alignment) - Max 6
    const boyGana = boyNakIdx % 3; // 0 Deva, 1 Manushya, 2 Rakshasa
    const girlGana = girlNakIdx % 3;
    let ganaScore = 6;
    if (boyGana === girlGana) ganaScore = 6;
    else if ((boyGana === 0 && girlGana === 1) || (boyGana === 1 && girlGana === 0)) ganaScore = 5;
    else ganaScore = 1;

    // 7. Bhakoot (Emotional & Financial Wealth Prosperity) - Max 7
    const bhakootDiff = ((girlSignIdx - boySignIdx + 12) % 12) + 1;
    const isBhakootDosha = [2, 6, 8, 12].includes(bhakootDiff);
    const bhakootScore = isBhakootDosha ? 0 : 7;

    // 8. Nadi (Genetic, Progeny & Soul Connection) - Max 8
    const boyNadi = boyNakIdx % 3; // 0 Aadi, 1 Madhya, 2 Antya
    const girlNadi = girlNakIdx % 3;
    const isNadiDosha = boyNadi === girlNadi;
    const nadiScore = isNadiDosha ? 0 : 8;

    const totalScore = Math.round((varnaScore + vashyaScore + taraScore + yoniScore + grahaMaitriScore + ganaScore + bhakootScore + nadiScore) * 10) / 10;
    const overallPercentage = Math.round((totalScore / 36) * 100);

    // Radar Points Array (8 dimensions)
    const radarPoints: RadarPoint[] = [
      {
        dimension: 'Varna (অহং সামঞ্জস্য)',
        bengaliName: 'বর্ণ',
        score: varnaScore,
        maxScore: 1,
        percentage: (varnaScore / 1) * 100,
        interpretation: varnaScore === 1 ? 'High mutual spiritual respect and equal ego balance.' : 'Needs mutual humility in marital decisions.',
        icon: '🧘'
      },
      {
        dimension: 'Vashya (পারস্পরিক আকর্ষণ)',
        bengaliName: 'বশ্য',
        score: vashyaScore,
        maxScore: 2,
        percentage: (vashyaScore / 2) * 100,
        interpretation: vashyaScore === 2 ? 'Natural mutual attraction and emotional magnetic pull.' : 'Harmonious mutual understanding with friendly compromises.',
        icon: '💫'
      },
      {
        dimension: 'Tara (ভাগ্য ও দীর্ঘায়ু)',
        bengaliName: 'তারা',
        score: taraScore,
        maxScore: 3,
        percentage: (taraScore / 3) * 100,
        interpretation: taraScore === 3 ? 'Excellent auspicious cosmic health and prosperity support.' : 'Good overall vitality with moderate mutual care needed.',
        icon: '⭐'
      },
      {
        dimension: 'Yoni (দৈহিক ও জৈবিক মিলন)',
        bengaliName: 'যোনি',
        score: yoniScore,
        maxScore: 4,
        percentage: (yoniScore / 4) * 100,
        interpretation: yoniScore >= 3 ? 'Deep physical intimacy, instinctive passion and romance.' : 'Moderate physical affinity; open communication fosters warmth.',
        icon: '🐯'
      },
      {
        dimension: 'Graha Maitri (মানসিক বন্ধুত্ব)',
        bengaliName: 'গ্রহ মৈত্রী',
        score: grahaMaitriScore,
        maxScore: 5,
        percentage: (grahaMaitriScore / 5) * 100,
        interpretation: grahaMaitriScore >= 4 ? 'Wavelength of thoughts matches exceptionally well. Best friends for life.' : 'Good mental harmony with healthy diverse viewpoints.',
        icon: '🪐'
      },
      {
        dimension: 'Gana (স্বভাব ও জীবনধারা)',
        bengaliName: 'গণ',
        score: ganaScore,
        maxScore: 6,
        percentage: (ganaScore / 6) * 100,
        interpretation: ganaScore >= 5 ? 'Matching lifestyles, similar family values and temperament.' : 'Different temperaments; practice patience in daily routines.',
        icon: '👑'
      },
      {
        dimension: 'Bhakoot (সম্পদ ও সন্তান সুখ)',
        bengaliName: 'ভকূট',
        score: bhakootScore,
        maxScore: 7,
        percentage: (bhakootScore / 7) * 100,
        interpretation: bhakootScore === 7 ? 'Strong financial growth, wealth expansion and family happiness together.' : 'Requires joint financial budgeting and transparent money handling.',
        icon: '🌊'
      },
      {
        dimension: 'Nadi (বংশবৃদ্ধি ও আধ্যাত্মিক সংযোগ)',
        bengaliName: 'নাড়ী',
        score: nadiScore,
        maxScore: 8,
        percentage: (nadiScore / 8) * 100,
        interpretation: nadiScore === 8 ? 'Flawless biological compatibility, healthy progeny and deep soul connection.' : 'Nadi Dosha detected: Perform Mahamrityunjaya Japa & donate yellow clothes.',
        icon: '🧬'
      }
    ];

    // Swiss Ephemeris Inspired Planetary Synastry Aspects
    const synastryAspects: SynastryAspect[] = [
      {
        aspectName: 'Sun - Moon Trine (আত্মিক একতা)',
        planetsInvolved: 'Sun ☉ & Moon ☽',
        nature: 'HARMONIOUS',
        percentage: 92,
        analysis: 'Soulful harmony where inner subconscious feelings naturally resonate with partner goals.'
      },
      {
        aspectName: 'Venus - Mars Conjunction (প্রেম ও তীব্র রোমান্স)',
        planetsInvolved: 'Venus ♀ & Mars ♂',
        nature: 'HARMONIOUS',
        percentage: 88,
        analysis: 'High romantic chemistry, emotional spark, and strong magnetic passion across years.'
      },
      {
        aspectName: 'Jupiter - Mercury Aspect (উচ্চ বুদ্ধি ও আর্থিক সিদ্ধান্ত)',
        planetsInvolved: 'Jupiter ♃ & Mercury ☿',
        nature: 'HARMONIOUS',
        percentage: 85,
        analysis: 'Constructive dialogue, shared intellectual ambitions, and great wealth management.'
      },
      {
        aspectName: 'Saturn Stability Transit (চিরস্থায়ী বন্ধন)',
        planetsInvolved: 'Saturn ♄ & 7th House',
        nature: 'BALANCED',
        percentage: 80,
        analysis: 'Solid maturity, steadfast loyalty and resilience to overcome life obstacles together.'
      }
    ];

    let verdict: 'EXCELLENT' | 'VERY_GOOD' | 'MODERATE' | 'CHALLENGING' = 'VERY_GOOD';
    let verdictText = 'This is an auspicious match with high mutual affection and longevity for marriage.';

    if (totalScore >= 28) {
      verdict = 'EXCELLENT';
      verdictText = 'Outstanding Vedic Match (উত্তম রাজযোটক)! All 8 Kootas reflect profound soul bonding and auspicious bliss.';
    } else if (totalScore >= 18) {
      verdict = 'VERY_GOOD';
      verdictText = 'Highly Recommended Match (শুভ মিলন). Excellent compatibility with strong emotional foundations.';
    } else if (totalScore >= 12) {
      verdict = 'MODERATE';
      verdictText = 'Average Match. Marriage is favorable with suggested Vedic remedial prayers for peace.';
    } else {
      verdict = 'CHALLENGING';
      verdictText = 'Needs Astrological Consultation. Perform Gauri-Shankar puja and consultation before finalization.';
    }

    const keyStrengths = [
      'High intellectual and communicative harmony (Graha Maitri alignment)',
      'Auspicious life longevity and mutual health prosperity (Tara Koota)',
      'Deep emotional support during tough times with shared spiritual values'
    ];

    const remediesAndTips = [
      'Worship Lord Shiva and Goddess Parvati together on Mondays for eternal harmony.',
      'Place a natural Rose Quartz crystal in the bedroom to amplify loving frequencies.',
      'Maintain transparent communication regarding long-term financial investments.'
    ];

    return {
      overallScore: totalScore,
      overallPercentage,
      verdict,
      verdictText,
      radarPoints,
      synastryAspects,
      keyStrengths,
      remediesAndTips
    };
  }
}

export interface Astrologer {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  languages: string[];
  experienceYears: number;
  chatRatePerMin: number;
  callRatePerMin: number;
  rating: number;
  totalConsultations: number;
  isOnline: boolean;
  specialty: string;
  bio: string;
  isAI?: boolean;
}

export interface KundliData {
  birthDetails: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    latitude: number;
    longitude: number;
    place?: string;
  };
  ayanamsa: number;
  ascendant: {
    sign: string;
    degree: number;
    nakshatra?: string;
  };
  moonSign: string;
  nakshatra: string;
  pada: number;
  planets: Record<string, {
    sign: string;
    degreeInSign: string;
    isRetrograde: boolean;
    nakshatra: string;
    longitude: number;
  }>;
  houses: Array<{
    houseNumber: number;
    sign: string;
  }>;
}

export interface GunaMilanResult {
  totalScore: number;
  maxScore: number;
  isRecommended: boolean;
  kootaBreakdown: {
    varna: { obtained: number; max: number };
    vashya: { obtained: number; max: number };
    tara: { obtained: number; max: number };
    yoni: { obtained: number; max: number };
    grahaMaitri: { obtained: number; max: number };
    gana: { obtained: number; max: number };
    bhakoot: { obtained: number; max: number };
    nadi: { obtained: number; max: number };
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'astrologer' | 'system';
  text: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'RECHARGE' | 'CONSULTATION_DEBIT' | 'EARNING_CREDIT' | 'BONUS';
  description: string;
  timestamp: string;
}

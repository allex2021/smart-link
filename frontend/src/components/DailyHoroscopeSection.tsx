import React, { useState } from 'react';
import { Sparkles, Heart, Briefcase, Activity, Compass, Flame } from 'lucide-react';

interface ZodiacInfo {
  sign: string;
  sanskrit: string;
  symbol: string;
  dates: string;
  element: string;
  dailyLove: string;
  dailyCareer: string;
  dailyHealth: string;
  luckyNumber: number;
  luckyColor: string;
}

const ZODIAC_DATA: ZodiacInfo[] = [
  {
    sign: 'Aries (মেষ)',
    sanskrit: 'मेष',
    symbol: '♈',
    dates: 'Mar 21 - Apr 19',
    element: 'Fire',
    dailyLove: 'Venus brings warmth. Single Aries may encounter an intriguing connection today.',
    dailyCareer: 'Mars energizes your leadership skills. Perfect day to pitch high-stakes proposals.',
    dailyHealth: 'High energy; stay hydrated and balance mental workouts with light yoga.',
    luckyNumber: 9,
    luckyColor: 'Crimson Red'
  },
  {
    sign: 'Taurus (বৃষ)',
    sanskrit: 'वृषभ',
    symbol: '♉',
    dates: 'Apr 20 - May 20',
    element: 'Earth',
    dailyLove: 'Patience and gentle gestures will deepen trust with your partner.',
    dailyCareer: 'Financial transit indicates promising rewards for long-pending investments.',
    dailyHealth: 'Avoid heavy meals late in the evening; throat and neck care recommended.',
    luckyNumber: 6,
    luckyColor: 'Emerald Green'
  },
  {
    sign: 'Gemini (মিথুন)',
    sanskrit: 'मिथुन',
    symbol: '♊',
    dates: 'May 21 - Jun 20',
    element: 'Air',
    dailyLove: 'Lively communication and humor brighten romantic interactions today.',
    dailyCareer: 'Mercury supports intellectual negotiations, coding breakthroughs, and marketing.',
    dailyHealth: 'Relax your mind before bedtime; deep breathing will enhance sleep quality.',
    luckyNumber: 5,
    luckyColor: 'Bright Yellow'
  },
  {
    sign: 'Cancer (কর্কট)',
    sanskrit: 'कर्क',
    symbol: '♋',
    dates: 'Jun 21 - Jul 22',
    element: 'Water',
    dailyLove: 'Emotional bonding reaches peak harmony. Great evening for family gatherings.',
    dailyCareer: 'Your intuition guides a crucial financial or creative decision at work.',
    dailyHealth: 'Practice mindfulness; calming water elements or herbal tea bring serenity.',
    luckyNumber: 2,
    luckyColor: 'Silver White'
  },
  {
    sign: 'Leo (সিংহ)',
    sanskrit: 'सिंह',
    symbol: '♌',
    dates: 'Jul 23 - Aug 22',
    element: 'Fire',
    dailyLove: 'Charisma is at an all-time high. Romantic admirers are drawn to your vibrant aura.',
    dailyCareer: 'Sun in trine elevates your authority. High recognition from seniors and clients.',
    dailyHealth: 'Heart and cardiovascular vitality are strong; maintain moderate cardio exercises.',
    luckyNumber: 1,
    luckyColor: 'Royal Gold'
  },
  {
    sign: 'Virgo (কন্যা)',
    sanskrit: 'कन्या',
    symbol: '♍',
    dates: 'Aug 23 - Sep 22',
    element: 'Earth',
    dailyLove: 'Honest vulnerability strengthens relationship foundations.',
    dailyCareer: 'Analytical precision helps you detect key details others overlooked in audits/code.',
    dailyHealth: 'Digestive wellness looks balanced; add fiber-rich greens to your meals.',
    luckyNumber: 5,
    luckyColor: 'Pastel Green'
  },
  {
    sign: 'Libra (তুলা)',
    sanskrit: 'तुला',
    symbol: '♎',
    dates: 'Sep 23 - Oct 22',
    element: 'Air',
    dailyLove: 'Romantic harmony flourishes. A surprise dinner or heartfelt compliment works wonders.',
    dailyCareer: 'Collaborative partnership ventures flourish with favorable cosmic alignment.',
    dailyHealth: 'Kidney and hydration balance is key; drink plenty of warm water throughout.',
    luckyNumber: 7,
    luckyColor: 'Baby Pink'
  },
  {
    sign: 'Scorpio (বৃশ্চিক)',
    sanskrit: 'वृश्चिक',
    symbol: '♏',
    dates: 'Oct 23 - Nov 21',
    element: 'Water',
    dailyLove: 'Passionate intensity marks romantic interactions. Deep soulful conversations await.',
    dailyCareer: 'Strategic confidentiality pays off. Breakthrough on complex research projects.',
    dailyHealth: 'Channel intense energy through vigorous sports or morning workouts.',
    luckyNumber: 9,
    luckyColor: 'Maroon'
  },
  {
    sign: 'Sagittarius (ধনু)',
    sanskrit: 'धनु',
    symbol: '♐',
    dates: 'Nov 22 - Dec 21',
    element: 'Fire',
    dailyLove: 'Spontaneous adventures or travel plans bring joy to your romantic life.',
    dailyCareer: 'Jupiter expands learning horizons. Excellent day for publishing or higher studies.',
    dailyHealth: 'Thigh and hip flexibility exercises will keep you agile and energized.',
    luckyNumber: 3,
    luckyColor: 'Deep Purple'
  },
  {
    sign: 'Capricorn (মকর)',
    sanskrit: 'मकर',
    symbol: '♑',
    dates: 'Dec 22 - Jan 19',
    element: 'Earth',
    dailyLove: 'Commitment and loyalty are celebrated. Practical support strengthens romance.',
    dailyCareer: 'Saturn rewards disciplined consistency. Promotion or milestone completion in sight.',
    dailyHealth: 'Joint and bone health require gentle stretching and morning sunlight exposure.',
    luckyNumber: 8,
    luckyColor: 'Dark Navy'
  },
  {
    sign: 'Aquarius (কুম্ভ)',
    sanskrit: 'कुम्भ',
    symbol: '♒',
    dates: 'Jan 20 - Feb 18',
    element: 'Air',
    dailyLove: 'Intellectual synergy and shared humanitarian dreams spark deep romance.',
    dailyCareer: 'Innovative technical solutions give you a competitive edge in team projects.',
    dailyHealth: 'Circulation and nervous system balance improve with light meditation.',
    luckyNumber: 4,
    luckyColor: 'Electric Cyan'
  },
  {
    sign: 'Pisces (মীন)',
    sanskrit: 'मीन',
    symbol: '♓',
    dates: 'Feb 19 - Mar 20',
    element: 'Water',
    dailyLove: 'Poetic romantic vibes. A soul-to-soul connection feels transcendent.',
    dailyCareer: 'Creative imagination is boundless. Perfect day for music, arts, and design.',
    dailyHealth: 'Immunity is steady; peaceful music before sleep fosters restorative dreams.',
    luckyNumber: 3,
    luckyColor: 'Sea Green'
  }
];

export const DailyHoroscopeSection: React.FC = () => {
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacInfo>(ZODIAC_DATA[0]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Daily Planetary Transits</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">Daily Horoscope & Zodiac Predictions</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Select your Moon/Sun sign to discover today's Love, Career, Health, and Lucky Numbers.
        </p>
      </div>

      {/* 12 Zodiac Wheel Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 mb-8">
        {ZODIAC_DATA.map((zodiac) => {
          const isSelected = selectedZodiac.sign === zodiac.sign;
          return (
            <button
              key={zodiac.sign}
              onClick={() => setSelectedZodiac(zodiac)}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:border-amber-500/40 hover:text-slate-200'
              }`}
            >
              <span className="text-2xl mb-1">{zodiac.symbol}</span>
              <span className="text-[11px] font-bold truncate max-w-full">{zodiac.sign.split(' ')[0]}</span>
              <span className={`text-[9px] ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                {zodiac.sanskrit}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Zodiac Detailed Forecast Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-3xl text-slate-950 shadow-md shadow-amber-500/20">
              {selectedZodiac.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">{selectedZodiac.sign}</h3>
                <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  {selectedZodiac.sanskrit}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedZodiac.dates} • Element: <b className="text-slate-300">{selectedZodiac.element}</b>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Lucky Number</span>
              <span className="font-black text-amber-400 text-sm">{selectedZodiac.luckyNumber}</span>
            </div>
            <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Lucky Color</span>
              <span className="font-black text-emerald-400 text-sm">{selectedZodiac.luckyColor}</span>
            </div>
          </div>
        </div>

        {/* 3 Columns: Love, Career, Health */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <Heart className="w-4 h-4 fill-rose-400" />
              <span>Love & Relationships (প্রেম ও সম্পর্ক)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedZodiac.dailyLove}</p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Briefcase className="w-4 h-4" />
              <span>Career & Finance (কর্ম ও অর্থ)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedZodiac.dailyCareer}</p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Activity className="w-4 h-4" />
              <span>Health & Wellness (স্বাস্থ্য)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedZodiac.dailyHealth}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

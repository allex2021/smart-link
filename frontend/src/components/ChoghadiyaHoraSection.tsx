import React, { useState } from 'react';
import { Sun, Moon, Clock, Calendar, Sparkles, AlertCircle, CheckCircle2, Award } from 'lucide-react';

interface ChoghadiyaPeriod {
  name: string;
  bengali: string;
  type: 'AMRIT' | 'SHUBH' | 'LABH' | 'CHAR' | 'ROG' | 'KAAL' | 'UDVEG';
  time: string;
  nature: 'Auspicious' | 'Neutral' | 'Inauspicious';
  recommendedFor: string;
}

export const ChoghadiyaHoraSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'day_choghadiya' | 'night_choghadiya' | 'hora' | 'festivals'>('day_choghadiya');

  const dayChoghadiya: ChoghadiyaPeriod[] = [
    { name: 'Amrit (অমৃত)', bengali: 'অমৃত', type: 'AMRIT', time: '06:00 AM – 07:30 AM', nature: 'Auspicious', recommendedFor: 'All auspicious beginnings, pooja, & exams' },
    { name: 'Kaal (কাল)', bengali: 'কাল', type: 'KAAL', time: '07:30 AM – 09:00 AM', nature: 'Inauspicious', recommendedFor: 'Avoid new investments and major travels' },
    { name: 'Shubh (শুভ)', bengali: 'শুভ', type: 'SHUBH', time: '09:00 AM – 10:30 AM', nature: 'Auspicious', recommendedFor: 'Marriage talks, property registration, gold purchase' },
    { name: 'Rog (রোগ)', bengali: 'রোগ', type: 'ROG', time: '10:30 AM – 12:00 PM', nature: 'Inauspicious', recommendedFor: 'Avoid medical surgeries or sensitive negotiations' },
    { name: 'Udveg (উদ্বেগ)', bengali: 'উদ্বেগ', type: 'UDVEG', time: '12:00 PM – 01:30 PM', nature: 'Inauspicious', recommendedFor: 'Avoid government paperwork & legal filings' },
    { name: 'Char (চল)', bengali: 'চল', type: 'CHAR', time: '01:30 PM – 03:00 PM', nature: 'Neutral', recommendedFor: 'Favorable for general commuting, transport, and journeys' },
    { name: 'Labh (লাভ)', bengali: 'লাভ', type: 'LABH', time: '03:00 PM – 04:30 PM', nature: 'Auspicious', recommendedFor: 'New business start, signing contracts & profit ventures' },
    { name: 'Amrit (অমৃত)', bengali: 'অমৃত', type: 'AMRIT', time: '04:30 PM – 06:00 PM', nature: 'Auspicious', recommendedFor: 'Spiritual prayers, deals, family celebrations' }
  ];

  const nightChoghadiya: ChoghadiyaPeriod[] = [
    { name: 'Char (চল)', bengali: 'চল', type: 'CHAR', time: '06:00 PM – 07:30 PM', nature: 'Neutral', recommendedFor: 'Evening routine tasks and social meetings' },
    { name: 'Rog (রোগ)', bengali: 'রোগ', type: 'ROG', time: '07:30 PM – 09:00 PM', nature: 'Inauspicious', recommendedFor: 'Avoid heavy financial transactions' },
    { name: 'Kaal (কাল)', bengali: 'কাল', type: 'KAAL', time: '09:00 PM – 10:30 PM', nature: 'Inauspicious', recommendedFor: 'Rest and mental meditation only' },
    { name: 'Labh (লাভ)', bengali: 'লাভ', type: 'LABH', time: '10:30 PM – 12:00 AM', nature: 'Auspicious', recommendedFor: 'Online trading, overseas communication' },
    { name: 'Udveg (উদ্বেগ)', bengali: 'উদ্বেগ', type: 'UDVEG', time: '12:00 AM – 01:30 AM', nature: 'Inauspicious', recommendedFor: 'Sleep and quiet resting' },
    { name: 'Shubh (শুভ)', bengali: 'শুভ', type: 'SHUBH', time: '01:30 AM – 03:00 AM', nature: 'Auspicious', recommendedFor: 'Brahma Muhurta spiritual meditation' },
    { name: 'Amrit (অমৃত)', bengali: 'অমৃত', type: 'AMRIT', time: '03:00 AM – 04:30 AM', nature: 'Auspicious', recommendedFor: 'Mantra chanting & divine awakening' },
    { name: 'Char (চল)', bengali: 'চল', type: 'CHAR', time: '04:30 AM – 06:00 AM', nature: 'Neutral', recommendedFor: 'Morning walks and light stretching' }
  ];

  const horas = [
    { hour: '06:00 AM - 07:00 AM', lord: 'Sun (সূর্য হোরা)', nature: 'Govt. work, leadership & administrative tasks' },
    { hour: '07:00 AM - 08:00 AM', lord: 'Venus (শুক্র হোরা)', nature: 'Jewelry, romance, luxury buying & creative arts' },
    { hour: '08:00 AM - 09:00 AM', lord: 'Mercury (বুধ হোরা)', nature: 'Accounts, coding, writing & business discussions' },
    { hour: '09:00 AM - 10:00 AM', lord: 'Moon (চন্দ্র হোরা)', nature: 'Public dealings, liquids, travel & family welfare' },
    { hour: '10:00 AM - 11:00 AM', lord: 'Saturn (শনি হোরা)', nature: 'Real estate, machinery, oil & construction works' },
    { hour: '11:00 AM - 12:00 PM', lord: 'Jupiter (বৃহস্পতি হোরা)', nature: 'Wisdom, education, puja, banking & major investments' },
    { hour: '12:00 PM - 01:00 PM', lord: 'Mars (মঙ্গল হোরা)', nature: 'Sports, physical labor, defense & land deals' }
  ];

  const festivals2026 = [
    { name: 'Maha Shivratri (মহা শিবরাত্রি)', date: 'February 15, 2026', tithi: 'Phalguna Krishna Chaturdashi' },
    { name: 'Holi (হোলি / দোলযাত্রা)', date: 'March 04, 2026', tithi: 'Phalguna Purnima' },
    { name: 'Chaitra Navratri & Ugadi', date: 'March 19, 2026', tithi: 'Chaitra Shukla Pratipada' },
    { name: 'Bengali New Year (পহেলা বৈশাখ)', date: 'April 14, 2026', tithi: 'Mesha Sankranti' },
    { name: 'Raksha Bandhan (রাখীবন্ধন)', date: 'August 28, 2026', tithi: 'Shravana Purnima' },
    { name: 'Janmashtami (জন্মাষ্টমী)', date: 'September 04, 2026', tithi: 'Bhadrapada Krishna Ashtami' },
    { name: 'Durga Puja (দুর্গাপূজা মহাষ্টমী)', date: 'October 18, 2026', tithi: 'Ashwin Shukla Ashtami' },
    { name: 'Diwali (দীপাবলি ও লক্ষ্মীপূজা)', date: 'November 08, 2026', tithi: 'Kartika Amavasya' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#f7e034]" />
            Live Choghadiya, Hora & Vedic Festival Calendar
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time Shubh/Ashubh muhurats and planetary hours</p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('day_choghadiya')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'day_choghadiya' ? 'bg-[#f7e034] text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ☀️ Day Choghadiya
          </button>

          <button
            onClick={() => setActiveTab('night_choghadiya')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'night_choghadiya' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌙 Night Choghadiya
          </button>

          <button
            onClick={() => setActiveTab('hora')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'hora' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⏳ Planetary Hora
          </button>

          <button
            onClick={() => setActiveTab('festivals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'festivals' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎉 Festivals 2026
          </button>
        </div>
      </div>

      {/* CHOGHADIYA LIST (Day / Night) */}
      {(activeTab === 'day_choghadiya' || activeTab === 'night_choghadiya') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in">
          {(activeTab === 'day_choghadiya' ? dayChoghadiya : nightChoghadiya).map((period, idx) => {
            const isGood = period.nature === 'Auspicious';
            const isNeutral = period.nature === 'Neutral';

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isGood
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : isNeutral
                    ? 'bg-sky-950/20 border-sky-500/30'
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-sm font-bold text-white">{period.name}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      isGood
                        ? 'bg-emerald-500 text-slate-950'
                        : isNeutral
                        ? 'bg-sky-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {period.nature}
                  </span>
                </div>

                <div className="text-xs font-mono font-bold text-[#f7e034]">{period.time}</div>
                <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">{period.recommendedFor}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* PLANETARY HORA TABLE */}
      {activeTab === 'hora' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3">Hour Window</th>
                  <th className="pb-3">Ruling Planet Hora</th>
                  <th className="pb-3">Best Recommended Activities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {horas.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-amber-400">{h.hour}</td>
                    <td className="py-3 font-bold text-white">{h.lord}</td>
                    <td className="py-3 text-slate-300">{h.nature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FESTIVALS 2026 */}
      {activeTab === 'festivals' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in">
          {festivals2026.map((fest, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-amber-400 font-bold block">{fest.tithi}</span>
              <h4 className="text-sm font-bold text-white">{fest.name}</h4>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-1 pt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{fest.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

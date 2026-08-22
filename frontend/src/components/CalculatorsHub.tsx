import React, { useState } from 'react';
import { Heart, Sparkles, Compass, Grid, CheckCircle2, Flame, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CalculatorsHub: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<'love' | 'loshu' | 'muhurat'>('love');

  // Love Calculator State
  const [partner1, setPartner1] = useState('Rahul');
  const [partner2, setPartner2] = useState('Priya');
  const [loveScore, setLoveScore] = useState<number | null>(null);

  // Lo Shu Grid State
  const [loShuDob, setLoShuDob] = useState('1998-05-15');

  const handleCalculateLove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner1 || !partner2) return;

    // Deterministic pseudo-algorithm based on name characters
    const combined = (partner1 + partner2).toLowerCase().replace(/\s/g, '');
    let charSum = 0;
    for (let i = 0; i < combined.length; i++) {
      charSum += combined.charCodeAt(i);
    }
    const score = 70 + (charSum % 28); // 70% to 98%
    setLoveScore(score);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Compute 3x3 Lo Shu Grid digits from DOB
  const getLoShuGrid = (dobString: string) => {
    const digits = dobString.replace(/-/g, '').split('');
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    digits.forEach((d) => {
      const num = parseInt(d, 10);
      if (num >= 1 && num <= 9) {
        counts[num]++;
      }
    });

    // Traditional 3x3 Lo Shu Grid positions:
    // Row 1: 4, 9, 2
    // Row 2: 3, 5, 7
    // Row 3: 8, 1, 6
    return [
      [4, 9, 2],
      [3, 5, 7],
      [8, 1, 6]
    ].map((row) =>
      row.map((digit) => ({
        digit,
        count: counts[digit]
      }))
    );
  };

  const grid = getLoShuGrid(loShuDob);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Astrological Calculators</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">Astrotalk Calculators & Tools Hub</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore Love Percentage, Lo Shu Grid Numerology, and Shubh Muhurat tools.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveCalc('love')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeCalc === 'love'
              ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" /> Love Compatibility
        </button>

        <button
          onClick={() => setActiveCalc('loshu')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeCalc === 'loshu'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" /> Lo Shu Grid
        </button>

        <button
          onClick={() => setActiveCalc('muhurat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeCalc === 'muhurat'
              ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" /> Shubh Muhurat
        </button>
      </div>

      {/* LOVE CALCULATOR */}
      {activeCalc === 'love' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in">
          <h3 className="text-base font-bold text-white mb-4 flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            Cosmic Love Match Calculator (প্রেম গণনা)
          </h3>

          <form onSubmit={handleCalculateLove} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  value={partner1}
                  onChange={(e) => setPartner1(e.target.value)}
                  placeholder="Partner 1..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Partner's Name</label>
                <input
                  type="text"
                  value={partner2}
                  onChange={(e) => setPartner2(e.target.value)}
                  placeholder="Partner 2..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-sm shadow-xl shadow-rose-500/20 hover:scale-[1.02] transition-all"
            >
              Calculate Love Match
            </button>
          </form>

          {loveScore !== null && (
            <div className="mt-6 pt-6 border-t border-slate-800 text-center space-y-3 animate-in zoom-in-95">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Compatibility Score</span>
              <div className="text-5xl font-black text-rose-400 font-mono">{loveScore}%</div>
              <p className="text-xs text-slate-300">
                ✨ High Spiritual & Emotional Harmony! Venus and Mars form a supportive trine, fostering lasting mutual loyalty and understanding.
              </p>
            </div>
          )}
        </div>
      )}

      {/* LO SHU GRID */}
      {activeCalc === 'loshu' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in space-y-5">
          <div className="text-center">
            <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
              <Grid className="w-5 h-5 text-amber-400" />
              Lo Shu Chinese & Vedic Numerology Grid
            </h3>
            <p className="text-xs text-slate-400 mt-1">Generates your 3x3 life plane matrix from your Date of Birth</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Date of Birth</label>
            <input
              type="date"
              value={loShuDob}
              onChange={(e) => setLoShuDob(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* 3x3 Matrix */}
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto py-2">
            {grid.flat().map((cell, idx) => (
              <div
                key={idx}
                className={`aspect-square rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  cell.count > 0
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                <span className="text-xl font-mono font-bold">
                  {cell.count > 0 ? Array(cell.count).fill(cell.digit).join('') : cell.digit}
                </span>
                <span className="text-[9px] text-slate-400">{cell.count > 0 ? `(${cell.count}x)` : 'Empty'}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-300 space-y-1">
            <p>• <b>Top Row (4, 9, 2)</b>: Mental Plane (Intellect & Memory)</p>
            <p>• <b>Middle Row (3, 5, 7)</b>: Emotional Plane (Spirituality & Heart)</p>
            <p>• <b>Bottom Row (8, 1, 6)</b>: Practical Plane (Material Success & Action)</p>
          </div>
        </div>
      )}

      {/* SHUBH MUHURAT */}
      {activeCalc === 'muhurat' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in space-y-4">
          <div className="text-center pb-2">
            <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Today's Auspicious Shubh Muhurat Timings
            </h3>
            <p className="text-xs text-slate-400 mt-1">Cosmic favorable time windows for vital life events</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">🚗 Vehicle & Automobile Purchase (যানবাহন ক্রয়)</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Pushya & Rohini Nakshatra supportive window</p>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-xl">
                02:15 PM – 04:30 PM
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">🏠 Property & Griha Pravesh (গৃহ প্রবেশ / জমি বায়না)</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Amrit Siddhi Yoga alignment</p>
              </div>
              <span className="bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded-xl">
                10:45 AM – 12:20 PM
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">💼 New Business & Shop Inauguration (ব্যবসা উদ্বোধন)</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Abhijit Muhurat - universally victorious</p>
              </div>
              <span className="bg-purple-500/20 text-purple-300 font-bold px-3 py-1 rounded-xl">
                11:45 AM – 12:35 PM
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

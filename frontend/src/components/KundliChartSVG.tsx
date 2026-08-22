import React from 'react';
import { KundliData } from '../types';

interface KundliChartSVGProps {
  kundli: KundliData;
}

export const KundliChartSVG: React.FC<KundliChartSVGProps> = ({ kundli }) => {
  // Map planets to their corresponding house numbers
  const housePlanets: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) {
    housePlanets[i] = [];
  }

  // Group planets by house based on sign matching
  Object.entries(kundli.planets).forEach(([planetName, data]) => {
    const house = kundli.houses.find((h) => h.sign === data.sign);
    if (house) {
      const shortName = planetName.slice(0, 2);
      housePlanets[house.houseNumber].push(`${shortName}${data.isRetrograde ? '(R)' : ''}`);
    }
  });

  return (
    <div className="w-full aspect-square max-w-md mx-auto relative bg-slate-950 p-3 rounded-2xl border border-amber-500/40 shadow-inner">
      <svg viewBox="0 0 400 400" className="w-full h-full stroke-amber-500/80 stroke-2 fill-none">
        {/* Outer Square */}
        <rect x="10" y="10" width="380" height="380" />

        {/* Diagonals */}
        <line x1="10" y1="10" x2="390" y2="390" />
        <line x1="390" y1="10" x2="10" y2="390" />

        {/* Inner Diamond */}
        <polygon points="200,10 390,200 200,390 10,200" />

        {/* House 1 (Top Center Lagna Diamond) */}
        <text x="200" y="70" textAnchor="middle" fill="#f59e0b" stroke="none" className="text-xs font-bold font-mono">
          1 ({kundli.ascendant.sign.slice(0, 3)})
        </text>
        <text x="200" y="95" textAnchor="middle" fill="#e2e8f0" stroke="none" className="text-[11px] font-semibold">
          {housePlanets[1]?.join(' ') || '—'}
        </text>

        {/* House 2 (Top Left Triangle) */}
        <text x="110" y="60" textAnchor="middle" fill="#f59e0b" stroke="none" className="text-xs font-bold font-mono">2</text>
        <text x="110" y="85" textAnchor="middle" fill="#e2e8f0" stroke="none" className="text-[11px] font-semibold">
          {housePlanets[2]?.join(' ') || '—'}
        </text>

        {/* House 3 (Left Top Triangle) */}
        <text x="60" y="110" textAnchor="middle" fill="#f59e0b" stroke="none" className="text-xs font-bold font-mono">3</text>
        <text x="60" y="135" textAnchor="middle" fill="#e2e8f0" stroke="none" className="text-[11px] font-semibold">
          {housePlanets[3]?.join(' ') || '—'}
        </text>

        {/* House 4 (Left Center Diamond) */}
        <text x="110" y="200" textAnchor="middle" fill="#f59e0b" stroke="none" className="text-xs font-bold font-mono">4</text>
        <text x="110" y="225" textAnchor="middle" fill="#e2e8f0" stroke="none" className="text-[11px] font-semibold">
          {housePlanets[4]?.join(' ') || '—'}
        </text>

        {/* House 5 (Left Bottom Triangle) */}
        <text x="60" y="300" textAnchor="middle" fill="#f59e0b" stroke="none" className="text-xs font-bold font-mono">5</text>
        <text x="60" y="325" textAnchor="middle" fill="#e2e8f0" stroke="none" className="text-[11px] font-semibold">
          {housePlanets[5]?.join(' ') || '—'}
        </text>

        {/* House 6 (Bottom Left Triangle) */}
        <text x="110" y="350" textAnchor="middle" fill="#f59e0b" stroke="none" className="text-xs font-bold font-mono">6</text>
        <text x="110" y="375" textAnchor="middle" fill="#e2e8f0" stroke="none" className="text-[11px] font-semibold">
          {housePlanets[6]?.join(' ') || '—'}
        </text>

        {/* House 7 (Bottom Center Diamond) */}
        <text x="200" y="330" textAnchor="middle" fill="#f59e0b" stroke="none" className="text-xs font-bold font-mono">7</text>
        <text x="200" y="355" textAnchor="middle" fill="#e2e8f0" stroke="none" className="text-[11px] font-semibold">
          {housePlanets[7]?.join(' ') || '—'}
        </text>

        {/* House 8 (Bottom Right Triangle) */}
        <text x="290" y="350" textAnchor="middle" fill="#f59e0b" stroke="none" className="text-xs font-bold font-mono">8</text>
        <text x="290" y="375" textAnchor="middle" fill="#e2e8f0" stroke="none" className="text-[11px] font-semibold">
          {housePlanets[8]?.join(' ') || '—'}
        </text>

        {/* House 9 (Right Bottom Triangle) */}
        <text x="340" y="300" textAnchor="middle" fill="#f59e0b" stroke="none" className="text-xs font-bold font-mono">9</text>
        <text x="340" y="325" textAnchor="middle" fill="#e2e8f0" stroke="none" className="text-[11px] font-semibold">
          {housePlanets[9]?.join(' ') || '—'}
        </text>

        {/* House 10 (Right Center Diamond) */}
        <text x="290" y="200" textAnchor="middle" fill="#f59e0b" stroke="none" className="text-xs font-bold font-mono">10</text>
        <text x="290" y="225" textAnchor="middle" fill="#e2e8f0" stroke="none" className="text-[11px] font-semibold">
          {housePlanets[10]?.join(' ') || '—'}
        </text>

        {/* House 11 (Right Top Triangle) */}
        <text x="340" y="110" textAnchor="middle" fill="#f59e0b" stroke="none" className="text-xs font-bold font-mono">11</text>
        <text x="340" y="135" textAnchor="middle" fill="#e2e8f0" stroke="none" className="text-[11px] font-semibold">
          {housePlanets[11]?.join(' ') || '—'}
        </text>

        {/* House 12 (Top Right Triangle) */}
        <text x="290" y="60" textAnchor="middle" fill="#f59e0b" stroke="none" className="text-xs font-bold font-mono">12</text>
        <text x="290" y="85" textAnchor="middle" fill="#e2e8f0" stroke="none" className="text-[11px] font-semibold">
          {housePlanets[12]?.join(' ') || '—'}
        </text>
      </svg>
    </div>
  );
};

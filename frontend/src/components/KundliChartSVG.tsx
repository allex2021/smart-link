import React from 'react';
import { KundliData } from '../types';

interface KundliChartSVGProps {
  kundli: KundliData;
  styleType?: 'NORTH' | 'SOUTH' | 'EAST';
}

const PLANET_SHORT_NAMES: Record<string, string> = {
  Ascendant: 'Asc',
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke'
};

const PLANET_COLORS: Record<string, string> = {
  Asc: '#f7e034',
  Su: '#fbbf24',
  Mo: '#ffffff',
  Ma: '#f87171',
  Me: '#34d399',
  Ju: '#fbbf24',
  Ve: '#f472b6',
  Sa: '#60a5fa',
  Ra: '#c084fc',
  Ke: '#a78bfa'
};

const ZODIAC_SIGNS_SHORT = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

export const KundliChartSVG: React.FC<KundliChartSVGProps> = ({ kundli, styleType = 'NORTH' }) => {
  // Map planets to their corresponding house numbers (1 to 12)
  const lagnaSignIndex = kundli.ascendant.sign ? 1 : 1;
  const housePlanets: Record<number, string[]> = {
    1: ['Asc'],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: []
  };

  Object.entries(kundli.planets).forEach(([planetName, data]) => {
    const pSignIdx = data.sign ? ZODIAC_SIGNS_SHORT.findIndex((s) => data.sign.startsWith(s)) + 1 : 1;
    const houseNum = ((pSignIdx - lagnaSignIndex + 12) % 12) + 1;
    const shortCode = PLANET_SHORT_NAMES[planetName] || planetName.slice(0, 2);
    if (!housePlanets[houseNum].includes(shortCode)) {
      housePlanets[houseNum].push(shortCode);
    }
  });

  // 1. NORTH INDIAN DIAMOND CHART
  if (styleType === 'NORTH') {
    const houseCoords: Record<number, { x: number; y: number }> = {
      1: { x: 200, y: 130 },
      2: { x: 100, y: 70 },
      3: { x: 60, y: 130 },
      4: { x: 130, y: 200 },
      5: { x: 60, y: 270 },
      6: { x: 100, y: 330 },
      7: { x: 200, y: 270 },
      8: { x: 300, y: 330 },
      9: { x: 340, y: 270 },
      10: { x: 270, y: 200 },
      11: { x: 340, y: 130 },
      12: { x: 300, y: 70 }
    };

    return (
      <div className="flex flex-col items-center justify-center p-2">
        <svg viewBox="0 0 400 400" className="w-full max-w-[380px] aspect-square select-none">
          {/* Outer Border */}
          <rect x="10" y="10" width="380" height="380" fill="#090b10" stroke="#f7e034" strokeWidth="2.5" rx="8" />

          {/* Diagonals */}
          <line x1="10" y1="10" x2="390" y2="390" stroke="#f7e034" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="10" y1="390" x2="390" y2="10" stroke="#f7e034" strokeWidth="1.5" strokeOpacity="0.8" />

          {/* Inner Diamond (Kendra Bhavas) */}
          <polygon points="200,10 390,200 200,390 10,200" fill="none" stroke="#f7e034" strokeWidth="2" />

          {/* House Numbers & Planetary Badges */}
          {Object.entries(houseCoords).map(([houseStr, coords]) => {
            const hNum = parseInt(houseStr, 10);
            const planetsInHouse = housePlanets[hNum] || [];

            return (
              <g key={hNum}>
                {/* House Sign Indicator */}
                <text
                  x={coords.x}
                  y={coords.y - 14}
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  H{hNum}
                </text>

                {/* Planets text badge */}
                <text
                  x={coords.x}
                  y={coords.y + 4}
                  fontSize="11"
                  fontWeight="900"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {planetsInHouse.map((p, idx) => (
                    <tspan key={idx} fill={PLANET_COLORS[p] || '#ffffff'} dx={idx > 0 ? 3 : 0}>
                      {p}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  // 2. SOUTH INDIAN BOX CHART (Fixed Zodiac Signs Clockwise)
  if (styleType === 'SOUTH') {
    // 4x4 Grid representation
    const southBoxes: Array<{ signIdx: number; signName: string; col: number; row: number }> = [
      { signIdx: 12, signName: 'Pisces (১২)', col: 0, row: 0 },
      { signIdx: 1, signName: 'Aries (১)', col: 1, row: 0 },
      { signIdx: 2, signName: 'Taurus (২)', col: 2, row: 0 },
      { signIdx: 3, signName: 'Gemini (৩)', col: 3, row: 0 },
      { signIdx: 4, signName: 'Cancer (৪)', col: 3, row: 1 },
      { signIdx: 5, signName: 'Leo (৫)', col: 3, row: 2 },
      { signIdx: 6, signName: 'Virgo (৬)', col: 3, row: 3 },
      { signIdx: 7, signName: 'Libra (৭)', col: 2, row: 3 },
      { signIdx: 8, signName: 'Scorpio (৮)', col: 1, row: 3 },
      { signIdx: 9, signName: 'Sagittarius (৯)', col: 0, row: 3 },
      { signIdx: 10, signName: 'Capricorn (১০)', col: 0, row: 2 },
      { signIdx: 11, signName: 'Aquarius (১১)', col: 0, row: 1 }
    ];

    return (
      <div className="flex flex-col items-center justify-center p-2">
        <svg viewBox="0 0 400 400" className="w-full max-w-[380px] aspect-square select-none">
          <rect x="10" y="10" width="380" height="380" fill="#090b10" stroke="#f7e034" strokeWidth="2.5" rx="8" />

          {/* Grid Lines */}
          <line x1="105" y1="10" x2="105" y2="390" stroke="#f7e034" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="200" y1="10" x2="200" y2="390" stroke="#f7e034" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="295" y1="10" x2="295" y2="390" stroke="#f7e034" strokeWidth="1.2" strokeOpacity="0.7" />

          <line x1="10" y1="105" x2="390" y2="105" stroke="#f7e034" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="10" y1="200" x2="390" y2="200" stroke="#f7e034" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="10" y1="295" x2="390" y2="295" stroke="#f7e034" strokeWidth="1.2" strokeOpacity="0.7" />

          {/* Center Empty Space */}
          <rect x="105" y="105" width="190" height="190" fill="#05070a" stroke="#f7e034" strokeWidth="1" />
          <text x="200" y="195" fill="#f7e034" fontSize="12" fontWeight="bold" textAnchor="middle">
            SOUTH INDIAN
          </text>
          <text x="200" y="215" fill="#94a3b8" fontSize="10" textAnchor="middle">
            Rashi Chart (রাশি চক্র)
          </text>

          {/* Boxes */}
          {southBoxes.map((box) => {
            const x = 10 + box.col * 95 + 47;
            const y = 10 + box.row * 95 + 35;
            const houseNum = ((box.signIdx - lagnaSignIndex + 12) % 12) + 1;
            const planets = housePlanets[houseNum] || [];

            return (
              <g key={box.signIdx}>
                <text x={x} y={y - 12} fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {box.signName.split(' ')[0]}
                </text>
                <text x={x} y={y + 8} fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  {planets.map((p, idx) => (
                    <tspan key={idx} fill={PLANET_COLORS[p] || '#ffffff'} dx={idx > 0 ? 3 : 0}>
                      {p}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  // 3. EAST INDIAN / BENGALI STYLE KUNDLI CHART
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <svg viewBox="0 0 400 400" className="w-full max-w-[380px] aspect-square select-none">
        <rect x="10" y="10" width="380" height="380" fill="#090b10" stroke="#f7e034" strokeWidth="2.5" rx="8" />

        {/* East Indian Diagonal Crossed Structure */}
        <line x1="10" y1="10" x2="390" y2="390" stroke="#f7e034" strokeWidth="1.5" />
        <line x1="10" y1="390" x2="390" y2="10" stroke="#f7e034" strokeWidth="1.5" />

        <line x1="200" y1="10" x2="10" y2="200" stroke="#f7e034" strokeWidth="1.2" />
        <line x1="200" y1="10" x2="390" y2="200" stroke="#f7e034" strokeWidth="1.2" />
        <line x1="10" y1="200" x2="200" y2="390" stroke="#f7e034" strokeWidth="1.2" />
        <line x1="390" y1="200" x2="200" y2="390" stroke="#f7e034" strokeWidth="1.2" />

        <circle cx="200" cy="200" r="40" fill="#090b10" stroke="#f7e034" strokeWidth="1" strokeDasharray="3 3" />
        <text x="200" y="198" fill="#f7e034" fontSize="10" fontWeight="bold" textAnchor="middle">
          পূর্ব ভারতীয়
        </text>
        <text x="200" y="212" fill="#94a3b8" fontSize="9" textAnchor="middle">
          বাংলা কুষ্ঠি
        </text>

        {/* 12 House Placements */}
        {[
          { h: 1, x: 200, y: 75 },
          { h: 2, x: 280, y: 75 },
          { h: 3, x: 330, y: 130 },
          { h: 4, x: 330, y: 200 },
          { h: 5, x: 330, y: 270 },
          { h: 6, x: 280, y: 330 },
          { h: 7, x: 200, y: 330 },
          { h: 8, x: 120, y: 330 },
          { h: 9, x: 70, y: 270 },
          { h: 10, x: 70, y: 200 },
          { h: 11, x: 70, y: 130 },
          { h: 12, x: 120, y: 75 }
        ].map(({ h, x, y }) => {
          const planets = housePlanets[h] || [];
          return (
            <g key={h}>
              <text x={x} y={y - 8} fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">
                H{h}
              </text>
              <text x={x} y={y + 8} fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                {planets.map((p, idx) => (
                  <tspan key={idx} fill={PLANET_COLORS[p] || '#ffffff'} dx={idx > 0 ? 3 : 0}>
                    {p}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

import React from 'react';
import { RadarPoint, SynastryAspect } from '../utils/relationshipRadarEngine';

interface RelationshipRadarChartProps {
  radarPoints: RadarPoint[];
  synastryAspects: SynastryAspect[];
  overallPercentage: number;
}

export const RelationshipRadarChart: React.FC<RelationshipRadarChartProps> = ({
  radarPoints,
  synastryAspects,
  overallPercentage
}) => {
  const size = 380;
  const center = size / 2;
  const radius = 130;
  const totalAxes = radarPoints.length; // 8 dimensions

  // Helper to compute (x, y) on radial polygon
  const getCoordinates = (index: number, factor: number) => {
    const angle = (index * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const x = center + radius * factor * Math.cos(angle);
    const y = center + radius * factor * Math.sin(angle);
    return { x, y };
  };

  // Build Radar Polygon Points
  const polygonPoints = radarPoints
    .map((pt, i) => {
      const factor = Math.max(0.15, Math.min(1, pt.percentage / 100));
      const { x, y } = getCoordinates(i, factor);
      return `${x},${y}`;
    })
    .join(' ');

  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Soft Background Radial Glow */}
      <div className="absolute inset-0 bg-rose-500/5 blur-[80px] pointer-events-none" />

      {/* SVG Radar Spider Graph */}
      <div className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-square">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full select-none">
          <defs>
            {/* Gradient for Compatibility Polygon */}
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.65" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Concentric Web Rings (25%, 50%, 75%, 100%) */}
          {rings.map((ringFactor, ringIdx) => {
            const ringPoints = Array.from({ length: totalAxes })
              .map((_, i) => {
                const { x, y } = getCoordinates(i, ringFactor);
                return `${x},${y}`;
              })
              .join(' ');

            return (
              <polygon
                key={ringIdx}
                points={ringPoints}
                fill="none"
                stroke="#334155"
                strokeWidth={ringIdx === 3 ? '1.5' : '1'}
                strokeDasharray={ringIdx < 3 ? '3 3' : 'none'}
                opacity={0.8}
              />
            );
          })}

          {/* 2. Radial Axis Lines */}
          {Array.from({ length: totalAxes }).map((_, i) => {
            const { x, y } = getCoordinates(i, 1);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#475569"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
            );
          })}

          {/* 3. Filled Filled Compatibility Shape (The Couple's Polygon) */}
          <polygon
            points={polygonPoints}
            fill="url(#radarGradient)"
            stroke="#f43f5e"
            strokeWidth="2.5"
            filter="url(#radarGlow)"
            className="transition-all duration-500 ease-out"
          />

          {/* 4. Axis Data Points (Glowing Dots) */}
          {radarPoints.map((pt, i) => {
            const factor = Math.max(0.15, Math.min(1, pt.percentage / 100));
            const { x, y } = getCoordinates(i, factor);
            return (
              <g key={i} className="group cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#f7e034"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125"
                />
              </g>
            );
          })}

          {/* 5. Axis Labels Around Circumference */}
          {radarPoints.map((pt, i) => {
            const { x, y } = getCoordinates(i, 1.25);
            return (
              <text
                key={i}
                x={x}
                y={y}
                fill="#f1f5f9"
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="central"
                className="drop-shadow-md"
              >
                {pt.icon} {pt.bengaliName} ({pt.score}/{pt.maxScore})
              </text>
            );
          })}

          {/* Center Compatibility Score Badge */}
          <circle cx={center} cy={center} r="26" fill="#090b10" stroke="#f43f5e" strokeWidth="2" />
          <text
            x={center}
            y={center - 3}
            fill="#f7e034"
            fontSize="14"
            fontWeight="900"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {overallPercentage}%
          </text>
          <text
            x={center}
            y={center + 12}
            fill="#94a3b8"
            fontSize="8"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="central"
          >
            MATCH
          </text>
        </svg>
      </div>

      {/* Swiss Ephemeris Synastry Mini Bars */}
      <div className="w-full mt-4 space-y-2 border-t border-slate-800/80 pt-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>SwissEph Synastry Aspects (গ্রহীয় সংযোগ)</span>
          <span className="text-[#f7e034] text-[11px] font-mono">Astrodienst Grade</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {synastryAspects.map((aspect, idx) => (
            <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span className="text-white">{aspect.aspectName}</span>
                <span className="text-emerald-400 font-mono">{aspect.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-[#f7e034] rounded-full"
                  style={{ width: `${aspect.percentage}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{aspect.analysis}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerMetric?: string | number;
  centerLabel?: string;
  centerSub?: string;
  showLegend?: boolean;
}

export default function DonutChart({
  data,
  size = 140,
  strokeWidth = 18,
  centerMetric,
  centerLabel,
  centerSub,
  showLegend = true
}: DonutChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets
  let accumulatedAngle = 0;
  const segmentsWithAngles = data.map((seg, idx) => {
    const pct = seg.value / total;
    const strokeDasharray = `${pct * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedAngle;
    accumulatedAngle += pct * circumference;
    return {
      ...seg,
      pct: Math.round(pct * 100),
      strokeDasharray,
      strokeDashoffset,
      idx
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
      {/* SVG Donut */}
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {segmentsWithAngles.map((seg) => {
            const isHovered = hoveredIdx === seg.idx;
            return (
              <circle
                key={seg.idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(seg.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-lg font-extrabold font-mono-numbers text-white tracking-tight leading-none">
            {hoveredIdx !== null
              ? `${segmentsWithAngles[hoveredIdx].pct}%`
              : centerSub !== undefined
              ? centerSub
              : centerMetric !== undefined
              ? centerMetric
              : total}
          </span>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5 max-w-[80px] truncate">
            {hoveredIdx !== null
              ? segmentsWithAngles[hoveredIdx].label
              : centerLabel || 'Total'}
          </span>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="space-y-2 w-full max-w-[180px]">
          {segmentsWithAngles.map((seg) => {
            const isHovered = hoveredIdx === seg.idx;
            return (
              <div
                key={seg.idx}
                onMouseEnter={() => setHoveredIdx(seg.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between text-xs px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  isHovered ? 'bg-slate-800' : 'hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className={`text-[11px] truncate ${isHovered ? 'text-white font-semibold' : 'text-slate-300'}`}>
                    {seg.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  <span className="font-mono-numbers text-slate-400 text-[10px]">{seg.value}</span>
                  <span className="font-mono-numbers text-slate-200 text-[11px] font-bold">
                    {seg.pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

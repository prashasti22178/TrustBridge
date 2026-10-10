import { useState } from 'react';

export interface BarChartItem {
  label: string;
  value: number;
  secondaryValue?: number;
  color?: string;
  formattedValue?: string;
}

interface BarChartProps {
  data: BarChartItem[];
  height?: number;
  showValues?: boolean;
  valueSuffix?: string;
  unit?: string;
  horizontal?: boolean;
  benchmark?: number;
  benchmarkValue?: number;
  benchmarkLabel?: string;
  showGrid?: boolean;
}

export default function BarChart({
  data,
  height = 180,
  showValues = true,
  valueSuffix = '',
  unit,
  horizontal = false,
  benchmark,
  benchmarkValue,
  benchmarkLabel
}: BarChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const effectiveBenchmark = benchmark !== undefined ? benchmark : benchmarkValue;
  const effectiveSuffix = unit || valueSuffix;

  const maxValue = Math.max(...data.map((d) => Math.max(d.value, d.secondaryValue || 0)), 10);

  if (horizontal) {
    return (
      <div className="space-y-2.5 w-full">
        {data.map((item, idx) => {
          const pct = Math.min(100, Math.round((item.value / maxValue) * 100));
          const isHovered = hoveredIdx === idx;
          const barColor = item.color || '#6366F1';

          return (
            <div
              key={idx}
              className="space-y-1 group"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium truncate max-w-[180px]">{item.label}</span>
                <span className="font-mono-numbers text-slate-200 font-bold text-[11px]">
                  {item.formattedValue || `${item.value}${effectiveSuffix}`}
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: barColor,
                    filter: isHovered ? 'brightness(1.2)' : 'none'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical Bar Chart
  return (
    <div className="w-full relative" style={{ height }}>
      {/* Benchmark Line */}
      {effectiveBenchmark !== undefined && (
        <div
          className="absolute w-full border-t border-dashed border-amber-400/60 z-10 pointer-events-none flex justify-end"
          style={{ bottom: `${(effectiveBenchmark / maxValue) * 85}%` }}
        >
          <span className="text-[9px] font-mono-numbers text-amber-300 bg-slate-900/90 px-1 py-0.2 rounded border border-amber-400/30 -mt-2.5">
            {benchmarkLabel || `Benchmark: ${effectiveBenchmark}`}
          </span>
        </div>
      )}

      {/* Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
        <div className="border-b border-slate-700 w-full" />
        <div className="border-b border-slate-700 w-full" />
        <div className="border-b border-slate-700 w-full" />
        <div className="border-b border-slate-700 w-full" />
      </div>

      {/* Bars container */}
      <div className="relative h-full flex items-end justify-between gap-2 pt-4 pb-6 px-1">
        {data.map((item, idx) => {
          const heightPct = Math.max(4, Math.round((item.value / maxValue) * 85));
          const isHovered = hoveredIdx === idx;
          const barColor = item.color || '#6366F1';

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute -top-3 z-30 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-[10px] font-mono-numbers text-white shadow-xl pointer-events-none animate-in fade-in zoom-in-95">
                  <span className="font-semibold text-slate-300">{item.label}: </span>
                  <span className="font-bold text-emerald-400">
                    {item.formattedValue || `${item.value}${effectiveSuffix}`}
                  </span>
                </div>
              )}

              {/* Value pill */}
              {showValues && (
                <span className="text-[10px] font-mono-numbers text-slate-400 mb-1 opacity-80 group-hover:opacity-100 group-hover:text-white transition-opacity">
                  {item.value}
                </span>
              )}

              {/* Bar */}
              <div className="w-full max-w-[36px] bg-slate-950 rounded-t-lg p-0.5 border-t border-x border-slate-800 h-full flex items-end">
                <div
                  className="w-full rounded-t-md transition-all duration-300"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: barColor,
                    filter: isHovered ? 'brightness(1.25)' : 'none'
                  }}
                />
              </div>

              {/* Label */}
              <span className="text-[10px] font-medium text-slate-400 truncate max-w-full mt-1.5 group-hover:text-slate-200 transition-colors">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

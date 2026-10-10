export interface WaterfallItem {
  feature: string;
  contribution: number; // positive or negative
  direction: 'POSITIVE' | 'NEGATIVE';
  rawMetric: string;
  category: string;
}

interface WaterfallChartProps {
  items: WaterfallItem[];
  baseScore?: number;
  finalScore?: number;
  height?: number;
}

export default function WaterfallChart({
  items,
  baseScore = 60,
  finalScore = 78
}: WaterfallChartProps) {
  const maxAbs = Math.max(...items.map((i) => Math.abs(i.contribution)), 20);

  return (
    <div className="space-y-4 w-full">
      {/* Score Bridge Summary */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono-numbers">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Base Prior</span>
          <span className="text-base font-bold text-slate-300">{baseScore}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 font-bold">
          <span>+</span>
          <span className="text-emerald-400">
            +{items.filter((i) => i.direction === 'POSITIVE').reduce((acc, c) => acc + c.contribution, 0)} pts
          </span>
          <span>-</span>
          <span className="text-rose-400">
            {Math.abs(items.filter((i) => i.direction === 'NEGATIVE').reduce((acc, c) => acc + c.contribution, 0))} pts
          </span>
          <span>=</span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Deterministic Score</span>
          <span className="text-base font-bold text-emerald-400">{finalScore}/100</span>
        </div>
      </div>

      {/* Divergence Horizontal Bars */}
      <div className="space-y-2">
        {items.map((item, idx) => {
          const isPositive = item.direction === 'POSITIVE';
          const barWidthPct = Math.min(100, Math.round((Math.abs(item.contribution) / maxAbs) * 100));

          return (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-colors grid grid-cols-12 items-center gap-3 text-xs"
            >
              {/* Feature Info (Left) */}
              <div className="col-span-5 truncate">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200 truncate">{item.feature}</span>
                  <span className="text-[10px] font-mono-numbers px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60 hidden sm:inline-block">
                    {item.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono-numbers truncate mt-0.5">
                  Metric: {item.rawMetric}
                </div>
              </div>

              {/* Visual Divergence Bar (Middle 5 cols) */}
              <div className="col-span-5 h-5 flex items-center relative">
                {/* Center line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-700 z-10" />

                {isPositive ? (
                  // Positive: Bar starts at center 50% and extends right
                  <div className="w-1/2 ml-[50%] h-3 flex items-center">
                    <div
                      className="h-full rounded-r-md bg-emerald-500 transition-all duration-500 shadow-sm shadow-emerald-500/20"
                      style={{ width: `${barWidthPct}%` }}
                    />
                  </div>
                ) : (
                  // Negative: Bar starts at center 50% and extends left
                  <div className="w-1/2 mr-[50%] h-3 flex items-center justify-end">
                    <div
                      className="h-full rounded-l-md bg-rose-500 transition-all duration-500 shadow-sm shadow-rose-500/20"
                      style={{ width: `${barWidthPct}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Contribution Points (Right 2 cols) */}
              <div className="col-span-2 text-right font-mono-numbers font-bold">
                <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                  {isPositive ? `+${item.contribution}` : item.contribution}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">pts</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

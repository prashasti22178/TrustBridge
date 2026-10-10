import { useState } from 'react';

export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  formattedValue?: string;
  note?: string;
}

export interface SeriesItem {
  name: string;
  data: number[];
  color?: string;
}

interface LineAreaChartProps {
  data?: DataPoint[];
  labels?: string[];
  series?: SeriesItem[];
  height?: number;
  lineColor?: string;
  areaColor?: string;
  secondaryLineColor?: string;
  showPoints?: boolean;
  valueSuffix?: string;
  unit?: string;
  title?: string;
  seriesName?: string;
  secondarySeriesName?: string;
}

export default function LineAreaChart({
  data,
  labels,
  series,
  height = 190,
  lineColor: propLineColor = '#6366F1',
  areaColor: propAreaColor = '#6366F1',
  secondaryLineColor: propSecColor = '#10B981',
  showPoints = true,
  valueSuffix = '',
  unit,
  seriesName: propSeriesName = 'Value',
  secondarySeriesName: propSecSeriesName
}: LineAreaChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const effectiveData: DataPoint[] = (() => {
    if (data && data.length > 0) return data;
    if (labels && series && series.length > 0) {
      const s1 = series[0];
      const s2 = series.length > 1 ? series[1] : undefined;
      return labels.map((lbl, idx) => ({
        label: lbl,
        value: s1.data[idx] ?? 0,
        secondaryValue: s2 ? s2.data[idx] : undefined
      }));
    }
    return [];
  })();

  const lineColor = (series && series[0]?.color) || propLineColor;
  const areaColor = (series && series[0]?.color) || propAreaColor;
  const secondaryLineColor = (series && series[1]?.color) || propSecColor;
  const seriesName = (series && series[0]?.name) || propSeriesName;
  const secondarySeriesName = (series && series[1]?.name) || propSecSeriesName;
  const effectiveSuffix = unit || valueSuffix;

  if (!effectiveData || effectiveData.length === 0) {
    return <div className="h-40 flex items-center justify-center text-xs text-slate-500">No trend data available</div>;
  }

  const paddingLeft = 36;
  const paddingRight = 16;
  const paddingTop = 18;
  const paddingBottom = 26;

  const width = 600; // viewBox width for crisp SVG scaling
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const hasSecondary = effectiveData.some((d) => d.secondaryValue !== undefined);
  const allValues = [
    ...effectiveData.map((d) => d.value),
    ...(hasSecondary ? effectiveData.map((d) => d.secondaryValue || 0) : [])
  ];

  const minValue = Math.min(0, Math.min(...allValues));
  const maxValue = Math.max(...allValues, 10);
  const valueRange = maxValue - minValue || 1;

  // Calculate coordinates
  const points = effectiveData.map((d, i) => {
    const x = paddingLeft + (i / Math.max(1, effectiveData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.value - minValue) / valueRange) * chartHeight;
    return { x, y, data: d };
  });

  const secondaryPoints = hasSecondary
    ? effectiveData.map((d, i) => {
        const x = paddingLeft + (i / Math.max(1, effectiveData.length - 1)) * chartWidth;
        const val = d.secondaryValue || 0;
        const y = paddingTop + chartHeight - ((val - minValue) / valueRange) * chartHeight;
        return { x, y, data: d };
      })
    : [];

  // Generate SVG path string
  const primaryPathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaPathD = points.length > 0
    ? `${primaryPathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  const secondaryPathD = secondaryPoints.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Unique gradient ID
  const gradId = `areaGrad-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full relative select-none">
      {/* Chart Legend */}
      <div className="flex items-center justify-between pb-1 text-[11px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: lineColor }} />
            <span className="text-slate-300 font-medium">{seriesName}</span>
          </div>
          {hasSecondary && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: secondaryLineColor }} />
              <span className="text-slate-300 font-medium">{secondarySeriesName || 'Secondary'}</span>
            </div>
          )}
        </div>

        {/* Hovered point inspection pill */}
        {hoveredIdx !== null && effectiveData[hoveredIdx] && (
          <div className="font-mono-numbers text-[10px] text-slate-300 flex items-center gap-2 animate-in fade-in">
            <span className="text-slate-400">{effectiveData[hoveredIdx].label}:</span>
            <span className="font-bold text-white" style={{ color: lineColor }}>
              {effectiveData[hoveredIdx].formattedValue || `${effectiveData[hoveredIdx].value}${effectiveSuffix}`}
            </span>
            {hasSecondary && effectiveData[hoveredIdx].secondaryValue !== undefined && (
              <span className="font-bold" style={{ color: secondaryLineColor }}>
                ({effectiveData[hoveredIdx].secondaryValue})
              </span>
            )}
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        style={{ height }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={areaColor} stopOpacity="0.32" />
            <stop offset="100%" stopColor={areaColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {[0, 0.33, 0.66, 1].map((ratio, idx) => {
          const y = paddingTop + chartHeight * ratio;
          const val = Math.round(maxValue - ratio * valueRange);
          return (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text
                x={paddingLeft - 6}
                y={y + 3}
                fill="#64748b"
                fontSize="9"
                fontFamily="JetBrains Mono"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {areaPathD && <path d={areaPathD} fill={`url(#${gradId})`} />}

        {/* Primary Line */}
        {primaryPathD && (
          <path
            d={primaryPathD}
            fill="none"
            stroke={lineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Secondary Line */}
        {hasSecondary && secondaryPathD && (
          <path
            d={secondaryPathD}
            fill="none"
            stroke={secondaryLineColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 2"
          />
        )}

        {/* Points and Hover Areas */}
        {points.map((p, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <g key={idx}>
              {/* X Axis Label */}
              <text
                x={p.x}
                y={height - 6}
                fill={isHovered ? '#f1f5f9' : '#64748b'}
                fontSize="10"
                fontFamily="Plus Jakarta Sans"
                fontWeight={isHovered ? '600' : '400'}
                textAnchor="middle"
              >
                {p.data.label}
              </text>

              {/* Data Point Dot */}
              {showPoints && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5.5 : 3.5}
                  fill="#0b0f19"
                  stroke={lineColor}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />
              )}

              {/* Invisible wide hit area for easy hovering */}
              <rect
                x={p.x - chartWidth / (effectiveData.length * 2)}
                y={paddingTop}
                width={chartWidth / effectiveData.length}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

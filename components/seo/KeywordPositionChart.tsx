'use client';

import React, { useMemo } from 'react';

interface DataPoint {
  date: string;
  position: number;
}

interface Props {
  data: DataPoint[];
  height?: number;
  color?: string;
}

export default function KeywordPositionChart({ data, height = 200, color = '#3B82F6' }: Props) {
  // SVG Chart rendering logic without external dependencies
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  
  const { pathData, points, yTicks, xTicks, viewBox } = useMemo(() => {
    if (!data || data.length === 0) return { pathData: '', points: [], yTicks: [], xTicks: [], viewBox: '0 0 100 100' };

    const width = 800; // SVG internal width

    // Positions in SEO are 1-100 where 1 is top (best)
    // We want the chart to have 1 at the top, and 100 at the bottom.
    // So we invert the Y axis mapping.
    
    // Find min and max positions to scale the chart nicely
    let minPos = Math.min(...data.map(d => d.position));
    let maxPos = Math.max(...data.map(d => d.position));
    
    // Add some padding to the domain
    minPos = Math.max(1, Math.floor(minPos / 10) * 10 - 10);
    maxPos = Math.ceil(maxPos / 10) * 10 + 10;
    if (maxPos - minPos < 20) maxPos = minPos + 20;

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const getX = (index: number) => padding.left + (index / Math.max(1, data.length - 1)) * chartWidth;
    const getY = (val: number) => padding.top + ((val - minPos) / (maxPos - minPos)) * chartHeight;

    let d = '';
    const pts: { x: number; y: number; val: number; date: string }[] = [];

    data.forEach((point, i) => {
      const x = getX(i);
      const y = getY(point.position);
      pts.push({ x, y, val: point.position, date: point.date });
      if (i === 0) {
        d += `M ${x} ${y}`;
      } else {
        d += ` L ${x} ${y}`;
      }
    });

    // Y-axis ticks
    const tickCount = 5;
    const yTks = [];
    for (let i = 0; i <= tickCount; i++) {
      const val = minPos + (i / tickCount) * (maxPos - minPos);
      yTks.push({ val: Math.round(val), y: getY(val) });
    }

    // X-axis ticks (just first, middle, last for simplicity)
    const xTks = [];
    if (data.length > 0) {
      xTks.push({ label: data[0].date, x: getX(0) });
      if (data.length > 2) {
        const mid = Math.floor(data.length / 2);
        xTks.push({ label: data[mid].date, x: getX(mid) });
      }
      xTks.push({ label: data[data.length - 1].date, x: getX(data.length - 1) });
    }

    return { pathData: d, points: pts, yTicks: yTks, xTicks: xTks, viewBox: `0 0 ${width} ${height}` };
  }, [data, height]);

  if (!data || data.length === 0) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>No ranking data available</div>;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <svg viewBox={viewBox} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <g key={`y-${i}`}>
            <line x1={padding.left} y1={tick.y} x2={800 - padding.right} y2={tick.y} stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />
            <text x={padding.left - 10} y={tick.y + 4} fill="#9CA3AF" fontSize="12" textAnchor="end">{tick.val}</text>
          </g>
        ))}

        {/* X axis labels */}
        {xTicks.map((tick, i) => (
          <text key={`x-${i}`} x={tick.x} y={height - 10} fill="#9CA3AF" fontSize="12" textAnchor="middle">
            {new Date(tick.label).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </text>
        ))}

        {/* The line */}
        <path d={pathData} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

        {/* Points */}
        {points.map((p, i) => (
          <circle key={`p-${i}`} cx={p.x} cy={p.y} r="4" fill="#1F2937" stroke={color} strokeWidth="2">
            <title>{`${p.date}: Position ${p.val}`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

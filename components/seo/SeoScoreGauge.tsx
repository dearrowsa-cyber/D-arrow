import React from 'react';

interface SeoScoreGaugeProps {
  score: number;
  size?: number;
}

export default function SeoScoreGauge({ score, size = 100 }: SeoScoreGaugeProps) {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#EF4444'; // Red < 50
  if (score >= 80) color = '#22C55E'; // Green >= 80
  else if (score >= 50) color = '#F59E0B'; // Orange 50-79

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div style={{ position: 'absolute', fontSize: size * 0.25, fontWeight: 'bold', color }}>
        {score}
      </div>
    </div>
  );
}

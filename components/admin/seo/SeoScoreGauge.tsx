import React from 'react';

export default function SeoScoreGauge({ score }: { score: number }) {
  let color = 'text-red-500';
  let strokeColor = 'stroke-red-500';
  if (score >= 80) {
    color = 'text-green-500';
    strokeColor = 'stroke-green-500';
  } else if (score >= 50) {
    color = 'text-yellow-500';
    strokeColor = 'stroke-yellow-500';
  }

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${strokeColor} transition-all duration-500 ease-in-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold ${color}`}>{score}/100</span>
        </div>
      </div>
      <span className="text-sm text-gray-500 mt-2 font-medium">SEO Score</span>
    </div>
  );
}

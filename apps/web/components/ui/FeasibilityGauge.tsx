import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface FeasibilityGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function FeasibilityGauge({
  score,
  size = 'md',
  showLabel = true,
}: FeasibilityGaugeProps) {
  // Color determination based on score
  let strokeColor = '#10b981'; // emerald for >= 70%
  let textColor = 'text-emerald-400';
  let bgColor = 'bg-emerald-500/10 border-emerald-500/30';
  let label = 'High Feasibility';

  if (score < 40) {
    strokeColor = '#ef4444'; // red for < 40%
    textColor = 'text-red-400';
    bgColor = 'bg-red-500/10 border-red-500/30';
    label = 'Low Feasibility';
  } else if (score < 70) {
    strokeColor = '#f59e0b'; // amber for 40-69%
    textColor = 'text-amber-400';
    bgColor = 'bg-amber-500/10 border-amber-500/30';
    label = 'Partial Feasibility';
  }

  const dimensions = {
    sm: { width: 44, strokeWidth: 4, radius: 18, textSize: 'text-xs' },
    md: { width: 72, strokeWidth: 6, radius: 30, textSize: 'text-base font-bold' },
    lg: { width: 110, strokeWidth: 8, radius: 46, textSize: 'text-2xl font-bold' },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dimensions.width}
          height={dimensions.width}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={dimensions.radius}
            stroke="#1e293b"
            strokeWidth={dimensions.strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={dimensions.radius}
            stroke={strokeColor}
            strokeWidth={dimensions.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className={`absolute font-mono ${dimensions.textSize} ${textColor}`}>
          {score}%
        </span>
      </div>

      {showLabel && (
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${bgColor} font-medium ${textColor}`}>
              {label}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Deterministic BOM Match
          </p>
        </div>
      )}
    </div>
  );
}

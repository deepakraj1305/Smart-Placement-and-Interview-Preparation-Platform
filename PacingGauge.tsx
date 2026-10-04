import React from 'react';
import { Gauge, Zap } from 'lucide-react';

interface PacingGaugeProps {
  wpm: number;
}

export const PacingGauge: React.FC<PacingGaugeProps> = ({ wpm }) => {
  let status = 'Balanced';
  let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let progressPercent = 50;

  if (wpm === 0) {
    status = 'Waiting';
    badgeColor = 'bg-zinc-100 text-zinc-600 border-zinc-200';
    progressPercent = 0;
  } else if (wpm < 110) {
    status = 'Slow / Hesitant';
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    progressPercent = Math.min(40, (wpm / 110) * 40);
  } else if (wpm <= 160) {
    status = 'Optimal Pace (120-160)';
    badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    progressPercent = 40 + ((wpm - 110) / 50) * 35;
  } else if (wpm <= 185) {
    status = 'Slightly Fast';
    badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
    progressPercent = 75 + ((wpm - 160) / 25) * 15;
  } else {
    status = 'Rushed (>185 WPM)';
    badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
    progressPercent = 95;
  }

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-md p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#18181b]">
          <Gauge className="w-3.5 h-3.5 text-blue-600" />
          <span>Speaking Pace</span>
        </div>
        <span className={`text-[11px] font-mono px-2 py-0.5 rounded border font-medium ${badgeColor}`}>
          {wpm > 0 ? `${wpm} WPM` : '-- WPM'}
        </span>
      </div>

      <div className="w-full bg-[#f4f4f5] h-2 rounded-full overflow-hidden mb-1.5">
        <div
          className={`h-full transition-all duration-300 ${
            wpm > 185 ? 'bg-rose-500' : wpm >= 110 && wpm <= 160 ? 'bg-emerald-500' : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-[#71717a]">
        <span>&lt;110 Slow</span>
        <span className="font-semibold text-[#18181b]">135 Ideal</span>
        <span>&gt;175 Fast</span>
      </div>

      <div className="mt-2 pt-2 border-t border-[#f4f4f5] text-[11px] text-[#52525b] flex items-center gap-1">
        <Zap className="w-3 h-3 text-amber-600 shrink-0" />
        <span>Status: <strong>{status}</strong></span>
      </div>
    </div>
  );
};

import React from 'react';
import { AlertCircle, CheckCircle2, ListFilter } from 'lucide-react';

interface FillerBadgeProps {
  fillerCount: number;
  fillerBreakdown: Record<string, number>;
  repeatedWords: string[];
}

export const FillerBadge: React.FC<FillerBadgeProps> = ({
  fillerCount,
  fillerBreakdown,
  repeatedWords
}) => {
  const fillers = Object.entries(fillerBreakdown).filter(([_, count]) => count > 0);

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-md p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#18181b]">
          <ListFilter className="w-3.5 h-3.5 text-amber-600" />
          <span>Verbal Fillers & Crutches</span>
        </div>
        <span
          className={`text-[11px] font-mono px-2 py-0.5 rounded border font-medium ${
            fillerCount === 0
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : fillerCount <= 3
              ? 'bg-blue-50 text-blue-800 border-blue-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          {fillerCount} Detected
        </span>
      </div>

      {fillers.length === 0 && repeatedWords.length === 0 ? (
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50/70 p-2 rounded border border-emerald-100">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Clean speech flow with no persistent vocal fillers.</span>
        </div>
      ) : (
        <div className="space-y-2">
          {fillers.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {fillers.map(([word, count]) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1 text-[11px] font-mono bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200"
                >
                  <span className="font-semibold text-rose-600">"{word}"</span>
                  <span className="text-zinc-500 text-[10px]">×{count}</span>
                </span>
              ))}
            </div>
          )}

          {repeatedWords.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50/70 px-2 py-1 rounded border border-amber-200/80">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>Consecutive repetition: "{repeatedWords.join(', ')}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

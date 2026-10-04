import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, Check, ChevronRight } from 'lucide-react';
import { QuestionResponse } from '../types/interview';

interface FeedbackCardProps {
  response: Partial<QuestionResponse>;
  onNext?: () => void;
  isLastQuestion?: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  response,
  onNext,
  isLastQuestion
}) => {
  const {
    overall_score = 0,
    relevance_score = 0,
    structure_score = 0,
    wpm = 0,
    duration_sec = 0,
    word_count = 0,
    filler_count = 0,
    what_worked = [],
    tighten_this = [],
    try_this_next_time = '',
    star_breakdown
  } = response;

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-lg shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-[#e4e4e7] bg-[#fbfbfb] flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] block">
            Response Assessment
          </span>
          <h3 className="text-base font-semibold text-[#18181b] tracking-tight">
            Here’s What Came Through
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block">
              Response Score
            </span>
            <span className="text-xl font-bold font-mono text-[#18181b]">
              {overall_score}<span className="text-xs text-[#a1a1aa] font-normal">/100</span>
            </span>
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs font-mono border ${
              overall_score >= 80
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : overall_score >= 60
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {overall_score >= 80 ? 'A' : overall_score >= 65 ? 'B' : 'C'}
          </div>
        </div>
      </div>

      {/* Snapshot metrics strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#e4e4e7] divide-x divide-y sm:divide-y-0 divide-[#e4e4e7] bg-white text-xs font-mono">
        <div className="p-3">
          <div className="text-[10px] text-[#71717a] uppercase">Duration</div>
          <div className="text-sm font-semibold text-[#18181b] mt-0.5">{duration_sec}s ({word_count} words)</div>
        </div>
        <div className="p-3">
          <div className="text-[10px] text-[#71717a] uppercase">Speaking Pace</div>
          <div className="text-sm font-semibold text-[#18181b] mt-0.5">{wpm} WPM</div>
        </div>
        <div className="p-3">
          <div className="text-[10px] text-[#71717a] uppercase">Fillers Used</div>
          <div className="text-sm font-semibold text-[#18181b] mt-0.5">{filler_count} instances</div>
        </div>
        <div className="p-3">
          <div className="text-[10px] text-[#71717a] uppercase">Topic Relevance</div>
          <div className="text-sm font-semibold text-[#18181b] mt-0.5">{relevance_score}% match</div>
        </div>
      </div>

      {/* STAR Framework indicator if present */}
      {star_breakdown && (
        <div className="p-3.5 bg-[#fafafa] border-b border-[#e4e4e7] text-xs">
          <div className="text-[11px] font-mono text-[#71717a] mb-2 font-medium">
            STAR Framework Breakdown:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className={`p-2 rounded border text-xs flex items-center justify-between ${star_breakdown.has_situation ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-zinc-100 border-zinc-200 text-zinc-500'}`}>
              <span>Situation</span>
              {star_breakdown.has_situation ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="text-[10px]">--</span>}
            </div>
            <div className={`p-2 rounded border text-xs flex items-center justify-between ${star_breakdown.has_task ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-zinc-100 border-zinc-200 text-zinc-500'}`}>
              <span>Task</span>
              {star_breakdown.has_task ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="text-[10px]">--</span>}
            </div>
            <div className={`p-2 rounded border text-xs flex items-center justify-between ${star_breakdown.has_action ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-zinc-100 border-zinc-200 text-zinc-500'}`}>
              <span>Action</span>
              {star_breakdown.has_action ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="text-[10px]">--</span>}
            </div>
            <div className={`p-2 rounded border text-xs flex items-center justify-between ${star_breakdown.has_result ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-zinc-100 border-zinc-200 text-zinc-500'}`}>
              <span>Result</span>
              {star_breakdown.has_result ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="text-[10px]">--</span>}
            </div>
          </div>
        </div>
      )}

      {/* Main Feedback Sections: What Worked, Tighten This, Try This Next Time */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* What Worked */}
        <div className="bg-emerald-50/40 border border-emerald-100 rounded-md p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 mb-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>What Worked</span>
          </div>
          <ul className="space-y-1.5 text-xs text-emerald-950/90 pl-5 list-disc">
            {what_worked.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>

        {/* Tighten This */}
        <div className="bg-amber-50/40 border border-amber-100 rounded-md p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 mb-2 font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Tighten This</span>
          </div>
          <ul className="space-y-1.5 text-xs text-amber-950/90 pl-5 list-disc">
            {tighten_this.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>

        {/* Try This Next Time */}
        {try_this_next_time && (
          <div className="bg-[#f8f9fa] border border-[#e4e4e7] rounded-md p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#18181b] mb-2 font-mono">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span>Try This Next Time</span>
            </div>
            <pre className="text-xs text-[#3f3f46] whitespace-pre-wrap font-sans leading-relaxed bg-white p-3 rounded border border-[#e4e4e7]">
              {try_this_next_time}
            </pre>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      {onNext && (
        <div className="p-4 bg-[#fbfbfb] border-t border-[#e4e4e7] flex items-center justify-end">
          <button
            onClick={onNext}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#18181b] text-white rounded hover:bg-[#27272a] transition-colors shadow-xs"
          >
            <span>{isLastQuestion ? 'Proceed to Final Report' : 'Next Question'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

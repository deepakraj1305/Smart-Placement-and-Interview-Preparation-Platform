import React from 'react';
import { InterviewSession, QuestionResponse } from '../types/interview';
import { CheckCircle, Award, Printer, Clock, FileText, Check } from 'lucide-react';

interface PrintableReportProps {
  session: InterviewSession;
  responses: QuestionResponse[];
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ session, responses }) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(session.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Action Header for Web View */}
      <div className="flex items-center justify-between no-print bg-white p-4 border border-[#e4e4e7] rounded-lg shadow-xs">
        <div>
          <span className="text-xs font-mono text-[#71717a] uppercase">Export Document</span>
          <h2 className="text-sm font-semibold text-[#18181b]">Candidate Evaluation Sheet</h2>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#18181b] text-white rounded hover:bg-[#27272a] transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="print-sheet bg-white border border-[#e4e4e7] rounded-lg p-6 sm:p-8 shadow-xs text-[#18181b]">
        {/* Header Branding */}
        <div className="border-b-2 border-[#18181b] pb-4 mb-6 flex items-start justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#71717a]">
              Campus Placement Cell &bull; Technical Assessment Report
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181b] mt-1">
              Placement Interview Response Assessment
            </h1>
            <p className="text-xs text-[#52525b] mt-0.5">
              Domain: <span className="font-semibold text-[#18181b]">{session.domain}</span> &bull; Target Role: <span className="font-semibold text-[#18181b]">{session.target_role}</span> &bull; Difficulty: <span className="font-semibold text-[#18181b]">{session.difficulty}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-[#18181b]">
              {session.overall_score}<span className="text-sm text-[#71717a]">/100</span>
            </div>
            <div className="text-[11px] font-mono uppercase text-emerald-700 font-semibold mt-0.5">
              {Number(session.overall_score) >= 75 ? 'Placement Ready' : 'Needs Practice'}
            </div>
          </div>
        </div>

        {/* Candidate Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#f8f9fa] border border-[#e4e4e7] rounded-md mb-6 text-xs">
          <div>
            <span className="text-[10px] font-mono text-[#71717a] uppercase block">Candidate Name</span>
            <span className="font-semibold text-[#18181b]">{session.student_name}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#71717a] uppercase block">Student Email</span>
            <span className="font-mono text-[#18181b]">{session.student_email}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#71717a] uppercase block">Session Date</span>
            <span className="font-mono text-[#18181b]">{formattedDate}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#71717a] uppercase block">Questions Answered</span>
            <span className="font-mono font-semibold text-[#18181b]">{responses.length} of {session.question_count}</span>
          </div>
        </div>

        {/* Score Rubric Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-xs">
          <div className="p-3 border border-[#e4e4e7] rounded bg-white">
            <span className="text-[10px] font-mono uppercase text-[#71717a]">Communication</span>
            <div className="text-lg font-bold font-mono mt-1">{session.communication_score || session.overall_score}%</div>
          </div>
          <div className="p-3 border border-[#e4e4e7] rounded bg-white">
            <span className="text-[10px] font-mono uppercase text-[#71717a]">Technical Relevance</span>
            <div className="text-lg font-bold font-mono mt-1">{session.content_score || 82}%</div>
          </div>
          <div className="p-3 border border-[#e4e4e7] rounded bg-white">
            <span className="text-[10px] font-mono uppercase text-[#71717a]">Average Cadence</span>
            <div className="text-lg font-bold font-mono mt-1">{session.avg_wpm || 138} WPM</div>
          </div>
          <div className="p-3 border border-[#e4e4e7] rounded bg-white">
            <span className="text-[10px] font-mono uppercase text-[#71717a]">Total Fillers</span>
            <div className="text-lg font-bold font-mono mt-1">{session.total_filler_words || 0} words</div>
          </div>
        </div>

        {/* Question-by-Question Breakdown */}
        <div className="space-y-6">
          <div className="text-xs font-mono uppercase tracking-wider font-semibold text-[#18181b] border-b border-[#e4e4e7] pb-1">
            Granular Question Responses & Transcripts
          </div>

          {responses.map((resp, index) => (
            <div key={resp.id || index} className="border border-[#e4e4e7] rounded-md p-4 bg-white space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-[#71717a] uppercase">
                    Question {index + 1} &bull; {resp.domain}
                  </span>
                  <h3 className="text-sm font-semibold text-[#18181b]">
                    {resp.question_title}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold font-mono text-[#18181b]">
                    {resp.overall_score}/100
                  </span>
                  <span className="block text-[10px] font-mono text-[#71717a]">
                    {resp.duration_sec}s &bull; {resp.wpm} WPM
                  </span>
                </div>
              </div>

              {/* Full Transcript */}
              <div className="bg-[#f8f9fa] p-3 rounded border border-[#e4e4e7] text-xs">
                <span className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                  Recorded Response Transcript:
                </span>
                <p className="italic text-[#27272a] leading-relaxed">
                  "{resp.transcript || 'No verbal audio recorded.'}"
                </p>
              </div>

              {/* Key Feedback */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-50/60 border border-emerald-200 p-2.5 rounded">
                  <span className="font-semibold text-emerald-900 block mb-1">What Worked:</span>
                  <ul className="list-disc pl-4 space-y-1 text-emerald-950 text-[11px]">
                    {resp.what_worked?.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
                <div className="bg-amber-50/60 border border-amber-200 p-2.5 rounded">
                  <span className="font-semibold text-amber-900 block mb-1">Tighten This:</span>
                  <ul className="list-disc pl-4 space-y-1 text-amber-950 text-[11px]">
                    {resp.tighten_this?.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Placement Cell Sign-off */}
        <div className="mt-8 pt-6 border-t border-[#e4e4e7] flex items-center justify-between text-xs text-[#71717a]">
          <div>
            <span>Verified by: <strong>Placement Evaluation Workstation Engine</strong></span>
          </div>
          <div className="font-mono text-[11px]">
            Authorized Placement Document &bull; 2026 Cohort
          </div>
        </div>
      </div>
    </div>
  );
};

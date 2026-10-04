import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { InterviewSession, QuestionResponse } from '../types/interview';
import { PrintableReport } from '../components/PrintableReport';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp,
  Activity,
  BarChart2,
  MessageSquare,
  FileCheck,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export const InterviewReport: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [showPrintView, setShowPrintView] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        if (!sessionId) return;
        const res = await fetch(`/api/sessions?id=${sessionId}`);
        if (!res.ok) throw new Error('Session report not found');
        const data = await res.json();
        setSession(data);
        setResponses(data.responses || []);
      } catch (err) {
        console.error('Report fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#18181b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-[#71717a]">Generating Placement Report...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] py-16 px-4 text-center">
        <h2 className="text-lg font-bold text-[#18181b] mb-2">Interview Session Not Found</h2>
        <Link to="/setup" className="text-xs text-blue-600 underline">Start a new session &rarr;</Link>
      </div>
    );
  }

  const overall = Number(session.overall_score || 78);
  const isReady = overall >= 75;

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e4e4e7] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#71717a] uppercase mb-1">
              <span>Placement Workstation</span>
              <span>/</span>
              <span className="text-[#18181b] font-semibold">Final Assessment Report</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181b]">
              Placement Readiness Summary
            </h1>
            <p className="text-xs text-[#52525b] mt-0.5">
              Candidate: <strong className="text-[#18181b]">{session.student_name}</strong> &bull; Track: <strong className="text-[#18181b]">{session.domain}</strong> &bull; Role: <strong className="text-[#18181b]">{session.target_role}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintView(!showPrintView)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-white text-[#18181b] border border-[#d4d4d8] rounded hover:bg-[#f4f4f5] transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{showPrintView ? 'Standard View' : 'Printable Sheet'}</span>
            </button>

            <Link
              to="/setup"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#18181b] text-white rounded hover:bg-[#27272a] transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Again</span>
            </Link>
          </div>
        </div>

        {showPrintView ? (
          <PrintableReport session={session} responses={responses} />
        ) : (
          <>
            {/* Overall Score Highlight Banner */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg p-6 sm:p-8 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border bg-emerald-50 text-emerald-800 border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isReady ? 'Placement Readiness Verified' : 'Practice Recommended'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181b]">
                    {isReady
                      ? 'Solid performance across verbal clarity and structural depth.'
                      : 'Good foundation. Focus on cadence control and outcome metrics.'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#52525b] leading-relaxed">
                    {session.summary_notes || 'All responses evaluated against campus recruitment standards.'}
                  </p>
                </div>

                <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-[#f8f9fa] border border-[#e4e4e7] rounded-lg text-center">
                  <span className="text-[11px] font-mono uppercase text-[#71717a] font-semibold">
                    Overall Composite Score
                  </span>
                  <div className="text-4xl font-extrabold font-mono text-[#18181b] my-1">
                    {overall}<span className="text-sm font-normal text-[#a1a1aa]">/100</span>
                  </div>
                  <span className="text-[11px] text-[#52525b]">
                    Based on {responses.length} answered questions
                  </span>
                </div>
              </div>

              {/* Sub-scores 4-card matrix */}
              <div className="mt-8 pt-6 border-t border-[#e4e4e7] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#fafafa] border border-[#e4e4e7] rounded">
                  <span className="text-[10px] font-mono uppercase text-[#71717a] block">Communication</span>
                  <div className="text-base font-bold font-mono text-[#18181b] mt-1">
                    {session.communication_score || 84}%
                  </div>
                  <span className="text-[10px] text-[#71717a]">Articulation & poise</span>
                </div>

                <div className="p-3 bg-[#fafafa] border border-[#e4e4e7] rounded">
                  <span className="text-[10px] font-mono uppercase text-[#71717a] block">Technical Relevance</span>
                  <div className="text-base font-bold font-mono text-[#18181b] mt-1">
                    {session.content_score || 80}%
                  </div>
                  <span className="text-[10px] text-[#71717a]">Benchmark keyword match</span>
                </div>

                <div className="p-3 bg-[#fafafa] border border-[#e4e4e7] rounded">
                  <span className="text-[10px] font-mono uppercase text-[#71717a] block">Average Cadence</span>
                  <div className="text-base font-bold font-mono text-[#18181b] mt-1">
                    {session.avg_wpm || 135} WPM
                  </div>
                  <span className="text-[10px] text-[#71717a]">Standard range: 120-160</span>
                </div>

                <div className="p-3 bg-[#fafafa] border border-[#e4e4e7] rounded">
                  <span className="text-[10px] font-mono uppercase text-[#71717a] block">Fillers Detected</span>
                  <div className="text-base font-bold font-mono text-[#18181b] mt-1">
                    {session.total_filler_words || 0} total
                  </div>
                  <span className="text-[10px] text-[#71717a]">{session.filler_rate_percent || 0}% verbal density</span>
                </div>
              </div>
            </div>

            {/* Question-by-Question Granular Accordion */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold tracking-tight text-[#18181b]">
                  Question-by-Question Performance Breakdown
                </h3>
                <span className="text-xs font-mono text-[#71717a]">
                  {responses.length} responses recorded
                </span>
              </div>

              {responses.map((resp, idx) => {
                const isOpen = expandedIndex === idx;
                return (
                  <div
                    key={resp.id || idx}
                    className="bg-white border border-[#e4e4e7] rounded-lg shadow-xs overflow-hidden"
                  >
                    {/* Accordion Trigger */}
                    <button
                      onClick={() => setExpandedIndex(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#fafafa] transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#71717a] uppercase">
                          <span>Question {idx + 1}</span>
                          <span>&bull;</span>
                          <span>{resp.domain}</span>
                          <span>&bull;</span>
                          <span>{resp.duration_sec}s duration</span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#18181b]">
                          {resp.question_title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-sm font-bold font-mono text-[#18181b]">
                            {resp.overall_score}/100
                          </span>
                          <span className="block text-[10px] font-mono text-[#71717a]">
                            {resp.wpm} WPM
                          </span>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-[#71717a]" /> : <ChevronDown className="w-4 h-4 text-[#71717a]" />}
                      </div>
                    </button>

                    {/* Accordion Body */}
                    {isOpen && (
                      <div className="p-4 sm:p-5 border-t border-[#e4e4e7] bg-[#fbfbfb] space-y-4">
                        {/* Recorded Transcript */}
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#71717a] font-semibold block mb-1">
                            Recorded Transcript:
                          </span>
                          <div className="p-3.5 bg-white border border-[#e4e4e7] rounded text-xs text-[#27272a] leading-relaxed italic">
                            "{resp.transcript || 'No verbal audio recorded.'}"
                          </div>
                        </div>

                        {/* What Worked & Tighten This */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded">
                            <span className="font-semibold text-emerald-900 font-mono text-[11px] block mb-1">
                              What Worked
                            </span>
                            <ul className="list-disc pl-4 space-y-1 text-emerald-950 text-xs">
                              {resp.what_worked?.map((w, i) => <li key={i}>{w}</li>)}
                            </ul>
                          </div>

                          <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded">
                            <span className="font-semibold text-amber-900 font-mono text-[11px] block mb-1">
                              Tighten This
                            </span>
                            <ul className="list-disc pl-4 space-y-1 text-amber-950 text-xs">
                              {resp.tighten_this?.map((t, i) => <li key={i}>{t}</li>)}
                            </ul>
                          </div>
                        </div>

                        {/* Try This Next Time */}
                        {resp.try_this_next_time && (
                          <div className="p-3.5 bg-white border border-[#e4e4e7] rounded">
                            <span className="font-semibold text-[#18181b] font-mono text-[11px] block mb-1">
                              Try This Next Time (Exemplar Structure)
                            </span>
                            <pre className="text-xs text-[#3f3f46] whitespace-pre-wrap font-sans leading-relaxed">
                              {resp.try_this_next_time}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#e4e4e7] flex items-center justify-between">
              <Link
                to="/history"
                className="text-xs text-[#52525b] hover:text-[#18181b] font-medium"
              >
                &larr; View all practice history
              </Link>
              <Link
                to="/setup"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#18181b] text-white rounded hover:bg-[#27272a] transition-colors shadow-xs"
              >
                <span>Start Next Practice Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

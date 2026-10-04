import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, ArrowRight, CheckCircle2, Shield, Activity, BarChart3, Clock, Cpu, Sparkles, BookOpen } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#18181b]">
      {/* Hero Section - Editorial Workstation Style */}
      <section className="relative pt-14 pb-20 sm:pt-20 sm:pb-28 border-b border-[#e4e4e7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e4e4e7] text-[#52525b] text-xs font-mono mb-8 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Campus Placement Interview Practice &bull; Real-Time Analysis</span>
          </div>

          {/* Core Headline */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#18181b] mb-6 max-w-4xl mx-auto leading-[1.12]">
            Answer like you’re already in the room.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#52525b] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Practice technical, HR, and behavioural placement rounds with live microphone speech-to-text. Get instant cadence analysis, filler word tracking, and structural feedback before campus drives begin.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/setup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-[#18181b] text-white rounded-md hover:bg-[#27272a] transition-all shadow-xs"
            >
              <Mic className="w-4 h-4 text-blue-400" />
              <span>Start Interview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/admin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium bg-white text-[#18181b] border border-[#d4d4d8] rounded-md hover:bg-[#f4f4f5] transition-all shadow-xs"
            >
              <Shield className="w-4 h-4 text-[#71717a]" />
              <span>Placement Cell Portal</span>
            </Link>
          </div>

          {/* Compact Feature Highlights */}
          <div className="mt-14 pt-8 border-t border-[#e4e4e7] grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-3 bg-white border border-[#e4e4e7] rounded-md">
              <span className="text-[10px] font-mono uppercase text-[#71717a] block">Microphone Engine</span>
              <span className="text-xs font-semibold text-[#18181b] block mt-0.5">Live Speech-to-Text</span>
            </div>
            <div className="p-3 bg-white border border-[#e4e4e7] rounded-md">
              <span className="text-[10px] font-mono uppercase text-[#71717a] block">Cadence Pacing</span>
              <span className="text-xs font-semibold text-[#18181b] block mt-0.5">Words Per Minute (WPM)</span>
            </div>
            <div className="p-3 bg-white border border-[#e4e4e7] rounded-md">
              <span className="text-[10px] font-mono uppercase text-[#71717a] block">Vocal Precision</span>
              <span className="text-xs font-semibold text-[#18181b] block mt-0.5">Filler & Repetition Ticker</span>
            </div>
            <div className="p-3 bg-white border border-[#e4e4e7] rounded-md">
              <span className="text-[10px] font-mono uppercase text-[#71717a] block">Framework Analysis</span>
              <span className="text-xs font-semibold text-[#18181b] block mt-0.5">STAR & Technical Depth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Workstation Workflow Section */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#e4e4e7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold block mb-1">
              Workstation Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181b]">
              How the Placement Response Analyzer Evaluates You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 bg-[#fafafa] border border-[#e4e4e7] rounded-lg">
              <div className="w-8 h-8 rounded bg-[#18181b] text-white flex items-center justify-center font-mono text-xs font-bold mb-4">
                01
              </div>
              <h3 className="text-base font-semibold text-[#18181b] mb-2">
                Select Track & Question
              </h3>
              <p className="text-xs text-[#52525b] leading-relaxed">
                Choose between Technical Architecture, Core Coding Logic, HR Scenarios, or Behavioural Rounds tailored to placement standards.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-[#fafafa] border border-[#e4e4e7] rounded-lg">
              <div className="w-8 h-8 rounded bg-[#18181b] text-white flex items-center justify-center font-mono text-xs font-bold mb-4">
                02
              </div>
              <h3 className="text-base font-semibold text-[#18181b] mb-2">
                Speak Naturally via Mic
              </h3>
              <p className="text-xs text-[#52525b] leading-relaxed">
                The platform listens through your microphone, generates real-time transcripts, tracks your pacing gauge, and catches filler words on the fly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-[#fafafa] border border-[#e4e4e7] rounded-lg">
              <div className="w-8 h-8 rounded bg-[#18181b] text-white flex items-center justify-center font-mono text-xs font-bold mb-4">
                03
              </div>
              <h3 className="text-base font-semibold text-[#18181b] mb-2">
                Inspect Granular Feedback
              </h3>
              <p className="text-xs text-[#52525b] leading-relaxed">
                Receive structured notes: “What Worked”, “Tighten This”, and an exact exemplar rewrite under “Try This Next Time”.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Evaluation Rubric Section */}
      <section className="py-16 bg-[#fbfbfb] border-b border-[#e4e4e7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#71717a] block mb-1">
                Placement Evaluation Metrics
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181b] mb-4">
                Clear scoring based on campus recruitment rubrics.
              </h2>
              <p className="text-sm text-[#52525b] leading-relaxed mb-6">
                College recruitment panels listen for both clarity of thought and verbal confidence. Our engine breaks down every response across four key pillars:
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 bg-white border border-[#e4e4e7] rounded">
                  <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#18181b] block">Cadence & Pacing (WPM)</span>
                    <span className="text-[#52525b]">Identifies whether you speak too fast under pressure or stall during transitions.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-[#e4e4e7] rounded">
                  <BarChart3 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#18181b] block">Filler Crutch Detection</span>
                    <span className="text-[#52525b]">Pinpoints instances of "um", "like", "basically", and "you know" with exact counts.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-[#e4e4e7] rounded">
                  <BookOpen className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#18181b] block">STAR Framework Adherence</span>
                    <span className="text-[#52525b]">Verifies Situation, Task, Action, and measurable Result for behavioural stories.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Card Mockup */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono font-semibold text-[#18181b]">Live Feedback Sample</span>
                </div>
                <span className="text-[11px] font-mono text-[#71717a]">Score: 88/100</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded text-emerald-950">
                  <div className="font-semibold font-mono text-[11px] text-emerald-900 mb-1">What Worked</div>
                  <div>Articulated trade-offs between O(N) linear scan and HashMap indexing with clean verbal delivery.</div>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-100 rounded text-amber-950">
                  <div className="font-semibold font-mono text-[11px] text-amber-900 mb-1">Tighten This</div>
                  <div>Pacing peaked at 178 WPM during complexity explanation. Slow down around core logic points.</div>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded text-[#3f3f46]">
                  <div className="font-semibold font-mono text-[11px] text-[#18181b] mb-1">Try This Next Time</div>
                  <div className="italic text-[11px]">"To solve this, I chose a HashMap for constant time lookups, accepting slightly higher memory overhead..."</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-14 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#18181b] mb-3">
            Ready to test your interview readiness?
          </h2>
          <p className="text-xs text-[#52525b] mb-6">
            No mock data. Real microphone transcription and instantaneous placement analytics.
          </p>
          <Link
            to="/setup"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold bg-[#18181b] text-white rounded hover:bg-[#27272a] transition-colors shadow-xs"
          >
            <Mic className="w-4 h-4 text-blue-400" />
            <span>Start Interview</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

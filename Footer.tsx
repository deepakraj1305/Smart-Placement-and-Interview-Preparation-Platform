import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f4f4f5] border-t border-[#e4e4e7] py-10 mt-auto text-[#71717a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          <div>
            <div className="flex items-center space-x-2 text-[#18181b] font-semibold mb-2">
              <span className="font-mono text-blue-600">/</span>
              <span>Placement Workstation</span>
            </div>
            <p className="leading-relaxed text-[#71717a]">
              Dedicated college placement practice environment. Real-time transcription, cadence evaluation, filler detection, and STAR framework analysis.
            </p>
          </div>

          <div>
            <div className="font-mono uppercase tracking-wider text-[11px] font-semibold text-[#18181b] mb-3">
              Practice Tracks
            </div>
            <ul className="space-y-1.5">
              <li><Link to="/setup" className="hover:text-[#18181b] transition-colors">Technical Systems & Coding</Link></li>
              <li><Link to="/setup" className="hover:text-[#18181b] transition-colors">HR & Culture Fit</Link></li>
              <li><Link to="/setup" className="hover:text-[#18181b] transition-colors">Behavioural & Leadership</Link></li>
              <li><Link to="/setup" className="hover:text-[#18181b] transition-colors">System Design & Problem Solving</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-mono uppercase tracking-wider text-[11px] font-semibold text-[#18181b] mb-3">
              Evaluation Metrics
            </div>
            <ul className="space-y-1.5">
              <li>Speaking Duration & Cadence (WPM)</li>
              <li>Verbal Filler Word Frequency</li>
              <li>STAR Structural Completeness</li>
              <li>Technical Concept Relevance</li>
            </ul>
          </div>

          <div>
            <div className="font-mono uppercase tracking-wider text-[11px] font-semibold text-[#18181b] mb-3">
              Placement Cell
            </div>
            <p className="leading-relaxed mb-2">
              Coordinators can access candidate performance reports, cohort analytics, and custom question banks.
            </p>
            <Link to="/admin" className="text-blue-600 font-medium hover:underline inline-block">
              Open Placement Admin Console &rarr;
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-[#e4e4e7] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#a1a1aa]">
          <div>
            &copy; 2026 Placement Interview Response Analyzer. Built for campus recruitment readiness.
          </div>
          <div className="mt-2 sm:mt-0 font-mono">
            Status: Web Speech API & Real-time Analyser Ready
          </div>
        </div>
      </div>
    </footer>
  );
};

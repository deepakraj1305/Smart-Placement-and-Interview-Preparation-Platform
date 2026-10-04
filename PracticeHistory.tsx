import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { InterviewSession } from '../types/interview';
import { History, Calendar, Award, ArrowRight, Mic, Search, ChevronRight, TrendingUp } from 'lucide-react';

export const PracticeHistory: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDomain, setFilterDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const url = user?.id ? `/api/sessions?user_id=${user.id}` : '/api/sessions';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSessions(data || []);
      }
    } catch (err) {
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const filteredSessions = sessions.filter(s => {
    const matchesDomain = filterDomain === 'All' || s.domain === filterDomain;
    const matchesSearch =
      (s.target_role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.student_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  // Calculate quick metrics
  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const avgScore = completedCount > 0
    ? Math.round(sessions.reduce((acc, s) => acc + Number(s.overall_score || 0), 0) / completedCount)
    : 0;
  const avgWpm = completedCount > 0
    ? Math.round(sessions.reduce((acc, s) => acc + Number(s.avg_wpm || 0), 0) / completedCount)
    : 0;

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e4e4e7] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#71717a] uppercase mb-1">
              <span>Placement Workstation</span>
              <span>/</span>
              <span className="text-[#18181b] font-semibold">Practice History</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181b]">
              Your Interview Sessions & Progress
            </h1>
            <p className="text-xs sm:text-sm text-[#52525b] mt-0.5">
              Review completed response assessments, pacing trends, and verbal refinement over time.
            </p>
          </div>

          <Link
            to="/setup"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#18181b] text-white rounded hover:bg-[#27272a] transition-colors shadow-xs shrink-0"
          >
            <Mic className="w-3.5 h-3.5 text-blue-400" />
            <span>Start New Interview</span>
          </Link>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#e4e4e7] rounded-lg p-4 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-[#71717a] block">Completed Interviews</span>
            <div className="text-2xl font-bold font-mono text-[#18181b] mt-1">{completedCount}</div>
            <span className="text-[11px] text-[#71717a]">Recorded campus rounds</span>
          </div>

          <div className="bg-white border border-[#e4e4e7] rounded-lg p-4 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-[#71717a] block">Average Overall Score</span>
            <div className="text-2xl font-bold font-mono text-[#18181b] mt-1">{avgScore}<span className="text-xs text-[#a1a1aa] font-normal">/100</span></div>
            <span className="text-[11px] text-emerald-700 font-medium">{avgScore >= 75 ? 'Placement Ready benchmark' : 'Progressing well'}</span>
          </div>

          <div className="bg-white border border-[#e4e4e7] rounded-lg p-4 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-[#71717a] block">Mean Speaking Cadence</span>
            <div className="text-2xl font-bold font-mono text-[#18181b] mt-1">{avgWpm} <span className="text-xs text-[#a1a1aa] font-normal">WPM</span></div>
            <span className="text-[11px] text-[#71717a]">Target range: 125-155 WPM</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-[#e4e4e7] rounded-lg shadow-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Search className="w-4 h-4 text-[#71717a] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by target role or student..."
              className="text-xs bg-transparent text-[#18181b] focus:outline-none w-full sm:w-64"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {['All', 'Technical', 'HR', 'Behavioural', 'System Design'].map(d => (
              <button
                key={d}
                onClick={() => setFilterDomain(d)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  filterDomain === d
                    ? 'bg-[#18181b] text-white'
                    : 'bg-[#f4f4f5] text-[#52525b] hover:bg-[#e4e4e7]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* History Table / Card List */}
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#71717a]">
            Loading practice records...
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-white border border-[#e4e4e7] rounded-lg p-10 text-center space-y-3">
            <p className="text-xs text-[#71717a]">No practice sessions found for this filter.</p>
            <Link
              to="/setup"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 underline"
            >
              Start your first placement interview &rarr;
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-[#e4e4e7] rounded-lg shadow-xs overflow-hidden">
            <div className="divide-y divide-[#e4e4e7]">
              {filteredSessions.map(session => {
                const dateStr = new Date(session.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                const score = Number(session.overall_score || 0);

                return (
                  <Link
                    key={session.id}
                    to={session.status === 'completed' ? `/report/${session.id}` : `/workstation/${session.id}`}
                    className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#fafafa] transition-colors group block"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#71717a] uppercase">
                        <span>{dateStr}</span>
                        <span>&bull;</span>
                        <span className="font-semibold text-[#18181b]">{session.domain}</span>
                        <span>&bull;</span>
                        <span>{session.difficulty}</span>
                      </div>
                      <div className="text-sm font-semibold text-[#18181b] group-hover:text-blue-600 transition-colors">
                        {session.target_role}
                      </div>
                      <div className="text-xs text-[#52525b]">
                        {session.student_name} &bull; {session.question_count} questions &bull; {session.avg_wpm || 0} WPM average
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-base font-bold font-mono text-[#18181b]">
                          {score > 0 ? `${score}/100` : 'In Progress'}
                        </div>
                        <span className={`text-[10px] font-mono uppercase font-semibold ${
                          score >= 75 ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {session.status === 'completed' ? (score >= 75 ? 'Placement Ready' : 'Needs Practice') : 'Resume'}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#18181b] transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

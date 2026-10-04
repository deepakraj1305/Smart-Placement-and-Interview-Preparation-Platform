import React, { useState, useEffect } from 'react';
import { PlacementAdminStats, Question } from '../types/interview';
import {
  Shield,
  BarChart2,
  Users,
  CheckCircle,
  FileText,
  Plus,
  Trash2,
  Search,
  Filter,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<PlacementAdminStats | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'questions'>('overview');

  // New Question Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState<'Technical' | 'HR' | 'Behavioural' | 'System Design'>('Technical');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newCategory, setNewCategory] = useState('');
  const [newIdealPoints, setNewIdealPoints] = useState('');
  const [newSampleAnswer, setNewSampleAnswer] = useState('');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, qRes] = await Promise.all([
        fetch('/api/admin-stats'),
        fetch('/api/questions')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (qRes.ok) {
        const qData = await qRes.json();
        setQuestions(qData || []);
      }
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setIsAddingQuestion(true);
      const pointsArray = newIdealPoints
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          domain: newDomain,
          difficulty: newDifficulty,
          category: newCategory.trim() || 'Core Assessment',
          ideal_points: pointsArray,
          star_framework_needed: newDomain === 'Behavioural' || newDomain === 'HR',
          sample_answer: newSampleAnswer.trim()
        })
      });

      if (res.ok) {
        setNewTitle('');
        setNewCategory('');
        setNewIdealPoints('');
        setNewSampleAnswer('');
        fetchAdminData();
      }
    } catch (err) {
      console.error('Create question error:', err);
    } finally {
      setIsAddingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('Are you sure you want to remove this question from the placement pool?')) return;
    try {
      const res = await fetch(`/api/questions?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error('Delete question error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#18181b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-[#71717a]">Loading Placement Cell Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-[#e4e4e7] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#71717a] uppercase mb-1">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Campus Recruitment Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181b]">
              Placement Cell Administration
            </h1>
            <p className="text-xs sm:text-sm text-[#52525b] mt-0.5">
              Monitor student interview readiness, review transcripts, and manage custom campus question banks.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-[#f4f4f5] p-1 rounded-md border border-[#e4e4e7] text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'overview' ? 'bg-white text-[#18181b] shadow-xs' : 'text-[#71717a]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'sessions' ? 'bg-white text-[#18181b] shadow-xs' : 'text-[#71717a]'
              }`}
            >
              Candidate Records
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'questions' ? 'bg-white text-[#18181b] shadow-xs' : 'text-[#71717a]'
              }`}
            >
              Question Bank ({questions.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e4e4e7] rounded-lg p-4 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-[#71717a] block">Total Interviews</span>
                <div className="text-2xl font-bold font-mono text-[#18181b] mt-1">{stats.total_sessions}</div>
                <span className="text-[11px] text-[#71717a]">{stats.completed_sessions} completed</span>
              </div>

              <div className="bg-white border border-[#e4e4e7] rounded-lg p-4 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-[#71717a] block">Readiness Rate (&ge;75)</span>
                <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{stats.placement_readiness_rate}%</div>
                <span className="text-[11px] text-[#71717a]">Placement benchmark</span>
              </div>

              <div className="bg-white border border-[#e4e4e7] rounded-lg p-4 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-[#71717a] block">Average Score</span>
                <div className="text-2xl font-bold font-mono text-[#18181b] mt-1">{stats.avg_overall_score}<span className="text-xs text-[#a1a1aa] font-normal">/100</span></div>
                <span className="text-[11px] text-[#71717a]">All cohorts</span>
              </div>

              <div className="bg-white border border-[#e4e4e7] rounded-lg p-4 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-[#71717a] block">Mean Speaking Cadence</span>
                <div className="text-2xl font-bold font-mono text-[#18181b] mt-1">{stats.avg_wpm} <span className="text-xs text-[#a1a1aa] font-normal">WPM</span></div>
                <span className="text-[11px] text-[#71717a]">Across speech transcripts</span>
              </div>
            </div>

            {/* Domain Benchmarks */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg p-5 shadow-xs">
              <h3 className="text-sm font-semibold text-[#18181b] mb-3">
                Domain-Wise Performance Benchmarks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {stats.domain_averages.map((d, i) => (
                  <div key={i} className="p-3 bg-[#fafafa] border border-[#e4e4e7] rounded">
                    <span className="text-xs font-semibold text-[#18181b] block">{d.domain}</span>
                    <div className="text-lg font-bold font-mono text-[#18181b] mt-1">
                      {d.avg_score}<span className="text-xs text-[#a1a1aa] font-normal">/100</span>
                    </div>
                    <span className="text-[10px] text-[#71717a]">{d.interviews} interviews conducted</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Sessions Table */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[#e4e4e7] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#18181b]">
                  Recent Student Placement Practice Sessions
                </h3>
                <span className="text-xs font-mono text-[#71717a]">Showing latest 15 records</span>
              </div>

              <div className="divide-y divide-[#e4e4e7]">
                {stats.recent_sessions.map(s => (
                  <div key={s.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#18181b]">{s.student_name}</div>
                      <div className="text-[#71717a] text-[11px] font-mono">{s.student_email} &bull; {s.target_role} ({s.domain})</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right font-mono">
                        <span className="font-bold text-[#18181b]">{s.overall_score || 0}/100</span>
                        <span className="block text-[10px] text-[#71717a]">{s.avg_wpm || 0} WPM</span>
                      </div>
                      <a
                        href={`/report/${s.id}`}
                        className="px-2.5 py-1 text-[11px] font-medium bg-[#18181b] text-white rounded hover:bg-[#27272a]"
                      >
                        Inspect Report
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sessions list */}
        {activeTab === 'sessions' && stats && (
          <div className="bg-white border border-[#e4e4e7] rounded-lg shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#e4e4e7]">
              <h3 className="text-sm font-semibold text-[#18181b]">Candidate Interview Session Registry</h3>
            </div>
            <div className="divide-y divide-[#e4e4e7]">
              {stats.recent_sessions.map(s => (
                <div key={s.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#18181b]">{s.student_name}</span>
                    <span className="text-[#71717a] block text-[11px] font-mono">{s.student_email} &bull; Track: {s.domain} &bull; {s.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#18181b]">{s.overall_score || 0}/100</span>
                    <a
                      href={`/report/${s.id}`}
                      className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#d4d4d8] text-[#18181b] rounded hover:bg-[#f4f4f5]"
                    >
                      View Full Sheet
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Custom Question Bank Management */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            {/* Add Question Form */}
            <form onSubmit={handleCreateQuestion} className="bg-white border border-[#e4e4e7] rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#71717a] font-semibold">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Add Placement Interview Question to Pool</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-[#71717a] mb-1 font-medium">Domain</label>
                  <select
                    value={newDomain}
                    onChange={e => setNewDomain(e.target.value as any)}
                    className="w-full text-xs p-2 border border-[#e4e4e7] rounded bg-white text-[#18181b]"
                  >
                    <option value="Technical">Technical</option>
                    <option value="HR">HR</option>
                    <option value="Behavioural">Behavioural</option>
                    <option value="System Design">System Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#71717a] mb-1 font-medium">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={e => setNewDifficulty(e.target.value as any)}
                    className="w-full text-xs p-2 border border-[#e4e4e7] rounded bg-white text-[#18181b]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#71717a] mb-1 font-medium">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="e.g. Data Structures, Conflict Resolution"
                    className="w-full text-xs p-2 border border-[#e4e4e7] rounded bg-white text-[#18181b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#71717a] mb-1 font-medium">Question Text</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Describe a scenario where you had to debug a race condition under tight production deadlines."
                  className="w-full text-xs p-2 border border-[#e4e4e7] rounded bg-white text-[#18181b]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#71717a] mb-1 font-medium">Ideal Evaluated Concepts (Comma-separated)</label>
                <input
                  type="text"
                  value={newIdealPoints}
                  onChange={e => setNewIdealPoints(e.target.value)}
                  placeholder="Mutex, Deadlock, Logging, Profiling, Root Cause Analysis"
                  className="w-full text-xs p-2 border border-[#e4e4e7] rounded bg-white text-[#18181b]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isAddingQuestion || !newTitle.trim()}
                  className="px-4 py-2 text-xs font-semibold bg-[#18181b] text-white rounded hover:bg-[#27272a] disabled:opacity-50"
                >
                  {isAddingQuestion ? 'Adding Question...' : 'Add to Question Bank'}
                </button>
              </div>
            </form>

            {/* List Existing Questions */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[#e4e4e7] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#18181b]">Active Question Pool ({questions.length})</h3>
              </div>

              <div className="divide-y divide-[#e4e4e7]">
                {questions.map((q, idx) => (
                  <div key={q.id || idx} className="p-4 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#71717a] uppercase">
                        <span>{q.domain}</span>
                        <span>&bull;</span>
                        <span>{q.difficulty}</span>
                        <span>&bull;</span>
                        <span>{q.category}</span>
                      </div>
                      <div className="font-semibold text-[#18181b]">{q.title}</div>
                      {q.ideal_points && q.ideal_points.length > 0 && (
                        <div className="text-[11px] text-[#71717a]">
                          Keywords: {q.ideal_points.join(', ')}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1.5 text-[#a1a1aa] hover:text-red-600 transition-colors"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

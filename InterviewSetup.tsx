import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Question } from '../types/interview';
import { Mic, ArrowRight, Settings, Check, BookOpen, Layers, Target, Shield, HelpCircle } from 'lucide-react';

export const InterviewSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [domain, setDomain] = useState<'Technical' | 'HR' | 'Behavioural' | 'System Design'>('Technical');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [targetRole, setTargetRole] = useState('Software Engineer (SDE)');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (user?.email) {
      setStudentEmail(user.email);
      setStudentName(user.email.split('@')[0]);
    } else {
      setStudentName('Campus Candidate');
      setStudentEmail('candidate@college.edu');
    }
  }, [user]);

  // Fetch sample questions matching selection
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await fetch(`/api/questions?domain=${domain}&difficulty=${difficulty}&limit=3`);
        if (res.ok) {
          const data = await res.json();
          setPreviewQuestions(data);
        }
      } catch (err) {
        console.error('Failed to preview questions', err);
      }
    };
    fetchPreview();
  }, [domain, difficulty]);

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || `guest-${Date.now()}`,
          student_name: studentName.trim() || 'Placement Candidate',
          student_email: studentEmail.trim() || 'candidate@college.edu',
          domain,
          target_role: targetRole,
          difficulty,
          question_count: Number(questionCount)
        })
      });

      if (!res.ok) {
        throw new Error('Failed to create interview session');
      }

      const sessionData = await res.json();
      navigate(`/workstation/${sessionData.id}`);
    } catch (err) {
      console.error(err);
      alert('Error creating interview session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const domainOptions = [
    {
      id: 'Technical',
      title: 'Technical & Coding',
      desc: 'Data structures, algorithms, system concepts, and core engineering reasoning.'
    },
    {
      id: 'HR',
      title: 'HR & Culture Fit',
      desc: 'Career aspirations, strengths, compensation outlook, and college background.'
    },
    {
      id: 'Behavioural',
      title: 'Behavioural (STAR)',
      desc: 'Conflict resolution, team leadership, tight deadlines, and ownership stories.'
    },
    {
      id: 'System Design',
      title: 'System Design',
      desc: 'Scalability, microservices, database schemas, and architectural trade-offs.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#71717a] uppercase mb-1">
            <span>Placement Workstation</span>
            <span>/</span>
            <span className="text-[#18181b] font-semibold">Interview Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181b]">
            Configure Your Placement Practice Session
          </h1>
          <p className="text-xs sm:text-sm text-[#52525b] mt-1">
            Tailor the domain, pacing criteria, and difficulty before starting live microphone transcription.
          </p>
        </div>

        <form onSubmit={handleStartInterview} className="space-y-8">
          {/* Section 1: Domain Selection */}
          <div className="bg-white border border-[#e4e4e7] rounded-lg p-5 sm:p-6 shadow-xs">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#71717a] font-semibold mb-3">
              1. Select Interview Domain
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {domainOptions.map(opt => {
                const isSelected = domain === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDomain(opt.id as any)}
                    className={`p-4 rounded-md border text-left transition-all ${
                      isSelected
                        ? 'border-[#18181b] bg-[#18181b]/[0.02] ring-1 ring-[#18181b]'
                        : 'border-[#e4e4e7] hover:border-[#d4d4d8] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-[#18181b]">{opt.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-xs text-[#52525b] leading-relaxed">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Difficulty & Question Count */}
          <div className="bg-white border border-[#e4e4e7] rounded-lg p-5 sm:p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#71717a] font-semibold mb-2">
                2. Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Easy', 'Medium', 'Hard'] as const).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2 px-3 text-xs font-medium rounded border text-center transition-all ${
                      difficulty === lvl
                        ? 'bg-[#18181b] text-white border-[#18181b]'
                        : 'bg-white text-[#52525b] border-[#e4e4e7] hover:border-[#d4d4d8]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#71717a] mt-1.5">
                {difficulty === 'Easy' && 'Foundational definitions and core fundamentals.'}
                {difficulty === 'Medium' && 'Standard campus placement interview questions.'}
                {difficulty === 'Hard' && 'Edge cases, architectural trade-offs, and multi-tier problems.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#71717a] font-semibold mb-2">
                3. Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 8].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-2 px-3 text-xs font-medium rounded border text-center transition-all ${
                      questionCount === cnt
                        ? 'bg-[#18181b] text-white border-[#18181b]'
                        : 'bg-white text-[#52525b] border-[#e4e4e7] hover:border-[#d4d4d8]'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#71717a] mt-1.5 font-mono">
                Est. Duration: ~{questionCount * 2} minutes
              </p>
            </div>
          </div>

          {/* Section 3: Target Role & Candidate Details */}
          <div className="bg-white border border-[#e4e4e7] rounded-lg p-5 sm:p-6 shadow-xs">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#71717a] font-semibold mb-3">
              4. Target Role & Candidate Profile
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] text-[#71717a] mb-1 font-medium">Target Placement Role</label>
                <select
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full text-xs bg-white border border-[#e4e4e7] rounded p-2 text-[#18181b] focus:outline-none focus:border-[#18181b]"
                >
                  <option value="Software Engineer (SDE)">Software Engineer (SDE)</option>
                  <option value="Fullstack Web Developer">Fullstack Web Developer</option>
                  <option value="Data Analyst / Scientist">Data Analyst / Scientist</option>
                  <option value="Associate Product Manager">Associate Product Manager</option>
                  <option value="Systems / DevOps Engineer">Systems / DevOps Engineer</option>
                  <option value="Business Technology Analyst">Business Technology Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#71717a] mb-1 font-medium">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full text-xs bg-white border border-[#e4e4e7] rounded p-2 text-[#18181b] focus:outline-none focus:border-[#18181b]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#71717a] mb-1 font-medium">College Email</label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={e => setStudentEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full text-xs bg-white border border-[#e4e4e7] rounded p-2 text-[#18181b] focus:outline-none focus:border-[#18181b]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Question Pool Preview */}
          {previewQuestions.length > 0 && (
            <div className="bg-[#f8f9fa] border border-[#e4e4e7] rounded-lg p-4">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-[#71717a] font-semibold mb-2">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Sample Questions in This Pool</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#3f3f46]">
                {previewQuestions.map((q, idx) => (
                  <li key={q.id || idx} className="flex items-start gap-2">
                    <span className="font-mono text-[#71717a]">{idx + 1}.</span>
                    <span>{q.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-[#71717a] font-mono">
              Ready: Microphone input enabled &bull; Speech-to-Text active
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold bg-[#18181b] text-white rounded hover:bg-[#27272a] transition-all disabled:opacity-50 shadow-xs"
            >
              <Mic className="w-4 h-4 text-blue-400" />
              <span>{loading ? 'Initializing Session...' : 'Start Interview'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

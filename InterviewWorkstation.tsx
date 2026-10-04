import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question, InterviewSession, QuestionResponse } from '../types/interview';
import { analyzeTranscriptLocally, FILLER_WORDS_LIST } from '../lib/analyzer';
import { playAudioFeedback } from '../lib/soundEffects';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { PacingGauge } from '../components/PacingGauge';
import { FillerBadge } from '../components/FillerBadge';
import { FeedbackCard } from '../components/FeedbackCard';
import { Mic, MicOff, Volume2, Clock, Play, Square, RefreshCw, Send, CheckCircle, Keyboard, AlertCircle, HelpCircle } from 'lucide-react';

export const InterviewWorkstation: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  // Session & Questions State
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Live Recording & Speech Recognition State
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [inputMode, setInputMode] = useState<'voice' | 'typed'>('voice');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Timer
  const [elapsedSec, setElapsedSec] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Analysis & Feedback for current question
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResponseAnalysis, setCurrentResponseAnalysis] = useState<Partial<QuestionResponse> | null>(null);
  const [completedResponses, setCompletedResponses] = useState<QuestionResponse[]>([]);

  // Speech Recognition Reference
  const recognitionRef = useRef<any>(null);

  // Load Session and Questions
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true);
        if (!sessionId) return;
        const res = await fetch(`/api/sessions?id=${sessionId}`);
        if (!res.ok) throw new Error('Could not load session');
        const data: InterviewSession = await res.json();
        setSession(data);

        // Fetch corresponding questions
        const qRes = await fetch(`/api/questions?domain=${data.domain}&difficulty=${data.difficulty}&limit=${data.question_count}`);
        let qData: Question[] = [];
        if (qRes.ok) {
          qData = await qRes.json();
        }

        // If not enough questions in DB, fallback to domain questions
        if (!qData || qData.length === 0) {
          const fallbackRes = await fetch(`/api/questions?limit=${data.question_count}`);
          if (fallbackRes.ok) {
            qData = await fallbackRes.json();
          }
        }

        setQuestions(qData || []);

        if (data.responses && data.responses.length > 0) {
          setCompletedResponses(data.responses);
          if (data.responses.length < (qData?.length || 0)) {
            setCurrentIndex(data.responses.length);
          }
        }
      } catch (err) {
        console.error('Session load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  // Initialize Speech Recognition API
  useEffect(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setSpeechSupported(false);
      setInputMode('typed');
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let currentInterim = '';
      let newlyFinalized = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newlyFinalized += transcriptSegment + ' ';
        } else {
          currentInterim += transcriptSegment;
        }
      }

      if (newlyFinalized) {
        setFinalTranscript(prev => (prev + ' ' + newlyFinalized).trim());
      }
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition event error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'audio-capture') {
        alert('Microphone permission not granted. You can switch to typed answer mode below.');
        setInputMode('typed');
      }
    };

    recognition.onend = () => {
      // If we are supposed to be recording, restart to keep continuous
      if (isRecording) {
        try {
          recognition.start();
        } catch {
          // ignore already started error
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, [isRecording]);

  // Handle Recording Toggle
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      setIsRecording(true);
      setElapsedSec(0);
      playAudioFeedback('start');

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setElapsedSec(prev => prev + 1);
      }, 1000);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Recognition start caught', e);
        }
      }
    } catch (err) {
      console.error('Mic access error:', err);
      alert('Could not access microphone. Please enable microphone permissions in your browser or type your answer.');
      setInputMode('typed');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    playAudioFeedback('stop');

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  // Text-to-speech for Question Reading
  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Full response text
  const currentFullTranscript = `${finalTranscript} ${interimTranscript}`.trim();

  // Word count & live WPM
  const currentWords = currentFullTranscript.length > 0 ? currentFullTranscript.split(/\s+/).filter(w => w.length > 0) : [];
  const liveWpm = elapsedSec > 0 && currentWords.length > 0 ? Math.round((currentWords.length / elapsedSec) * 60) : 0;

  // Live fillers
  const liveFillerBreakdown: Record<string, number> = {};
  let liveFillerCount = 0;
  FILLER_WORDS_LIST.forEach(f => {
    const rx = new RegExp(`\\b${f}\\b`, 'gi');
    const m = currentFullTranscript.match(rx);
    if (m && m.length > 0) {
      liveFillerBreakdown[f] = m.length;
      liveFillerCount += m.length;
    }
  });

  const currentQuestion = questions[currentIndex] || {
    id: 1,
    title: 'Explain how you approach optimizing slow database queries in high-traffic applications.',
    domain: session?.domain || 'Technical',
    difficulty: session?.difficulty || 'Medium',
    expected_duration_sec: 90,
    ideal_points: ['Indexing', 'Execution Plan', 'Caching', 'N+1 queries', 'Connection pooling'],
    star_framework_needed: false,
    sample_answer: ''
  };

  // Submit and Analyze Response
  const handleSubmitResponse = async () => {
    if (isRecording) {
      stopRecording();
    }

    if (!currentFullTranscript || currentWords.length < 5) {
      alert('Please speak or type a complete response (at least 5 words) before submitting.');
      return;
    }

    setIsAnalyzing(true);
    playAudioFeedback('alert');

    try {
      // Call backend analyzer endpoint
      const response = await fetch('/api/analyze-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: currentFullTranscript,
          question_title: currentQuestion.title,
          domain: currentQuestion.domain,
          expected_duration_sec: currentQuestion.expected_duration_sec,
          ideal_points: currentQuestion.ideal_points,
          duration_sec: elapsedSec > 0 ? elapsedSec : Math.max(10, Math.round(currentWords.length / 2.2))
        })
      });

      let analysisData;
      if (response.ok) {
        analysisData = await response.json();
      } else {
        // Fallback to robust client analyzer
        analysisData = analyzeTranscriptLocally(
          currentFullTranscript,
          currentQuestion.title,
          currentQuestion.domain,
          currentQuestion.ideal_points,
          elapsedSec
        );
      }

      // Save to question_responses in Supabase
      const saveRes = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: Number(sessionId),
          question_id: currentQuestion.id,
          question_title: currentQuestion.title,
          domain: currentQuestion.domain,
          order_index: currentIndex + 1,
          transcript: currentFullTranscript,
          input_method: inputMode === 'typed' ? 'typed' : 'voice',
          duration_sec: analysisData.duration_sec,
          word_count: analysisData.word_count,
          wpm: analysisData.wpm,
          filler_count: analysisData.filler_count,
          filler_words_breakdown: analysisData.filler_words_breakdown,
          repeated_words: analysisData.repeated_words,
          relevance_score: analysisData.relevance_score,
          structure_score: analysisData.structure_score,
          overall_score: analysisData.overall_score,
          star_breakdown: analysisData.star_breakdown,
          what_worked: analysisData.what_worked,
          tighten_this: analysisData.tighten_this,
          try_this_next_time: analysisData.try_this_next_time
        })
      });

      let savedResponse = analysisData;
      if (saveRes.ok) {
        savedResponse = await saveRes.json();
      }

      setCurrentResponseAnalysis(savedResponse);
      setCompletedResponses(prev => [...prev, savedResponse]);
      playAudioFeedback('success');
    } catch (err) {
      console.error('Submission error:', err);
      // Client fallback
      const localResult = analyzeTranscriptLocally(
        currentFullTranscript,
        currentQuestion.title,
        currentQuestion.domain,
        currentQuestion.ideal_points,
        elapsedSec
      );
      setCurrentResponseAnalysis(localResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Next Question or Finish
  const handleProceedNext = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setFinalTranscript('');
      setInterimTranscript('');
      setElapsedSec(0);
      setCurrentResponseAnalysis(null);
    } else {
      // Calculate overall session averages & complete session
      const allResponses = [...completedResponses];
      const avgOverall = allResponses.length > 0
        ? Math.round(allResponses.reduce((acc, r) => acc + (r.overall_score || 0), 0) / allResponses.length)
        : 75;
      const avgWpmVal = allResponses.length > 0
        ? Math.round(allResponses.reduce((acc, r) => acc + (r.wpm || 0), 0) / allResponses.length)
        : 135;
      const totalFillers = allResponses.reduce((acc, r) => acc + (r.filler_count || 0), 0);
      const totalWords = allResponses.reduce((acc, r) => acc + (r.word_count || 0), 0);
      const fillerRate = totalWords > 0 ? Number(((totalFillers / totalWords) * 100).toFixed(1)) : 0;

      await fetch('/api/sessions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Number(sessionId),
          status: 'completed',
          overall_score: avgOverall,
          communication_score: Math.min(98, Math.max(40, avgOverall + 2)),
          content_score: avgOverall,
          structure_score: avgOverall,
          pacing_score: avgWpmVal >= 120 && avgWpmVal <= 160 ? 95 : 78,
          avg_wpm: avgWpmVal,
          total_filler_words: totalFillers,
          filler_rate_percent: fillerRate,
          summary_notes: `Candidate completed ${allResponses.length} placement questions. Average cadence: ${avgWpmVal} WPM with ${totalFillers} total filler crutches.`
        })
      });

      navigate(`/report/${sessionId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#18181b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-[#71717a]">Initializing Placement Workstation...</p>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-[#fbfbfb] pb-20">
      {/* Top Workstation Status Bar */}
      <div className="bg-white border-b border-[#e4e4e7] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-[#18181b] text-white px-2 py-0.5 rounded font-semibold">
              Q{currentIndex + 1} of {questions.length}
            </span>
            <div className="text-xs text-[#52525b]">
              Track: <strong className="text-[#18181b]">{session?.domain || 'Technical'}</strong> &bull; Role: <strong className="text-[#18181b]">{session?.target_role || 'SDE'}</strong>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#71717a]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Elapsed: <strong className="text-[#18181b] font-mono">{elapsedSec}s</strong></span>
            </div>
            <div className="hidden sm:block">
              Words: <strong className="text-[#18181b]">{currentWords.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workstation Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Question Card & Expected Criteria (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Question Card */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg p-5 shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#71717a] uppercase mb-2">
                <span>{currentQuestion.category || currentQuestion.domain} &bull; {currentQuestion.difficulty}</span>
                <button
                  onClick={() => speakQuestion(currentQuestion.title)}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                  title="Read question out loud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-[#18181b] tracking-tight leading-snug mb-4">
                {currentQuestion.title}
              </h2>

              <div className="pt-3 border-t border-[#f4f4f5] text-xs text-[#71717a] flex items-center justify-between">
                <span>Recommended Answer: ~{currentQuestion.expected_duration_sec || 90}s</span>
                <span className="font-mono">
                  {currentQuestion.star_framework_needed ? 'STAR Method Recommended' : 'Structured Technical Beat'}
                </span>
              </div>
            </div>

            {/* Expected Core Concepts / Key Points */}
            {currentQuestion.ideal_points && currentQuestion.ideal_points.length > 0 && (
              <div className="bg-white border border-[#e4e4e7] rounded-lg p-4 shadow-xs">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Placement Panel Evaluates For:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentQuestion.ideal_points.map((pt, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-[#f4f4f5] text-[#3f3f46] px-2.5 py-1 rounded border border-[#e4e4e7]"
                    >
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Real-Time Live Ticker Panels */}
            <div className="space-y-3">
              <PacingGauge wpm={liveWpm} />
              <FillerBadge
                fillerCount={liveFillerCount}
                fillerBreakdown={liveFillerBreakdown}
                repeatedWords={[]}
              />
            </div>
          </div>

          {/* Right Column: Interactive Recording / Transcription Terminal (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Recording Console */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7] mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isRecording ? 'bg-red-500 animate-pulse' : 'bg-zinc-400'
                    }`}
                  />
                  <span className="text-xs font-semibold text-[#18181b]">
                    {isRecording ? 'Microphone Active — Listening' : 'Interview Terminal'}
                  </span>
                </div>

                {/* Switch mode */}
                <div className="flex items-center gap-1 bg-[#f4f4f5] p-0.5 rounded border border-[#e4e4e7] text-[11px]">
                  <button
                    onClick={() => setInputMode('voice')}
                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                      inputMode === 'voice' ? 'bg-white text-[#18181b] shadow-xs' : 'text-[#71717a]'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Mic className="w-3 h-3" />
                      Voice Input
                    </span>
                  </button>
                  <button
                    onClick={() => setInputMode('typed')}
                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                      inputMode === 'typed' ? 'bg-white text-[#18181b] shadow-xs' : 'text-[#71717a]'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Keyboard className="w-3 h-3" />
                      Typed Fallback
                    </span>
                  </button>
                </div>
              </div>

              {/* Audio Visualizer */}
              {inputMode === 'voice' && (
                <div className="mb-4">
                  <AudioVisualizer isRecording={isRecording} stream={mediaStream} />
                </div>
              )}

              {/* Voice Controls */}
              {inputMode === 'voice' && (
                <div className="flex items-center gap-3 mb-4">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#18181b] text-white rounded hover:bg-[#27272a] transition-all shadow-xs"
                    >
                      <Mic className="w-4 h-4 text-blue-400" />
                      <span>Start Recording Answer</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-rose-600 text-white rounded hover:bg-rose-700 transition-all shadow-xs animate-pulse"
                    >
                      <Square className="w-4 h-4" />
                      <span>Stop & Review Audio</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setFinalTranscript('');
                      setInterimTranscript('');
                      setElapsedSec(0);
                    }}
                    disabled={isRecording || (!finalTranscript && !interimTranscript)}
                    className="p-2.5 text-[#71717a] hover:text-[#18181b] border border-[#e4e4e7] rounded hover:bg-[#f4f4f5] disabled:opacity-30 transition-colors"
                    title="Clear transcript"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Live Transcript / Typed Area */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-medium mb-1.5 flex items-center justify-between">
                  <span>Your Response {inputMode === 'voice' ? '(Live Speech Stream)' : '(Typed Answer)'}</span>
                  <span className="text-[#a1a1aa] font-normal">{currentWords.length} words recorded</span>
                </label>

                {inputMode === 'voice' ? (
                  <div className="min-h-[140px] max-h-[220px] overflow-y-auto p-3.5 bg-[#fafafa] border border-[#e4e4e7] rounded-md text-xs leading-relaxed text-[#18181b]">
                    {currentFullTranscript ? (
                      <p>
                        <span>{finalTranscript}</span>
                        {interimTranscript && (
                          <span className="text-blue-600 italic animate-pulse"> {interimTranscript}</span>
                        )}
                      </p>
                    ) : (
                      <p className="text-[#a1a1aa] italic">
                        {isRecording
                          ? 'Listening to microphone... Begin speaking your response.'
                          : 'Press "Start Recording Answer" above to begin voice capture.'}
                      </p>
                    )}
                  </div>
                ) : (
                  <textarea
                    rows={6}
                    value={finalTranscript}
                    onChange={e => setFinalTranscript(e.target.value)}
                    placeholder="Type your complete structured interview response here. Mention your approach, specific implementation steps, and concrete results..."
                    className="w-full text-xs p-3.5 bg-white border border-[#e4e4e7] rounded-md text-[#18181b] leading-relaxed focus:outline-none focus:border-[#18181b]"
                  />
                )}
              </div>

              {/* Action Submit */}
              <div className="mt-4 pt-3 border-t border-[#e4e4e7] flex items-center justify-between">
                <div className="text-[11px] text-[#71717a]">
                  {currentWords.length < 5 ? (
                    <span className="text-amber-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Min. 5 words required for analysis
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Ready for evaluation
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSubmitResponse}
                  disabled={isAnalyzing || currentWords.length < 5}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-[#18181b] text-white rounded hover:bg-[#27272a] transition-all disabled:opacity-40 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAnalyzing ? 'Analyzing Response...' : 'Submit Response'}</span>
                </button>
              </div>
            </div>

            {/* Response Assessment Result (Shown immediately after submitting) */}
            {currentResponseAnalysis && (
              <FeedbackCard
                response={currentResponseAnalysis}
                onNext={handleProceedNext}
                isLastQuestion={isLastQuestion}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

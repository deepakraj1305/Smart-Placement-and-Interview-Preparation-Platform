// Frontend analysis engine: provides real-time client metrics & local fallback
export interface AnalysisResult {
  duration_sec: number;
  word_count: number;
  wpm: number;
  filler_count: number;
  filler_words_breakdown: Record<string, number>;
  repeated_words: string[];
  relevance_score: number;
  structure_score: number;
  pacing_score: number;
  overall_score: number;
  star_breakdown: {
    has_situation: boolean;
    has_task: boolean;
    has_action: boolean;
    has_result: boolean;
  };
  what_worked: string[];
  tighten_this: string[];
  try_this_next_time: string;
}

export const FILLER_WORDS_LIST = [
  'um', 'uh', 'like', 'you know', 'actually', 'basically',
  'sort of', 'kind of', 'honestly', 'literally', 'so yeah',
  'i mean', 'right', 'you see', 'pretty much'
];

export function analyzeTranscriptLocally(
  transcript: string,
  questionTitle: string,
  domain: string,
  idealPoints: string[] = [],
  durationSec: number = 0
): AnalysisResult {
  const cleanText = (transcript || '').trim();
  const words = cleanText.length > 0 ? cleanText.split(/\s+/).filter(w => w.length > 0) : [];
  const word_count = words.length;

  const speakingDuration = durationSec > 0 ? durationSec : Math.max(8, Math.round(word_count / 2.2));
  const minutes = speakingDuration / 60;
  const wpm = minutes > 0 && word_count > 0 ? Math.round(word_count / minutes) : 0;

  // Fillers breakdown
  const filler_words_breakdown: Record<string, number> = {};
  let filler_count = 0;

  FILLER_WORDS_LIST.forEach(filler => {
    const escaped = filler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const matches = cleanText.match(regex);
    if (matches && matches.length > 0) {
      filler_words_breakdown[filler] = matches.length;
      filler_count += matches.length;
    }
  });

  // Repeated adjacent words
  const repeated_words: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    const cur = words[i].toLowerCase().replace(/[^a-z0-9]/g, '');
    const nxt = words[i + 1].toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cur.length > 2 && cur === nxt && !repeated_words.includes(cur)) {
      repeated_words.push(cur);
    }
  }

  // STAR detection
  const star_breakdown = {
    has_situation: /(when i was|in my previous|during my|in college|at my internship|our team had|in this project|the situation was)/i.test(cleanText),
    has_task: /(my responsibility was|tasked with|needed to|the goal was|the challenge was|requirement was|objective was)/i.test(cleanText),
    has_action: /(i implemented|i designed|i coordinated|i built|i initiated|i decided to|i refactored|i communicated|i wrote)/i.test(cleanText),
    has_result: /(as a result|ultimately|led to|improved|increased|reduced|delivered|learned that|outcome was|impact)/i.test(cleanText)
  };

  let starScore = 0;
  if (star_breakdown.has_situation) starScore += 25;
  if (star_breakdown.has_task) starScore += 25;
  if (star_breakdown.has_action) starScore += 25;
  if (star_breakdown.has_result) starScore += 25;

  // Relevance matching
  let matchedCount = 0;
  idealPoints.forEach(pt => {
    const keyTerms = pt.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    if (keyTerms.some(term => cleanText.toLowerCase().includes(term))) {
      matchedCount++;
    }
  });

  const idealRatio = idealPoints.length > 0 ? (matchedCount / idealPoints.length) : 0.65;
  let relevance_score = 45;
  if (word_count >= 30) relevance_score += 20;
  if (word_count >= 70) relevance_score += 15;
  relevance_score += Math.round(idealRatio * 20);
  relevance_score = Math.min(96, Math.max(25, relevance_score));

  // Structure score
  let structure_score = 50;
  if (domain === 'HR' || domain === 'Behavioural') {
    structure_score = starScore > 0 ? starScore : 45;
  } else {
    const hasTechnicalKeywords = /(approach|complexity|architecture|data structure|trade-off|implementation|optimization|state|database)/i.test(cleanText);
    if (hasTechnicalKeywords) structure_score += 30;
    if (word_count >= 50) structure_score += 15;
    structure_score = Math.min(95, Math.max(35, structure_score));
  }

  // Pacing score
  let pacing_score = 75;
  if (wpm >= 120 && wpm <= 160) {
    pacing_score = 95;
  } else if (wpm >= 100 && wpm < 120) {
    pacing_score = 82;
  } else if (wpm > 160 && wpm <= 180) {
    pacing_score = 80;
  } else if (wpm > 180) {
    pacing_score = 60;
  } else if (wpm > 0 && wpm < 100) {
    pacing_score = 55;
  }

  // Filler score
  const fillerDensity = word_count > 0 ? (filler_count / word_count) : 0;
  const fillerScore = Math.max(25, Math.round(100 - (fillerDensity * 400)));

  // Overall Composite
  const overall_score = Math.round(
    (relevance_score * 0.35) +
    (structure_score * 0.25) +
    (pacing_score * 0.20) +
    (fillerScore * 0.20)
  );

  // Bullets
  const what_worked: string[] = [];
  if (word_count >= 40) {
    what_worked.push(`Solid response volume (${word_count} words) with direct addressing of the core prompt.`);
  }
  if (wpm >= 120 && wpm <= 160) {
    what_worked.push(`Balanced speaking cadence (${wpm} WPM) matching standard technical interview pacing.`);
  }
  if (filler_count <= 2 && word_count > 30) {
    what_worked.push('High verbal economy with very few filler utterances.');
  }
  if (star_breakdown.has_action && star_breakdown.has_result) {
    what_worked.push('Good ownership framing—clearly differentiated personal action from team results.');
  }
  if (what_worked.length === 0) {
    what_worked.push('Clear delivery and prompt focus without veering off-topic.');
  }

  const tighten_this: string[] = [];
  if (filler_count >= 3) {
    const topFillers = Object.entries(filler_words_breakdown)
      .sort((a, b) => b[1] - a[1])
      .map(([w, c]) => `"${w}" (${c}x)`)
      .slice(0, 2)
      .join(', ');
    tighten_this.push(`Filler crutches identified: ${topFillers}. Replace vocal pauses with steady 1-second silence.`);
  }
  if (wpm > 175) {
    tighten_this.push(`Speaking rate was high (${wpm} WPM). Moderate pace when explaining complex implementation steps.`);
  } else if (wpm > 0 && wpm < 105) {
    tighten_this.push(`Pace lagged at ${wpm} WPM. Outline your points mentally before speaking to maintain forward momentum.`);
  }
  if (repeated_words.length > 0) {
    tighten_this.push(`Repeated words detected: "${repeated_words.join(', ')}". Pause to clarify your next thought.`);
  }
  if (domain === 'HR' && !star_breakdown.has_result) {
    tighten_this.push('End your story with a concrete result or key takeaway rather than trailing off.');
  }
  if (word_count < 35) {
    tighten_this.push('Answer was brief. Expand with specific technical decisions, constraints, or lessons learned.');
  }
  if (tighten_this.length === 0) {
    tighten_this.push('Add a brief metric or edge-case consideration to demonstrate senior-level depth.');
  }

  let try_this_next_time = '';
  if (domain === 'Technical') {
    try_this_next_time = `Structured Blueprint:\n1. Core concept: "The underlying requirement is to optimize for..."\n2. Concrete execution: "In my approach, I would structure this using..."\n3. Verification & Trade-offs: "This guarantees O(N) linear time while keeping auxiliary space minimal."`;
  } else if (domain === 'HR' || domain === 'Behavioural') {
    try_this_next_time = `STAR Blueprint:\n1. Situation: Set the company/project context in 1 concise sentence.\n2. Task: Define your specific goal and constraint.\n3. Action: Detail 2-3 specific technical or organizational steps YOU led.\n4. Result: Conclude with quantified improvement and what you learned.`;
  } else {
    try_this_next_time = `Lead with the high-level solution first, then unpack components in order of priority before summarizing performance implications.`;
  }

  return {
    duration_sec: speakingDuration,
    word_count,
    wpm,
    filler_count,
    filler_words_breakdown,
    repeated_words,
    relevance_score,
    structure_score,
    pacing_score,
    overall_score,
    star_breakdown,
    what_worked,
    tighten_this,
    try_this_next_time
  };
}

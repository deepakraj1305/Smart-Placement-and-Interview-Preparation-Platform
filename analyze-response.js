// Response Analysis Serverless Endpoint
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
      transcript = '',
      question_title = '',
      domain = 'Technical',
      expected_duration_sec = 90,
      ideal_points = [],
      duration_sec = 0
    } = req.body;

    const cleanText = (transcript || '').trim();
    const words = cleanText.length > 0 ? cleanText.split(/\s+/).filter(w => w.length > 0) : [];
    const word_count = words.length;

    // Speaking time logic
    const speakingDuration = duration_sec > 0 ? duration_sec : Math.max(10, Math.round(word_count / 2.2));
    const minutes = speakingDuration / 60;
    const wpm = minutes > 0 && word_count > 0 ? Math.round(word_count / minutes) : 0;

    // Filler words detection
    const fillerPatterns = [
      { word: 'um', regex: /\b(um|umm|ummm)\b/gi },
      { word: 'uh', regex: /\b(uh|uhh|uhhh|er|err)\b/gi },
      { word: 'like', regex: /\b(like)\b/gi },
      { word: 'you know', regex: /\b(you know)\b/gi },
      { word: 'actually', regex: /\b(actually)\b/gi },
      { word: 'basically', regex: /\b(basically)\b/gi },
      { word: 'sort of', regex: /\b(sort of|sorta)\b/gi },
      { word: 'kind of', regex: /\b(kind of|kinda)\b/gi },
      { word: 'honestly', regex: /\b(honestly)\b/gi },
      { word: 'literally', regex: /\b(literally)\b/gi },
      { word: 'so yeah', regex: /\b(so yeah|so yeah basically)\b/gi },
      { word: 'i mean', regex: /\b(i mean)\b/gi },
      { word: 'right', regex: /\b(right\?|right)\b/gi }
    ];

    let filler_count = 0;
    const filler_words_breakdown = {};

    fillerPatterns.forEach(({ word, regex }) => {
      const matches = cleanText.match(regex);
      if (matches && matches.length > 0) {
        filler_words_breakdown[word] = matches.length;
        filler_count += matches.length;
      }
    });

    // Consecutive repeated words
    const repeated_words = [];
    for (let i = 0; i < words.length - 1; i++) {
      const current = words[i].toLowerCase().replace(/[^a-z0-9]/g, '');
      const next = words[i + 1].toLowerCase().replace(/[^a-z0-9]/g, '');
      if (current.length > 2 && current === next && !repeated_words.includes(current)) {
        repeated_words.push(current);
      }
    }

    // STAR framework detection for HR / Behavioural
    const starMarkers = {
      situation: [
        /\b(when i was|in my previous|during my|in college|at my internship|our team had|there was a situation|we were working on)\b/i,
        /\b(project|context|background|initial state|scenario)\b/i
      ],
      task: [
        /\b(my responsibility was|i was tasked with|we needed to|the goal was|the challenge was|objective was|requirement was)\b/i,
        /\b(target|deliverable|deadline|problem statement)\b/i
      ],
      action: [
        /\b(i implemented|i designed|i coordinated|i built|i initiated|i decided to|i refactored|i communicated with|i debugged)\b/i,
        /\b(step|approach|strategy|process|solution)\b/i
      ],
      result: [
        /\b(as a result|ultimately|which led to|improved|increased by|reduced by|delivered on time|learned that|the outcome was)\b/i,
        /\b(metrics|impact|success|takeaway|feedback received)\b/i
      ]
    };

    const star_breakdown = {
      has_situation: starMarkers.situation.some(rgx => rgx.test(cleanText)),
      has_task: starMarkers.task.some(rgx => rgx.test(cleanText)),
      has_action: starMarkers.action.some(rgx => rgx.test(cleanText)),
      has_result: starMarkers.result.some(rgx => rgx.test(cleanText))
    };

    let starScore = 0;
    if (star_breakdown.has_situation) starScore += 25;
    if (star_breakdown.has_task) starScore += 25;
    if (star_breakdown.has_action) starScore += 25;
    if (star_breakdown.has_result) starScore += 25;

    // Relevance scoring against question and ideal points
    let matchedIdealCount = 0;
    if (ideal_points && ideal_points.length > 0) {
      ideal_points.forEach(point => {
        const pointWords = point.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const matchFound = pointWords.some(pw => cleanText.toLowerCase().includes(pw));
        if (matchFound) matchedIdealCount++;
      });
    }

    const idealCoverage = ideal_points.length > 0 ? (matchedIdealCount / ideal_points.length) : 0.7;
    
    // Calculate Relevance Score (0 - 100)
    let relevance_score = 40;
    if (word_count >= 30) relevance_score += 20;
    if (word_count >= 80) relevance_score += 15;
    relevance_score += Math.round(idealCoverage * 25);
    relevance_score = Math.min(95, Math.max(20, relevance_score));

    // Calculate Structure Score (0 - 100)
    let structure_score = 50;
    if (domain === 'HR' || domain === 'Behavioural') {
      structure_score = starScore > 0 ? starScore : 45;
    } else {
      // Technical structure: problem -> solution -> trade-offs/results
      const hasTechStructure = /\b(approach|first|then|finally|trade-off|complexity|optimization|architecture)\b/i.test(cleanText);
      if (hasTechStructure) structure_score += 30;
      if (word_count >= 60) structure_score += 15;
      structure_score = Math.min(95, Math.max(30, structure_score));
    }

    // Pacing Evaluation
    let pacingScore = 75;
    if (wpm >= 120 && wpm <= 160) {
      pacingScore = 95;
    } else if (wpm >= 100 && wpm < 120) {
      pacingScore = 80;
    } else if (wpm > 160 && wpm <= 185) {
      pacingScore = 80;
    } else if (wpm > 185) {
      pacingScore = 60; // Rushing
    } else if (wpm > 0 && wpm < 100) {
      pacingScore = 55; // Too hesitant
    } else {
      pacingScore = 40;
    }

    // Filler penalty
    const fillerDensity = word_count > 0 ? (filler_count / word_count) : 0;
    const fillerScore = Math.max(20, Math.round(100 - (fillerDensity * 400)));

    // Overall Score composite
    const overall_score = Math.round(
      (relevance_score * 0.35) +
      (structure_score * 0.25) +
      (pacingScore * 0.20) +
      (fillerScore * 0.20)
    );

    // Dynamic Feedback: What Worked
    const what_worked = [];
    if (word_count >= 50) {
      what_worked.push(`Provided substantive detail (${word_count} words) with thorough technical context.`);
    }
    if (wpm >= 120 && wpm <= 160) {
      what_worked.push(`Pacing was controlled at ${wpm} WPM, giving the response a measured, confident delivery.`);
    }
    if (filler_count <= 2 && word_count > 40) {
      what_worked.push('Minimal filler words detected, projecting high poise and verbal clarity.');
    }
    if (star_breakdown.has_action && star_breakdown.has_result) {
      what_worked.push('Clearly articulated both your direct actions and the tangible business/technical result.');
    }
    if (matchedIdealCount > 0) {
      what_worked.push(`Addressed core technical expectations (${matchedIdealCount} benchmark concept${matchedIdealCount > 1 ? 's' : ''} directly hit).`);
    }
    if (what_worked.length === 0) {
      what_worked.push('Prompt delivery was clear and focused on the primary question topic.');
    }

    // Dynamic Feedback: Tighten This
    const tighten_this = [];
    if (filler_count >= 4) {
      tighten_this.push(`Identified ${filler_count} filler words (notably "${Object.keys(filler_words_breakdown).slice(0, 2).join('", "')}"). Practice replacing pauses with silent breaths rather than vocal crutches.`);
    }
    if (wpm > 170) {
      tighten_this.push(`Speech rate peaked at ${wpm} WPM. Slow down slightly around critical architecture and logic points to allow the interviewer to digest.`);
    } else if (wpm > 0 && wpm < 110) {
      tighten_this.push(`Pacing was hesitant (${wpm} WPM). Use structured frameworks (like STAR or 3-step technical breakdown) to eliminate mid-thought stalls.`);
    }
    if (repeated_words.length > 0) {
      tighten_this.push(`Consecutive repetition detected for "${repeated_words.join(', ')}". Pause briefly to reset cadence.`);
    }
    if (domain === 'Behavioural' && !star_breakdown.has_result) {
      what_worked.length > 0 && tighten_this.push('The answer stopped before stating a measurable outcome or retrospective learning. Always close with impact.');
    }
    if (word_count < 40) {
      tighten_this.push('Response was relatively brief. Elaborate on edge cases, trade-offs, and your specific individual contributions.');
    }
    if (tighten_this.length === 0) {
      tighten_this.push('Consider highlighting a deeper architectural trade-off or quantifiable metric to elevate from good to memorable.');
    }

    // Dynamic Feedback: Try This Next Time (Exemplar framing)
    let try_this_next_time = '';
    if (domain === 'Technical') {
      try_this_next_time = `Frame your response in 3 structured beats:\n1. State your premise: "To address this, the core objective is to balance time complexity against memory footprint..."\n2. Walk through your mechanism: "Specifically, I utilize [Approach/Data Structure] because it guarantees O(log N) lookups under high concurrency..."\n3. State the trade-off: "While this introduces minor write latency, it prevents cache stampedes under peak load."`;
    } else if (domain === 'HR' || domain === 'Behavioural') {
      try_this_next_time = `Use the STAR format seamlessly:\n• Situation: "During our final semester capstone project with a strict 2-week deadline..."\n• Task: "I was assigned ownership of the auth pipeline and payment gateway integration..."\n• Action: "I set up daily 15-minute syncs and implemented automated unit tests to isolate regression issues..."\n• Result: "We deployed 3 days early with zero authentication bugs, handling 500+ test transactions cleanly."`;
    } else {
      try_this_next_time = `Structure as Problem -> Analysis -> Execution -> Quantifiable Outcome to leave no ambiguity in the placement panel's mind.`;
    }

    return res.status(200).json({
      duration_sec: speakingDuration,
      word_count,
      wpm,
      filler_count,
      filler_words_breakdown,
      repeated_words,
      relevance_score,
      structure_score,
      pacing_score: pacingScore,
      overall_score,
      star_breakdown,
      what_worked,
      tighten_this,
      try_this_next_time
    });
  } catch (err) {
    console.error('Analyze response error:', err);
    return res.status(500).json({ error: err.message });
  }
}

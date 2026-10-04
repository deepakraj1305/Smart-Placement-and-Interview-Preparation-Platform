import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Query all sessions
    const { data: sessions, error: sessionErr } = await supabase
      .from('interview_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (sessionErr) throw sessionErr;

    // Query all responses
    const { data: responses, error: respErr } = await supabase
      .from('question_responses')
      .select('*');

    if (respErr) throw respErr;

    const totalSessions = (sessions || []).length;
    const completedSessions = (sessions || []).filter(s => s.status === 'completed');
    const totalResponses = (responses || []).length;

    let avgScore = 0;
    let avgWpm = 0;
    let totalFillers = 0;

    if (completedSessions.length > 0) {
      const scoreSum = completedSessions.reduce((acc, s) => acc + Number(s.overall_score || 0), 0);
      const wpmSum = completedSessions.reduce((acc, s) => acc + Number(s.avg_wpm || 0), 0);
      const fillerSum = completedSessions.reduce((acc, s) => acc + Number(s.total_filler_words || 0), 0);

      avgScore = Math.round(scoreSum / completedSessions.length);
      avgWpm = Math.round(wpmSum / completedSessions.length);
      totalFillers = fillerSum;
    }

    // Domain breakdown
    const domainStats = {};
    (sessions || []).forEach(s => {
      const d = s.domain || 'General';
      if (!domainStats[d]) {
        domainStats[d] = { count: 0, totalScore: 0 };
      }
      domainStats[d].count += 1;
      domainStats[d].totalScore += Number(s.overall_score || 0);
    });

    const domainAverages = Object.keys(domainStats).map(d => ({
      domain: d,
      interviews: domainStats[d].count,
      avg_score: domainStats[d].count > 0 ? Math.round(domainStats[d].totalScore / domainStats[d].count) : 0
    }));

    // Readiness threshold: score >= 75
    const readyCount = completedSessions.filter(s => Number(s.overall_score) >= 75).length;
    const readinessRate = completedSessions.length > 0 ? Math.round((readyCount / completedSessions.length) * 100) : 0;

    return res.status(200).json({
      total_sessions: totalSessions,
      completed_sessions: completedSessions.length,
      total_responses: totalResponses,
      avg_overall_score: avgScore,
      avg_wpm: avgWpm,
      total_fillers_detected: totalFillers,
      placement_readiness_rate: readinessRate,
      domain_averages: domainAverages,
      recent_sessions: (sessions || []).slice(0, 15)
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: err.message });
  }
}

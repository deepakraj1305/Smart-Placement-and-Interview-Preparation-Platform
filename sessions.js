import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { id, user_id, limit } = req.query;

      if (id) {
        const { data: session, error: sessionErr } = await supabase
          .from('interview_sessions')
          .select('*')
          .eq('id', id)
          .single();
        if (sessionErr) throw sessionErr;

        // Fetch question responses for this session
        const { data: responses, error: respErr } = await supabase
          .from('question_responses')
          .select('*')
          .eq('session_id', id)
          .order('order_index', { ascending: true });

        return res.status(200).json({
          ...session,
          responses: responses || []
        });
      }

      let query = supabase
        .from('interview_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (user_id) {
        query = query.eq('user_id', user_id);
      }
      if (limit) {
        query = query.limit(parseInt(limit, 10));
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const {
        user_id,
        student_name,
        student_email,
        domain,
        target_role,
        difficulty,
        question_count
      } = req.body;

      const { data, error } = await supabase
        .from('interview_sessions')
        .insert({
          user_id: user_id || 'guest-user',
          student_name: student_name || 'Placement Candidate',
          student_email: student_email || 'candidate@college.edu',
          domain: domain || 'Technical',
          target_role: target_role || 'Software Development Engineer',
          difficulty: difficulty || 'Medium',
          question_count: question_count || 3,
          status: 'in_progress',
          overall_score: 0,
          communication_score: 0,
          content_score: 0,
          structure_score: 0,
          pacing_score: 0,
          avg_wpm: 0,
          total_filler_words: 0,
          filler_rate_percent: 0,
          summary_notes: 'Session initiated.'
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      if (!id) return res.status(400).json({ error: 'Session ID is required' });

      const { data, error } = await supabase
        .from('interview_sessions')
        .update({
          ...updates,
          completed_at: updates.status === 'completed' ? new Date().toISOString() : undefined
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Session ID required' });
      const { error } = await supabase.from('interview_sessions').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Sessions API error:', err);
    res.status(500).json({ error: err.message });
  }
}

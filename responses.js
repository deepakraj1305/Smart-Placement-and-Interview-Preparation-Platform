import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { session_id } = req.query;
      let query = supabase.from('question_responses').select('*').order('order_index', { ascending: true });

      if (session_id) {
        query = query.eq('session_id', session_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const {
        session_id,
        question_id,
        question_title,
        domain,
        order_index,
        transcript,
        input_method,
        duration_sec,
        word_count,
        wpm,
        filler_count,
        filler_words_breakdown,
        repeated_words,
        relevance_score,
        structure_score,
        overall_score,
        star_breakdown,
        what_worked,
        tighten_this,
        try_this_next_time
      } = req.body;

      if (!session_id || !question_title) {
        return res.status(400).json({ error: 'session_id and question_title are required' });
      }

      const { data, error } = await supabase
        .from('question_responses')
        .insert({
          session_id,
          question_id: question_id || null,
          question_title,
          domain: domain || 'General',
          order_index: order_index || 1,
          transcript: transcript || '',
          input_method: input_method || 'voice',
          duration_sec: duration_sec || 0,
          word_count: word_count || 0,
          wpm: wpm || 0,
          filler_count: filler_count || 0,
          filler_words_breakdown: filler_words_breakdown || {},
          repeated_words: repeated_words || [],
          relevance_score: relevance_score || 0,
          structure_score: structure_score || 0,
          overall_score: overall_score || 0,
          star_breakdown: star_breakdown || {},
          what_worked: what_worked || [],
          tighten_this: tighten_this || [],
          try_this_next_time: try_this_next_time || ''
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Responses API error:', err);
    res.status(500).json({ error: err.message });
  }
}

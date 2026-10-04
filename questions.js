import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { domain, difficulty, limit } = req.query;
      let query = supabase.from('questions').select('*').order('id', { ascending: true });

      if (domain && domain !== 'All') {
        query = query.eq('domain', domain);
      }
      if (difficulty && difficulty !== 'All') {
        query = query.eq('difficulty', difficulty);
      }
      if (limit) {
        query = query.limit(parseInt(limit, 10));
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { title, domain, category, difficulty, expected_duration_sec, ideal_points, star_framework_needed, sample_answer } = req.body;
      if (!title || !domain) {
        return res.status(400).json({ error: 'Title and domain are required' });
      }

      const { data, error } = await supabase
        .from('questions')
        .insert({
          title,
          domain,
          category: category || 'General',
          difficulty: difficulty || 'Medium',
          expected_duration_sec: expected_duration_sec || 90,
          ideal_points: ideal_points || [],
          star_framework_needed: Boolean(star_framework_needed),
          sample_answer: sample_answer || ''
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Question id required' });
      const { error } = await supabase.from('questions').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Questions API error:', err);
    res.status(500).json({ error: err.message });
  }
}

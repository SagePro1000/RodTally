import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse license code from query parameters
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'License code is required' });
  }

  const cleanCode = code.trim().toUpperCase();

  // Validate the license is active
  const { data: license, error: licenseErr } = await supabase
    .from('licenses')
    .select('active')
    .eq('code', cleanCode)
    .eq('active', true)
    .single();

  if (licenseErr || !license) {
    return res.status(401).json({ error: 'Invalid or inactive license code' });
  }

  // Fetch all sessions for this license code (newest first)
  const { data: sessions, error: fetchErr } = await supabase
    .from('sessions')
    .select('timestamp, material, sale_type, bundles, partial_pieces, pieces, tons, target_reached')
    .eq('license_code', cleanCode)
    .order('timestamp', { ascending: false });

  if (fetchErr) {
    console.error('Database fetch error:', fetchErr);
    return res.status(500).json({ error: 'Failed to retrieve sessions' });
  }

  // Format keys to match frontend expectation (e.g. sale_type -> saleType)
  const formattedSessions = sessions.map(s => ({
    timestamp: s.timestamp,
    material: s.material,
    saleType: s.sale_type,
    bundles: s.bundles,
    partialPieces: s.partial_pieces,
    pieces: s.pieces,
    tons: s.tons.toString(),
    targetReached: s.target_reached
  }));

  return res.status(200).json({ sessions: formattedSessions });
}

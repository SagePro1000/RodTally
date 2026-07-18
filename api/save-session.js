import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, session } = req.body;

  if (!code || !session) {
    return res.status(400).json({ error: 'License code and session details are required' });
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

  // Insert the session tied to the license code
  const { error: insertErr } = await supabase
    .from('sessions')
    .insert([{
      license_code: cleanCode,
      timestamp: session.timestamp,
      material: session.material,
      sale_type: session.saleType,
      bundles: parseInt(session.bundles, 10) || 0,
      partial_pieces: parseInt(session.partialPieces, 10) || 0,
      pieces: parseInt(session.pieces, 10) || 0,
      tons: parseFloat(session.tons) || 0,
      target_reached: session.targetReached ?? null
    }]);

  if (insertErr) {
    console.error('Database insert error:', insertErr);
    return res.status(500).json({ error: 'Failed to sync session to cloud' });
  }

  return res.status(200).json({ success: true });
}

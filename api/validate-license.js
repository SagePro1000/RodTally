import { createClient } from '@supabase/supabase-js';

// Use the SERVICE ROLE key — this is server-only and must never be prefixed with VITE_
// Add SUPABASE_SERVICE_KEY to your Vercel environment variables (not VITE_SUPABASE_ANON_KEY)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in your environment variables.');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Code is required' });
  }

  const cleanCode = code.trim().toUpperCase();

  // Look up the code in Supabase
  const { data, error } = await supabase
    .from('licenses')
    .select('company_name, tier, active')
    .eq('code', cleanCode)
    .eq('active', true)
    .single();

  if (error || !data) {
    // Return 200 with valid:false — don't leak 401 status to help enumerate codes
    return res.status(200).json({ valid: false, message: 'Invalid or inactive code' });
  }

  // Update last_checked timestamp (fire and forget — don't await to keep response fast)
  supabase
    .from('licenses')
    .update({ last_checked: new Date().toISOString() })
    .eq('code', cleanCode)
    .then(() => {})
    .catch(() => {});

  return res.status(200).json({
    valid: true,
    company: data.company_name,
    tier: data.tier,
  });
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Fetch materials sorted by name (or we can sort them numerically in JS)
  const { data: materials, error } = await supabase
    .from('materials')
    .select('name, pcs_per_bundle, bundles_per_ton, pcs_per_ton_wholesale, pcs_per_ton_retail')
    .order('name', { ascending: true });

  if (error) {
    console.error('Failed to fetch materials from database:', error);
    return res.status(500).json({ error: 'Failed to retrieve materials' });
  }

  // Convert the array format from DB to the nested object format the app expects:
  // { '8mm': { pcsPerBundle: 20, bundlesPerTon: 20, pcsPerTon: { wholesale: 210, retail: 133 } } }
  const formatted = {};
  materials.forEach(m => {
    formatted[m.name] = {
      pcsPerBundle: m.pcs_per_bundle,
      bundlesPerTon: m.bundles_per_ton,
      pcsPerTon: {
        wholesale: m.pcs_per_ton_wholesale,
        retail: m.pcs_per_ton_retail
      }
    };
  });

  // Sort them logically (8mm, 10mm, 12mm, 16mm, 20mm, 25mm)
  const sizeOrder = ['8mm', '10mm', '12mm', '16mm', '20mm', '25mm'];
  const sortedFormatted = {};
  sizeOrder.forEach(size => {
    if (formatted[size]) {
      sortedFormatted[size] = formatted[size];
    }
  });

  // Catch any custom sizes added later that are not in default list
  Object.keys(formatted).forEach(size => {
    if (!sortedFormatted[size]) {
      sortedFormatted[size] = formatted[size];
    }
  });

  return res.status(200).json({ materials: sortedFormatted });
}

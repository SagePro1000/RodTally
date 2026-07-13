import { useState, useEffect } from 'react';

export default function LicenseGate({ children }) {
  const [status, setStatus] = useState('checking'); // checking | locked | unlocked
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('rodtally_license');
    if (saved) {
      // Validate saved code on every app load
      validateCode(saved, true);
    } else {
      setStatus('locked');
    }
  }, []);

  const validateCode = async (code, isSaved = false) => {
    setLoading(true);
    setError(null);
    try {
      let data = null;
      try {
        const res = await fetch('/api/validate-license', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: code.trim().toUpperCase() })
        });
        if (res.ok) {
          data = await res.json();
        } else {
          // Treat non-OK responses as failures so the client falls back to
          // a direct Supabase REST query (useful for static deployments).
          throw new Error('validate-license endpoint not available');
        }
      } catch (apiErr) {
        // Fallback: Query Supabase REST API directly from client if keys are available (e.g. local Vite dev server)
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (supabaseUrl && supabaseKey) {
          const cleanCode = code.trim().toUpperCase();
          const dbRes = await fetch(
            `${supabaseUrl}/rest/v1/licenses?code=eq.${cleanCode}&active=eq.true&select=*`,
            {
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
              }
            }
          );
          if (dbRes.ok) {
            const rows = await dbRes.json();
            if (rows && rows.length > 0) {
              data = {
                valid: true,
                company: rows[0].company_name,
                tier: rows[0].tier
              };
              // Log the check to Supabase database (fire and forget)
              fetch(`${supabaseUrl}/rest/v1/licenses?code=eq.${cleanCode}`, {
                method: 'PATCH',
                headers: {
                  'apikey': supabaseKey,
                  'Authorization': `Bearer ${supabaseKey}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ last_checked: new Date().toISOString() })
              }).catch(() => {});
            }
          }
        }
      }

      if (data && data.valid) {
        localStorage.setItem('rodtally_license', code.trim().toUpperCase());
        localStorage.setItem('rodtally_company', data.company);
        setCompany(data.company);
        setStatus('unlocked');
      } else {
        if (isSaved) localStorage.removeItem('rodtally_license');
        setStatus('locked');
        setError('This code is invalid or has been deactivated.');
      }
    } catch (err) {
      // If offline and code was previously saved, allow access
      if (isSaved) {
        setStatus('unlocked');
      } else {
        setError('Could not connect. Check your internet and try again.');
        setStatus('locked');
      }
    }
    setLoading(false);
  };

  if (status === 'checking') {
    return (
      <div style={styles.center}>
        <p style={{ color: '#6B7280', fontSize: 14 }}>Loading RodTally...</p>
      </div>
    );
  }

  if (status === 'locked') {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h1 style={styles.logo}>RodTally</h1>
          <p style={styles.sub}>Iron Rod Offloading Counter</p>
          <div style={styles.divider} />
          <p style={styles.label}>COMPANY ACCESS CODE</p>
          <input
            style={styles.input}
            type='text'
            placeholder='e.g. RODS-ABJ-5521'
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && validateCode(input)}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button
            style={{ ...styles.btn, opacity: loading || !input ? 0.6 : 1 }}
            onClick={() => validateCode(input)}
            disabled={loading || !input}
          >
            {loading ? 'Validating...' : 'Unlock App'}
          </button>
          <p style={styles.contact}>
            No code?{' '}
            <a
              href="https://wa.me/2349150940554?text=Hi%2C%20I%20need%20a%20RodTally%20access%20code."
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              Contact us on WhatsApp
            </a>{' '}
            to get access.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

const styles = {
  center: { display:'flex', justifyContent:'center', alignItems:'center',
             minHeight:'100vh', padding:'1rem', backgroundColor:'#F9FAFB' },
  card: { width:'100%', maxWidth:380, backgroundColor:'#fff',
          borderRadius:16, padding:'2rem', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' },
  logo: { fontSize:32, fontWeight:700, color:'#1A56DB', margin:0 },
  sub: { fontSize:13, color:'#6B7280', marginTop:4, marginBottom:0 },
  divider: { height:1, backgroundColor:'#E5E7EB', margin:'1.25rem 0' },
  label: { fontSize:11, color:'#9CA3AF', fontWeight:600, letterSpacing:1, marginBottom:8 },
  input: { width:'100%', padding:'12px 14px', fontSize:16, border:'1px solid #D1D5DB',
           borderRadius:10, marginBottom:10, outline:'none', boxSizing:'border-box',
           textAlign:'center', letterSpacing:2, fontWeight:500, color:'#111827',
           backgroundColor:'#ffffff', textTransform:'uppercase' },
  btn: { width:'100%', padding:'14px', fontSize:16, fontWeight:600,
         backgroundColor:'#1A56DB', color:'#fff', border:'none',
         borderRadius:10, cursor:'pointer', marginBottom:'1rem' },
  error: { color:'#DC2626', fontSize:13, marginBottom:10, textAlign:'center' },
  contact: { fontSize:12, color:'#9CA3AF', textAlign:'center', margin:0 },
  link: { color: '#1A56DB', fontWeight: '600', textDecoration: 'none' }
};

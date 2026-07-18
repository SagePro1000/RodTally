import { useState, useEffect } from 'react';

/**
 * LicenseGate — validates a company access code before rendering the app.
 *
 * Validation flow:
 *  1. On mount: check localStorage for a previously saved code.
 *  2. If found: re-validate against the serverless API (/api/validate-license).
 *  3. If API is unreachable AND a code was previously saved: grant offline access
 *     (so workers in the field aren't locked out by poor connectivity).
 *  4. On manual entry: always validate against the API — no offline bypass.
 *
 * Security note: The only validation path is through /api/validate-license which
 * uses the Supabase SERVICE_ROLE key server-side. The client never touches the DB.
 */
export default function LicenseGate({ children }) {
  const [status, setStatus] = useState('checking'); // checking | locked | unlocked
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('rodtally_license');
    if (saved) {
      validateCode(saved, /* isSaved */ true);
    } else {
      setStatus('locked');
    }
  }, []);

  /**
   * @param {string} code - The license code to validate
   * @param {boolean} isSaved - Whether this is a previously saved code (enables offline grace)
   */
  const validateCode = async (code, isSaved = false) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/validate-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (data?.valid) {
        localStorage.setItem('rodtally_license', code.trim().toUpperCase());
        localStorage.setItem('rodtally_company', data.company);
        setCompany(data.company);
        setStatus('unlocked');
      } else {
        // Code exists but is invalid or deactivated
        if (isSaved) localStorage.removeItem('rodtally_license');
        setStatus('locked');
        setError('This code is invalid or has been deactivated. Contact us to get access.');
      }
    } catch {
      // Network error — API unreachable
      if (isSaved) {
        // Grant offline access for previously validated users
        const savedCompany = localStorage.getItem('rodtally_company');
        setCompany(savedCompany);
        setStatus('unlocked');
      } else {
        setError('Could not connect. Check your internet connection and try again.');
        setStatus('locked');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    validateCode(input.trim());
  };

  // ── Checking state ───────────────────────────────────────────────────────────
  if (status === 'checking') {
    return (
      <div style={styles.center}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading RodTally…</p>
        </div>
      </div>
    );
  }

  // ── Locked state ─────────────────────────────────────────────────────────────
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
            type="text"
            placeholder="e.g. RODS-ABJ-5521"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck="false"
          />
          {error && <p style={styles.error}>{error}</p>}
          <button
            style={{ ...styles.btn, opacity: loading || !input.trim() ? 0.6 : 1 }}
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
          >
            {loading ? 'Validating…' : 'Unlock App'}
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

  // ── Unlocked state ───────────────────────────────────────────────────────────
  return children;
}

const styles = {
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '1rem',
    backgroundColor: '#F9FAFB',
  },
  loadingCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #1A56DB',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 14,
    margin: 0,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '2rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  logo: { fontSize: 32, fontWeight: 700, color: '#1A56DB', margin: 0 },
  sub: { fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 0 },
  divider: { height: 1, backgroundColor: '#E5E7EB', margin: '1.25rem 0' },
  label: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: 600,
    letterSpacing: 1,
    marginBottom: 8,
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: 16,
    border: '1px solid #D1D5DB',
    borderRadius: 10,
    marginBottom: 10,
    outline: 'none',
    boxSizing: 'border-box',
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: 500,
    color: '#111827',
    backgroundColor: '#ffffff',
    textTransform: 'uppercase',
  },
  btn: {
    width: '100%',
    padding: '14px',
    fontSize: 16,
    fontWeight: 600,
    backgroundColor: '#1A56DB',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  error: { color: '#DC2626', fontSize: 13, marginBottom: 10, textAlign: 'center' },
  contact: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', margin: 0 },
  link: { color: '#1A56DB', fontWeight: '600', textDecoration: 'none' },
};

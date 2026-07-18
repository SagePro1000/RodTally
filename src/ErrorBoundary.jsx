import { Component } from 'react';

/**
 * ErrorBoundary — catches unhandled React rendering errors and shows a
 * human-readable recovery screen instead of a blank white page.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unknown error' };
  }

  componentDidCatch(error, info) {
    // Log to console in dev — swap for a real error reporting service (e.g. Sentry) later
    console.error('[RodTally] Unhandled error:', error, info.componentStack);
  }

  handleReload() {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.center}>
          <div style={styles.card}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.body}>
              RodTally ran into an unexpected problem. Your data is safe in local storage.
              Reload the app to continue.
            </p>
            <button style={styles.btn} onClick={this.handleReload}>
              Reload App
            </button>
            <p style={styles.support}>
              If this keeps happening,{' '}
              <a
                href="https://wa.me/2349150940554?text=RodTally%20app%20crashed%20-%20please%20help."
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                contact support on WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '1.5rem',
    backgroundColor: '#F9FAFB',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '2rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  icon: { fontSize: 40, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 10px' },
  body: { fontSize: 14, color: '#6B7280', lineHeight: 1.6, margin: '0 0 20px' },
  btn: {
    width: '100%',
    padding: '13px',
    fontSize: 16,
    fontWeight: 600,
    backgroundColor: '#1A56DB',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  support: { fontSize: 12, color: '#9CA3AF', margin: 0 },
  link: { color: '#1A56DB', fontWeight: 600, textDecoration: 'none' },
};

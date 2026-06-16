export default function ActionButton({ onCount, reached }) {
  return (
    <button
      id="count-bundle-btn"
      className={`action-btn${reached ? ' reached' : ''}`}
      onClick={onCount}
      aria-label={reached ? "Target reached" : "Count one bundle"}
      disabled={reached}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {reached ? (
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        ) : (
          <>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </>
        )}
        {reached && <polyline points="22 4 12 14.01 9 11.01" />}
      </svg>
      {reached ? 'Target Reached' : 'Count Bundle'}
    </button>
  );
}

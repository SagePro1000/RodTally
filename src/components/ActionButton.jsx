function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function ActionButton({ onCount, reached, countingPieces, bundleOnly }) {
  if (reached) {
    return (
      <button
        id="count-bundle-btn"
        className="action-btn reached"
        aria-label="Target reached"
        disabled
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        Target Reached
      </button>
    );
  }

  if (countingPieces) {
    return (
      <button
        id="count-piece-btn"
        className="action-btn"
        onClick={() => onCount('piece')}
        aria-label="Count one piece"
      >
        <PlusIcon />
        Count Piece
      </button>
    );
  }

  if (bundleOnly) {
    return (
      <button
        id="count-bundle-btn"
        className="action-btn"
        onClick={() => onCount('bundle')}
        aria-label="Count one bundle"
      >
        <PlusIcon />
        Count Bundle
      </button>
    );
  }

  return (
    <div className="action-buttons-row">
      <button
        id="count-bundle-btn"
        className="action-btn main-action"
        onClick={() => onCount('bundle')}
        aria-label="Count one bundle"
      >
        <PlusIcon />
        Count Bundle
      </button>
      <button
        id="count-piece-btn"
        className="action-btn piece-action"
        onClick={() => onCount('piece')}
        aria-label="Count one piece"
      >
        <PlusIcon />
        +1 Piece
      </button>
    </div>
  );
}

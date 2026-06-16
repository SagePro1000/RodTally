// Renders a single tally group of up to 5 marks as SVG
function TallyGroup({ count }) {
  // count is 1–5
  const full = count === 5;
  const lines = full ? 4 : count;

  return (
    <svg
      width="36"
      height="52"
      viewBox="0 0 36 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Vertical strokes */}
      {Array.from({ length: lines }).map((_, i) => (
        <line
          key={i}
          x1={6 + i * 8}
          y1="4"
          x2={6 + i * 8}
          y2="48"
          stroke="var(--tally-color)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
      {/* Diagonal cross stroke for the 5th */}
      {full && (
        <line
          x1="1"
          y1="48"
          x2="35"
          y2="4"
          stroke="var(--tally-color)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function TallyBoard({ bundleCount }) {
  if (bundleCount === 0) {
    return (
      <div className="tally-section">
        <div className="tally-section-label">Tally</div>
        <div className="tally-board">
          <span className="tally-empty">Tap Count Bundle to start tallying…</span>
        </div>
      </div>
    );
  }

  const fullGroups = Math.floor(bundleCount / 5);
  const remainder = bundleCount % 5;

  return (
    <div className="tally-section">
      <div className="tally-section-label">Tally</div>
      <div className="tally-board" role="img" aria-label={`${bundleCount} bundles tallied`}>
        {Array.from({ length: fullGroups }).map((_, i) => (
          <TallyGroup key={i} count={5} />
        ))}
        {remainder > 0 && <TallyGroup count={remainder} />}
      </div>
    </div>
  );
}

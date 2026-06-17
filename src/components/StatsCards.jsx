function bundleSubtext(fullBundles, partialPieces, pieces) {
  if (partialPieces > 0) {
    return `${fullBundles} bundles + ${partialPieces} pcs · ${pieces} pcs total`;
  }
  return `${pieces} pcs total`;
}

export default function StatsCards({ countingPieces, fullBundles, partialPieces, pieces, tons }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">{countingPieces ? 'Pieces' : 'Bundles'}</div>
        <div id="bundle-count" className="stat-value">{countingPieces ? pieces : fullBundles}</div>
        <div className="stat-sub">
          {countingPieces
            ? `${fullBundles} bundle${fullBundles !== 1 ? 's' : ''} tallied`
            : bundleSubtext(fullBundles, partialPieces, pieces)}
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Tons</div>
        <div id="tons-count" className="stat-value">{tons}</div>
        <div className="stat-sub">metric tons</div>
      </div>
    </div>
  );
}

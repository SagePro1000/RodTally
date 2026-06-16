export default function StatsCards({ bundleCount, pieces, tons }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Bundles</div>
        <div id="bundle-count" className="stat-value">{bundleCount}</div>
        <div className="stat-sub">{pieces} pcs total</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Tons</div>
        <div id="tons-count" className="stat-value">{tons}</div>
        <div className="stat-sub">metric tons</div>
      </div>
    </div>
  );
}

function formatTime(iso) {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return `${date}, ${time}`;
  } catch {
    return '—';
  }
}

export default function HistoryLog({ history }) {
  if (!history || history.length === 0) {
    return (
      <div>
        <div className="section-heading">Session History</div>
        <p className="history-empty">No sessions yet. Complete a count and tap Reset to save.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="section-heading">Session History ({history.length})</div>
      <div className="history-list">
        {history.map((entry, i) => (
          <div key={i} className="history-item">
            <div>
              <div className="history-meta">
                <span className="history-badge">{entry.material}</span>
                <span className="history-type">
                  {entry.saleType === 'wholesale' ? 'Wholesale' : 'Retail'}
                </span>
                {entry.targetReached !== undefined && (
                  <span className={`history-target-status ${entry.targetReached ? 'met' : 'missed'}`} title={entry.targetReached ? 'Target Met' : 'Target Missed'}>
                    {entry.targetReached ? '✓' : '✗'}
                  </span>
                )}
              </div>
              <div className="history-stats">
                <strong>{entry.bundles}</strong> bundles · <strong>{entry.pieces}</strong> pcs · <strong>{entry.tons}</strong> t
              </div>
            </div>
            <div className="history-time">{formatTime(entry.timestamp)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

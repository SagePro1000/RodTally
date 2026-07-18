import { useMemo, useState } from 'react';

function dayKey(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'unknown';
  return d.toLocaleDateString('en-CA');
}

function formatDayLabel(key) {
  if (key === 'unknown') return 'Unknown date';

  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const target = new Date(year, month - 1, day);

  if (target.getTime() === today.getTime()) return 'Today';
  if (target.getTime() === yesterday.getTime()) return 'Yesterday';
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
}

function bundleLabel(entry) {
  if (entry.partialPieces > 0) {
    return `${entry.bundles} + ${entry.partialPieces}`;
  }
  return String(entry.bundles ?? 0);
}

function groupByDay(history) {
  const groups = new Map();

  for (const entry of history) {
    const key = dayKey(entry.timestamp);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, entries]) => ({
      key,
      label: formatDayLabel(key),
      entries: entries.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
    }));
}

export default function HistoryLog({ history }) {
  const dayGroups = useMemo(() => groupByDay(history ?? []), [history]);
  const [selectedDay, setSelectedDay] = useState(null);
  const activeDay = dayGroups.find((g) => g.key === selectedDay) ?? dayGroups[0];
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!activeDay) return;

    const reportText = [
      `RodTally Report – ${activeDay.label}`,
      `Generated: ${new Date().toLocaleDateString()}`,
      `----------------------------------------`,
      ...activeDay.entries.map((entry) => {
        const bundlesText = entry.partialPieces > 0
          ? `${entry.bundles} bdl + ${entry.partialPieces} pcs`
          : `${entry.bundles} bdl`;
        const typeText = entry.saleType === 'wholesale' ? 'Wholesale' : 'Retail';
        const targetText = entry.targetReached !== undefined
          ? ` (${entry.targetReached ? 'Target Met ✓' : 'Target Missed ✗'})`
          : '';
        return `• ${entry.material} | ${typeText} | ${bundlesText} (${entry.pieces} pcs) | ${entry.tons}t${targetText}`;
      }),
      `----------------------------------------`,
      `Total Sessions: ${activeDay.entries.length}`
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: `RodTally Report – ${activeDay.label}`,
          text: reportText,
        });
      } catch (err) {
        // user cancelled or failed to share
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(reportText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert('Could not copy report to clipboard.');
      }
    }
  };

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

      <div className="history-day-picker">
        <label className="setup-label" htmlFor="history-day-select">
          Select day
        </label>
        <div className="history-share-row">
          <select
            id="history-day-select"
            className="setup-select"
            value={activeDay?.key ?? ''}
            onChange={(e) => setSelectedDay(e.target.value)}
            style={{ flex: 1 }}
          >
            {dayGroups.map((group) => (
              <option key={group.key} value={group.key}>
                {group.label} ({group.entries.length})
              </option>
            ))}
          </select>
          {activeDay && (
            <button
              onClick={handleShare}
              className="ctrl-btn share-btn"
              title="Share report to WhatsApp or email"
              aria-label="Share day report"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              {copied ? 'Copied!' : 'Share'}
            </button>
          )}
        </div>
        {activeDay && (
          <p className="history-day-summary">
            {activeDay.entries.length} calculation{activeDay.entries.length !== 1 ? 's' : ''} on
            this day
          </p>
        )}
      </div>

      {activeDay && (
        <div className="history-list">
          {activeDay.entries.map((entry, i) => (
            <div key={`${entry.timestamp}-${i}`} className="history-item">
              <div>
                <div className="history-meta">
                  <span className="history-badge">{entry.material}</span>
                  <span className="history-type">
                    {entry.saleType === 'wholesale' ? 'Wholesale' : 'Retail'}
                  </span>
                  {entry.targetReached !== undefined && (
                    <span
                      className={`history-target-status ${entry.targetReached ? 'met' : 'missed'}`}
                      title={entry.targetReached ? 'Target Met' : 'Target Missed'}
                    >
                      {entry.targetReached ? '✓' : '✗'}
                    </span>
                  )}
                </div>
                <div className="history-stats">
                  <strong>{bundleLabel(entry)}</strong> bundles ·{' '}
                  <strong>{entry.pieces}</strong> pcs · <strong>{entry.tons}</strong> t
                </div>
              </div>
              <div className="history-time">{formatTime(entry.timestamp)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

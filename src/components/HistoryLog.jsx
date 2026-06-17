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
        <select
          id="history-day-select"
          className="setup-select"
          value={activeDay?.key ?? ''}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          {dayGroups.map((group) => (
            <option key={group.key} value={group.key}>
              {group.label} ({group.entries.length})
            </option>
          ))}
        </select>
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

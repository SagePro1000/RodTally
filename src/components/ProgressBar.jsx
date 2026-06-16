export default function ProgressBar({ current, target, type }) {
  const percentage = Math.min(100, Math.max(0, (current / target) * 100)) || 0;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-label">Progress</span>
        <span className="progress-value">
          {current} / {target} {type} ({Math.round(percentage)}%)
        </span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

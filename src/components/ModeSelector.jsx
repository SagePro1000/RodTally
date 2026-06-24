export default function ModeSelector({ mode, onModeChange }) {
  return (
    <div className="mode-selector" role="group" aria-label="Counting mode">
      <button
        className={`mode-btn${mode === 'target' ? ' active' : ''}`}
        onClick={() => onModeChange('target')}
        aria-pressed={mode === 'target'}
      >
        Set Target
      </button>
      <button
        className={`mode-btn${mode === 'free' ? ' active' : ''}`}
        onClick={() => onModeChange('free')}
        aria-pressed={mode === 'free'}
      >
        Free Count
      </button>
    </div>
  );
}

export default function TargetInput({ value, type, onValueChange, onTypeChange, selectedMaterial, bundleSize16, onBundleSize16Change }) {
  const show16mmToggle = selectedMaterial === '16mm' && type === 'tons';

  return (
    <div className="target-input-wrap">
      <div className="input-box">
        <span className="setup-label">Target Amount</span>
        <div className="target-field-wrap">
          <input
            type="number"
            className="target-field"
            value={value}
            onChange={(e) => onValueChange(Math.max(0, e.target.value))}
            min="0"
            step={type === 'tons' ? '0.01' : '1'}
          />
        </div>
      </div>

      <div className="input-box">
        <span className="setup-label">Unit</span>
        <div className="unit-toggle" role="group" aria-label="Target unit">
          <button
            className={`unit-btn${type === 'tons' ? ' active' : ''}`}
            onClick={() => onTypeChange('tons')}
            aria-pressed={type === 'tons'}
          >
            Tons
          </button>
          <button
            className={`unit-btn${type === 'pieces' ? ' active' : ''}`}
            onClick={() => onTypeChange('pieces')}
            aria-pressed={type === 'pieces'}
          >
            Pieces
          </button>
        </div>
      </div>

      {show16mmToggle && (
        <div className="input-box bundle-size-box">
          <span className="setup-label">16mm Bundle</span>
          <div className="unit-toggle" role="group" aria-label="Bundle size for 16mm">
            <button
              className={`unit-btn${bundleSize16 === 5 ? ' active' : ''}`}
              onClick={() => onBundleSize16Change(5)}
              aria-pressed={bundleSize16 === 5}
            >
              5 pcs
            </button>
            <button
              className={`unit-btn${bundleSize16 === 6 ? ' active' : ''}`}
              onClick={() => onBundleSize16Change(6)}
              aria-pressed={bundleSize16 === 6}
            >
              6 pcs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

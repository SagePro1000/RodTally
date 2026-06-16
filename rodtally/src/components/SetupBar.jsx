import { MATERIAL_SIZES } from '../data/materials';

export default function SetupBar({ selectedMaterial, onMaterialChange, saleType, onSaleTypeChange }) {
  return (
    <div className="setup-bar">
      <div className="setup-select-wrap">
        <span className="setup-label">Rod Size</span>
        <select
          id="rod-size-select"
          className="setup-select"
          value={selectedMaterial}
          onChange={e => onMaterialChange(e.target.value)}
        >
          {MATERIAL_SIZES.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      <div className="toggle-wrap">
        <span className="setup-label">Sale Type</span>
        <div className="sale-toggle" role="group" aria-label="Sale type">
          <button
            id="sale-type-wholesale"
            className={`sale-btn${saleType === 'wholesale' ? ' active' : ''}`}
            onClick={() => onSaleTypeChange('wholesale')}
            aria-pressed={saleType === 'wholesale'}
          >
            Wholesale
          </button>
          <button
            id="sale-type-retail"
            className={`sale-btn${saleType === 'retail' ? ' active' : ''}`}
            onClick={() => onSaleTypeChange('retail')}
            aria-pressed={saleType === 'retail'}
          >
            Retail
          </button>
        </div>
      </div>
    </div>
  );
}

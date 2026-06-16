import { MATERIALS, MATERIAL_SIZES } from '../data/materials';

export default function ReferenceTable({ selectedMaterial, saleType }) {
  return (
    <div>
      <div className="section-heading">Rod Size Reference</div>
      <div className="card" style={{ padding: '4px 8px' }}>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Pcs/Bundle</th>
              <th>Bdl/Ton</th>
              <th>Pcs/Ton ({saleType === 'wholesale' ? 'WS' : 'RT'})</th>
            </tr>
          </thead>
          <tbody>
            {MATERIAL_SIZES.map(size => {
              const m = MATERIALS[size];
              const isActive = size === selectedMaterial;
              return (
                <tr key={size} className={isActive ? 'active-row' : ''}>
                  <td><strong>{size}</strong></td>
                  <td>{m.pcsPerBundle}</td>
                  <td>{m.bundlesPerTon}</td>
                  <td>{m.pcsPerTon[saleType]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

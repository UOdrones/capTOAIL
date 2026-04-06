import { formatDollars, formatPercent } from '../utils/dilution';

export default function OwnershipTable({ holders, investorEntries = [], valuation, baseHolders, vestingEnabled }) {
  const allEntries = [...holders, ...investorEntries];

  // Build a map of base percentages for delta calculation
  const baseMap = {};
  if (baseHolders) {
    baseHolders.forEach(h => { baseMap[h.id] = h.percent; });
  }

  return (
    <div className="ownership-table-container">
      <h3 className="section-title">Equity Breakdown</h3>
      <div className="table-wrapper">
        <table className="ownership-table">
          <thead>
            <tr>
              <th></th>
              <th>Holder</th>
              <th>Role</th>
              <th>Board</th>
              <th>Ownership</th>
              {vestingEnabled && <th>Vested</th>}
              {vestingEnabled && <th>Unvested</th>}
              {valuation > 0 && <th>Implied Value</th>}
              {baseHolders && <th>Δ Change</th>}
            </tr>
          </thead>
          <tbody>
            {allEntries.map((h) => {
              const vestedPct = h.vested !== undefined ? h.vested : h.percent;
              const unvestedPct = h.unvested !== undefined ? h.unvested : 0;
              const impliedValue = valuation ? (vestedPct / 100) * valuation : 0;
              const basePct = baseMap[h.id];
              const delta = basePct !== undefined ? h.percent - basePct : null;
              
              return (
                <tr key={h.id} className={delta !== null && delta !== 0 ? (delta > 0 ? 'row-gain' : 'row-loss') : ''}>
                  <td>
                    <span className="holder-dot" style={{ background: h.color }}></span>
                  </td>
                  <td className="holder-name">{h.name}</td>
                  <td className="holder-role">{h.role || '—'}</td>
                  <td className="holder-board">
                    {h.boardSeat && <span className="board-badge">Board Seat</span>}
                  </td>
                  <td className="holder-pct">
                    <span className="pct-bar-bg">
                      <span className="pct-bar-fill" style={{ width: `${Math.min(h.percent, 100)}%`, background: h.color }}></span>
                    </span>
                    <span className="pct-value">{formatPercent(h.percent)}</span>
                  </td>
                  {vestingEnabled && (
                    <td className="holder-vested">
                      <span className="vested-value">{formatPercent(vestedPct)}</span>
                    </td>
                  )}
                  {vestingEnabled && (
                    <td className="holder-unvested">
                      <span className="unvested-value">{unvestedPct > 0 ? formatPercent(unvestedPct) : '—'}</span>
                    </td>
                  )}
                  {valuation > 0 && (
                    <td className="holder-value">{formatDollars(impliedValue)}</td>
                  )}
                  {baseHolders && (
                    <td className={`holder-delta ${delta > 0 ? 'delta-pos' : delta < 0 ? 'delta-neg' : ''}`}>
                      {delta !== null ? `${delta > 0 ? '+' : ''}${delta.toFixed(2)}%` : 'NEW'}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td colSpan="3"><strong>Total</strong></td>
              <td className="holder-pct">
                <span className="pct-value total-pct">
                  {formatPercent(allEntries.reduce((sum, h) => sum + h.percent, 0))}
                </span>
              </td>
              {vestingEnabled && (
                <td className="holder-vested">
                  <span className="vested-value total-pct">
                    {formatPercent(allEntries.reduce((sum, h) => sum + (h.vested !== undefined ? h.vested : h.percent), 0))}
                  </span>
                </td>
              )}
              {vestingEnabled && (
                <td className="holder-unvested">
                  <span className="unvested-value">
                    {formatPercent(allEntries.reduce((sum, h) => sum + (h.unvested || 0), 0))}
                  </span>
                </td>
              )}
              {valuation > 0 && (
                <td className="holder-value">
                  <strong>{formatDollars(allEntries.reduce((sum, h) => sum + ((h.vested !== undefined ? h.vested : h.percent) / 100) * valuation, 0))}</strong>
                </td>
              )}
              {baseHolders && <td></td>}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

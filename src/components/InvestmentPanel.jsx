import { useState, useEffect } from 'react';
import { INVESTMENT_MODES } from '../data/scenarios';
import { formatDollars } from '../utils/dilution';

export default function InvestmentPanel({ mode, onModeChange, params, onParamsChange }) {
  const [localParams, setLocalParams] = useState(params);

  useEffect(() => {
    setLocalParams(params);
  }, [params]);

  const update = (key, value) => {
    const next = { ...localParams, [key]: value };
    setLocalParams(next);
    onParamsChange(next);
  };

  return (
    <div className="panel investment-panel">
      <h3 className="panel-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        Investment Simulation
      </h3>

      {/* Mode selector */}
      <div className="input-group">
        <label className="input-label">Investment Type</label>
        <div className="mode-selector">
          {INVESTMENT_MODES.map((m) => (
            <button
              key={m.id}
              className={`mode-btn ${mode === m.id ? 'active' : ''}`}
              onClick={() => onModeChange(m.id)}
              id={`mode-${m.id}`}
              title={m.description}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Common: Investment Amount */}
      {(mode === 'safe' || mode === 'angel-vc') && (
        <div className="input-group">
          <label className="input-label">
            {mode === 'angel-vc' ? 'Angel Amount' : 'Investment Amount'}
            <span className="input-value">{formatDollars(localParams.investmentAmount || 0)}</span>
          </label>
          <input
            type="range"
            className="slider"
            min="10000"
            max="50000000"
            step="10000"
            value={localParams.investmentAmount || 0}
            onChange={(e) => update('investmentAmount', Number(e.target.value))}
            id="slider-investment-amount"
          />
          <div className="slider-labels">
            <span>$10K</span><span>$50M</span>
          </div>
        </div>
      )}

      {/* SAFE: Valuation Cap */}
      {(mode === 'safe' || mode === 'angel-vc') && (
        <div className="input-group">
          <label className="input-label">
            {mode === 'angel-vc' ? 'Angel Valuation Cap' : 'Valuation Cap'}
            <span className="input-value">{formatDollars(localParams.valuationCap || 0)}</span>
          </label>
          <input
            type="range"
            className="slider"
            min="100000"
            max="100000000"
            step="100000"
            value={localParams.valuationCap || 0}
            onChange={(e) => update('valuationCap', Number(e.target.value))}
            id="slider-valuation-cap"
          />
          <div className="slider-labels">
            <span>$100K</span><span>$100M</span>
          </div>
        </div>
      )}

      {/* SAFE: Discount */}
      {mode === 'safe' && (
        <div className="input-group">
          <label className="input-label">
            Discount Rate
            <span className="input-value">{localParams.discount || 0}%</span>
          </label>
          <input
            type="range"
            className="slider"
            min="0"
            max="50"
            step="1"
            value={localParams.discount || 0}
            onChange={(e) => update('discount', Number(e.target.value))}
            id="slider-discount"
          />
          <div className="slider-labels">
            <span>0%</span><span>50%</span>
          </div>
        </div>
      )}

      {/* PE: Target Ownership */}
      {mode === 'pe' && (
        <div className="input-group">
          <label className="input-label">
            PE Target Ownership
            <span className="input-value">{localParams.peTarget || 0}%</span>
          </label>
          <input
            type="range"
            className="slider"
            min="1"
            max="80"
            step="1"
            value={localParams.peTarget || 0}
            onChange={(e) => update('peTarget', Number(e.target.value))}
            id="slider-pe-target"
          />
          <div className="slider-labels">
            <span>1%</span><span>80%</span>
          </div>
        </div>
      )}

      {/* Angel+VC: VC Amount */}
      {mode === 'angel-vc' && (
        <div className="input-group">
          <label className="input-label">
            VC Round Amount
            <span className="input-value">{formatDollars(localParams.vcAmount || 0)}</span>
          </label>
          <input
            type="range"
            className="slider"
            min="100000"
            max="50000000"
            step="100000"
            value={localParams.vcAmount || 0}
            onChange={(e) => update('vcAmount', Number(e.target.value))}
            id="slider-vc-amount"
          />
          <div className="slider-labels">
            <span>$100K</span><span>$50M</span>
          </div>
        </div>
      )}

      {/* ESOP toggle */}
      <div className="input-group esop-group">
        <label className="input-label toggle-label">
          <span>Option Pool (ESOP)</span>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={localParams.esopEnabled || false}
              onChange={(e) => update('esopEnabled', e.target.checked)}
              id="toggle-esop"
            />
            <span className="toggle-track"></span>
          </div>
        </label>
        {localParams.esopEnabled && (
          <>
            <input
              type="range"
              className="slider"
              min="1"
              max="25"
              step="0.5"
              value={localParams.esopPercent || 10}
              onChange={(e) => update('esopPercent', Number(e.target.value))}
              id="slider-esop"
            />
            <div className="slider-labels">
              <span>1%</span>
              <span className="input-value">{localParams.esopPercent || 10}%</span>
              <span>25%</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

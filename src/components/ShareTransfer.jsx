import { useState } from 'react';

export default function ShareTransfer({ holders, onTransfer }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState(5);

  const handleTransfer = () => {
    if (!from || !to || from === to || amount <= 0) return;
    const sourceHolder = holders.find(h => h.id === from);
    if (!sourceHolder || sourceHolder.percent < amount) return;
    onTransfer(from, to, amount);
  };

  return (
    <div className="panel transfer-panel">
      <h3 className="panel-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
        Transfer Equity
      </h3>
      <div className="transfer-controls">
        <div className="input-group">
          <label className="input-label">From</label>
          <select
            className="select-input"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            id="transfer-from"
          >
            <option value="">Select holder...</option>
            {holders.map(h => (
              <option key={h.id} value={h.id}>{h.name} ({h.percent.toFixed(1)}%)</option>
            ))}
          </select>
        </div>
        <div className="transfer-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </div>
        <div className="input-group">
          <label className="input-label">To</label>
          <select
            className="select-input"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            id="transfer-to"
          >
            <option value="">Select holder...</option>
            {holders.map(h => (
              <option key={h.id} value={h.id}>{h.name} ({h.percent.toFixed(1)}%)</option>
            ))}
          </select>
        </div>
      </div>
      <div className="input-group">
        <label className="input-label">
          Amount to Transfer
          <span className="input-value">{amount}%</span>
        </label>
        <input
          type="range"
          className="slider"
          min="0.5"
          max="50"
          step="0.5"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          id="slider-transfer-amount"
        />
      </div>
      <button className="btn-primary" onClick={handleTransfer} id="btn-transfer">
        Transfer {amount}%
      </button>
    </div>
  );
}

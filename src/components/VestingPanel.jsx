import { formatMonths, getVestingMilestones } from '../utils/vesting';

export default function VestingPanel({ vestingConfig, onConfigChange, elapsedMonths, onElapsedChange }) {
  const { enabled, years, cliffMonths } = vestingConfig;
  const totalMonths = years * 12;
  const milestones = getVestingMilestones(years, cliffMonths);
  const progress = Math.min((elapsedMonths / totalMonths) * 100, 100);
  const isCliffPassed = elapsedMonths >= cliffMonths;

  return (
    <div className="panel vesting-panel">
      <h3 className="panel-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Vesting Schedule
      </h3>

      {/* Enable/Disable */}
      <div className="input-group">
        <label className="input-label toggle-label">
          <span>Enable Vesting</span>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onConfigChange({ ...vestingConfig, enabled: e.target.checked })}
              id="toggle-vesting"
            />
            <span className="toggle-track"></span>
          </div>
        </label>
      </div>

      {enabled && (
        <>
          {/* Schedule selector */}
          <div className="input-group">
            <label className="input-label">Vesting Period</label>
            <div className="mode-selector">
              <button
                className={`mode-btn ${years === 4 ? 'active' : ''}`}
                onClick={() => onConfigChange({ ...vestingConfig, years: 4 })}
                id="vesting-4yr"
              >
                4-Year
              </button>
              <button
                className={`mode-btn ${years === 5 ? 'active' : ''}`}
                onClick={() => onConfigChange({ ...vestingConfig, years: 5 })}
                id="vesting-5yr"
              >
                5-Year
              </button>
            </div>
          </div>

          {/* Cliff selector */}
          <div className="input-group">
            <label className="input-label">
              Cliff Period
              <span className="input-value">{cliffMonths} months</span>
            </label>
            <input
              type="range"
              className="slider"
              min="0"
              max="24"
              step="3"
              value={cliffMonths}
              onChange={(e) => onConfigChange({ ...vestingConfig, cliffMonths: Number(e.target.value) })}
              id="slider-cliff"
            />
            <div className="slider-labels">
              <span>No cliff</span>
              <span>24mo</span>
            </div>
          </div>

          {/* Timeline slider */}
          <div className="input-group">
            <label className="input-label">
              Time Elapsed
              <span className="input-value">{formatMonths(elapsedMonths)}</span>
            </label>
            <input
              type="range"
              className="slider vesting-time-slider"
              min="0"
              max={totalMonths}
              step="1"
              value={elapsedMonths}
              onChange={(e) => onElapsedChange(Number(e.target.value))}
              id="slider-elapsed"
            />
            <div className="slider-labels">
              <span>Start</span>
              <span>{years} years</span>
            </div>
          </div>

          {/* Visual timeline */}
          <div className="vesting-timeline">
            <div className="timeline-track">
              <div
                className={`timeline-fill ${isCliffPassed ? 'past-cliff' : 'pre-cliff'}`}
                style={{ width: `${progress}%` }}
              ></div>
              {cliffMonths > 0 && (
                <div
                  className="timeline-cliff-marker"
                  style={{ left: `${(cliffMonths / totalMonths) * 100}%` }}
                >
                  <div className="cliff-line"></div>
                  <span className="cliff-label">Cliff</span>
                </div>
              )}
              <div
                className="timeline-cursor"
                style={{ left: `${progress}%` }}
              ></div>
            </div>
            <div className="timeline-milestones">
              {milestones.map((m) => (
                <div
                  key={m.month}
                  className={`milestone ${m.type} ${elapsedMonths >= m.month ? 'reached' : ''}`}
                  style={{ left: `${(m.month / totalMonths) * 100}%` }}
                >
                  <span className="milestone-dot"></span>
                  <span className="milestone-label">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="vesting-status">
            {!isCliffPassed && elapsedMonths > 0 && (
              <div className="status-alert pre-cliff-alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Cliff not reached — {cliffMonths - elapsedMonths}mo remaining
              </div>
            )}
            {isCliffPassed && elapsedMonths < totalMonths && (
              <div className="status-alert vesting-alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                {Math.round((elapsedMonths / totalMonths) * 100)}% of schedule complete
              </div>
            )}
            {elapsedMonths >= totalMonths && (
              <div className="status-alert fully-vested-alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Fully vested
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

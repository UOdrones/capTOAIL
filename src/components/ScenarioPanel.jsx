import { DEFAULT_SCENARIOS } from '../data/scenarios';

export default function ScenarioPanel({ activeScenarioId, onSelectScenario, onCreateScenario }) {
  return (
    <div className="panel scenario-panel">
      <h3 className="panel-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        Scenarios
      </h3>
      <div className="scenario-list">
        {DEFAULT_SCENARIOS.map((s) => (
          <button
            key={s.id}
            className={`scenario-btn ${activeScenarioId === s.id ? 'active' : ''}`}
            onClick={() => onSelectScenario(s.id)}
            id={`scenario-${s.id}`}
          >
            <span className="scenario-name">{s.name}</span>
            <span className="scenario-desc">{s.description}</span>
          </button>
        ))}
      </div>
      <button className="btn-secondary create-scenario-btn" onClick={onCreateScenario} id="create-scenario-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Scenario
      </button>
    </div>
  );
}

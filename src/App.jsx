import { useState, useCallback, useMemo } from 'react';
import CapChart from './components/CapChart';
import OwnershipTable from './components/OwnershipTable';
import ScenarioPanel from './components/ScenarioPanel';
import InvestmentPanel from './components/InvestmentPanel';
import ValuationSlider from './components/ValuationSlider';
import ShareTransfer from './components/ShareTransfer';
import MemberManager from './components/MemberManager';
import { DEFAULT_SCENARIOS, HOLDER_COLORS } from './data/scenarios';
import { calculateSAFE, calculatePE, calculateAngelVC, addOptionPool } from './utils/dilution';
import './App.css';

const DEFAULT_PARAMS = {
  investmentAmount: 500000,
  valuationCap: 5000000,
  discount: 20,
  peTarget: 25,
  vcAmount: 2000000,
  esopEnabled: false,
  esopPercent: 10,
};

export default function App() {
  const [scenarioId, setScenarioId] = useState('base');
  const [customScenarios, setCustomScenarios] = useState([]);
  const [holders, setHolders] = useState(() => {
    const base = DEFAULT_SCENARIOS.find(s => s.id === 'base');
    return base ? [...base.holders] : [];
  });
  const [valuation, setValuation] = useState(1000000);
  const [investMode, setInvestMode] = useState('safe');
  const [investParams, setInvestParams] = useState(DEFAULT_PARAMS);
  const [showInvestment, setShowInvestment] = useState(false);

  // Base holders for delta comparison
  const baseHolders = useMemo(() => [...holders], [scenarioId]); // eslint-disable-line

  // Select scenario
  const handleSelectScenario = useCallback((id) => {
    const allScenarios = [...DEFAULT_SCENARIOS, ...customScenarios];
    const scenario = allScenarios.find(s => s.id === id);
    if (scenario) {
      setScenarioId(id);
      setHolders(scenario.holders.map(h => ({ ...h })));
      setShowInvestment(false);
    }
  }, [customScenarios]);

  // Create custom scenario from current state
  const handleCreateScenario = useCallback(() => {
    const name = prompt('Scenario name:');
    if (!name) return;
    const id = `custom-${Date.now()}`;
    const newScenario = {
      id,
      name,
      description: 'Custom scenario',
      locked: false,
      holders: holders.map(h => ({ ...h })),
    };
    setCustomScenarios(prev => [...prev, newScenario]);
    DEFAULT_SCENARIOS.push(newScenario); // Add to the array so ScenarioPanel picks it up
    setScenarioId(id);
  }, [holders]);

  // Transfer equity between holders
  const handleTransfer = useCallback((fromId, toId, amount) => {
    setHolders(prev =>
      prev.map(h => {
        if (h.id === fromId) return { ...h, percent: parseFloat((h.percent - amount).toFixed(2)) };
        if (h.id === toId) return { ...h, percent: parseFloat((h.percent + amount).toFixed(2)) };
        return h;
      })
    );
  }, []);

  // Add member
  const handleAddMember = useCallback((member) => {
    setHolders(prev => [...prev, member]);
  }, []);

  // Remove member
  const handleRemoveMember = useCallback((id) => {
    setHolders(prev => prev.filter(h => h.id !== id));
  }, []);

  // Update member
  const handleUpdateMember = useCallback((id, updates) => {
    setHolders(prev =>
      prev.map(h => (h.id === id ? { ...h, ...updates } : h))
    );
  }, []);

  // Calculate diluted state
  const dilutedResult = useMemo(() => {
    if (!showInvestment) return null;

    let workingHolders = holders.map(h => ({ ...h }));

    // Apply ESOP first if enabled
    if (investParams.esopEnabled) {
      workingHolders = addOptionPool(workingHolders, investParams.esopPercent);
    }

    switch (investMode) {
      case 'safe': {
        const result = calculateSAFE(
          workingHolders,
          investParams.investmentAmount,
          investParams.valuationCap,
          investParams.discount,
          valuation
        );
        const investors = [];
        if (result.investorPercent > 0) {
          investors.push({
            id: 'safe-investor',
            name: 'SAFE Investor',
            role: 'Investor',
            percent: result.investorPercent,
            color: '#fbbf24',
            group: 'investor',
          });
        }
        if (investParams.esopEnabled) {
          investors.push({
            id: 'esop',
            name: 'ESOP Reserve',
            role: 'Option Pool',
            percent: investParams.esopPercent,
            color: '#64748b',
            group: 'pool',
          });
        }
        return { holders: result.holders, investors };
      }
      case 'pe': {
        const result = calculatePE(workingHolders, investParams.peTarget, valuation);
        const investors = [];
        if (result.investorPercent > 0) {
          investors.push({
            id: 'pe-investor',
            name: 'PE Investor',
            role: 'Private Equity',
            percent: result.investorPercent,
            color: '#ef4444',
            group: 'investor',
          });
        }
        if (investParams.esopEnabled) {
          investors.push({
            id: 'esop',
            name: 'ESOP Reserve',
            role: 'Option Pool',
            percent: investParams.esopPercent,
            color: '#64748b',
            group: 'pool',
          });
        }
        return { holders: result.holders, investors };
      }
      case 'angel-vc': {
        const result = calculateAngelVC(
          workingHolders,
          investParams.investmentAmount,
          investParams.valuationCap,
          investParams.vcAmount,
          valuation
        );
        const investors = [];
        // Angel is already in result.holders from the function
        if (result.vcPercent > 0) {
          investors.push({
            id: 'vc-investor',
            name: 'VC Investor',
            role: 'Venture Capital',
            percent: result.vcPercent,
            color: '#ef4444',
            group: 'investor',
          });
        }
        if (investParams.esopEnabled) {
          investors.push({
            id: 'esop',
            name: 'ESOP Reserve',
            role: 'Option Pool',
            percent: investParams.esopPercent,
            color: '#64748b',
            group: 'pool',
          });
        }
        return { holders: result.holders, investors };
      }
      default:
        return null;
    }
  }, [showInvestment, holders, investMode, investParams, valuation]);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="logo-mark">
            <span className="logo-icon">◆</span>
            <h1 className="logo-text">cap<span className="logo-accent">TOAIL</span></h1>
          </div>
          <p className="header-tagline">OAIL Cap Table Simulator</p>
        </div>
        <div className="header-actions">
          <button
            className={`btn-glow ${showInvestment ? 'active' : ''}`}
            onClick={() => setShowInvestment(!showInvestment)}
            id="btn-toggle-investment"
          >
            {showInvestment ? '✕ Close Simulation' : '⚡ Simulate Investment'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Left Panel: Controls */}
        <aside className="sidebar">
          <ScenarioPanel
            activeScenarioId={scenarioId}
            onSelectScenario={handleSelectScenario}
            onCreateScenario={handleCreateScenario}
          />
          <ValuationSlider valuation={valuation} onChange={setValuation} />
          <ShareTransfer holders={holders} onTransfer={handleTransfer} />
          <MemberManager
            holders={holders}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            onUpdateMember={handleUpdateMember}
          />
        </aside>

        {/* Right Panel: Visualization */}
        <section className="main-content">
          {showInvestment && (
            <InvestmentPanel
              mode={investMode}
              onModeChange={setInvestMode}
              params={investParams}
              onParamsChange={setInvestParams}
            />
          )}

          <div className={`charts-area ${showInvestment && dilutedResult ? 'split-view' : ''}`}>
            {/* Current / Pre-Investment Chart */}
            <CapChart
              holders={holders}
              valuation={valuation}
              title={showInvestment ? 'Pre-Investment' : `Current — ${DEFAULT_SCENARIOS.find(s => s.id === scenarioId)?.name || 'Custom'}`}
            />

            {/* Post-Investment Chart (only when simulating) */}
            {showInvestment && dilutedResult && (
              <CapChart
                holders={dilutedResult.holders}
                investorEntries={dilutedResult.investors}
                valuation={valuation}
                title="Post-Investment"
              />
            )}
          </div>

          {/* Ownership Table */}
          <OwnershipTable
            holders={showInvestment && dilutedResult ? dilutedResult.holders : holders}
            investorEntries={showInvestment && dilutedResult ? dilutedResult.investors : []}
            valuation={valuation}
            baseHolders={showInvestment ? holders : null}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p className="disclaimer">
          ⚠️ capTOAIL is a simulation tool only. It does not constitute legal, financial, or tax advice.
          Consult qualified professionals before making equity or investment decisions.
        </p>
        <p className="footer-brand">© {new Date().getFullYear()} OAIL · Built with capTOAIL</p>
      </footer>
    </div>
  );
}

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatDollars, formatPercent } from '../utils/dilution';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CapChart({ holders, investorEntries = [], valuation, title }) {
  const allEntries = [...holders, ...investorEntries];
  
  const data = {
    labels: allEntries.map(h => h.name),
    datasets: [
      {
        data: allEntries.map(h => h.percent),
        backgroundColor: allEntries.map(h => h.color || '#64748b'),
        borderColor: 'rgba(10, 14, 39, 0.8)',
        borderWidth: 2,
        hoverBorderColor: '#fff',
        hoverBorderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 600,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            const percent = context.parsed;
            const impliedValue = valuation ? (percent / 100) * valuation : null;
            let label = `${formatPercent(percent)}`;
            if (impliedValue) {
              label += ` — ${formatDollars(impliedValue)}`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="cap-chart-container">
      <h3 className="chart-title">{title || 'Ownership Breakdown'}</h3>
      <div className="chart-wrapper">
        <Doughnut data={data} options={options} />
        <div className="chart-center-label">
          <span className="chart-center-logo">OAIL</span>
          <span className="chart-center-sub">capTOAIL</span>
        </div>
      </div>
      <div className="chart-legend">
        {allEntries.map((h) => (
          <div key={h.id} className="legend-item">
            <span className="legend-dot" style={{ background: h.color }}></span>
            <span className="legend-name">{h.name}</span>
            <span className="legend-pct">{formatPercent(h.percent)}</span>
            {valuation > 0 && (
              <span className="legend-value">{formatDollars((h.percent / 100) * valuation)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

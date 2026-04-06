import { formatDollars } from '../utils/dilution';

export default function ValuationSlider({ valuation, onChange }) {
  // Use a logarithmic scale for the slider
  const minLog = Math.log10(100000);    // $100K
  const maxLog = Math.log10(1000000000); // $1B
  const logValue = Math.log10(valuation || 100000);
  const sliderPos = ((logValue - minLog) / (maxLog - minLog)) * 100;

  const handleSliderChange = (e) => {
    const pos = Number(e.target.value);
    const logVal = minLog + (pos / 100) * (maxLog - minLog);
    const rawVal = Math.pow(10, logVal);
    // Round to nice numbers
    let rounded;
    if (rawVal < 1000000) {
      rounded = Math.round(rawVal / 10000) * 10000;
    } else if (rawVal < 100000000) {
      rounded = Math.round(rawVal / 100000) * 100000;
    } else {
      rounded = Math.round(rawVal / 1000000) * 1000000;
    }
    onChange(rounded);
  };

  return (
    <div className="panel valuation-panel">
      <h3 className="panel-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
        Company Valuation
      </h3>
      <div className="valuation-display">
        <span className="valuation-amount">{formatDollars(valuation)}</span>
        <span className="valuation-label">Pre-Money Valuation</span>
      </div>
      <input
        type="range"
        className="slider valuation-slider"
        min="0"
        max="100"
        step="0.1"
        value={sliderPos}
        onChange={handleSliderChange}
        id="slider-valuation"
      />
      <div className="slider-labels">
        <span>$100K</span>
        <span>$1B</span>
      </div>
    </div>
  );
}

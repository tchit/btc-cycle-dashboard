import React from 'react';

/**
 * ScenarioBar — grid-based scenario comparison table with colored labels.
 *
 * @param {Object[]} scenarios — array of:
 *   { label, color, depth, bottom, drawdown, assessment }
 */
export default function ScenarioBar({ scenarios }) {
  return (
    <div className="sb-container">
      <div className="sb-header">
        <div>Scenario</div>
        <div>Depth</div>
        <div>Projected Bottom</div>
        <div>Drawdown</div>
        <div>Probability Assessment</div>
      </div>
      {scenarios.map((s, i) => (
        <div key={i} className="sb-row">
          <div className="sb-label" style={{ color: s.color }}>{s.label}</div>
          <div className="sb-cell">{s.depth}</div>
          <div className="sb-cell">{s.bottom}</div>
          <div className="sb-cell">{s.drawdown}</div>
          <div className="sb-assessment">{s.assessment}</div>
        </div>
      ))}
    </div>
  );
}

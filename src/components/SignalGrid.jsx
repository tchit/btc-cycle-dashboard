import React from 'react';

const SignalGrid = ({ signals = [] }) => {
  return (
    <div className="signal-grid-dense">
      {signals.map((signal, idx) => (
        <div key={signal.id || idx} className="signal-card">
          <div className="signal-tooltip">
            <strong>{signal.name}</strong>
            <br />
            <span style={{ opacity: 0.8 }}>{signal.desc}</span>
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              Valeur actuelle: <span style={{ fontFamily: 'var(--font-mono)' }}>{signal.value}</span>
            </div>
          </div>

          <div className="signal-info">
            <span className="signal-title">{signal.name}</span>
            <span className="signal-desc">{signal.desc}</span>
          </div>

          <div className="signal-meta">
            <span className="signal-value">{signal.value}</span>
            <span className={`status-badge ${signal.status}`}>
              {signal.status.toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SignalGrid;

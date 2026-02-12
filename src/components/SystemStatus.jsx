import React, { useState, useEffect } from 'react';

export default function SystemStatus() {
  const [latency, setLatency] = useState(42);
  const [blockHeight, setBlockHeight] = useState(887_214);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(20 + Math.random() * 60));
      setBlockHeight(prev => prev + (Math.random() > 0.85 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="system-status-container">
      <div className="system-pill">
        <div className="status-dot-ring">
          <div className="status-dot-core" />
        </div>
        <span className="status-text">ONLINE</span>
        <span className="status-separator" />
        <span className="status-label">{latency}ms</span>
        <div className="extended-info">
          <div className="extended-row">
            <span className="extended-key">Latency</span>
            <span className="extended-val">{latency}ms</span>
          </div>
          <div className="extended-row">
            <span className="extended-key">Block</span>
            <span className="extended-val">#{blockHeight.toLocaleString()}</span>
          </div>
          <div className="extended-row">
            <span className="extended-key">Network</span>
            <span className="extended-val">Mainnet</span>
          </div>
        </div>
      </div>
    </div>
  );
}

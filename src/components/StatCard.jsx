import React from 'react';
import FakeBadge from './FakeBadge';
import { fPct } from '../utils/format';
import '../styles/components.css'; // Ensure CSS is loaded

export default function StatCard({ label, value, detail, change, status, fake }) {
  // Determine semantic color for glow or text
  const statusClass = status === 'up' ? 'text-up' 
    : status === 'down' ? 'text-down' 
    : status === 'warn' ? 'text-warn' 
    : 'text-neutral';

  return (
    <div className="stat-card group">
      {/* Subtle background with glass effect */}
      <div className="stat-card-bg"></div>
      
      {/* Header: Technical Label + Optional Fake Badge */}
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        {fake && <div className="stat-badge-fake"><FakeBadge /></div>}
      </div>

      {/* Main Value: Large, Mono, Luminous */}
      <div className="stat-main">
        <span className="stat-value">{value}</span>
      </div>

      {/* Footer: Variation and Detail */}
      {(detail || change) && (
        <div className="stat-footer">
          {change ? (
            <span className={`stat-change ${change > 0 ? 'is-up' : 'is-down'}`}>
              {change > 0 ? '↑' : '↓'} {fPct(change)}
            </span>
          ) : null}
          {detail && <span className="stat-detail-text">{detail}</span>}
        </div>
      )}
    </div>
  );
}

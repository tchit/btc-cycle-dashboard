import React from 'react';
import FakeBadge from './FakeBadge';
import { fPct } from '../utils/format';

export default function StatCard({ label, value, detail, change, delta, status, neutral, fake, featured, intense }) {
  const s = status === 'up' ? 'up' : status === 'down' ? 'down' : status === 'warn' ? 'warn' : 'neutral';
  const hasDelta = delta != null && isFinite(delta) && Math.abs(delta) >= 0.01;
  return (
    <div className={`stat-card ${s}${featured ? ' featured' : ''}${intense ? ' intense' : ''}${fake ? ' is-fake' : ''}`}>
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        {fake && <FakeBadge />}
      </div>
      <div className="stat-main">
        <span className="stat-value">
          {value}
          {hasDelta && (
            <span className={`stat-delta ${delta > 0 ? 'is-up' : 'is-down'}`}>
              {delta > 0 ? '\u2191' : '\u2193'}{Math.abs(delta) < 10 ? Math.abs(delta).toFixed(1) : Math.abs(delta).toFixed(0)}%
            </span>
          )}
        </span>
      </div>
      {(detail || change) && (
        <div className="stat-footer">
          {change ? (
            <span className={`stat-change ${change > 0 ? 'is-up' : 'is-down'}`}>
              {change > 0 ? '\u2191' : '\u2193'} {fPct(change)}
            </span>
          ) : null}
          {detail && <span className="stat-detail-text">{detail}</span>}
        </div>
      )}
    </div>
  );
}

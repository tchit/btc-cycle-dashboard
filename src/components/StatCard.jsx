import React from 'react';
import FakeBadge from './FakeBadge';
import { fPct } from '../utils/format';

export default function StatCard({ label, value, detail, change, status, neutral, fake }) {
  const s = status === 'up' ? 'up' : status === 'down' ? 'down' : status === 'warn' ? 'warn' : 'neutral';
  return (
    <div className={`stat-card ${s}${fake ? ' is-fake' : ''}`}>
      <div className="stat-label">{label}{fake && <FakeBadge />}</div>
      <div className="stat-value">{value}</div>
      {(detail || change) && (
        <div className="stat-detail">
          {change ? <span className={`stat-change ${change > 0 ? 'up' : 'down'}`}>{fPct(change)}</span> : null}
          {detail ? <span style={{ marginLeft: 8 }}>{detail}</span> : null}
        </div>
      )}
    </div>
  );
}

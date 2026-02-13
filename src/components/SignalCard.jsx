import React from 'react';
import { DS } from '../config/design';
import FakeBadge from './FakeBadge';
import InfoTip from './InfoTip';

export default function SignalCard({ title, value, unit, status, detail, color, mob, info, fake, delta }) {
  const stClass = status === 'bullish' ? 'bullish' : status === 'bearish' ? 'bearish' : 'neutral';
  const stLabel = status === 'bullish' ? 'BULL' : status === 'bearish' ? 'BEAR' : '\u2014';
  const hasDelta = delta != null && isFinite(delta) && Math.abs(delta) >= 0.01;

  return (
    <div className={`signal-card${fake ? ' is-fake' : ''}`}>
      <div className="signal-header">
        <div className="signal-title">
          {title}
          {fake && <FakeBadge />}
          {info && <InfoTip text={info} mob={mob} />}
        </div>
        <span className={`signal-status ${stClass}`}>{stLabel}</span>
      </div>
      <div className="signal-value" style={{ color: color || DS.text }}>
        {value}
        {unit && <span style={{ fontSize: 16, color: DS.text3, fontWeight: 400, marginLeft: 2 }}>{unit}</span>}
        {hasDelta && (
          <span className={`stat-delta ${delta > 0 ? 'is-up' : 'is-down'}`}>
            {delta > 0 ? '\u2191' : '\u2193'}{Math.abs(delta) < 10 ? Math.abs(delta).toFixed(1) : Math.abs(delta).toFixed(0)}%
          </span>
        )}
      </div>
      {detail && <div className="signal-detail">{detail}</div>}
    </div>
  );
}

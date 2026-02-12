import React from 'react';
import { DS } from '../config/design';
import ImageSlot from './ImageSlot';

export default function KeySignals({ signals = [], onViewAll, mob }) {
  return (
    <div className="key-signals">
      {/* Header with art background */}
      <div className="key-signals-header">
        <ImageSlot variant="halftone" tone="ink" style={{ opacity: 0.08 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="key-signals-title">Signaux Cles</div>
          <div className="key-signals-subtitle">Analyse multi-metrique</div>
        </div>
      </div>

      {/* Signal tiles grid */}
      <div className="key-signals-grid">
        {signals.map((sig, i) => (
          <div
            key={sig.name}
            className={`key-signal-tile key-signal-tile--${sig.status}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Header row: name + status dot */}
            <div className="key-signal-head">
              <span className="key-signal-name">{sig.name}</span>
              {(sig.status === 'bull' || sig.status === 'bear') && (
                <span className={`key-signal-dot key-signal-dot--${sig.status}`} />
              )}
            </div>

            {/* Big value */}
            <div className="key-signal-value" style={{ fontFamily: DS.mono }}>
              {sig.value}
            </div>

            {/* Sub text */}
            {sig.desc && (
              <div className="key-signal-desc">{sig.desc}</div>
            )}

            {/* Mini progress bar */}
            <div className="key-signal-bar">
              <div
                className={`key-signal-bar-fill key-signal-bar-fill--${sig.status}`}
                style={{ width: `${Math.min(Math.max(sig.pct || 0, 0), 100)}%` }}
              />
            </div>

            {/* Tooltip on hover */}
            {sig.info && (
              <div className="key-signal-tooltip">{sig.info}</div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {onViewAll && (
        <div className="key-signals-footer">
          <button className="key-signals-viewall" onClick={onViewAll}>
            Voir tous les indicateurs →
          </button>
        </div>
      )}
    </div>
  );
}

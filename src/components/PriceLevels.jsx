import React from 'react';
import { MC, RP as RP_CONST, W200 as W200_CONST, CVDD, STHRP, LTHRP } from '../config/constants';
import { fP } from '../utils/format';

export default function PriceLevels({ price, margin, mob, rp, sthRp, lthRp, w200 }) {
  const levels = [
    { label: 'LTH Realized Price', value: lthRp || LTHRP },
    { label: 'CVDD', value: CVDD },
    { label: 'Realized Price', value: rp || RP_CONST },
    { label: '200-Week MA', value: w200 || W200_CONST },
    { label: 'Coût de Minage', value: MC },
    { label: 'STH Realized Price', value: sthRp || STHRP },
  ];

  const resistances = levels
    .filter(l => l.value > price)
    .sort((a, b) => a.value - b.value);

  const supports = levels
    .filter(l => l.value <= price)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">📊 Niveaux de Prix</span>
        <span className={`stat-change ${margin >= 0 ? 'is-up' : 'is-down'}`}>
          {margin >= 0 ? '↑' : '↓'} {Math.abs(margin).toFixed(1)}%
        </span>
      </div>

      <div className="card-body">
        {/* Hero Price */}
        <div className="pricelevel-hero">
          <span className="pricelevel-hero-value">${fP(price)}</span>
          <span className="pricelevel-hero-label">Prix actuel · BTC/USD</span>
        </div>

        {/* Résistances */}
        {resistances.length > 0 && (
          <>
            <div className="pricelevel-divider"><span>RÉSISTANCES</span></div>
            {resistances.map(level => (
              <div className="pricelevel-row" key={level.label}>
                <div className="pricelevel-bar-track">
                  <div
                    className="pricelevel-bar-fill is-down"
                    style={{ width: `${Math.min((price / level.value) * 100, 100)}%` }}
                  />
                </div>
                <span className="pricelevel-row-label">{level.label}</span>
                <span className="pricelevel-row-value is-down">${fP(level.value)}</span>
              </div>
            ))}
          </>
        )}

        {/* Supports */}
        {supports.length > 0 && (
          <>
            <div className="pricelevel-divider"><span>SUPPORTS</span></div>
            {supports.map(level => (
              <div className="pricelevel-row" key={level.label + level.value}>
                <div className="pricelevel-bar-track">
                  <div
                    className="pricelevel-bar-fill is-up"
                    style={{ width: `${Math.min((level.value / price) * 100, 100)}%` }}
                  />
                </div>
                <span className="pricelevel-row-label">{level.label}</span>
                <span className="pricelevel-row-value is-up">${fP(level.value)}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

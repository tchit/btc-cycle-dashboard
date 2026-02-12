import React from 'react';
import { DS } from '../config/design';
import { ATH, OCLEVELS } from '../config/constants';
import { fK } from '../utils/format';

export default function OnChainDepth({ price, mob, levels }) {
  const lvls = (levels || OCLEVELS).filter(l => l.v > 20000 && l.v < 200000);
  const resistances = lvls.filter(l => l.v > price).sort((a, b) => a.v - b.v);
  const supports = lvls.filter(l => l.v <= price).sort((a, b) => b.v - a.v);

  const maxDelta = Math.max(
    ...lvls.map(l => Math.abs((l.v - price) / price) * 100)
  );

  const corrections = [
    { l: 'C0', d: 93 },
    { l: 'C1', d: 87 },
    { l: 'C2', d: 84 },
    { l: 'C3', d: 78 },
  ];
  const currentDd = ((ATH - price) / ATH * 100).toFixed(0);

  return (
    <div className="ocd">
      {/* ---- RESISTANCES ---- */}
      {resistances.length > 0 && (
        <div className="ocd-section">
          <div className="ocd-section-label">Au-dessus du prix</div>
          {resistances.map(l => {
            const delta = ((l.v - price) / price * 100).toFixed(0);
            const barW = Math.min(100, (Math.abs(delta) / maxDelta) * 100);
            return (
              <div className="ocd-row" key={l.k}>
                <span className="ocd-row-label">{l.l}</span>
                <div className="ocd-row-bar-track">
                  <div
                    className="ocd-row-bar-fill is-down"
                    style={{ width: `${barW}%` }}
                  />
                </div>
                <span className="ocd-row-value is-down">{fK(l.v)}</span>
                <span className="ocd-row-delta is-down">{`+${delta}%`}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- PRIX ACTUEL ---- */}
      <div className="ocd-current">
        <span className="ocd-current-arrow">&#9656;</span>
        <span className="ocd-current-label">Prix actuel</span>
        <span className="ocd-current-value">{`$${fK(price)}`}</span>
      </div>

      {/* ---- SUPPORTS ---- */}
      {supports.length > 0 && (
        <div className="ocd-section">
          <div className="ocd-section-label">Sous le prix</div>
          {supports.map(l => {
            const delta = ((price - l.v) / price * 100).toFixed(0);
            const barW = Math.min(100, (Math.abs(delta) / maxDelta) * 100);
            return (
              <div className="ocd-row" key={l.k}>
                <span className="ocd-row-label">{l.l}</span>
                <div className="ocd-row-bar-track">
                  <div
                    className="ocd-row-bar-fill is-up"
                    style={{ width: `${barW}%` }}
                  />
                </div>
                <span className="ocd-row-value is-up">{fK(l.v)}</span>
                <span className="ocd-row-delta is-up">{`-${delta}%`}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- DRAWDOWNS CYCLIQUES ---- */}
      <div className="ocd-drawdowns">
        <div className="ocd-drawdowns-label">Drawdowns cycliques</div>

        {corrections.map((x, i) => (
          <div className="ocd-dd-row" key={i}>
            <span className="ocd-dd-cycle">{x.l}</span>
            <div className="ocd-dd-bar-track">
              <div
                className="ocd-dd-bar-fill"
                style={{ width: `${x.d}%` }}
              />
            </div>
            <span className="ocd-dd-value">{`-${x.d}%`}</span>
          </div>
        ))}

        <div className="ocd-dd-separator" />

        {/* C4 projection */}
        <div className="ocd-dd-row is-projected">
          <span className="ocd-dd-cycle is-warn">C4 proj.</span>
          <div className="ocd-dd-bar-track">
            <div className="ocd-dd-bar-fill is-warn" style={{ width: '60%' }} />
            {/* Marqueur position actuelle */}
            <div
              className="ocd-dd-marker"
              style={{ left: `${currentDd}%` }}
            >
              <div className="ocd-dd-marker-line" />
              <span className="ocd-dd-marker-label">{`-${currentDd}%`}</span>
            </div>
          </div>
          <span className="ocd-dd-value is-warn">-60%</span>
        </div>
      </div>
    </div>
  );
}

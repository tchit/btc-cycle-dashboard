import React, { useState } from 'react';
import { DS } from '../config/design';
import { OCLEVELS } from '../config/constants';
import { fK, fP } from '../utils/format';

export default function PriceDepthGauge({ price, levels, mob }) {
  const [active, setActive] = useState(null);

  const lvls = (levels || OCLEVELS)
    .filter(l => l.v > 20000 && l.v < 200000)
    .sort((a, b) => a.v - b.v);

  if (!price || lvls.length < 2) return null;

  // SVG dimensions
  const W = 800, H = 120;
  const padL = 20, padR = 20, usable = W - padL - padR;

  // Scale with 15% padding on each side
  const minV = lvls[0].v, maxV = lvls[lvls.length - 1].v;
  const range = maxV - minV;
  const paddedMin = minV - range * 0.15;
  const paddedMax = maxV + range * 0.15;
  const fullRange = paddedMax - paddedMin;

  const x = (val) => ((val - paddedMin) / fullRange) * usable + padL;

  // Bar dimensions
  const barY = 35, barH = 35;

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {/* Colored segments between consecutive levels */}
        {lvls.map((lvl, i) => {
          if (i === lvls.length - 1) return null;
          const next = lvls[i + 1];
          const x1 = x(lvl.v), x2 = x(next.v);
          return (
            <rect
              key={`seg-${lvl.k}`}
              x={x1} y={barY} width={x2 - x1} height={barH}
              fill={lvl.c} opacity={0.2}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setActive({ lvl, next, x1, x2 })}
              onMouseLeave={() => setActive(null)}
              onTouchStart={() => setActive(active?.lvl?.k === lvl.k ? null : { lvl, next, x1, x2 })}
            />
          );
        })}

        {/* Level lines and labels */}
        {lvls.map((lvl, i) => {
          const xPos = x(lvl.v);
          const above = i % 2 === 0; // alternate labels top/bottom
          const delta = ((lvl.v - price) / price * 100).toFixed(0);
          const deltaSign = lvl.v >= price ? '+' : '';
          const deltaColor = lvl.v >= price ? DS.down : DS.up;

          return (
            <g key={lvl.k}>
              <line
                x1={xPos} y1={barY - 5} x2={xPos} y2={barY + barH + 5}
                stroke={lvl.c} strokeWidth={1} opacity={0.6}
              />
              {above ? (
                <>
                  <text x={xPos} y={barY - 22} textAnchor="middle"
                    style={{ fontSize: 10, fontFamily: DS.font, fill: lvl.c, fontWeight: 600 }}>
                    {lvl.l}
                  </text>
                  <text x={xPos} y={barY - 11} textAnchor="middle"
                    style={{ fontSize: 10, fontFamily: DS.mono, fill: DS.text2 }}>
                    {`$${fK(lvl.v)}`}
                  </text>
                </>
              ) : (
                <>
                  <text x={xPos} y={barY + barH + 16} textAnchor="middle"
                    style={{ fontSize: 10, fontFamily: DS.font, fill: lvl.c, fontWeight: 600 }}>
                    {lvl.l}
                  </text>
                  <text x={xPos} y={barY + barH + 27} textAnchor="middle"
                    style={{ fontSize: 10, fontFamily: DS.mono, fill: DS.text2 }}>
                    {`$${fK(lvl.v)}`}
                  </text>
                </>
              )}
              {/* Delta badge near the price value */}
              <text
                x={xPos} y={above ? barY - 33 : barY + barH + 38}
                textAnchor="middle"
                style={{ fontSize: 9, fontFamily: DS.mono, fill: deltaColor, fontWeight: 600 }}>
                {`${deltaSign}${delta}%`}
              </text>
            </g>
          );
        })}

        {/* Current price marker */}
        {(() => {
          const px = x(price);
          return (
            <g>
              <line x1={px} y1={barY - 8} x2={px} y2={barY + barH + 8}
                stroke={DS.accent} strokeWidth={2} />
              <circle cx={px} cy={barY + barH / 2} r={5}
                fill={DS.accent} />
              <text x={px} y={barY - 40} textAnchor="middle"
                style={{ fontSize: 13, fontFamily: DS.mono, fill: DS.accent, fontWeight: 700 }}>
                {`$${fP(price)}`}
              </text>
            </g>
          );
        })()}
      </svg>

      {/* HTML tooltip */}
      {active && (
        <div className="pdg-tooltip" style={{
          position: 'absolute',
          left: `${((active.x1 + active.x2) / 2 / W) * 100}%`,
          bottom: '100%',
          transform: 'translateX(-50%)',
          background: DS.surface,
          border: `1px solid ${DS.gold}`,
          color: DS.text,
          fontSize: 12,
          fontFamily: DS.mono,
          whiteSpace: 'nowrap',
          padding: '6px 10px',
          borderRadius: 4,
          pointerEvents: 'none',
          zIndex: 10,
          opacity: 1,
        }}>
          <div style={{ fontWeight: 700, color: active.lvl.c, marginBottom: 2 }}>{active.lvl.l}</div>
          <div style={{ color: DS.text2 }}>{`$${fK(active.lvl.v)} — $${fK(active.next.v)}`}</div>
        </div>
      )}
    </div>
  );
}

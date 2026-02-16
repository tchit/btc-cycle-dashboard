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

  const W = 800, H = mob ? 140 : 130;
  const padL = 20, padR = 20, usable = W - padL - padR;

  const minV = lvls[0].v, maxV = lvls[lvls.length - 1].v;
  const range = maxV - minV;
  const paddedMin = minV - range * 0.15;
  const paddedMax = maxV + range * 0.15;
  const fullRange = paddedMax - paddedMin;

  const x = (val) => ((val - paddedMin) / fullRange) * usable + padL;

  const barY = 40, barH = 38;

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {/* Defs for glow filter */}
        <defs>
          <filter id="glowLime" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Colored segments between consecutive levels */}
        {lvls.map((lvl, i) => {
          if (i === lvls.length - 1) return null;
          const next = lvls[i + 1];
          const x1 = x(lvl.v), x2 = x(next.v);
          return (
            <rect
              key={`seg-${lvl.k}`}
              x={x1} y={barY} width={x2 - x1} height={barH}
              fill={lvl.c} opacity={0.25}
              rx={2}
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
          const above = i % 2 === 0;
          const delta = ((lvl.v - price) / price * 100).toFixed(0);
          const deltaSign = lvl.v >= price ? '+' : '';
          const deltaColor = lvl.v >= price ? DS.down : DS.up;

          return (
            <g key={lvl.k}>
              <line
                x1={xPos} y1={barY - 4} x2={xPos} y2={barY + barH + 4}
                stroke={lvl.c} strokeWidth={1.5} opacity={0.7}
              />
              {above ? (
                <>
                  <text x={xPos} y={barY - 20} textAnchor="middle"
                    style={{ fontSize: 11, fontFamily: DS.display, fill: lvl.c, fontWeight: 600 }}>
                    {lvl.l}
                  </text>
                  <text x={xPos} y={barY - 8} textAnchor="middle"
                    style={{ fontSize: 12, fontFamily: DS.mono, fill: DS.text2, fontWeight: 500 }}>
                    {`$${fK(lvl.v)}`}
                  </text>
                </>
              ) : (
                <>
                  <text x={xPos} y={barY + barH + 16} textAnchor="middle"
                    style={{ fontSize: 11, fontFamily: DS.display, fill: lvl.c, fontWeight: 600 }}>
                    {lvl.l}
                  </text>
                  <text x={xPos} y={barY + barH + 28} textAnchor="middle"
                    style={{ fontSize: 12, fontFamily: DS.mono, fill: DS.text2, fontWeight: 500 }}>
                    {`$${fK(lvl.v)}`}
                  </text>
                </>
              )}
              <text
                x={xPos} y={above ? barY - 32 : barY + barH + 40}
                textAnchor="middle"
                style={{ fontSize: 10, fontFamily: DS.mono, fill: deltaColor, fontWeight: 700 }}>
                {`${deltaSign}${delta}%`}
              </text>
            </g>
          );
        })}

        {/* Current price marker with glow */}
        {(() => {
          const px = x(price);
          return (
            <g filter="url(#glowLime)">
              <line x1={px} y1={barY - 6} x2={px} y2={barY + barH + 6}
                stroke={DS.accent} strokeWidth={2.5} />
              <circle cx={px} cy={barY + barH / 2} r={6}
                fill={DS.accent} />
              <text x={px} y={barY - 44} textAnchor="middle"
                style={{ fontSize: 14, fontFamily: DS.mono, fill: DS.accent, fontWeight: 700 }}>
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
          clipPath: 'var(--clip-badge)',
          color: DS.text,
          fontSize: 12,
          fontFamily: DS.mono,
          whiteSpace: 'nowrap',
          padding: '8px 14px',
          pointerEvents: 'none',
          zIndex: 10,
          boxShadow: `0 0 12px rgba(212, 168, 67, 0.2)`,
        }}>
          <div style={{ fontWeight: 700, color: active.lvl.c, marginBottom: 2 }}>{active.lvl.l}</div>
          <div style={{ color: DS.text2 }}>{`$${fK(active.lvl.v)} — $${fK(active.next.v)}`}</div>
        </div>
      )}
    </div>
  );
}

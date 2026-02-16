import React, { useState, useEffect, useRef } from 'react';
import { DS } from '../config/design';
import { OCLEVELS } from '../config/constants';
import { fK, fP } from '../utils/format';

const zoneFamily = (key) => {
  if (['lthrp', 'cvdd', 'rp'].includes(key)) return 'Floor';
  if (['w200', 'sthrp', 'ma2y'].includes(key)) return 'Cycle';
  return 'Top';
};

export default function PriceDepthGauge({ price, levels, mob }) {
  const [active, setActive] = useState(null);
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const lvls = (levels || OCLEVELS)
    .filter(l => l.v > 20000 && l.v < 200000)
    .sort((a, b) => a.v - b.v);

  if (!price || lvls.length < 2) return null;

  const W = 800, H = mob ? 165 : 155;
  const padL = 20, padR = 20, usable = W - padL - padR;

  const minV = lvls[0].v, maxV = lvls[lvls.length - 1].v;
  const range = maxV - minV;
  const paddedMin = minV - range * 0.15;
  const paddedMax = maxV + range * 0.15;
  const fullRange = paddedMax - paddedMin;

  const x = (val) => ((val - paddedMin) / fullRange) * usable + padL;

  const barY = 60, barH = 38;

  // Proximity factor: 1.0 for nearest level, 0.5 for farthest
  const maxDist = Math.max(...lvls.map(l => Math.abs(l.v - price)));
  const prox = (v) => 1.0 - (Math.abs(v - price) / maxDist) * 0.5;

  return (
    <div ref={ref} style={{ position: 'relative' }} className={mounted ? 'pdg--mounted' : ''}>
      {/* H2 Spot Price */}
      <div className="pdg-spot-hero" style={{
        fontFamily: DS.display,
        fontWeight: 700,
        fontSize: mob ? 28 : 36,
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        color: DS.accent,
        textAlign: 'center',
        marginBottom: 12,
        textShadow: `0 0 24px rgba(204, 255, 0, 0.3)`,
      }}>
        ${fP(price)}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        <defs>
          <filter id="glowLime" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="zoneGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={DS.up} stopOpacity={0.08} />
            <stop offset="50%" stopColor={DS.warn} stopOpacity={0.04} />
            <stop offset="100%" stopColor={DS.down} stopOpacity={0.08} />
          </linearGradient>
        </defs>

        {/* Zone gradient underlay */}
        <rect x={padL} y={barY} width={usable} height={barH} fill="url(#zoneGrad)" rx={2} />

        {/* Colored segments between consecutive levels */}
        {lvls.map((lvl, i) => {
          if (i === lvls.length - 1) return null;
          const next = lvls[i + 1];
          const x1 = x(lvl.v), x2 = x(next.v);
          return (
            <rect
              key={`seg-${lvl.k}`}
              x={x1} y={barY} width={x2 - x1} height={barH}
              fill={lvl.c} opacity={0.15 + prox(lvl.v) * 0.15}
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
          const deltaStr = `${deltaSign}${delta}%`;
          const pillW = deltaStr.length * 6.5 + 10;
          const op = prox(lvl.v);

          return (
            <g key={lvl.k} className="pdg-level" style={{ '--pdg-delay': `${i * 70 + 100}ms` }}>
              <line
                x1={xPos} y1={barY - 4} x2={xPos} y2={barY + barH + 4}
                stroke={lvl.c} strokeWidth={1.5} opacity={0.5 + op * 0.4}
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
              {/* Delta pill */}
              {(() => {
                const dy = above ? barY - 32 : barY + barH + 40;
                return (
                  <g>
                    <rect
                      x={xPos - pillW / 2} y={dy - 9}
                      width={pillW} height={14}
                      rx={7} fill={deltaColor} opacity={0.12}
                    />
                    <text
                      x={xPos} y={dy}
                      textAnchor="middle"
                      style={{ fontSize: 10, fontFamily: DS.mono, fill: deltaColor, fontWeight: 700 }}>
                      {deltaStr}
                    </text>
                  </g>
                );
              })()}
            </g>
          );
        })}

        {/* Current price marker with glow */}
        {(() => {
          const px = x(price);
          return (
            <g filter="url(#glowLime)" className="pdg-spot">
              <line x1={px} y1={barY - 6} x2={px} y2={barY + barH + 6}
                stroke={DS.accent} strokeWidth={2.5} />
              {/* Pulse ring */}
              <circle cx={px} cy={barY + barH / 2} r={7}
                fill="none" stroke={DS.accent} strokeWidth={1.5} opacity={0}>
                <animate attributeName="r" from="7" to="18" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Main dot */}
              <circle cx={px} cy={barY + barH / 2} r={7}
                fill={DS.accent} />
              {/* Inner highlight */}
              <circle cx={px} cy={barY + barH / 2} r={2.5}
                fill="#FFFFFF" opacity={0.6} />
              {/* Small label under the marker */}
              <text x={px} y={barY + barH + 18} textAnchor="middle"
                style={{ fontSize: 10, fontFamily: DS.mono, fill: DS.accent, fontWeight: 600, opacity: 0.7 }}>
                SPOT
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
          top: 0,
          transform: 'translateX(-50%)',
          border: `1px solid ${active.lvl.c}44`,
          color: DS.text,
          fontSize: 12,
          fontFamily: DS.mono,
          whiteSpace: 'nowrap',
          padding: '8px 14px',
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          <div style={{ fontSize: 9, fontFamily: DS.display, color: DS.text3,
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
            {zoneFamily(active.lvl.k)}
          </div>
          <div style={{ fontWeight: 700, color: active.lvl.c, marginBottom: 2 }}>{active.lvl.l}</div>
          <div style={{ color: DS.text2 }}>{`$${fK(active.lvl.v)} — $${fK(active.next.v)}`}</div>
          <div style={{ fontSize: 10, color: DS.accent, marginTop: 4 }}>
            {price > active.lvl.v
              ? `Spot +${((price - active.lvl.v) / active.lvl.v * 100).toFixed(0)}%`
              : `Spot ${((price - active.lvl.v) / active.lvl.v * 100).toFixed(0)}%`}
          </div>
        </div>
      )}

      {/* Micro-legend */}
      <div style={{
        display: 'flex', gap: 16,
        padding: '4px 0 0',
        fontSize: 9, fontFamily: DS.display,
        color: DS.text3, letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>
        {[
          { label: 'Floor', color: '#a78bfa' },
          { label: 'Cycle', color: '#60a5fa' },
          { label: 'Top', color: DS.down },
        ].map(z => (
          <span key={z.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: z.color, display: 'inline-block' }} />
            {z.label}
          </span>
        ))}
      </div>
    </div>
  );
}

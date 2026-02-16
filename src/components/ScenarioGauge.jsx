import React from 'react';
import { DS } from '../config/design';
import { fP } from '../utils/format';

function parseRange(bottomStr) {
  const nums = bottomStr.replace(/[~$,]/g, '').split('-').map(Number);
  return nums.length === 2 ? nums : [nums[0], nums[0]];
}

export default function ScenarioGauge({ scenarios, currentPrice, mob }) {
  if (!scenarios || !scenarios.length) return null;

  const W = 800, H = 150;
  const axisMin = 25000, axisMax = 130000;
  const padL = 30, padR = 30, usable = W - padL - padR;

  const x = (val) => ((val - axisMin) / (axisMax - axisMin)) * usable + padL;

  const barY = 55, barH = 42;

  const parsed = scenarios.map(s => ({
    ...s,
    range: parseRange(s.bottom),
  }));

  const consLo = 40000, consHi = 52000;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      <defs>
        <filter id="glowLimeSG" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Axis line */}
      <line x1={padL} y1={barY + barH + 5} x2={W - padR} y2={barY + barH + 5}
        stroke={DS.text3} strokeWidth={1} opacity={0.25} />

      {/* Axis ticks */}
      {[25, 50, 75, 100, 125].map(k => (
        <g key={k}>
          <line x1={x(k * 1000)} y1={barY + barH + 2} x2={x(k * 1000)} y2={barY + barH + 8}
            stroke={DS.text3} strokeWidth={1} opacity={0.3} />
          <text x={x(k * 1000)} y={barY + barH + 20} textAnchor="middle"
            style={{ fontSize: 10, fontFamily: DS.mono, fill: DS.text3 }}>
            {`$${k}K`}
          </text>
        </g>
      ))}

      {/* Scenario zones */}
      {parsed.map((s, i) => {
        const [lo, hi] = s.range;
        const x1 = x(lo), x2 = x(hi);
        const labelY = barY - 8 - (i % 2 === 0 ? 0 : 14);

        return (
          <g key={s.id}>
            <rect x={x1} y={barY} width={x2 - x1} height={barH}
              fill={s.color} opacity={0.2} rx={2} />
            <line x1={x1} y1={barY} x2={x1} y2={barY + barH}
              stroke={s.color} strokeWidth={1.5} opacity={0.6} />
            <line x1={x2} y1={barY} x2={x2} y2={barY + barH}
              stroke={s.color} strokeWidth={1.5} opacity={0.6} />
            <text x={(x1 + x2) / 2} y={labelY} textAnchor="middle"
              style={{ fontSize: mob ? 9 : 11, fontFamily: DS.display, fill: s.color, fontWeight: 600, letterSpacing: '0.02em' }}>
              {s.label}
            </text>
            <text x={(x1 + x2) / 2} y={barY + barH + 34} textAnchor="middle"
              style={{ fontSize: 10, fontFamily: DS.mono, fill: DS.text3, fontWeight: 500 }}>
              {s.drawdown}
            </text>
          </g>
        );
      })}

      {/* Consensus bracket */}
      {(() => {
        const cx1 = x(consLo), cx2 = x(consHi);
        return (
          <g>
            <rect x={cx1} y={barY - 3} width={cx2 - cx1} height={barH + 6}
              fill="none" stroke={DS.gold} strokeWidth={1.5} strokeDasharray="5 3" rx={3} />
            <text x={(cx1 + cx2) / 2} y={barY + barH / 2 + 4} textAnchor="middle"
              style={{ fontSize: 11, fontFamily: DS.display, fill: DS.gold, fontWeight: 700, letterSpacing: '0.08em' }}>
              CONSENSUS
            </text>
          </g>
        );
      })()}

      {/* Current price marker with glow */}
      {currentPrice && (() => {
        const px = x(currentPrice);
        const clampedX = Math.max(padL, Math.min(W - padR, px));
        return (
          <g filter="url(#glowLimeSG)">
            <line x1={clampedX} y1={barY - 10} x2={clampedX} y2={barY + barH + 5}
              stroke={DS.accent} strokeWidth={2.5} />
            <circle cx={clampedX} cy={barY - 10} r={5} fill={DS.accent} />
            <text x={clampedX} y={barY - 20} textAnchor="middle"
              style={{ fontSize: 13, fontFamily: DS.mono, fill: DS.accent, fontWeight: 700 }}>
              {`$${fP(currentPrice)}`}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

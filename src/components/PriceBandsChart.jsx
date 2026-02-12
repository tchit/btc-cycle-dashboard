import React from 'react';
import { DS } from '../config/design';
import { OCLEVELS } from '../config/constants';
import { fK } from '../utils/format';

export default function PriceBandsChart({ price, mob, levels }) {
  const W = mob ? 340 : 560, H = mob ? 150 : 180, PX = 50, PY = 14;
  const lvls = (levels || OCLEVELS).filter(l => l.v > 20000 && l.v < 130000);
  const mn = 25000, mx = 135000;
  const tY = (v) => PY + ((mx - v) / (mx - mn)) * (H - PY * 2);

  const pricePath = [
    { m: 0, v: 64000 }, { m: 1, v: 58000 }, { m: 2, v: 68000 }, { m: 3, v: 95000 },
    { m: 4, v: 108000 }, { m: 5, v: 126198 }, { m: 6, v: 110000 }, { m: 7, v: 98000 },
    { m: 8, v: 88000 }, { m: 9, v: 78000 }, { m: 10, v: 75000 }, { m: 11, v: price }
  ];
  const tX = (i) => PX + (i / (pricePath.length - 1)) * (W - PX * 2);
  const path = pricePath.map((p, i) => `${i ? 'L' : 'M'}${tX(i)},${tY(p.v)}`).join('');
  const months = ['Avr', 'Mai', 'Jun', 'Jul', 'Ao\u00fb', 'Sep', 'Oct', 'Nov', 'D\u00e9c', 'Jan', 'F\u00e9v', 'Mar'];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: mob ? 150 : 180 }}>
      <defs>
        <linearGradient id="prGrad" x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0%" stopColor={DS.accent} stopOpacity={0.15} />
          <stop offset="100%" stopColor={DS.accent} stopOpacity={0} />
        </linearGradient>
      </defs>
      {lvls.map(l => (
        <g key={l.k}>
          <line x1={PX} y1={tY(l.v)} x2={W - PX - 30} y2={tY(l.v)} stroke={l.c} strokeWidth={0.5} strokeDasharray="4,4" opacity={0.35} />
          <text x={W - PX - 28} y={tY(l.v) + 3} fill={l.c} fontSize={8} fontFamily={DS.mono} opacity={0.6}>{fK(l.v)}</text>
        </g>
      ))}
      <path d={`${path} L${tX(11)},${H - PY} L${tX(0)},${H - PY} Z`} fill="url(#prGrad)" />
      <path d={path} fill="none" stroke={DS.accent} strokeWidth={2.5} opacity={0.9} />
      <circle cx={tX(11)} cy={tY(price)} r={5} fill={DS.accent} />
      {pricePath.map((_, i) => i % 2 === 0 ? <text key={i} x={tX(i)} y={H - 2} fill={DS.text3} fontSize={8} textAnchor="middle" fontFamily={DS.mono}>{months[i]}</text> : null)}
      {[30, 50, 70, 90, 110, 130].map(v => <text key={v} x={PX - 6} y={tY(v * 1000) + 3} fill={DS.text3} fontSize={8} textAnchor="end" fontFamily={DS.mono}>{`${v}K`}</text>)}
    </svg>
  );
}

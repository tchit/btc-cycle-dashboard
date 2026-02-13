import React from 'react';
import { DS } from '../config/design';
import { RP as RP_CONST, CVDD as CVDD_CONST, W200 as W200_CONST } from '../config/constants';

export default function MonteCarloChart({ mc, price, mob, rp, w200, cvdd }) {
  if (!mc?.p50?.length) return null;
  const W = mob ? 340 : 700, H = mob ? 200 : 320, PX = 50, PY = 20;
  const n = mc.p50.length;
  const allVals = [...mc.p5, ...mc.p95];
  const mn = Math.min(...allVals) * 0.9, mx = Math.max(...allVals) * 1.05;
  const tX = (i) => PX + (i / (n - 1)) * (W - PX * 2);
  const tY = (v) => PY + ((mx - v) / (mx - mn)) * (H - PY * 2);

  const band = (upper, lower, color, opacity) => {
    const top = upper.map((v, i) => `${i ? 'L' : 'M'}${tX(i)},${tY(v)}`).join('');
    const bot = [...lower].reverse().map((v, i) => `L${tX(lower.length - 1 - i)},${tY(v)}`).join('');
    return <path d={`${top}${bot}Z`} fill={color} opacity={opacity} />;
  };

  const line = (vals, color, w, dash) => {
    const d = vals.map((v, i) => `${i ? 'L' : 'M'}${tX(i)},${tY(v)}`).join('');
    return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeDasharray={dash || 'none'} opacity={0.7} />;
  };

  const labels = [
    { v: rp || RP_CONST, l: 'RP', c: DS.purple },
    { v: cvdd || CVDD_CONST, l: 'CVDD', c: DS.pink },
    { v: w200 || W200_CONST, l: '200W', c: DS.blue }
  ].filter(l => l.v > mn && l.v < mx);

  const yTicks = [];
  const step = (mx - mn) / 5;
  for (let i = 0; i <= 5; i++) yTicks.push(mn + step * i);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: mob ? 200 : 320 }}>
      {yTicks.map((v, i) => <line key={'g'+i} x1={PX} y1={tY(v)} x2={W - PX} y2={tY(v)} stroke={DS.borderLight} strokeWidth={0.5} />)}
      {yTicks.map((v, i) => <text key={'yl'+i} x={PX - 5} y={tY(v) + 3} fill={DS.text3} fontSize={mob ? 8 : 9} textAnchor="end" fontFamily={DS.mono}>{'$' + Math.round(v/1000) + 'K'}</text>)}
      {band(mc.p95, mc.p5, DS.accent, 0.06)}
      {band(mc.p75, mc.p25, DS.accent, 0.1)}
      {line(mc.p50, DS.accent, 2.5)}
      {line(mc.p5, DS.down, 1.5, '4,4')}
      {line(mc.p95, DS.up, 1.5, '4,4')}
      <text x={W - PX + 4} y={tY(mc.p95[mc.p95.length-1]) - 4} fill={DS.up} fontSize={mob ? 7 : 8} fontFamily={DS.mono} fontWeight={600}>P95</text>
      <text x={W - PX + 4} y={tY(mc.p95[mc.p95.length-1]) + 7} fill={DS.up} fontSize={mob ? 7 : 9} fontFamily={DS.mono} opacity={0.8}>{'$' + Math.round(mc.p95[mc.p95.length-1]/1000) + 'K'}</text>
      <text x={W - PX + 4} y={tY(mc.p75[mc.p75.length-1]) - 4} fill={DS.accent} fontSize={mob ? 7 : 8} fontFamily={DS.mono} opacity={0.7}>P75</text>
      <text x={W - PX + 4} y={tY(mc.p75[mc.p75.length-1]) + 7} fill={DS.accent} fontSize={mob ? 7 : 9} fontFamily={DS.mono} opacity={0.7}>{'$' + Math.round(mc.p75[mc.p75.length-1]/1000) + 'K'}</text>
      <text x={W - PX + 4} y={tY(mc.p50[mc.p50.length-1]) - 4} fill={DS.accent} fontSize={mob ? 7 : 8} fontFamily={DS.mono} fontWeight={600}>P50</text>
      <text x={W - PX + 4} y={tY(mc.p50[mc.p50.length-1]) + 7} fill={DS.accent} fontSize={mob ? 7 : 9} fontFamily={DS.mono} fontWeight={600}>{'$' + Math.round(mc.p50[mc.p50.length-1]/1000) + 'K'}</text>
      <text x={W - PX + 4} y={tY(mc.p25[mc.p25.length-1]) - 4} fill={DS.accent} fontSize={mob ? 7 : 8} fontFamily={DS.mono} opacity={0.7}>P25</text>
      <text x={W - PX + 4} y={tY(mc.p25[mc.p25.length-1]) + 7} fill={DS.accent} fontSize={mob ? 7 : 9} fontFamily={DS.mono} opacity={0.7}>{'$' + Math.round(mc.p25[mc.p25.length-1]/1000) + 'K'}</text>
      <text x={W - PX + 4} y={tY(mc.p5[mc.p5.length-1]) - 4} fill={DS.down} fontSize={mob ? 7 : 8} fontFamily={DS.mono} fontWeight={600}>P5</text>
      <text x={W - PX + 4} y={tY(mc.p5[mc.p5.length-1]) + 7} fill={DS.down} fontSize={mob ? 7 : 9} fontFamily={DS.mono} opacity={0.8}>{'$' + Math.round(mc.p5[mc.p5.length-1]/1000) + 'K'}</text>
      {labels.map(l => (
        <g key={l.l}>
          <line x1={PX} y1={tY(l.v)} x2={W - PX} y2={tY(l.v)} stroke={l.c} strokeWidth={0.7} strokeDasharray="5,4" opacity={0.4} />
          <text x={PX - 3} y={tY(l.v) + 3} fill={l.c} fontSize={mob ? 8 : 9} textAnchor="end" fontFamily={DS.mono} opacity={0.7}>{l.l}</text>
        </g>
      ))}
      <circle cx={tX(0)} cy={tY(price)} r={5} fill={DS.accent} opacity={0.9} />
      <text x={tX(0) + 8} y={tY(price) + 3} fill={DS.accent} fontSize={mob ? 8 : 9} fontFamily={DS.mono} fontWeight={600}>{'$' + Math.round(price/1000) + 'K'}</text>
      {[0, 13, 26, 39, 52].map(w => <text key={w} x={tX(w)} y={H - 3} fill={DS.text3} fontSize={mob ? 8 : 10} textAnchor="middle" fontFamily={DS.mono}>{w === 0 ? 'Now' : `${w}w`}</text>)}
    </svg>
  );
}

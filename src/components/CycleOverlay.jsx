import React from 'react';
import { DS } from '../config/design';

export default function CycleOverlay({ cycleDay, mob }) {
  const W = mob ? 340 : 560, H = mob ? 140 : 165, PX = 35, PY = 14;
  const cycleData = [
    { name: 'C1 2012', c: '#6366f180', pts: [[0, 100], [180, 300], [367, 980], [544, 127]] },
    { name: 'C2 2016', c: '#fbbf2480', pts: [[0, 100], [200, 170], [526, 2960], [730, 470]] },
    { name: 'C3 2020', c: '#f472b680', pts: [[0, 100], [200, 180], [546, 690], [895, 155]] },
    { name: 'C4 Now', c: DS.accent, pts: [[0, 100], [200, 175], [535, 380]] }
  ];
  const maxDay = 1000, maxGain = 500;
  const tX = (d) => PX + (d / maxDay) * (W - PX * 2);
  const tY = (v) => PY + ((maxGain - Math.min(v, maxGain)) / maxGain) * (H - PY * 2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: mob ? 140 : 165 }}>
      <line x1={tX(cycleDay)} y1={PY} x2={tX(cycleDay)} y2={H - PY} stroke={DS.accent} strokeWidth={1} strokeDasharray="3,3" opacity={0.35} />
      <text x={tX(cycleDay)} y={PY - 4} fill={DS.accent} fontSize={8} textAnchor="middle" fontFamily={DS.mono} opacity={0.7}>{`J${cycleDay}`}</text>
      {[0, 200, 400, 600, 800, 1000].map(d => <text key={d} x={tX(d)} y={H - 2} fill={DS.text3} fontSize={7} textAnchor="middle" fontFamily={DS.mono}>{`J${d}`}</text>)}
      {[100, 200, 300, 400, 500].map(v => (
        <g key={v}>
          <line x1={PX} y1={tY(v)} x2={W - PX} y2={tY(v)} stroke={DS.border} strokeWidth={0.5} />
          <text x={PX - 4} y={tY(v) + 3} fill={DS.text3} fontSize={7} textAnchor="end" fontFamily={DS.mono}>{`${v}%`}</text>
        </g>
      ))}
      {cycleData.map((c, ci) => {
        const d = c.pts.map((pt, i) => `${i ? 'L' : 'M'}${tX(pt[0])},${tY(pt[1])}`).join('');
        return <path key={ci} d={d} fill="none" stroke={c.c} strokeWidth={ci === 3 ? 2.5 : 1.5} strokeLinecap="round" />;
      })}
      {cycleData.map((c, i) => (
        <g key={`l${i}`}>
          <rect x={W - PX - 60} y={PY + i * 14} width={10} height={2} rx={1} fill={c.c} />
          <text x={W - PX - 46} y={PY + i * 14 + 3} fill={DS.text2} fontSize={8} fontFamily={DS.mono}>{c.name}</text>
        </g>
      ))}
    </svg>
  );
}

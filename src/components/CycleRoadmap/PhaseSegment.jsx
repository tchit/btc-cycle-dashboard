import React from 'react';
import { DS } from '../../config/design';

export default function PhaseSegment({ name, startPct, endPct, color, isActive, isFuture, x, barY, barH, mob, filterId }) {
  const x1 = x(startPct);
  const x2 = x(endPct);
  const width = x2 - x1;
  const midX = x1 + width / 2;
  const midY = barY + barH / 2;
  const fontSize = mob ? 8 : 10;

  return (
    <g className="phase-segment" opacity={isFuture ? 0.15 : 1}>
      <rect
        x={x1}
        y={barY}
        width={width}
        height={barH}
        rx={6}
        fill={color}
        filter={isActive ? `url(#${filterId})` : undefined}
      />
      <text
        x={midX}
        y={midY + fontSize * 0.35}
        textAnchor="middle"
        style={{
          fontSize,
          fontFamily: DS.display,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fill: isFuture ? color : DS.bg,
          pointerEvents: 'none',
        }}
      >
        {name}
      </text>
    </g>
  );
}

import React from 'react';
import { DS } from '../../config/design';

export default function CountdownBadge({ daysRange, targetLabel, startPct, endPct, x, barY, mob }) {
  if (!daysRange || daysRange[0] <= 0) return null;

  const x1 = x(startPct);
  const x2 = x(endPct);
  const midX = (x1 + x2) / 2;
  const bracketY = barY - 8;

  const badgeText = `${daysRange[0]}-${daysRange[1]}d to ${targetLabel}`;
  const charWidth = mob ? 6 : 7;
  const textWidth = badgeText.length * charWidth;
  const padX = 10;
  const badgeW = textWidth + padX * 2;
  const badgeH = 20;
  const badgeX = midX - badgeW / 2;
  const badgeY = bracketY - 28;

  return (
    <g>
      {/* Dashed bracket: left vertical */}
      <line
        x1={x1} y1={bracketY}
        x2={x1} y2={bracketY - 6}
        stroke={DS.down}
        strokeWidth={1}
        strokeDasharray="3,2"
        opacity={0.5}
      />

      {/* Dashed bracket: horizontal connector */}
      <line
        x1={x1} y1={bracketY - 6}
        x2={x2} y2={bracketY - 6}
        stroke={DS.down}
        strokeWidth={1}
        strokeDasharray="3,2"
        opacity={0.5}
      />

      {/* Dashed bracket: right vertical */}
      <line
        x1={x2} y1={bracketY}
        x2={x2} y2={bracketY - 6}
        stroke={DS.down}
        strokeWidth={1}
        strokeDasharray="3,2"
        opacity={0.5}
      />

      {/* Badge background */}
      <rect
        x={badgeX}
        y={badgeY}
        width={badgeW}
        height={badgeH}
        rx={4}
        fill="rgba(255, 0, 60, 0.08)"
        stroke="rgba(255, 0, 60, 0.25)"
        strokeWidth={1}
      />

      {/* Badge text */}
      <text
        x={midX}
        y={badgeY + badgeH / 2 + (mob ? 3 : 4)}
        textAnchor="middle"
        style={{
          fontSize: mob ? 9 : 10,
          fontFamily: DS.mono,
          fontWeight: 700,
          fill: DS.down,
        }}
      >
        {badgeText}
      </text>
    </g>
  );
}

import React from 'react';
import { DS } from '../../config/design';

export default function MilestoneNode({ positionPct, label, date, price, isReached, x, barY, barH, mob, index, mounted }) {
  const cx = x(positionPct);
  const circleR = mob ? 4 : 5;
  const circleY = barY + barH + 2;
  const lineTop = circleY + circleR + 2;
  const lineBottom = lineTop + 20;
  const labelBaseY = lineBottom + 4;

  return (
    <g style={{ opacity: mounted ? 1 : 0, transition: `opacity 0.4s ease ${0.5 + index * 0.1}s` }}>
      {/* Milestone circle */}
      <circle
        cx={cx}
        cy={circleY}
        r={circleR}
        fill={isReached ? DS.up : 'none'}
        stroke={isReached ? DS.up : DS.text3}
        strokeWidth={1.5}
      />

      {/* Vertical dashed connector */}
      <line
        x1={cx}
        y1={lineTop}
        x2={cx}
        y2={lineBottom}
        stroke={isReached ? DS.text2 : DS.text3}
        strokeWidth={1}
        strokeDasharray="3,3"
        opacity={isReached ? 0.6 : 0.3}
      />

      {/* Label: name */}
      <text
        x={cx}
        y={labelBaseY + (mob ? 10 : 12)}
        textAnchor="middle"
        style={{
          fontSize: mob ? 9 : 11,
          fontFamily: DS.display,
          fontWeight: 600,
          fill: isReached ? DS.text : DS.text3,
        }}
      >
        {label}
      </text>

      {/* Label: date */}
      <text
        x={cx}
        y={labelBaseY + (mob ? 21 : 24)}
        textAnchor="middle"
        style={{
          fontSize: mob ? 8 : 10,
          fontFamily: DS.mono,
          fill: DS.text3,
        }}
      >
        {date}
      </text>

      {/* Label: price (if provided) */}
      {price != null && (
        <text
          x={cx}
          y={labelBaseY + (mob ? 32 : 37)}
          textAnchor="middle"
          style={{
            fontSize: mob ? 9 : 11,
            fontFamily: DS.mono,
            fontWeight: 700,
            fill: isReached ? DS.up : DS.text3,
          }}
        >
          {typeof price === 'number' ? `$${price.toLocaleString()}` : price}
        </text>
      )}
    </g>
  );
}

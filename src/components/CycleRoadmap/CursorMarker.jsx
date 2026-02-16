import React from 'react';
import { DS } from '../../config/design';

export default function CursorMarker({ positionPct, x, trackY, barH, mob }) {
  const cx = x(positionPct);
  const cy = trackY + barH / 2;
  const r = mob ? 6 : 8;

  return (
    <g>
      {/* Vertical dashed line from top to cursor */}
      <line
        x1={cx} y1={trackY - 4}
        x2={cx} y2={cy - r - 2}
        stroke={DS.warn}
        strokeWidth={1}
        strokeDasharray="4,3"
        opacity={0.5}
      />

      {/* Outer pulse ring — SVG <animate> for reliable cross-browser */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={DS.warn}
        strokeWidth={1.5}
        opacity={0}
      >
        <animate attributeName="r" from={r} to={r * 3} dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Main cursor dot */}
      <circle
        cx={cx} cy={cy} r={r}
        fill={DS.warn}
        filter="url(#cursorGlow)"
      />

      {/* Inner highlight */}
      <circle
        cx={cx} cy={cy} r={r * 0.35}
        fill={DS.text}
        opacity={0.6}
      />
    </g>
  );
}

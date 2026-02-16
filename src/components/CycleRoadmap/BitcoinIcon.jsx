import React from 'react';
import { DS } from '../../config/design';

export default function BitcoinIcon({ size = 48, x, y, mounted }) {
  // Bitcoin "B" symbol with vertical bars — clean SVG path in a 24x24 viewBox
  const pathD = 'M10 2v2M14 2v2M10 20v2M14 20v2M8 4h5c2.2 0 4 1.8 4 4s-1.8 4-4 4H8V4zM8 12h6c2.2 0 4 1.8 4 4s-1.8 4-4 4H8v-8z';

  // Approximate total path length for stroke-draw animation
  const totalLength = 120;

  const inner = (
    <path
      d={pathD}
      fill="none"
      stroke={DS.warn}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="bitcoin-icon-path"
      strokeDasharray={totalLength}
      strokeDashoffset={mounted ? 0 : totalLength}
      style={{
        transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    />
  );

  // Embedded mode: render as <g> positioned inside a parent SVG
  if (x !== undefined && y !== undefined) {
    return (
      <g transform={`translate(${x - size / 2}, ${y - size / 2})`}>
        <svg width={size} height={size} viewBox="0 0 24 24">
          {inner}
        </svg>
      </g>
    );
  }

  // Standalone mode: self-contained <svg>
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {inner}
    </svg>
  );
}

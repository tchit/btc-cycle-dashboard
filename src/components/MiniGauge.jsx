import React from 'react';
import { rainbowAt } from '../utils/color';

export default function MiniGauge({ value, label, icon, mob }) {
  const col = rainbowAt(value);
  return (
    <div className="mini-gauge">
      <div className="mini-gauge-label">{icon} {label}</div>
      <div className="mini-gauge-value" style={{ color: col }}>{value}</div>
    </div>
  );
}

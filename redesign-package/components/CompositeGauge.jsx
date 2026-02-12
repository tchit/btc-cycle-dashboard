import React, { useRef, useEffect } from 'react';
import { DS } from '../config/design';

export default function CompositeGauge({ value, mob }) {
  const sz = mob ? 180 : 220;
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const w = sz, h = sz * 0.58;
    cv.width = w * 2;
    cv.height = h * 2;
    ctx.scale(2, 2);
    const cx = w / 2, cy = h - 6, r = sz * 0.38, lw = mob ? 16 : 20;

    ctx.lineWidth = lw;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = '#E4E7EC';
    ctx.stroke();

    const activeEnd = Math.PI + (value / 100) * Math.PI;
    for (let i = 0; i < 120; i++) {
      const t = i / 120;
      const sa = Math.PI + t * Math.PI;
      const ea = Math.PI + ((i + 1) / 120) * Math.PI;
      if (sa > activeEnd) break;
      const end = Math.min(ea, activeEnd);
      const hue = 210 - t * 210;
      ctx.beginPath();
      ctx.arc(cx, cy, r, sa, end + 0.02);
      ctx.strokeStyle = `hsl(${hue}, 80%, 55%)`;
      ctx.stroke();
    }

    const na = Math.PI + (value / 100) * Math.PI;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(na) * (r - lw - 8), cy + Math.sin(na) * (r - lw - 8));
    ctx.strokeStyle = DS.text;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = DS.text;
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const a = Math.PI + (i / 10) * Math.PI;
      const len = i % 5 === 0 ? 8 : 4;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (r + lw / 2 + 2), cy + Math.sin(a) * (r + lw / 2 + 2));
      ctx.lineTo(cx + Math.cos(a) * (r + lw / 2 + 2 + len), cy + Math.sin(a) * (r + lw / 2 + 2 + len));
      ctx.strokeStyle = DS.text;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, [value, sz, mob]);

  const zoneLabel = value < 15 ? 'CAPITULATION' : value < 30 ? 'FEAR EXTR\u00caME' : value < 45 ? 'BEAR' : value < 55 ? 'NEUTRE' : value < 70 ? 'OPTIMISME' : value < 85 ? 'EUPHORIE' : 'BULLE';
  const hue = 210 - (value / 100) * 210;
  const col = `hsl(${hue}, 80%, 50%)`;

  return (
    <div className="gauge-container">
      <div className="gauge-label">COMPOSITE SCORE</div>
      <canvas ref={ref} style={{ width: sz, height: sz * 0.58 }} />
      <div className="gauge-value" style={{ color: col }}>{value}</div>
      <div className="gauge-zone" style={{ color: col }}>{zoneLabel}</div>
    </div>
  );
}

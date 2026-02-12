import React, { useRef, useEffect } from 'react';
import { DS } from '../config/design';
import { MC, RP as RP_CONST, W200 as W200_CONST, CVDD, STHRP, LTHRP } from '../config/constants';
import { fK } from '../utils/format';

export default function MiningMarginChart({ price, mob, rp, sthRp, lthRp, w200 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const W = c.offsetWidth, H = mob ? 160 : 180;
    c.width = W * dpr; c.height = H * dpr;
    const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
    const pad = { t: 24, b: 24, l: 60, r: 20 }, cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    const levels = [
      { v: lthRp || LTHRP, l: 'LTH-RP', c: DS.up },
      { v: CVDD, l: 'CVDD', c: '#f472b6' },
      { v: rp || RP_CONST, l: 'RP', c: '#a78bfa' },
      { v: w200 || W200_CONST, l: '200W', c: '#60a5fa' },
      { v: MC, l: 'MC', c: DS.warn },
      { v: sthRp || STHRP, l: 'STH-RP', c: DS.accent },
      { v: price, l: 'Prix', c: DS.accent }
    ].sort((a, b) => a.v - b.v);
    const mn = Math.min(...levels.map(l => l.v)) * 0.9, mx = Math.max(...levels.map(l => l.v)) * 1.08;
    const y = v => pad.t + ((mx - v) / (mx - mn)) * ch;
    ctx.fillStyle = DS.surface; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = price > MC ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)';
    ctx.fillRect(pad.l, Math.min(y(MC), y(price)), cw, Math.abs(y(MC) - y(price)));
    levels.forEach(l => {
      const yy = y(l.v), isPr = l.v === price;
      ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(pad.l + cw, yy);
      ctx.strokeStyle = l.c; ctx.lineWidth = isPr ? 2.5 : 1;
      ctx.setLineDash(isPr ? [] : [4, 4]); ctx.globalAlpha = isPr ? 1 : 0.5;
      ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.fillStyle = l.c; ctx.font = `${isPr ? 'bold 11' : '10'}px ${DS.mono}`;
      ctx.textAlign = 'right'; ctx.fillText(`${l.l} $${fK(l.v)}`, pad.l - 6, yy + 3);
      if (isPr) { ctx.beginPath(); ctx.arc(pad.l + cw, yy, 5, 0, Math.PI * 2); ctx.fillStyle = l.c; ctx.fill(); }
    });
    const margin = ((price - MC) / MC * 100);
    ctx.fillStyle = margin > 0 ? DS.up : DS.down; ctx.font = `bold 13px ${DS.font}`; ctx.textAlign = 'center';
    ctx.fillText(`Marge: ${margin > 0 ? '+' : ''}${margin.toFixed(1)}%`, pad.l + cw / 2, H - 4);
  }, [price, mob, rp, sthRp, lthRp, w200]);

  return <canvas ref={ref} style={{ width: '100%', height: mob ? 160 : 180 }} />;
}

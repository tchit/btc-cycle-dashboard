import React, { useRef, useEffect } from 'react';
import { DS } from '../config/design';

export default function FundingRateChart({ fundingRate, fundingHistory, mob }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const W = c.offsetWidth, H = mob ? 180 : 210;
    c.width = W * dpr; c.height = H * dpr;
    const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
    const pad = { t: 30, b: 30, l: 55, r: 20 }, cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;

    const data = fundingHistory && fundingHistory.length > 1
      ? fundingHistory.map(h => h.rate)
      : [fundingRate];
    const n = data.length;

    const mn = Math.min(...data, -0.05), mx = Math.max(...data, 0.05), range = mx - mn;
    const x = i => pad.l + (i / (n - 1)) * cw;
    const y = v => pad.t + ((mx - v) / range) * ch;
    const zeroY = y(0);

    ctx.fillStyle = DS.borderLight; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = DS.surface; ctx.beginPath(); ctx.roundRect(pad.l - 4, pad.t - 4, cw + 8, ch + 8, 6); ctx.fill();

    ctx.beginPath(); ctx.moveTo(pad.l, zeroY); ctx.lineTo(pad.l + cw, zeroY);
    ctx.strokeStyle = DS.text3; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);

    const barW = Math.max(1.5, (cw / n) - 0.5);
    data.forEach((v, i) => {
      const bx = x(i) - barW / 2;
      const top = Math.min(zeroY, y(v));
      const h = Math.abs(y(v) - zeroY);
      ctx.fillStyle = v < 0 ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.5)';
      ctx.beginPath(); ctx.roundRect(bx, top, barW, Math.max(1, h), 1); ctx.fill();
    });

    ctx.beginPath(); ctx.arc(x(n - 1), y(data[n - 1]), 5, 0, Math.PI * 2);
    ctx.fillStyle = data[n - 1] < 0 ? DS.up : DS.down; ctx.fill();
    ctx.strokeStyle = DS.surface; ctx.lineWidth = 2; ctx.stroke();

    ctx.fillStyle = DS.text3; ctx.font = `10px ${DS.mono}`; ctx.textAlign = 'right';
    [mx, mx / 2, 0, mn / 2, mn].forEach(v => ctx.fillText(`${v.toFixed(3)}%`, pad.l - 6, y(v) + 3));

    ctx.textAlign = 'center';
    if (fundingHistory && fundingHistory.length > 1) {
      const labelCount = 5;
      for (let i = 0; i < labelCount; i++) {
        const idx = Math.round(i * (n - 1) / (labelCount - 1));
        const d = new Date(fundingHistory[idx].ts);
        const label = i === labelCount - 1 ? 'Auj.' : `${d.getDate()}/${d.getMonth() + 1}`;
        ctx.fillText(label, x(idx), H - pad.b + 16);
      }
    } else {
      ['60j', '45j', '30j', '15j', 'Auj.'].forEach((l, i) => ctx.fillText(l, pad.l + (i / 4) * cw, H - pad.b + 16));
    }

    ctx.fillStyle = DS.text; ctx.font = `bold 11px ${DS.font}`; ctx.textAlign = 'left';
    ctx.fillText(fundingHistory?.length > 1 ? `Funding Rate \u2014 ${n} points (live)` : 'Funding Rate', pad.l, pad.t - 12);
    ctx.fillStyle = fundingRate < 0 ? DS.up : DS.down; ctx.font = `bold 11px ${DS.mono}`; ctx.textAlign = 'right';
    ctx.fillText(`${fundingRate.toFixed(4)}%`, pad.l + cw, pad.t - 12);
  }, [fundingRate, fundingHistory, mob]);

  return <canvas ref={ref} style={{ width: '100%', height: mob ? 180 : 210 }} />;
}

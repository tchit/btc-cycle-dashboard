import React, { useRef, useEffect } from 'react';
import { DS } from '../config/design';
import { OCLEVELS } from '../config/constants';
import { fK } from '../utils/format';

export default function PriceBandsChartV2({ price, mob, levels, histPrices }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const W = c.offsetWidth, H = mob ? 280 : 340;
    c.width = W * dpr; c.height = H * dpr;
    const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
    const pad = { t: 30, b: 40, l: 60, r: 30 }, cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;

    // Build pricePath from real historical data (last 12 months, 1 point per month)
    let pricePath;
    if (histPrices && histPrices.length > 30) {
      const now = Date.now();
      const monthNames = ['Jan', 'F\u00e9v', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Ao\u00fb', 'Sep', 'Oct', 'Nov', 'D\u00e9c'];
      const monthly = [];
      for (let m = 11; m >= 0; m--) {
        const targetTs = now - m * 30.44 * 86400000;
        let closest = histPrices[0];
        let minDiff = Math.abs(histPrices[0].ts - targetTs);
        for (let j = 1; j < histPrices.length; j++) {
          const diff = Math.abs(histPrices[j].ts - targetTs);
          if (diff < minDiff) { minDiff = diff; closest = histPrices[j]; }
        }
        const d = new Date(closest.ts || closest.date);
        monthly.push({ m: monthNames[d.getMonth()], v: m === 0 ? price : closest.price });
      }
      pricePath = monthly;
    } else {
      const monthNames = ['Jan', 'F\u00e9v', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Ao\u00fb', 'Sep', 'Oct', 'Nov', 'D\u00e9c'];
      const now = new Date();
      pricePath = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now); d.setMonth(d.getMonth() - i);
        pricePath.push({ m: monthNames[d.getMonth()], v: price });
      }
    }

    const lvls = (levels || OCLEVELS).filter(l => l.v > 20000 && l.v < 200000);
    const allVals = [...pricePath.map(p => p.v), ...lvls.map(l => l.v)];
    const mn = Math.min(...allVals) * 0.88, mx = Math.max(...allVals) * 1.06;
    const x = i => pad.l + (i / (pricePath.length - 1)) * cw;
    const y = v => pad.t + ((mx - v) / (mx - mn)) * ch;

    ctx.fillStyle = DS.surface; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = DS.borderLight; ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const yy = pad.t + (i / 5) * ch;
      ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(pad.l + cw, yy); ctx.stroke();
      ctx.fillStyle = DS.text3; ctx.font = `10px ${DS.mono}`; ctx.textAlign = 'right';
      ctx.fillText(`$${((mx - (i / 5) * (mx - mn)) / 1000).toFixed(0)}K`, pad.l - 8, yy + 3);
    }

    // Level bands
    const sortedLvls = [...lvls].sort((a, b) => b.v - a.v);
    for (let i = 0; i < sortedLvls.length - 1; i++) {
      ctx.fillStyle = sortedLvls[i].c + '08';
      ctx.fillRect(pad.l, y(sortedLvls[i].v), cw, y(sortedLvls[i + 1].v) - y(sortedLvls[i].v));
    }

    // Level lines
    lvls.forEach(l => {
      const yy = y(l.v);
      ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(pad.l + cw, yy);
      ctx.strokeStyle = l.c; ctx.lineWidth = 1; ctx.setLineDash([6, 4]); ctx.globalAlpha = 0.5;
      ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.fillStyle = l.c; ctx.font = `bold 9px ${DS.mono}`; ctx.textAlign = 'right';
      ctx.fillText(`$${(l.v / 1000).toFixed(0)}K`, pad.l + cw - 4, yy - 5);
    });

    // Price area gradient
    const grad = ctx.createLinearGradient(0, y(mx), 0, y(mn));
    grad.addColorStop(0, 'rgba(249,115,22,0.15)'); grad.addColorStop(1, 'rgba(249,115,22,0)');
    ctx.beginPath();
    pricePath.forEach((p, i) => { i === 0 ? ctx.moveTo(x(i), y(p.v)) : ctx.lineTo(x(i), y(p.v)); });
    ctx.lineTo(x(pricePath.length - 1), pad.t + ch); ctx.lineTo(x(0), pad.t + ch);
    ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

    // Price line
    ctx.beginPath();
    pricePath.forEach((p, i) => { i === 0 ? ctx.moveTo(x(i), y(p.v)) : ctx.lineTo(x(i), y(p.v)); });
    ctx.strokeStyle = DS.accent; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.stroke();

    // Dots
    pricePath.forEach((p, i) => {
      const isLast = i === pricePath.length - 1;
      ctx.beginPath(); ctx.arc(x(i), y(p.v), isLast ? 6 : 3, 0, Math.PI * 2);
      ctx.fillStyle = isLast ? DS.accent : DS.surface; ctx.fill();
      if (!isLast) { ctx.strokeStyle = DS.accent; ctx.lineWidth = 1.5; ctx.stroke(); }
    });

    // Price label
    const lastX = x(pricePath.length - 1), lastYY = y(price);
    ctx.fillStyle = DS.accent; ctx.beginPath(); ctx.roundRect(lastX - 32, lastYY - 24, 64, 18, 9); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = `bold 10px ${DS.mono}`; ctx.textAlign = 'center';
    ctx.fillText(`$${fK(price)}`, lastX, lastYY - 12);

    // X-axis labels
    ctx.fillStyle = DS.text3; ctx.font = `10px ${DS.mono}`; ctx.textAlign = 'center';
    pricePath.forEach((p, i) => { if (i % 2 === 0 || i === pricePath.length - 1) ctx.fillText(p.m, x(i), H - pad.b + 16); });

    // Title
    ctx.fillStyle = DS.text; ctx.font = `bold 12px ${DS.font}`; ctx.textAlign = 'left';
    ctx.fillText(histPrices ? 'Prix vs Niveaux Cl\u00e9s \u2014 12 mois (live)' : 'Prix vs Niveaux Cl\u00e9s \u2014 12 mois', pad.l, pad.t - 12);
  }, [price, mob, levels, histPrices]);

  const lvls2 = (levels || OCLEVELS).filter(l => l.v > 20000 && l.v < 200000);

  return (
    <div>
      <canvas ref={ref} style={{ width: '100%', height: mob ? 280 : 340 }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10, padding: '0 4px' }}>
        {lvls2.map(l => (
          <div key={l.k} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: l.c + '10', fontSize: 11, fontFamily: DS.font, whiteSpace: 'nowrap' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.c, flexShrink: 0 }} />
            <span style={{ fontWeight: 600, color: l.c }}>{l.l}</span>
            <span style={{ color: DS.text3, fontFamily: DS.mono, fontSize: 10 }}>{`$${fK(l.v)}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useRef, useEffect } from 'react';
import { DS } from '../config/design';
import { OCLEVELS } from '../config/constants';
import { fK } from '../utils/format';

export default function PriceBandsChartV3({ price, mob, levels, histPrices }) {
  const ref = useRef(null);
  const lvls = (levels || OCLEVELS).filter(l => l.v > 20000 && l.v < 200000);
  const resistances = lvls.filter(l => l.v > price).sort((a, b) => a.v - b.v);
  const supports = lvls.filter(l => l.v <= price).sort((a, b) => b.v - a.v);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const W = c.offsetWidth, H = mob ? 280 : 340;
    c.width = W * dpr; c.height = H * dpr;
    const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
    const pad = { t: 16, b: 32, l: 50, r: 16 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;

    // Build pricePath from real historical data (last 12 months, 1 point per month)
    let pricePath;
    if (histPrices && histPrices.length > 30) {
      const now = Date.now();
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const monthly = [];
      for (let m = 11; m >= 0; m--) {
        const targetTs = now - m * 30.44 * 86400000;
        let closest = histPrices[0], minDiff = Math.abs(histPrices[0].ts - targetTs);
        for (let j = 1; j < histPrices.length; j++) {
          const diff = Math.abs(histPrices[j].ts - targetTs);
          if (diff < minDiff) { minDiff = diff; closest = histPrices[j]; }
        }
        const d = new Date(closest.ts || closest.date);
        monthly.push({ m: monthNames[d.getMonth()], v: m === 0 ? price : closest.price });
      }
      pricePath = monthly;
    } else {
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const now = new Date();
      pricePath = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now); d.setMonth(d.getMonth() - i);
        pricePath.push({ m: monthNames[d.getMonth()], v: price });
      }
    }

    const allVals = pricePath.map(p => p.v);
    const mn = Math.min(...allVals) * 0.92, mx = Math.max(...allVals) * 1.06;
    const x = i => pad.l + (i / (pricePath.length - 1)) * cw;
    const y = v => pad.t + ((mx - v) / (mx - mn)) * ch;

    // Clear (transparent background — card bg shows through)
    ctx.clearRect(0, 0, W, H);

    // Y-axis: 3 ticks only (min, mid, max)
    ctx.fillStyle = DS.text3;
    ctx.font = `10px ${DS.mono}`;
    ctx.textAlign = 'right';
    [0, 0.5, 1].forEach(pct => {
      const yy = pad.t + pct * ch;
      const val = mx - pct * (mx - mn);
      ctx.beginPath();
      ctx.moveTo(pad.l, yy);
      ctx.lineTo(pad.l + cw, yy);
      ctx.strokeStyle = DS.borderLight;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillText(`$${(val / 1000).toFixed(0)}K`, pad.l - 8, yy + 3);
    });

    // Area fill under the curve
    const grad = ctx.createLinearGradient(0, y(mx), 0, y(mn));
    grad.addColorStop(0, 'rgba(204,255,0,0.12)');
    grad.addColorStop(1, 'rgba(204,255,0,0)');
    ctx.beginPath();
    pricePath.forEach((p, i) => i === 0 ? ctx.moveTo(x(i), y(p.v)) : ctx.lineTo(x(i), y(p.v)));
    ctx.lineTo(x(pricePath.length - 1), pad.t + ch);
    ctx.lineTo(x(0), pad.t + ch);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Price line
    ctx.beginPath();
    pricePath.forEach((p, i) => i === 0 ? ctx.moveTo(x(i), y(p.v)) : ctx.lineTo(x(i), y(p.v)));
    ctx.strokeStyle = DS.accent;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Dots
    pricePath.forEach((p, i) => {
      const isLast = i === pricePath.length - 1;
      ctx.beginPath();
      ctx.arc(x(i), y(p.v), isLast ? 5 : 2.5, 0, Math.PI * 2);
      if (isLast) {
        ctx.fillStyle = DS.accent;
        ctx.fill();
      } else {
        ctx.fillStyle = DS.text;
        ctx.fill();
        ctx.strokeStyle = DS.accent;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // Price label pill (last point)
    const lx = x(pricePath.length - 1), ly = y(price);
    ctx.fillStyle = DS.accent;
    ctx.beginPath();
    ctx.roundRect(lx - 30, ly - 22, 60, 18, 9);
    ctx.fill();
    ctx.fillStyle = DS.bg;
    ctx.font = `bold 10px ${DS.mono}`;
    ctx.textAlign = 'center';
    ctx.fillText(`$${fK(price)}`, lx, ly - 10);

    // X-axis
    ctx.fillStyle = DS.text3;
    ctx.font = `10px ${DS.mono}`;
    ctx.textAlign = 'center';
    pricePath.forEach((p, i) => {
      if (i % 2 === 0 || i === pricePath.length - 1)
        ctx.fillText(p.m, x(i), H - pad.b + 16);
    });

  }, [price, mob, levels, histPrices]);

  return (
    <div className="pricebands-v3-layout">
      {/* LEFT: Chart */}
      <div className="pricebands-v3-chart">
        <canvas ref={ref} style={{ width: '100%', height: mob ? 280 : 340 }} />
      </div>

      {/* RIGHT: Data table */}
      <div className="pricebands-v3-table">
        {/* Header */}
        <div className="pricebands-v3-table-header">
          <span>Niveau</span>
          <span>Prix</span>
          <span>Δ%</span>
        </div>

        {/* Résistances */}
        {resistances.map(l => {
          const delta = ((l.v - price) / price * 100).toFixed(0);
          return (
            <div className="pricebands-v3-row" key={l.k}>
              <span className="pricebands-v3-row-label">{l.l}</span>
              <span className="pricebands-v3-row-value is-down">{`$${fK(l.v)}`}</span>
              <span className="pricebands-v3-row-delta is-down">{`+${delta}%`}</span>
              <div className="pricebands-v3-row-bar">
                <div className="pricebands-v3-row-bar-fill is-down"
                  style={{ width: `${Math.min(100, delta)}%` }} />
              </div>
            </div>
          );
        })}

        {/* Séparateur prix actuel */}
        <div className="pricebands-v3-current">
          <span>Prix actuel</span>
          <span>{`$${fK(price)}`}</span>
        </div>

        {/* Supports */}
        {supports.map(l => {
          const delta = ((price - l.v) / price * 100).toFixed(0);
          return (
            <div className="pricebands-v3-row" key={l.k}>
              <span className="pricebands-v3-row-label">{l.l}</span>
              <span className="pricebands-v3-row-value is-up">{`$${fK(l.v)}`}</span>
              <span className="pricebands-v3-row-delta is-up">{`-${delta}%`}</span>
              <div className="pricebands-v3-row-bar">
                <div className="pricebands-v3-row-bar-fill is-up"
                  style={{ width: `${Math.min(100, delta)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { DS } from '../config/design';

const PERIODS = [{ l: '2A', d: 730 }, { l: '4A', d: 1460 }, { l: 'MAX', d: 99999 }];

export default function PiCycleChart({ hist, mob }) {
  const ref = useRef(null);
  const [period, setPeriod] = useState(2);

  const data = useMemo(() => {
    if (!hist?.prices) return null;
    const days = PERIODS[period].d;
    const cutoff = days < 99999 ? Date.now() - days * 86400000 : 0;
    const prices = hist.prices.filter(p => p.ts >= cutoff);
    return {
      prices,
      crosses: (hist.crosses || []).filter(c => c.date.getTime() >= cutoff)
    };
  }, [hist, period]);

  useEffect(() => {
    if (!data || !ref.current) return;
    const cv = ref.current;
    const ctx = cv.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = cv.parentElement.clientWidth;
    const H = mob ? 280 : 400;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    const { prices, crosses } = data;
    if (prices.length < 2) return;

    const pad = { t: 20, r: 65, b: 40, l: 10 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;

    var allVals = [];
    prices.forEach(function(p) {
      if (p.price > 0) allVals.push(p.price);
      if (p.ma111 > 0) allVals.push(p.ma111);
      if (p.ma350x2 > 0) allVals.push(p.ma350x2);
    });
    if (allVals.length < 2) return;
    var mn = Math.min.apply(null, allVals) * 0.7;
    var mx = Math.max.apply(null, allVals) * 1.3;
    var logMn = Math.log10(mn), logMx = Math.log10(mx);

    var xFn = function(i) { return pad.l + (i / (prices.length - 1)) * cw; };
    var yFn = function(v) { return pad.t + (1 - (Math.log10(v) - logMn) / (logMx - logMn)) * ch; };

    // Background
    ctx.fillStyle = DS.borderLight; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = DS.surface; ctx.beginPath(); ctx.roundRect(pad.l - 4, pad.t - 4, cw + 8, ch + 8, 6); ctx.fill();

    // Grid lines + Y-axis labels on RIGHT
    ctx.strokeStyle = DS.border; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    var gridPrices = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000];
    gridPrices.forEach(function(gp) {
      if (gp < mn || gp > mx) return;
      var gy = yFn(gp);
      ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(pad.l + cw, gy); ctx.stroke();
      ctx.fillStyle = '#8993A4'; ctx.font = '10px ' + DS.mono; ctx.textAlign = 'left';
      var label;
      if (gp >= 1000000) label = '$' + (gp / 1000000) + 'M';
      else if (gp >= 1000) label = '$' + (gp / 1000) + 'K';
      else label = '$' + gp;
      ctx.fillText(label, pad.l + cw + 8, gy + 3);
    });
    ctx.setLineDash([]);

    // Convergence zone fill between ma111 and ma350x2
    for (var i = 0; i < prices.length - 1; i++) {
      var p0 = prices[i], p1 = prices[i + 1];
      if (p0.ma111 > 0 && p0.ma350x2 > 0 && p1.ma111 > 0 && p1.ma350x2 > 0) {
        var danger = p0.ma111 >= p0.ma350x2 || p1.ma111 >= p1.ma350x2;
        ctx.beginPath();
        ctx.moveTo(xFn(i), yFn(p0.ma111)); ctx.lineTo(xFn(i + 1), yFn(p1.ma111));
        ctx.lineTo(xFn(i + 1), yFn(p1.ma350x2)); ctx.lineTo(xFn(i), yFn(p0.ma350x2));
        ctx.closePath();
        ctx.fillStyle = danger ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.08)';
        ctx.fill();
      }
    }

    // Price line with gradient fill underneath
    ctx.beginPath();
    var started = false;
    var firstPriceIdx = -1;
    var lastPriceIdx = -1;
    for (var i = 0; i < prices.length; i++) {
      if (prices[i].price > 0) {
        if (!started) { ctx.moveTo(xFn(i), yFn(prices[i].price)); started = true; firstPriceIdx = i; }
        else ctx.lineTo(xFn(i), yFn(prices[i].price));
        lastPriceIdx = i;
      }
    }
    // Gradient fill
    if (firstPriceIdx >= 0 && lastPriceIdx > firstPriceIdx) {
      ctx.lineTo(xFn(lastPriceIdx), pad.t + ch);
      ctx.lineTo(xFn(firstPriceIdx), pad.t + ch);
      ctx.closePath();
      var grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
      grad.addColorStop(0, 'rgba(176,184,196,0.18)');
      grad.addColorStop(1, 'rgba(176,184,196,0.0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }
    // Price stroke
    ctx.beginPath();
    started = false;
    for (var i = 0; i < prices.length; i++) {
      if (prices[i].price > 0) {
        if (!started) { ctx.moveTo(xFn(i), yFn(prices[i].price)); started = true; }
        else ctx.lineTo(xFn(i), yFn(prices[i].price));
      }
    }
    ctx.strokeStyle = '#B0B8C4'; ctx.lineWidth = 1; ctx.stroke();

    // 350 DMA x2 line (green/teal)
    ctx.beginPath();
    started = false;
    for (var i = 0; i < prices.length; i++) {
      if (prices[i].ma350x2 > 0) {
        if (!started) { ctx.moveTo(xFn(i), yFn(prices[i].ma350x2)); started = true; }
        else ctx.lineTo(xFn(i), yFn(prices[i].ma350x2));
      }
    }
    ctx.strokeStyle = '#10B981'; ctx.lineWidth = 2.5; ctx.stroke();

    // 111 DMA line (orange)
    ctx.beginPath();
    started = false;
    for (var i = 0; i < prices.length; i++) {
      if (prices[i].ma111 > 0) {
        if (!started) { ctx.moveTo(xFn(i), yFn(prices[i].ma111)); started = true; }
        else ctx.lineTo(xFn(i), yFn(prices[i].ma111));
      }
    }
    ctx.strokeStyle = '#F97316'; ctx.lineWidth = 2.5; ctx.stroke();

    // Cross markers: red dot + vertical dashed line
    if (crosses.length > 0) {
      crosses.forEach(function(cr) {
        var crTs = cr.date.getTime();
        var closestIdx = 0, closestDist = Infinity;
        for (var ci = 0; ci < prices.length; ci++) {
          var dist = Math.abs(prices[ci].ts - crTs);
          if (dist < closestDist) { closestDist = dist; closestIdx = ci; }
        }
        var crP = prices[closestIdx];
        if (crP && crP.ma111 > 0) {
          var cx = xFn(closestIdx);
          // Vertical dashed line full height
          ctx.save();
          ctx.strokeStyle = '#EF4444'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
          ctx.globalAlpha = 0.5;
          ctx.beginPath(); ctx.moveTo(cx, pad.t); ctx.lineTo(cx, pad.t + ch); ctx.stroke();
          ctx.restore();
          // Red dot
          ctx.beginPath(); ctx.arc(cx, yFn(crP.ma111), 5, 0, Math.PI * 2);
          ctx.fillStyle = '#EF4444'; ctx.fill();
          ctx.strokeStyle = DS.surface; ctx.lineWidth = 2; ctx.stroke();
          // TOP label
          ctx.fillStyle = '#EF4444'; ctx.font = 'bold 10px ' + DS.mono; ctx.textAlign = 'center';
          ctx.fillText('TOP', cx, yFn(crP.ma111) - 10);
        }
      });
    }

    // End dots on last MA values
    var lastMA111Idx = -1, lastMA350Idx = -1;
    for (var i = prices.length - 1; i >= 0; i--) {
      if (lastMA111Idx < 0 && prices[i].ma111 > 0) lastMA111Idx = i;
      if (lastMA350Idx < 0 && prices[i].ma350x2 > 0) lastMA350Idx = i;
      if (lastMA111Idx >= 0 && lastMA350Idx >= 0) break;
    }
    if (lastMA111Idx >= 0) {
      ctx.beginPath(); ctx.arc(xFn(lastMA111Idx), yFn(prices[lastMA111Idx].ma111), 4, 0, Math.PI * 2);
      ctx.fillStyle = '#F97316'; ctx.fill();
    }
    if (lastMA350Idx >= 0) {
      ctx.beginPath(); ctx.arc(xFn(lastMA350Idx), yFn(prices[lastMA350Idx].ma350x2), 4, 0, Math.PI * 2);
      ctx.fillStyle = '#10B981'; ctx.fill();
    }

    // X-axis date labels (DD/MM/YY format, max ~8 labels)
    ctx.fillStyle = '#8993A4'; ctx.font = '10px ' + DS.mono; ctx.textAlign = 'center';
    var nLabels = mob ? 5 : 8;
    for (var li = 0; li <= nLabels; li++) {
      var idx = Math.round((li / nLabels) * (prices.length - 1));
      var d = new Date(prices[idx].ts);
      var dlabel;
      if (idx === prices.length - 1) {
        dlabel = 'Auj.';
      } else {
        var dd = String(d.getDate()).padStart(2, '0');
        var mm = String(d.getMonth() + 1).padStart(2, '0');
        var yy = String(d.getFullYear()).slice(2);
        dlabel = dd + '/' + mm + '/' + yy;
      }
      ctx.fillText(dlabel, xFn(idx), H - pad.b + 18);
    }
  }, [data, mob]);

  const btnStyle = (active) => ({
    padding: '4px 12px', borderRadius: 14, fontSize: 14, fontWeight: 600,
    fontFamily: DS.mono, cursor: 'pointer', border: 'none',
    background: active ? DS.accent : '#F0F2F5',
    color: active ? '#fff' : '#5E6C84',
    transition: 'all 0.15s ease'
  });

  if (!hist || !hist.prices) return <div style={{ padding: 24, textAlign: 'center', color: DS.text3, fontSize: 16 }}>Chargement des donn&eacute;es Pi Cycle...</div>;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', marginBottom: 8 }}>
        {PERIODS.map((p, i) => (
          <button key={p.l} style={btnStyle(i === period)} onClick={() => setPeriod(i)}>{p.l}</button>
        ))}
      </div>
      <canvas ref={ref} style={{ width: '100%', display: 'block' }} />
      <div style={{ textAlign: 'left', fontSize: 14, color: '#8993A4', marginTop: 8, fontFamily: DS.mono }}>
        111 DMA (Orange) vs 350 DMA x2 (Vert)
      </div>
    </div>
  );
}

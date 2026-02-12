import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { DS } from '../config/design';

const BAND_LABELS = ['\uD83D\uDD34 Maximum Bubble', '\uD83D\uDFE0 SELL!', '\uD83D\uDFE7 FOMO', '\uD83D\uDFE1 Bulle?', '\uD83D\uDFE2 HODL!', '\uD83D\uDC9A Encore cheap', '\uD83D\uDD35 Accumulate', '\uD83D\uDC99 BUY!', '\uD83D\uDD37 Fire Sale'];
const BAND_COLORS = ['#991b1b', '#dc2626', '#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#1d4ed8'];
const GENESIS = new Date('2009-01-09').getTime();
const A = 2.66167155005961, B = -17.9183761889864;

export default function RainbowChart({ hist, currentPrice, mob }) {
  const ref = useRef(null);

  const rainbow = useCallback(days => {
    if (days <= 0) return null;
    const base = Math.pow(10, A * Math.log(days) + B);
    return [5.5, 3.5, 2.2, 1.5, 1.0, 0.7, 0.47, 0.32, 0.21].map(m => base * m);
  }, []);

  const data = useMemo(() => {
    if (!hist?.prices) return null;
    const cutoff = Date.now() - 6 * 365 * 86400000;
    return hist.prices.filter(p => p.ts >= cutoff);
  }, [hist]);

  const currentBand = useMemo(() => {
    if (!currentPrice) return null;
    const days = (Date.now() - GENESIS) / 86400000;
    const bands = rainbow(days);
    if (!bands) return null;
    for (let i = 0; i < bands.length; i++) {
      if (currentPrice >= bands[i]) return { index: i, label: BAND_LABELS[i], color: BAND_COLORS[i] };
    }
    return { index: 8, label: BAND_LABELS[8], color: BAND_COLORS[8] };
  }, [currentPrice, rainbow]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || !data?.length) return;
    const ctx = cv.getContext('2d');
    const W = cv.parentElement.clientWidth, H = mob ? 260 : 340;
    cv.width = W * 2; cv.height = H * 2;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.scale(2, 2);
    const pad = { t: 20, r: 60, b: 30, l: 10 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    const allPrices = data.map(p => p.price);
    const allBands = data.flatMap(p => {
      const bands = rainbow((p.ts - GENESIS) / 86400000);
      return bands ? [bands[0], bands[8]] : [];
    });
    const mnLog = Math.log10(Math.min(...allPrices, ...allBands.filter(b => b > 0)) * 0.8);
    const mxLog = Math.log10(Math.max(...allPrices, ...allBands) * 1.2);
    const x = i => pad.l + i / (data.length - 1) * cw;
    const yLog = v => v > 0 ? pad.t + (1 - (Math.log10(v) - mnLog) / (mxLog - mnLog)) * ch : H;

    ctx.clearRect(0, 0, W, H);

    // Draw rainbow band fills
    for (let b = 0; b < 8; b++) {
      ctx.beginPath();
      data.forEach((p, i) => {
        const bands = rainbow((p.ts - GENESIS) / 86400000);
        if (!bands) return;
        if (i === 0) ctx.moveTo(x(i), yLog(bands[b]));
        else ctx.lineTo(x(i), yLog(bands[b]));
      });
      for (let i2 = data.length - 1; i2 >= 0; i2--) {
        const bands = rainbow((data[i2].ts - GENESIS) / 86400000);
        if (!bands) continue;
        ctx.lineTo(x(i2), yLog(bands[b + 1]));
      }
      ctx.closePath();
      ctx.fillStyle = BAND_COLORS[b] + '25';
      ctx.fill();
    }

    // Draw rainbow band lines
    for (let b = 0; b < 9; b++) {
      ctx.beginPath();
      data.forEach((p, i) => {
        const bands = rainbow((p.ts - GENESIS) / 86400000);
        if (!bands) return;
        if (i === 0) ctx.moveTo(x(i), yLog(bands[b]));
        else ctx.lineTo(x(i), yLog(bands[b]));
      });
      ctx.strokeStyle = BAND_COLORS[b] + '40';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Draw price line
    ctx.beginPath();
    data.forEach((p, i) => i === 0 ? ctx.moveTo(x(i), yLog(p.price)) : ctx.lineTo(x(i), yLog(p.price)));
    ctx.strokeStyle = DS.text;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw y-axis labels and grid lines
    ctx.fillStyle = DS.text3;
    ctx.font = '10px ' + DS.mono;
    ctx.textAlign = 'right';
    [1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000].forEach(v => {
      if (Math.log10(v) >= mnLog && Math.log10(v) <= mxLog) {
        const gy = yLog(v);
        ctx.fillText(v >= 1000 ? '$' + (v / 1000).toFixed(0) + 'K' : '$' + v, W - pad.r + 45, gy + 4);
        ctx.strokeStyle = DS.borderLight;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(W - pad.r, gy); ctx.stroke();
      }
    });

    // Draw x-axis date labels
    ctx.fillStyle = DS.text3;
    ctx.font = '9px ' + DS.mono;
    ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(data.length / 6));
    for (let i = 0; i < data.length; i += step) {
      ctx.fillText((data[i].date.getMonth() + 1) + '/' + (data[i].date.getFullYear() % 100), x(i), H - 8);
    }

    // Draw current price dot
    const lastX = x(data.length - 1), lastY = yLog(data[data.length - 1].price);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fillStyle = DS.text;
    ctx.fill();
  }, [data, mob, rainbow]);

  if (!data) return <div style={{ textAlign: 'center', color: DS.text3, padding: 40 }}>Chargement Rainbow Chart...</div>;

  return (
    <div>
      <canvas ref={ref} style={{ width: '100%', height: mob ? 260 : 340 }} />
      {currentBand && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: DS.surface, border: `1px solid ${currentBand.color}30`, borderRadius: 10 }}>
          <div style={{ fontSize: 28 }}>{currentBand.label.slice(0, 2)}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: currentBand.color }}>{currentBand.label.slice(3)}</div>
            <div style={{ fontSize: 14, color: DS.text3, marginTop: 2 }}>{'BTC est dans la bande ' + (currentBand.index + 1) + '/9 du Rainbow Chart'}</div>
          </div>
        </div>
      )}
      <div style={{ marginTop: 10, fontSize: 14, color: DS.text3, lineHeight: 1.6 }}>
        R&eacute;gression logarithmique sur l&apos;historique BTC. Les bandes basses (bleu) = sous-&eacute;valu&eacute;, les bandes hautes (rouge) = bulle. &Eacute;chelle logarithmique.
      </div>
    </div>
  );
}

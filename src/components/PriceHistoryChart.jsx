import React, { useRef, useEffect, useState, useMemo } from 'react';
import { DS } from '../config/design';
import { fK } from '../utils/format';

export default function PriceHistoryChart({ hist, mob }) {
  const ref = useRef(null);
  const [period, setPeriod] = useState(365);

  const filtered = useMemo(() => {
    if (!hist?.prices) return [];
    const cutoff = Date.now() - period * 86400000;
    return hist.prices.filter(p => p.ts > cutoff);
  }, [hist, period]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || !filtered.length) return;
    const ctx = cv.getContext('2d');
    const W = cv.parentElement.clientWidth;
    const H = mob ? 220 : 300;
    cv.width = W * 2;
    cv.height = H * 2;
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    ctx.scale(2, 2);

    const pad = { t: 20, r: 60, b: 30, l: 10 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    const prices = filtered.map(p => p.price);
    const mn = Math.min(...prices) * 0.98, mx = Math.max(...prices) * 1.02;
    const x = (i) => pad.l + (i / (filtered.length - 1)) * cw;
    const y = (v) => pad.t + (1 - (v - mn) / (mx - mn)) * ch;

    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = DS.borderLight;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const gy = pad.t + (i / 5) * ch;
      ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(W - pad.r, gy); ctx.stroke();
      const val = mx - (i / 5) * (mx - mn);
      ctx.fillStyle = DS.text3;
      ctx.font = '10px "IBM Plex Mono"';
      ctx.textAlign = 'right';
      ctx.fillText(fK(val), W - pad.r + 45, gy + 4);
    }

    const grad = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
    grad.addColorStop(0, `${DS.accent}20`);
    grad.addColorStop(1, `${DS.accent}00`);
    ctx.beginPath();
    ctx.moveTo(x(0), H - pad.b);
    filtered.forEach((p, i) => ctx.lineTo(x(i), y(p.price)));
    ctx.lineTo(x(filtered.length - 1), H - pad.b);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    filtered.forEach((p, i) => {
      if (i === 0) ctx.moveTo(x(i), y(p.price));
      else ctx.lineTo(x(i), y(p.price));
    });
    ctx.strokeStyle = DS.accent;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    let started = false;
    filtered.forEach((p, i) => {
      if (p.ma200) {
        if (!started) { ctx.moveTo(x(i), y(p.ma200)); started = true; }
        else ctx.lineTo(x(i), y(p.ma200));
      }
    });
    ctx.strokeStyle = DS.warn;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = DS.text3;
    ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(filtered.length / 6));
    for (let i = 0; i < filtered.length; i += step) {
      const d = filtered[i].date;
      ctx.fillText(`${d.getDate()}/${d.getMonth() + 1}`, x(i), H - 10);
    }

    const last = filtered[filtered.length - 1];
    ctx.beginPath();
    ctx.arc(x(filtered.length - 1), y(last.price), 4, 0, Math.PI * 2);
    ctx.fillStyle = DS.surface;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = DS.accent;
    ctx.stroke();
  }, [filtered, mob]);

  if (!hist) return <div style={{ textAlign: 'center', color: DS.text3, padding: 40 }}>Chargement historique...</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[30, 90, 365, 1460, 2920].map(d => (
          <button key={d} onClick={() => setPeriod(d)} style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 14,
            fontWeight: period === d ? 600 : 400,
            background: period === d ? DS.text : DS.surface,
            border: `1px solid ${period === d ? DS.text : DS.border}`,
            color: period === d ? DS.surface : DS.text2,
            cursor: 'pointer'
          }}>
            {d === 365 ? '1A' : d === 1460 ? '4A' : d === 2920 ? '8A' : `${d}J`}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, fontSize: 13, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 2, background: DS.accent }} />
            <span style={{ color: DS.text2 }}>Prix</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 2, background: DS.warn, borderTop: '1px dashed' }} />
            <span style={{ color: DS.text2 }}>MA200</span>
          </div>
        </div>
      </div>
      <canvas ref={ref} style={{ width: '100%', height: mob ? 220 : 300 }} />
    </div>
  );
}

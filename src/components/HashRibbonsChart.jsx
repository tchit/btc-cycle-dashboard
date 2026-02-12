import React, { useRef, useEffect, useState } from 'react';
import { DS } from '../config/design';

const PERIODS = [{ l: '90j', d: 90 }, { l: '180j', d: 180 }, { l: '1an', d: 365 }, { l: '2ans', d: 730 }];

export default function HashRibbonsChart({ hrHist, mob }) {
  const ref = useRef(null);
  const [period, setPeriod] = useState(1);
  const days = PERIODS[period].d;

  useEffect(() => {
    const c = ref.current; if (!c || !hrHist?.daily?.length) return;
    const dpr = window.devicePixelRatio || 1;
    const W = c.offsetWidth, H = mob ? 220 : 260;
    c.width = W * dpr; c.height = H * dpr;
    const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
    const pad = { t: 30, b: 30, l: 55, r: 20 }, cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;

    const full = hrHist.daily.filter(d => d.sma30 != null && d.sma60 != null);
    const sliced = full.slice(-days);
    if (sliced.length < 2) return;

    const s30 = sliced.map(d => d.sma30);
    const s60 = sliced.map(d => d.sma60);
    const len = sliced.length;

    const all = [...s30, ...s60], mn = Math.min(...all) * 0.995, mx = Math.max(...all) * 1.005;
    const x = i => pad.l + (i / (len - 1)) * cw, y = v => pad.t + ((mx - v) / (mx - mn)) * ch;

    ctx.fillStyle = DS.borderLight; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = DS.surface; ctx.beginPath(); ctx.roundRect(pad.l - 4, pad.t - 4, cw + 8, ch + 8, 6); ctx.fill();

    ctx.strokeStyle = DS.border; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    for (let i = 0; i <= 4; i++) {
      const yy = pad.t + (i / 4) * ch;
      ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(pad.l + cw, yy); ctx.stroke();
      ctx.fillStyle = DS.text3; ctx.font = `10px ${DS.mono}`; ctx.textAlign = 'right';
      ctx.fillText(`${((mx - (i / 4) * (mx - mn))).toFixed(0)}`, pad.l - 8, yy + 3);
    }
    ctx.setLineDash([]);

    for (let i = 0; i < len - 1; i++) {
      const below = s30[i] < s60[i] && s30[i + 1] < s60[i + 1];
      ctx.beginPath();
      ctx.moveTo(x(i), y(s30[i])); ctx.lineTo(x(i + 1), y(s30[i + 1]));
      ctx.lineTo(x(i + 1), y(s60[i + 1])); ctx.lineTo(x(i), y(s60[i]));
      ctx.closePath();
      ctx.fillStyle = below ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.07)';
      ctx.fill();
    }

    ctx.beginPath();
    for (let i = 0; i < len; i++) { i === 0 ? ctx.moveTo(x(i), y(s60[i])) : ctx.lineTo(x(i), y(s60[i])); }
    ctx.strokeStyle = DS.purple; ctx.lineWidth = 1.5; ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < len; i++) { i === 0 ? ctx.moveTo(x(i), y(s30[i])) : ctx.lineTo(x(i), y(s30[i])); }
    ctx.strokeStyle = DS.accent; ctx.lineWidth = 2; ctx.stroke();

    for (let i = 1; i < len; i++) {
      const prevBelow = s30[i - 1] < s60[i - 1];
      const nowBelow = s30[i] < s60[i];
      if (prevBelow !== nowBelow) {
        ctx.beginPath(); ctx.arc(x(i), y(s30[i]), 5, 0, Math.PI * 2);
        ctx.fillStyle = nowBelow ? DS.up : DS.down; ctx.fill();
        ctx.strokeStyle = DS.surface; ctx.lineWidth = 2; ctx.stroke();
      }
    }

    ctx.beginPath(); ctx.arc(x(len - 1), y(s30[len - 1]), 4, 0, Math.PI * 2); ctx.fillStyle = DS.accent; ctx.fill();
    ctx.beginPath(); ctx.arc(x(len - 1), y(s60[len - 1]), 4, 0, Math.PI * 2); ctx.fillStyle = DS.purple; ctx.fill();

    ctx.font = `bold 11px ${DS.font}`; ctx.textAlign = 'left';
    ctx.fillStyle = DS.accent; ctx.fillText('SMA 30', pad.l, pad.t - 12);
    ctx.fillStyle = DS.purple; ctx.fillText('SMA 60', pad.l + 65, pad.t - 12);
    ctx.fillStyle = DS.text3; ctx.font = `10px ${DS.mono}`; ctx.textAlign = 'right';
    ctx.fillText('EH/s', pad.l - 8, pad.t - 12);

    ctx.fillStyle = DS.text3; ctx.font = `10px ${DS.mono}`; ctx.textAlign = 'center';
    const nLabels = mob ? 4 : 6;
    for (let i = 0; i <= nLabels; i++) {
      const idx = Math.round((i / nLabels) * (len - 1));
      const d = new Date(sliced[idx].ts);
      const label = idx === len - 1 ? 'Auj.' : `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`;
      ctx.fillText(label, x(idx), H - pad.b + 18);
    }
  }, [hrHist, mob, days]);

  const btnStyle = (active) => ({
    padding: '4px 12px', borderRadius: 6, fontSize: 14, fontWeight: 600,
    fontFamily: DS.mono, cursor: 'pointer', border: 'none',
    background: active ? DS.accent : DS.borderLight,
    color: active ? DS.bg : DS.text2,
    transition: 'all 0.15s ease'
  });

  if (!hrHist) return <div style={{ padding: 24, textAlign: 'center', color: DS.text3, fontSize: 16 }}>Chargement des donn&eacute;es hashrate...</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, justifyContent: 'flex-end' }}>
        {PERIODS.map((p, i) => (
          <button key={p.l} style={btnStyle(i === period)} onClick={() => setPeriod(i)}>{p.l}</button>
        ))}
      </div>
      <canvas ref={ref} style={{ width: '100%', height: mob ? 220 : 260 }} />
    </div>
  );
}

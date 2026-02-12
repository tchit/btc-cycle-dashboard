import React from 'react';
import { DS } from '../config/design';
import { ATH, RP, W200, MC, CVDD, STHRP, LTHRP, SCENARIOS } from '../config/constants';
import { fP } from '../utils/format';

export default function ScenarioZoneChart({ price, mob, levels }) {
  const keyLevels = levels ? [
    ...levels,
    { k: 'ath', l: 'ATH', v: ATH, c: DS.down }
  ].sort((a, b) => a.v - b.v) : [
    { v: LTHRP, l: 'LTH-RP', c: DS.up },
    { v: CVDD, l: 'CVDD', c: '#f472b6' },
    { v: RP, l: 'RP', c: '#a78bfa' },
    { v: W200, l: '200W', c: '#60a5fa' },
    { v: MC, l: 'MC', c: DS.warn },
    { v: STHRP, l: 'STH-RP', c: DS.accent },
    { v: ATH, l: 'ATH', c: DS.down }
  ].sort((a, b) => a.v - b.v);

  const barRow = (s) => {
    const lo = s.r[0] * 1000, hi = s.r[1] * 1000;
    const inRange = price >= lo && price <= hi;
    const pricePctInRow = Math.max(0, Math.min(100, ((price - lo) / (hi - lo)) * 100));

    return (
      <div key={s.l} style={{ padding: '14px 16px', borderRadius: 10, background: DS.surface, border: `1.5px solid ${inRange ? s.c : DS.border}`, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.c, flexShrink: 0 }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: s.c }}>{s.l}</span>
            {s.hl && <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: s.c, color: '#fff', marginLeft: 4 }}>PROBABLE</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 16, fontFamily: DS.mono, fontWeight: 600, color: DS.text }}>{`$${s.r[0]}K \u2014 $${s.r[1]}K`}</span>
            <span style={{ fontSize: 18, fontWeight: 700, fontFamily: DS.mono, color: s.c }}>{`${s.p}%`}</span>
          </div>
        </div>
        <div style={{ height: 8, background: DS.borderLight, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${s.p}%`, background: s.c, opacity: 0.25, borderRadius: 4 }} />
          {inRange && <div style={{ position: 'absolute', left: `${pricePctInRow}%`, top: -2, width: 4, height: 12, background: DS.accent, borderRadius: 2, transform: 'translateX(-2px)' }} />}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <div style={{ fontSize: 15, color: DS.text2 }}>{s.z}</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 14, fontFamily: DS.mono, color: DS.down }}>{`DD: ${s.dd[0]}% / ${s.dd[1]}%`}</span>
            {inRange && <span style={{ fontSize: 14, fontWeight: 700, color: s.c }}>ACTIF</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 0' }}>
        <span style={{ fontSize: 15, color: DS.text2 }}>Prix actuel :</span>
        <span style={{ fontSize: 16, fontWeight: 700, fontFamily: DS.mono, color: DS.accent }}>{`$${fP(price)}`}</span>
      </div>
      {SCENARIOS.map(s => barRow(s))}
      <div style={{ padding: '14px 16px', background: DS.borderLight, borderRadius: 10, marginTop: 4 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: DS.text2, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Niveaux de support</div>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 8 }}>
          {keyLevels.map(l => {
            const below = price < l.v;
            return (
              <div key={l.l} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: DS.surface, borderRadius: 8, border: `1px solid ${DS.border}` }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.c, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: l.c }}>{l.l}</div>
                  <div style={{ fontSize: 14, fontFamily: DS.mono, color: DS.text2 }}>{`$${fP(l.v)}`}</div>
                </div>
                {below && <div style={{ marginLeft: 'auto', fontSize: 13, color: DS.up, fontWeight: 600 }}>Dessous</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

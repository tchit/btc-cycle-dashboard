import React from 'react';
import { DS } from '../config/design';
import { EXHAUST, SCENARIOS } from '../config/constants';

export default function ExhaustionPanel({ pct, mob }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 20 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: mob ? 36 : 44, fontWeight: 800, fontFamily: DS.mono, color: DS.warn }}>{`${pct}%`}</div>
          <div style={{ fontSize: 14, color: DS.text3, lineHeight: 1.4 }}>Exhaustion globale</div>
        </div>
        {EXHAUST.map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${DS.borderLight}` }}>
            <div style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{e.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: DS.text }}>{e.l}</div>
              <div style={{ fontSize: 13, color: DS.text3, marginTop: 2 }}>{e.d}</div>
            </div>
            <div style={{ width: 50, textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: DS.mono, color: e.p > 70 ? DS.up : e.p > 30 ? DS.warn : DS.text3 }}>{`${e.p}%`}</div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 13, letterSpacing: 2, color: DS.text3, fontWeight: 600, marginBottom: 12 }}>SCÉNARIOS BOTTOM</div>
        {SCENARIOS.map((s, i) => (
          <div key={i} style={{ background: s.hl ? `${s.c}08` : DS.surface2, border: `1px solid ${s.hl ? `${s.c}30` : DS.borderLight}`, borderRadius: 10, padding: '12px 14px', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: s.hl ? 700 : 500, color: s.hl ? DS.text : DS.text2 }}>{s.l}</div>
                <div style={{ fontSize: 13, color: DS.text3, marginTop: 2 }}>{`${s.z} \u2192 ${s.r[0]}K-${s.r[1]}K`}</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: DS.mono, color: s.c }}>{`${s.p}%`}</div>
            </div>
            <div style={{ height: 3, borderRadius: 2, background: DS.borderLight, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${s.p}%`, borderRadius: 2, background: s.c, opacity: 0.5 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

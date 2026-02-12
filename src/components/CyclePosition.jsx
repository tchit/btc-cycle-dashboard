import React from 'react';
import { DS } from '../config/design';
import { TIMING } from '../config/constants';

export default function CyclePosition({ mob }) {
  const rows = [
    { m: 'Formation', o: 'V-bottom ponctuel', n: 'U-bottom (mois)' },
    { m: 'Trigger', o: 'Purge totale vendeurs', n: 'Couche par couche + squeeze' },
    { m: 'Signal cl\u00e9', o: 'MVRV wick <0.55', n: 'Supply 50/50 + reserves floor' },
    { m: 'M\u00e9canisme', o: 'Achat spot organique', n: 'Short squeeze + illiquidit\u00e9' },
    { m: 'Dur\u00e9e', o: 'Semaines', n: 'Mois (explosif)' }
  ];

  return (
    <div>
      <div style={{ fontSize: 13, letterSpacing: 2, color: DS.text3, fontWeight: 600, marginBottom: 10 }}>ANCIEN vs NOUVEAU RÉGIME</div>
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '70px 1fr 1fr' : '100px 1fr 1fr', gap: 0, fontSize: 15, background: DS.surface, border: `1px solid ${DS.borderLight}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: 10, borderBottom: `1px solid ${DS.borderLight}`, background: DS.surface2 }} />
        <div style={{ padding: 10, borderBottom: `1px solid ${DS.borderLight}`, fontSize: 12, letterSpacing: 2, color: DS.text3, fontWeight: 600, background: DS.surface2 }}>ANCIEN</div>
        <div style={{ padding: 10, borderBottom: `1px solid ${DS.borderLight}`, fontSize: 12, letterSpacing: 2, color: DS.accent, fontWeight: 600, background: DS.surface2 }}>NOUVEAU</div>
        {rows.flatMap((r, i) => [
          <div key={`${i}m`} style={{ padding: 10, borderBottom: `1px solid ${DS.borderLight}`, color: DS.text2, fontWeight: 600, fontSize: 14 }}>{r.m}</div>,
          <div key={`${i}o`} style={{ padding: 10, borderBottom: `1px solid ${DS.borderLight}`, color: DS.text3, fontSize: 14 }}>{r.o}</div>,
          <div key={`${i}n`} style={{ padding: 10, borderBottom: `1px solid ${DS.borderLight}`, color: DS.text2, fontSize: 14 }}>{r.n}</div>
        ])}
      </div>
      <div style={{ marginTop: 24, fontSize: 13, letterSpacing: 2, color: DS.text3, fontWeight: 600, marginBottom: 10 }}>CONVERGENCE TIMING</div>
      {TIMING.map((t, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${DS.borderLight}` }}>
          <div style={{ fontSize: 15, color: DS.text2, fontWeight: 500 }}>{t.m}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {!mob && <span style={{ fontSize: 13, fontFamily: DS.mono, color: DS.text3 }}>{t.calc}</span>}
            <span style={{ fontSize: 14, fontWeight: 700, color: DS.accent, fontFamily: DS.mono }}>{t.result}</span>
          </div>
        </div>
      ))}
      <div style={{ background: `${DS.accent}08`, border: `1px solid ${DS.accent}20`, borderRadius: 10, padding: '14px 16px', marginTop: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: DS.accent, opacity: 0.8, fontWeight: 600 }}>CONSENSUS</div>
        <div style={{ fontSize: mob ? 18 : 24, fontWeight: 800, color: DS.accent, fontFamily: DS.mono, marginTop: 4 }}>SEP — NOV 2026</div>
      </div>
    </div>
  );
}

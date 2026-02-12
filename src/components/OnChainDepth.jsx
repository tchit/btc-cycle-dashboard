import React from 'react';
import { DS } from '../config/design';
import { ATH, OCLEVELS } from '../config/constants';
import { fK } from '../utils/format';

export default function OnChainDepth({ price, mob, levels }) {
  return (
    <div>
      {(levels || OCLEVELS).map((l, i) => {
        const dist = ((price - l.v) / price) * 100;
        const below = price < l.v;
        const pct = Math.min(100, Math.max(0, (l.v / ATH) * 100));
        const pricePct = Math.min(100, Math.max(0, (price / ATH) * 100));

        return (
          <div key={l.k} style={{ display: 'grid', gridTemplateColumns: mob ? '80px 1fr 60px' : '120px 1fr 80px', alignItems: 'center', gap: 10, marginBottom: 6, opacity: below ? 0.5 : 1 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: l.c }}>{l.l}</div>
            </div>
            <div style={{ position: 'relative', height: 6, background: DS.borderLight, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: `${pct}%`, top: 0, bottom: 0, width: 2, background: l.c, opacity: 0.6, borderRadius: 1 }} />
              {i === 0 && <div style={{ position: 'absolute', left: `${pricePct}%`, top: -2, bottom: -2, width: 3, background: DS.text, borderRadius: 2, zIndex: 2 }} />}
              {!below && <div style={{ position: 'absolute', left: `${pct}%`, top: 0, bottom: 0, width: `${pricePct - pct}%`, background: `${l.c}20`, borderRadius: 2 }} />}
            </div>
            <div style={{ fontFamily: DS.mono, fontSize: 11, textAlign: 'right' }}>
              <span style={{ color: l.c, fontWeight: 600 }}>{fK(l.v)}</span>
              <span style={{ color: DS.text3, fontSize: 9, marginLeft: 4 }}>{`${below ? '+' : '-'}${Math.abs(dist).toFixed(0)}%`}</span>
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: DS.text3, fontWeight: 600, marginBottom: 10 }}>CORRECTIONS HISTORIQUES</div>
        {[{ l: 'C0', d: 93 }, { l: 'C1', d: 87 }, { l: 'C2', d: 84 }, { l: 'C3', d: 78 }].map((x, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
            <div style={{ width: 50, fontSize: 10, color: DS.text3, fontFamily: DS.mono, textAlign: 'right' }}>{x.l}</div>
            <div style={{ flex: 1, height: 5, background: DS.borderLight, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${x.d}%`, background: `${DS.down}40`, borderRadius: 3 }} />
            </div>
            <div style={{ width: 35, fontSize: 11, fontWeight: 600, color: DS.down, fontFamily: DS.mono, textAlign: 'right', opacity: 0.7 }}>{`-${x.d}%`}</div>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, paddingTop: 6, borderTop: `1px dashed ${DS.borderLight}` }}>
          <div style={{ width: 50, fontSize: 10, color: DS.warn, fontFamily: DS.mono, textAlign: 'right' }}>C4 proj.</div>
          <div style={{ flex: 1, height: 5, background: DS.borderLight, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '60%', background: `${DS.warn}50`, borderRadius: 3 }} />
          </div>
          <div style={{ width: 35, fontSize: 11, fontWeight: 600, color: DS.warn, fontFamily: DS.mono, textAlign: 'right' }}>-60%</div>
        </div>
      </div>
    </div>
  );
}

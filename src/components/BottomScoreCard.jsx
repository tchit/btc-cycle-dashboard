import React from 'react';
import { DS } from '../config/design';

export default function BottomScoreCard({ scores, total, mob }) {
  const totalColor = total > 60 ? DS.up : total > 40 ? DS.warn : DS.text3;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ fontSize: mob ? 36 : 44, fontWeight: 800, fontFamily: DS.mono, color: totalColor }}>{total}</div>
        <div>
          <div style={{ fontSize: 10, color: DS.text3, letterSpacing: 2 }}>BOTTOM SCORE</div>
          <div style={{ fontSize: 12, color: DS.text2 }}>{total > 60 ? "Zone d'accumulation" : total > 40 ? 'Getting close' : 'Pas encore'}</div>
        </div>
      </div>
      {scores.map((s, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 50px 28px' : '1fr 60px 32px', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: `1px solid ${DS.borderLight}` }}>
          <div>
            <div style={{ fontSize: 11, color: DS.text2, fontWeight: 500 }}>{s.l}</div>
            <div style={{ fontSize: 10, fontFamily: DS.mono, color: DS.text3 }}>{`${s.th} → ${s.cur}`}</div>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: DS.borderLight, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${s.sc}%`, borderRadius: 2, background: s.st === 'hit' ? DS.up : s.st === 'partial' ? DS.warn : DS.down, opacity: 0.7 }} />
          </div>
          <div style={{ fontSize: 10, fontFamily: DS.mono, fontWeight: 600, textAlign: 'right', color: s.st === 'hit' ? DS.up : s.st === 'partial' ? DS.warn : DS.text3 }}>
            {s.st === 'hit' ? '\u2713' : s.st === 'partial' ? '\u25D0' : '\u25CB'}
          </div>
        </div>
      ))}
    </div>
  );
}

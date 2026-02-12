import React from 'react';
import { DS } from '../config/design';
import { INFO } from '../config/constants';
import { fB, isFake } from '../utils/format';
import StatCard from '../components/StatCard';
import FundingRateChart from '../components/FundingRateChart';

export default function DerivativesView({ live, calc, mob }) {
  const fr = live.fundingRateBG ?? live.fundingRate;
  const oi = live.openInterestBG ?? live.openInterest;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="stat-grid">
        <StatCard label="Funding Rate" value={`${fr.toFixed(4)}%`} status={fr < -0.01 ? 'up' : fr > 0.05 ? 'down' : 'neutral'} fake={isFake(live.fakes, 'fundingRate')} />
        <StatCard label="Open Interest" value={fB(oi)} status={oi > 60e9 ? 'down' : oi < 30e9 ? 'up' : 'neutral'} fake={isFake(live.fakes, 'openInterest')} />
        <StatCard label="Fear & Greed" value={live.fearGreed} detail={live.fgLabel} status={live.fearGreed < 20 ? 'up' : live.fearGreed > 75 ? 'down' : 'neutral'} fake={isFake(live.fakes, 'fearGreed')} />
        <StatCard label="Score Dérivés" value={`${calc.derivs}/100`} status={calc.derivs < 25 ? 'up' : calc.derivs > 70 ? 'down' : 'neutral'} fake={isFake(live.fakes, 'fundingRate', 'openInterest', 'fearGreed')} />
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">📈 Funding Rate — 60 jours</div></div>
        <div className="card-body"><FundingRateChart fundingRate={fr} fundingHistory={live.fundingHistory} mob={mob} /></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">📈 Funding Rate</div></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 42, fontWeight: 700, fontFamily: DS.mono, color: fr < 0 ? DS.up : fr > 0.05 ? DS.down : DS.text }}>{`${fr.toFixed(4)}%`}</div>
                <div style={{ fontSize: 13, color: DS.text2, marginTop: 6 }}>{fr < -0.01 ? 'Shorts paient les longs — Bullish' : fr > 0.05 ? 'Longs paient les shorts — Bearish' : 'Neutre'}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { l: '< -0.03%', d: 'Capitulation shorts', c: DS.up },
                  { l: '-0.03% ~ -0.01%', d: 'Shorts dominants', c: '#34d399' },
                  { l: '-0.01% ~ 0.01%', d: 'Equilibre', c: DS.text2 },
                  { l: '0.01% ~ 0.05%', d: 'Longs dominants', c: DS.warn },
                  { l: '> 0.05%', d: 'Surlévéragé long', c: DS.down }
                ].map((z, i) => {
                  const ranges = [-0.03, -0.01, 0.01, 0.05, Infinity];
                  const active = i === 0 ? fr < -0.03 : fr >= [-Infinity, -0.03, -0.01, 0.01, 0.05][i] && fr < ranges[i];
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 6, background: active ? 'rgba(249,115,22,0.06)' : 'transparent', border: active ? '1px solid rgba(249,115,22,0.2)' : '1px solid transparent' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: z.c, opacity: active ? 1 : 0.4 }} />
                      <div style={{ fontSize: 12 }}>
                        <span style={{ fontFamily: DS.mono, fontWeight: 500, color: active ? DS.text : DS.text3 }}>{z.l}</span>
                        <span style={{ color: DS.text3, marginLeft: 8 }}>{z.d}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 12, color: DS.text2, lineHeight: 1.6, marginTop: 8 }}>{INFO.funding}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">📊 Open Interest</div></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 42, fontWeight: 700, fontFamily: DS.mono }}>{fB(oi)}</div>
                <div style={{ fontSize: 13, color: DS.text2, marginTop: 6 }}>Valeur totale des positions futures ouvertes</div>
              </div>
              <div style={{ padding: '12px 14px', background: DS.borderLight, borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: DS.text3, marginBottom: 6 }}>
                  <span>Purgé</span>
                  <span>Surlévéragé</span>
                </div>
                <div style={{ height: 8, background: DS.border, borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (oi / 90e9) * 100)}%`, background: `linear-gradient(90deg, ${DS.up}, ${DS.warn}, ${DS.down})`, borderRadius: 4, transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: DS.text3, marginTop: 6 }}>
                  <span>$0</span>
                  <span>$90B</span>
                </div>
              </div>
              <div style={{ padding: '12px 14px', background: DS.borderLight, borderRadius: 10, marginTop: 4 }}>
                <div style={{ fontSize: 11, color: DS.text3, marginBottom: 4 }}>Levier purgé vs pic</div>
                <div style={{ fontSize: 18, fontWeight: 600, fontFamily: DS.mono }}>{`${Math.max(0, (1 - oi / 90e9) * 100).toFixed(1)}%`}</div>
                <div style={{ fontSize: 11, color: DS.text3, marginTop: 2 }}>{'Cible: -40% (OI < $54B)'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">🎯 Signaux Bottom — Dérivés</div></div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 12 }}>
            {calc.bscores.filter(s => s.id === 'funding' || s.id === 'leverage').map(s => (
              <div key={s.id} style={{ padding: '14px 16px', background: DS.borderLight, borderRadius: 10, border: `1px solid ${s.st === 'hit' ? 'rgba(16,185,129,0.2)' : s.st === 'partial' ? 'rgba(249,115,22,0.2)' : DS.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{s.l}</div>
                  <div style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 600, background: s.st === 'hit' ? 'rgba(16,185,129,0.1)' : s.st === 'partial' ? 'rgba(249,115,22,0.1)' : 'rgba(239,68,68,0.1)', color: s.st === 'hit' ? DS.up : s.st === 'partial' ? DS.accent : DS.down }}>{s.st === 'hit' ? 'Atteint' : s.st === 'partial' ? 'Partiel' : 'Non atteint'}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: DS.text2 }}>
                  <span>{`Cible: ${s.th}`}</span>
                  <span style={{ fontFamily: DS.mono, fontWeight: 600, color: DS.text }}>{s.cur}</span>
                </div>
                <div style={{ height: 4, background: DS.border, borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.sc}%`, background: s.st === 'hit' ? DS.up : s.st === 'partial' ? DS.accent : DS.down, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

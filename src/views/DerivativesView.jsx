import React from 'react';
import { DS, DSCard } from '../config/design';
import { INFO } from '../config/constants';
import { fB, isFake } from '../utils/format';
import StatCard from '../components/StatCard';
import FearGreedCard from '../components/FearGreedCard';
import FundingRateChart from '../components/FundingRateChart';
import ImagePlaceholder from '../components/ImagePlaceholder';

export default function DerivativesView({ live, calc, mob }) {
  const d = live.deltas || {};
  const fr = live.fundingRateBG ?? live.fundingRate;
  const oi = live.openInterestBG ?? live.openInterest;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Section banner — Replace with derivatives / leverage illustration */}
      <ImagePlaceholder variant="section" section="derivatives" overlay="bottom" src="/panel9.png" />
      <div className="stat-grid">
        <StatCard label="Funding Rate" value={`${fr.toFixed(4)}%`} delta={d.fundingRate} status={fr < -0.01 ? 'up' : fr > 0.05 ? 'down' : 'neutral'} fake={isFake(live.fakes, 'fundingRate')} />
        <StatCard label="Open Interest" value={fB(oi)} delta={d.openInterest} status={oi > 60e9 ? 'down' : oi < 30e9 ? 'up' : 'neutral'} fake={isFake(live.fakes, 'openInterest')} />
        <FearGreedCard value={live.fearGreed} fgLabel={live.fgLabel} fake={isFake(live.fakes, 'fearGreed')} delta={d.fearGreed} />
        <StatCard label="Score Dérivés" value={`${calc.derivs}/100`} status={calc.derivs < 25 ? 'up' : calc.derivs > 70 ? 'down' : 'neutral'} fake={isFake(live.fakes, 'fundingRate', 'openInterest', 'fearGreed')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">📈 Funding Rate</div></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 42, fontWeight: 700, fontFamily: DS.mono, color: fr < 0 ? DSCard.up : fr > 0.05 ? DSCard.down : DSCard.text }}>{`${fr.toFixed(4)}%`}</div>
                <div style={{ fontSize: 16, color: DSCard.text2, marginTop: 6 }}>{fr < -0.01 ? 'Shorts paient les longs — Bullish' : fr > 0.05 ? 'Longs paient les shorts — Bearish' : 'Neutre'}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { l: '< -0.03%', d: 'Capitulation shorts', c: DSCard.up },
                  { l: '-0.03% ~ -0.01%', d: 'Shorts dominants', c: '#34d399' },
                  { l: '-0.01% ~ 0.01%', d: 'Equilibre', c: DSCard.text2 },
                  { l: '0.01% ~ 0.05%', d: 'Longs dominants', c: DSCard.warn },
                  { l: '> 0.05%', d: 'Surlévéragé long', c: DSCard.down }
                ].map((z, i) => {
                  const ranges = [-0.03, -0.01, 0.01, 0.05, Infinity];
                  const active = i === 0 ? fr < -0.03 : fr >= [-Infinity, -0.03, -0.01, 0.01, 0.05][i] && fr < ranges[i];
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 6, background: active ? 'rgba(204,255,0,0.06)' : 'transparent', border: active ? '1px solid rgba(204,255,0,0.2)' : '1px solid transparent' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: z.c, opacity: active ? 1 : 0.4 }} />
                      <div style={{ fontSize: 15 }}>
                        <span style={{ fontFamily: DS.mono, fontWeight: 500, color: active ? DSCard.text : DSCard.text3 }}>{z.l}</span>
                        <span style={{ color: DSCard.text3, marginLeft: 8 }}>{z.d}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 15, color: DSCard.text2, lineHeight: 1.6, marginTop: 8 }}>{INFO.funding}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">📊 Open Interest</div></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 42, fontWeight: 700, fontFamily: DS.mono }}>{fB(oi)}</div>
                <div style={{ fontSize: 16, color: DSCard.text2, marginTop: 6 }}>Valeur totale des positions futures ouvertes</div>
              </div>
              <div style={{ padding: '12px 14px', background: DSCard.borderLight, borderRadius: 10 }}>
                {(() => {
                  const zones = [
                    { label: 'Purgé', min: 0, max: 25e9, color: DSCard.up, desc: 'Levier nettoyé — signal bottom' },
                    { label: 'Faible', min: 25e9, max: 40e9, color: '#34d399', desc: 'Levier contenu — sain' },
                    { label: 'Modéré', min: 40e9, max: 60e9, color: DSCard.text2, desc: 'Activité normale' },
                    { label: 'Élevé', min: 60e9, max: 80e9, color: DSCard.warn, desc: 'Levier excessif — prudence' },
                    { label: 'Extrême', min: 80e9, max: Infinity, color: DSCard.down, desc: 'Surlévéragé — risque de cascade' }
                  ];
                  const currentZone = zones.find(z => oi >= z.min && oi < z.max) || zones[zones.length - 1];
                  const OI_SCALE = 100e9;
                  const pct = Math.min(100, (oi / OI_SCALE) * 100);
                  return (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 14, color: DSCard.text3 }}>Niveau de levier</span>
                        <span style={{ fontSize: 14, fontWeight: 600, fontFamily: DS.mono, color: currentZone.color }}>{currentZone.label}</span>
                      </div>
                      <div style={{ height: 8, background: DSCard.border, borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${DSCard.up}, #34d399, ${DSCard.warn}, ${DSCard.down})`, borderRadius: 4, transition: 'width 0.5s ease' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: DSCard.text3, marginTop: 6, fontFamily: DS.mono }}>
                        <span>$0</span>
                        <span style={{ color: oi >= 25e9 && oi < 40e9 ? '#34d399' : DSCard.text3 }}>$25B</span>
                        <span style={{ color: oi >= 40e9 && oi < 60e9 ? DSCard.text2 : DSCard.text3 }}>$40B</span>
                        <span style={{ color: oi >= 60e9 && oi < 80e9 ? DSCard.warn : DSCard.text3 }}>$60B</span>
                        <span style={{ color: oi >= 80e9 ? DSCard.down : DSCard.text3 }}>$80B</span>
                        <span>$100B</span>
                      </div>
                      <div style={{ fontSize: 13, color: currentZone.color, marginTop: 8, opacity: 0.8 }}>{currentZone.desc}</div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">📈 Funding Rate — 60 jours</div></div>
        <div className="card-body"><FundingRateChart fundingRate={fr} fundingHistory={live.fundingHistory} mob={mob} /></div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">🎯 Signaux Bottom — Dérivés</div></div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 12 }}>
            {calc.bscores.filter(s => s.id === 'funding' || s.id === 'leverage').map(s => (
              <div key={s.id} style={{ padding: '14px 16px', background: DSCard.borderLight, borderRadius: 10, border: `1px solid ${s.st === 'hit' ? 'rgba(204,255,0,0.2)' : s.st === 'partial' ? 'rgba(204,255,0,0.2)' : DSCard.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{s.l}</div>
                  <div style={{ fontSize: 14, padding: '2px 8px', borderRadius: 10, fontWeight: 600, background: s.st === 'hit' ? 'rgba(204,255,0,0.1)' : s.st === 'partial' ? 'rgba(204,255,0,0.1)' : 'rgba(255,0,60,0.1)', color: s.st === 'hit' ? DSCard.up : s.st === 'partial' ? DSCard.accent : DSCard.down }}>{s.st === 'hit' ? 'Atteint' : s.st === 'partial' ? 'Partiel' : 'Non atteint'}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: DSCard.text2 }}>
                  <span>{`Cible: ${s.th}`}</span>
                  <span style={{ fontFamily: DS.mono, fontWeight: 600, color: DSCard.text }}>{s.cur}</span>
                </div>
                <div style={{ height: 4, background: DSCard.border, borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.sc}%`, background: s.st === 'hit' ? DSCard.up : s.st === 'partial' ? DSCard.accent : DSCard.down, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { DS, DSCard } from '../config/design';
import { SCENARIOS, TIMING } from '../config/constants';
import { fP, isFake } from '../utils/format';
import StatCard from '../components/StatCard';
import ScenarioZoneChart from '../components/ScenarioZoneChart';
import ExhaustionPanel from '../components/ExhaustionPanel';

export default function ScenariosView({ live, calc, mob }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="stat-grid">
        <StatCard label="Distance ATH" value={`${calc.drop.toFixed(1)}%`} detail={`${calc.dATH} jours`} status="neutral" fake={isFake(live.fakes, 'price')} />
        <StatCard label="Bear Progress" value={`${calc.bearProg.toFixed(0)}%`} detail={`J${calc.dATH}/383`} status={calc.bearProg > 80 ? 'up' : 'neutral'} />
        <StatCard label="Bottom estim." value={`J-${calc.dBot}`} detail="ATH + 383j" status={calc.dBot < 60 ? 'up' : 'neutral'} />
        <StatCard label="Next Halving" value={`J-${calc.dNH}`} detail="~Avr 2028" status="neutral" />
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">🔮 Scénarios de Bottom</div>
          <div className="card-badge">{`Prix: $${fP(live.price)}`}</div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 16 }}>
            {SCENARIOS.map((s, i) => {
              const inRange = live.price >= s.r[0] * 1000 && live.price <= s.r[1] * 1000;
              return (
                <div key={i} style={{ padding: '18px 20px', borderRadius: 12, border: `1.5px solid ${s.hl ? s.c : DSCard.border}`, background: s.hl ? 'rgba(249,115,22,0.04)' : DSCard.bgHover, position: 'relative', overflow: 'hidden' }}>
                  {s.hl && <div style={{ position: 'absolute', top: 0, right: 0, padding: '3px 10px', fontSize: 13, fontWeight: 700, background: s.c, color: '#fff', borderRadius: '0 0 0 8px' }}>PROBABLE</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.c }} />
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{s.l}</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: DS.mono, color: s.c }}>{`${s.p}%`}</div>
                  </div>
                  <div style={{ fontSize: 15, color: DSCard.text2, marginBottom: 12 }}>{s.z}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ padding: '8px 10px', background: DSCard.borderLight, borderRadius: 8 }}>
                      <div style={{ fontSize: 13, color: DSCard.text3, marginBottom: 2 }}>RANGE</div>
                      <div style={{ fontSize: 14, fontWeight: 600, fontFamily: DS.mono }}>{`$${s.r[0]}K - $${s.r[1]}K`}</div>
                    </div>
                    <div style={{ padding: '8px 10px', background: DSCard.borderLight, borderRadius: 8 }}>
                      <div style={{ fontSize: 13, color: DSCard.text3, marginBottom: 2 }}>DRAWDOWN</div>
                      <div style={{ fontSize: 14, fontWeight: 600, fontFamily: DS.mono, color: DSCard.down }}>{`${s.dd[0]}% / ${s.dd[1]}%`}</div>
                    </div>
                  </div>
                  {inRange && <div style={{ marginTop: 10, padding: '4px 10px', background: 'rgba(16,185,129,0.08)', borderRadius: 6, fontSize: 14, color: DSCard.up, fontWeight: 600, textAlign: 'center' }}>Prix actuel dans cette zone</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">⏱ Convergence Temporelle</div></div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TIMING.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: DSCard.borderLight, borderRadius: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(249,115,22,${0.06 + t.conf * 0.1})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, fontFamily: DS.mono, color: DSCard.accent, flexShrink: 0 }}>{`${i + 1}`}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>{t.m}</div>
                  <div style={{ fontSize: 15, color: DSCard.text2 }}>{t.calc}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, fontFamily: DS.mono, color: DSCard.accent }}>{t.result}</div>
                  <div style={{ fontSize: 14, color: DSCard.text3 }}>{`${(t.conf * 100).toFixed(0)}% confiance`}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 8, padding: '12px 16px', background: 'rgba(249,115,22,0.04)', borderRadius: 10, border: '1px solid rgba(249,115,22,0.12)' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: DSCard.accent, marginBottom: 4 }}>Convergence: Sep - Nov 2026</div>
              <div style={{ fontSize: 15, color: DSCard.text2, lineHeight: 1.5 }}>Les 3 méthodes de calcul convergent vers une fenêtre de bottom potentiel entre septembre et novembre 2026.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">🗺 Carte des Zones de Prix</div></div>
        <div className="card-body"><ScenarioZoneChart price={live.price} mob={mob} levels={calc.liveLevels} /></div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">🔥 Phases d'Exhaustion</div>
          <div className="card-badge">{`${calc.exhaustPct}%`}</div>
        </div>
        <div className="card-body">
          <ExhaustionPanel pct={calc.exhaustPct} mob={mob} />
        </div>
      </div>
    </div>
  );
}

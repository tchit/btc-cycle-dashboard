import React from 'react';
import { DS } from '../config/design';
import { MC, INFO } from '../config/constants';
import { fP, isFake } from '../utils/format';
import StatCard from '../components/StatCard';
import FakeBadge from '../components/FakeBadge';
import HashRibbonsChart from '../components/HashRibbonsChart';
import PriceLevels from '../components/PriceLevels';

export default function MinersView({ live, calc, mob, hrHist }) {
  const hr = live.hashrate || 0;
  const diff = live.difficulty || 0;
  const sma30 = hrHist?.sma30 || live.hashSma30 || 0;
  const sma60 = hrHist?.sma60 || live.hashSma60 || 0;
  const ribbonDown = hrHist ? hrHist.capitulation : (live.hashRibbons === 'Down');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="stat-grid">
        <StatCard label="Hash Rate" value={`${hr.toFixed(0)} EH/s`} status="neutral" fake={isFake(live.fakes, 'hashrate')} />
        <StatCard label="Puell Multiple" value={calc.puell.toFixed(2)} detail={calc.puell < 0.5 ? 'Zone achat' : calc.puell > 4 ? 'Zone top' : 'Neutre'} status={calc.puell < 0.5 ? 'up' : calc.puell > 4 ? 'down' : 'neutral'} fake={isFake(live.fakes, 'puellMultiple')} />
        <StatCard label="Mining Margin" value={`${calc.margin.toFixed(1)}%`} detail={`MC: $${fP(MC)}`} status={calc.margin < 0 ? 'down' : calc.margin < 15 ? 'up' : 'neutral'} fake={isFake(live.fakes, 'price')} />
        <StatCard label="Score Miners" value={`${calc.miners}/100`} status={calc.miners < 25 ? 'up' : calc.miners > 70 ? 'down' : 'neutral'} fake={isFake(live.fakes, 'puellMultiple', 'price')} />
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">📊 Marge & Rentabilité</div></div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr 1fr', gap: 16 }}>
            {[
              { l: 'Prix BTC', v: `$${fP(live.price)}`, c: DS.text, fk: isFake(live.fakes, 'price') },
              { l: 'Coût de minage', v: `$${fP(MC)}`, c: DS.warn },
              { l: 'Marge', v: `${calc.margin.toFixed(1)}%`, c: calc.margin > 0 ? DS.up : DS.down, fk: isFake(live.fakes, 'price') },
              { l: 'Difficulté', v: `${(diff / 1e12).toFixed(1)}T`, c: DS.text, fk: isFake(live.fakes, 'difficulty') },
              { l: 'ETF BTC Total', v: live.etfBtcTotal ? `${fP(live.etfBtcTotal)} BTC` : 'N/A', c: DS.blue, fk: isFake(live.fakes, 'etfBtcTotal') },
              { l: 'ETF Flow', v: live.etfFlowBtc ? `${live.etfFlowBtc > 0 ? '+' : ''}${fP(live.etfFlowBtc)} BTC` : 'N/A', c: live.etfFlowBtc > 0 ? DS.up : DS.down, fk: isFake(live.fakes, 'etfFlowBtc') }
            ].map((item, i) => (
              <div key={i} style={{ padding: '14px 16px', background: DS.borderLight, borderRadius: 10, border: item.fk ? '1px solid rgba(239,68,68,0.25)' : 'none' }}>
                <div style={{ fontSize: 14, color: DS.text3, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.l}{item.fk && <FakeBadge />}</div>
                <div style={{ fontSize: 18, fontWeight: 600, fontFamily: DS.mono, color: item.c }}>{item.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">📈 Hash Ribbons Chart</div>
            <div className="card-badge">{hrHist ? 'MEMPOOL.SPACE' : 'CHARGEMENT...'}</div>
          </div>
          <div className="card-body"><HashRibbonsChart hrHist={hrHist} mob={mob} /></div>
        </div>
        <PriceLevels price={live.price} margin={calc.margin} mob={mob} rp={calc.rp} sthRp={calc.sthRp} lthRp={calc.lthRp} w200={calc.sma200} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">⛏ Hash Ribbons</div></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: ribbonDown ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', borderRadius: 10, border: `1px solid ${ribbonDown ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}` }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: ribbonDown ? DS.up : DS.down }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{ribbonDown ? 'Capitulation Mineurs' : 'Mineurs en expansion'}</div>
                  <div style={{ fontSize: 15, color: DS.text2, marginTop: 2 }}>{ribbonDown ? 'SMA30 < SMA60 — signal d\'achat historique' : 'SMA30 > SMA60 — croissance du hashrate'}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: '12px 14px', background: DS.borderLight, borderRadius: 8 }}>
                  <div style={{ fontSize: 14, color: DS.text3, marginBottom: 4 }}>SMA 30j</div>
                  <div style={{ fontSize: 15, fontWeight: 600, fontFamily: DS.mono }}>{`${sma30.toFixed(0)} EH/s`}</div>
                </div>
                <div style={{ padding: '12px 14px', background: DS.borderLight, borderRadius: 8 }}>
                  <div style={{ fontSize: 14, color: DS.text3, marginBottom: 4 }}>SMA 60j</div>
                  <div style={{ fontSize: 15, fontWeight: 600, fontFamily: DS.mono }}>{`${sma60.toFixed(0)} EH/s`}</div>
                </div>
              </div>
              <div style={{ fontSize: 15, color: DS.text2, lineHeight: 1.6 }}>{INFO.hash}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">💰 Puell Multiple</div></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 42, fontWeight: 700, fontFamily: DS.mono, color: calc.puell < 0.5 ? DS.up : calc.puell > 4 ? DS.down : DS.text }}>{calc.puell.toFixed(2)}</div>
                <div style={{ fontSize: 15, color: DS.text3, marginTop: 4 }}>Revenu mineur / Moyenne 365j</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['< 0.5 — Zone d\'achat (sous-revenue)', '0.5 - 1.0 — Recovery', '1.0 - 2.0 — Neutre', '2.0 - 4.0 — Surprofit', '> 4.0 — Zone de top'].map((t, i) => {
                  const colors = [DS.up, '#34d399', DS.text2, DS.warn, DS.down];
                  const thresholds = [0.5, 1.0, 2.0, 4.0, Infinity];
                  const active = i === 0 ? calc.puell < 0.5 : calc.puell >= [0, 0.5, 1.0, 2.0, 4.0][i] && calc.puell < thresholds[i];
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 6, background: active ? 'rgba(249,115,22,0.06)' : 'transparent', border: active ? '1px solid rgba(249,115,22,0.2)' : '1px solid transparent' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[i], opacity: active ? 1 : 0.4 }} />
                      <div style={{ fontSize: 15, color: active ? DS.text : DS.text3 }}>{t}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 15, color: DS.text2, lineHeight: 1.6, marginTop: 8 }}>{INFO.puell}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

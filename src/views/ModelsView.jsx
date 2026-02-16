import React from 'react';
import { DS, DSCard } from '../config/design';
import { INFO } from '../config/constants';
import { fP } from '../utils/format';
import StatCard from '../components/StatCard';
import RainbowChart from '../components/RainbowChart';
import MonteCarloChart from '../components/MonteCarloChart';
import PiCycleChart from '../components/PiCycleChart';
import ImagePlaceholder from '../components/ImagePlaceholder';

export default function ModelsView({ live, calc, hist, mob }) {
  // ─── Pi Cycle logic ───
  const prices = hist?.prices || [];
  let lastWithMAs = null;
  for (let pi = prices.length - 1; pi >= 0; pi--) {
    if (prices[pi].ma111 && prices[pi].ma350x2) { lastWithMAs = prices[pi]; break; }
  }
  const ma111 = lastWithMAs ? lastWithMAs.ma111 : 0;
  const ma350x2 = lastWithMAs ? lastWithMAs.ma350x2 : 0;
  const crosses = hist?.crosses || [];
  const gapAbs = ma350x2 - ma111;
  const isCrossed = ma111 >= ma350x2 && ma111 > 0;
  const proximity = ma350x2 > 0 ? Math.min(100, (ma111 / ma350x2) * 100) : 0;

  let stLabel, stColor, stBg, stDesc;
  if (isCrossed) { stLabel = 'CROISEMENT ACTIF'; stColor = DSCard.down; stBg = 'rgba(239,68,68,0.08)'; stDesc = 'Le 111 DMA a croisé le 350 DMA x2 — signal de top historique'; }
  else if (proximity > 90) { stLabel = 'ZONE CRITIQUE'; stColor = DSCard.warn; stBg = 'rgba(245,158,11,0.08)'; stDesc = 'Les moyennes convergent rapidement — surveillance requise'; }
  else if (proximity > 75) { stLabel = 'CONVERGENCE'; stColor = DSCard.warn; stBg = 'rgba(245,158,11,0.06)'; stDesc = 'Les moyennes se rapprochent — tendance à surveiller'; }
  else { stLabel = 'ZONE SÛRE'; stColor = DSCard.up; stBg = 'rgba(16,185,129,0.08)'; stDesc = 'Les moyennes sont bien espacées — pas de signal de top'; }

  const lastCross = crosses.length > 0 ? crosses[crosses.length - 1] : null;
  const daysSinceLastCross = lastCross ? Math.floor((Date.now() - lastCross.date.getTime()) / 86400000) : null;

  const piZones = [
    { label: '< 75%', desc: 'Zone sûre', c: DSCard.up, min: 0, max: 75 },
    { label: '75-90%', desc: 'Convergence', c: DSCard.warn, min: 75, max: 90 },
    { label: '90-100%', desc: 'Critique', c: DSCard.down, min: 90, max: 100 },
    { label: '≥ 100%', desc: 'Croisement = TOP', c: DSCard.down, min: 100, max: Infinity }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ═══════════════════ PI CYCLE ═══════════════════ */}
      <ImagePlaceholder variant="section" section="picycle" overlay="bottom" src="/panel7.png" />
      <div className="stat-grid">
        <StatCard label="111 DMA" value={`$${fP(ma111)}`} status="neutral" />
        <StatCard label="350 DMA x2" value={`$${fP(ma350x2)}`} status="neutral" />
        <StatCard label="Proximité" value={`${proximity.toFixed(1)}%`} detail={isCrossed ? 'CROISÉ' : `Gap: $${fP(gapAbs)}`} status={isCrossed ? 'down' : proximity > 90 ? 'down' : proximity > 75 ? 'warn' : 'up'} />
        <StatCard label="Statut" value={stLabel} status={isCrossed ? 'down' : proximity > 90 ? 'down' : proximity > 75 ? 'warn' : 'up'} />
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">📈 Pi Cycle Top</div></div>
        <div className="card-body"><PiCycleChart hist={hist} mob={mob} /></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">🎯 Statut Actuel</div></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: stBg, borderRadius: 10, border: `1px solid ${stColor}22` }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: stColor }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{stLabel}</div>
                  <div style={{ fontSize: 15, color: DSCard.text2, marginTop: 2 }}>{stDesc}</div>
                </div>
              </div>
              {lastCross && (
                <div style={{ padding: '12px 14px', background: DSCard.borderLight, borderRadius: 8 }}>
                  <div style={{ fontSize: 14, color: DSCard.text3, marginBottom: 4 }}>Dernier croisement</div>
                  <div style={{ fontSize: 15, fontWeight: 600, fontFamily: DS.mono }}>{daysSinceLastCross} jours</div>
                </div>
              )}
              <div style={{ fontSize: 15, color: DSCard.text2, lineHeight: 1.6 }}>{INFO.picycle}</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">📊 Zones de Proximité</div></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {piZones.map((z, i) => {
                const active = proximity >= z.min && proximity < z.max;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: active ? z.c + '11' : 'transparent', borderRadius: 8, border: active ? `1px solid ${z.c}33` : '1px solid transparent' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: z.c, opacity: active ? 1 : 0.3 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: active ? 600 : 400 }}>{z.label}</div>
                      <div style={{ fontSize: 14, color: DSCard.text3 }}>{z.desc}</div>
                    </div>
                    {active && <div style={{ fontSize: 15, fontWeight: 600, color: z.c }}>◀</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ RAINBOW + MONTE CARLO ═══════════════════ */}
      <ImagePlaceholder variant="section" section="rainbow" overlay="bottom" src="/panel8.png" />
      <div className="card" style={{ position: 'relative' }}>
        <div className="composite-hover-img">
          <img src="/pi.png" alt="" />
        </div>
        <div className="card-header" style={{ position: 'relative', zIndex: 1 }}><div className="card-title">Rainbow Chart</div></div>
        <div className="card-body" style={{ position: 'relative', zIndex: 1 }}>
          <RainbowChart hist={hist} currentPrice={live.price} mob={mob} />
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Monte Carlo Simulation</div></div>
        <div className="card-body">
          <MonteCarloChart mc={calc.mc} price={live.price} mob={mob} rp={calc.rp} w200={calc.sma200} cvdd={calc.cvdd} />
          <div style={{ marginTop: 20, padding: '16px 18px', background: DSCard.bgHeader, borderRadius: 10, border: `1px solid ${DSCard.borderLight}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: DSCard.text, marginBottom: 10 }}>Comment lire ce graphique ?</div>
            <div style={{ fontSize: 15, color: DSCard.text2, lineHeight: 1.7 }}>
              La simulation Monte Carlo projette 200 trajectoires de prix possibles sur 365 jours, basees sur la volatilite historique recente du BTC. Chaque trajectoire simule un chemin aleatoire (mouvement brownien geometrique) que le prix pourrait suivre.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 12, marginTop: 14 }}>
              <div style={{ padding: '10px 12px', background: DSCard.bgHover, borderRadius: 8, border: `1px solid ${DSCard.borderLight}` }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: DSCard.accent, marginBottom: 4 }}>Bande foncee (P25-P75)</div>
                <div style={{ fontSize: 14, color: DSCard.text3, lineHeight: 1.5 }}>50% des simulations tombent dans cette zone. C'est le scenario le plus probable.</div>
              </div>
              <div style={{ padding: '10px 12px', background: DSCard.bgHover, borderRadius: 8, border: `1px solid ${DSCard.borderLight}` }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: DSCard.accent, marginBottom: 4, opacity: 0.6 }}>Bande claire (P5-P95)</div>
                <div style={{ fontSize: 14, color: DSCard.text3, lineHeight: 1.5 }}>90% des simulations. Les extremites representent les scenarios bull/bear extremes.</div>
              </div>
              <div style={{ padding: '10px 12px', background: DSCard.bgHover, borderRadius: 8, border: `1px solid ${DSCard.borderLight}` }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: DSCard.accent, marginBottom: 4 }}>Ligne mediane (P50)</div>
                <div style={{ fontSize: 14, color: DSCard.text3, lineHeight: 1.5 }}>La trajectoire mediane : autant de simulations au-dessus qu'en-dessous.</div>
              </div>
              <div style={{ padding: '10px 12px', background: DSCard.bgHover, borderRadius: 8, border: `1px solid ${DSCard.borderLight}` }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  <span style={{ color: DSCard.up }}>P95</span> / <span style={{ color: DSCard.down }}>P5</span>
                </div>
                <div style={{ fontSize: 14, color: DSCard.text3, lineHeight: 1.5 }}>P95 (vert) = scenario tres haussier. P5 (rouge) = scenario tres baissier.</div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: DSCard.text3, marginTop: 12, fontStyle: 'italic', lineHeight: 1.5 }}>
              Ce n'est pas une prediction mais une modelisation probabiliste. Le marche crypto peut depasser les extremes simules lors d'evenements imprevus (black swan, regulation, adoption massive).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

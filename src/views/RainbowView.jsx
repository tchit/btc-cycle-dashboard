import React from 'react';
import { DSCard } from '../config/design';
import RainbowChart from '../components/RainbowChart';
import MonteCarloChart from '../components/MonteCarloChart';
import ImagePlaceholder from '../components/ImagePlaceholder';

export default function RainbowView({ live, calc, hist, mob }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Section banner — Replace with rainbow spectrum / prismatic illustration */}
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

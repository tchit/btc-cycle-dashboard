import React from 'react';
import DualPanel from '../components/DualPanel';
import ScenarioBar from '../components/ScenarioBar';
import ScenarioGauge from '../components/ScenarioGauge';
import TimelineVertical from '../components/TimelineVertical';
import FactorList from '../components/FactorList';
import {
  BOTTOM_PROJECTION,
  ATH_PROJECTION,
  PROJ_SCENARIOS,
  TIMELINE,
  DIFFERENTIATORS,
} from '../data/projections';

export default function ProjectionsView({ live, calc, mob }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.02em' }}>
          Scénario de bottom projeté
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          Si les patterns historiques se maintiennent — projections de prix et timing pour le Cycle 4.
        </div>
      </div>

      {/* Section 1: Dual Panel — Projections Bottom + ATH */}
      <DualPanel
        panels={[
          {
            title: BOTTOM_PROJECTION.title,
            titleColor: 'var(--gold)',
            consensusLabel: BOTTOM_PROJECTION.consensusLabel,
            consensus: BOTTOM_PROJECTION.consensus,
            consensusDetail: BOTTOM_PROJECTION.consensusDetail,
            dateMethods: BOTTOM_PROJECTION.dateMethods,
            priceMethods: BOTTOM_PROJECTION.priceMethods,
          },
          {
            title: ATH_PROJECTION.title,
            titleColor: 'var(--gold)',
            consensusLabel: ATH_PROJECTION.consensusLabel,
            consensus: ATH_PROJECTION.consensus,
            consensusDetail: ATH_PROJECTION.consensusDetail,
            dateMethods: ATH_PROJECTION.dateMethods,
            priceMethods: ATH_PROJECTION.priceMethods,
          },
        ]}
      />

      {/* Section 2: Quatre scénarios */}
      <div>
        <div className="dt-title">Quatre scénarios selon la profondeur de zone</div>
        <div className="dt-subtitle">Scénarios de bottom projetés classés par sévérité</div>
        <ScenarioBar scenarios={PROJ_SCENARIOS} />
        <ScenarioGauge scenarios={PROJ_SCENARIOS} currentPrice={live?.price} mob={mob} />
      </div>

      {/* Section 3: Timeline + Différenciateurs */}
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1.2fr 1fr', gap: 24, alignItems: 'start' }}>
        <div>
          <div className="dt-title">Synthèse de la timeline</div>
          <div style={{ marginTop: 16 }}>
            <TimelineVertical events={TIMELINE} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="dt-title">Différenciateurs clés du Cycle 4</div>
          <FactorList
            title={DIFFERENTIATORS.reduce.title}
            accent="green"
            items={DIFFERENTIATORS.reduce.items}
          />
          <FactorList
            title={DIFFERENTIATORS.increase.title}
            accent="red"
            items={DIFFERENTIATORS.increase.items}
          />
        </div>
      </div>
    </div>
  );
}

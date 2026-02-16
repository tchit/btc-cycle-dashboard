import React from 'react';
import DualPanel from '../components/DualPanel';
import ScenarioBar from '../components/ScenarioBar';
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
          Projected Bottom Scenario
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          If historical patterns hold — price and timing projections for Cycle 4.
        </div>
      </div>

      {/* Section 1: Dual Panel — Bottom + ATH Projections */}
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

      {/* Section 2: Four Scenarios */}
      <div>
        <div className="dt-title">Four Scenarios Based on Zone Depth</div>
        <div className="dt-subtitle">Projected cycle bottom scenarios ranked by severity</div>
        <ScenarioBar scenarios={PROJ_SCENARIOS} />
      </div>

      {/* Section 3: Timeline + Differentiators */}
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1.2fr 1fr', gap: 24, alignItems: 'start' }}>
        <div>
          <div className="dt-title">Timeline Synthesis</div>
          <div style={{ marginTop: 16 }}>
            <TimelineVertical events={TIMELINE} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="dt-title">Key Differentiators for Cycle 4</div>
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

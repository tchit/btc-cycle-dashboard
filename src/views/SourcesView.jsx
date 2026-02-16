import React from 'react';
import DataTable from '../components/DataTable';
import MethodologyBlock from '../components/MethodologyBlock';
import { EXTERNAL_SOURCES, COMPUTED_METRICS, METHODOLOGY_NOTES } from '../data/sources';

export default function SourcesView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.02em' }}>
          Sources & Methodology
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          Data sources, computation methods, and dynamic content definitions used throughout the analysis.
        </div>
      </div>

      {/* Section 1: External Sources (grouped sub-sections) */}
      <MethodologyBlock
        title="External Sources"
        subtitle="Figures not reproducible from our own data — sourced from third-party research and reporting."
        sections={EXTERNAL_SOURCES.map(s => ({ title: s.section, items: s.items }))}
      />

      {/* Section 2: Computed Metrics table */}
      <DataTable
        title="Computed Metrics"
        subtitle="Metrics computed server-side from raw API data — not sourced from external URLs."
        columns={COMPUTED_METRICS.columns}
        rows={COMPUTED_METRICS.rows}
      />

      {/* Section 3: Methodology Notes (ordered list) */}
      <MethodologyBlock
        title="Methodology & Data Notes"
        subtitle="Assumptions, derivations, and verification notes for all computed values."
        items={METHODOLOGY_NOTES}
        ordered
      />
    </div>
  );
}

import React from 'react';
import DataTable from '../components/DataTable';
import { ALL_ZONES } from '../data/zone-history';

export default function ZoneAnalysisView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.02em' }}>
          Zone Duration Analysis
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          How long price stays at each depth level across bear market cycles.
        </div>
      </div>

      {ALL_ZONES.map((zone, i) => (
        <DataTable
          key={i}
          title={zone.title}
          subtitle={zone.subtitle}
          columns={zone.columns}
          rows={zone.rows}
          notes={zone.notes}
          note={zone.trend && !zone.notes ? `Trend: ${zone.trend}` : undefined}
        />
      ))}
    </div>
  );
}

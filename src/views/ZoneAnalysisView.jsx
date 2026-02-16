import React from 'react';
import { DS } from '../config/design';
import DataTable from '../components/DataTable';
import PriceDepthGauge from '../components/PriceDepthGauge';
import ZoneDurationChart from '../components/ZoneDurationChart';
import ZoneStatusStrip from '../components/ZoneStatusStrip';
import { getAllZones, ZONE_DURATION_DATA, ZONE_DEFINITIONS, getCurrentZoneStatus } from '../data/zone-history';

export default function ZoneAnalysisView({ live, calc, mob }) {
  const zones = getAllZones();
  const status = getCurrentZoneStatus();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.02em' }}>
          Analyse de durée par zone
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          Combien de temps le prix reste à chaque niveau de profondeur lors des cycles bear.
        </div>
      </div>

      {/* Zone status progression */}
      <ZoneStatusStrip status={status} definitions={ZONE_DEFINITIONS} mob={mob} />

      {/* Price Depth Gauge */}
      <div style={{ padding: 16, background: DS.surface, borderRadius: 10, border: `1px solid ${DS.border}`, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: DS.text2, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Niveaux on-chain
        </div>
        <PriceDepthGauge price={live?.price} levels={calc?.liveLevels} mob={mob} />
      </div>

      {/* Zone Duration Chart */}
      <div style={{ padding: 16, background: DS.surface, borderRadius: 10, border: `1px solid ${DS.border}`, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: DS.text2, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Durée par zone — comparaison cyclique
        </div>
        <ZoneDurationChart data={ZONE_DURATION_DATA} definitions={ZONE_DEFINITIONS} mob={mob} />
      </div>

      {zones.map((zone, i) => (
        <DataTable
          key={i}
          title={zone.title}
          subtitle={zone.subtitle}
          columns={zone.columns}
          rows={zone.rows}
          notes={zone.notes}
          note={zone.trend && !zone.notes ? `Tendance : ${zone.trend}` : undefined}
        />
      ))}
    </div>
  );
}

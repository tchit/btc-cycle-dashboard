import React from 'react';
import { DS } from '../config/design';
import DataTable from '../components/DataTable';
import PriceDepthGauge from '../components/PriceDepthGauge';
import ZoneDurationRingGauge from '../components/ZoneDurationRingGauge';
import ZoneStatusStrip from '../components/ZoneStatusStrip';
import { getAllZones, ZONE_DURATION_DATA, ZONE_DEFINITIONS, getCurrentZoneStatus } from '../data/zone-history';

const hudCard = {
  background: 'rgba(26, 28, 37, 0.85)',
  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
  border: '1px solid rgba(204, 255, 0, 0.06)',
  boxShadow: '0 0 24px rgba(204, 255, 0, 0.02)',
  padding: 20,
  marginBottom: 20,
};

const eyebrow = {
  fontSize: 13,
  fontWeight: 600,
  fontFamily: DS.display,
  color: DS.gold,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 14,
};

export default function ZoneAnalysisView({ live, calc, mob }) {
  const zones = getAllZones();
  const status = getCurrentZoneStatus();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: DS.display, fontSize: 28, fontWeight: 700, color: DS.gold, letterSpacing: '0.02em' }}>
          Analyse de durée par zone
        </div>
        <div style={{ fontSize: 14, color: DS.text3 }}>
          Combien de temps le prix reste à chaque niveau de profondeur lors des cycles bear.
        </div>
      </div>

      {/* Zone status progression */}
      <ZoneStatusStrip status={status} definitions={ZONE_DEFINITIONS} history={ZONE_DURATION_DATA} mob={mob} />

      {/* Price Depth Gauge */}
      <div style={hudCard}>
        <div style={eyebrow}>Niveaux on-chain</div>
        <PriceDepthGauge price={live?.price} levels={calc?.liveLevels} mob={mob} />
      </div>

      {/* Zone Duration Ring Gauge */}
      <div style={hudCard}>
        <div style={eyebrow}>Durée par zone — comparaison cyclique</div>
        <ZoneDurationRingGauge data={ZONE_DURATION_DATA} definitions={ZONE_DEFINITIONS} mob={mob} />
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

import React from 'react';
import { DS } from '../config/design';
import DataTable from '../components/DataTable';
import PriceDepthGauge from '../components/PriceDepthGauge';
import ZoneDurationChart from '../components/ZoneDurationChart';
import ZoneStatusStrip from '../components/ZoneStatusStrip';
import { getAllZones, ZONE_DURATION_DATA, ZONE_DEFINITIONS, getCurrentZoneStatus } from '../data/zone-history';

const hudCard = {
  padding: '20px 24px',
  background: DS.surface,
  clipPath: 'var(--clip-card)',
  border: `1.5px solid ${DS.border}`,
  boxShadow: '0 0 20px rgba(204, 255, 0, 0.06)',
  marginBottom: 20,
};

const hudLabel = {
  fontSize: 13,
  fontWeight: 700,
  fontFamily: DS.display,
  color: DS.accent,
  marginBottom: 14,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
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
      <ZoneStatusStrip status={status} definitions={ZONE_DEFINITIONS} mob={mob} />

      {/* Price Depth Gauge */}
      <div style={hudCard}>
        <div style={hudLabel}>Niveaux on-chain</div>
        <PriceDepthGauge price={live?.price} levels={calc?.liveLevels} mob={mob} />
      </div>

      {/* Zone Duration Chart */}
      <div style={hudCard}>
        <div style={hudLabel}>Durée par zone — comparaison cyclique</div>
        <ZoneDurationChart data={ZONE_DURATION_DATA} definitions={ZONE_DEFINITIONS} mob={mob} />
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ZONE_DEFINITIONS.map(def => (
            <div key={def.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
                background: def.colorHex, flexShrink: 0,
                boxShadow: `0 0 6px ${def.colorHex}60`,
              }} />
              <span style={{ fontSize: 12, fontFamily: DS.mono, color: def.colorHex, fontWeight: 700, minWidth: 24 }}>
                {def.shortName}
              </span>
              <span style={{ fontSize: 12, fontFamily: DS.font, color: DS.text2 }}>
                {def.name}
              </span>
            </div>
          ))}
        </div>
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

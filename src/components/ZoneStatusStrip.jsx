import React from 'react';
import { DS } from '../config/design';

export default function ZoneStatusStrip({ status, definitions, mob }) {
  if (!status || !definitions) return null;

  const zones = status.zones;

  return (
    <div className="zs-strip">
      {zones.map((z, i) => {
        const def = definitions.find(d => d.id === z.id) || {};
        const connectorState = i < zones.length - 1
          ? (zones[i + 1].state === 'future' ? 'future' : 'completed')
          : null;

        return (
          <React.Fragment key={z.id}>
            <div className="zs-node">
              <div
                className="zs-dot"
                data-state={z.state}
                style={{
                  background: z.state !== 'future' ? def.colorHex : undefined,
                  color: def.colorHex,
                  boxShadow: z.state === 'active'
                    ? `0 0 16px ${def.colorHex}, 0 0 6px ${def.colorHex}`
                    : (z.state === 'completed' ? `0 0 8px ${def.colorHex}40` : undefined),
                }}
              />
              <div style={{
                fontSize: 12,
                fontFamily: DS.display,
                fontWeight: z.state === 'active' ? 700 : 500,
                color: z.state === 'future' ? DS.text3 : (z.state === 'active' ? def.colorHex : DS.text2),
                letterSpacing: '0.04em',
              }}>
                {def.shortName}
              </div>
              <div style={{
                fontSize: 11,
                fontFamily: DS.mono,
                color: z.state === 'active' ? DS.gold : DS.text3,
                fontWeight: z.state === 'active' ? 700 : 400,
              }}>
                {z.duration}
              </div>
            </div>
            {connectorState && (
              <div
                className="zs-connector"
                data-state={connectorState}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

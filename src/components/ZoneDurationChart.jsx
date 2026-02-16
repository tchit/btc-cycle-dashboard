import React from 'react';
import { DS } from '../config/design';

export default function ZoneDurationChart({ data, definitions, mob }) {
  if (!data || !definitions) return null;

  const W = 700, H = 240;
  const labelW = 90, barAreaW = 480;
  const barH = 32, barGap = 18;
  const topPad = 16;

  const totals = data.map(d => d.zones.reduce((s, v) => s + v, 0));
  const maxTotal = Math.max(...totals);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      {data.map((d, i) => {
        const total = totals[i];
        const barW = (total / maxTotal) * barAreaW;
        const y = topPad + i * (barH + barGap);
        let xOffset = labelW;

        return (
          <g key={d.cycle}>
            <text
              x={labelW - 12} y={y + barH / 2 + 5}
              textAnchor="end"
              style={{
                fontSize: 13,
                fontFamily: DS.display,
                fill: d.isCurrent ? DS.gold : DS.text2,
                fontWeight: d.isCurrent ? 700 : 500,
                letterSpacing: '0.02em',
              }}>
              {d.cycle}
            </text>

            {d.zones.map((months, j) => {
              if (months <= 0) return null;
              const segW = (months / total) * barW;
              const segX = xOffset;
              xOffset += segW;
              const pct = (months / total) * 100;

              return (
                <g key={j}>
                  <rect
                    x={segX} y={y} width={segW} height={barH}
                    rx={2}
                    fill={definitions[j]?.colorHex || DS.text3}
                    opacity={0.75}
                  />
                  {pct > 10 && (
                    <text
                      x={segX + segW / 2} y={y + barH / 2 + 5}
                      textAnchor="middle"
                      style={{
                        fontSize: 11,
                        fontFamily: DS.mono,
                        fill: DS.text,
                        fontWeight: 700,
                      }}>
                      {months >= 1 ? `${Math.round(months)}mo` : `${months}mo`}
                    </text>
                  )}
                </g>
              );
            })}

            <text
              x={labelW + barW + 12} y={y + barH / 2 + 5}
              style={{
                fontSize: 12,
                fontFamily: DS.mono,
                fill: d.isCurrent ? DS.gold : DS.text3,
                fontWeight: 700,
              }}>
              {`${total.toFixed(1)}mo`}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      {(() => {
        const legendY = topPad + data.length * (barH + barGap) + 12;
        let legendX = labelW;
        return definitions.map((def) => {
          const thisX = legendX;
          legendX += mob ? 70 : 115;
          return (
            <g key={def.id}>
              <circle cx={thisX + 5} cy={legendY + 6} r={6} fill={def.colorHex} opacity={0.8} />
              <text
                x={thisX + 16} y={legendY + 10}
                style={{ fontSize: 11, fontFamily: DS.display, fill: DS.text2, fontWeight: 500 }}>
                {def.shortName}
              </text>
            </g>
          );
        });
      })()}
    </svg>
  );
}

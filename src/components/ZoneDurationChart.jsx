import React from 'react';
import { DS } from '../config/design';

export default function ZoneDurationChart({ data, definitions, mob }) {
  if (!data || !definitions) return null;

  const W = 700, H = 220;
  const labelW = 80, barAreaW = 500, rightPad = 60;
  const barH = 28, barGap = 16;
  const topPad = 20;

  // Normalize by max total
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
            {/* Cycle label */}
            <text
              x={labelW - 10} y={y + barH / 2 + 4}
              textAnchor="end"
              style={{
                fontSize: 12,
                fontFamily: DS.display,
                fill: d.isCurrent ? DS.gold : DS.text2,
                fontWeight: d.isCurrent ? 700 : 400,
              }}>
              {d.cycle}
            </text>

            {/* Stacked segments */}
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
                    rx={3}
                    fill={definitions[j]?.colorHex || DS.text3}
                    opacity={0.7}
                  />
                  {/* Label inside segment if wide enough */}
                  {pct > 8 && (
                    <text
                      x={segX + segW / 2} y={y + barH / 2 + 4}
                      textAnchor="middle"
                      style={{
                        fontSize: 10,
                        fontFamily: DS.mono,
                        fill: DS.text,
                        fontWeight: 600,
                      }}>
                      {months >= 1 ? `${Math.round(months)}mo` : `${months}mo`}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Total duration to the right */}
            <text
              x={labelW + barW + 10} y={y + barH / 2 + 4}
              style={{
                fontSize: 11,
                fontFamily: DS.mono,
                fill: d.isCurrent ? DS.gold : DS.text3,
                fontWeight: 600,
              }}>
              {`${total.toFixed(1)}mo`}
            </text>
          </g>
        );
      })}

      {/* Legend at bottom */}
      {(() => {
        const legendY = topPad + data.length * (barH + barGap) + 10;
        let legendX = labelW;
        return definitions.map((def, i) => {
          const thisX = legendX;
          legendX += mob ? 65 : 110;
          return (
            <g key={def.id}>
              <circle cx={thisX} cy={legendY + 6} r={5} fill={def.colorHex} />
              <text
                x={thisX + 10} y={legendY + 10}
                style={{ fontSize: 10, fontFamily: DS.font, fill: DS.text2 }}>
                {def.shortName}
              </text>
            </g>
          );
        });
      })()}
    </svg>
  );
}

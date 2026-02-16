import React, { useState, useEffect } from 'react';
import { DS } from '../config/design';

export default function ZoneDurationChart({ data, definitions, mob }) {
  const [hover, setHover] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!data || !definitions) return null;

  const W = mob ? 400 : 900;
  const H = mob ? 280 : 320;
  const padL = mob ? 70 : 110;
  const padR = mob ? 60 : 80;
  const chartW = W - padL - padR;
  const topPad = 34;
  const rowGap = mob ? 56 : 66;
  const barH = mob ? 14 : 16;

  const totals = data.map(d => d.zones.reduce((s, v) => s + v, 0));
  const maxMonths = Math.ceil(Math.max(...totals) / 6) * 6;

  const x = (months) => padL + (months / maxMonths) * chartW;

  const ticks = [];
  for (let m = 6; m <= maxMonths; m += 6) ticks.push(m);

  // Build span data for each cycle
  const cycleSpans = data.map((d) => {
    const spans = [];
    let offset = 0;
    d.zones.forEach((months, j) => {
      if (months > 0) {
        spans.push({
          zone: j,
          start: offset,
          end: offset + months,
          months,
          def: definitions[j],
        });
      }
      offset += months;
    });
    return spans;
  });

  // Compute tooltip position in container-relative pixels
  const getTooltipPos = () => {
    if (!hover) return null;
    const d = data[hover.ci];
    const span = cycleSpans[hover.ci].find(s => s.zone === hover.zi);
    if (!span) return null;
    const midX = x(span.start + span.months / 2);
    const rowY = topPad + hover.ci * rowGap + rowGap / 2;
    return {
      leftPct: (midX / W) * 100,
      topPct: ((rowY - barH / 2 - 8) / H) * 100,
    };
  };

  const ttPos = getTooltipPos();

  return (
    <div
      className={`zone-duration ${mounted ? 'zone-duration--mounted' : ''}`}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="zone-duration__svg"
        style={{ width: '100%', height: 'auto' }}
      >
        <defs>
          <filter id="zdPhaseGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="zdCursorGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Grid lines + tick labels */}
        <text
          x={x(0)} y={topPad - 10}
          textAnchor="middle"
          style={{ fontSize: 10, fontFamily: DS.mono, fill: DS.text3 }}
        >
          0
        </text>
        {ticks.map(m => (
          <g key={`g${m}`}>
            <line
              x1={x(m)} y1={topPad}
              x2={x(m)} y2={topPad + data.length * rowGap - 12}
              stroke="rgba(255,255,255,0.03)" strokeWidth={1}
            />
            <text
              x={x(m)} y={topPad - 10}
              textAnchor="middle"
              style={{ fontSize: 10, fontFamily: DS.mono, fill: DS.text3 }}
            >
              {m}
            </text>
          </g>
        ))}

        {/* Left axis */}
        <line
          x1={padL} y1={topPad}
          x2={padL} y2={topPad + data.length * rowGap - 12}
          stroke="rgba(255,255,255,0.05)" strokeWidth={1}
        />

        {/* Cycle rows */}
        {data.map((d, i) => {
          const total = totals[i];
          const y = topPad + i * rowGap + rowGap / 2;
          const barTop = y - barH / 2;
          const spans = cycleSpans[i];

          return (
            <g key={d.cycle} className="zone-dur-row">
              {/* Alternating row wash */}
              {i % 2 === 0 && (
                <rect
                  x={padL} y={barTop - 16}
                  width={chartW} height={barH + 32}
                  fill="rgba(255,255,255,0.008)" rx={0}
                />
              )}

              {/* Base track line */}
              <line
                x1={padL} y1={y}
                x2={padL + chartW} y2={y}
                stroke={DS.border} strokeWidth={1.5}
              />

              {/* Cycle label */}
              <text
                x={padL - 16} y={y + 5}
                textAnchor="end"
                style={{
                  fontSize: mob ? 11 : 13,
                  fontFamily: DS.display,
                  fill: d.isCurrent ? DS.accent : DS.text2,
                  fontWeight: d.isCurrent ? 700 : 400,
                }}
              >
                {d.cycle}
              </text>

              {/* Zone phase segments */}
              {spans.map((span) => {
                const sx = x(span.start);
                const ex = x(span.end);
                const sw = Math.max(4, ex - sx);
                const isHov = hover?.ci === i && hover?.zi === span.zone;
                const isCurrent = d.isCurrent;

                return (
                  <g key={`s${i}-${span.zone}`}>
                    {/* Phase bar */}
                    <rect
                      x={sx} y={isHov ? barTop - 3 : barTop}
                      width={sw} height={isHov ? barH + 6 : barH}
                      rx={6}
                      fill={span.def.colorHex}
                      filter={isCurrent ? 'url(#zdPhaseGlow)' : undefined}
                      style={{
                        transition: 'all 150ms cubic-bezier(0.4,0,0.2,1)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={() => setHover({ ci: i, zi: span.zone })}
                      onMouseLeave={() => setHover(null)}
                      onTouchStart={() =>
                        setHover(isHov ? null : { ci: i, zi: span.zone })
                      }
                    />

                    {/* Hover glow border */}
                    {isHov && (
                      <rect
                        x={sx} y={barTop - 3}
                        width={sw} height={barH + 6}
                        rx={6} fill="none"
                        stroke={span.def.colorHex}
                        strokeWidth={1}
                        strokeOpacity={0.5}
                        style={{ filter: `drop-shadow(0 0 10px ${span.def.colorHex}88)` }}
                      />
                    )}

                    {/* Zone name inside bar (wide spans) */}
                    {sw > 44 && (
                      <text
                        x={sx + sw / 2} y={y + (mob ? 3.5 : 4)}
                        textAnchor="middle"
                        style={{
                          fontSize: mob ? 8 : 10,
                          fontFamily: DS.display,
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          fill: DS.bg,
                          pointerEvents: 'none',
                        }}
                      >
                        {span.def.shortName}
                      </text>
                    )}

                    {/* Duration below span (wide only) */}
                    {sw > 32 && (
                      <text
                        x={sx + sw / 2} y={barTop + barH + 14}
                        textAnchor="middle"
                        style={{
                          fontSize: 9,
                          fontFamily: DS.mono,
                          fill: span.def.colorHex,
                          opacity: 0.65,
                          pointerEvents: 'none',
                        }}
                      >
                        {span.months >= 1
                          ? `${Math.round(span.months)}mo`
                          : `${span.months}mo`}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Milestone dots at zone transitions */}
              {spans.slice(1).map((span) => {
                const mx = x(span.start);
                const circleY = barTop + barH + 4;
                return (
                  <g key={`m${i}-${span.zone}`}>
                    <circle
                      cx={mx} cy={circleY}
                      r={3}
                      fill={DS.gold}
                      style={{ pointerEvents: 'none' }}
                    />
                    <line
                      x1={mx} y1={barTop - 2}
                      x2={mx} y2={barTop + barH + 2}
                      stroke={DS.gold}
                      strokeWidth={1}
                      strokeDasharray="3,2"
                      opacity={0.4}
                    />
                  </g>
                );
              })}

              {/* Current cycle: cursor marker at end */}
              {d.isCurrent && (() => {
                const endX = x(total);
                const r = mob ? 6 : 7;
                return (
                  <g>
                    {/* Dashed line above cursor */}
                    <line
                      x1={endX} y1={barTop - 8}
                      x2={endX} y2={y - r - 2}
                      stroke={DS.warn}
                      strokeWidth={1}
                      strokeDasharray="4,3"
                      opacity={0.5}
                    />
                    {/* Pulse ring */}
                    <circle
                      cx={endX} cy={y} r={r}
                      fill="none" stroke={DS.warn} strokeWidth={1.5} opacity={0}
                    >
                      <animate attributeName="r" from={r} to={r * 3} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    {/* Main cursor dot */}
                    <circle
                      cx={endX} cy={y} r={r}
                      fill={DS.warn}
                      filter="url(#zdCursorGlow)"
                    />
                    {/* Inner highlight */}
                    <circle
                      cx={endX} cy={y}
                      r={r * 0.35}
                      fill={DS.text}
                      opacity={0.6}
                    />
                    {/* NOW label */}
                    <text
                      x={endX} y={barTop - 14}
                      textAnchor="middle"
                      style={{
                        fontSize: 10,
                        fontFamily: DS.display,
                        fill: DS.accent,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                      }}
                    >
                      NOW
                    </text>
                  </g>
                );
              })()}

              {/* Total badge — styled like cycle-metric card */}
              <g>
                <rect
                  x={W - padR + 8} y={y - 12}
                  width={mob ? 50 : 60} height={24} rx={4}
                  fill={DS.surface}
                  stroke={
                    d.isCurrent
                      ? 'rgba(204,255,0,0.15)'
                      : 'rgba(255,255,255,0.04)'
                  }
                  strokeWidth={0.5}
                />
                <text
                  x={W - padR + 8 + (mob ? 25 : 30)} y={y + 4}
                  textAnchor="middle"
                  style={{
                    fontSize: 12,
                    fontFamily: DS.mono,
                    fill: d.isCurrent ? DS.accent : DS.text3,
                    fontWeight: 600,
                  }}
                >
                  {`${total.toFixed(1)}mo`}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* HTML glassmorphism tooltip */}
      {hover && ttPos && (() => {
        const d = data[hover.ci];
        const def = definitions[hover.zi];
        const months = d.zones[hover.zi];
        const total = totals[hover.ci];
        const pct = ((months / total) * 100).toFixed(0);

        return (
          <div
            className="zone-dur-tooltip"
            style={{
              left: `${ttPos.leftPct}%`,
              top: `${ttPos.topPct}%`,
              borderColor: `${def.colorHex}80`,
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          >
            <div
              className="zone-dur-tooltip__name"
              style={{ color: def.colorHex, fontFamily: DS.display }}
            >
              {def.shortName} — {def.name.substring(0, 22)}
            </div>
            <div
              className="zone-dur-tooltip__detail"
              style={{ color: DS.text2, fontFamily: DS.mono }}
            >
              {months >= 1
                ? `${Math.round(months)} mois (${pct}%)`
                : `${months} mois (${pct}%)`}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

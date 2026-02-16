import React, { useState, useEffect } from 'react';
import { DS } from '../config/design';

export default function ZoneStatusStrip({ status, definitions, history, mob }) {
  if (!status || !definitions) return null;

  const [mounted, setMounted] = useState(false);
  const [hoverZone, setHoverZone] = useState(null);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const W = mob ? 400 : 1000;
  const H = mob ? 155 : 175;
  const padL = mob ? 20 : 60;
  const padR = mob ? 20 : 60;
  const usable = W - padL - padR;
  const barY = mob ? 50 : 55;
  const barH = mob ? 14 : 16;
  const segW = usable / definitions.length;

  const x = (i) => padL + i * segW;

  // Cursor inside the active zone (proportional to progress)
  const activeIdx = status.activeZone - 1; // 0-indexed
  const progress = status.activeProgress ?? 0.5;
  const cursorX = x(activeIdx) + 2 + (segW - 4) * progress;
  const cursorY = barY + barH / 2;
  const cursorR = mob ? 6 : 8;

  const tooltipLeftPct = (cursorX / W) * 100;
  const activeZone = definitions[status.activeZone - 1];
  const activeStatus = status.zones[status.activeZone - 1];

  return (
    <div className={`zone-roadmap ${mounted ? 'zone-roadmap--mounted' : ''}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        className="zone-roadmap__svg"
      >
        <defs>
          <filter id="zPhaseGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="zCursorGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Base track line */}
        <line
          x1={padL} y1={barY + barH / 2}
          x2={W - padR} y2={barY + barH / 2}
          stroke={DS.border} strokeWidth={2}
        />

        {/* Phase segments — one per zone */}
        <g>
          {definitions.map((def, i) => {
            const zone = status.zones[i];
            const sx = x(i);
            const isActive = zone.state === 'active';
            const isFuture = zone.state === 'future';
            const fullW = segW - 4;
            const barWidth = isActive ? fullW * progress : fullW;

            return (
              <g key={def.id} className="zone-phase-seg">
                {/* Dim background for active zone (unfilled portion) */}
                {isActive && (
                  <rect
                    x={sx + 2} y={barY}
                    width={fullW} height={barH}
                    rx={6}
                    fill={def.colorHex}
                    opacity={0.08}
                  />
                )}
                {/* Dashed outline for active zone unfilled + future zones */}
                {(isActive || isFuture) && (
                  <rect
                    x={sx + 2} y={barY}
                    width={fullW} height={barH}
                    rx={6}
                    fill="none"
                    stroke={def.colorHex}
                    strokeWidth={1}
                    strokeDasharray="6,4"
                    opacity={isActive ? 0.3 : 0.25}
                  />
                )}
                {/* Filled bar (full for completed, partial for active, dim for future) */}
                <rect
                  x={sx + 2} y={barY}
                  width={barWidth} height={barH}
                  rx={6}
                  fill={def.colorHex}
                  filter={isActive ? 'url(#zPhaseGlow)' : undefined}
                  opacity={isFuture ? 0.08 : 1}
                />
                {/* Zone name inside bar */}
                {(isActive ? barWidth : fullW) > 50 && (
                  <text
                    x={sx + 2 + (isActive ? barWidth : fullW) / 2}
                    y={barY + barH / 2 + (mob ? 3.5 : 4)}
                    textAnchor="middle"
                    style={{
                      fontSize: mob ? 8 : 10,
                      fontFamily: DS.display,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fill: isFuture ? def.colorHex : DS.bg,
                      pointerEvents: 'none',
                    }}
                  >
                    {def.shortName}
                  </text>
                )}
                {/* Invisible hitbox for hover */}
                <rect
                  x={sx} y={barY - 8}
                  width={segW} height={barH + 16}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoverZone(i)}
                  onMouseLeave={() => setHoverZone(null)}
                  onTouchStart={() => setHoverZone(hoverZone === i ? null : i)}
                />
              </g>
            );
          })}
        </g>

        {/* Milestone nodes below the bar */}
        {definitions.map((def, i) => {
          const zone = status.zones[i];
          const cx = x(i) + segW / 2;
          const isReached = zone.state !== 'future';
          const circleY = barY + barH + 8;
          const lineTop = circleY + 6;
          const lineBottom = lineTop + (mob ? 12 : 18);
          const labelY = lineBottom + 4;

          return (
            <g
              key={`ms-${def.id}`}
              style={{
                opacity: mounted ? 1 : 0,
                transition: `opacity 0.4s ease ${0.5 + i * 0.1}s`,
              }}
            >
              <circle
                cx={cx} cy={circleY}
                r={mob ? 3 : 4}
                fill={isReached ? def.colorHex : 'none'}
                stroke={isReached ? def.colorHex : DS.text3}
                strokeWidth={1.5}
              />

              <line
                x1={cx} y1={lineTop}
                x2={cx} y2={lineBottom}
                stroke={isReached ? def.colorHex : DS.text3}
                strokeWidth={1}
                strokeDasharray="3,3"
                opacity={isReached ? 0.5 : 0.2}
              />

              <text
                x={cx} y={labelY + (mob ? 8 : 10)}
                textAnchor="middle"
                style={{
                  fontSize: mob ? 9 : 11,
                  fontFamily: DS.display,
                  fontWeight: 600,
                  fill: isReached ? DS.text : DS.text3,
                }}
              >
                {def.shortName}
              </text>

              <text
                x={cx} y={labelY + (mob ? 19 : 23)}
                textAnchor="middle"
                style={{
                  fontSize: mob ? 7 : 8,
                  fontFamily: DS.body,
                  fill: isReached ? def.colorHex : DS.text3,
                  opacity: 0.7,
                }}
              >
                {def.desc}
              </text>

              {zone.state !== 'active' && (
                <text
                  x={cx} y={labelY + (mob ? 28 : 34)}
                  textAnchor="middle"
                  style={{
                    fontSize: mob ? 8 : 10,
                    fontFamily: DS.mono,
                    fill: DS.text3,
                    fontWeight: 400,
                  }}
                >
                  {zone.duration}
                </text>
              )}
            </g>
          );
        })}

        {/* Cursor marker at active zone boundary */}
        <g>
          <line
            x1={cursorX} y1={barY - 4}
            x2={cursorX} y2={cursorY - cursorR - 2}
            stroke={DS.warn}
            strokeWidth={1}
            strokeDasharray="4,3"
            opacity={0.5}
          />

          {/* Pulse ring */}
          <circle
            cx={cursorX} cy={cursorY} r={cursorR}
            fill="none" stroke={DS.warn} strokeWidth={1.5} opacity={0}
          >
            <animate attributeName="r" from={cursorR} to={cursorR * 3} dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Main dot */}
          <circle
            cx={cursorX} cy={cursorY} r={cursorR}
            fill={DS.warn}
            filter="url(#zCursorGlow)"
          />

          {/* Inner highlight */}
          <circle
            cx={cursorX} cy={cursorY}
            r={cursorR * 0.35}
            fill={DS.text}
            opacity={0.6}
          />
        </g>
      </svg>

      {/* Glassmorphism tooltip — active zone (shown when no segment hovered) */}
      {hoverZone === null && (
        <div
          className="zone-cursor-tooltip"
          style={{ left: `${tooltipLeftPct}%`, fontFamily: DS.mono }}
        >
          <div className="zone-cursor-tooltip__label" style={{ color: DS.up, fontFamily: DS.display }}>
            ZONE ACTIVE
          </div>
          <div
            className="zone-cursor-tooltip__zone"
            style={{ color: activeZone?.colorHex, fontFamily: DS.display }}
          >
            {activeZone?.shortName}
          </div>
          <div
            className="zone-cursor-tooltip__duration"
            style={{ color: DS.text2, fontFamily: DS.mono }}
          >
            {activeStatus?.duration}
          </div>
        </div>
      )}

      {/* History tooltip — shown on segment hover */}
      {hoverZone !== null && history && (() => {
        const def = definitions[hoverZone];
        const hovLeftPct = ((x(hoverZone) + segW / 2) / W) * 100;
        const pastCycles = history.filter(d => !d.isCurrent);
        const vals = pastCycles.map(d => d.zones[hoverZone]);
        const sorted = [...vals].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];

        const fmt = (m) => m >= 1 ? `${Math.round(m)} mois` : m > 0 ? `${Math.round(m * 30)}j` : '—';

        return (
          <div
            className="zone-cursor-tooltip"
            style={{
              left: `${hovLeftPct}%`,
              fontFamily: DS.mono,
              opacity: 1,
              animation: 'none',
              textAlign: 'left',
              padding: '10px 14px',
            }}
          >
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              fontFamily: DS.display,
              color: def.colorHex,
              marginBottom: 6,
              textAlign: 'center',
            }}>
              {def.shortName} — Historique
            </div>
            {pastCycles.map((d, j) => (
              <div key={d.cycle} style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 16,
                fontSize: 10,
                lineHeight: '18px',
                color: DS.text2,
              }}>
                <span style={{ fontFamily: DS.display }}>{d.cycle}</span>
                <span style={{ fontWeight: 600, color: DS.text }}>{fmt(d.zones[hoverZone])}</span>
              </div>
            ))}
            <div style={{
              borderTop: `1px solid ${def.colorHex}33`,
              marginTop: 4,
              paddingTop: 4,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 16,
              fontSize: 10,
              color: def.colorHex,
              fontWeight: 700,
            }}>
              <span style={{ fontFamily: DS.display }}>Médiane</span>
              <span>{fmt(median)}</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

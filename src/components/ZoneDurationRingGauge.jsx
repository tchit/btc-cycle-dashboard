/**
 * ZoneDurationRingGauge.jsx — v2 (sweep fix + labels + legend)
 * Direction C — Ring Gauge (semi-circle)
 */

import { useState, useRef, useEffect } from 'react';
import { DS } from '../config/design';

/* ═══ DEFAULT DATA ═══ */

const DEFAULT_DEFS = [
  { id: 'z1', shortName: 'Z1', name: 'Bottom',    colorHex: '#2D5BFF' },
  { id: 'z2', shortName: 'Z2', name: 'Recovery',  colorHex: '#CCFF00' },
  { id: 'z3', shortName: 'Z3', name: 'Expansion', colorHex: '#FFB800' },
  { id: 'z4', shortName: 'Z4', name: 'Euphoria',  colorHex: '#FF003C' },
  { id: 'z5', shortName: 'Z5', name: 'Blow-off',  colorHex: '#8B5CF6' },
];

const DEFAULT_DATA = [
  { cycle: 'C1 2011–13', zones: [6, 8, 7, 5, 2],   isCurrent: false },
  { cycle: 'C2 2015–17', zones: [10, 11, 9, 6, 2],  isCurrent: false },
  { cycle: 'C3 2020–22', zones: [6, 14, 12, 8, 5],  isCurrent: false },
  { cycle: 'C4 Current', zones: [5, 8, 6.6, 0, 0],  isCurrent: true },
];

/* ═══ GEOMETRY HELPERS ═══ */

const deg2rad = (d) => (d * Math.PI) / 180;

function polar(cx, cy, r, deg) {
  const rad = deg2rad(deg);
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

/**
 * Donut segment (annular sector).
 * deg0 > deg1 (e.g. 180 → 150), semi-circle goes LEFT→RIGHT above cy.
 *
 * KEY FIX: In SVG screen coords (Y-down), going from left to right
 * along the TOP semicircle is CLOCKWISE → sweep-flag = 1 for outer,
 * 0 for inner (return path).
 */
function donutArc(cx, cy, rOut, rIn, deg0, deg1) {
  const oS = polar(cx, cy, rOut, deg0);
  const oE = polar(cx, cy, rOut, deg1);
  const iE = polar(cx, cy, rIn,  deg1);
  const iS = polar(cx, cy, rIn,  deg0);
  const lg = Math.abs(deg0 - deg1) > 180 ? 1 : 0;
  return [
    `M${oS.x},${oS.y}`,
    `A${rOut},${rOut} 0 ${lg} 1 ${oE.x},${oE.y}`,   // sweep=1 (clockwise on screen)
    `L${iE.x},${iE.y}`,
    `A${rIn},${rIn} 0 ${lg} 0 ${iS.x},${iS.y}`,     // sweep=0 (back, counter-clockwise)
    'Z',
  ].join(' ');
}

/** Ghost track arc — same sweep fix */
function strokeArc(cx, cy, r, deg0, deg1) {
  const s = polar(cx, cy, r, deg0);
  const e = polar(cx, cy, r, deg1);
  const lg = Math.abs(deg0 - deg1) > 180 ? 1 : 0;
  return `M${s.x},${s.y} A${r},${r} 0 ${lg} 1 ${e.x},${e.y}`;  // sweep=1
}

const lerp = (a, b, t) => a + (b - a) * t;

/* ═══ COLORBLIND-SAFE REMAP (local to ring gauge) ═══ */

const CB_PALETTE = {
  '#CCFF00': '#3B82F6',  // Z1 lime  → blue
  '#D4A843': '#06B6D4',  // Z2 gold  → cyan
  '#E8732A': '#FBBF24',  // Z3 orange→ amber
  '#FF003C': '#F97316',  // Z4 red   → orange
  '#7A1B1B': '#A855F7',  // Z5 maroon→ purple
};

function cbDefs(defs) {
  return defs.map(d => ({
    ...d,
    colorHex: CB_PALETTE[d.colorHex] || d.colorHex,
  }));
}

/* ═══ COMPONENT ═══ */

export default function ZoneDurationRingGauge({
  data = DEFAULT_DATA,
  definitions: rawDefs = DEFAULT_DEFS,
  mob = false,
  mode = 'semi',
}) {
  const definitions = cbDefs(rawDefs);
  const [tip, setTip] = useState(null);
  const [alive, setAlive] = useState(false);
  const svgRef = useRef(null);
  const noMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  useEffect(() => {
    const id = setTimeout(() => setAlive(true), 60);
    return () => clearTimeout(id);
  }, []);

  /* ── Layout ── */
  const W = mob ? 720 : 860;
  const H = mob ? 280 : 310;
  const cx = W / 2;
  const cy = H - 36;                // semicircle center near bottom
  const A_START = 180;
  const A_END = 0;
  const THICK = mob ? 8 : 10;
  const THICK_CUR = mob ? 12 : 14;
  const GAP = mob ? 10 : 12;
  const R0 = mob ? 180 : 200;
  const LABEL_COL_X = 16;           // fixed left column for cycle labels

  /* ── Derived ── */
  const totals = data.map((d) => d.zones.reduce((s, v) => s + Math.max(v, 0), 0));
  const maxT = Math.ceil(Math.max(...totals) / 6) * 6 || 6;
  const curIdx = data.findIndex((d) => d.isCurrent);
  const curTotal = curIdx >= 0 ? totals[curIdx] : 0;

  const rings = data.map((d, i) => {
    const cur = i === curIdx;
    const t = cur ? THICK_CUR : THICK;
    const rO = R0 - i * (THICK + GAP);
    return { ...d, i, rO, rI: rO - t, total: totals[i], cur, t };
  });

  const ticks = [];
  for (let m = 0; m <= maxT; m += 6) ticks.push(m);

  const needleDeg = curIdx >= 0 ? lerp(A_START, A_END, curTotal / maxT) : A_START;

  /* ── Animation ── */
  const fade = (ms) =>
    noMotion ? {} : { opacity: alive ? 1 : 0, transition: `opacity 450ms ease ${ms}ms` };

  /* ── Tooltip ── */
  const showTip = (e, cycle, def, months, pct) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    setTip({
      x: e.clientX - box.left,
      y: e.clientY - box.top,
      cycle, zone: def.shortName, name: def.name,
      months, pct, color: def.colorHex,
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%" height="auto"
        style={{ overflow: 'visible', display: 'block' }}
      >
        <defs>
          <filter id="zrg-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4"
              floodColor={DS.accent} floodOpacity="0.6" />
          </filter>
          <filter id="zrg-glow-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="2"
              floodColor={DS.accent} floodOpacity="0.35" />
          </filter>
        </defs>

        {/* ── Ghost tracks ── */}
        {rings.map((r, i) => (
          <path
            key={`gh-${i}`}
            d={strokeArc(cx, cy, (r.rO + r.rI) / 2, A_START, A_END)}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={r.t}
            style={fade(100 + i * 80)}
          />
        ))}

        {/* ── Segments ── */}
        {rings.map((r, i) => {
          let acc = 0;
          return r.zones.map((m, j) => {
            if (m <= 0) { acc += 0; return null; }
            const a0 = lerp(A_START, A_END, acc / maxT);
            const a1 = lerp(A_START, A_END, (acc + m) / maxT);
            acc += m;
            const def = definitions[j];
            if (!def) return null;
            const pct = r.total > 0 ? ((m / r.total) * 100).toFixed(1) : '0';
            return (
              <path
                key={`s-${i}-${j}`}
                d={donutArc(cx, cy, r.rO, r.rI, a0, a1)}
                fill={def.colorHex}
                fillOpacity={0.22}
                stroke={def.colorHex}
                strokeOpacity={0.75}
                strokeWidth={1}
                style={{ cursor: 'pointer', ...fade(150 + i * 80 + j * 30) }}
                onMouseEnter={(e) => showTip(e, r.cycle, def, m, pct)}
                onMouseMove={(e) => showTip(e, r.cycle, def, m, pct)}
                onMouseLeave={() => setTip(null)}
                onClick={(e) => mob && showTip(e, r.cycle, def, m, pct)}
                onPointerEnter={(e) => {
                  e.currentTarget.setAttribute('fill-opacity', '0.35');
                  e.currentTarget.setAttribute('stroke-width', '1.5');
                }}
                onPointerLeave={(e) => {
                  e.currentTarget.setAttribute('fill-opacity', '0.22');
                  e.currentTarget.setAttribute('stroke-width', '1');
                }}
              />
            );
          });
        })}

        {/* ── Ticks on outer arc ── */}
        {ticks.map((t) => {
          const deg = lerp(A_START, A_END, t / maxT);
          const p1 = polar(cx, cy, R0 + 2, deg);
          const p2 = polar(cx, cy, R0 + 8, deg);
          const pL = polar(cx, cy, R0 + 18, deg);
          return (
            <g key={`tk-${t}`}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
              <text x={pL.x} y={pL.y}
                textAnchor="middle" dominantBaseline="central"
                fill={DS.text3} fontFamily={DS.mono} fontSize={mob ? 9 : 10}>
                {t}
              </text>
            </g>
          );
        })}

        {/* ── Cycle labels — fixed column, vertically stacked ── */}
        {rings.map((r, i) => {
          const y = cy - 4 - i * 22;
          return (
            <text
              key={`cl-${i}`}
              x={LABEL_COL_X} y={y}
              textAnchor="start" dominantBaseline="central"
              fill={r.cur ? DS.accent : DS.text2}
              fontFamily={DS.display}
              fontSize={mob ? 11 : 12}
              fontWeight={r.cur ? 600 : 400}
              filter={r.cur ? 'url(#zrg-glow-sm)' : undefined}
              style={fade(200 + i * 60)}
            >
              {r.cycle}
            </text>
          );
        })}

        {/* ── Connector lines: label → ring ── */}
        {rings.map((r, i) => {
          const y = cy - 4 - i * 22;
          const ringLeft = polar(cx, cy, r.rO, A_START);
          return (
            <line
              key={`cn-${i}`}
              x1={LABEL_COL_X + 90} y1={y}
              x2={ringLeft.x - 4} y2={ringLeft.y}
              stroke={r.cur ? DS.accent : 'rgba(255,255,255,0.06)'}
              strokeWidth={0.5}
              strokeDasharray={r.cur ? 'none' : '2,3'}
              style={fade(250 + i * 60)}
            />
          );
        })}

        {/* ── NOW needle ── */}
        {curIdx >= 0 && (() => {
          const cr = rings[curIdx];
          const nS = polar(cx, cy, cr.rI - 24, needleDeg);
          const nE = polar(cx, cy, R0 + 14, needleDeg);
          const dot = polar(cx, cy, (cr.rO + cr.rI) / 2, needleDeg);
          const lbl = polar(cx, cy, R0 + 26, needleDeg);
          return (
            <g style={fade(500)}>
              <line x1={nS.x} y1={nS.y} x2={nE.x} y2={nE.y}
                stroke={DS.accent} strokeWidth={2} strokeOpacity={0.9} />
              <circle cx={dot.x} cy={dot.y} r={mob ? 3 : 4}
                fill={DS.accent} filter="url(#zrg-glow)">
                {!noMotion && (
                  <animate attributeName="r"
                    values={mob ? '3;4.5;3' : '4;6;4'}
                    dur="2.5s" repeatCount="indefinite" />
                )}
              </circle>
              <text x={lbl.x} y={lbl.y}
                textAnchor="middle" dominantBaseline="central"
                fill={DS.accent} fontFamily={DS.display}
                fontSize={10} letterSpacing="0.1em">
                NOW
              </text>
            </g>
          );
        })()}

        {/* ── Center readout ── */}
        <text x={cx} y={cy - 24}
          textAnchor="middle" dominantBaseline="central"
          fill={DS.text} fontFamily={DS.display}
          fontSize={mob ? 30 : 36} fontWeight={600}
          style={fade(400)}>
          {curTotal % 1 === 0 ? curTotal : curTotal.toFixed(1)}mo
        </text>
        <text x={cx} y={cy + 6}
          textAnchor="middle" dominantBaseline="central"
          fill={DS.text3} fontFamily={DS.font} fontSize={12}
          style={fade(450)}>
          Current cycle duration
        </text>
      </svg>

      {/* ── Legend — HTML flexbox below SVG ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        gap: mob ? '6px 14px' : '6px 24px',
        padding: '8px 0 0',
        fontFamily: DS.font, fontSize: 11,
      }}>
        {definitions.map((def) => (
          <div key={def.id} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              display: 'inline-block', width: 12, height: 6,
              borderRadius: 2, background: def.colorHex, opacity: 0.8,
              flexShrink: 0,
            }} />
            <span style={{ color: def.colorHex, fontWeight: 600 }}>{def.shortName}</span>
            <span style={{ color: DS.text3 }}>— {def.name}</span>
          </div>
        ))}
      </div>

      {/* ── Tooltip ── */}
      {tip && (
        <div style={{
          position: 'absolute',
          left: Math.min(tip.x + 12, (svgRef.current?.clientWidth || W) - 180),
          top: tip.y - 48,
          background: DS.surface,
          border: `1px solid ${DS.border}`,
          borderRadius: 6,
          padding: '8px 12px',
          pointerEvents: 'none', zIndex: 10,
          fontFamily: DS.font, fontSize: 12,
          color: DS.text,
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap',
        }}>
          <div style={{ color: DS.text2, marginBottom: 2 }}>{tip.cycle}</div>
          <div>
            <span style={{ color: tip.color, fontWeight: 600 }}>{tip.zone}</span>
            {' '}{tip.name}
          </div>
          <div style={{ color: DS.accent, fontFamily: DS.mono, marginTop: 2 }}>
            {tip.months}mo · {tip.pct}%
          </div>
        </div>
      )}
    </div>
  );
}

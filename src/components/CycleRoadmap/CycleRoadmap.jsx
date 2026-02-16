import React, { useState, useEffect, useMemo } from 'react';
import { DS } from '../../config/design';
import { ATH, ATHDATE, HALVING, NEXT_HALVING, CVDD, TIMING } from '../../config/constants';
import { fP } from '../../utils/format';
import {
  addDays, calcPhases, calcATLDate, calcMilestones,
  calcCountdown, cursorPositionPct, dateToPercent, formatDate,
} from './cycleUtils';
import PhaseSegment from './PhaseSegment';
import MilestoneNode from './MilestoneNode';
import CountdownBadge from './CountdownBadge';
import CursorMarker from './CursorMarker';
import BitcoinIcon from './BitcoinIcon';
import './CycleRoadmap.css';

const fgZone = (v) => {
  if (v <= 20) return { label: 'Extreme Fear', color: DS.down };
  if (v <= 35) return { label: 'Fear', color: DS.warn };
  if (v <= 55) return { label: 'Neutral', color: DS.text3 };
  if (v <= 75) return { label: 'Greed', color: DS.up };
  return { label: 'Extreme Greed', color: DS.up };
};

const mvrvColor = (v) => {
  if (v < 1) return DS.up;
  if (v > 3.5) return DS.down;
  return DS.text3;
};

export default function CycleRoadmap({ live, calc, mob }) {
  const price = live?.price;
  const loading = live?.loading;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  // ── Timeline bounds ───────────────────────────────────────────
  const timelineStart = useMemo(() => new Date(HALVING), []);
  const nextAthDate = useMemo(() => addDays(NEXT_HALVING, 520), []);
  const timelineEnd = nextAthDate;

  const phases = useMemo(() => calcPhases(HALVING, ATHDATE, TIMING, NEXT_HALVING), []);
  const atlDate = useMemo(() => calcATLDate(HALVING, ATHDATE, NEXT_HALVING, TIMING), []);
  const milestones = useMemo(
    () => calcMilestones(HALVING, ATHDATE, atlDate, NEXT_HALVING, nextAthDate, ATH, CVDD, timelineStart, timelineEnd),
    [atlDate, nextAthDate, timelineStart, timelineEnd],
  );
  const cursorPct = useMemo(() => cursorPositionPct(timelineStart, timelineEnd), [timelineStart, timelineEnd]);
  const countdown = useMemo(() => calcCountdown(HALVING, ATHDATE, NEXT_HALVING, TIMING), []);

  // ── Layout ────────────────────────────────────────────────────
  const W = mob ? 400 : 1000;
  const H = mob ? 160 : 200;
  const padL = mob ? 20 : 80;
  const padR = mob ? 20 : 80;
  const usable = W - padL - padR;
  const x = (pct) => padL + (pct / 100) * usable;
  const barY = mob ? 60 : 90;
  const barH = mob ? 14 : 16;

  const atlPct = milestones.find(m => m.label === 'ATL est.')?.positionPct ?? 50;
  const tooltipLeftPct = (x(cursorPct) / W) * 100;
  const drop = calc?.drop ?? ((ATH - price) / ATH * 100);

  // ── Metrics ───────────────────────────────────────────────────
  const fg = live?.fearGreed ?? 50;
  const fgInfo = fgZone(fg);
  const mvrv = calc?.mvrv ?? 1;
  const mvrvz = calc?.mvrvz ?? 0;
  const dATH = calc?.dATH ?? 0;
  const change24h = live?.change24h ?? 0;

  if (loading || !price) {
    return (
      <div className="cycle-roadmap cycle-roadmap--loading">
        <div className="cycle-roadmap__skeleton" />
      </div>
    );
  }

  return (
    <div className={`cycle-roadmap ${mounted ? 'cycle-roadmap--mounted' : ''}`}>
      {/* ── SVG Timeline ── */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        className="cycle-roadmap__svg"
      >
        <defs>
          <filter id="phaseGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="cursorGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <line x1={padL} y1={barY + barH / 2} x2={W - padR} y2={barY + barH / 2} stroke={DS.border} strokeWidth={2} />

        <BitcoinIcon x={mob ? 12 : 40} y={barY + barH / 2} size={mob ? 28 : 40} mounted={mounted} />

        <g>
          {phases.map((phase) => (
            <PhaseSegment
              key={phase.name} name={phase.name}
              startPct={dateToPercent(phase.start, timelineStart, timelineEnd)}
              endPct={dateToPercent(phase.end, timelineStart, timelineEnd)}
              color={phase.color} isActive={phase.status === 'active'} isFuture={phase.status === 'future'}
              x={x} barY={barY} barH={barH} mob={mob} filterId="phaseGlow"
            />
          ))}
        </g>

        {milestones.map((ms, i) => (
          <MilestoneNode
            key={ms.label} positionPct={ms.positionPct} label={ms.label}
            date={formatDate(ms.date)} price={ms.price} isReached={ms.isReached}
            x={x} barY={barY} barH={barH} mob={mob} index={i} mounted={mounted}
          />
        ))}

        {countdown.minDays > 0 && (
          <CountdownBadge
            daysRange={[countdown.minDays, countdown.maxDays]} targetLabel="ATL"
            startPct={cursorPct} endPct={atlPct} x={x} barY={barY} mob={mob}
          />
        )}

        <CursorMarker positionPct={cursorPct} x={x} trackY={barY} barH={barH} mob={mob} />
      </svg>

      {/* ── Tooltip ── */}
      <div className="cursor-tooltip" style={{ left: `${tooltipLeftPct}%`, fontFamily: DS.mono }}>
        <div className="cursor-tooltip__label" style={{ color: DS.up, fontFamily: DS.display }}>WE ARE HERE</div>
        <div className="cursor-tooltip__price" style={{ color: DS.text, fontFamily: DS.mono }}>${fP(price)}</div>
        <div className="cursor-tooltip__ath" style={{ color: DS.down, fontFamily: DS.mono }}>-{drop.toFixed(1)}% from ATH</div>
      </div>

      {/* ── Metrics Strip ── */}
      <div className="cycle-metrics" style={{ gridTemplateColumns: mob ? '1fr' : '1fr 1fr 1fr' }}>
        {/* MVRV */}
        <div className="cycle-metric">
          <div className="cycle-metric__accent" style={{ background: mvrvColor(mvrv) }} />
          <div className="cycle-metric__body">
            <div className="cycle-metric__label" style={{ fontFamily: DS.display }}>MVRV RATIO</div>
            <div className="cycle-metric__row">
              <span className="cycle-metric__value" style={{ fontFamily: DS.mono, color: mvrvColor(mvrv) }}>
                {mvrv.toFixed(2)}
              </span>
              <span className="cycle-metric__detail" style={{ fontFamily: DS.mono }}>Z: {mvrvz.toFixed(2)}</span>
            </div>
            <div className="cycle-metric__bar">
              <div className="cycle-metric__bar-fill" style={{ width: `${Math.min(100, Math.max(5, (mvrv / 4) * 100))}%`, background: mvrvColor(mvrv) }} />
            </div>
            <div className="cycle-metric__hint" style={{ fontFamily: DS.font }}>
              {mvrv < 1 ? 'Sous-évalué' : mvrv < 2 ? 'Zone neutre' : mvrv < 3.5 ? 'Surévalué' : 'Zone de top'}
            </div>
          </div>
        </div>

        {/* Fear & Greed */}
        <div className="cycle-metric">
          <div className="cycle-metric__accent" style={{ background: fgInfo.color }} />
          <div className="cycle-metric__body">
            <div className="cycle-metric__label" style={{ fontFamily: DS.display }}>FEAR & GREED</div>
            <div className="cycle-metric__row">
              <span className="cycle-metric__value" style={{ fontFamily: DS.mono, color: fgInfo.color }}>{fg}</span>
              <span className="cycle-metric__tag" style={{ color: fgInfo.color, fontFamily: DS.display }}>{fgInfo.label}</span>
            </div>
            <div className="cycle-metric__spectrum">
              <div className="cycle-metric__spectrum-bg" />
              <div className="cycle-metric__spectrum-dot" style={{ left: `${fg}%`, background: fgInfo.color, boxShadow: `0 0 6px ${fgInfo.color}` }} />
            </div>
          </div>
        </div>

        {/* Distance ATH */}
        <div className="cycle-metric">
          <div className="cycle-metric__accent" style={{ background: DS.down }} />
          <div className="cycle-metric__body">
            <div className="cycle-metric__label" style={{ fontFamily: DS.display }}>DISTANCE ATH</div>
            <div className="cycle-metric__row">
              <span className="cycle-metric__value" style={{ fontFamily: DS.mono, color: DS.down }}>-{drop.toFixed(1)}%</span>
              <span className="cycle-metric__detail" style={{ fontFamily: DS.mono }}>{dATH}j depuis ATH</span>
            </div>
            <div className="cycle-metric__bar">
              <div className="cycle-metric__bar-fill" style={{ width: `${Math.min(100, drop)}%`, background: `linear-gradient(90deg, ${DS.warn}, ${DS.down})` }} />
            </div>
            <div className="cycle-metric__row" style={{ marginTop: 2 }}>
              <span className="cycle-metric__hint" style={{ fontFamily: DS.font }}>
                24h: <span style={{ color: change24h >= 0 ? DS.up : DS.down, fontFamily: DS.mono }}>{change24h >= 0 ? '+' : ''}{change24h?.toFixed(1)}%</span>
              </span>
              <span className="cycle-metric__hint" style={{ fontFamily: DS.mono }}>ATH ${fP(ATH)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

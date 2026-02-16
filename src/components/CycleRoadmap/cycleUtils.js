import { daysBetween } from '../../utils/format';
import { DS } from '../../config/design';

// ── Date helpers ────────────────────────────────────────────────

/**
 * Add `days` to a date string. Uses setDate for DST safety.
 * @param {string} dateStr  ISO date string (e.g. '2024-04-19')
 * @param {number} days     Positive or negative integer
 * @returns {Date}
 */
export function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Map a date onto a 0-100 percentage within [timelineStart, timelineEnd].
 * Clamped to 0-100. Guards against division by zero.
 * @param {Date|string} date
 * @param {Date|string} timelineStart
 * @param {Date|string} timelineEnd
 * @returns {number}
 */
export function dateToPercent(date, timelineStart, timelineEnd) {
  const d = new Date(date).getTime();
  const s = new Date(timelineStart).getTime();
  const e = new Date(timelineEnd).getTime();
  if (e === s) return 0;
  const pct = ((d - s) / (e - s)) * 100;
  return Math.max(0, Math.min(100, pct));
}

// ── Core calculations ───────────────────────────────────────────

/**
 * Weighted-average ATL (all-time-low) date from three TIMING methods.
 *
 *   Method 1: ATH + 383 days          (conf from timingArray[0])
 *   Method 2: Halving + 863 days      (conf from timingArray[1])
 *   Method 3: Next Halving - 513 days (conf from timingArray[2])
 *
 * @param {string} halvingDate
 * @param {string} athDate
 * @param {string} nextHalvingDate
 * @param {Array}  timingArray  [{conf}, {conf}, {conf}]
 * @returns {Date}
 */
export function calcATLDate(halvingDate, athDate, nextHalvingDate, timingArray) {
  const methods = [
    { date: addDays(athDate, 383),          conf: timingArray[0].conf },
    { date: addDays(halvingDate, 863),      conf: timingArray[1].conf },
    { date: addDays(nextHalvingDate, -513), conf: timingArray[2].conf },
  ];

  const totalWeight = methods.reduce((s, m) => s + m.conf, 0);
  const weightedMs  = methods.reduce(
    (s, m) => s + m.date.getTime() * m.conf,
    0,
  );

  return new Date(weightedMs / totalWeight);
}

/**
 * Compute the four cycle phases with their status relative to today.
 *
 * Phases:
 *   Bull         : halving      -> ATH
 *   Bear         : ATH          -> ATL est.
 *   Accumulation : ATL est.     -> nextHalving - 180 days
 *   Next Bull    : accumEnd     -> nextHalving + 520 days
 *
 * @returns {Array<{name:string, start:Date, end:Date, color:string, status:string}>}
 */
export function calcPhases(halvingDate, athDate, timingArray, nextHalvingDate) {
  const halving   = new Date(halvingDate);
  const ath       = new Date(athDate);
  const atl       = calcATLDate(halvingDate, athDate, nextHalvingDate, timingArray);
  const accumEnd  = addDays(nextHalvingDate, -180);
  const nextBullEnd = addDays(nextHalvingDate, 520);

  const now = new Date();

  const statusOf = (start, end) => {
    if (now >= end)   return 'past';
    if (now >= start) return 'active';
    return 'future';
  };

  return [
    { name: 'Bull',         start: halving,   end: ath,         color: DS.up,     status: statusOf(halving, ath) },
    { name: 'Bear',         start: ath,        end: atl,        color: DS.down,   status: statusOf(ath, atl) },
    { name: 'Accumulation', start: atl,        end: accumEnd,   color: DS.purple, status: statusOf(atl, accumEnd) },
    { name: 'Next Bull',    start: accumEnd,   end: nextBullEnd, color: DS.up,    status: statusOf(accumEnd, nextBullEnd) },
  ];
}

/**
 * Build the milestone list for the timeline.
 *
 * @param {string|Date} halvingDate
 * @param {string|Date} athDate
 * @param {Date}        atlDate       Pre-computed ATL estimate
 * @param {string|Date} nextHalvingDate
 * @param {Date}        nextAthDate   Estimated next ATH date
 * @param {number}      athPrice      e.g. 126198
 * @param {number}      cvddPrice     e.g. 46261
 * @param {Date|string} timelineStart
 * @param {Date|string} timelineEnd
 * @returns {Array<{label:string, date:Date, price:number|null, positionPct:number, icon:string, isReached:boolean}>}
 */
export function calcMilestones(
  halvingDate, athDate, atlDate, nextHalvingDate, nextAthDate,
  athPrice, cvddPrice, timelineStart, timelineEnd,
) {
  const now = new Date();

  const items = [
    { label: 'Halving',        date: new Date(halvingDate),     price: null,      icon: '\u23F3' },
    { label: 'ATH',            date: new Date(athDate),         price: athPrice,  icon: '\uD83D\uDE80' },
    { label: 'ATL est.',       date: new Date(atlDate),         price: cvddPrice, icon: '\uD83D\uDCC9' },
    { label: 'Next Halving',   date: new Date(nextHalvingDate), price: null,      icon: '\u23F3' },
    { label: 'Next ATH est.',  date: new Date(nextAthDate),     price: null,      icon: '\u2B50' },
  ];

  return items.map((m) => ({
    ...m,
    positionPct: dateToPercent(m.date, timelineStart, timelineEnd),
    isReached: now >= m.date,
  }));
}

/**
 * Days remaining until ATL according to each TIMING method.
 * Returns the min and max across the three methods.
 *
 * @returns {{minDays:number, maxDays:number}}
 */
export function calcCountdown(halvingDate, athDate, nextHalvingDate, timingArray) {
  const now = new Date();

  const dates = [
    addDays(athDate, 383),
    addDays(halvingDate, 863),
    addDays(nextHalvingDate, -513),
  ];

  const daysRemaining = dates.map(
    (d) => Math.round((d.getTime() - now.getTime()) / 86400000),
  );

  return {
    minDays: Math.min(...daysRemaining),
    maxDays: Math.max(...daysRemaining),
  };
}

/**
 * Return the currently active phase, or the first phase as fallback.
 * @param {Array} phases  Output of calcPhases
 * @returns {object}
 */
export function calcCurrentPhase(phases) {
  return phases.find((p) => p.status === 'active') || phases[0];
}

/**
 * Where "today" sits on the 0-100 timeline.
 * @returns {number}
 */
export function cursorPositionPct(timelineStart, timelineEnd) {
  return dateToPercent(new Date(), timelineStart, timelineEnd);
}

// ── Date formatting ─────────────────────────────────────────────

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Format a date as "Mon YYYY" using UTC to avoid timezone drift.
 * @param {Date|string} d
 * @returns {string}
 */
export function formatDate(d) {
  const dt = new Date(d);
  return `${MONTHS[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
}

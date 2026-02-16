import React from 'react';

/**
 * TimelineVertical — vertical timeline with status-colored dots and badges.
 *
 * @param {Object[]} events — array of:
 *   { date, event, detail, status ('confirmed'|'current'|'future'), color }
 */
export default function TimelineVertical({ events }) {
  const badgeLabel = {
    confirmed: 'CONFIRMÉ',
    current: 'NOUS SOMMES ICI',
  };

  return (
    <div className="tl-container">
      <div className="tl-line" />
      {events.map((ev, i) => (
        <div key={i} className="tl-event">
          <div className={`tl-dot tl-dot--${ev.status}`} />
          <div className="tl-date">{ev.date}</div>
          <div className="tl-event-title">
            {ev.event}
            {badgeLabel[ev.status] && (
              <span className={`tl-badge tl-badge--${ev.status}`}>
                {'\u2190 '}{badgeLabel[ev.status]}
              </span>
            )}
          </div>
          {ev.detail && <div className="tl-event-detail">{ev.detail}</div>}
        </div>
      ))}
    </div>
  );
}

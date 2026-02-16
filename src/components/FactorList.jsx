import React from 'react';

/**
 * FactorList — bulleted list of factors in a clip-path card.
 * Color controlled by data-accent attribute (green/red/gold).
 *
 * @param {string}   title      — heading text
 * @param {string}   accent     — 'green' | 'red' | 'gold'
 * @param {string[]} items      — list of factor strings
 */
export default function FactorList({ title, accent, items }) {
  return (
    <div className="fl-container" data-accent={accent}>
      <div className="fl-title">{title}</div>
      <ul className="fl-list">
        {items.map((item, i) => (
          <li key={i} className="fl-item">{item}</li>
        ))}
      </ul>
    </div>
  );
}

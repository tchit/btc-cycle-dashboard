import React from 'react';

/**
 * MethodologyBlock — titled section with ordered or unordered list.
 * Used for external sources (grouped sub-sections) and methodology notes (numbered).
 *
 * @param {string}   title       — gold section heading
 * @param {string}   [subtitle]  — grey sub-heading
 * @param {string[]} [items]     — flat list of strings (for ordered/unordered)
 * @param {Object[]} [sections]  — grouped sub-sections: { title, items[] }
 * @param {boolean}  [ordered]   — true for numbered list (default false)
 */
export default function MethodologyBlock({ title, subtitle, items, sections, ordered }) {
  const ListTag = ordered ? 'ol' : 'ul';
  const listClass = `mb-list ${ordered ? 'mb-list--ordered' : 'mb-list--unordered'}`;

  return (
    <div className="mb-section">
      {title && <div className="mb-title">{title}</div>}
      {subtitle && <div className="mb-subtitle">{subtitle}</div>}

      {sections && sections.map((sec, i) => (
        <div key={i} className="mb-subsection">
          <div className="mb-subsection-title">{sec.title}</div>
          <ul className={`mb-list mb-list--unordered`}>
            {sec.items.map((item, j) => (
              <li key={j} className="mb-item">{item}</li>
            ))}
          </ul>
        </div>
      ))}

      {items && (
        <ListTag className={listClass}>
          {items.map((item, i) => (
            <li key={i} className="mb-item">{item}</li>
          ))}
        </ListTag>
      )}
    </div>
  );
}

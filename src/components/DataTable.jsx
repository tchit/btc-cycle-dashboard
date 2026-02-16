import React from 'react';

/**
 * DataTable — reusable table component for analytical data pages.
 *
 * @param {string}   title        — gold section heading
 * @param {string}   [subtitle]   — grey sub-heading
 * @param {string[]} columns      — header labels
 * @param {Object[]} rows         — array of row objects; keys match columns order
 * @param {string}   [highlightCol] — column key to render in gold
 * @param {Object}   [averageRow]   — single summary row at bottom (same shape as rows)
 * @param {string[]} [notes]       — text paragraphs rendered below the table
 * @param {string}   [note]        — single note string (alternative to notes[])
 */
export default function DataTable({ title, subtitle, columns, rows, highlightCol, averageRow, notes, note }) {
  // Derive cell keys from the first row object
  const keys = rows.length > 0 ? Object.keys(rows[0]).filter(k => k !== 'isCurrent') : [];

  return (
    <div className="dt-section">
      {title && <div className="dt-title">{title}</div>}
      {subtitle && <div className="dt-subtitle">{subtitle}</div>}
      <div className="dt-wrapper">
        <table className="dt-table">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={row.isCurrent ? 'dt-current' : ''}>
                {keys.map((k, ci) => {
                  const isHighlighted = highlightCol && columns[ci] === highlightCol;
                  return (
                    <td key={ci} className={isHighlighted ? 'dt-highlight' : ''}>
                      {row[k]}
                    </td>
                  );
                })}
              </tr>
            ))}
            {averageRow && (
              <tr className="dt-note-row">
                {keys.map((k, ci) => (
                  <td key={ci}>{averageRow[k] || ''}</td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {note && (
        <div className="dt-notes">
          <p>{note}</p>
        </div>
      )}
      {notes && notes.length > 0 && (
        <div className="dt-notes">
          {notes.map((n, i) => <p key={i}>{n}</p>)}
        </div>
      )}
    </div>
  );
}

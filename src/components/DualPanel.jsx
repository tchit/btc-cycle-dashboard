import React from 'react';

/**
 * DualPanel — side-by-side projection cards (Bottom Projection | ATH Projection).
 * Uses clip-path card styling.
 *
 * @param {Object[]} panels — 2 panel objects with:
 *   title, titleColor, consensusLabel, consensus, consensusDetail,
 *   dateMethods[], priceMethods[]
 *   Each method: { name, desc, value }
 */
export default function DualPanel({ panels }) {
  return (
    <div className="dp-grid">
      {panels.map((panel, i) => (
        <div key={i} className="dp-panel">
          <div className="dp-panel-title" style={{ color: panel.titleColor }}>
            {panel.title}
          </div>
          <div className="dp-consensus-label">{panel.consensusLabel}</div>
          <div className="dp-consensus">{panel.consensus}</div>
          {panel.consensusDetail && (
            <div className="dp-consensus-detail">{panel.consensusDetail}</div>
          )}

          {panel.dateMethods && panel.dateMethods.length > 0 && (
            <>
              <div className="dp-section-title">Date Methods</div>
              {panel.dateMethods.map((m, j) => (
                <div key={j} className="dp-method">
                  <div>
                    <div className="dp-method-name">{m.name}</div>
                    <div className="dp-method-desc">{m.desc}</div>
                  </div>
                  <div className="dp-method-value">{m.value}</div>
                </div>
              ))}
            </>
          )}

          {panel.priceMethods && panel.priceMethods.length > 0 && (
            <>
              <div className="dp-section-title">Price Methods</div>
              {panel.priceMethods.map((m, j) => (
                <div key={j} className="dp-method">
                  <div>
                    <div className="dp-method-name">{m.name}</div>
                    <div className="dp-method-desc">{m.desc}</div>
                  </div>
                  <div className="dp-method-value">{m.value}</div>
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

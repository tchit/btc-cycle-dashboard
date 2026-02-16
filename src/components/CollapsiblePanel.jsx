import React, { useState } from 'react';
import '../styles/collapsible-panel.css';

export default function CollapsiblePanel({ label = 'Détails', defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        className={`collapsible-toggle ${open ? 'collapsible-toggle--open' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
      >
        <span className="collapsible-toggle__label">
          <span className="collapsible-toggle__chevron" />
          {label}
        </span>
      </button>

      <div className={`collapsible-content ${open ? 'collapsible-content--open' : ''}`}>
        <div className="collapsible-content__inner">
          {children}
        </div>
      </div>
    </div>
  );
}

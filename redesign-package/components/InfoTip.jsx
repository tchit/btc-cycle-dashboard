import React, { useState, useEffect, useRef } from 'react';

export default function InfoTip({ text, mob }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  return (
    <span ref={ref} className="info-tip" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
      <span className="info-tip-icon">?</span>
      {open && <div className="info-tip-content">{text}</div>}
    </span>
  );
}

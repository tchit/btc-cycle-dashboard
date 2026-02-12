import React, { useEffect, useState } from 'react';
import { DS } from '../config/design';
import FakeBadge from './FakeBadge';

const getZone = (v) => {
  if (v <= 10) return { label: 'EXTREME FEAR', color: '#DC2626', bg: 'rgba(220,38,38,0.14)', ring: 'rgba(220,38,38,0.45)' };
  if (v <= 20) return { label: 'FEAR', color: '#EF4444', bg: 'rgba(239,68,68,0.10)', ring: 'rgba(239,68,68,0.30)' };
  if (v <= 35) return { label: 'FEAR', color: '#F97316', bg: 'rgba(249,115,22,0.07)', ring: 'rgba(249,115,22,0.18)' };
  if (v <= 45) return { label: 'PRUDENCE', color: '#F59E0B', bg: 'rgba(245,158,11,0.05)', ring: 'rgba(245,158,11,0.12)' };
  if (v <= 55) return { label: 'NEUTRAL', color: '#94A3B8', bg: 'transparent', ring: 'transparent' };
  if (v <= 65) return { label: 'GREED', color: '#84CC16', bg: 'rgba(132,204,22,0.05)', ring: 'rgba(132,204,22,0.12)' };
  if (v <= 80) return { label: 'GREED', color: '#22C55E', bg: 'rgba(34,197,94,0.07)', ring: 'rgba(34,197,94,0.18)' };
  if (v <= 90) return { label: 'EXTREME GREED', color: '#16A34A', bg: 'rgba(22,163,74,0.10)', ring: 'rgba(22,163,74,0.30)' };
  return { label: 'MAX GREED', color: '#15803D', bg: 'rgba(21,128,61,0.14)', ring: 'rgba(21,128,61,0.45)' };
};

export default function FearGreedCard({ value, fgLabel, fake }) {
  const [display, setDisplay] = useState(0);
  const [mounted, setMounted] = useState(false);
  const v = value || 50;
  const zone = getZone(v);
  const extreme = v <= 20 || v >= 80;

  useEffect(() => {
    const dur = 800;
    const steps = 40;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const t = step / steps;
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(v * eased));
      if (step >= steps) clearInterval(timer);
    }, dur / steps);
    return () => clearInterval(timer);
  }, [v]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const barPct = (v / 100) * 100;

  return (
    <div className={`stat-card${extreme ? ' fg-extreme' : ''}`} style={{
      position: 'relative',
      overflow: 'hidden',
      background: extreme ? zone.bg : 'var(--bg-card)',
      borderColor: extreme ? zone.color : undefined,
      borderLeftColor: zone.color,
      borderLeftWidth: extreme ? 5 : 3,
      transition: 'all 0.4s ease',
      ...(extreme ? { boxShadow: `0 0 40px ${zone.ring}, 0 0 12px ${zone.ring}` } : {})
    }}>
      {/* Animated background shimmer for extreme values */}
      {extreme && (
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          background: `radial-gradient(ellipse at 30% 50%, ${zone.color}, transparent 70%)`,
          animation: 'fg-shimmer 3s ease-in-out infinite alternate'
        }} />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Label */}
        <div className="stat-header">
          <span className="stat-label" style={extreme ? { color: zone.color, fontWeight: 700, letterSpacing: '0.12em' } : {}}>
            Fear & Greed
          </span>
          {fake && <FakeBadge />}
        </div>

        {/* Big number */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '4px 0 6px' }}>
          <span style={{
            fontFamily: DS.mono,
            fontSize: extreme ? 44 : 28,
            fontWeight: 800,
            color: zone.color,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            textShadow: extreme ? `0 0 20px ${zone.ring}, 0 0 40px ${zone.ring}` : 'none',
            transition: 'all 0.4s ease'
          }}>
            {display}
          </span>
          <span style={{
            fontSize: extreme ? 16 : 13,
            fontWeight: extreme ? 800 : 600,
            color: zone.color,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
            transition: 'all 0.5s ease 0.3s'
          }}>
            {zone.label}
          </span>
        </div>

        {/* Spectrum bar */}
        <div style={{ position: 'relative', height: 6, borderRadius: 3, overflow: 'hidden', marginTop: 2 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, #DC2626 0%, #EF4444 15%, #F97316 30%, #F59E0B 45%, #84CC16 65%, #22C55E 80%, #15803D 100%)',
            opacity: 0.25, borderRadius: 3
          }} />
          <div style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${Math.max(0, barPct - 2)}%`,
            width: extreme ? 8 : 5, height: '100%',
            background: zone.color,
            borderRadius: 3,
            boxShadow: extreme ? `0 0 8px ${zone.color}` : 'none',
            transition: 'left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }} />
        </div>

        {/* Detail label */}
        {fgLabel && (
          <div style={{
            fontSize: 12, color: extreme ? zone.color : DS.text3,
            fontWeight: extreme ? 600 : 400,
            marginTop: 6, opacity: 0.8
          }}>
            {fgLabel}
          </div>
        )}
      </div>
    </div>
  );
}

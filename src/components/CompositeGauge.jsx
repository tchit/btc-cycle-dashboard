import React, { useEffect, useState, useRef } from 'react';
import { DS } from '../config/design';

const getZoneLabel = (s) => {
  if (s < 15) return 'CAPITULATION';
  if (s < 30) return 'FEAR';
  if (s < 45) return 'PRUDENCE';
  if (s < 55) return 'NEUTRE';
  if (s < 70) return 'OPTIMISME';
  if (s < 85) return 'EUPHORIE';
  return 'BULLE';
};

// Spring easing for count-up animation
const springEase = (t) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 :
    Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

export default function CompositeGauge({
  score,
  value,
  label,
  signals = [],
  mob
}) {
  const actualScore = score ?? value ?? 50;
  const actualLabel = label || getZoneLabel(actualScore);
  const [displayScore, setDisplayScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const progressRef = useRef(null);

  // Spring count-up animation
  useEffect(() => {
    const duration = 1200;
    const steps = 72;
    const stepTime = duration / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const eased = springEase(progress);
      setDisplayScore(Math.round(actualScore * eased));
      if (currentStep >= steps) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [actualScore]);

  // Trigger mount animation after a short delay
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = mounted ? circumference - (actualScore / 100) * circumference : circumference;

  // Gradient colors based on score zone
  const getGradientColors = () => {
    if (actualScore <= 30) return [DS.down, '#F59E0B'];
    if (actualScore <= 60) return [DS.accent, DS.accentCyan];
    return [DS.up, DS.lime];
  };

  const [gradStart, gradEnd] = getGradientColors();

  const gaugeElement = (
    <div style={{
      position: 'relative', width: 220, height: 220,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }}>
      <svg width="220" height="220" viewBox="0 0 220 220">
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradStart} />
            <stop offset="100%" stopColor={gradEnd} />
          </linearGradient>
          <filter id="gauge-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle className="gauge-bg" cx="110" cy="110" r={radius} />
        <circle
          ref={progressRef}
          className="gauge-progress"
          cx="110" cy="110" r={radius}
          stroke="url(#gauge-grad)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#gauge-glow)"
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.5s ease'
          }}
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-score" style={{
          background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {displayScore}
        </span>
        <span className="gauge-ring-label">{actualLabel}</span>
      </div>
    </div>
  );

  if (signals.length > 0) {
    return (
      <div className="composite-card">
        {gaugeElement}
        <div className="signals-list">
          <h4 style={{
            fontFamily: DS.display,
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 8,
            color: 'var(--text-primary)'
          }}>
            Composition du score
          </h4>
          {signals.map((sig, idx) => (
            <div key={idx} className="signal-row" style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0)' : 'translateX(12px)',
              transition: `opacity 0.4s ease ${0.3 + idx * 0.08}s, transform 0.4s ease ${0.3 + idx * 0.08}s`
            }}>
              <span className="signal-row-name">{sig.name}</span>
              <div className="signal-row-status">
                <span style={{
                  color: sig.status === 'bull' ? 'var(--up)' :
                         sig.status === 'bear' ? 'var(--down)' : 'var(--text-tertiary)'
                }}>
                  {sig.status.toUpperCase()}
                </span>
                <div className={`dot ${sig.status}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return gaugeElement;
}

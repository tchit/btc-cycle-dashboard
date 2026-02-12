import React from 'react';

/**
 * ImagePlaceholder — Stylized placeholder for future illustrations.
 *
 * Props:
 * - variant: 'hero' | 'section' | 'card-bg' | 'sidebar' | 'banner'
 * - label: text describing what image goes here (e.g. "Bitcoin Cityscape")
 * - height: optional explicit height
 * - src: when user provides a real image, it replaces the placeholder
 * - overlay: gradient overlay type ('bottom' | 'full' | 'none')
 * - children: content overlaid on top of the image
 */

const PATTERNS = {
  hero: {
    // Grid city pattern with perspective lines
    svg: (accent) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${accent}" stop-opacity="0.06"/>
            <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
          </linearGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${accent}" stroke-opacity="0.08" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="800" height="400" fill="url(#heroGrad)"/>
        <rect width="800" height="400" fill="url(#grid)"/>
        <!-- Horizon line -->
        <line x1="0" y1="280" x2="800" y2="280" stroke="${accent}" stroke-opacity="0.15" stroke-width="1"/>
        <!-- Perspective lines -->
        <line x1="400" y1="280" x2="0" y2="400" stroke="${accent}" stroke-opacity="0.06" stroke-width="0.5"/>
        <line x1="400" y1="280" x2="200" y2="400" stroke="${accent}" stroke-opacity="0.06" stroke-width="0.5"/>
        <line x1="400" y1="280" x2="400" y2="400" stroke="${accent}" stroke-opacity="0.08" stroke-width="0.5"/>
        <line x1="400" y1="280" x2="600" y2="400" stroke="${accent}" stroke-opacity="0.06" stroke-width="0.5"/>
        <line x1="400" y1="280" x2="800" y2="400" stroke="${accent}" stroke-opacity="0.06" stroke-width="0.5"/>
        <!-- City blocks -->
        <rect x="120" y="180" width="40" height="100" fill="${accent}" fill-opacity="0.04" stroke="${accent}" stroke-opacity="0.12" stroke-width="0.5"/>
        <rect x="170" y="140" width="35" height="140" fill="${accent}" fill-opacity="0.03" stroke="${accent}" stroke-opacity="0.1" stroke-width="0.5"/>
        <rect x="215" y="200" width="50" height="80" fill="${accent}" fill-opacity="0.04" stroke="${accent}" stroke-opacity="0.1" stroke-width="0.5"/>
        <rect x="330" y="100" width="60" height="180" fill="${accent}" fill-opacity="0.05" stroke="${accent}" stroke-opacity="0.15" stroke-width="0.5"/>
        <rect x="400" y="160" width="45" height="120" fill="${accent}" fill-opacity="0.04" stroke="${accent}" stroke-opacity="0.12" stroke-width="0.5"/>
        <rect x="500" y="120" width="55" height="160" fill="${accent}" fill-opacity="0.05" stroke="${accent}" stroke-opacity="0.12" stroke-width="0.5"/>
        <rect x="565" y="190" width="40" height="90" fill="${accent}" fill-opacity="0.03" stroke="${accent}" stroke-opacity="0.1" stroke-width="0.5"/>
        <rect x="640" y="150" width="50" height="130" fill="${accent}" fill-opacity="0.04" stroke="${accent}" stroke-opacity="0.12" stroke-width="0.5"/>
        <!-- Glow at center -->
        <circle cx="400" cy="200" r="120" fill="${accent}" fill-opacity="0.03"/>
        <circle cx="400" cy="200" r="60" fill="${accent}" fill-opacity="0.04"/>
        <!-- Crosshair -->
        <line x1="380" y1="200" x2="360" y2="200" stroke="${accent}" stroke-opacity="0.3" stroke-width="1"/>
        <line x1="420" y1="200" x2="440" y2="200" stroke="${accent}" stroke-opacity="0.3" stroke-width="1"/>
        <line x1="400" y1="180" x2="400" y2="160" stroke="${accent}" stroke-opacity="0.3" stroke-width="1"/>
        <line x1="400" y1="220" x2="400" y2="240" stroke="${accent}" stroke-opacity="0.3" stroke-width="1"/>
        <!-- Corner brackets -->
        <path d="M 20 20 L 20 50" stroke="${accent}" stroke-opacity="0.2" stroke-width="1" fill="none"/>
        <path d="M 20 20 L 50 20" stroke="${accent}" stroke-opacity="0.2" stroke-width="1" fill="none"/>
        <path d="M 780 20 L 780 50" stroke="${accent}" stroke-opacity="0.2" stroke-width="1" fill="none"/>
        <path d="M 780 20 L 750 20" stroke="${accent}" stroke-opacity="0.2" stroke-width="1" fill="none"/>
        <path d="M 20 380 L 20 350" stroke="${accent}" stroke-opacity="0.2" stroke-width="1" fill="none"/>
        <path d="M 20 380 L 50 380" stroke="${accent}" stroke-opacity="0.2" stroke-width="1" fill="none"/>
        <path d="M 780 380 L 780 350" stroke="${accent}" stroke-opacity="0.2" stroke-width="1" fill="none"/>
        <path d="M 780 380 L 750 380" stroke="${accent}" stroke-opacity="0.2" stroke-width="1" fill="none"/>
      </svg>
    `,
    defaultHeight: 280,
  },
  section: {
    // Waveform / chart silhouette
    svg: (accent) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 120" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="secGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${accent}" stop-opacity="0.03"/>
            <stop offset="50%" stop-color="${accent}" stop-opacity="0.06"/>
            <stop offset="100%" stop-color="${accent}" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <rect width="600" height="120" fill="url(#secGrad)"/>
        <!-- Candlestick silhouettes -->
        <rect x="30" y="50" width="6" height="40" fill="${accent}" fill-opacity="0.08"/>
        <rect x="50" y="30" width="6" height="60" fill="${accent}" fill-opacity="0.1"/>
        <rect x="70" y="45" width="6" height="35" fill="${accent}" fill-opacity="0.06"/>
        <rect x="90" y="20" width="6" height="70" fill="${accent}" fill-opacity="0.12"/>
        <rect x="110" y="35" width="6" height="50" fill="${accent}" fill-opacity="0.08"/>
        <rect x="130" y="55" width="6" height="30" fill="${accent}" fill-opacity="0.06"/>
        <rect x="150" y="25" width="6" height="65" fill="${accent}" fill-opacity="0.1"/>
        <rect x="170" y="40" width="6" height="45" fill="${accent}" fill-opacity="0.08"/>
        <rect x="190" y="15" width="6" height="80" fill="${accent}" fill-opacity="0.14"/>
        <rect x="210" y="30" width="6" height="55" fill="${accent}" fill-opacity="0.1"/>
        <rect x="230" y="50" width="6" height="35" fill="${accent}" fill-opacity="0.07"/>
        <rect x="250" y="10" width="6" height="90" fill="${accent}" fill-opacity="0.15"/>
        <rect x="270" y="35" width="6" height="50" fill="${accent}" fill-opacity="0.09"/>
        <rect x="290" y="45" width="6" height="40" fill="${accent}" fill-opacity="0.07"/>
        <rect x="310" y="20" width="6" height="70" fill="${accent}" fill-opacity="0.12"/>
        <rect x="330" y="30" width="6" height="55" fill="${accent}" fill-opacity="0.1"/>
        <!-- Trend line -->
        <polyline points="30,70 90,40 150,50 210,30 270,55 330,25 390,45 450,20 510,35 570,15"
          fill="none" stroke="${accent}" stroke-opacity="0.2" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Corner marks -->
        <path d="M 10 10 L 10 25" stroke="${accent}" stroke-opacity="0.15" stroke-width="1" fill="none"/>
        <path d="M 10 10 L 25 10" stroke="${accent}" stroke-opacity="0.15" stroke-width="1" fill="none"/>
        <path d="M 590 110 L 590 95" stroke="${accent}" stroke-opacity="0.15" stroke-width="1" fill="none"/>
        <path d="M 590 110 L 575 110" stroke="${accent}" stroke-opacity="0.15" stroke-width="1" fill="none"/>
      </svg>
    `,
    defaultHeight: 120,
  },
  'card-bg': {
    // Circuit / mesh pattern
    svg: (accent) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="cardGlow" cx="70%" cy="30%" r="60%">
            <stop offset="0%" stop-color="${accent}" stop-opacity="0.06"/>
            <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill="url(#cardGlow)"/>
        <!-- Circuit traces -->
        <path d="M 300 50 L 350 50 L 350 100 L 380 100" stroke="${accent}" stroke-opacity="0.08" stroke-width="1" fill="none"/>
        <circle cx="300" cy="50" r="3" fill="${accent}" fill-opacity="0.12"/>
        <circle cx="380" cy="100" r="3" fill="${accent}" fill-opacity="0.12"/>
        <path d="M 280 150 L 330 150 L 330 200 L 370 200" stroke="${accent}" stroke-opacity="0.06" stroke-width="1" fill="none"/>
        <circle cx="280" cy="150" r="2" fill="${accent}" fill-opacity="0.1"/>
        <circle cx="370" cy="200" r="2" fill="${accent}" fill-opacity="0.1"/>
        <path d="M 320 230 L 360 230 L 360 260" stroke="${accent}" stroke-opacity="0.06" stroke-width="1" fill="none"/>
        <!-- Scattered dots -->
        <circle cx="340" cy="80" r="1.5" fill="${accent}" fill-opacity="0.08"/>
        <circle cx="360" cy="140" r="1.5" fill="${accent}" fill-opacity="0.08"/>
        <circle cx="310" cy="180" r="1.5" fill="${accent}" fill-opacity="0.06"/>
      </svg>
    `,
    defaultHeight: '100%',
  },
  sidebar: {
    // Topographic / contour pattern
    svg: (accent) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 160" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sideGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${accent}" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="${accent}" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <rect width="256" height="160" fill="url(#sideGrad)"/>
        <!-- Contour lines -->
        <ellipse cx="128" cy="80" rx="100" ry="50" fill="none" stroke="${accent}" stroke-opacity="0.08" stroke-width="0.5"/>
        <ellipse cx="128" cy="80" rx="75" ry="38" fill="none" stroke="${accent}" stroke-opacity="0.1" stroke-width="0.5"/>
        <ellipse cx="128" cy="80" rx="50" ry="25" fill="none" stroke="${accent}" stroke-opacity="0.12" stroke-width="0.5"/>
        <ellipse cx="128" cy="80" rx="25" ry="12" fill="none" stroke="${accent}" stroke-opacity="0.15" stroke-width="0.5"/>
        <!-- Center dot -->
        <circle cx="128" cy="80" r="3" fill="${accent}" fill-opacity="0.2"/>
        <!-- Frame corners -->
        <path d="M 8 8 L 8 24" stroke="${accent}" stroke-opacity="0.15" stroke-width="1" fill="none"/>
        <path d="M 8 8 L 24 8" stroke="${accent}" stroke-opacity="0.15" stroke-width="1" fill="none"/>
        <path d="M 248 152 L 248 136" stroke="${accent}" stroke-opacity="0.15" stroke-width="1" fill="none"/>
        <path d="M 248 152 L 232 152" stroke="${accent}" stroke-opacity="0.15" stroke-width="1" fill="none"/>
      </svg>
    `,
    defaultHeight: 160,
  },
  banner: {
    // Wide horizontal bands
    svg: (accent) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="banGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${accent}" stop-opacity="0"/>
            <stop offset="30%" stop-color="${accent}" stop-opacity="0.06"/>
            <stop offset="70%" stop-color="${accent}" stop-opacity="0.06"/>
            <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <rect width="800" height="200" fill="url(#banGrad)"/>
        <!-- Horizontal scan lines -->
        <line x1="100" y1="60" x2="700" y2="60" stroke="${accent}" stroke-opacity="0.06" stroke-width="0.5"/>
        <line x1="50" y1="100" x2="750" y2="100" stroke="${accent}" stroke-opacity="0.08" stroke-width="0.5"/>
        <line x1="100" y1="140" x2="700" y2="140" stroke="${accent}" stroke-opacity="0.06" stroke-width="0.5"/>
        <!-- Data points -->
        <circle cx="200" cy="100" r="4" fill="${accent}" fill-opacity="0.1"/>
        <circle cx="350" cy="100" r="6" fill="${accent}" fill-opacity="0.08"/>
        <circle cx="500" cy="100" r="4" fill="${accent}" fill-opacity="0.1"/>
        <circle cx="650" cy="100" r="3" fill="${accent}" fill-opacity="0.08"/>
        <!-- Connection lines -->
        <line x1="200" y1="100" x2="350" y2="100" stroke="${accent}" stroke-opacity="0.1" stroke-width="1"/>
        <line x1="350" y1="100" x2="500" y2="100" stroke="${accent}" stroke-opacity="0.1" stroke-width="1"/>
        <line x1="500" y1="100" x2="650" y2="100" stroke="${accent}" stroke-opacity="0.08" stroke-width="1"/>
      </svg>
    `,
    defaultHeight: 160,
  },
};

// Section-specific themes
const SECTION_THEMES = {
  dashboard: { label: 'BITCOIN CYCLE ANALYSIS', icon: '◈' },
  onchain: { label: 'ON-CHAIN METRICS', icon: '⬡' },
  price: { label: 'PRICE ANALYSIS', icon: '◇' },
  miners: { label: 'MINING & HASH RATE', icon: '⬢' },
  derivatives: { label: 'DERIVATIVES & FUNDING', icon: '△' },
  scenarios: { label: 'SIMULATIONS & SCENARIOS', icon: '◎' },
  rainbow: { label: 'RAINBOW CHART', icon: '◐' },
  picycle: { label: 'PI CYCLE INDICATOR', icon: '◉' },
};

export default function ImagePlaceholder({
  variant = 'section',
  label,
  height,
  src,
  overlay = 'bottom',
  section,
  children,
  style: extraStyle,
  className = ''
}) {
  const accent = '#CCFF00';
  const pattern = PATTERNS[variant] || PATTERNS.section;
  const theme = section ? SECTION_THEMES[section] : null;
  const displayLabel = label || (theme ? theme.label : 'IMAGE PLACEHOLDER');
  const resolvedHeight = height || pattern.defaultHeight;

  // If a real image src is provided, use it
  if (src) {
    return (
      <div
        className={`img-placeholder img-placeholder--${variant} ${className}`}
        style={{
          position: 'relative',
          height: resolvedHeight,
          overflow: 'hidden',
          ...extraStyle,
        }}
      >
        <img
          src={src}
          alt={displayLabel}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {overlay !== 'none' && (
          <div className={`img-placeholder__overlay img-placeholder__overlay--${overlay}`} />
        )}
        <div className="img-placeholder__label-container">
          {theme && <span className="img-placeholder__icon">{theme.icon}</span>}
          <span className="img-placeholder__label">{displayLabel}</span>
        </div>
        {children && <div className="img-placeholder__content">{children}</div>}
      </div>
    );
  }

  // SVG placeholder pattern
  const svgMarkup = pattern.svg(accent);
  const encodedSvg = `data:image/svg+xml,${encodeURIComponent(svgMarkup.trim())}`;

  return (
    <div
      className={`img-placeholder img-placeholder--${variant} ${className}`}
      style={{
        position: 'relative',
        height: resolvedHeight,
        overflow: 'hidden',
        ...extraStyle,
      }}
    >
      <div
        className="img-placeholder__pattern"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${encodedSvg}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {overlay !== 'none' && (
        <div className={`img-placeholder__overlay img-placeholder__overlay--${overlay}`} />
      )}
      {/* Placeholder label */}
      <div className="img-placeholder__label-container">
        {theme && <span className="img-placeholder__icon">{theme.icon}</span>}
        <span className="img-placeholder__label">{displayLabel}</span>
        <span className="img-placeholder__hint">[ REMPLACER PAR IMAGE ]</span>
      </div>
      {children && <div className="img-placeholder__content">{children}</div>}
    </div>
  );
}

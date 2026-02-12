import React from 'react';

const MetricCard = ({
  label,
  value,
  prefix = '',
  suffix = '',
  trend = 0,
  trendLabel = '',
  icon = null,
  isLive = false
}) => {
  const isPositive = trend >= 0;
  const trendClass = trend === 0 ? 'neutral' : (isPositive ? 'up' : 'down');
  const sign = isPositive && trend !== 0 ? '+' : '';

  return (
    <div className="kpi-card">
      <div className="kpi-bg-deco" />

      <div className="kpi-header" style={{ position: 'relative', zIndex: 1 }}>
        <span className="kpi-label">{label}</span>
        {icon && <div className="kpi-icon-wrapper">{icon}</div>}
        {isLive && (
          <span className="animate-pulse" style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)',
            display: 'inline-block'
          }} />
        )}
      </div>

      <div className="kpi-value-container" style={{ position: 'relative', zIndex: 1 }}>
        <span className="kpi-value">
          {prefix && <span className="kpi-unit">{prefix}</span>}
          {value}
          {suffix && <span className="kpi-unit" style={{ fontSize: '0.4em', marginLeft: 4 }}>{suffix}</span>}
        </span>

        {trend !== null && (
          <div className={`kpi-trend ${trendClass}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              {isPositive
                ? <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                : <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              }
              {isPositive
                ? <polyline points="17 6 23 6 23 12" />
                : <polyline points="17 18 23 18 23 12" />
              }
            </svg>
            <span>
              {sign}{trend}% {trendLabel && <span style={{ opacity: 0.6, fontWeight: 400 }}>{trendLabel}</span>}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;

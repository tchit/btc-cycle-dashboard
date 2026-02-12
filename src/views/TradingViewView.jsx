import { useEffect, useRef } from 'react';

export default function TradingViewView() {
  const containerRef = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '<div id="tradingview_chart" style="height:100%"></div>';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView && document.getElementById('tradingview_chart')) {
        new window.TradingView.widget({
          autosize: true,
          symbol: 'BINANCE:BTCUSDT',
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'fr',
          toolbar_bg: '#0C1222',
          enable_publishing: false,
          allow_symbol_change: true,
          studies: ['IchimokuCloud@tv-basicstudies'],
          container_id: 'tradingview_chart',
        });
      }
    };

    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, []);

  return (
    <div className="card" style={{ height: 'calc(100vh - 100px)' }}>
      <div className="card-header">
        <div className="card-title">TradingView — BTC/USDT Ichimoku</div>
      </div>
      <div className="card-body" style={{ padding: 0, height: 'calc(100% - 48px)' }}>
        <div ref={containerRef} className="tradingview-widget-container" style={{ height: '100%' }} />
      </div>
    </div>
  );
}

import React from 'react';
import PriceBandsChartV2 from '../components/PriceBandsChartV2';
import PriceHistoryChart from '../components/PriceHistoryChart';

export default function PriceView({ live, calc, hist, mob }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="card">
        <div className="card-header"><div className="card-title">Bandes de Prix Historiques</div></div>
        <div className="card-body">
          <PriceBandsChartV2 price={live.price} mob={mob} levels={calc.liveLevels} histPrices={hist?.prices} />
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Historique & MA200</div></div>
        <div className="card-body">
          <PriceHistoryChart hist={hist} mob={mob} />
        </div>
      </div>
    </div>
  );
}

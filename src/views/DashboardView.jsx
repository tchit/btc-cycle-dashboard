import React from 'react';
import StatCard from '../components/StatCard';
import FearGreedCard from '../components/FearGreedCard';
import CompositeGauge from '../components/CompositeGauge';
import BottomScoreCard from '../components/BottomScoreCard';
import SignalCard from '../components/SignalCard';
import OnChainDepth from '../components/OnChainDepth';
import CyclePosition from '../components/CyclePosition';
import { INFO } from '../config/constants';
import { fP, isFake } from '../utils/format';

export default function DashboardView({ live, calc, hist, mob }) {
  return (
    <>
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <StatCard label="Prix Actuel" value={`$${fP(live.price)}`} change={live.change24h} neutral fake={isFake(live.fakes, 'price')} featured />
        <StatCard label="MVRV Ratio" value={calc.mvrv.toFixed(2)} detail={`Z: ${calc.mvrvz.toFixed(2)}`} status={calc.mvrv < 1 ? 'up' : calc.mvrv > 3.5 ? 'down' : 'neutral'} fake={isFake(live.fakes, 'mvrvratio', 'mvrvz')} />
        <FearGreedCard value={live.fearGreed} fgLabel={live.fgLabel} fake={isFake(live.fakes, 'fearGreed')} />
        <StatCard label="Distance ATH" value={`${calc.drop.toFixed(1)}%`} detail={`${calc.dATH} jours`} status="neutral" fake={isFake(live.fakes, 'price')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '2fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Bottom Composite Score</div>
            <div className="card-badge">LIVE</div>
          </div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 32 }}>
            <CompositeGauge value={calc.composite} mob={mob} />
            <BottomScoreCard scores={calc.bscores} total={calc.totalScore} mob={mob} />
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Signaux Cles</div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SignalCard title="NUPL" value={live.nupl?.toFixed(3)} status={live.nupl < 0 ? 'bullish' : live.nupl > 0.7 ? 'bearish' : 'neutral'} detail="Net Unrealized Profit/Loss" info={INFO.nupl} fake={isFake(live.fakes, 'nupl')} />
              <SignalCard title="RSI 14D" value={live.rsi?.toFixed(0)} status={live.rsi < 30 ? 'bullish' : live.rsi > 70 ? 'bearish' : 'neutral'} detail="Momentum" info={INFO.rsi} fake={isFake(live.fakes, 'rsi')} />
              <SignalCard title="Miner Rev." value={live.puellMultiple?.toFixed(2)} status={live.puellMultiple < 0.5 ? 'bullish' : 'neutral'} detail="Puell Multiple" info={INFO.puell} fake={isFake(live.fakes, 'puellMultiple')} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">On-Chain Depth</div></div>
          <div className="card-body"><OnChainDepth price={live.price} mob={mob} levels={calc.liveLevels} /></div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Cycle Position</div></div>
          <div className="card-body"><CyclePosition mob={mob} /></div>
        </div>
      </div>
    </>
  );
}

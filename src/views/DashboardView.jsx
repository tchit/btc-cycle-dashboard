import React from 'react';
import StatCard from '../components/StatCard';
import FearGreedCard from '../components/FearGreedCard';
import CompositeGauge from '../components/CompositeGauge';
import BottomScoreCard from '../components/BottomScoreCard';
import KeySignals from '../components/KeySignals';
import OnChainDepth from '../components/OnChainDepth';
import CyclePosition from '../components/CyclePosition';
import { INFO } from '../config/constants';
import { fP, isFake } from '../utils/format';

export default function DashboardView({ live, calc, hist, mob, onNavigate }) {
  return (
    <>
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <StatCard label="Prix Actuel" value={`$${fP(live.price)}`} change={live.change24h} neutral fake={isFake(live.fakes, 'price')} featured />
        <StatCard label="MVRV Ratio" value={calc.mvrv.toFixed(2)} detail={`Z: ${calc.mvrvz.toFixed(2)}`} status={calc.mvrv < 1 ? 'up' : calc.mvrv > 3.5 ? 'down' : 'neutral'} fake={isFake(live.fakes, 'mvrvratio', 'mvrvz')} variant="alert" tone={calc.mvrv < 1 ? 'bull' : calc.mvrv > 3.5 ? 'bear' : 'neutral'} />
        <FearGreedCard value={live.fearGreed} fgLabel={live.fgLabel} fake={isFake(live.fakes, 'fearGreed')} />
        <StatCard label="Distance ATH" value={`${calc.drop.toFixed(1)}%`} detail={`${calc.dATH} jours`} status="neutral" fake={isFake(live.fakes, 'price')} variant="glass" />
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
        <KeySignals
          signals={[
            { name: 'NUPL', value: live.nupl?.toFixed(3) || '\u2014', status: live.nupl < 0 ? 'bull' : live.nupl > 0.7 ? 'bear' : 'neutral', desc: 'Net Unrealized P/L', pct: Math.min(Math.max((live.nupl + 1) * 50, 0), 100), info: INFO.nupl },
            { name: 'RSI 14D', value: live.rsi?.toFixed(0) || '\u2014', status: live.rsi < 30 ? 'bull' : live.rsi > 70 ? 'bear' : 'neutral', desc: 'Momentum', pct: live.rsi || 50, info: INFO.rsi },
            { name: 'Puell', value: live.puellMultiple?.toFixed(2) || '\u2014', status: live.puellMultiple < 0.5 ? 'bull' : 'neutral', desc: 'Puell Multiple', pct: Math.min((live.puellMultiple || 0) * 25, 100), info: INFO.puell },
            { name: 'MVRV Z', value: calc.mvrvz?.toFixed(2) || '\u2014', status: calc.mvrvz < 0 ? 'bull' : calc.mvrvz > 6 ? 'bear' : 'neutral', desc: 'Z-Score', pct: Math.min(Math.max((calc.mvrvz + 1) * 15, 0), 100), info: 'Market Value to Realized Value Z-Score' },
          ]}
          onViewAll={onNavigate ? () => onNavigate('onchain') : undefined}
          mob={mob}
        />
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

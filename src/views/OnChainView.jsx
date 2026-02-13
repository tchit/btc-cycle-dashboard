import React from 'react';
import SignalCard from '../components/SignalCard';
import ExhaustionPanel from '../components/ExhaustionPanel';
import ImagePlaceholder from '../components/ImagePlaceholder';
import { INFO } from '../config/constants';
import { fK, isFake } from '../utils/format';

export default function OnChainView({ live, calc, mob }) {
  const d = live.deltas || {};
  return (<>
    {/* Section banner — Replace with blockchain network / node visualization */}
    <ImagePlaceholder variant="section" section="onchain" overlay="bottom" src="/panel6.png" />
    <div className="card">
      <div className="card-header"><div className="card-title">Analyse On-Chain Detaillee</div></div>
      <div className="card-body">
        <div className="signal-grid">
          <SignalCard title="MVRV Ratio" value={calc.mvrv.toFixed(2)} delta={d.mvrvratio} status="neutral" detail="Market vs Realized" info={INFO.mvrv} fake={isFake(live.fakes, 'mvrvratio')} />
          <SignalCard title="SOPR" value={live.sopr?.toFixed(3)} delta={d.sopr} status={live.sopr < 1 ? 'bullish' : 'neutral'} detail="Spent Output Profit" info={INFO.asopr} fake={isFake(live.fakes, 'sopr')} />
          <SignalCard title="RHODL" value={live.rhodl?.toFixed(0)} delta={d.rhodl} status="neutral" detail="HODL Ratio" info={INFO.rhodl} fake={isFake(live.fakes, 'rhodl')} />
          <SignalCard title="STH-RP" value={fK(calc.sthRp)} delta={d.sthRealizedPrice} status={live.price < calc.sthRp ? 'bullish' : 'neutral'} detail="Short Term Holder" info={INFO.sth} fake={isFake(live.fakes, 'sthRealizedPrice')} />
        </div>
        <div style={{ marginTop: 24 }}>
          <ExhaustionPanel pct={calc.exhaustPct} mob={mob} />
        </div>
      </div>
    </div>
  </>);
}

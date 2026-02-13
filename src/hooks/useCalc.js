import { useMemo } from 'react';
import { DS } from '../config/design';
import { ATH, ATHDATE, HALVING, MC, RP, W200, CVDD, STHRP, LTHRP, EXHAUST } from '../config/constants';
import { daysBetween } from '../utils/format';
import { generateMonteCarlo } from '../utils/montecarlo';

export function useCalc(data) {
  return useMemo(() => {
    const now = new Date(), p = data.price;
    const dATH = daysBetween(ATHDATE, now), dHalv = daysBetween(HALVING, now);
    const drop = ((ATH - p) / ATH) * 100;
    const rp = data.realizedPrice || RP;
    const sthRp = data.sthRealizedPrice || STHRP;
    const lthRp = data.lthRealizedPrice || LTHRP;
    const cvdd = data.cvdd || CVDD;
    const mvrv = data.mvrvratio || (p / rp);
    const mvrvz = data.mvrvz || ((p - rp) / (p * 0.4));
    const margin = ((p - MC) / MC) * 100;
    const bearProg = Math.min(100, (dATH / 383) * 100);
    const dBot = Math.max(0, daysBetween(now, new Date(new Date(ATHDATE).getTime() + 383 * 86400000)));
    const dNH = daysBetween(now, new Date('2028-04-15'));
    const cycleDay = dHalv;
    const sma200 = data.sma200 || W200 * 1.2;
    const mayer = p / sma200;
    const puell = data.puellMultiple || 0.79;
    const supplyProfit = data.supplyProfitPct || Math.min(100, Math.max(20, ((p - 20000) / (ATH - 20000)) * 100));

    // Composite scores
    const smvrv = mvrv < 0.8 ? 5 : mvrv < 1.0 ? 15 : mvrv < 1.5 ? 35 : mvrv < 2.5 ? 55 : mvrv < 3.5 ? 80 : 95;
    const snupl = data.nupl < -0.1 ? 5 : data.nupl < 0.1 ? 15 : data.nupl < 0.4 ? 40 : data.nupl < 0.6 ? 65 : data.nupl < 0.75 ? 85 : 95;
    const ssopr = data.sopr < 0.9 ? 5 : data.sopr < 0.97 ? 15 : data.sopr < 1.0 ? 30 : data.sopr < 1.05 ? 50 : 75;
    const ssupply = supplyProfit < 45 ? 5 : supplyProfit < 55 ? 15 : supplyProfit < 70 ? 35 : supplyProfit < 85 ? 60 : supplyProfit < 95 ? 85 : 95;
    const onChain = Math.round((smvrv + snupl + ssopr + ssupply) / 4);

    const smayer = mayer < 0.6 ? 5 : mayer < 0.8 ? 15 : mayer < 1.0 ? 30 : mayer < 1.5 ? 50 : mayer < 2.4 ? 75 : 95;
    const sfg = data.fearGreed < 10 ? 5 : data.fearGreed < 25 ? 15 : data.fearGreed < 45 ? 35 : data.fearGreed < 65 ? 50 : data.fearGreed < 80 ? 70 : 90;
    const sdrop = drop > 70 ? 5 : drop > 50 ? 15 : drop > 30 ? 35 : drop > 15 ? 55 : drop > 5 ? 75 : 90;
    const ssth = p < sthRp * 0.85 ? 5 : p < sthRp ? 20 : p < sthRp * 1.2 ? 45 : 70;
    const mktStruct = Math.round((smayer + sfg + sdrop + ssth) / 4);

    const smargin = margin < -10 ? 5 : margin < 0 ? 12 : margin < 15 ? 30 : margin < 40 ? 50 : margin < 80 ? 70 : 90;
    const spuell = puell < 0.5 ? 5 : puell < 0.7 ? 20 : puell < 1.0 ? 40 : puell < 2.0 ? 60 : puell < 4.0 ? 80 : 95;
    const miners = Math.round((smargin + spuell) / 2);

    const fr = data.fundingRateBG ?? data.fundingRate;
    const sfunding = fr < -0.03 ? 5 : fr < -0.01 ? 15 : fr < 0.01 ? 40 : fr < 0.05 ? 60 : fr < 0.1 ? 80 : 95;
    const oi = data.openInterestBG ?? data.openInterest;
    const soi = oi > 80e9 ? 90 : oi > 60e9 ? 70 : oi > 40e9 ? 45 : oi > 25e9 ? 25 : 10;
    const derivs = Math.round((sfunding + soi + sfg) / 3);

    const composite = Math.round((onChain + mktStruct + miners + derivs) / 4);
    const exhaustPct = Math.round(EXHAUST.reduce((a, e) => a + e.p, 0) / EXHAUST.length);

    // Bottom scores
    const bscores = [
      { id: 'supply', l: 'Supply convergence', th: '50/50', cur: `${supplyProfit.toFixed(0)}/${(100 - supplyProfit).toFixed(0)}`, sc: supplyProfit < 52 ? 100 : supplyProfit < 58 ? 60 : supplyProfit < 65 ? 30 : 0, st: supplyProfit < 52 ? 'hit' : supplyProfit < 60 ? 'partial' : 'miss' },
      { id: 'rsi', l: 'RSI extr\u00eame', th: '< 20', cur: (data.rsi || 29).toFixed(0), sc: data.rsi < 20 ? 100 : data.rsi < 30 ? 70 : data.rsi < 40 ? 30 : 0, st: data.rsi < 20 ? 'hit' : data.rsi < 30 ? 'partial' : 'miss' },
      { id: 'sigma', l: 'Dist. 200d MA', th: '-2\u03c3', cur: sma200 ? ((p / sma200 - 1) * 10).toFixed(1) : '-2.88', sc: p / sma200 < 0.8 ? 100 : p / sma200 < 0.9 ? 60 : p / sma200 < 1 ? 30 : 0, st: p / sma200 < 0.8 ? 'hit' : p / sma200 < 1 ? 'partial' : 'miss' },
      { id: 'funding', l: 'Funding n\u00e9gatif', th: '> 2 sem.', cur: fr < -0.01 ? 'N\u00e9gatif' : 'Compress\u00e9', sc: fr < -0.02 ? 80 : fr < 0 ? 40 : 15, st: fr < -0.02 ? 'hit' : fr < 0 ? 'partial' : 'miss' },
      { id: 'leverage', l: 'Levier purg\u00e9', th: 'OI -40%', cur: `-${(1 - oi / 90e9) * 100}`.slice(0, 3) + '%', sc: oi < 55e9 ? 90 : oi < 70e9 ? 50 : 15, st: oi < 55e9 ? 'hit' : oi < 70e9 ? 'partial' : 'miss' },
      { id: 'mvrv', l: 'MVRV < 1', th: '< 1.0', cur: mvrv.toFixed(2), sc: mvrv < 0.8 ? 100 : mvrv < 1.0 ? 70 : mvrv < 1.15 ? 30 : 0, st: mvrv < 1.0 ? 'hit' : mvrv < 1.15 ? 'partial' : 'miss' },
      { id: 'rpbr', l: 'Prix sous RP', th: `< ${(rp / 1000).toFixed(0)}K`, cur: `${(p / 1000).toFixed(1)}K`, sc: p < rp ? 100 : (p - rp) / rp < 0.1 ? 30 : 0, st: p < rp ? 'hit' : (p - rp) / rp < 0.1 ? 'partial' : 'miss' }
    ];

    const totalScore = Math.round(bscores.reduce((a, s) => a + s.sc, 0) / bscores.length);

    // Monte Carlo
    const mc = generateMonteCarlo(p, 365, 200);

    // Dynamic On-Chain levels
    const ma111 = data.sma200 ? Math.round(data.sma200 * 0.555 * 2) : 90000;
    const ma2y = data.sma200 ? Math.round(sma200 * 0.74) : 75000;
    const w200 = data.sma200 || W200;
    const liveLevels = [
      { k: 'ma111', l: '111-Day MA', v: ma111, c: DS.down },
      { k: 'ma2y', l: '2-Year MA', v: ma2y, c: DS.warn },
      { k: 'sthrp', l: 'STH Realized Price', v: sthRp, c: DS.accent },
      { k: 'w200', l: '200-Week MA', v: w200, c: '#60a5fa' },
      { k: 'rp', l: 'Realized Price', v: rp, c: '#a78bfa' },
      { k: 'cvdd', l: 'CVDD', v: cvdd, c: '#f472b6' },
      { k: 'lthrp', l: 'LTH Realized Price', v: lthRp, c: DS.up }
    ];

    return {
      dATH, dHalv, drop, mvrv, mvrvz, margin, bearProg, dBot, dNH, cycleDay,
      mayer, puell, supplyProfit, composite, onChain, mktStruct, miners, derivs,
      exhaustPct, bscores, totalScore, mc, rp, sthRp, lthRp, cvdd, sma200, liveLevels
    };
  }, [data]);
}

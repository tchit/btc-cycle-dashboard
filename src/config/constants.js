import { DS } from './design';

export const ATH = 126198;
export const ATHDATE = '2025-10-06';
export const HALVING = '2024-04-19';
export const MC = 58096;
export const RP = 55182;
export const W200 = 57926;
export const CVDD = 46718;
export const STHRP = 72000;
export const LTHRP = 38000;
export const MA111 = 90000;
export const MA2Y = 75000;
export const SUPPLYTOTAL = 19800000;

export const CYCLES = [
  { name: 'C1 2011-13', halvD: '2012-11-28', peak: 1177, bottom: 152, peakD: 367, botD: 544 },
  { name: 'C2 2015-17', halvD: '2016-07-09', peak: 19783, bottom: 3122, peakD: 526, botD: 730 },
  { name: 'C3 2020-22', halvD: '2020-05-11', peak: 69000, bottom: 15476, peakD: 546, botD: 895 },
  { name: 'C4 Current', halvD: HALVING, peak: ATH, bottom: null, peakD: 535, botD: null }
];

export const OCLEVELS = [
  { k: 'ma111', l: '111-Day MA', v: MA111, c: DS.down },
  { k: 'ma2y', l: '2-Year MA', v: MA2Y, c: DS.warn },
  { k: 'sthrp', l: 'STH Realized Price', v: STHRP, c: DS.accent },
  { k: 'w200', l: '200-Week MA', v: W200, c: '#60a5fa' },
  { k: 'rp', l: 'Realized Price', v: RP, c: '#a78bfa' },
  { k: 'cvdd', l: 'CVDD', v: CVDD, c: '#f472b6' },
  { k: 'lthrp', l: 'LTH Realized Price', v: LTHRP, c: DS.up }
];

export const EXHAUST = [
  { n: 1, l: 'Levier', d: 'Liquidations en cascade', dur: 'Jours/sem.', st: 'done', p: 100, icon: '\u26A1' },
  { n: 2, l: 'Retail', d: 'Panique retail, capitulation \u00e9motionnelle', dur: '1-3 mois', st: 'active', p: 70, icon: '\uD83D\uDE31' },
  { n: 3, l: 'Miners', d: 'Vente tr\u00e9sorerie, arr\u00eat machines', dur: 'Mois', st: 'early', p: 25, icon: '\u26CF' },
  { n: 4, l: 'ETF Outflows', d: 'R\u00e9duction exposition institutionnelle', dur: 'Mois', st: 'early', p: 30, icon: '\uD83C\uDFE6' },
  { n: 5, l: 'STH Capitulation', d: 'Derniers vendeurs forc\u00e9s', dur: 'Final', st: 'pending', p: 5, icon: '\uD83C\uDFF3' }
];

export const SCENARIOS = [
  { l: 'Shallow', z: '200W MA tient', r: [58, 65], dd: [-48, -52], p: 20, c: DS.up },
  { l: 'Mod\u00e9r\u00e9', z: 'Sous RP \u2192 CVDD', r: [45, 55], dd: [-56, -64], p: 50, c: DS.accent, hl: true },
  { l: 'Deep', z: 'Touche CVDD', r: [35, 45], dd: [-64, -72], p: 25, c: DS.warn },
  { l: 'Extr\u00eame', z: 'Sous CVDD', r: [25, 35], dd: [-72, -80], p: 5, c: DS.down }
];

export const TIMING = [
  { m: 'ATH + 383j', calc: '6 oct 25 + 383j', result: '24 oct 2026', conf: 0.7 },
  { m: 'Halving + 863j', calc: '19 avr 24 + 863j', result: 'Sep 2026', conf: 0.8 },
  { m: 'Next Halv. - 513j', calc: 'Avr 28 - 513j', result: 'Oct-Nov 2026', conf: 0.75 }
];

export const INFO = {
  mvrv: 'MVRV compare le prix actuel au prix moyen d\'achat de tous les BTC (Realized Price). <1 = march\u00e9 sous-\u00e9valu\u00e9, signal d\'accumulation historique.',
  fg: 'Indice de sentiment du march\u00e9 0-100. Extreme Fear (<20) = panique, bon moment pour acheter. Extreme Greed (>80) = euphorie, prudence.',
  mining: 'Marge des mineurs = \u00e9cart entre le prix BTC et le co\u00fbt moyen de minage.',
  funding: 'Taux de financement des positions futures. N\u00e9gatif = les shorts paient les longs (signal contrarian haussier).',
  nupl: 'Net Unrealized Profit/Loss. <0 = le r\u00e9seau est globalement en perte. Zone de capitulation.',
  supply: 'Pourcentage du supply BTC en profit. ~50% = \u00e9quilibre historique des bottoms. >95% = top.',
  asopr: 'Adjusted Spent Output Profit Ratio. <1 = les BTC vendus le sont \u00e0 perte en moyenne.',
  puell: 'Revenu quotidien des mineurs vs moyenne 365j. <0.5 = zone d\'achat. >4 = top.',
  rsi: 'Relative Strength Index sur 14 jours. <30 = survendu. >70 = surachet\u00e9.',
  rhodl: 'Ratio entre les coins r\u00e9cents et anciens. <2 = accumulation. >50 = distribution.',
  hash: 'Croisement des MAs du hashrate. SMA30 < SMA60 = "Down" = capitulation mineurs (signal d\'achat).',
  sth: 'Prix moyen d\'achat des holders r\u00e9cents (<155j). Prix sous STH RP = capitulation.',
  composite: 'Score agr\u00e9g\u00e9 combinant On-Chain (25%), Structure march\u00e9 (25%), Miners (25%) et D\u00e9riv\u00e9s (25%).',
  picycle: 'Le Pi Cycle Top compare le 111 DMA au 350 DMA\u00d72. Croisement = signal de top historique.',
  rainbow: 'R\u00e9gression log du prix BTC depuis 2009. 9 bandes indiquent les zones de sous/survaluation.',
  etf: 'BTC total dans les ETF Spot US + flux net quotidien. Inflows = bullish. Outflows (-) = bearish.',
  backtest: 'Simulation : acheter 10K$ quand le score tombe sous le seuil bas, vendre quand il d\u00e9passe le seuil haut.'
};

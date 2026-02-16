// Sources, methodology, and computed metrics documentation
// Reference project paths kept as documentation (not our repo structure)

export const EXTERNAL_SOURCES = [
  {
    section: 'Historical ATH/Bottom Prices (Cycles 1-3)',
    items: ['CoinGecko: Bitcoin ATH Data'],
  },
  {
    section: 'MVRV/CVDD Confirmations at Historical Bottoms',
    items: [
      'Blockworks: Nov 2022 Bottom Metrics (MVRV 0.75)',
      'Willy Woo: CVDD at $15.4K (Jun 2022)',
    ],
  },
  {
    section: 'Analysis Articles',
    items: [
      'CoinDesk: 200W MA as line in the sand',
      'Glassnode: 2022 Bear of Historic Proportions',
      'NewsBTC: Bear Market Framework',
      'NewsBTC: CVDD Model Signals',
      'IndexBox: Feb 2026 Selloff Analysis',
      'Bitcoin Magazine: Price Forecast Valuation Metrics',
      'Bitcoin Magazine: 200W MA Peak Forecasting',
      'CoinDesk: BTC spirals toward $60K',
      'CNBC: Bitcoin drops 15%',
    ],
  },
];

export const COMPUTED_METRICS = {
  columns: ['Metric', 'Data Source', 'Code Location'],
  rows: [
    { metric: 'Realized Price', source: 'BGeometrics API (/v1/realized-price)', location: 'src/api/bottom-metrics/route.ts' },
    { metric: 'CVDD', source: 'Blockchain.info prices + BGeometrics CDD', location: 'src/lib/balanced-price.ts' },
    { metric: 'Balanced Price', source: 'Blockchain.info prices + BGeometrics CDD + RP', location: 'src/lib/balanced-price.ts' },
    { metric: '111d / 730d / 1400d MAs', source: 'Blockchain.info prices (computeSMA())', location: 'src/api/cycle-models/route.ts' },
    { metric: 'MVRV (bottom-metrics)', source: 'BTC_PRICE / REALIZED_PRICE', location: 'src/api/bottom-metrics/route.ts' },
    { metric: 'MVRV / NVT / SOPR / NUPL', source: 'BGeometrics API (4 endpoints)', location: 'src/api/onchain-metrics/route.ts' },
    { metric: 'Mining Cost (dual)', source: 'Blockchain.info + CBECI/Digiconomist + EIA', location: 'src/api/mining-economics/route.ts' },
    { metric: 'Puell Multiple + 200d/200w MAs', source: 'Blockchain.info prices + issuance schedule', location: 'src/api/macro-indicators/route.ts' },
    { metric: 'Fear & Greed Index', source: 'alternative.me API', location: 'src/api/fear-greed/route.ts' },
    { metric: 'RSI (4h / 1d / 1w)', source: 'Binance klines + Wilder RSI(14) + EMA(14)', location: 'src/api/rsi/route.ts' },
    { metric: 'BTC ATH', source: 'Static constants (Cycle 4 ATH)', location: 'src/api/btc-ath/route.ts' },
    { metric: 'Cycle Projections', source: 'Historical patterns + live RP/200W MA', location: 'src/api/cycle-projections/route.ts' },
    { metric: 'Zone Transitions', source: 'Post-ATH price scanning vs metric thresholds', location: 'src/lib/zone-transitions.ts' },
    { metric: 'Historical cycle gaps', source: 'Local archived JSON (API-RAW/)', location: 'src/api/historical-gaps/route.ts' },
    { metric: 'Historical cycle bottom metrics', source: 'Pre-computed constants (MA, RP, CVDD, BP, MVRV)', location: 'src/lib/bottom-analysis-constants.ts' },
  ],
};

export const METHODOLOGY_NOTES = [
  'Values marked "(est.)" are approximations derived from MVRV ratios or trend extrapolation.',
  'Realized Price at historical bottoms derived from: RP = Price / MVRV.',
  '2015 MVRV at bottom estimated at 0.55-0.60 based on historical MVRV charts.',
  '2018 MVRV at bottom estimated at 0.75-0.80.',
  '2022 MVRV at bottom confirmed at 0.75 (Blockworks source).',
  'CVDD value in Jun 2022 confirmed at $15,400 via Willy Woo (creator of CVDD).',
  'CVDD self-computed: CVDD = \u03a3(CDD\u00d7Price) / (Age \u00d7 6,000,000).',
  'Balanced Price self-computed: BP = Realized Price - \u03a3(CDD\u00d7Price)/(Supply\u00d7Age). Verified within 0.4-2.3% of Bitcoin Magazine Pro.',
  'BP = Realized Price - Transferred Price; historically ~78-91% of RP at cycle bottoms.',
  'Price has touched/dipped below BP at every completed cycle bottom (Price/BP: 0.95, 0.91, 0.99).',
  'Cycle 5 halving-to-ATH gain (+27%): log-linear regression of ln(gain%) vs cycle number on 4 data points, R\u00b2=0.99.',
  'Cycle 5 bottom-to-ATH gain (+149%): log-linear regression on 3 data points, R\u00b2=0.98.',
  'Cycle 5 bull run length (~520d): recency-weighted average with 4:3:2:1 weights.',
  'Next halving (~Feb 2028): recency-weighted average of halving intervals = 1,407 days from Apr 19, 2024.',
  'Fear & Greed Index sourced from alternative.me API (10-min cache).',
  'RSI(14) computed using Wilder smoothing for 4h, 1d, 1w timeframes from Binance klines. EMA(14) of RSI series used as signal line.',
  'Mining cost uses dual model: miner average ($0.05/kWh, CBECI expert estimate) vs U.S. industrial rate (EIA API with 24h cache, $0.09/kWh fallback).',
  'POST_ATH_LOW tracks the deepest daily close since ATH date, not current price. Values freeze until a new lower close occurs.',
  'Zone transitions detected by scanning post-ATH price history against live metric thresholds (111d MA, 2Y MA, 200W MA, RP, CVDD, BP).',
];

// Phase 5 — Dynamic Content System (not yet implemented)
// These templates are from the reference project and are not functional in our codebase.
//
// LIVE_VARIABLES: [
//   '{LIVE:BTC_PRICE}', '{LIVE:ATH_PRICE}', '{LIVE:ATH_DATE}', '{LIVE:HALVING_DATE}',
//   '{LIVE:CURRENT_DATE}', '{LIVE:REALIZED_PRICE}', '{LIVE:CVDD}', '{LIVE:BALANCED_PRICE}',
//   '{LIVE:111D_MA}', '{LIVE:2Y_MA}', '{LIVE:200W_MA}', '{LIVE:MVRV}',
//   '{LIVE:POST_ATH_LOW_PRICE}', '{LIVE:POST_ATH_LOW_DATE}', '{LIVE:ATH_TO_LOW_DAYS}',
//   '{LIVE:HALVING_TO_LOW_DAYS}', '{LIVE:CURRENT_ZONE}',
// ]
//
// CONDITIONALS: [
//   '{{COND:last_updated}}', '{{COND:mvrv_implication}}', '{{COND:drawdown_qualifier}}',
//   '{{COND:zone1_5_duration}}', '{{COND:zone1_5_gap}}', '{{COND:zone1_5_exit_type}}',
//   '{{COND:zone2_200w_status}}', '{{COND:zone3_5_behavior}}', '{{COND:ma200w_vs_rp_gap}}',
//   '{{COND:ma200w_trend}}', '{{COND:rp_trend}}', '{{COND:cvdd_trend}}',
//   '{{COND:timeline_stage1-5}}',
// ]

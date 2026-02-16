// Sources, méthodologie et documentation des métriques calculées
// Les chemins de code réfèrent au projet de référence, pas à notre repo

export const EXTERNAL_SOURCES = [
  {
    section: 'Prix ATH/Bottom historiques (Cycles 1-3)',
    items: ['CoinGecko : Bitcoin ATH Data'],
  },
  {
    section: 'Confirmations MVRV/CVDD aux bottoms historiques',
    items: [
      'Blockworks : Métriques bottom nov. 2022 (MVRV 0.75)',
      'Willy Woo : CVDD à $15.4K (juin 2022)',
    ],
  },
  {
    section: 'Articles d\'analyse',
    items: [
      'CoinDesk : 200W MA comme ligne de défense',
      'Glassnode : Bear 2022 de proportions historiques',
      'NewsBTC : Cadre d\'analyse bear market',
      'NewsBTC : Signaux du modèle CVDD',
      'IndexBox : Analyse de la vente de fév. 2026',
      'Bitcoin Magazine : Prévisions de prix par métriques de valorisation',
      'Bitcoin Magazine : Prévisions par 200W MA au peak',
      'CoinDesk : BTC en spirale vers $60K',
      'CNBC : Bitcoin chute de 15%',
    ],
  },
];

export const COMPUTED_METRICS = {
  columns: ['Métrique', 'Source de données', 'Emplacement code'],
  rows: [
    { metric: 'Realized Price', source: 'BGeometrics API (/v1/realized-price)', location: 'src/api/bottom-metrics/route.ts' },
    { metric: 'CVDD', source: 'Blockchain.info prices + BGeometrics CDD', location: 'src/lib/balanced-price.ts' },
    { metric: 'Balanced Price', source: 'Blockchain.info prices + BGeometrics CDD + RP', location: 'src/lib/balanced-price.ts' },
    { metric: 'MAs 111d / 730d / 1400d', source: 'Blockchain.info prices (computeSMA())', location: 'src/api/cycle-models/route.ts' },
    { metric: 'MVRV (bottom-metrics)', source: 'BTC_PRICE / REALIZED_PRICE', location: 'src/api/bottom-metrics/route.ts' },
    { metric: 'MVRV / NVT / SOPR / NUPL', source: 'BGeometrics API (4 endpoints)', location: 'src/api/onchain-metrics/route.ts' },
    { metric: 'Coût de minage (dual)', source: 'Blockchain.info + CBECI/Digiconomist + EIA', location: 'src/api/mining-economics/route.ts' },
    { metric: 'Puell Multiple + MAs 200d/200w', source: 'Blockchain.info prices + schedule d\'émission', location: 'src/api/macro-indicators/route.ts' },
    { metric: 'Fear & Greed Index', source: 'alternative.me API', location: 'src/api/fear-greed/route.ts' },
    { metric: 'RSI (4h / 1d / 1w)', source: 'Binance klines + Wilder RSI(14) + EMA(14)', location: 'src/api/rsi/route.ts' },
    { metric: 'BTC ATH', source: 'Constantes statiques (ATH Cycle 4)', location: 'src/api/btc-ath/route.ts' },
    { metric: 'Projections de cycle', source: 'Patterns historiques + RP/200W MA live', location: 'src/api/cycle-projections/route.ts' },
    { metric: 'Transitions de zone', source: 'Scan prix post-ATH vs seuils métriques', location: 'src/lib/zone-transitions.ts' },
    { metric: 'Écarts historiques entre cycles', source: 'JSON archivé local (API-RAW/)', location: 'src/api/historical-gaps/route.ts' },
    { metric: 'Métriques bottom historiques', source: 'Constantes pré-calculées (MA, RP, CVDD, BP, MVRV)', location: 'src/lib/bottom-analysis-constants.ts' },
  ],
};

export const METHODOLOGY_NOTES = [
  'Les valeurs marquées "(est.)" sont des approximations dérivées de ratios MVRV ou d\'extrapolation de tendances.',
  'Le Realized Price aux bottoms historiques est dérivé de : RP = Prix / MVRV.',
  'MVRV au bottom 2015 estimé à 0.55-0.60 d\'après les graphiques MVRV historiques.',
  'MVRV au bottom 2018 estimé à 0.75-0.80.',
  'MVRV au bottom 2022 confirmé à 0.75 (source Blockworks).',
  'Valeur CVDD en juin 2022 confirmée à $15,400 via Willy Woo (créateur du CVDD).',
  'CVDD auto-calculé : CVDD = Σ(CDD×Prix) / (Âge × 6,000,000).',
  'Balanced Price auto-calculé : BP = Realized Price - Σ(CDD×Prix)/(Supply×Âge). Vérifié à 0.4-2.3% de Bitcoin Magazine Pro.',
  'BP = Realized Price - Transferred Price ; historiquement ~78-91% du RP aux bottoms de cycle.',
  'Le prix a touché/traversé le BP à chaque bottom de cycle complété (Prix/BP : 0.95, 0.91, 0.99).',
  'Gain halving-vers-ATH Cycle 5 (+27%) : régression log-linéaire de ln(gain%) vs numéro de cycle sur 4 points, R²=0.99.',
  'Gain bottom-vers-ATH Cycle 5 (+149%) : régression log-linéaire sur 3 points, R²=0.98.',
  'Durée bull run Cycle 5 (~520j) : moyenne pondérée par récence avec poids 4:3:2:1.',
  'Prochain halving (~fév. 2028) : moyenne pondérée des intervalles de halving = 1,407 jours depuis le 19 avr. 2024.',
  'Fear & Greed Index sourcé depuis l\'API alternative.me (cache 10 min).',
  'RSI(14) calculé avec le lissage Wilder pour les timeframes 4h, 1d, 1w à partir des klines Binance. L\'EMA(14) de la série RSI sert de ligne de signal.',
  'Le coût de minage utilise un modèle dual : moyenne mineurs ($0.05/kWh, estimation expert CBECI) vs taux industriel US (API EIA avec cache 24h, fallback $0.09/kWh).',
  'POST_ATH_LOW suit le plus bas close journalier depuis la date ATH, pas le prix courant. Les valeurs se figent jusqu\'à un nouveau plus bas.',
  'Les transitions de zone sont détectées en scannant l\'historique de prix post-ATH contre les seuils de métriques live (111d MA, 2Y MA, 200W MA, RP, CVDD, BP).',
];

// Phase 5 — Système de contenu dynamique (pas encore implémenté)
// Ces templates viennent du projet de référence et ne sont pas fonctionnels dans notre codebase.
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

export const FALLBACK = {
  price: 68689, change24h: -0.56, marketCap: 1373e9, dominance: 56.9,
  fearGreed: 9, fgLabel: 'Extreme Fear', volume24h: 49.8e9,
  nupl: 0.227, sopr: 0.987, asopr: 0.975, mvrvz: 0.534, mvrvratio: 1.288,
  realizedPrice: 54563, sthRealizedPrice: 92645, lthRealizedPrice: 44349,
  supplyProfitPct: 45.29, supplyProfitBtc: 9051976, rhodl: 1.056,
  rsi: 29.0, sma200: 102083, ema200: 95738, sma50: 86615,
  fundingRate: -0.005, openInterest: 32e9,
  etfBtcTotal: 644726, etfFlowBtc: -4968,
  hashrate: 1028, difficulty: 126e12, puellMultiple: 0.79,
  hashRibbons: 'Down', hashSma30: 964567, hashSma60: 1010355,
  terminalPrice: 294320, cvdd: 46261
};

export const SOURCE_FIELDS = {
  coingecko: ['price', 'marketCap', 'change24h', 'volume24h'],
  dominance: ['dominance'],
  fng: ['fearGreed', 'fgLabel'],
  binance: ['fundingRate', 'openInterest'],
  mempool: ['hashrate', 'difficulty'],
  bgeometrics: ['nupl', 'sopr', 'asopr', 'mvrvz', 'mvrvratio', 'realizedPrice', 'sthRealizedPrice', 'lthRealizedPrice', 'puellMultiple', 'supplyProfitPct', 'supplyProfitBtc', 'rhodl', 'rsi', 'sma200', 'ema200', 'sma50', 'hashRibbons', 'hashSma30', 'hashSma60', 'etfBtcTotal', 'etfFlowBtc', 'terminalPrice', 'cvdd']
};

import { useState, useEffect, useCallback } from 'react';
import { FALLBACK, SOURCE_FIELDS } from '../config/fallback';

export function useLiveData() {
  const [data, setData] = useState({ ...FALLBACK, live: false, loading: true, lastUpdate: null, sources: {}, fakes: new Set(Object.keys(FALLBACK)) });

  const fetchAll = useCallback(async () => {
    let r = { ...FALLBACK, live: false, loading: false, lastUpdate: new Date(), sources: {} };
    const fakes = new Set(Object.keys(FALLBACK));
    const markLive = (sourceKey) => {
      (SOURCE_FIELDS[sourceKey] || []).forEach(f => fakes.delete(f));
    };

    // Price: Binance primary, CoinGecko fallback
    let priceOk = false;
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
      if (res.ok) {
        const j = await res.json();
        r.price = parseFloat(j.lastPrice);
        r.change24h = parseFloat(j.priceChangePercent);
        r.volume24h = parseFloat(j.quoteVolume);
        priceOk = true;
        r.live = true;
        fakes.delete('price');
        fakes.delete('change24h');
        fakes.delete('volume24h');
      }
    } catch (e) {}

    // CoinGecko: marketCap + prix si Binance a echoue
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&include_24hr_vol=true');
      if (res.ok) {
        const j = await res.json();
        if (j.bitcoin) {
          if (!priceOk) {
            r.price = j.bitcoin.usd;
            r.change24h = j.bitcoin.usd_24h_change;
            r.volume24h = j.bitcoin.usd_24h_vol;
            priceOk = true;
          }
          r.marketCap = j.bitcoin.usd_market_cap;
          r.sources.coingecko = true;
          r.live = true;
          markLive('coingecko');
        }
      } else {
        r.sources.coingecko = priceOk ? 'partial' : false;
      }
    } catch (e) {
      r.sources.coingecko = priceOk ? 'partial' : false;
    }

    // Dominance
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/global');
      if (res.ok) {
        const j = await res.json();
        r.dominance = j.data?.market_cap_percentage?.btc;
        r.live = true;
        markLive('dominance');
      }
    } catch (e) {}

    // Fear & Greed
    try {
      const res = await fetch('https://api.alternative.me/fng/?limit=1');
      if (res.ok) {
        const j = await res.json();
        if (j.data?.[0]) {
          r.fearGreed = parseInt(j.data[0].value);
          r.fgLabel = j.data[0].value_classification;
          r.sources.fng = true;
          r.live = true;
          markLive('fng');
        }
      }
    } catch (e) { r.sources.fng = false; }

    // Binance Futures (historical funding rates)
    try {
      const fr = await fetch('https://fapi.binance.com/fapi/v1/fundingRate?symbol=BTCUSDT&limit=500');
      if (fr.ok) {
        const j = await fr.json();
        if (j.length) {
          r.fundingRate = parseFloat(j[j.length - 1]?.fundingRate) * 100;
          r.fundingHistory = j.map(entry => ({
            ts: entry.fundingTime,
            rate: parseFloat(entry.fundingRate) * 100
          }));
          r.sources.binance = true;
          r.live = true;
          markLive('binance');
        }
      }
    } catch (e) { r.sources.binance = false; }

    // Aggregated Open Interest via Worker proxy (bypasses CORS)
    try {
      const oiRes = await fetch('https://bg-proxy.sv9ch954y9.workers.dev/oi');
      if (oiRes.ok) {
        const oi = await oiRes.json();
        if (oi.total > 0 && oi.count >= 2) {
          r.openInterestAgg = oi.total;
          r.oiExchanges = oi.count;
          fakes.delete('openInterest');
        }
      }
    } catch (e) {}

    // Mempool
    try {
      const res = await fetch('https://mempool.space/api/v1/mining/hashrate/1w');
      if (res.ok) {
        const j = await res.json();
        if (j.hashrates?.length) {
          r.hashrate = j.hashrates[j.hashrates.length - 1].avgHashrate / 1e18;
          r.sources.mempool = true;
          r.live = true;
          markLive('mempool');
        }
        if (j.difficulty?.length) {
          r.difficulty = j.difficulty[j.difficulty.length - 1].difficulty;
        }
      }
    } catch (e) { r.sources.mempool = false; }

    // BGeometrics: Worker proxy primary, direct bitcoin-data.com fallback
    const BGPROXY = 'https://bg-proxy.sv9ch954y9.workers.dev';
    const BGDIRECT = 'https://bitcoin-data.com';
    const CACHEKEY = 'bg_cache', CACHETTL = 1 * 60 * 60 * 1000;
    const BG_RATE_KEY = 'bg_rate_log', BG_RATE_MAX = 8, BG_RATE_WINDOW = 60 * 60 * 1000;
    let cached = null, cachedStale = null, cacheTs = null;

    try {
      const raw = localStorage.getItem(CACHEKEY);
      if (raw) {
        const c = JSON.parse(raw);
        cacheTs = c.ts;
        if (Date.now() - c.ts < CACHETTL) cached = c.data;
        else cachedStale = c.data;
      }
    } catch (e) {}

    const bgCanCall = () => {
      try {
        const now = Date.now();
        let log = JSON.parse(localStorage.getItem(BG_RATE_KEY) || '[]');
        log = log.filter(ts => now - ts < BG_RATE_WINDOW);
        localStorage.setItem(BG_RATE_KEY, JSON.stringify(log));
        return log.length < BG_RATE_MAX;
      } catch (e) { return false; }
    };
    const bgRecordCall = () => {
      try {
        const now = Date.now();
        let log = JSON.parse(localStorage.getItem(BG_RATE_KEY) || '[]');
        log.push(now);
        log = log.filter(ts => now - ts < BG_RATE_WINDOW);
        localStorage.setItem(BG_RATE_KEY, JSON.stringify(log));
      } catch (e) {}
    };

    // Parse aggregated BGeometrics response into our bg object
    const parseBgAll = (get) => {
      const bg = {};

      const nupl = get('nupl');
      if (nupl?.nupl != null) bg.nupl = parseFloat(nupl.nupl);

      const sopr = get('sopr');
      if (sopr?.sopr != null) bg.sopr = parseFloat(sopr.sopr);

      const asopr = get('asopr');
      if (asopr?.asopr != null) bg.asopr = parseFloat(asopr.asopr);

      const mvrvz = get('mvrv-zscore');
      if (mvrvz?.mvrvZscore != null) bg.mvrvz = parseFloat(mvrvz.mvrvZscore);

      const mvrv = get('mvrv');
      if (mvrv?.mvrv != null) bg.mvrvratio = parseFloat(mvrv.mvrv);

      const rpv = get('realized-price');
      if (rpv?.realizedPrice != null) bg.realizedPrice = parseFloat(rpv.realizedPrice);

      const sthRp = get('sth-realized-price');
      if (sthRp?.sthRealizedPrice != null) bg.sthRealizedPrice = parseFloat(sthRp.sthRealizedPrice);

      const lthRp = get('lth-realized-price');
      if (lthRp?.lthRealizedPrice != null) bg.lthRealizedPrice = parseFloat(lthRp.lthRealizedPrice);

      const puell = get('puell-multiple');
      if (puell?.puellMultiple != null) bg.puellMultiple = parseFloat(puell.puellMultiple);

      const pl = get('profit-loss');
      if (pl?.profitLoss != null) bg.supplyProfitPct = parseFloat(pl.profitLoss);

      const sp = get('supply-profit');
      if (sp?.supplyProfit != null) bg.supplyProfitBtc = parseFloat(sp.supplyProfit);

      const rhodl = get('rhodl-ratio');
      if (rhodl?.rhodlRatio != null) bg.rhodl = parseFloat(rhodl.rhodlRatio);

      const ti = get('technical-indicators');
      if (ti) {
        if (ti.rsi != null) bg.rsi = parseFloat(ti.rsi);
        if (ti.sma200 != null) bg.sma200 = parseFloat(ti.sma200);
        if (ti.ema200 != null) bg.ema200 = parseFloat(ti.ema200);
        if (ti.sma50 != null) bg.sma50 = parseFloat(ti.sma50);
      }

      const hr = get('hashribbons');
      if (hr) {
        bg.hashRibbons = hr.hashribbons || 'Unknown';
        if (hr.sma30) bg.hashSma30 = parseFloat(hr.sma30);
        if (hr.sma60) bg.hashSma60 = parseFloat(hr.sma60);
      }

      const frd = get('funding-rate');
      if (frd?.fundingRate != null) bg.fundingRateBG = parseFloat(frd.fundingRate);

      const etfTot = get('etf-btc-total');
      if (etfTot?.etfBtcTotal != null) bg.etfBtcTotal = parseFloat(etfTot.etfBtcTotal);

      const etfFl = get('etf-flow-btc');
      if (etfFl?.etfFlow != null) bg.etfFlowBtc = parseFloat(etfFl.etfFlow);

      const oiFut = get('open-interest-futures');
      if (oiFut) {
        const oiKeys = ['binance', 'bybit', 'okx', 'bitget', 'deribit', 'bitmex', 'huobi', 'bitfinex', 'gateIo', 'kucoin', 'kraken', 'cryptoCom'];
        const oiSum = oiKeys.reduce((s, k) => s + (parseFloat(oiFut[k]) || 0), 0);
        if (oiSum > 0) bg.openInterestBG = oiSum;
      }

      return bg;
    };

    // Direct fetch from bitcoin-data.com (fallback when Worker is down)
    // Limited to 8 endpoints to respect free tier rate limit (8 req/hour)
    const fetchBgDirect = async () => {
      const endpoints = [
        'technical-indicators', 'mvrv', 'mvrv-zscore', 'nupl',
        'sopr', 'realized-price', 'sth-realized-price', 'lth-realized-price'
      ];
      const all = {};
      const results = await Promise.allSettled(
        endpoints.map(async (ep) => {
          const res = await fetch(`${BGDIRECT}/v1/${ep}/last`);
          if (res.ok) all[`/v1/${ep}/last`] = await res.json();
        })
      );
      return all;
    };

    const applyBg = (bg, source) => {
      if (Object.keys(bg).length > 0) {
        Object.assign(r, bg);
        r.sources.bgeometrics = source;
        r.bgFetchTime = Date.now();
        r.live = true;
        markLive('bgeometrics');
        try {
          localStorage.setItem(CACHEKEY, JSON.stringify({ ts: Date.now(), data: bg }));
        } catch (e) {}
      }
    };

    if (cached) {
      Object.assign(r, cached);
      r.sources.bgeometrics = 'cache';
      r.bgFetchTime = cacheTs;
      r.live = true;
      markLive('bgeometrics');
    } else if (!bgCanCall()) {
      if (cachedStale) {
        Object.assign(r, cachedStale);
        r.sources.bgeometrics = 'cache';
        r.bgFetchTime = cacheTs;
        r.live = true;
        markLive('bgeometrics');
      } else {
        r.sources.bgeometrics = false;
      }
    } else {
      bgRecordCall();
      let bgOk = false;

      // Strategy 1: Worker proxy (aggregated, fast)
      try {
        const res = await fetch(`${BGPROXY}/all`);
        if (res.ok) {
          const all = await res.json();
          const bg = parseBgAll((path) => all[`/v1/${path}/last`]);
          if (Object.keys(bg).length > 2) {
            applyBg(bg, 'live');
            bgOk = true;
          }
        }
      } catch (e) {}

      // Strategy 2: Direct bitcoin-data.com (if Worker failed)
      if (!bgOk) {
        try {
          const all = await fetchBgDirect();
          const bg = parseBgAll((path) => all[`/v1/${path}/last`]);
          if (Object.keys(bg).length > 0) {
            applyBg(bg, 'direct');
            bgOk = true;
          }
        } catch (e) {}
      }

      // Strategy 3: Stale cache as last resort
      if (!bgOk) {
        if (cachedStale) {
          Object.assign(r, cachedStale);
          r.sources.bgeometrics = 'stale';
          r.bgFetchTime = cacheTs;
          r.live = true;
          markLive('bgeometrics');
        } else {
          r.sources.bgeometrics = false;
        }
      }
    }

    // Mark OI as live if BGeometrics provided it (fallback when aggregation fails)
    if (r.openInterestBG && !r.openInterestAgg) fakes.delete('openInterest');

    r.fakes = fakes;
    setData(r);
  }, []);

  useEffect(() => {
    fetchAll();
    const iv = setInterval(fetchAll, 60000);
    return () => clearInterval(iv);
  }, [fetchAll]);

  return data;
}

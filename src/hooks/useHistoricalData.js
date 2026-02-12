import { useState, useEffect } from 'react';

export function useHistoricalData() {
  const [hist, setHist] = useState(null);

  useEffect(() => {
    const CACHEKEY = 'hist_v10', CACHETTL = 6 * 60 * 60 * 1000;

    try {
      const raw = localStorage.getItem(CACHEKEY);
      if (raw) {
        const c = JSON.parse(raw);
        if (Date.now() - c.ts < CACHETTL) {
          if (c.data?.prices) c.data.prices = c.data.prices.map(p => ({ ...p, date: new Date(p.date) }));
          if (c.data?.crosses) c.data.crosses = c.data.crosses.map(cr => ({ ...cr, date: new Date(cr.date) }));
          setHist(c.data);
          return;
        }
      }
    } catch (e) {}

    (async () => {
      try {
        const [rbRes, piRes] = await Promise.all([
          fetch('https://charts.bitcoin.com/api/v1/charts/rainbow'),
          fetch('https://charts.bitcoin.com/api/v1/charts/pi-cycle-top')
        ]);

        let rawPrices = null;
        if (rbRes.ok) {
          const rb = await rbRes.json();
          if (rb.success && rb.data?.price) rawPrices = rb.data.price;
        }

        if (!rawPrices || rawPrices.length < 100) {
          const cgRes = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=max&precision=2');
          if (cgRes.ok) {
            const cg = await cgRes.json();
            if (cg.prices?.length) {
              rawPrices = cg.prices.map(([ts, price]) => ({ timestamp: ts, price }));
            }
          }
        }

        if (!rawPrices?.length) return;

        const ma111Map = new Map(), ma350x2Map = new Map();
        let apiCrosses = [];

        if (piRes?.ok) {
          const pi = await piRes.json();
          if (pi.success && pi.data) {
            (pi.data.ma111 || []).forEach(p => ma111Map.set(p.timestamp, p.value));
            (pi.data.ma350x2 || []).forEach(p => ma350x2Map.set(p.timestamp, p.value));
            apiCrosses = pi.data.crosses || [];
          }
        }

        // Helper: find closest timestamp match within 12h tolerance
        const findClosest = (map, ts) => {
          const v = map.get(ts);
          if (v != null) return v;
          // Try rounding to day boundaries
          const dayStart = ts - (ts % 86400000);
          for (const offset of [0, 86400000, -86400000]) {
            const v2 = map.get(dayStart + offset);
            if (v2 != null) return v2;
          }
          return null;
        };

        const prices = rawPrices.map(p => ({
          date: new Date(p.timestamp),
          price: p.price,
          ts: p.timestamp,
          ma111: findClosest(ma111Map, p.timestamp),
          ma350x2: findClosest(ma350x2Map, p.timestamp),
          ma200: null
        }));

        // Always fill gaps: calculate MA locally for any point still null
        if (prices.length > 350) {
          for (let i = 110; i < prices.length; i++) {
            if (prices[i].ma111 == null) {
              let s = 0;
              for (let j = i - 110; j <= i; j++) s += prices[j].price;
              prices[i].ma111 = s / 111;
            }
          }
          for (let i = 349; i < prices.length; i++) {
            if (prices[i].ma350x2 == null) {
              let s = 0;
              for (let j = i - 349; j <= i; j++) s += prices[j].price;
              prices[i].ma350x2 = (s / 350) * 2;
            }
          }
        }

        for (let i = 199; i < prices.length; i++) {
          let s = 0;
          for (let j = i - 199; j <= i; j++) s += prices[j].price;
          prices[i].ma200 = s / 200;
        }

        // Always detect crosses locally from computed MAs
        const crosses = [];
        for (let i = 1; i < prices.length; i++) {
          const prev = prices[i - 1], cur = prices[i];
          if (prev.ma111 && prev.ma350x2 && cur.ma111 && cur.ma350x2) {
            if (prev.ma111 < prev.ma350x2 && cur.ma111 >= cur.ma350x2) {
              crosses.push({ date: cur.date, price: cur.price, type: 'top' });
            }
          }
        }

        const data = { prices, crosses, fetched: Date.now() };
        setHist(data);
        try {
          localStorage.setItem(CACHEKEY, JSON.stringify({ ts: Date.now(), data }));
        } catch (e) {}
      } catch (e) {
        console.error('Historical fetch failed', e);
      }
    })();
  }, []);

  return hist;
}

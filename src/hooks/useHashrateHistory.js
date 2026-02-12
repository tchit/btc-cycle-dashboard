import { useState, useEffect } from 'react';

export function useHashrateHistory() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const CACHEKEY = 'hr_hist_v2', CACHETTL = 6 * 60 * 60 * 1000;

    try {
      const raw = localStorage.getItem(CACHEKEY);
      if (raw) {
        const c = JSON.parse(raw);
        if (Date.now() - c.ts < CACHETTL) { setData(c.data); return; }
      }
    } catch (e) {}

    (async () => {
      try {
        const res = await fetch('https://mempool.space/api/v1/mining/hashrate/3y');
        if (!res.ok) return;
        const j = await res.json();
        if (!j.hashrates?.length) return;

        const daily = j.hashrates.map(h => ({
          ts: h.timestamp * 1000,
          hr: h.avgHashrate / 1e18
        }));

        const result = [];
        for (let i = 0; i < daily.length; i++) {
          const entry = { ts: daily[i].ts, hr: daily[i].hr, sma30: null, sma60: null };
          if (i >= 29) {
            let sum = 0;
            for (let k = i - 29; k <= i; k++) sum += daily[k].hr;
            entry.sma30 = sum / 30;
          }
          if (i >= 59) {
            let sum = 0;
            for (let k = i - 59; k <= i; k++) sum += daily[k].hr;
            entry.sma60 = sum / 60;
          }
          result.push(entry);
        }

        const crosses = [];
        for (let i = 1; i < result.length; i++) {
          if (result[i].sma30 == null || result[i].sma60 == null) continue;
          if (result[i - 1].sma30 == null || result[i - 1].sma60 == null) continue;
          const prevBelow = result[i - 1].sma30 < result[i - 1].sma60;
          const nowBelow = result[i].sma30 < result[i].sma60;
          if (prevBelow !== nowBelow) {
            crosses.push({ ts: result[i].ts, type: nowBelow ? 'down' : 'up', hr: result[i].hr });
          }
        }

        const last = result[result.length - 1];
        const capitulation = last.sma30 != null && last.sma60 != null && last.sma30 < last.sma60;

        const out = { daily: result, crosses, capitulation, sma30: last.sma30, sma60: last.sma60 };
        setData(out);
        try {
          localStorage.setItem(CACHEKEY, JSON.stringify({ ts: Date.now(), data: out }));
        } catch (e) {}
      } catch (e) {
        console.error('Hashrate history fetch failed', e);
      }
    })();
  }, []);

  return data;
}

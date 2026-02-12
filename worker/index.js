/**
 * BGeometrics Proxy Worker — bitcoin-data.com
 * Rate limit: 8 requests/hour on free tier.
 * Strategy: 2 batches of 8 endpoints, rotated every hour via KV.
 * Full 16 endpoints covered in 2 hours. Merged data served on every /all.
 *
 * Cron Trigger runs every hour to keep data fresh even without visitors.
 *
 * Setup:
 *   1. Create KV namespace: npx wrangler kv namespace create BG_DATA
 *   2. Add the ID to wrangler.toml
 *   3. Deploy: npx wrangler deploy
 *   Or via dashboard: Workers > KV > create "BG_DATA", then bind in Worker settings.
 */

const BASE = 'https://bitcoin-data.com';

const BATCHES = [
  // Batch 0: Core on-chain (critical for composite scores)
  [
    'technical-indicators',  // rsi, sma200, ema200, sma50
    'mvrv',                  // mvrv ratio
    'mvrv-zscore',           // mvrv z-score
    'nupl',                  // net unrealized profit/loss
    'sopr',                  // spent output profit ratio
    'realized-price',        // realized price
    'sth-realized-price',    // short-term holder RP
    'lth-realized-price',    // long-term holder RP
  ],
  // Batch 1: Extended metrics
  [
    'asopr',                 // adjusted SOPR
    'puell-multiple',        // puell multiple
    'profit-loss',           // supply profit/loss %
    'supply-profit',         // supply in profit (BTC)
    'rhodl-ratio',           // RHODL ratio
    'etf-btc-total',         // ETF total BTC holdings
    'etf-flow-btc',          // ETF daily flow
    'open-interest-futures', // aggregated OI
  ],
];

const KV_KEY = 'bg_merged_v2';
const ROTATION_MS = 60 * 60 * 1000; // 1 hour between batches
const EDGE_CACHE_TTL = 300;          // 5 min edge cache

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

async function fetchEndpoint(ep) {
  const url = `${BASE}/v1/${ep}/last`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'BTCDash/1.0' },
    });
    if (!res.ok) return { _error: res.status };
    return await res.json();
  } catch (e) {
    return { _error: e.message };
  }
}

// Shared: read KV state, rotate batch if due, write back to KV
async function rotateIfDue(env) {
  let state;
  try {
    state = await env.BG_DATA.get(KV_KEY, 'json');
  } catch (e) {
    state = null;
  }
  if (!state) state = { lastBatch: -1, lastFetchTs: 0, data: {} };

  const now = Date.now();
  const elapsed = now - state.lastFetchTs;

  if (elapsed >= ROTATION_MS) {
    const nextBatch = (state.lastBatch + 1) % BATCHES.length;
    const endpoints = BATCHES[nextBatch];
    const errors = {};

    const responses = await Promise.all(
      endpoints.map(async (ep) => ({ ep, data: await fetchEndpoint(ep) }))
    );

    let gotSome = false;
    for (const { ep, data } of responses) {
      if (data._error) {
        errors[ep] = data._error;
      } else {
        state.data[`/v1/${ep}/last`] = data;
        gotSome = true;
      }
    }

    if (gotSome) {
      state.lastBatch = nextBatch;
      state.lastFetchTs = now;
      state.lastErrors = Object.keys(errors).length > 0 ? errors : null;
      try {
        await env.BG_DATA.put(KV_KEY, JSON.stringify(state));
      } catch (e) {}
    }
  }

  return state;
}

async function handleAll(env) {
  const state = await rotateIfDue(env);
  const now = Date.now();
  const elapsed = now - state.lastFetchTs;

  // Build response from merged data
  const result = { ...state.data };
  result._cached = elapsed < ROTATION_MS;
  result._fetchTime = state.lastFetchTs;
  result._batch = state.lastBatch;
  result._totalBatches = BATCHES.length;
  result._dataKeys = Object.keys(state.data).length;
  result._nextRotation = state.lastFetchTs
    ? new Date(state.lastFetchTs + ROTATION_MS).toISOString()
    : 'now';
  if (state.lastErrors) result._errors = state.lastErrors;

  return result;
}

async function handleDebug(env) {
  // Show KV state + test one endpoint
  let kvState = null;
  try {
    kvState = await env.BG_DATA.get(KV_KEY, 'json');
  } catch (e) {
    kvState = { error: e.message };
  }

  const testUrl = `${BASE}/v1/nupl/last`;
  let testResult;
  try {
    const r = await fetch(testUrl);
    const body = await r.text();
    testResult = { status: r.status, body: body.slice(0, 200) };
  } catch (e) {
    testResult = { error: e.message };
  }

  return {
    kvState: kvState ? {
      lastBatch: kvState.lastBatch,
      lastFetchTs: kvState.lastFetchTs,
      lastFetchDate: kvState.lastFetchTs ? new Date(kvState.lastFetchTs).toISOString() : null,
      dataKeys: Object.keys(kvState.data || {}).length,
      lastErrors: kvState.lastErrors,
    } : null,
    testEndpoint: { url: testUrl, ...testResult },
    batches: BATCHES.map((b, i) => ({ batch: i, endpoints: b })),
  };
}

export default {
  // Cron Trigger: runs every hour to keep KV data fresh
  async scheduled(event, env, ctx) {
    await rotateIfDue(env);
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (url.pathname === '/debug') {
      const data = await handleDebug(env);
      return new Response(JSON.stringify(data, null, 2), { headers: CORS });
    }

    if (url.pathname === '/all') {
      // Edge cache to avoid hammering KV on every request
      const cache = caches.default;
      const cacheKey = new Request(request.url, { method: 'GET' });

      // Skip edge cache if ?fresh=1
      if (!url.searchParams.has('fresh')) {
        const cached = await cache.match(cacheKey);
        if (cached) {
          return new Response(cached.body, { headers: CORS });
        }
      }

      const data = await handleAll(env);
      const body = JSON.stringify(data);
      const response = new Response(body, { headers: CORS });

      // Cache at edge for 5 min (only if we have actual data)
      if (data._dataKeys > 0) {
        const toCache = new Response(body, {
          headers: { ...CORS, 'Cache-Control': `s-maxage=${EDGE_CACHE_TTL}` },
        });
        await cache.put(cacheKey, toCache);
      }

      return response;
    }

    // Single endpoint proxy
    const match = url.pathname.match(/^\/v1\/(.+)\/last$/);
    if (match) {
      const data = await fetchEndpoint(match[1]);
      return new Response(JSON.stringify(data), { headers: CORS });
    }

    return new Response(JSON.stringify({
      error: 'Use /all, /debug, or /v1/{metric}/last',
      batches: BATCHES,
      rotation: '1 batch of 8 per hour, full coverage in 2h',
    }), { status: 404, headers: CORS });
  },
};

import React from 'react';
import { DS } from '../config/design';

const CONNECTORS = [
  { name: 'CoinGecko', key: 'coingecko', url: 'api.coingecko.com', description: 'Prix BTC, Market Cap, Volume 24h, Dominance', endpoints: ['/api/v3/simple/price', '/api/v3/global', '/api/v3/coins/bitcoin/market_chart'], icon: '\uD83E\uDD8E' },
  { name: 'Alternative.me', key: 'fng', url: 'api.alternative.me', description: 'Fear & Greed Index', endpoints: ['/fng/?limit=1'], icon: '\uD83D\uDE31' },
  { name: 'Binance Futures', key: 'binance', url: 'fapi.binance.com', description: 'Funding Rate, Open Interest', endpoints: ['/fapi/v1/fundingRate', '/fapi/v1/openInterest'], icon: '\uD83D\uDD36' },
  { name: 'Mempool.space', key: 'mempool', url: 'mempool.space', description: 'Hashrate, Difficult\u00e9', endpoints: ['/api/v1/mining/hashrate/1w'], icon: '\u26D3' },
  { name: 'BGeometrics', key: 'bgeometrics', url: 'bg-proxy (Cloudflare Worker)', description: 'NUPL, SOPR, MVRV Z-Score, Realized Price, Puell Multiple, RHODL, RSI, SMA/EMA, Hash Ribbons, Funding Rate, ETF Flows, Open Interest', endpoints: ['/all (proxy agr\u00e9g\u00e9)'], icon: '\uD83D\uDCD0' },
  { name: 'Bitcoin.com Charts', key: 'bitcoincom', url: 'charts.bitcoin.com', description: 'Rainbow Chart, Pi Cycle Top Indicator', endpoints: ['/api/v1/charts/rainbow', '/api/v1/charts/pi-cycle-top'], icon: '\uD83C\uDF08' }
];

export default function ConnectorsView({ live, mob }) {
  const getStatus = (key) => {
    const s = live.sources[key];
    if (s === true || s === 'live') return { label: 'En ligne', color: DS.up, bg: 'rgba(16,185,129,0.08)' };
    if (s === 'cache') return { label: 'Cache', color: DS.warn, bg: 'rgba(245,158,11,0.08)' };
    if (s === 'partial') return { label: 'Partiel', color: DS.warn, bg: 'rgba(245,158,11,0.08)' };
    if (s === false) return { label: 'Erreur', color: DS.down, bg: 'rgba(239,68,68,0.08)' };
    return { label: 'En attente', color: DS.text3, bg: 'rgba(137,147,164,0.08)' };
  };

  const getStatusBtcCom = () => ({ label: 'Historique', color: DS.blue, bg: 'rgba(59,130,246,0.08)' });

  const countOnline = CONNECTORS.filter(c => {
    const s = live.sources[c.key];
    return s === true || s === 'live' || s === 'cache';
  }).length;

  return (
    <>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">{'\uD83D\uDD0C'} Connecteurs & Sources de Donn&eacute;es</div>
          <div className="card-badge">{live.loading ? 'CHARGEMENT...' : `${countOnline}/${CONNECTORS.length} ACTIFS`}</div>
        </div>
        <div className="card-body" style={{ padding: '16px 24px' }}>
          <div style={{ fontSize: 13, color: DS.text2, lineHeight: 1.6 }}>
            Liste des API et sources externes utilis&eacute;es par le dashboard pour alimenter les indicateurs en temps r&eacute;el et historiques.
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 24 }}>
        {CONNECTORS.map(c => {
          const st = c.key === 'bitcoincom' ? getStatusBtcCom() : getStatus(c.key);
          return (
            <div key={c.key} className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{c.icon}</span>
                  <div className="card-title" style={{ margin: 0 }}>{c.name}</div>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: st.bg, fontSize: 12, fontWeight: 600, color: st.color, fontFamily: DS.mono }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: st.color, flexShrink: 0 }} />
                  {st.label}
                </div>
              </div>
              <div className="card-body" style={{ padding: '16px 24px' }}>
                <div style={{ fontSize: 13, color: DS.text2, marginBottom: 12 }}>{c.description}</div>
                <div style={{ fontSize: 11, color: DS.text3, fontFamily: DS.mono, marginBottom: 8 }}>{c.url}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {c.endpoints.map((ep, i) => (
                    <div key={i} style={{ fontSize: 11, fontFamily: DS.mono, color: DS.text3, background: DS.bg, padding: '4px 8px', borderRadius: 4 }}>{ep}</div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

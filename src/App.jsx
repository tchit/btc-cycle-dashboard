import React, { useState, useRef, useEffect } from 'react';
import { DS } from './config/design';
import { fP, isFake } from './utils/format';
import { useScreen } from './hooks/useScreen';
import { useLiveData } from './hooks/useLiveData';
import { useCalc } from './hooks/useCalc';
import { useHistoricalData } from './hooks/useHistoricalData';
import { useHashrateHistory } from './hooks/useHashrateHistory';
import FakeBadge from './components/FakeBadge';
import DashboardView from './views/DashboardView';
import OnChainView from './views/OnChainView';
import PriceView from './views/PriceView';
import RainbowView from './views/RainbowView';
import PiCycleView from './views/PiCycleView';
import MinersView from './views/MinersView';
import DerivativesView from './views/DerivativesView';
import ScenariosView from './views/ScenariosView';
import ConnectorsView from './components/ConnectorsView';
import TradingViewView from './views/TradingViewView';
import {
  IconDashboard, IconChain, IconDollar, IconRainbow, IconCycle,
  IconMiner, IconTrending, IconSparkles, IconPlug, IconMonitor
} from './components/Icons';
import ImagePlaceholder from './components/ImagePlaceholder';
import SystemStatus from './components/SystemStatus';

const ART_VISUAL = "/cycle.png";

const TABS = [
  { id: 'dashboard', l: 'Dashboard', i: <IconDashboard /> },
  { id: 'onchain', l: 'On-Chain', i: <IconChain /> },
  { id: 'price', l: 'Prix', i: <IconDollar /> },
  { id: 'rainbow', l: 'Rainbow', i: <IconRainbow /> },
  { id: 'picycle', l: 'Pi Cycle', i: <IconCycle /> },
  { id: 'miners', l: 'Miners', i: <IconMiner /> },
  { id: 'derivatives', l: 'Dérivés', i: <IconTrending /> },
  { id: 'scenarios', l: 'Scénarios', i: <IconSparkles /> },
  { id: 'connectors', l: 'Connecteurs', i: <IconPlug /> },
  { id: 'tradingview', l: 'TradingView', i: <IconMonitor /> }
];

export default function App() {
  const { w, mob, tab: isTab } = useScreen();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activeTab]);

  const live = useLiveData();
  const calc = useCalc(live);
  const hist = useHistoricalData();
  const hrHist = useHashrateHistory();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView live={live} calc={calc} hist={hist} mob={mob} />;
      case 'onchain': return <OnChainView live={live} calc={calc} mob={mob} />;
      case 'price': return <PriceView live={live} calc={calc} hist={hist} mob={mob} />;
      case 'rainbow': return <RainbowView live={live} calc={calc} hist={hist} mob={mob} />;
      case 'picycle': return <PiCycleView live={live} calc={calc} hist={hist} mob={mob} />;
      case 'miners': return <MinersView live={live} calc={calc} mob={mob} hrHist={hrHist} />;
      case 'derivatives': return <DerivativesView live={live} calc={calc} mob={mob} />;
      case 'scenarios': return <ScenariosView live={live} calc={calc} mob={mob} />;
      case 'connectors': return <ConnectorsView live={live} mob={mob} />;
      case 'tradingview': return <TradingViewView />;
      default: return <DashboardView live={live} calc={calc} hist={hist} mob={mob} />;
    }
  };

  return (
    <div className="app-layout">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" />
          <div className="sidebar-logo-text"><span className="sidebar-logo-accent">BTC</span> CYCLE</div>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">ANALYSE</div>
            {TABS.slice(0, 5).map(t => (
              <div key={t.id} className={`sidebar-item ${activeTab === t.id ? 'active' : ''}`} onClick={() => { setActiveTab(t.id); setMenuOpen(false); }}>
                <span className="sidebar-item-icon">{t.i}</span>
                {t.l}
              </div>
            ))}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-title">INDICATEURS</div>
            {TABS.slice(5).map(t => (
              <div key={t.id} className={`sidebar-item ${activeTab === t.id ? 'active' : ''}`} onClick={() => { setActiveTab(t.id); setMenuOpen(false); }}>
                <span className="sidebar-item-icon">{t.i}</span>
                {t.l}
              </div>
            ))}
          </div>
        </nav>
        <div className="brand-slot">
          {/* Sidebar visual — Replace with Bitcoin/crypto art illustration */}
          <ImagePlaceholder
            variant="sidebar"
            label="MIKE BRANT"
            src={ART_VISUAL}
            overlay="bottom"
            style={{ height: 160, clipPath: 'var(--clip-card-sm)' }}
          />
        </div>
        <div className="sidebar-footer">
          <div className="sidebar-status">
            <div className="sidebar-status-dot" />
            {live.live ? 'Système en ligne' : 'Connexion...'}
          </div>
        </div>
      </aside>
      <div className={`sidebar-overlay ${menuOpen ? 'visible' : ''}`} onClick={() => setMenuOpen(false)} />
      <main className="main-content">
        <header className="header" style={{ position: 'relative' }}>
          {live.loading && <div className="loading-bar-top"><div /></div>}
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setMenuOpen(true)}>☰</button>
            <div className="header-subtitle" style={{ fontFamily: DS.mono, fontSize: 13 }}>
              {live.loading ? 'Chargement des données...' : live.lastUpdate ? `MAJ: ${live.lastUpdate.toLocaleTimeString()}` : 'Initialisation...'}
            </div>
          </div>
          <div className="header-right">
            {live.loading
              ? <div style={{ fontSize: 15, color: DS.text3, fontStyle: 'italic' }}>Loading...</div>
              : <>
                  {!mob && (() => {
                    const fg = live.fearGreed;
                    const extreme = fg < 20 || fg > 80;
                    const c = fg < 20 ? '#EF4444' : fg > 80 ? '#22C55E' : DS.warn;
                    return (
                      <div className="header-badge" style={{
                        background: extreme ? (fg < 20 ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)') : undefined,
                        border: extreme ? `2px solid ${c}` : undefined,
                        color: extreme ? c : undefined,
                        fontWeight: extreme ? 800 : undefined,
                        fontSize: extreme ? 15 : undefined,
                        padding: extreme ? '6px 16px' : undefined,
                        boxShadow: extreme ? `0 0 20px ${fg < 20 ? 'rgba(239,68,68,0.35)' : 'rgba(34,197,94,0.35)'}, 0 0 6px ${fg < 20 ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}` : undefined,
                        animation: extreme ? 'pulse-glow 1.5s ease-in-out infinite' : undefined,
                        textShadow: extreme ? `0 0 10px ${fg < 20 ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}` : undefined
                      }}>
                        <div className="header-badge-dot" style={{
                          background: c,
                          width: extreme ? 10 : 8,
                          height: extreme ? 10 : 8,
                          boxShadow: extreme ? `0 0 10px ${c}, 0 0 4px ${c}` : 'none'
                        }} />
                        {extreme ? `${fg} — ${live.fgLabel}` : `F&G: ${fg}`}
                        {isFake(live.fakes, 'fearGreed') && <FakeBadge />}
                      </div>
                    );
                  })()}
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: DS.mono }}>
                    {`$${fP(live.price)}`}
                    {isFake(live.fakes, 'price') && <FakeBadge />}
                  </div>
                </>
            }
          </div>
        </header>
        <div className="content" ref={contentRef}>{renderContent()}</div>
      </main>
      <SystemStatus />
    </div>
  );
}

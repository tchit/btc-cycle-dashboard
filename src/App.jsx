import React, { useState } from 'react';
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

const TABS = [
  { id: 'dashboard', l: 'Dashboard', i: '📊' },
  { id: 'onchain', l: 'On-Chain', i: '🔗' },
  { id: 'price', l: 'Prix', i: '💰' },
  { id: 'rainbow', l: 'Rainbow', i: '🌈' },
  { id: 'picycle', l: 'Pi Cycle', i: '🔄' },
  { id: 'miners', l: 'Miners', i: '⛏' },
  { id: 'derivatives', l: 'Dérivés', i: '📈' },
  { id: 'scenarios', l: 'Scénarios', i: '🔮' },
  { id: 'connectors', l: 'Connecteurs', i: '🔌' },
  { id: 'tradingview', l: 'TradingView', i: '📺' }
];

export default function App() {
  const { w, mob, tab: isTab } = useScreen();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

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
          <div className="sidebar-logo-icon">₿</div>
          <div className="sidebar-logo-text">CYCLE PRO</div>
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
            <div>
              <div className="header-title">Bitcoin Cycle Dashboard</div>
              <div className="header-subtitle">
                {live.loading ? 'Chargement des données...' : live.lastUpdate ? `MAJ: ${live.lastUpdate.toLocaleTimeString()}` : 'Initialisation...'}
              </div>
            </div>
          </div>
          <div className="header-right">
            {live.loading
              ? <div style={{ fontSize: 12, color: DS.text3, fontStyle: 'italic' }}>Loading...</div>
              : <>
                  {!mob && (
                    <div className="header-badge">
                      <div className="header-badge-dot" style={{ background: live.fearGreed < 20 ? DS.up : live.fearGreed > 80 ? DS.down : DS.warn }} />
                      {`F&G: ${live.fearGreed}`}
                      {isFake(live.fakes, 'fearGreed') && <FakeBadge />}
                    </div>
                  )}
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: DS.mono }}>
                    {`$${fP(live.price)}`}
                    {isFake(live.fakes, 'price') && <FakeBadge />}
                  </div>
                </>
            }
          </div>
        </header>
        <div className="content">{renderContent()}</div>
      </main>
    </div>
  );
}

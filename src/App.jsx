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

// Import Icons
import { 
  LayoutGrid, Link2, DollarSign, Rainbow, RefreshCw, 
  Pickaxe, TrendingUp, Zap, Cable, Menu, Activity 
} from './components/Icons';

const TABS = [
  { id: 'dashboard', l: 'Overview', Icon: LayoutGrid },
  { id: 'onchain', l: 'On-Chain', Icon: Link2 },
  { id: 'price', l: 'Price Action', Icon: DollarSign },
  { id: 'rainbow', l: 'Rainbow Chart', Icon: Rainbow },
  { id: 'picycle', l: 'Pi Cycle', Icon: RefreshCw },
  { id: 'miners', l: 'Miners', Icon: Pickaxe },
  { id: 'derivatives', l: 'Derivatives', Icon: TrendingUp },
  { id: 'scenarios', l: 'Projections', Icon: Zap },
  { id: 'connectors', l: 'API Status', Icon: Cable }
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
      default: return <DashboardView live={live} calc={calc} hist={hist} mob={mob} />;
    }
  };

  return (
    <div className="app-layout">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
             <Activity size={20} />
          </div>
          <div className="sidebar-logo-text">CYCLE PRO</div>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">ANALYTICS</div>
            {TABS.slice(0, 5).map(t => (
              <div key={t.id} className={`sidebar-item ${activeTab === t.id ? 'active' : ''}`} onClick={() => { setActiveTab(t.id); setMenuOpen(false); }}>
                <span className="sidebar-item-icon"><t.Icon size={18} /></span>
                {t.l}
              </div>
            ))}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-title">INDICATORS</div>
            {TABS.slice(5).map(t => (
              <div key={t.id} className={`sidebar-item ${activeTab === t.id ? 'active' : ''}`} onClick={() => { setActiveTab(t.id); setMenuOpen(false); }}>
                <span className="sidebar-item-icon"><t.Icon size={18} /></span>
                {t.l}
              </div>
            ))}
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-status">
            <div className={`sidebar-status-dot ${live.live ? 'bg-emerald-500' : 'bg-red-500'}`} style={{background: live.live ? 'var(--up)' : 'var(--down)'}} />
            {live.live ? 'System Operational' : 'Connecting...'}
          </div>
        </div>
      </aside>
      <div className={`sidebar-overlay ${menuOpen ? 'visible' : ''}`} onClick={() => setMenuOpen(false)} />
      <main className=\"main-content\">
        <header className=\"header\">
          {live.loading && <div className=\"loading-bar-top\"><div /></div>}
          <div className=\"header-left\">
            <button className=\"menu-toggle\" onClick={() => setMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div>
              <div className=\"header-title\">Bitcoin Cycle Dashboard</div>
              <div className=\"header-subtitle\">
                {live.loading ? 'Syncing...' : live.lastUpdate ? `Last Sync: ${live.lastUpdate.toLocaleTimeString()}` : 'Initializing...'}
              </div>
            </div>
          </div>
          <div className=\"header-right\">
            {live.loading
              ? <div style={{ fontSize: 12, color: DS.text3, fontStyle: 'italic' }}>Loading...</div>
              : <>\n                  {!mob && (
                    <div className=\"header-badge\">
                      <div className=\"header-badge-dot\" style={{ background: live.fearGreed < 20 ? DS.up : live.fearGreed > 80 ? DS.down : DS.warn }} />
                      {`F&G: ${live.fearGreed}`}
                      {isFake(live.fakes, 'fearGreed') && <FakeBadge />}
                    </div>
                  )}
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {`$${fP(live.price)}`}
                    {isFake(live.fakes, 'price') && <FakeBadge />}
                  </div>
                </>\n            }
          </div>
        </header>
        <div className=\"content\">{renderContent()}</div>
      </main>
    </div>
  );
}

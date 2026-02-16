import React from 'react';
import DataTable from '../components/DataTable';
import {
  getCycleKeyDates,
  getCycleDuration,
  ONCHAIN_AT_BOTTOM,
  getMvrvAtBottom,
  BEAR_DRAWDOWNS,
  POST_HALVING,
  FIB_EXTENSIONS,
} from '../data/cycle-constants';
import { RP } from '../config/constants';

export default function RawDataView({ live }) {
  const keyDates = getCycleKeyDates(live?.price);
  const duration = getCycleDuration();
  const mvrv = getMvrvAtBottom(live?.price, RP);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.02em' }}>
          Données brutes
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          Données historiques des cycles et position actuelle du marché.
        </div>
      </div>

      <DataTable
        title="Dates clés des cycles"
        columns={keyDates.columns}
        rows={keyDates.rows}
      />

      <DataTable
        title="Durée des cycles (jours)"
        columns={duration.columns}
        rows={duration.rows}
      />

      <DataTable
        title="Valeurs on-chain à chaque bottom de cycle"
        columns={ONCHAIN_AT_BOTTOM.columns}
        rows={ONCHAIN_AT_BOTTOM.rows}
        highlightCol={ONCHAIN_AT_BOTTOM.highlightCol}
      />

      <DataTable
        title="MVRV au bottom"
        columns={mvrv.columns}
        rows={mvrv.rows}
      />

      <DataTable
        title="Drawdown & durée des bear markets (ATH → Bottom)"
        columns={BEAR_DRAWDOWNS.columns}
        rows={BEAR_DRAWDOWNS.rows}
        averageRow={BEAR_DRAWDOWNS.averageRow}
      />

      <DataTable
        title="Performance post-halving"
        columns={POST_HALVING.columns}
        rows={POST_HALVING.rows}
      />

      <DataTable
        title="Extension Fibonacci haussière (ATH → Bottom → ATH suivant)"
        columns={FIB_EXTENSIONS.columns}
        rows={FIB_EXTENSIONS.rows}
        note={FIB_EXTENSIONS.note}
      />
    </div>
  );
}

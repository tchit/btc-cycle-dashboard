import React from 'react';
import DataTable from '../components/DataTable';
import {
  CYCLE_KEY_DATES,
  CYCLE_DURATION,
  ONCHAIN_AT_BOTTOM,
  MVRV_AT_BOTTOM,
  BEAR_DRAWDOWNS,
  POST_HALVING,
  FIB_EXTENSIONS,
} from '../data/cycle-constants';

export default function RawDataView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.02em' }}>
          Raw Datapoints
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          Historical cycle data and current market position.
        </div>
      </div>

      <DataTable
        title="Cycle Key Dates"
        columns={CYCLE_KEY_DATES.columns}
        rows={CYCLE_KEY_DATES.rows}
      />

      <DataTable
        title="Cycle Duration (Days)"
        columns={CYCLE_DURATION.columns}
        rows={CYCLE_DURATION.rows}
      />

      <DataTable
        title="On-Chain Metric Values at Each Cycle Bottom"
        columns={ONCHAIN_AT_BOTTOM.columns}
        rows={ONCHAIN_AT_BOTTOM.rows}
        highlightCol={ONCHAIN_AT_BOTTOM.highlightCol}
      />

      <DataTable
        title="MVRV at Bottom"
        columns={MVRV_AT_BOTTOM.columns}
        rows={MVRV_AT_BOTTOM.rows}
      />

      <DataTable
        title="Bear Market Drawdown & Duration (ATH to Bottom)"
        columns={BEAR_DRAWDOWNS.columns}
        rows={BEAR_DRAWDOWNS.rows}
        averageRow={BEAR_DRAWDOWNS.averageRow}
      />

      <DataTable
        title="Post-Halving Performance"
        columns={POST_HALVING.columns}
        rows={POST_HALVING.rows}
      />

      <DataTable
        title="Fibonacci Bull Extension (ATH \u2192 Bottom \u2192 Next ATH)"
        columns={FIB_EXTENSIONS.columns}
        rows={FIB_EXTENSIONS.rows}
        note={FIB_EXTENSIONS.note}
      />
    </div>
  );
}

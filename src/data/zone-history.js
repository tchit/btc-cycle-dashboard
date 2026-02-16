// Zone Duration Analysis — how long price stays at each depth level across bear market cycles
// 5 zones from shallowest (Zone 1) to deepest (Zone 5)

export const ZONE_1 = {
  title: 'Zone 1: Below 111d MA, Above 2-Year MA',
  subtitle: 'Bear Confirmed',
  columns: ['Cycle', 'Dropped Below 111d MA', 'Dropped Below 2Y MA', 'Duration in Zone', 'Exit Type', 'Entry / Exit Gap'],
  rows: [
    { cycle: '2014-15', col1: '~Feb 2014', col2: '~Dec 2014', duration: '~10 months', exitType: 'Downward', gap: '...' },
    { cycle: '2018', col1: '~Feb 2018', col2: '~Nov 2018', duration: '~9 months (slow bleed at $6-8K)', exitType: 'Downward', gap: '74.3% / 14.2%' },
    { cycle: '2022', col1: '~Dec 2021', col2: '~May 2022', duration: '~5 months', exitType: 'Downward', gap: '48.5% / 13.8%' },
    { cycle: '2025-26', col1: '~mid-Oct 2025', col2: '~late Jan 2026', duration: '4 months', exitType: 'Downward', gap: '32.6% / 10.3%', isCurrent: true },
  ],
  trend: 'Variable \u2014 depends on crash speed',
};

export const ZONE_2 = {
  title: 'Zone 2: Below 2-Year MA, Above 200-Week MA',
  subtitle: 'Bottom Zone Entry',
  columns: ['Cycle', 'Dropped Below 2Y MA', 'Dropped Below 200W MA', 'Duration in Zone', 'Exit Type', 'Entry / Exit Gap'],
  rows: [
    { cycle: '2014-15', col1: '~Dec 2014', col2: '~Aug 2015 (200W first avail.)', duration: '~8 months', exitType: 'Downward', gap: '...' },
    { cycle: '2018', col1: '~Nov 2018', col2: 'Never (within ~1%)', duration: '~6 months (Nov 2018 \u2192 May 2019)', exitType: 'Upward', gap: '44.4% / 43.3%' },
    { cycle: '2022', col1: '~May 2022', col2: '~Jun 2022', duration: '~1 month', exitType: 'Downward', gap: '38.1% / 38.2%' },
    { cycle: '2025-26', col1: '~late Jan 2026', col2: 'Not yet reached', duration: 'In progress (17 days)', exitType: 'In zone', gap: '32.5% / \u2014', isCurrent: true },
  ],
  trend: 'Fast crash in later cycles',
};

export const ZONE_3 = {
  title: 'Zone 3: 200-Week MA <\u2194> Realized Price',
  subtitle: 'Between the two historic floor metrics',
  columns: ['Cycle', 'Behavior', 'Duration in Zone', 'Exit Type', 'Entry / Exit Gap'],
  rows: [
    {
      cycle: '2015',
      behavior: 'RP (~$260) above 200W MA (~$185). Price crossed below RP first, then below 200W MA ~3 months later.',
      duration: '~3 months (Oct 2014 \u2192 Jan 2015)',
      exitType: 'Downward',
      gap: '...',
    },
    {
      cycle: '2018',
      behavior: 'RP (~$4,000) above 200W MA (~$3,100). Price crossed below RP but never sustained below 200W MA (bottom $3,122 within ~1% of 200W).',
      duration: '~4.5 months (Nov 2018 \u2192 Apr 2019)',
      exitType: 'Upward',
      gap: '-55.9% / -55.5%',
    },
    {
      cycle: '2022',
      behavior: '200W MA (~$23K) above RP (~$20.6K). Broke below both within days (Jun 2022).',
      duration: '~1 day (crossed both Jun 14-15)',
      exitType: 'Downward',
      gap: '-2.8% / -3.3%',
    },
    {
      cycle: '2025-26',
      behavior: '200W MA ($58,180) above RP ($51,414). Price $68,432 above both \u2014 Zone 3 not yet entered.',
      duration: 'Not yet entered',
      exitType: 'Not yet entered',
      gap: 'Not yet entered',
      isCurrent: true,
    },
  ],
  trend: 'Price always crossed below RP at some point. 200W MA is above RP since the last cycle.',
  notes: [
    'In 2015 and 2018, RP was above 200W MA \u2014 price crossed below RP first.',
    'In 2022, 200W MA was above RP \u2014 price crossed below 200W MA first.',
    'Currently: 200W MA ($58,180) is moderately above RP ($51,414) \u2014 12% gap.',
  ],
};

export const ZONE_4 = {
  title: 'Zone 4: Realized Price <\u2194> CVDD <\u2194> Balanced Price',
  subtitle: 'Extreme Undervaluation',
  columns: ['Cycle', 'Behavior', 'Duration in Zone', 'Exit Type', 'Entry / Exit Gap'],
  rows: [
    {
      cycle: '2015',
      behavior: 'RP (~$260) > BP (~$237) > CVDD (~$70). MVRV ~0.55-0.60. Price $152 below RP and BP but well above CVDD (2.2\u00d7 CVDD).',
      duration: '~12 months (Oct 2014 \u2192 Oct 2015)',
      exitType: 'Upward',
      gap: '...',
    },
    {
      cycle: '2018',
      behavior: 'RP (~$4,000) > BP (~$3,519) > CVDD (~$2,200). MVRV ~0.75-0.80. Price $3,122 below RP and BP but above CVDD (1.4\u00d7 CVDD).',
      duration: '~5 months (Nov 2018 \u2192 Apr 2019)',
      exitType: 'Upward',
      gap: '42.9% / 30.9%',
    },
    {
      cycle: '2022',
      behavior: 'RP (~$20.6K) > BP (~$15,971) \u2248 CVDD (~$15,400). MVRV 0.75. Price $15,476 near both BP and CVDD (1.0\u00d7 CVDD).',
      duration: '~5 months (Jun \u2192 Nov 2022)',
      exitType: 'Upward',
      gap: '37.1% / 33.3%',
    },
    {
      cycle: '2025-26',
      behavior: 'RP ($51,414) > CVDD ($44,526) > BP ($37,990). Price $68,432 above RP \u2014 Zone 4 not yet entered. MVRV: 1.28',
      duration: 'Not yet entered',
      exitType: 'Not entered',
      gap: 'Not yet entered',
      isCurrent: true,
    },
  ],
  trend: 'RP > BP > CVDD in all prior cycles. Price always below RP \u2014 floor was CVDD since BP was above it. Price approached CVDD closer each cycle (2.2\u00d7 \u2192 1.4\u00d7 \u2192 1.0\u00d7). Now that CVDD > BP, BP may be the ultimate floor.',
};

export const ZONE_5 = {
  title: 'Zone 5: CVDD <\u2194> Balanced Price',
  subtitle: 'Capitulation Bottom',
  columns: ['Cycle', 'Behavior', 'Duration in Zone', 'Exit Type', 'Entry / Exit Gap'],
  rows: [
    {
      cycle: '2015',
      behavior: 'BP (~$237) above CVDD (~$70). Price $224 dipped below BP (0.95\u00d7) but stayed well above CVDD (3.2\u00d7).',
      duration: 'Brief wick',
      exitType: 'Upward',
      gap: '...',
    },
    {
      cycle: '2018',
      behavior: 'BP (~$3,519) above CVDD (~$2,200). Price $3,195 dipped below BP (0.91\u00d7) but stayed above CVDD (1.45\u00d7).',
      duration: '~2-3 weeks',
      exitType: 'Upward',
      gap: '-37.6% / -37.3%',
    },
    {
      cycle: '2022',
      behavior: 'BP (~$15,971) near CVDD (~$15,400). Price $15,758 dipped below BP (0.99\u00d7), barely above CVDD (1.02\u00d7).',
      duration: 'Brief wick (FTX crash)',
      exitType: 'Upward',
      gap: '-8.7% / -8.3%',
    },
    {
      cycle: '2025-26',
      behavior: 'CVDD ($44,526) above BP ($37,990). Price $68,432 above both \u2014 Zone 5 not yet entered.',
      duration: 'Not yet entered',
      exitType: 'Not entered',
      gap: 'Not yet entered',
      isCurrent: true,
    },
  ],
  trend: 'BP was above CVDD in all prior cycles. Price dipped below BP but stayed above CVDD. In 2025-26, CVDD > BP for the first time \u2014 BP is the ultimate floor.',
  notes: [
    'In all prior cycles, BP was above CVDD. Price touched/dipped below BP but never sustained below CVDD.',
    'In 2025-26, CVDD has risen above BP for the first time \u2014 BP is the true lower floor.',
    'BP is remarkably precise as a bottom indicator. Price/BP ratio at bottom: 0.95 \u2192 0.91 \u2192 0.99.',
  ],
};

export const ALL_ZONES = [ZONE_1, ZONE_2, ZONE_3, ZONE_4, ZONE_5];

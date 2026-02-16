// Cycle 4 bottom and Cycle 5 ATH projections
// Static analytical data — only ProjectionsView uses live price for comparison

export const BOTTOM_PROJECTION = {
  title: 'Cycle 4 Bottom Projection',
  consensusLabel: 'WEIGHTED CONSENSUS',
  consensus: 'Oct 2026 \u2013 Nov 2026 \u00b7 $40K \u2013 $52K',
  consensusDetail: 'Drawdown: -72% to -64% from ATH',
  dateMethods: [
    { name: 'ATH-to-Bottom days', desc: 'Avg 383d (range 363\u2013410) from ATH', value: 'Oct 2026 \u2013 Nov 2026' },
    { name: 'Halving-to-Bottom days', desc: 'Trend: 777\u2192889\u2192924, recency-weighted ~888d', value: '~Sep 2026' },
    { name: 'Pre-halving anchor', desc: 'Bottoms occur 12\u201318mo before next halving (~Feb 2028)', value: 'Aug 2026 \u2013 Feb 2027' },
  ],
  priceMethods: [
    { name: 'Diminishing drawdown', desc: 'Trend: -87%\u2192-84%\u2192-78%, project -72% to -64% from $126,198 ATH', value: '$35K \u2013 $45K' },
    { name: 'MVRV floor \u00d7 projected RP', desc: 'MVRV at bottom: 0.75 (2018/2022 precedent). RP \u2192 ~$67K by Oct 2026', value: '~$50K' },
    { name: '200W MA floor', desc: '200W MA rises ~$1.5K/month \u2192 ~$64K by Oct 2026. Price historically touches/penetrates', value: '$64K (shallow)' },
    { name: 'RP penetration', desc: 'Price typically 20\u201325% below RP at bottom. RP ~$67K \u2192 75\u201380% of RP', value: '$50K \u2013 $53K' },
  ],
};

export const ATH_PROJECTION = {
  title: 'Cycle 5 ATH Projection',
  consensusLabel: 'CONSENSUS',
  consensus: 'Jul 2029 \u00b7 $150K \u2013 $200K',
  consensusDetail: '',
  dateMethods: [
    { name: 'Next halving + bull run', desc: '~Feb 2028 + recency-weighted 520d', value: '~Jul 2029' },
    { name: 'Bottom + recovery', desc: '~Oct 2026 + avg 1064d bottom-to-ATH', value: '~Sep 2029' },
  ],
  priceMethods: [
    { name: 'Diminishing ATH multipliers', desc: '17\u00d7\u21923.5\u00d7\u21921.83\u00d7 (ATH-to-ATH). Next: ~1.4\u00d7', value: '~$177K' },
    { name: 'Log-linear gain regression', desc: '+27% from halving price. If BTC ~$100K at halving \u2192 +27%', value: '~$127K' },
    { name: 'Power law on ATH prices', desc: 'ln(ATH) vs cycle: $1,163\u2192$19,783\u2192$69,000\u2192$126,198', value: '$150K \u2013 $200K' },
    { name: 'Fib bull extension', desc: 'ATH $126K \u2192 bottom ~$45K. 1.618 / 2.0 levels', value: '$176K \u2013 $207K' },
  ],
};

export const PROJ_SCENARIOS = [
  {
    id: 'shallow',
    label: 'Shallow',
    color: '#CCFF00',
    depth: 'Touches 200W MA, holds above RP/CVDD',
    bottom: '~$52,000-65,000',
    drawdown: '-59% to -48%',
    assessment: 'Moderate \u2014 ETF structural demand may cushion',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    color: '#D4A843',
    depth: 'Enters RP/CVDD convergence zone',
    bottom: '~$45,000-52,000',
    drawdown: '-64% to -59%',
    assessment: 'Follows diminishing drawdown trend',
  },
  {
    id: 'deep',
    label: 'Deep (historical norm)',
    color: '#FF8C00',
    depth: 'Reaches Balanced Price (~$36-40K)',
    bottom: '~$36,000-45,000',
    drawdown: '-71% to -64%',
    assessment: 'Consistent with all 3 prior cycle bottoms',
  },
  {
    id: 'extreme',
    label: 'Extreme (unprecedented)',
    color: '#FF003C',
    depth: 'Breaks significantly below BP',
    bottom: '~$25,000-36,000',
    drawdown: '-80% to -71%',
    assessment: 'Would break BP bottom-marking pattern',
  },
];

export const TIMELINE = [
  { date: 'Oct 6, 2025', event: 'ATH $126,198', detail: '', status: 'confirmed', color: '#22C55E' },
  { date: 'Nov 2025', event: 'Price drops below 111d MA (bear structure begins)', detail: '', status: 'confirmed', color: '#22C55E' },
  { date: 'Feb 2026', event: 'Price nears 2Y MA (~$75K), flash crash to $60K', detail: '', status: 'confirmed', color: '#22C55E' },
  { date: 'Q2 2026', event: '200W MA test (~$62-65K)', detail: 'Brief touch? Extended stay? Depends on catalyst', status: 'current', color: '#FFB800' },
  { date: 'Q3 2026', event: 'Potential breach of RP/CVDD convergence zone (~$50-55K)', detail: 'MVRV < 1 = aggregate network at loss', status: 'future', color: '#7A7F8E' },
  { date: 'Sep-Nov 2026', event: 'PROJECTED BOTTOM ZONE', detail: 'Central estimate: ~$45,000-52,000 (moderate scenario)', status: 'future', color: '#7A7F8E' },
  { date: '2027-2028', event: 'Recovery phase \u2192 next cycle ATH', detail: 'Next halving: ~Mar-Apr 2028', status: 'future', color: '#7A7F8E' },
];

export const DIFFERENTIATORS = {
  reduce: {
    title: 'Factors that may REDUCE severity',
    color: '#22C55E',
    items: [
      'Spot BTC ETFs provide persistent institutional demand floor',
      'Corporate treasury adoption (MicroStrategy model) creates buy-the-dip dynamics',
      'Sovereign adoption trends reduce extreme panic selling',
      'RP/CVDD convergence zone creates reinforced support band',
    ],
  },
  increase: {
    title: 'Factors that may INCREASE severity',
    color: '#FF003C',
    items: [
      'ETF outflows during panic could accelerate selling',
      'Leverage in system via ETF-based lending could cascade',
      'Macro environment \u2014 interest rates, recession risks',
      'Flash crash speed shows market fragility',
    ],
  },
};

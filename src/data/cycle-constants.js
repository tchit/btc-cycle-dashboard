// Données historiques des cycles Bitcoin
// Tables statiques (constantes) + fonctions dynamiques pour les valeurs temps-réel

const ATH_PRICE = 126198;
const ATH_DATE = '2025-10-06';
const HALVING_DATE = '2024-04-19';

function daysSince(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

// --- Tables dynamiques (acceptent des données live) ---

export function getCycleKeyDates(price) {
  const dd = price ? ((price / ATH_PRICE - 1) * 100) : null;
  const ddStr = dd !== null
    ? `${dd > 0 ? '+' : ''}${dd.toFixed(1)}% actuel / -59% à -64% proj.`
    : '-45.8% snapshot / -59% à -64% proj.';
  return {
    columns: ['Événement', 'Cycle 4 (Actuel)', 'Cycle 3', 'Cycle 2', 'Cycle 1'],
    rows: [
      { event: 'Halving', c4: '19 avr. 2024', c3: '11 mai 2020', c2: '9 juil. 2016', c1: '28 nov. 2012' },
      { event: 'Date ATH', c4: '6 oct. 2025', c3: '10 nov. 2021', c2: '17 déc. 2017', c1: '30 nov. 2013' },
      { event: 'Prix ATH', c4: '$126,198', c3: '$69,000', c2: '$19,783', c1: '$1,163' },
      { event: 'Date bottom', c4: '~Oct 2026 (est.)', c3: '21 nov. 2022', c2: '15 déc. 2018', c1: '14 jan. 2015' },
      { event: 'Prix bottom', c4: '~$45K-$52K (est.)', c3: '$15,476', c2: '$3,122', c1: '$152' },
      { event: 'Drawdown', c4: ddStr, c3: '-78%', c2: '-84%', c1: '-87%' },
    ],
  };
}

export function getCycleDuration() {
  const daysFromATH = daysSince(ATH_DATE);
  const daysFromHalving = daysSince(HALVING_DATE);
  return {
    columns: ['Métrique', 'Cycle 4 (Actuel)', 'Cycle 3', 'Cycle 2', 'Cycle 1', 'Moyenne'],
    rows: [
      { metric: 'Halving → ATH', c4: '535', c3: '548', c2: '526', c1: '367', avg: '494' },
      { metric: 'ATH → Bottom', c4: `(${daysFromATH}j depuis l'ATH)`, c3: '376', c2: '363', c1: '410', avg: '383' },
      { metric: 'Halving → Bottom', c4: `(${daysFromHalving}j depuis le halving)`, c3: '924', c2: '889', c1: '777', avg: '863' },
      { metric: 'Bottom → Halving suivant', c4: 'À déterminer', c3: '514', c2: '512', c1: 'N/A', avg: '513' },
    ],
  };
}

export function getMvrvAtBottom(price, rp) {
  const rpVal = rp || 51414;
  const currentMvrv = price ? (price / rpVal).toFixed(2) : '1.28';
  const priceStr = price ? `$${Math.round(price).toLocaleString('en-US')}` : '$68,433';
  const rpStr = `$${Math.round(rpVal).toLocaleString('en-US')}`;
  return {
    columns: ['Cycle', 'MVRV au bottom', 'Implication'],
    rows: [
      { cycle: 'Actuel', mvrv: `${currentMvrv} (prix ${priceStr} / RP ${rpStr})`, implication: 'Toujours au-dessus du Realized Price', isCurrent: true },
      { cycle: '2022', mvrv: '0.75', implication: 'Prix 25% sous le Realized Price' },
      { cycle: '2018', mvrv: '~0.75-0.80', implication: 'Prix ~20-25% sous le Realized Price' },
      { cycle: '2015', mvrv: '~0.55-0.60', implication: 'Prix ~40-45% sous le Realized Price' },
    ],
  };
}

// --- Tables statiques (constantes) ---

export const ONCHAIN_AT_BOTTOM = {
  columns: ['Métrique', 'Actuel', 'Bottom 2022 ($15,476)', 'Bottom 2018 ($3,122)', 'Bottom 2015 ($152)'],
  highlightCol: 'Actuel',
  rows: [
    { metric: '111d MA', current: '$90,012', b2022: '~$20,500', b2018: '~$5,900', b2015: '~$340' },
    { metric: '2-Year MA (730d)', current: '$86,315', b2022: '~$38,000', b2018: '~$5,200', b2015: '~$365' },
    { metric: '200-Week MA (1400d)', current: '$58,180', b2022: '~$23,000', b2018: '~$3,100', b2015: '~$185' },
    { metric: 'Realized Price', current: '$51,414', b2022: '~$20,600', b2018: '~$4,000', b2015: '~$260' },
    { metric: 'CVDD', current: '$44,526', b2022: '~$15,400', b2018: '~$2,200', b2015: '~$60-80' },
    { metric: 'Balanced Price', current: '$37,990', b2022: '~$15,971', b2018: '~$3,519', b2015: '~$237' },
  ],
};

export const BEAR_DRAWDOWNS = {
  columns: ['Cycle', 'Durée', 'Drawdown', 'Moyenne'],
  rows: [
    { cycle: '2021→2022', duration: '376 jours', drawdown: '-78%' },
    { cycle: '2017→2018', duration: '363 jours', drawdown: '-84%' },
    { cycle: '2013→2015', duration: '410 jours', drawdown: '-87%' },
    { cycle: '2011 (pas de réf. halving)', duration: '—', drawdown: '-93%' },
  ],
  averageRow: { cycle: 'Moyenne / Tendance', duration: '~383 jours', drawdown: 'Diminution ~3-5%/cycle', average: '383j / -81%' },
};

export const POST_HALVING = {
  columns: ['Cycle', 'Durée du bull run', 'Gain peak depuis le halving'],
  rows: [
    { cycle: '~2028 Halving (est.)', length: '~17 mois vers ATH (est. ~juil. 2029)', gain: '+27% (régression log-linéaire)', isCurrent: true },
    { cycle: '2024 Halving', length: '~18 mois vers ATH', gain: '+99% (rendements décroissants)' },
    { cycle: '2020 Halving', length: '~18 mois vers ATH', gain: '+690%' },
    { cycle: '2016 Halving', length: '~17 mois vers ATH', gain: '+2,910%' },
    { cycle: '2012 Halving', length: '~12 mois vers ATH', gain: '+9,100%' },
  ],
};

export const FIB_EXTENSIONS = {
  columns: ['Cycle', 'ATH (Swing High)', 'Bottom (Swing Low)', 'Range', 'ATH cycle suivant', 'Niveau Fib atteint', 'Fib standard le + proche'],
  note: "Niveau d'extension Fib = (ATH suivant − Bottom) / (ATH précédent − Bottom). Rendements décroissants : 19.4× → 3.95× → 2.07× → projeté ~1.6-2.0×",
  rows: [
    { cycle: 'Cycle 4 (2025)', ath: '$126,198', bottom: '~$45K (est.)', range: '~$81K', nextATH: '$176K-$207K (est.)', fib: '1.618-2.0 (proj.)', nearestFib: '1.618 / 2.0', isCurrent: true },
    { cycle: 'Cycle 3 (2021)', ath: '$69,000', bottom: '$15,476', range: '$53,524', nextATH: '$126,198 (Cycle 4)', fib: '2.87×', nearestFib: '~ 2.0' },
    { cycle: 'Cycle 2 (2017)', ath: '$19,783', bottom: '$3,122', range: '$16,661', nextATH: '$69,000 (Cycle 3)', fib: '3.95×', nearestFib: '~ 3.618-4.236' },
    { cycle: 'Cycle 1 (2013)', ath: '$1,163', bottom: '$152', range: '$1,011', nextATH: '$19,783 (Cycle 2)', fib: '19.42×', nearestFib: '> 4.236' },
  ],
};

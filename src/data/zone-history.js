// Analyse de durée par zone — combien de temps le prix reste à chaque niveau de profondeur
// 5 zones de la moins profonde (Zone 1) à la plus profonde (Zone 5)

// Date approximative d'entrée en Zone 2 pour le cycle courant
const ZONE2_ENTRY_DATE = '2026-01-30';

function daysSince(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

export const ZONE_1 = {
  title: 'Zone 1 : Sous la 111d MA, au-dessus de la 2-Year MA',
  subtitle: 'Bear confirmé',
  columns: ['Cycle', 'Passage sous 111d MA', 'Passage sous 2Y MA', 'Durée dans la zone', 'Type de sortie', 'Écart entrée / sortie'],
  rows: [
    { cycle: '2014-15', col1: '~Fév. 2014', col2: '~Déc. 2014', duration: '~10 mois', exitType: 'Vers le bas', gap: '...' },
    { cycle: '2018', col1: '~Fév. 2018', col2: '~Nov. 2018', duration: '~9 mois (lente descente à $6-8K)', exitType: 'Vers le bas', gap: '74.3% / 14.2%' },
    { cycle: '2022', col1: '~Déc. 2021', col2: '~Mai 2022', duration: '~5 mois', exitType: 'Vers le bas', gap: '48.5% / 13.8%' },
    { cycle: '2025-26', col1: '~mi-oct. 2025', col2: '~fin jan. 2026', duration: '4 mois', exitType: 'Vers le bas', gap: '32.6% / 10.3%', isCurrent: true },
  ],
  trend: 'Variable — dépend de la vitesse du crash',
};

export function getZone2() {
  const days = daysSince(ZONE2_ENTRY_DATE);
  return {
    title: 'Zone 2 : Sous la 2-Year MA, au-dessus de la 200-Week MA',
    subtitle: 'Entrée en zone bottom',
    columns: ['Cycle', 'Passage sous 2Y MA', 'Passage sous 200W MA', 'Durée dans la zone', 'Type de sortie', 'Écart entrée / sortie'],
    rows: [
      { cycle: '2014-15', col1: '~Déc. 2014', col2: '~Août 2015 (200W dispo. depuis peu)', duration: '~8 mois', exitType: 'Vers le bas', gap: '...' },
      { cycle: '2018', col1: '~Nov. 2018', col2: 'Jamais (à ~1% près)', duration: '~6 mois (nov. 2018 → mai 2019)', exitType: 'Vers le haut', gap: '44.4% / 43.3%' },
      { cycle: '2022', col1: '~Mai 2022', col2: '~Juin 2022', duration: '~1 mois', exitType: 'Vers le bas', gap: '38.1% / 38.2%' },
      { cycle: '2025-26', col1: '~fin jan. 2026', col2: 'Pas encore atteinte', duration: `En cours (${days} jours)`, exitType: 'Dans la zone', gap: '32.5% / —', isCurrent: true },
    ],
    trend: 'Crash rapide dans les cycles récents',
  };
}

export const ZONE_3 = {
  title: 'Zone 3 : 200-Week MA ↔ Realized Price',
  subtitle: 'Entre les deux métriques plancher historiques',
  columns: ['Cycle', 'Comportement', 'Durée dans la zone', 'Type de sortie', 'Écart entrée / sortie'],
  rows: [
    {
      cycle: '2015',
      behavior: 'RP (~$260) au-dessus de 200W MA (~$185). Le prix est passé sous le RP d\'abord, puis sous la 200W MA ~3 mois plus tard.',
      duration: '~3 mois (oct. 2014 → jan. 2015)',
      exitType: 'Vers le bas',
      gap: '...',
    },
    {
      cycle: '2018',
      behavior: 'RP (~$4,000) au-dessus de 200W MA (~$3,100). Le prix est passé sous le RP mais jamais durablement sous la 200W MA (bottom $3,122 à ~1% de la 200W).',
      duration: '~4.5 mois (nov. 2018 → avr. 2019)',
      exitType: 'Vers le haut',
      gap: '-55.9% / -55.5%',
    },
    {
      cycle: '2022',
      behavior: '200W MA (~$23K) au-dessus du RP (~$20.6K). Les deux cassés en quelques jours (juin 2022).',
      duration: '~1 jour (croisement 14-15 juin)',
      exitType: 'Vers le bas',
      gap: '-2.8% / -3.3%',
    },
    {
      cycle: '2025-26',
      behavior: '200W MA ($58,180) au-dessus du RP ($51,414). Prix $68,432 au-dessus des deux — Zone 3 pas encore atteinte.',
      duration: 'Pas encore atteinte',
      exitType: 'Pas encore atteinte',
      gap: 'Pas encore atteinte',
      isCurrent: true,
    },
  ],
  trend: 'Le prix est toujours passé sous le RP à un moment. La 200W MA est au-dessus du RP depuis le dernier cycle.',
  notes: [
    'En 2015 et 2018, le RP était au-dessus de la 200W MA — le prix a cassé le RP en premier.',
    'En 2022, la 200W MA était au-dessus du RP — le prix a cassé la 200W MA en premier.',
    'Actuellement : 200W MA ($58,180) modérément au-dessus du RP ($51,414) — écart de 12%.',
  ],
};

export const ZONE_4 = {
  title: 'Zone 4 : Realized Price ↔ CVDD ↔ Balanced Price',
  subtitle: 'Sous-évaluation extrême',
  columns: ['Cycle', 'Comportement', 'Durée dans la zone', 'Type de sortie', 'Écart entrée / sortie'],
  rows: [
    {
      cycle: '2015',
      behavior: 'RP (~$260) > BP (~$237) > CVDD (~$70). MVRV ~0.55-0.60. Prix $152 sous RP et BP mais bien au-dessus de CVDD (2.2× CVDD).',
      duration: '~12 mois (oct. 2014 → oct. 2015)',
      exitType: 'Vers le haut',
      gap: '...',
    },
    {
      cycle: '2018',
      behavior: 'RP (~$4,000) > BP (~$3,519) > CVDD (~$2,200). MVRV ~0.75-0.80. Prix $3,122 sous RP et BP mais au-dessus de CVDD (1.4× CVDD).',
      duration: '~5 mois (nov. 2018 → avr. 2019)',
      exitType: 'Vers le haut',
      gap: '42.9% / 30.9%',
    },
    {
      cycle: '2022',
      behavior: 'RP (~$20.6K) > BP (~$15,971) ≈ CVDD (~$15,400). MVRV 0.75. Prix $15,476 proche de BP et CVDD (1.0× CVDD).',
      duration: '~5 mois (juin → nov. 2022)',
      exitType: 'Vers le haut',
      gap: '37.1% / 33.3%',
    },
    {
      cycle: '2025-26',
      behavior: 'RP ($51,414) > CVDD ($44,526) > BP ($37,990). Prix $68,432 au-dessus du RP — Zone 4 pas encore atteinte. MVRV : 1.28',
      duration: 'Pas encore atteinte',
      exitType: 'Non atteinte',
      gap: 'Pas encore atteinte',
      isCurrent: true,
    },
  ],
  trend: 'RP > BP > CVDD dans tous les cycles précédents. Le prix était toujours sous le RP — le plancher était CVDD puisque BP était au-dessus. Le prix s\'est approché de CVDD à chaque cycle (2.2× → 1.4× → 1.0×). Maintenant que CVDD > BP, BP pourrait être le plancher ultime.',
};

export const ZONE_5 = {
  title: 'Zone 5 : CVDD ↔ Balanced Price',
  subtitle: 'Bottom de capitulation',
  columns: ['Cycle', 'Comportement', 'Durée dans la zone', 'Type de sortie', 'Écart entrée / sortie'],
  rows: [
    {
      cycle: '2015',
      behavior: 'BP (~$237) au-dessus de CVDD (~$70). Prix $224 brièvement sous BP (0.95×) mais bien au-dessus de CVDD (3.2×).',
      duration: 'Mèche brève',
      exitType: 'Vers le haut',
      gap: '...',
    },
    {
      cycle: '2018',
      behavior: 'BP (~$3,519) au-dessus de CVDD (~$2,200). Prix $3,195 brièvement sous BP (0.91×) mais au-dessus de CVDD (1.45×).',
      duration: '~2-3 semaines',
      exitType: 'Vers le haut',
      gap: '-37.6% / -37.3%',
    },
    {
      cycle: '2022',
      behavior: 'BP (~$15,971) proche de CVDD (~$15,400). Prix $15,758 brièvement sous BP (0.99×), à peine au-dessus de CVDD (1.02×).',
      duration: 'Mèche brève (crash FTX)',
      exitType: 'Vers le haut',
      gap: '-8.7% / -8.3%',
    },
    {
      cycle: '2025-26',
      behavior: 'CVDD ($44,526) au-dessus de BP ($37,990). Prix $68,432 au-dessus des deux — Zone 5 pas encore atteinte.',
      duration: 'Pas encore atteinte',
      exitType: 'Non atteinte',
      gap: 'Pas encore atteinte',
      isCurrent: true,
    },
  ],
  trend: 'BP était au-dessus de CVDD dans tous les cycles précédents. Le prix passait sous BP mais restait au-dessus de CVDD. En 2025-26, CVDD > BP pour la première fois — BP est le plancher ultime.',
  notes: [
    'Dans tous les cycles précédents, BP était au-dessus de CVDD. Le prix a touché/traversé BP mais jamais durablement sous CVDD.',
    'En 2025-26, CVDD est passé au-dessus de BP pour la première fois — BP est le vrai plancher bas.',
    'BP est remarquablement précis comme indicateur de bottom. Ratio prix/BP au bottom : 0.95 → 0.91 → 0.99.',
  ],
};

export function getAllZones() {
  return [ZONE_1, getZone2(), ZONE_3, ZONE_4, ZONE_5];
}

export const ZONE_DEFINITIONS = [
  { id: 1, name: 'Sous la 111d MA, au-dessus de la 2Y MA', shortName: 'Z1', colorHex: '#D4A843' },
  { id: 2, name: 'Sous la 2Y MA, au-dessus de la 200W MA', shortName: 'Z2', colorHex: '#E8732A' },
  { id: 3, name: 'Sous la 200W MA, au-dessus du RP', shortName: 'Z3', colorHex: '#3ECFA0' },
  { id: 4, name: 'RP \u2194 CVDD \u2194 BP', shortName: 'Z4', colorHex: '#EC4899' },
  { id: 5, name: 'CVDD \u2194 Balanced Price', shortName: 'Z5', colorHex: '#D946EF' },
];

export const ZONE_DURATION_DATA = [
  { cycle: '2014-15', zones: [10, 8, 1, 12, 0.1] },
  { cycle: '2018', zones: [9, 6, 0.5, 5, 0.7] },
  { cycle: '2022', zones: [5, 1, 0.03, 5, 0.1] },
  { cycle: '2025-26', zones: [4, 0.6, 0, 0, 0], isCurrent: true },
];

export function getCurrentZoneStatus() {
  return {
    activeZone: 2,
    zones: [
      { id: 1, state: 'completed', duration: '4 mois' },
      { id: 2, state: 'active', duration: `${daysSince(ZONE2_ENTRY_DATE)} jours` },
      { id: 3, state: 'future', duration: '\u2014' },
      { id: 4, state: 'future', duration: '\u2014' },
      { id: 5, state: 'future', duration: '\u2014' },
    ]
  };
}

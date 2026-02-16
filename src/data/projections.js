// Projections bottom Cycle 4 et ATH Cycle 5
// Données analytiques statiques

export const BOTTOM_PROJECTION = {
  title: 'Projection Bottom Cycle 4',
  consensusLabel: 'CONSENSUS PONDÉRÉ',
  consensus: 'Oct 2026 – Nov 2026 · $40K – $52K',
  consensusDetail: 'Drawdown : -72% à -64% depuis l\'ATH',
  dateMethods: [
    { name: 'Jours ATH→Bottom', desc: 'Moyenne 383j (fourchette 363–410) depuis l\'ATH', value: 'Oct 2026 – Nov 2026' },
    { name: 'Jours Halving→Bottom', desc: 'Tendance : 777→889→924, moyenne récente pondérée ~888j', value: '~Sep 2026' },
    { name: 'Ancrage pré-halving', desc: 'Les bottoms surviennent 12–18 mois avant le prochain halving (~fév. 2028)', value: 'Août 2026 – Fév 2027' },
  ],
  priceMethods: [
    { name: 'Drawdown décroissant', desc: 'Tendance : -87%→-84%→-78%, projection -72% à -64% depuis $126,198 ATH', value: '$35K – $45K' },
    { name: 'MVRV plancher × RP projeté', desc: 'MVRV au bottom : 0.75 (précédent 2018/2022). RP → ~$67K en oct. 2026', value: '~$50K' },
    { name: 'Plancher 200W MA', desc: 'La 200W MA monte ~$1.5K/mois → ~$64K en oct. 2026. Le prix touche/pénètre historiquement', value: '$64K (shallow)' },
    { name: 'Pénétration du RP', desc: 'Le prix est typiquement 20–25% sous le RP au bottom. RP ~$67K → 75–80% du RP', value: '$50K – $53K' },
  ],
};

export const ATH_PROJECTION = {
  title: 'Projection ATH Cycle 5',
  consensusLabel: 'CONSENSUS',
  consensus: 'Juil 2029 · $150K – $200K',
  consensusDetail: '',
  dateMethods: [
    { name: 'Prochain halving + bull run', desc: '~Fév. 2028 + moyenne récente pondérée 520j', value: '~Juil 2029' },
    { name: 'Bottom + recovery', desc: '~Oct 2026 + moyenne 1064j bottom-vers-ATH', value: '~Sep 2029' },
  ],
  priceMethods: [
    { name: 'Multiplicateurs ATH décroissants', desc: '17×→3.5×→1.83× (ATH-vers-ATH). Prochain : ~1.4×', value: '~$177K' },
    { name: 'Régression log-linéaire', desc: '+27% depuis le prix au halving. Si BTC ~$100K au halving → +27%', value: '~$127K' },
    { name: 'Power law sur les prix ATH', desc: 'ln(ATH) vs cycle : $1,163→$19,783→$69,000→$126,198', value: '$150K – $200K' },
    { name: 'Extension Fib haussière', desc: 'ATH $126K → bottom ~$45K. Niveaux 1.618 / 2.0', value: '$176K – $207K' },
  ],
};

export const PROJ_SCENARIOS = [
  {
    id: 'shallow',
    label: 'Superficiel',
    color: '#CCFF00',
    depth: 'Touche la 200W MA, tient au-dessus du RP/CVDD',
    bottom: '~$52,000-65,000',
    drawdown: '-59% à -48%',
    assessment: 'Modéré — la demande structurelle des ETF pourrait amortir',
  },
  {
    id: 'moderate',
    label: 'Modéré',
    color: '#D4A843',
    depth: 'Entre dans la zone de convergence RP/CVDD',
    bottom: '~$45,000-52,000',
    drawdown: '-64% à -59%',
    assessment: 'Suit la tendance de drawdown décroissant',
  },
  {
    id: 'deep',
    label: 'Profond (norme historique)',
    color: '#FF8C00',
    depth: 'Atteint le Balanced Price (~$36-40K)',
    bottom: '~$36,000-45,000',
    drawdown: '-71% à -64%',
    assessment: 'Cohérent avec les 3 bottoms de cycles précédents',
  },
  {
    id: 'extreme',
    label: 'Extrême (sans précédent)',
    color: '#FF003C',
    depth: 'Casse significativement sous le BP',
    bottom: '~$25,000-36,000',
    drawdown: '-80% à -71%',
    assessment: 'Briserait le pattern du BP comme marqueur de bottom',
  },
];

export const TIMELINE = [
  { date: '6 oct. 2025', event: 'ATH $126,198', detail: '', status: 'confirmed', color: '#22C55E' },
  { date: 'Nov. 2025', event: 'Le prix passe sous la 111d MA (structure bear commence)', detail: '', status: 'confirmed', color: '#22C55E' },
  { date: 'Fév. 2026', event: 'Le prix approche la 2Y MA (~$75K), flash crash à $60K', detail: '', status: 'confirmed', color: '#22C55E' },
  { date: 'T2 2026', event: 'Test de la 200W MA (~$62-65K)', detail: 'Toucher bref ? Séjour prolongé ? Dépend du catalyseur', status: 'current', color: '#FFB800' },
  { date: 'T3 2026', event: 'Potentielle cassure de la zone de convergence RP/CVDD (~$50-55K)', detail: 'MVRV < 1 = réseau globalement en perte', status: 'future', color: '#7A7F8E' },
  { date: 'Sep-Nov 2026', event: 'ZONE DE BOTTOM PROJETÉE', detail: 'Estimation centrale : ~$45,000-52,000 (scénario modéré)', status: 'future', color: '#7A7F8E' },
  { date: '2027-2028', event: 'Phase de recovery → prochain ATH du cycle', detail: 'Prochain halving : ~mars-avr. 2028', status: 'future', color: '#7A7F8E' },
];

export const DIFFERENTIATORS = {
  reduce: {
    title: 'Facteurs pouvant RÉDUIRE la sévérité',
    color: '#22C55E',
    items: [
      'Les ETF Spot BTC fournissent un plancher de demande institutionnelle persistant',
      'L\'adoption par les trésoreries d\'entreprise (modèle MicroStrategy) crée une dynamique d\'achat aux baisses',
      'Les tendances d\'adoption souveraine réduisent la panique vendeuse extrême',
      'La zone de convergence RP/CVDD crée une bande de support renforcée',
    ],
  },
  increase: {
    title: 'Facteurs pouvant AUGMENTER la sévérité',
    color: '#FF003C',
    items: [
      'Les sorties d\'ETF en période de panique pourraient accélérer la vente',
      'Le levier dans le système via les prêts adossés aux ETF pourrait cascader',
      'Environnement macro — taux d\'intérêt, risques de récession',
      'La vitesse des flash crashs montre la fragilité du marché',
    ],
  },
};

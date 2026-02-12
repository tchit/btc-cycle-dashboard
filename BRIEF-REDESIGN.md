# Brief Redesign — Bitcoin Cycle Dashboard Pro

## 📊 CONTEXTE DU PROJET

**Nom** : BTC Cycle Dashboard
**Type** : Application web data-intensive pour analyse de cycles Bitcoin
**Utilisateurs cibles** : Traders professionnels, investisseurs crypto, analystes on-chain
**Use case principal** : Monitoring en temps réel de multiples indicateurs (MVRV, Fear & Greed, NUPL, RSI, hashrate, dérivés, scénarios Monte Carlo)

**Architecture actuelle** :
- Stack : React + Vite
- Layout : Sidebar fixe gauche (240px) + Header sticky + Content area
- 8 vues principales avec navigation par tabs
- API : Binance, Mempool.space, bitcoin-data.com (via Cloudflare Worker proxy)
- Thème : Dark sidebar (#0C1222) + Light content (#F4F6F8)

---

## 🎨 DESIGN ACTUEL

### Typographie
- **Police principale** : IBM Plex Sans (body, UI)
- **Monospace** : IBM Plex Mono (valeurs numériques, labels techniques)
- **Problème identifié** : IBM Plex est sur la "liste interdite" du design-guidelines (section 2), car trop commun pour un dashboard premium

### Couleurs
- **Palette** : Inspirée du thème "Deep Trust" (fintech)
  - Background app : `#F4F6F8` (gris-bleu clair)
  - Sidebar : `#0C1222` (dark blue profond)
  - Cards : `#FFFFFF` (blanc pur)
  - Accent : `#F97316` (orange vif)
  - Semantic : Green `#10B981`, Red `#EF4444`, Yellow `#F59E0B`

- **Forces** : Contraste clair, lisibilité des chiffres
- **Faiblesses** : Manque de chaleur/personnalité, fond blanc pur (#FFF) interdit selon guidelines (section 3)

### Layout & Components
- **Stat Cards** : Grille 4 colonnes avec barre de couleur gauche (3px indicator)
- **Signal Cards** : Badges status (BULL/BEAR), typo mono, valeurs grandes
- **Composite Gauge** : Canvas animé avec gradient HSL, needle centrale
- **Charts** : Recharts (Line, Area, Bar) avec tooltips custom

**Ce qui fonctionne bien** :
✅ Hiérarchie visuelle claire entre les cartes
✅ Sidebar dark élégante avec sections bien séparées
✅ Responsive cohérent (mobile burger menu)
✅ Loading states avec barre top animée
✅ Fake data badges pour indicateurs en fallback

**Ce qui doit changer** :
❌ Typography trop générique (IBM Plex partout)
❌ Cards avec bordures fines + ombres légères = "le AI card générique" (cf. guidelines §6)
❌ Blanc pur sur les cards (#FFFFFF) — manque de sophistication
❌ Accent orange trop brut, pas de nuance
❌ Peu de micro-interactions (hover states basiques)
❌ Spacing parfois serré entre sections

---

## 🎯 OBJECTIFS DU REDESIGN

### Priorité 1 : Élever la perception "premium"
- Sortir du look "template fintech générique"
- Affirmer une identité visuelle distinctive
- Créer une ambiance "data room professionnelle" mais sophistiquée

### Priorité 2 : Améliorer la hiérarchie & lisibilité
- Les chiffres critiques (prix, MVRV, composite score) doivent dominer visuellement
- Réduire le "bruit" des bordures et ombres partout
- Clarifier la relation entre stat cards / signal cards / charts

### Priorité 3 : Moderniser sans perdre la sériosité
- Éviter le "playful" inadapté au contexte finance
- Garder l'efficacité opérationnelle (dashboard dense = OK)
- Introduire des détails premium (textures subtiles, typography pairings, micro-animations)

---

## 🚫 CONTRAINTES TECHNIQUES

### Impératifs
- **Accessibilité** : WCAG AA minimum (contraste 4.5:1 pour texte)
- **Budget typo** : Google Fonts ou FontShare uniquement (pas de fonts payantes)
- **Structure layout** : Garder sidebar gauche + header + content (pas de refonte architecture)
- **Responsive** : Mobile-first reste une priorité
- **Performance** : Pas de fonts > 2 (max 4 weights combinés)

### Choses à ÉVITER (cf. design-guidelines §7)
❌ Grils pur (#000) ou blanc pur (#FFF)
❌ Cards arrondies + shadow-lg (le "AI card")
❌ Boutons bleus arrondis standards
❌ Typographie < 14px pour body
❌ Polices de la liste interdite (Inter, Roboto, Helvetica, Montserrat, Poppins...)
❌ Animations gadget (glows, blobs génériques)

---

## 💎 DIRECTION SOUHAITÉE

**Style cible** : **"Cinematic Dark + Swiss Grid"**

### Mood board conceptuel
- **Référence visuelle** : linear.app (minimal structure) + nothing.tech (dark premium) + vercel.com (typography scale)
- **Ambiance** : Salle de contrôle NASA moderne, Bloomberg Terminal réinventé, war room crypto élégante
- **Mots-clés** : Data-dense, lisible, confiance, précision, nuit tardive, concentration

### Attentes visuelles
1. **Dark mode renforcé** : Privilégier le dark comme dominante (inverser light/dark actuel ?)
2. **Typography pairings audacieux** : Serif display pour les gros chiffres (prix, scores) + Sans moderne pour UI
3. **Palette sourde premium** : Moins de saturation, plus de subtilité
4. **Grille visible** : Spacers cohérents, alignements nets, rhythm vertical strict
5. **Détails tactiles** : Grain/noise overlay, frosted glass, borders subtiles

---

## 📦 LIVRABLES ATTENDUS

### 1. Nouvelle palette de couleurs (CSS variables complètes)
- Justifier le passage light → dark ou l'évolution de la palette actuelle
- Proposer 2-3 variations de couleur accent (alternatives à l'orange)
- Système de couleurs semantic complet (success/danger/warning/info)
- Opacités et backgrounds secondaires

### 2. Pairing typographique avec rationnels
- Proposition 1 : Serif Display + Sans UI (préférence)
- Proposition 2 : Alternative si nécessaire
- Scale typographique complète (H1 → Caption)
- Exemples d'application sur Stat Card / Signal Card / Composite Gauge

### 3. Refonte des composants clés (CSS)
**Minimum** :
- `.stat-card` (les 4 cards en haut du dashboard)
- `.signal-card` (badges BULL/BEAR, compact vertical)
- `.card` (container principal avec header/body)
- `.sidebar` (peut-être texturer ou floater ?)

**Bonus si possible** :
- `.composite-gauge-container` (autour du canvas)
- `.header` (sticky top bar)

### 4. Proposition de layout amélioré
- Faut-il changer les gaps, paddings, radius actuels ?
- Opportunités de "bento grid" asymétrique sur certaines vues ?
- Idées de micro-animations hover (translateY, scale, glow subtil)

### 5. Mockup visuel OU description ultra-détaillée
- Si possible : screenshot Figma/mockup du Dashboard actuel redesigné
- Sinon : description précise ligne par ligne des changements visuels attendus
- Annoter les "pourquoi" de chaque choix

---

## 📋 QUESTIONS OUVERTES (optionnel mais bienvenu)

Si vous avez des alternatives à proposer sur ces points, justifiez-les :

1. **Faut-il inverser le thème (dark dominant au lieu de light) ?**
   → Mon intuition : Oui, plus immersif pour usage nocturne crypto

2. **Cards : bordures fines ou séparation par spacing seul ?**
   → Ligne fine 1px OK, ou juste ombre très subtile ?

3. **Accent orange : conserver ou remplacer ?**
   → Alternatives : Blue électrique, Mint green, Amber chaud ?

4. **Navigation sidebar : floater en "pill" au lieu de fixed pleine hauteur ?**
   → Trend actuel, mais est-ce adapté ici ?

---

## 🎨 INSPIRATIONS VISUELLES (à explorer)

| Site | Prendre de |
|------|------------|
| linear.app | Hierarchie typographique, spacing immaculé |
| vercel.com | Dark mode sophistiqué, neutrals teintés |
| midjourney.com | Ambiance cinematic, gros titres immersifs |
| raycast.com | Cards minimalistes, glassmorphism subtil |
| nothing.tech | Bold sans typography, dark + accent |

---

## ✅ CHECKLIST FINALE (avant validation)

Vérifier que la proposition respecte **les 12 points anti-cheap** (cf. design-guidelines §7) :
- [ ] 1. Typo trop petite ou faible contraste text/bg ?
- [ ] 2. Hiérarchie H1/H2/H3 floue ou trop proche en taille ?
- [ ] 3. Spacing incohérent entre les sections ?
- [ ] 4. Grille non respectée (éléments flottants) ?
- [ ] 5. CTA mal hiérarchisés (tout se ressemble) ?
- [ ] 6. Manque d'états (hover/focus/disabled/loading) ?
- [ ] 7. Icônes cheap, incohérentes en style ou taille ?
- [ ] 8. Cards trop rondes + ombres "Material" génériques ?
- [ ] 9. Palette timide, sans dominante claire ?
- [ ] 10. Animations gadget ou trop nombreuses ?
- [ ] 11. Sections "template SaaS" sans caractère propre ?
- [ ] 12. Microcopy générique ("Get Started", "Learn More" partout) ?

---

## 📞 CONTACT & ITÉRATION

Une fois la proposition reçue, nous itérerons sur :
- Ajustements de palette si contraste insuffisant
- Fine-tuning de la scale typo (mobile breakpoints)
- Validation technique de l'implémentation CSS

**Merci de lire attentivement le fichier `design-guidelines.md` fourni avant de commencer !**

---

## 🔗 LIENS GITHUB — ACCÈS DIRECT AUX FICHIERS

### Repo complet
https://github.com/tchit/btc-cycle-dashboard

### Package Redesign (dossier dédié avec fichiers curatés)
https://github.com/tchit/btc-cycle-dashboard/tree/master/redesign-package

### Fichiers essentiels à consulter

**Design System & Guidelines :**
- [design-guidelines.md](https://github.com/tchit/btc-cycle-dashboard/blob/master/design-guidelines.md) — Règles de design premium (polices interdites, anti-patterns, thèmes)
- [tokens.css](https://github.com/tchit/btc-cycle-dashboard/blob/master/src/styles/tokens.css) — Variables CSS actuelles (couleurs, fonts, spacing)
- [design.js](https://github.com/tchit/btc-cycle-dashboard/blob/master/src/config/design.js) — Config couleurs JS

**Styles (CSS) :**
- [layout.css](https://github.com/tchit/btc-cycle-dashboard/blob/master/src/styles/layout.css) — Structure sidebar/header/grille
- [components.css](https://github.com/tchit/btc-cycle-dashboard/blob/master/src/styles/components.css) — Tous les styles de composants
- [responsive.css](https://github.com/tchit/btc-cycle-dashboard/blob/master/src/styles/responsive.css) — Media queries

**Structure :**
- [App.jsx](https://github.com/tchit/btc-cycle-dashboard/blob/master/src/App.jsx) — Layout principal (sidebar + header + tabs)

**Composants clés :**
- [StatCard.jsx](https://github.com/tchit/btc-cycle-dashboard/blob/master/src/components/StatCard.jsx) — Cards stats (Prix, MVRV, F&G, ATH)
- [SignalCard.jsx](https://github.com/tchit/btc-cycle-dashboard/blob/master/src/components/SignalCard.jsx) — Cards signaux BULL/BEAR
- [CompositeGauge.jsx](https://github.com/tchit/btc-cycle-dashboard/blob/master/src/components/CompositeGauge.jsx) — Gauge canvas animé
- [MiniGauge.jsx](https://github.com/tchit/btc-cycle-dashboard/blob/master/src/components/MiniGauge.jsx) — Petites jauges
- [BottomScoreCard.jsx](https://github.com/tchit/btc-cycle-dashboard/blob/master/src/components/BottomScoreCard.jsx) — Décomposition du score

**Vues :**
- [DashboardView.jsx](https://github.com/tchit/btc-cycle-dashboard/blob/master/src/views/DashboardView.jsx) — Vue principale
- [OnChainView.jsx](https://github.com/tchit/btc-cycle-dashboard/blob/master/src/views/OnChainView.jsx) — Vue On-Chain
- [PriceView.jsx](https://github.com/tchit/btc-cycle-dashboard/blob/master/src/views/PriceView.jsx) — Vue Prix

**Screenshots :**
- [Screenshots du dashboard actuel](https://github.com/tchit/btc-cycle-dashboard/tree/master/redesign-package/screenshots)

---

*Document créé pour le package de redesign BTC Cycle Dashboard — Février 2026*

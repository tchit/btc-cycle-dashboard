# BRIEF-REDESIGN-V2 — Electric Playground (Dark Arcade Edition)

> **Remplace** `BRIEF-REDESIGN.md`. Ce document est la source de vérité unique pour le redesign.
> **Branche** : `redesign`
> **Règle d'or** : Ne JAMAIS modifier la logique métier (hooks, API calls, data transforms). UI only.

---

## 1. VISION

**"Agence de comm × trading firm × crazy startup × degens"**

Dark mode neon, cartes blanches flottantes sur fond navy-black, accents polychromes (pas mono-vert), typographie signature, visuels génératifs, gauge réacteur, sidebar dock flottante. Un dashboard où un enfant de 7 ans veut rester et où un trader pro se sent chez lui.

**Références** : pitch.com (layout audacieux), linear.app (motion/dark), gumroad.com (couleur bold), nothing.tech (minimal punch)

---

## 2. PALETTE — "Electric Playground Dark"

### 2.1 Couleurs applicatives

```
DARK CANVAS
  --bg-app:             #0A0E1A       /* Navy-black principal */
  --bg-sidebar:         rgba(15, 22, 41, 0.85)  /* Glass dark */
  --bg-surface:         #141B2E       /* Surfaces secondaires, panels */
  --bg-surface-hover:   #1A2340

WHITE CARDS (flottent sur le dark)
  --bg-card:            #FFFFFF
  --bg-card-header:     #FAFAF8
  --bg-card-hover:      #FDFDFD

GLASS CARDS (variante semi-transparente)
  --bg-glass:           rgba(255, 255, 255, 0.06)
  --bg-glass-hover:     rgba(255, 255, 255, 0.10)
  --glass-border:       rgba(255, 255, 255, 0.10)
  --glass-blur:         16px

ACCENTS — LE TRIO (jamais un seul, toujours les 3 en rotation)
  --electric:           #0047FF       /* Electric Blue — accent principal, links, active states */
  --electric-hover:     #2563FF
  --electric-subtle:    rgba(0, 71, 255, 0.12)
  --electric-glow:      rgba(0, 71, 255, 0.30)

  --lime:               #CCFF00       /* Acid Lime — bullish, success, wow moments */
  --lime-hover:         #D4FF33
  --lime-subtle:        rgba(204, 255, 0, 0.10)
  --lime-glow:          rgba(204, 255, 0, 0.25)

  --coral:              #FF3D00       /* Coral Red — bearish, danger, alerts */
  --coral-hover:        #FF5722
  --coral-subtle:       rgba(255, 61, 0, 0.10)
  --coral-glow:         rgba(255, 61, 0, 0.25)

SEMANTIC (mapped to trio)
  --up:                 #CCFF00       /* = lime */
  --up-bg:              rgba(204, 255, 0, 0.10)
  --down:               #FF3D00       /* = coral */
  --down-bg:            rgba(255, 61, 0, 0.10)
  --warn:               #FFB800       /* Amber */
  --warn-bg:            rgba(255, 184, 0, 0.10)
  --neutral-signal:     #64748B
  --neutral-signal-bg:  rgba(100, 116, 139, 0.10)

TEXT — Dual context
  /* Sur fond dark (app, sidebar, headers) */
  --text-primary:       #F0F2F7
  --text-secondary:     #94A3B8
  --text-tertiary:      #64748B

  /* Sur cartes blanches — utiliser via DSCard en JS */
  --text-on-card:       #1A1613
  --text-on-card-2:     #75726F
  --text-on-card-3:     #A8A5A1

BORDERS
  --border:             rgba(255, 255, 255, 0.08)    /* Sur dark */
  --border-card:        rgba(0, 0, 0, 0.06)          /* Sur cartes blanches */
  --border-active:      var(--electric)
```

### 2.2 Shadows (dramatiques sur dark)

```
  --shadow-card:        0 8px 32px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.15);
  --shadow-card-hover:  0 16px 48px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.20);
  --shadow-glow-electric: 0 0 24px rgba(0, 71, 255, 0.20);
  --shadow-glow-lime:   0 0 24px rgba(204, 255, 0, 0.15);
  --shadow-glow-coral:  0 0 24px rgba(255, 61, 0, 0.15);
  --shadow-sidebar:     4px 0 32px rgba(0, 0, 0, 0.3);
```

### 2.3 Radius

```
  --radius-sm:          12px
  --radius-md:          20px
  --radius-lg:          28px
  --radius-dock:        2rem     /* Sidebar dock */
```

### 2.4 INTERDITS

- ❌ `#000000` (noir pur) → utiliser `#0A0E1A` ou `#1A1613`
- ❌ `#FFFFFF` comme fond d'app → OK uniquement pour les cartes flottantes
- ❌ `#39FF14` (neon gaming vert) → utiliser `#CCFF00` (acid lime)
- ❌ Mono-accent (une seule couleur partout) → toujours le trio electric/lime/coral
- ❌ Emojis dans l'UI (💰📊🏔💀🤑) → jamais. Le fun vient de la couleur et du mouvement

---

## 3. TYPOGRAPHIE

### 3.1 Font stack

```
  --font-display:   'Bricolage Grotesque', sans-serif;   /* Display, H1-H3, gros chiffres */
  --font:           'DM Sans', sans-serif;                /* Body, UI, labels */
  --font-mono:      'JetBrains Mono', monospace;          /* Data, valeurs, code */
```

### 3.2 index.html — Google Fonts links

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### 3.3 Type scale (augmentée pour impact)

```
  --text-xs:    13px;
  --text-sm:    14px;
  --text-base:  16px;
  --text-lg:    20px;
  --text-xl:    40px;      /* was 32 — titres de sections */
  --text-2xl:   56px;      /* was 48 — prix, scores importants */
  --text-3xl:   80px;      /* was 64 — gauge number, hero data */
```

### 3.4 INTERDITES

Inter, Roboto, Arial, Helvetica, Open Sans, Lato, Montserrat, Poppins,
Nunito, Source Sans Pro, system-ui, sans-serif générique, Syne.

---

## 4. DESIGN.JS — Dual Token System

Le fichier `src/config/design.js` exporte DEUX objets :

```js
// DS = contexte DARK (app background, sidebar, header, glass cards)
export const DS = {
  // Backgrounds
  bg: '#0A0E1A',
  surface: '#141B2E',
  surface2: '#1A2340',
  card: '#FFFFFF',
  cardHeader: '#FAFAF8',
  sidebar: 'rgba(15, 22, 41, 0.85)',
  sidebarHover: 'rgba(255, 255, 255, 0.08)',

  // Text on dark
  text: '#F0F2F7',
  text2: '#94A3B8',
  text3: '#64748B',

  // Borders on dark
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.05)',

  // Accents — LE TRIO
  electric: '#0047FF',
  lime: '#CCFF00',
  coral: '#FF3D00',
  accent: '#0047FF',        // Default accent = electric
  accentHover: '#2563FF',
  warn: '#FFB800',

  // Semantic
  up: '#CCFF00',
  down: '#FF3D00',
  neutralSignal: '#64748B',

  // Extended
  blue: '#0047FF',
  purple: '#8B5CF6',
  pink: '#EC4899',

  // Fonts
  font: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
  display: "'Bricolage Grotesque', sans-serif",

  // Shadows
  shadowCard: '0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)',
  shadowCardHover: '0 16px 48px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.20)',
  glowElectric: '0 0 24px rgba(0,71,255,0.20)',
  glowLime: '0 0 24px rgba(204,255,0,0.15)',
  glowCoral: '0 0 24px rgba(255,61,0,0.15)',
};

// DSCard = contexte WHITE CARD (intérieur des cartes blanches)
// Utiliser DSCard.text au lieu de DS.text quand on est DANS une carte blanche
export const DSCard = {
  bg: '#FFFFFF',
  bgHeader: '#FAFAF8',
  bgHover: '#F8F7F4',
  text: '#1A1613',
  text2: '#75726F',
  text3: '#A8A5A1',
  border: 'rgba(0, 0, 0, 0.06)',
  borderLight: 'rgba(0, 0, 0, 0.04)',
  // Accents same as DS
  electric: '#0047FF',
  lime: '#CCFF00',
  coral: '#FF3D00',
  accent: '#0047FF',
  up: '#16A34A',          // Vert plus sombre sur blanc pour contraste
  down: '#DC2626',        // Rouge plus sombre sur blanc pour contraste
  warn: '#D97706',
  neutralSignal: '#94A3B8',
};
```

### 4.1 Règle d'usage DS vs DSCard

| Contexte | Objet | Exemple |
|----------|-------|---------|
| Fond d'app, sidebar, header | `DS` | `background: DS.bg` |
| Intérieur carte blanche | `DSCard` | `color: DSCard.text` |
| Intérieur carte glass | `DS` | `color: DS.text` (texte clair sur glass sombre) |
| Accents (partout) | `DS` ou `DSCard` | Identiques, utiliser l'un ou l'autre |

---

## 5. ANIMATIONS & MOTION

### 5.1 Keyframes à ajouter dans tokens.css

```css
/* Spring overshoot — LE timing signature */
--spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

@keyframes springIn {
  from { opacity: 0; transform: translateY(16px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes gaugeArc {
  from { stroke-dashoffset: var(--arc-length); }
  to   { stroke-dashoffset: var(--target-offset); }
}

@keyframes countUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 8px var(--glow-color); }
  50%      { box-shadow: 0 0 20px var(--glow-color); }
}

@keyframes grainShift {
  0%, 100% { transform: translate(0, 0); }
  10%      { transform: translate(-2%, -2%); }
  30%      { transform: translate(1%, -1%); }
  50%      { transform: translate(-1%, 2%); }
  70%      { transform: translate(2%, 1%); }
  90%      { transform: translate(-2%, 0%); }
}
```

### 5.2 Règles motion

- **Hover cards** : `transform: translateY(-4px)` + `box-shadow` upgrade, `transition: all 0.3s var(--spring)`
- **Stagger** : Chaque card dans un grid a un `animation-delay` de `calc(var(--i) * 80ms)` où `--i` est l'index (0, 1, 2, 3...)
- **Gauge mount** : `1500ms` avec spring, commence au mount du composant
- **Score counter** : Animation compteur 0→N en `1200ms` avec easing OutExpo
- **INTERDIT** : `neonPulse` ou animations qui flashent en continu sur des éléments de data — distrait de la lecture

---

## 6. GRAIN OVERLAY GLOBAL

Ajouter dans `tokens.css` sur `body::before` :

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
  animation: grainShift 8s steps(10) infinite;
}
```

---

## 7. COMPOSANTS — SPECS DÉTAILLÉES

### 7.1 Sidebar — Dock Flottant Glassmorphism

**Fichier** : `layout.css` section `.sidebar`

```
Position : fixed, left: 16px, top: 16px, bottom: 16px
Width : 72px (collapsed) → 260px (expanded on hover)
Transition : width 0.4s var(--spring)
Background : rgba(15, 22, 41, 0.85)
Backdrop-filter : blur(24px) saturate(180%)
Border-radius : 2rem (32px)
Border : 1px solid rgba(255, 255, 255, 0.06)
Shadow : 4px 0 32px rgba(0, 0, 0, 0.3)
Overflow : hidden
```

**Items** :
- Collapsed : icône centrée 24px, tooltip on hover (right)
- Expanded : icône + label, font DM Sans 14px 500
- Active item : background `var(--electric)`, text `#0A0E1A` (dark on blue), `border-radius: 12px`
- Hover item : background `rgba(255, 255, 255, 0.06)`

**Logo** : "BTC CYCLE" en Bricolage Grotesque 700, 14px uppercase, letter-spacing 0.1em, `color: var(--text-primary)`. Collapsed = "BC" monogram.

**NE PAS** : Flush contre le bord. Pas de background solide opaque. Pas de width fixe 280px.

### 7.2 Main Content Area — Ajuster pour dock

```css
.main-content {
  margin-left: calc(72px + 16px + 16px);  /* dock width + left offset + gap */
  transition: margin-left 0.4s var(--spring);
  padding: 24px 32px;
}
```

### 7.3 Header / TopBar

**Fond** : transparent (le `--bg-app` dark visible derrière)
**Titre** : "Bitcoin Cycle Dashboard" en Bricolage Grotesque 700, 20px, `color: var(--text-primary)`
**Prix live** : à droite, font-mono, 20px 800, `color: var(--lime)` si up / `var(--coral)` si down
**F&G Badge** : Pill arrondi `border-radius: 100px`, fond sémantique (coral-subtle si fear, lime-subtle si greed), text bold mono, petit dot animé (glowPulse)
**Horloge MAJ** : font-mono, 13px, `color: var(--text-tertiary)`, format "MAJ: 16:18:41"

### 7.4 MetricCards (StatCard) — 4 Variants

**Fichier** : `components.css` section `.stat-card`

Toutes les variants sont des **cartes blanches** (`--bg-card: #FFFFFF`) sur le fond dark.

#### Variant HERO (Prix Actuel)
```
grid: col-span-2 (prend 2 colonnes)
padding: 32px
border-radius: 28px
shadow: var(--shadow-card)
border-top: 5px solid var(--lime)     ← "scotch tape" sémantique
Valeur : text-2xl (56px), Bricolage Grotesque 800, color DSCard.text
Label : text-xs, mono, uppercase, tracking 0.1em, DSCard.text3
Trend badge : pill lime-subtle bg, lime text, mono bold
Hover : translateY(-4px), shadow-card-hover
```

#### Variant ALERT (MVRV, Fear & Greed)
```
grid: col-span-1
padding: 24px
border-radius: 20px
shadow: var(--shadow-card)
border-top: 5px solid [sémantique]    ← scotch tape
  MVRV neutral → var(--electric)
  F&G extreme fear → var(--coral)
  F&G greed → var(--lime)
Valeur : text-xl (40px), Bricolage Grotesque 700
Sub-value : text-sm, mono, DSCard.text2
```

#### Variant GLASS (Distance ATH, secondary data)
```
background: rgba(255, 255, 255, 0.06)
backdrop-filter: blur(16px)
border: 1px solid rgba(255, 255, 255, 0.10)
border-radius: 20px
Text : var(--text-primary) (blanc sur glass)
Valeur : text-xl, Bricolage Grotesque 600
```

#### Variant RAW (data point minimaliste)
```
background: transparent
border-left: 3px solid var(--electric)
padding-left: 16px
Pas de shadow, pas de radius
Text : var(--text-primary)
Valeur : text-lg, mono, 600
```

### 7.5 Grid Bento Asymétrique (DashboardView)

```
Desktop (≥1280px) — 12 colonnes, gap 20px :

Row 1 (MetricCards) :
  [Prix — span 5] [MVRV — span 3] [F&G — span 4]

Row 2 (Score + Signals) :
  [Composite Gauge — span 8] [Key Signals — span 4]

Row 3 (Depth) :
  [On-Chain Depth — span 7] [Cycle Position — span 5]
```

**PAS** : 4 colonnes identiques. Pas de grille symétrique.

### 7.6 ScoreGauge (CompositeGauge.jsx)

**Container** : carte blanche, 320×320px min, `border-radius: 28px`, padding 32px, centré.

**Arc SVG 270°** :
```
Rayon : 80
Épaisseur stroke : 22px (chunky)
strokeLinecap: round
Ouverture : -135° à +135° (270° total, ouvert en bas)
Track : rgba(0, 0, 0, 0.06)  (gris très léger sur carte blanche)
```

**Gradient dynamique** (selon score) :
```
0-30   : coral → orange          (fear zone)
30-70  : electric → electric     (neutral/hold)
70-100 : lime → green            (greed zone)
```

**Animations** :
- Arc fill : `1500ms` avec `var(--spring)` — l'arc OVERSHOOT légèrement avant de se poser
- Counter : 0 → score en `1200ms`, easing OutExpo `(1 - pow(2, -10 * t))`
- Glow bead : Un cercle lumineux suit la tête de l'arc (même couleur, filter blur 4px)

**Score number** : `text-3xl` (80px), Bricolage Grotesque 800, `color: DSCard.text`
**Label** : "BOTTOM SCORE" en mono, xs, uppercase, tracking wide, DSCard.text3
**Status badge** : Pill arrondi, fond sémantique, texte bold. Ex: "Fear" sur fond coral-subtle.
**Sub-titre** : "Fear & Greed" en Bricolage Grotesque 600, 14px, sous le score

**NE PAS** : Emojis (💀🤑). Pas d'aiguille (needle) — le arc fill EST l'indicateur. Pas de tick marks visibles.

### 7.7 KeySignals (SignalGrid + SignalCard)

**Layout** : Grille 2×N de **tuiles**, pas une liste verticale.

**Chaque tuile** :
```
background: blanc (DSCard)
border-radius: 16px
padding: 16px
border-left: 4px solid [sémantique]
  bull → var(--lime)
  bear → var(--coral)
  warning → var(--warn)
  neutral → var(--electric)
```

**Contenu tuile** :
- Nom indicateur : DM Sans 13px 600, DSCard.text2, uppercase
- Valeur : JetBrains Mono 20px 700, DSCard.text
- Barre de progression : height 4px, border-radius 2px, fond rgba(0,0,0,0.06), fill sémantique
- Dot status : 8px circle, fond sémantique, animation `glowPulse` 3s

**Hover** : `translateY(-2px)`, shadow légère, barre s'épaissit à 6px

**"Voir tous les indicateurs →"** : Lien discret, DM Sans 14px 500, `color: var(--electric)`, hover underline.

### 7.8 ImageSlot.jsx (NOUVEAU COMPOSANT)

**Fichier** : `src/components/ImageSlot.jsx` + `src/styles/image-slot.css`

Composant qui affiche un **art génératif SVG** en background de n'importe quelle carte. 6 variants :

| Variant | Visuel | Usage |
|---------|--------|-------|
| `mesh` | Gradient mesh orbital (cercles concentriques, blur) | Hero panels, Composite Score |
| `halftone` | Points halftone dégradés | Headers de section |
| `rings` | Anneaux concentriques fins | Cycle Position |
| `circuit` | Lignes de circuit imprimé | On-Chain Depth |
| `isometric` | Grille isométrique de cubes | Sidebar brand slot |
| `sticker` | Formes géométriques aléatoires | Empty states |

**Props** :
```jsx
<ImageSlot
  variant="mesh"           // mesh | halftone | rings | circuit | isometric | sticker
  tone="electric"          // electric | lime | coral | neutral
  opacity={0.12}           // 0.08 sur cartes blanches, 0.20 sur dark/glass
  src={null}               // Si fourni, affiche l'image au lieu du SVG
  className=""
/>
```

**Chaque variant** = un `<svg>` inline avec des formes et couleurs basées sur `tone`. Utilise les hex du trio. Pas d'image externe, pas de fetch. Pur SVG + CSS.

**Placement dans les cartes** : `position: absolute; inset: 0; pointer-events: none; overflow: hidden; border-radius: inherit;`

---

## 8. PLAN D'EXÉCUTION — ORDRE DES FICHIERS

### Phase 1 : Fondations (DOIT être fait en premier, tout le reste en dépend)

| # | Fichier | Action |
|---|---------|--------|
| 1 | `index.html` | Remplacer liens Google Fonts (§3.2) |
| 2 | `src/styles/tokens.css` | Réécrire complètement : palette dark §2, type scale §3.3, animations §5.1, grain §6 |
| 3 | `src/config/design.js` | Réécrire : DS (dark) + DSCard (white) exports §4 |

### Phase 2 : Layout

| # | Fichier | Action |
|---|---------|--------|
| 4 | `src/styles/layout.css` | Sidebar dock flottant §7.1, main-content margin §7.2, header §7.3 |
| 5 | `src/App.jsx` | Sidebar JSX : collapsed/expanded states, hover logic, monogram |

### Phase 3 : Composants core

| # | Fichier | Action |
|---|---------|--------|
| 6 | `src/styles/components.css` | Cards avec 4 variants §7.4, shadows dramatiques, scotch bars, hover spring |
| 7 | `src/components/StatCard.jsx` | Appliquer variant prop, DSCard pour texte, scotch bar sémantique |
| 8 | `src/components/CompositeGauge.jsx` | Refonte totale : arc SVG 270°, gradient dynamique, spring 1500ms, counter §7.6 |
| 9 | `src/styles/score-gauge.css` | NOUVEAU fichier, styles gauge extraits de components.css |
| 10 | `src/components/SignalCard.jsx` + `SignalGrid.jsx` | Tuiles colorées §7.7 au lieu de liste |
| 11 | `src/styles/key-signals.css` | NOUVEAU fichier, styles signaux |

### Phase 4 : Enrichissement visuel

| # | Fichier | Action |
|---|---------|--------|
| 12 | `src/components/ImageSlot.jsx` | NOUVEAU, 6 variants SVG §7.8 |
| 13 | `src/styles/image-slot.css` | NOUVEAU, styles + opacités |
| 14 | `src/components/MetricCard.jsx` | Intégrer ImageSlot en background sur variant hero |
| 15 | `src/components/FearGreedCard.jsx` | Nombres 52px, spectrum bar 10px, couleurs trio, ZERO emoji |

### Phase 5 : Assemblage

| # | Fichier | Action |
|---|---------|--------|
| 16 | `src/views/DashboardView.jsx` | Grid bento asymétrique §7.5, stagger animation-delay |
| 17 | `src/components/BottomScoreCard.jsx` | DSCard pour texte, ombres, spacing |

### Phase 6 : Migration DS → DSCard (28 fichiers inline styles)

**Règle** : Tout composant qui render DU TEXTE DANS UNE CARTE BLANCHE doit utiliser `DSCard.text` au lieu de `DS.text`.

Fichiers à migrer (remplacer `DS.text` → `DSCard.text`, `DS.surface2` → `DSCard.bgHover`, etc.) :

```
src/components/BottomScoreCard.jsx
src/components/CyclePosition.jsx
src/components/ExhaustionPanel.jsx
src/components/FearGreedCard.jsx
src/components/FundingRateChart.jsx
src/components/HashRibbonsChart.jsx
src/components/MetricCard.jsx
src/components/MiningMarginChart.jsx
src/components/MonteCarloChart.jsx
src/components/OnChainDepth.jsx
src/components/PiCycleChart.jsx
src/components/PriceBandsChart.jsx
src/components/PriceBandsChartV2.jsx
src/components/PriceBandsChartV3.jsx
src/components/PriceHistoryChart.jsx
src/components/PriceLevels.jsx
src/components/RainbowChart.jsx
src/components/ScenarioZoneChart.jsx
src/components/SignalCard.jsx
src/components/StatCard.jsx
src/views/ConnectorsView.jsx   (if exists in views/)
src/views/DashboardView.jsx
src/views/DerivativesView.jsx  (if exists)
src/views/MinersView.jsx       (if exists)
src/views/OnChainView.jsx      (if exists)
src/views/PriceView.jsx        (if exists)
src/views/RainbowView.jsx      (if exists)
src/views/ScenariosView.jsx    (if exists)
```

**Charts** (Recharts) : `background: 'transparent'`, gridlines `stroke: 'rgba(255,255,255,0.06)'` si chart dans glass, ou `stroke: 'rgba(0,0,0,0.06)'` si dans carte blanche. Tooltip backgrounds : `DS.surface` avec `border: 1px solid ${DS.border}`.

### Phase 7 : Responsive

| # | Fichier | Action |
|---|---------|--------|
| 18 | `src/styles/responsive.css` | Sidebar mobile = drawer overlay, fond `DS.bg` solide. Gauge 260px mobile. Grid 1 col mobile. StatCard values 32px mobile. |

---

## 9. CHECKLIST DE VÉRIFICATION (12 points anti-cheap)

Après implémentation, vérifier chaque point :

- [ ] **Contraste** : texte blanc sur dark ≥ 7:1, texte noir sur carte ≥ 15:1
- [ ] **Hiérarchie typo** : Display (80/56/40) nettement distinct de body (16/14/13)
- [ ] **Spacing** : base 4px, cohérent (8/12/16/24/32), pas de valeurs aléatoires
- [ ] **Grid** : Bento asymétrique visible, PAS 4 colonnes identiques
- [ ] **Scotch bars** : Couleur sémantique sur CHAQUE MetricCard (lime=bull, coral=bear, electric=neutral)
- [ ] **Hover states** : TOUS les éléments interactifs ont un hover (translateY + shadow upgrade)
- [ ] **1 wow moment** : La gauge attire l'œil immédiatement (taille, couleur, animation)
- [ ] **Sidebar dock** : Flottante, rounded, glassmorphism, PAS collée au bord
- [ ] **Grain overlay** : Visible à peine (opacity 0.025), donne texture "print premium"
- [ ] **ZERO emoji** dans l'UI — le fun vient des couleurs, du mouvement, des SVG génératifs
- [ ] **Stagger** : Les cards apparaissent avec un décalage de 80ms entre elles
- [ ] **JAMAIS** border + shadow simultanés sur le même composant (sauf scotch bar qui est un border-top décoratif, pas structurel)

---

## 10. CE QUI N'EST PAS DANS CE BRIEF (futur)

- [ ] Dark mode toggle (tokens prêts pour `[data-theme="light"]` plus tard)
- [ ] 12 images générées (prompts dans PROMPT-KIT.md à venir)
- [ ] Mascotte (raccoon exec vs monster — non tranché)
- [ ] TopBar composant séparé (actuellement dans App.jsx header)
- [ ] Animations avancées (parallax scroll, chart transitions)

---

*Document v2 — Février 2026 — Remplace BRIEF-REDESIGN.md*
*Guidelines consultés : design-guidelines.md + design-guidelines-v2.md (Space)*

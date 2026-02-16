# DESIGN GUIDELINES — BTC Cycle Dashboard ("Neon Wasteland")

---

## 1. PHILOSOPHIE

### Anti-convergence
L'IA tend vers la "convergence distributionnelle" : elle prédit les patterns les plus
communs, produisant systématiquement les mêmes choix génériques ("AI slop").
Chaque token design, chaque composant, chaque choix typo doit être délibéré.

Ce dashboard n'est PAS un site SaaS. C'est un **HUD cyberpunk** pour l'analyse
de données Bitcoin. Chaque décision design sert la lisibilité des données,
l'atmosphère "terminal de guerre" et la densité informationnelle.

### Identité "Neon Wasteland"
- **Ambiance** : terminal militaire futuriste, HUD de cockpit, écran de surveillance
- **Principe** : la donnée est reine, le chrome est au service de la lecture
- **Signature** : clip-paths biseautés, glows néon, scan lines, noise texture
- **Jamais** : border-radius arrondi, ombres Material Design, glassmorphism, layouts marketing

### Architecture modulaire
Le projet utilise une architecture composants React + CSS pur :
- Design tokens centralisés dans `tokens.css` (CSS variables) et `design.js` (objet `DS`)
- Composants autonomes consommant les tokens via CSS classes ou inline styles
- Vues assemblant les composants par onglet
- **Pas de Tailwind**, pas de CSS-in-JS, pas de TypeScript

---

## 2. ARBORESCENCE

```
src/
├── styles/
│   ├── tokens.css          # Design tokens : couleurs, typo, spacing, clip-paths, glows
│   ├── components.css      # Styles composants (cards, stats, signals, tabs, gauge)
│   ├── layout.css          # App shell, sidebar, content, scan lines, noise
│   ├── responsive.css      # Breakpoints et adaptations mobile
│   ├── key-signals.css     # Styles spécifiques KeySignals
│   ├── metric-card.css     # Styles MetricCard
│   ├── score-gauge.css     # Styles ScoreGauge
│   ├── zone-visuals.css    # Styles Zone Analysis
│   ├── data-table.css      # Styles DataTable
│   └── image-slot.css      # Styles ImageSlot/ImagePlaceholder
├── config/
│   ├── design.js           # Objet DS (couleurs inline) + DSCard (variante card)
│   └── constants.js        # Constantes données (ATH, RP, seuils...)
├── components/             # ~44 composants React (.jsx)
├── views/                  # 13 vues par onglet (.jsx)
├── hooks/                  # Hooks custom (useLiveData, useCalc, useScreen...)
└── utils/                  # Helpers (format, color, montecarlo)
```

### Deux systèmes de tokens — quand utiliser lequel

| Système | Fichier | Usage | Exemple |
|---------|---------|-------|---------|
| **CSS variables** | `tokens.css` | Classes CSS dans `.css` | `color: var(--text-primary)` |
| **Objet DS** | `design.js` | Inline styles dans `.jsx` | `style={{ color: DS.text2 }}` |
| **Objet DSCard** | `design.js` | Inline styles contexte card | `style={{ background: DSCard.bg }}` |

**Règle critique** : toute modification de couleur/token doit être répercutée dans
LES DEUX systèmes. Changer `--accent` sans changer `DS.accent` crée des incohérences.

### Ordre de build pour un nouveau composant
1. **Tokens** — vérifier que les variables nécessaires existent dans `tokens.css`
2. **CSS classes** — ajouter dans le `.css` approprié (ou `components.css`)
3. **JSX** — construire le composant en utilisant les classes + DS pour inline
4. **Intégration** — ajouter dans la vue cible
5. **Responsive** — ajouter breakpoints dans `responsive.css` si nécessaire

---

## 3. TYPOGRAPHIE

### Polices du projet
| Rôle | Police | Poids | Usage |
|------|--------|-------|-------|
| Display | **Chakra Petch** | 400–700 | Titres, labels, tabs, card-title, badges |
| Body | **DM Sans** | 400–700 | Texte courant, descriptions, détails |
| Data / Mono | **JetBrains Mono** | 400–600 | Valeurs numériques, prix, pourcentages, deltas |

**Réserve** : Bricolage Grotesque est chargée dans `index.html` mais pas utilisée actuellement.

### INTERDITES
Inter, Roboto, Arial, Helvetica, Open Sans, Lato, Montserrat, Poppins,
Nunito, Source Sans Pro, IBM Plex, system-ui, sans-serif générique.

### Échelle typographique (tokens.css)
```css
--text-xs:  13px;    /* Labels mineurs, badges, footer */
--text-sm:  14px;    /* Labels, stat-label, signal-title */
--text-base: 16px;   /* Body text, descriptions */
--text-lg:  20px;    /* Sous-titres, valeurs secondaires */
--text-xl:  40px;    /* Stat values (avec clamp) */
--text-2xl: 56px;    /* Featured stat values */
--text-3xl: 80px;    /* Gauge value, hero numbers */
```

### Conventions typographiques par contexte
| Contexte | Police | Taille | Poids | Casse | Letter-spacing |
|----------|--------|--------|-------|-------|----------------|
| Card title | Chakra Petch | 10–14px | 700 | UPPERCASE | 0.05–0.08em |
| Stat value | JetBrains Mono | clamp(20px, 2.2vw, 40px) | 700 | Normal | -0.02em |
| Signal status badge | Chakra Petch | 10px | 700 | UPPERCASE | 0.05em |
| Tab label | Chakra Petch | 11px | 700 | UPPERCASE | 0.08em |
| Body text | DM Sans | 16px | 400 | Normal | -0.01em |
| Delta badge | JetBrains Mono | 11px | 700 | Normal | -0.02em |
| Section eyebrow | Chakra Petch | 10–11px | 700 | UPPERCASE | 0.1em+ |

### Règles
- **Valeurs numériques** → toujours JetBrains Mono (alignement tabulaire)
- **Labels/titres** → toujours Chakra Petch uppercase
- **Body min 16px** — jamais de texte courant sous 16px
- **Line-height** : 1.05–1.2 titres/données, 1.5–1.6 body
- **Letter-spacing serré** sur gros chiffres (-0.02em à -0.05em)
- **Text-shadow glow** sur les valeurs importantes : `text-shadow: var(--glow-text)`
- **Fluid type** avec `clamp()` pour les valeurs dans stat-card (déjà en place)

---

## 4. PALETTE & TOKENS COULEUR

### Principe "Neon Wasteland"
- 1 accent vif dominant (acid lime) + 1 danger (néon rouge) + 1 warn (ambre) + neutres bleutés
- Neutres JAMAIS gris pur → toujours teintés bleu froid (#7A7F8E, #B0B4C0)
- Noir pur #000 interdit → `#0B0C10` (bg-deep)
- Blanc pur #FFF limité aux `--text-highlight` pour les valeurs critiques
- Contraste WCAG AA minimum (4.5:1 texte, 3:1 éléments UI)

### Palette complète
```
BACKGROUNDS
  --bg-deep:       #0B0C10     ← fond principal
  --bg-sidebar:    #111318     ← sidebar
  --surface:       #1A1C25     ← cards, panels
  --surface-hover: #242732     ← hover state
  --bg-card-header:#22252F     ← header de card

TEXT
  --text-highlight: #FFFFFF    ← valeurs critiques, chiffres principaux
  --text-primary:   #FFFFFF    ← titres, labels actifs
  --text-secondary: #B0B4C0   ← descriptions, détails
  --text-muted:     #7A7F8E   ← labels inactifs, hints

ACCENT — ACID LIME
  --accent:         #CCFF00    ← couleur signature
  --accent-hover:   #D4FF33    ← hover
  --accent-subtle:  rgba(204,255,0, 0.10)  ← backgrounds subtils
  --accent-glow:    rgba(204,255,0, 0.25)  ← halos

SEMANTIC — SIGNAUX
  --up:    #CCFF00   (lime)    ← bullish, positif
  --down:  #FF003C   (rouge)   ← bearish, négatif, danger
  --warn:  #FFB800   (ambre)   ← attention, fetching
  --neutral-signal: #7A7F8E   ← neutre

ZONES — RAMPE DE SÉVÉRITÉ
  --zone-1: #CCFF00  (safe)
  --zone-2: #D4A843  (caution)
  --zone-3: #E8732A  (elevated)
  --zone-4: #FF003C  (danger)
  --zone-5: #7A1B1B  (extreme)

ACCENTS SECONDAIRES
  --blue:   #2D5BFF
  --purple: #8B5CF6
  --pink:   #EC4899
  --gold:   #D4A843
```

### Règles d'utilisation des couleurs
- L'accent lime `#CCFF00` est TOUJOURS la couleur dominante. Jamais en compétition.
- Le rouge `#FF003C` est réservé aux signaux bearish/danger. Jamais décoratif.
- L'ambre `#FFB800` est réservé aux états "attention" et loading.
- Les bordures de cards sont toujours `rgba(accent, 0.10)` — jamais de bordure opaque.
- Sur hover, la bordure passe à `rgba(accent, 0.25)` + petit glow.

---

## 5. GLOWS & EFFETS LUMINEUX

Les glows sont la signature du thème. **JAMAIS les atténuer ou les supprimer.**

### Presets de glow (tokens.css)
```css
--glow-sm:   0 0  8px rgba(204,255,0, 0.3);   /* hover subtil */
--glow-md:   0 0 20px rgba(204,255,0, 0.4);   /* focus, featured */
--glow-lg:   0 0 40px rgba(204,255,0, 0.2);   /* hero, radial bg */
--glow-text: 0 0 20px rgba(204,255,0, 0.6);   /* text-shadow sur valeurs */
--glow-danger:      0 0 20px rgba(255,0,60, 0.4);
--glow-text-danger: 0 0 20px rgba(255,0,60, 0.6);
--glow-gold:        0 0 12px rgba(212,168,67, 0.25);
```

### Règles d'application
| Contexte | Glow | Quand |
|----------|------|-------|
| Card hover | `--glow-sm` | `:hover` |
| Featured card hover | `--glow-md` | `:hover` |
| Stat value | `--glow-text` | Toujours (text-shadow) |
| Tab active | `--glow-sm` | `.active` |
| Badge bullish | `--glow-sm` | Toujours |
| Fear & Greed extreme | Animation `fg-breathe` | État extrême |
| Sidebar logo dot | `pulse-neon-danger` | Toujours (animation) |

### Effets atmosphériques globaux
- **Scan lines** : `body::after` — lignes horizontales 2px à 3% opacité du lime
- **Noise texture** : `body::before` — SVG fractal noise à 3.5% opacité
- Ces effets sont définis dans `layout.css` et ne doivent JAMAIS être supprimés.

---

## 6. CLIP-PATHS — GÉOMÉTRIE HUD

Les clip-paths sont l'ADN visuel du dashboard. **JAMAIS les remplacer par border-radius.**

### Presets (tokens.css)
```css
/* Card standard — coins biseautés 16px */
--clip-card: polygon(
  0 0,
  calc(100% - 16px) 0,
  100% 16px,
  100% 100%,
  16px 100%,
  0 calc(100% - 16px)
);

/* Card petit format — coins biseautés 10px */
--clip-card-sm: polygon(
  0 0,
  calc(100% - 10px) 0,
  100% 10px,
  100% 100%,
  10px 100%,
  0 calc(100% - 10px)
);

/* Badge — coins biseautés 6px */
--clip-badge: polygon(
  0 0,
  calc(100% - 6px) 0,
  100% 6px,
  100% 100%,
  6px 100%,
  0 calc(100% - 6px)
);
```

### Quand utiliser quel preset
| Composant | Clip-path | Radius |
|-----------|-----------|--------|
| `.card` | `--clip-card` | 0 |
| `.stat-card` | `--clip-card-sm` | 0 |
| `.signal-card` | `--clip-card-sm` | 0 |
| `.card-badge` | `--clip-badge` | 0 |
| `.signal-status` | `--clip-badge` | 0 |
| `.stat-change` | `--clip-badge` | 0 |
| `.stat-delta` | `--clip-badge` | 0 |
| `.fake-badge` | `--clip-badge` | 0 |
| `.tab` | aucun | 0 |
| Scrollbar thumb | aucun | 3px (exception) |
| Sidebar logo dot | aucun | 50% (exception — c'est un point) |

### Règle absolue
`border-radius` est fixé à `4px` dans les tokens mais **n'est utilisé sur aucun composant majeur**.
Tous les composants visuels utilisent `clip-path` + `border-radius: 0`.
Les seules exceptions sont les éléments circulaires (logo dot, scrollbar thumb).

---

## 7. SPACING & LAYOUT

### Base 4px
Échelle : 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.

### Valeurs récurrentes du projet
| Usage | Valeur |
|-------|--------|
| Card body padding | 20px |
| Card header padding | 16px 20px |
| Stat card padding | 20px (+ 24px left) |
| Signal card padding | 16px |
| Grid gap (stat-grid) | 16px |
| Grid gap (signal-grid) | 12px |
| Section spacing vertical | 16–24px |
| Sidebar width | 280px |
| Header height | 80px |
| Content padding (desktop) | 32px |
| Content padding (mobile) | 16px |

### Grilles
| Composant | Colonnes desktop | Colonnes tablette | Colonnes mobile |
|-----------|-----------------|-------------------|-----------------|
| stat-grid | 5 | 2 | 1 |
| signal-grid | 4 | 2 | 1 |
| sources-grid | — | 2 | 1 |
| mini-gauge-grid | — | 2 | — |

### Breakpoints (responsive.css)
| Nom | Largeur | Comportement |
|-----|---------|--------------|
| Desktop | > 1024px | Layout complet, sidebar visible |
| Tablette | ≤ 1024px | Sidebar escamotable, grilles 2 cols |
| Mobile | ≤ 640px | Grilles 1 col, padding réduit, tailles réduites |
| Intermédiaire | ≤ 768px | Ajustements spécifiques (PriceBands, OCD) |

### Anti-patterns layout
| Interdit | Préférer |
|----------|----------|
| Tout centré sans grille | Grilles CSS avec colonnes explicites |
| 3 cards identiques pleine largeur | Grille 4–5 colonnes, densité data |
| Sections espacées type landing page (py-20) | Sections serrées, data-dense |
| Hero marketing plein écran | Hero avec image + StatCards immédiats |
| Scroll horizontal caché | Scroll horizontal visible (tabs) ou wrap |

---

## 8. MOTION & ANIMATIONS

### Durées (tokens.css)
| Type | Variable | Durée | Easing |
|------|----------|-------|--------|
| Hover/focus rapide | `--duration-fast` | 150ms | `--ease-smooth` |
| Transition standard | `--duration-base` | 250ms | `--ease-smooth` |
| Entrée/reveal | `--duration-slow` | 400ms | `--ease-smooth` |
| Stagger entre cards | — | 60ms par item | `--ease-smooth` |

### Easing (tokens.css)
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);   /* standard */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* rebond subtil */
```

### Animations définies
| Nom | Fichier | Usage |
|-----|---------|-------|
| `fadeInUp` | tokens.css | Entrée des cards (opacity + translateY 12px) |
| `pulse` | tokens.css | Loading générique |
| `loadSlide` | tokens.css | Barre de chargement |
| `pulse-fetch` | components.css | Badge "fetching" |
| `fg-breathe` | components.css | Fear & Greed extrême (scale + glow) |
| `fg-shimmer` | components.css | Shimmer overlay F&G |
| `pulse-glow` | components.css | Pulse opacity |
| `pulse-neon-danger` | layout.css | Logo dot sidebar (glow rouge pulsé) |
| `pulseLime` | zone-visuals.css | Pulse lime pour zones |
| `growBar` | zone-visuals.css | Animation barre croissante |

### Règles motion
- **1 moment "wow"** (entrée staggerée des cards) > 20 micro-animations dispersées
- **Hover standard** : `translateY(-2px)` + border-color hover + `--glow-sm`
- **Stagger** : 60ms entre items (`animation-delay: calc(n * 60ms)`)
- **Respecter `prefers-reduced-motion`** — pas encore implémenté, à ajouter
- Jamais d'easing `linear` sauf pour les barres de progression
- Jamais de transitions sur `clip-path` (performance)
- Les animations de respiration (breathe) sont réservées aux états extrêmes

---

## 9. COMPOSANTS — PATTERNS & ANTI-PATTERNS

### Cards (HUD Panels)
```
✅ FAIRE                              ❌ NE PAS FAIRE
clip-path biseauté                     border-radius arrondi
border 1px solid rgba(accent, 0.10)    border opaque
box-shadow: none (état normal)         shadow-lg permanent
glow-sm au hover                       shadow Material Design
scanline top ::before au hover         glassmorphism / backdrop-blur
background: var(--surface)             background blanc ou gris clair
border-radius: 0                       border-radius: 8px, 12px, 16px
```

### Stat Cards
- **Border-left sémantique** : 3px de couleur up/down/warn/neutral
- **Featured** : `grid-column: span 2`, border-left 4px accent, gradient subtil
- **Valeur** : JetBrains Mono, glow text, clamp() pour responsive
- **Footer** : delta badge (↑↓) + detail text
- **Entrée** : `fadeInUp 0.4s` avec stagger 60ms

### Signal Cards
- Plus compactes que les stat-cards (padding 16px vs 20px)
- Badge status dans le header : bullish (lime), bearish (rouge), neutral (gris)
- Valeur centrée en JetBrains Mono 24px avec glow

### Badges & Deltas
- Toujours `clip-path: var(--clip-badge)` — jamais rounded
- Couleur contextuelle : lime (up), rouge (down), ambre (fake/loading)
- Taille compacte : 9–11px, font-weight 700, uppercase

### Tabs
- **HUD style** : fond `--bg-deep`, border `--border-base`, radius 0
- Tab active : fond subtil accent (8% opacity) + border accent (20%) + glow-sm
- Label : Chakra Petch 11px uppercase, letter-spacing 0.08em
- Padding : 10px 16px

### Gauge (CompositeGauge)
- Background radial gradient subtil (accent 4% au centre)
- Label : Chakra Petch 10px uppercase, letter-spacing 3px
- Value : JetBrains Mono 48px, glow text, couleur dynamique par zone

### Images (ImagePlaceholder)
- 5 variants : `hero`, `section`, `card-bg`, `sidebar`, `banner`
- Hero : `filter: brightness(0.35)` — très assombri pour lisibilité
- Section banners : `filter: brightness(0.5)`
- Toujours `position: absolute` + overlay gradient ou darkening

### Navigation (Sidebar)
- **Pas de navbar** — sidebar fixe à gauche
- Background : gradient vertical surface → #12131a
- Border-right : accent 15% opacity
- Inner shadow : `inset -1px 0 20px rgba(0,0,0,0.3)`
- Logo : dot rouge pulsant + "BTC" en neon
- Section dividers + image `cycle.png` avec label

---

## 10. STYLES INLINE — OBJET DS (design.js)

De nombreux composants utilisent des styles inline via l'objet `DS`.
C'est un pattern établi du projet — ne pas chercher à tout migrer en CSS.

### Quand utiliser inline (DS) vs CSS classes
| Situation | Utiliser |
|-----------|---------|
| Couleur dynamique (basée sur une valeur/état) | `DS` inline |
| Style fixe réutilisé sur plusieurs éléments | Classe CSS |
| Composant avec beaucoup de variantes d'état | `DS` inline |
| Layout structurel (grid, flex, padding) | Classe CSS ou inline, cohérent avec l'existant du composant |

### Convention pour inline styles
```jsx
// ✅ BON — utilise DS pour les couleurs
<div style={{ color: DS.text2, fontFamily: DS.mono, fontSize: 14 }}>

// ✅ BON — utilise DS pour les arrière-plans
<div style={{ background: DS.surface, border: `1px solid ${DS.border}` }}>

// ❌ MAUVAIS — couleurs hardcodées sans DS
<div style={{ color: '#B0B4C0', background: '#1A1C25' }}>

// ❌ MAUVAIS — utilise DS quand la classe CSS existe déjà
<div style={{ background: DS.surface }} className="card"> // redondant
```

---

## 11. CHECKLIST QUALITÉ (14 points)

### Lisibilité & Hiérarchie
1. ☐ Texte lisible sur TOUS les fonds ? (tester surface, bg-deep, card-header)
2. ☐ Hiérarchie claire entre valeur (mono bold) → label (display uppercase) → detail (body muted) ?
3. ☐ Valeurs numériques en JetBrains Mono avec glow ?

### Cohérence tokens
4. ☐ Couleurs via `var()` ou `DS.xxx` — jamais hardcodées ?
5. ☐ Modification faite dans BOTH `tokens.css` ET `design.js` si applicable ?
6. ☐ Toutes les cards ayant `--bg-card` comme fond sont dans les sélecteurs scoped ?

### Géométrie HUD
7. ☐ `border-radius: 0` sur tous les composants (sauf exceptions documentées) ?
8. ☐ `clip-path` approprié appliqué (card/card-sm/badge) ?
9. ☐ Glows présents et non atténués ?

### Données & États
10. ☐ Deltas (↑↓ badges) présents sur stat-cards et signal-cards ?
11. ☐ États up/down/warn/neutral visuellement distincts ?
12. ☐ FakeBadge affiché pour données simulées ?
13. ☐ Loading states animés (pulse-fetch) ?

### Responsive
14. ☐ Grilles adaptées aux 3 breakpoints (1024/768/640) ?

---

## 12. WORKFLOW DE MODIFICATION DESIGN

### Modifier une couleur ou un token
1. Identifier la variable dans `tokens.css`
2. Grep pour TOUTES les occurrences dans `.css` ET `.jsx` (inline styles via DS)
3. Modifier dans `tokens.css` (CSS variables)
4. Modifier dans `design.js` (objet DS et/ou DSCard)
5. Vérifier visuellement chaque composant affecté — `npm run build` ne suffit PAS

### Modifier une taille de police
1. Grep pour `fontSize` dans TOUS les `.jsx` (inline styles sont majoritaires)
2. Grep pour `font-size` dans TOUS les `.css`
3. Modifier les CSS variables dans `tokens.css` si applicable
4. Modifier TOUS les inline `fontSize` dans les composants
5. Vérifier les breakpoints dans `responsive.css`

### Ajouter un nouveau composant
1. Créer le `.jsx` dans `components/`
2. Utiliser les clip-paths existants (card/card-sm/badge)
3. Utiliser DS pour les couleurs inline, classes pour le layout
4. Ajouter les styles dans le `.css` approprié (ou nouveau fichier `.css`)
5. Importer le CSS dans le composant ou dans `main.jsx`
6. Ajouter responsive dans `responsive.css` si nécessaire
7. Intégrer dans la vue cible

### Règle critique : JAMAIS de batch visual
Après l'échec du redesign "Degen Arcade" (février 2026) :
- **JAMAIS** migrer des changements visuels sur 30+ fichiers d'un coup
- Travailler composant par composant : design → code → vérification visuelle → suivant
- Les subagents parallèles sont bons pour le refactoring logique, MAUVAIS pour le design

---

## 13. MOTS-CLÉS DE VIBE

Le design "Neon Wasteland" se situe à l'intersection de :

- **"cyberpunk HUD"** → clip-paths, scan lines, données denses, glows néon
- **"fintech terminal"** → dark mode, data-dense, monospace values, severity ramps
- **"military ops center"** → status indicators, zone colors, uppercase labels, précision
- **"retro CRT"** → noise texture, scan lines, glow bleed, phosphor green (lime)

### Ce que ce projet n'est PAS
| Vibe interdite | Pourquoi |
|----------------|----------|
| "glassmorphism" | Pas de backdrop-blur, pas de surfaces semi-transparentes |
| "SaaS landing" | Pas de hero marketing, pas de testimonials, pas de pricing cards |
| "Material Design" | Pas de shadow elevation, pas de FAB, pas de ripple |
| "Swiss grid minimal" | Pas de whitespace maximal — le projet est data-dense |
| "editorial luxury" | Pas de serif, pas de grandes images lifestyle |
| "neo-brutal" | Pas de border épaisses colorées, pas de radius 0 pour être "edgy" — radius 0 ici est fonctionnel (clip-path HUD) |
| "tactile paper" | Pas de textures papier, pas de couleurs sourdes |

---

## 14. RÉFÉRENCES VISUELLES

| Catégorie | Références |
|-----------|-----------|
| Dashboard dark data-dense | Bloomberg Terminal, TradingView (dark mode) |
| HUD / cyberpunk UI | Cyberpunk 2077 UI, EVE Online, Elite Dangerous HUD |
| Terminal aesthetic | Vercel (deployment logs), Linear (dark mode) |
| Neon dark | nothing.tech, midjourney.com |
| Data visualization | Observable (observablehq.com), D3.js gallery |

### Ressources
- **Polices** : fonts.google.com — Chakra Petch, DM Sans, JetBrains Mono
- **Contrastes** : realtimecolors.com
- **Palettes** : coolors.co

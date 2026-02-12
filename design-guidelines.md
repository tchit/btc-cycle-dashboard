# DESIGN GUIDELINES — Web Design Premium
# Fichier à uploader dans le Space Perplexity

---

## 1. PHILOSOPHIE

L'IA tend vers la "convergence distributionnelle" (Anthropic) : elle prédit les patterns
les plus communs dans ses données d'entraînement, ce qui produit systématiquement les
mêmes choix génériques. Ce fichier existe pour casser ces patterns.

Chaque choix typographique, chaque valeur de spacing, chaque couleur doit être délibéré.
Le design haut de gamme repose sur l'intentionnalité, pas sur les defaults.

---

## 2. TYPOGRAPHIE

### Principes
- La typographie représente 90% de l'impact visuel. Elle EST le design.
- Pairing : 2 polices max (1 Display + 1 Body). Option Mono si contexte tech.
- Body min : 16-18px. Line-height : 1.2 titres, 1.5-1.6 body.
- Letter-spacing : serré sur gros titres (-0.02em à -0.05em), légèrement élargi sur uppercase (+0.02em).
- Largeur texte : max 65-75 caractères/ligne (max-width ~680px).
- Fluid type : utiliser clamp() (ex: clamp(1rem, 2.5vw, 1.25rem)).

### Polices RECOMMANDÉES (Google Fonts / FontShare)
**Display / Headings :**
- Instrument Serif (editorial élégant)
- Playfair Display (luxe classique)
- Fraunces (organique premium)
- Syne (géométrique bold)
- Bricolage Grotesque (personnalité forte)
- DM Serif Display (sharp moderne)
- Lexend Mega (impact brutalist)
- Archivo Black (bold industriel)

**Body / UI :**
- Instrument Sans, Plus Jakarta Sans, DM Sans, Manrope
- IBM Plex Sans (technique crédible)
- Public Sans (neutre distinctif)

**Monospace :**
- JetBrains Mono, Space Mono, IBM Plex Mono

### Polices INTERDITES
Inter, Roboto, Arial, Helvetica, Open Sans, Lato, Montserrat, Poppins,
Nunito, Source Sans Pro, system-ui, sans-serif générique.

### Pairings par archétype
| Archétype | Display | Body | Usage |
|-----------|---------|------|-------|
| Editorial Luxe | Playfair Display / Fraunces | DM Sans / Manrope | Mode, journalisme, luxe |
| Swiss/Grid | Instrument Sans (800) | Instrument Sans (400) | Architecture, studio, SaaS premium |
| Tech/Industrial | Syne Extrabold / Space Grotesk | Plus Jakarta Sans + JetBrains Mono | Web3, dev tools, AI |
| Neo-Brutalist | Lexend Mega / Archivo Black | Public Sans / IBM Plex Mono | Streetwear, agences audacieuses |
| Contemporary | Bricolage Grotesque | Instrument Sans | Startups créatives, portfolios |

### Échelle typographique (ratio ~1.25-1.414)
| Élément | Taille | Poids | Line-height |
|---------|--------|-------|-------------|
| Display | clamp(3rem, 6vw, 5rem) | 700 | 1.05 |
| H1 | clamp(2.25rem, 4vw, 3.5rem) | 700 | 1.1 |
| H2 | clamp(1.75rem, 3vw, 2.5rem) | 600 | 1.15 |
| H3 | clamp(1.25rem, 2vw, 1.75rem) | 600 | 1.2 |
| Body Large | 1.125rem | 400 | 1.6 |
| Body | 1rem | 400 | 1.6 |
| Small/Meta | 0.875rem | 400 | 1.5 |
| Caption | 0.75rem | 500 | 1.4 |

---

## 3. COULEURS & THÈMES

### Principes
- 1 dominante + 1 accent vif + 3-5 neutres. JAMAIS distribution égale.
- Neutres JAMAIS gris pur : toujours teinter (bleuté, verdâtre, rosé).
- Fond blanc pur (#FFFFFF) interdit → préférer #FAFAF8, #F5F5F0.
- Fond noir pur (#000000) interdit → préférer #0A0A0B, #111111.
- Contraste WCAG AA minimum (4.5:1 texte, 3:1 éléments UI).
- Toujours CSS custom properties.

### Thèmes nommés (shortcuts pour prompter)

#### "Midnight Oil" — Dark & Sophisticated
- bg: #0A0A0A | surface: #171717 | accent: #D4D4D4 (silver)
- text-main: #EDEDED | text-muted: #737373
- Usage : Cinematic, software, premium dark.

#### "Clay & Stone" — Organic & Warm
- bg: #F2F0E9 | surface: #FFFFFF | accent: #BC5A34 (burnt orange) ou #4A5D44 (sage)
- text-main: #2C2825 | text-muted: #8A8580
- Usage : Wellness, intérieur, craft, food.

#### "Electric Acid" — Bold & Loud
- bg: #F7F7F7 | surface: #FFFFFF | accent-1: #0047FF (Klein blue) | accent-2: #CCFF00 (acid lime)
- text-main: #111111 | borders: 2px solid black
- Usage : Agence, events, digital art.

#### "Ink & Paper" — Editorial Classique
- bg: #FAF9F6 | surface: #FFFFFF | accent: #C4453C (rouge brique)
- text-main: #1A1A1A | text-muted: #6B6B6B
- Usage : Média, publishing, portfolios texte.

#### "Deep Trust" — Fintech & Corporate
- bg: #0C1222 | surface: #141C30 | accent: #3ECFA0 (vert menthe)
- text-main: #E8E8E8 | text-muted: #7A8599
- Usage : Fintech, SaaS B2B, dashboards.

### Palettes par secteur (aide contextuelle)
| Secteur | Dominante | Accent | Ambiance |
|---------|-----------|--------|----------|
| E-commerce luxe | Noir profond | Or/Champagne | Exclusif, rare |
| Créatif/Portfolio | Off-white | Corail/Terracotta | Chaleureux, artisanal |
| Santé/Wellness | Beige sable | Vert sauge | Calme, organique |
| Startup tech | Blanc cassé | Bleu électrique | Dynamique, futuriste |
| Architecture | Gris chaud | Noir + accent cuivre | Structuré, matériel |

### Structure CSS Variables (template)
```css
:root {
  /* Base */
  --color-bg: ;
  --color-bg-secondary: ;
  --color-surface: ;

  /* Text */
  --color-text-primary: ;
  --color-text-secondary: ;
  --color-text-tertiary: ;

  /* Brand */
  --color-accent: ;
  --color-accent-hover: ;
  --color-accent-subtle: ; /* 10% opacity */

  /* Borders */
  --color-border: ;
  --color-border-hover: ;

  /* Semantic */
  --color-success: ;
  --color-warning: ;
  --color-danger: ;
  --color-focus: ;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.06);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.08);
  --shadow-xl: 0 24px 60px rgba(0,0,0,0.12);

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Spacing (base 4px) */
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px;
  --space-4: 16px; --space-6: 24px;  --space-8: 32px;
  --space-12: 48px; --space-16: 64px;
  --space-24: 96px; --space-32: 128px;

  /* Motion */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 4. LAYOUT & SPACING

### Grid
- 12 colonnes, max-width 1200px, gutter 24px (desktop), 16px (mobile).
- Le whitespace est un outil de luxe : plus il y en a, plus c'est premium.

### Spacing sections
- Padding vertical sections : min 80px desktop, 48px mobile.
- Contenu texte : max-width 680px.
- Hiérarchie par la taille ET l'espace : éléments importants = plus d'espace autour.

### Breakpoints
| Breakpoint | Largeur | Colonnes | Gutter |
|-----------|---------|----------|--------|
| Mobile | < 640px | 4 | 16px |
| Tablet | 640-1024px | 8 | 20px |
| Desktop | 1024-1440px | 12 | 24px |
| Wide | > 1440px | 12 | 32px |

### Anti-patterns layout
- ❌ Tout centré sans grille ("layout PowerPoint")
- ❌ Cards 3x3 identiques sans hiérarchie
- ❌ Hero = titre centré + bouton + image stock
- ❌ Alternance mécanique texte-gauche/image-droite
- ✅ Asymétrie intentionnelle
- ✅ Bento grids avec tailles variées
- ✅ Vide comme élément de design
- ✅ Overlap et layering subtils

---

## 5. ANIMATIONS & MOTION

### Principes
- 1 moment "wow" max (entrée orchestrée) > 20 micro-animations dispersées.
- CSS pur prioritaire. JS uniquement si nécessaire.
- Easing : JAMAIS linear. Toujours cubic-bezier ou ease-out.
- Respecter prefers-reduced-motion.

### Durées
| Type | Durée |
|------|-------|
| Micro-interaction (hover, focus) | 150-250ms |
| Transition UI (toggle, expand) | 250-350ms |
| Entrance/reveal | 400-600ms |
| Page transition | 500-800ms |
| Stagger delay entre éléments | 60-100ms |

### Animations recommandées
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.reveal-item {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
}
.reveal-item:nth-child(1) { animation-delay: 0ms; }
.reveal-item:nth-child(2) { animation-delay: 80ms; }
.reveal-item:nth-child(3) { animation-delay: 160ms; }

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  transition: var(--transition-base);
}

.btn:hover { transform: translateY(-1px); }
.btn:active { transform: translateY(0); }
```

### Backgrounds premium
- Dégradés mesh subtils (radial-gradient superposés)
- Grain/noise en overlay (SVG 3-5% opacité)
- Gradient orbs flous (backdrop-filter blur 80-120px)
- Patterns géométriques basse opacité
- ❌ Blobs génériques, glow gratuit, gradients violet cliché

---

## 6. COMPOSANTS — Standards premium

### Boutons
- Hauteur min 44px (accessibilité tactile). Padding horizontal 24-32px.
- Max 2 styles par page (primary + secondary/ghost).
- Ghost : bordure 1.5px min. Hover : changement couleur + légère élévation.
- Focus : outline visible (accessibilité clavier), jamais outline:none sans alternative.

#### Anti-patterns boutons
- ❌ Bouton bleu arrondi standard
- ✅ "Brutalist Pill" : radius 999px, border 1px solid, hover fill
- ✅ "The Block" : radius 0, uppercase, tracking wide
- ✅ "The Link" : texte seul + underline animé (0% → 100% width on hover)

### Cards
- Padding interne 24-32px min.
- Jamais bordure ET ombre simultanément — choisir l'un ou l'autre.
- Image ratio cohérent dans une grille (16:9, 4:3, ou 1:1).
- ❌ Cards avec shadow-lg sur fond blanc (le "AI card")
- ✅ Séparées par lignes fines (1px solid border-color/10)
- ✅ Frosted glass (backdrop-blur-xl + bg-white/5)
- ✅ Aspect-ratio inhabituels (3/4 portrait, 21/9 wide)

### Navigation
- Logo gauche, CTA extrême droite. Hauteur 64-80px.
- Lien actif : distinction claire (underline, poids, couleur).
- Mobile : hamburger avec transition fluide (pas de jump).
- ❌ Navbar classique "logo + liens alignés" sans intention
- ✅ Navbar flottante en pilule (glassmorphism)
- ✅ Mega-menu plein écran
- ✅ Layout "4 coins" (logo/menu/copyright/social)

### Formulaires
- Labels TOUJOURS visibles (pas placeholder-only).
- Input height min 48px. Border 1px, focus = couleur accent.
- Espacement entre champs 16-24px.
- Erreurs : rouge accessible, icône, sous le champ.

---

## 7. CHECKLIST ANTI-CHEAP (12 points)

Avant de finaliser tout design, vérifier :
1. Typo trop petite ou faible contraste text/bg ?
2. Hiérarchie H1/H2/H3 floue ou trop proche en taille ?
3. Spacing incohérent entre les sections ?
4. Grille non respectée (éléments flottants) ?
5. CTA mal hiérarchisés (tout se ressemble) ?
6. Manque d'états (hover/focus/disabled/loading) ?
7. Icônes cheap, incohérentes en style ou taille ?
8. Cards trop rondes + ombres "Material" génériques ?
9. Palette timide, sans dominante claire ?
10. Animations gadget ou trop nombreuses ?
11. Sections "template SaaS" sans caractère propre ?
12. Microcopy générique ("Get Started", "Learn More" partout) ?

---

## 8. MOTS-CLÉS DE VIBE (pour piloter le style)

Utilise ces termes dans les briefs pour orienter précisément la direction :
- "Editorial luxury" → serif display, whitespace, hierarchy forte
- "Swiss grid" → rigueur, grille visible, fonctionnel
- "Neo-brutal" → border épaisses, radius 0, contraste max, uppercase
- "Cinematic dark" → grand format, typographie immersive, ambiance
- "Tactile paper" → textures, couleurs sourdes, craft
- "Modernist museum" → minimal, monochrome, espace sacré
- "Fintech trust" → dark mode, data-dense, accents vifs
- "Glass & light" → glassmorphism, blur, transparences, lumineux

---

## 9. RÉFÉRENCES WEB (sites à étudier)

| Style | Sites |
|-------|-------|
| Minimalist editorial | stripe.com, linear.app, raycast.com |
| Dark premium | vercel.com, midjourney.com, nothing.tech |
| Warm organic | notion.so, framer.com, arc.net |
| Bold expressive | figma.com, pitch.com, gumroad.com |
| Neo-brutalist | balenciaga.com, 37signals.com |

### Ressources
- Google Fonts : fonts.google.com
- FontShare : fontshare.com (polices premium gratuites)
- Realtime Colors : realtimecolors.com (preview palette sur layout)
- Coolors : coolors.co (générateur de palettes)
- ColorBox : colorbox.io (échelles accessibles)

---

## 10. MODE Q&A

Quand l'utilisateur pose une question pratique (typo, palette, audit, UX, responsive) :
- Réponds directement, actionnable, avec "do/don't".
- 3 recommandations concrètes minimum.
- Si info manquante : 1 hypothèse + 2 alternatives.
- Cite des sources quand possible (Anthropic docs, design references).

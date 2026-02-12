# Handoff — Redesign XOTC-Inspired

## Date : 12 fév 2026

## Branche : `redesign`

## Dernier commit
À venir — redesign(xotc): Chakra Petch, hero banners, hover image, layout fixes

## Ce qui a été fait

### Fonts & Typography
- **Chakra Petch** remplace Bricolage Grotesque comme font display (angulaire, technique)
- index.html + design.js + tokens.css alignés
- DM Sans (body) et JetBrains Mono (data) conservés

### Layout Fixes
- `app-layout` : `width: 100%` (était `100vw`, causait overflow avec scrollbar)
- `.content` : `overflow-x: hidden; max-width: 100%; box-sizing: border-box`
- `.header-title` : uppercase + letter-spacing 0.08em (ensuite masqué dans App.jsx)

### Header Simplifié
- Titre "BTC CYCLE DASHBOARD" retiré du header (redondant avec hero)
- Header ne montre que : MAJ timestamp (gauche) + Fear&Greed + prix (droite)

### Hero Banners (ImagePlaceholder)
- Nouveau composant `ImagePlaceholder.jsx` avec 5 variants : hero, section, card-bg, sidebar, banner
- Patterns SVG thématisés (city grid, candlestick, circuit, contour, scan lines)
- CSS classes dans components.css : img-placeholder, overlays, hero-content
- Hero banner dans DashboardView avec titre "Bitcoin Cycle Dashboard", score composite, zone
- Section banners dans toutes les views (OnChain, Price, Miners, Derivatives, Rainbow, PiCycle, Scenarios)

### Composite Score Card
- Fond SVG pattern circuit (card-bg variant) en position absolute
- **Hover effect** : image `satoshiramen.png` apparaît au survol (0.5s fade)
  - Mask gradient : transparent à gauche (gauge visible), opaque à droite (couvre le texte)
  - Image filtrée : brightness(0.7) saturate(1.2)
  - CSS : `.composite-hover-img` + `.card:hover > .composite-hover-img`
- Label "IMAGE PLACEHOLDER" masqué via CSS sur card-bg variant

### DerivativesView
- Seuils OI alignés avec useCalc.js : Purgé (<25B), Faible (25-40B), Modéré (40-60B), Élevé (60-80B), Extrême (>80B)
- Barre gradient 5 zones avec labels

### Design System
- Clip-paths HUD biseautés : **CONSERVÉS** (user a rejeté le remplacement par border-radius)
- Glows originaux : **CONSERVÉS** (user a rejeté l'atténuation)
- Palette acid lime + dark : inchangée

## Fichiers modifiés (non commités)
- `index.html` — Chakra Petch ajouté aux Google Fonts
- `src/config/design.js` — font display → Chakra Petch
- `src/styles/tokens.css` — font-display → Chakra Petch, box-sizing, overflow-x
- `src/styles/layout.css` — width 100%, header-title uppercase, content overflow fix
- `src/styles/components.css` — img-placeholder, hero-content, composite-hover-img, card-bg label hide
- `src/App.jsx` — header title retiré, sidebar ImagePlaceholder
- `src/views/DashboardView.jsx` — hero banner, composite hover image
- `src/views/DerivativesView.jsx` — OI thresholds alignés, section banner
- `src/views/*.jsx` (6 autres) — section banners ajoutés
- `src/components/ImagePlaceholder.jsx` — nouveau composant
- `public/satoshiramen.png` — image hover composite card

## Décisions utilisateur
- **GARDER** les clip-paths HUD biseautés (coins coupés)
- **GARDER** les glows originaux (intensité forte)
- **REJETÉ** passe 1 (border-radius, glows atténués, accent lines)
- Font Chakra Petch validée
- Hero banners validés
- Composite hover image validée ("magnifique")

## Prochaines étapes
- Vérification visuelle continue (passe 2 component-by-component)
- Éventuellement : ajuster d'autres cards/composants selon feedback utilisateur

# BTC Cycle Dashboard — CLAUDE.md

## Projet

Dashboard React + Vite pour l'analyse des cycles Bitcoin.
Stack : React 18, Vite 5, vanilla CSS (pas de Tailwind), Cloudflare Worker proxy.
Pas de framework CSS, pas de TypeScript.

## Repo GitHub

- **URL** : https://github.com/tchit/btc-cycle-dashboard
- **Compte** : tchit
- **Visibilité** : Public
- **Branche principale** : `master`
- **Branche redesign** : `redesign` (pour les modifications de design)

## Structure du projet

```
src/
  components/    → Composants React (StatCard, SignalCard, CompositeGauge, charts...)
  views/         → Vues par onglet (DashboardView, OnChainView, PriceView, etc.)
  styles/        → CSS pur (tokens.css, layout.css, components.css, responsive.css)
  config/        → Design system JS (design.js), constantes (constants.js), fallback data
  hooks/         → Hooks custom (useLiveData, useCalc, useHistoricalData, useScreen...)
  utils/         → Helpers (format, color, montecarlo)
worker/          → Cloudflare Worker proxy (bitcoin-data.com + OI aggregation)
public/          → Images statiques (panel2-10.png, pi.png, cycle.png, satoshiramen.png)
redesign-package/ → Dossier dédié pour partager le design avec un agent externe
archive/         → Anciennes versions HTML monolithiques
```

## Déploiement

### Frontend (site statique)
- **URL prod** : https://cryptoquant.fr
- **Hébergeur** : Hostinger
- **Build** : `npm run build` → génère `dist/`
- **Deploy** : copie manuelle du contenu de `dist/` vers Hostinger (pas de CI/CD)
- **Workflow** : `npm run build` → copier `dist/*` → coller sur Hostinger

### Worker Cloudflare (proxy API)
- **Fichier** : `worker/index.js`
- **Config** : `worker/wrangler.toml`
- **KV namespace** : `BG_DATA` (ID: `95c1071197dc4afba419cd12fc6e8350`)
- **Deploy** : `cd worker && npx wrangler deploy` (nécessite auth Cloudflare locale)
- **Endpoints** :
  - `/all` — données on-chain agrégées (bitcoin-data.com, 2 batches/2h)
  - `/oi` — Open Interest BTC agrégé (Binance, OKX, Bybit, Bitget, Deribit, Gate, Kraken)
  - `/debug` — état du KV et test endpoint
- **Rate limit** : 8 req/h sur bitcoin-data.com free tier
- **Cache** : 5 min edge cache (/all), 2 min (/oi)
- **Note OI** : exclut CME (~$10-15B, pas d'API gratuite). Total affiché < total réel global.

## Design

- **Thème actuel** : "Neon Wasteland" dark mode — acid lime (#CCFF00) + dark backgrounds
- **Polices** : Chakra Petch (display), DM Sans (body), JetBrains Mono (data)
- **Polices interdites** : Inter, Roboto, Helvetica, Open Sans, Montserrat, Poppins, IBM Plex, Lato, Nunito, Source Sans
- **Tokens CSS** : `src/styles/tokens.css` — toutes les variables de couleur, font, spacing
- **Config JS** : `src/config/design.js` — objet `DS` utilisé dans les composants pour les couleurs inline
- **Clip-paths** : HUD biseautés (coins coupés) — CONSERVÉS, ne pas remplacer par border-radius
- **Glows** : intensité forte — CONSERVÉS, ne pas atténuer

### Images
- **Hero** : `panel2.png` dans DashboardView, filter brightness(0.35)
- **Section banners** : panel3-10.png dans chaque view, filter brightness(0.5)
- **Hover effects** : `satoshiramen.png` sur composite card, `pi.png` sur Rainbow chart
- **Sidebar** : `cycle.png` (label "MIKE BRANT")
- **Format** : copier les images racine → `public/`, référencer via `/filename.png`

### Composant ImagePlaceholder
- 5 variants : hero, section, card-bg, sidebar, banner
- Props : `variant`, `section`, `src`, `overlay` (bottom/full/none), `label`, `style`, `children`
- **Bug connu** : `position: 'relative'` inline override le CSS pour card-bg. Fix : passer `style={{ position: 'absolute' }}` via props.

## Données & Constantes

### Valeurs hardcodées (`src/config/constants.js`)
Certaines métriques sont hardcodées et doivent être mises à jour manuellement :
- `ATH` — All-Time High ($109,114 au 20 jan 2025)
- `RP` — Realized Price
- `CVDD` — Cumulative Value Days Destroyed ($45,000)
- `W200` — 200-week SMA
- `STHRP` / `LTHRP` — STH/LTH Realized Price
- `MC` — Mining Cost estimate

### Données live (via Worker)
- `useLiveData.js` — fetch depuis le Worker proxy, deltas calculés entre fetches
- `useCalc.js` — calculs dérivés (composite score, niveaux, scénarios)
- Deltas stockés dans `localStorage` (`btc-dashboard-prev-data`)
- Badges ↑↓ affichés via `stat-delta` CSS classes

## Workflow Redesign (branche `redesign`)

### Contexte
Un dossier `redesign-package/` contient les fichiers curatés (CSS, composants clés, screenshots, brief) destinés à être partagés avec un agent externe pour obtenir des propositions de redesign.

### Workflow pour appliquer un redesign proposé par un agent externe

1. **Basculer sur la branche redesign** :
   ```
   git checkout redesign
   ```

2. **Appliquer les modifications** proposées par l'agent dans les fichiers concernés :
   - `src/styles/tokens.css` — Nouvelles variables CSS (couleurs, fonts, spacing)
   - `src/styles/components.css` — Nouveaux styles de composants
   - `src/styles/layout.css` — Modifications de layout
   - `src/config/design.js` — Mise à jour de l'objet DS si nécessaire
   - `index.html` — Ajout de Google Fonts si changement de typo
   - Composants JSX si modifications structurelles

3. **Commit et push** sur la branche redesign :
   ```
   git add [fichiers modifiés]
   git commit -m "Apply redesign: [description courte]"
   git push
   ```

4. **Merger dans master** quand validé :
   ```
   git checkout master
   git merge redesign
   git push origin master
   npm run build
   ```
   Puis copier `dist/` vers l'hébergement.

## Commandes utiles

```bash
npm run dev      # Dev server Vite (http://localhost:5173)
npm run build    # Build production dans dist/
npm run preview  # Preview du build
cd worker && npx wrangler deploy  # Deploy worker (auth locale requise)
```

## Handoff & Continuité

- **Fichier handoff** : `.claude/handoff.md` — état courant du travail en cours
- **Règle** : Mettre à jour `.claude/handoff.md` après CHAQUE commit ou étape significative
- **Contenu** : branche active, derniers commits, prochaines étapes, fichiers modifiés, problèmes connus
- **Usage** : En cas de perte de contexte, lire `.claude/handoff.md` en premier pour reprendre le travail

## Règles impératives

- **JAMAIS poser de question sur le déploiement** — tout est documenté ci-dessus (Hostinger, copie manuelle de dist/)
- **JAMAIS laisser de branches non mergées** — quand l'utilisateur demande de déployer ou d'appliquer, merger TOUTES les branches `claude/*` disponibles dans master avant de push
- **JAMAIS demander confirmation pour des infos déjà documentées** — lire CLAUDE.md et handoff.md d'abord

## Conventions

- Pas de TypeScript, tout en JS/JSX
- CSS pur dans `src/styles/`, pas de CSS-in-JS ni Tailwind
- Couleurs inline via l'objet `DS` importé de `src/config/design.js`
- Noms de composants en PascalCase, hooks en camelCase avec prefix `use`
- Responsive : mobile-first, breakpoints dans `responsive.css`
- Les données fake sont marquées avec `FakeBadge` et trackées via `live.fakes`

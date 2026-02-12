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
  config/        → Design system JS (design.js), constantes, fallback data
  hooks/         → Hooks custom (useLiveData, useCalc, useHistoricalData, useScreen...)
  utils/         → Helpers (format, color, montecarlo)
worker/          → Cloudflare Worker proxy pour bitcoin-data.com (8 req/h free tier)
redesign-package/ → Dossier dédié pour partager le design avec un agent externe
archive/         → Anciennes versions HTML monolithiques
```

## Design

- **Guidelines** : `design-guidelines.md` à la racine — document de référence pour tout choix de design
- **Polices interdites** : Inter, Roboto, Helvetica, Open Sans, Montserrat, Poppins, IBM Plex, Lato, Nunito, Source Sans
- **Tokens CSS** : `src/styles/tokens.css` — toutes les variables de couleur, font, spacing
- **Config JS** : `src/config/design.js` — objet `DS` utilisé dans les composants pour les couleurs inline
- **Direction souhaitée** : "Cinematic Dark + Swiss Grid" — voir BRIEF-REDESIGN.md

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

4. **Créer une PR** `redesign → master` pour visualiser le diff :
   ```
   gh pr create --base master --head redesign --title "Redesign: [titre]" --body "..."
   ```

5. **Tester en local** :
   ```
   npm run dev
   ```
   Comparer visuellement en switchant entre les branches.

6. **Si OK** : merger la PR. **Sinon** : itérer sur la branche redesign.

### Comparer les deux designs en local
- `git checkout master` → `npm run dev` → ancien design
- `git checkout redesign` → `npm run dev` → nouveau design

## Commandes utiles

```bash
npm run dev      # Dev server Vite (http://localhost:5173)
npm run build    # Build production dans dist/
npm run preview  # Preview du build
```

## Worker Cloudflare

- Fichier : `worker/index.js`
- Config : `worker/wrangler.toml`
- Deploy : `npx wrangler deploy` (depuis le dossier worker/)
- Rate limit : 8 req/h sur bitcoin-data.com free tier
- Cache : 1h via Cloudflare Cache API

## Handoff & Continuité

- **Fichier handoff** : `.claude/handoff.md` — état courant du travail en cours
- **Règle** : Mettre à jour `.claude/handoff.md` après CHAQUE commit ou étape significative
- **Contenu** : branche active, derniers commits, prochaines étapes, fichiers modifiés, problèmes connus
- **Usage** : En cas de perte de contexte, lire `.claude/handoff.md` en premier pour reprendre le travail

## Conventions

- Pas de TypeScript, tout en JS/JSX
- CSS pur dans `src/styles/`, pas de CSS-in-JS ni Tailwind
- Couleurs inline via l'objet `DS` importé de `src/config/design.js`
- Noms de composants en PascalCase, hooks en camelCase avec prefix `use`
- Responsive : mobile-first, breakpoints dans `responsive.css`
- Les données fake sont marquées avec `FakeBadge` et trackées via `live.fakes`

# Handoff — BTC Cycle Dashboard

## Date : 15 fév 2026

## Branche active : `master` (prod)

## URL prod : https://cryptoquant.fr (Hostinger, copie manuelle de dist/)

## Derniers commits (master)

- `7f0336c` merge: check-open-interest-hardcoded + OI worker improvements
- `9383925` redesign(xotc-v2): panel images, hover effects, sidebar contrast boost
- `ca46e36` feat: show data value changes (deltas) since last fetch
- `82780b0` chore: update package-lock.json after npm install

## État actuel

### Frontend
- Toutes les views ont des section banners avec images réelles (panel2-10.png)
- Hero dashboard avec panel2.png (brightness 0.35)
- Hover effects : satoshiramen.png (composite card) + pi.png (rainbow chart)
- Sidebar : image cycle.png, label "MIKE BRANT", contraste amélioré (gradient bg, accent logo, section dividers)
- Stat values responsive avec clamp() pour éviter overflow
- Deltas (↑↓ badges) sur toutes les StatCard/SignalCard/FearGreedCard

### Worker Cloudflare
- `/all` : 16 endpoints bitcoin-data.com en 2 batches (rotation 1h)
- `/oi` : OI agrégé depuis 9 sources (Binance USDT+coin, OKX×2, Bybit, Bitget, Deribit, Gate, Kraken)
- `terminal-price` ajouté au batch 1 pour dériver CVDD
- KV ID configuré : `95c1071197dc4afba419cd12fc6e8350`
- Note : Bitget/Deribit retournent parfois 0 depuis CF Workers (géo-block). Total OI ~$11-16B (exclut CME ~$10-15B).

### Constantes hardcodées (`src/config/constants.js`)
- CVDD = $45,000 (à vérifier/mettre à jour périodiquement)
- ATH = $109,114 (20 jan 2025)
- RP, W200, STHRP, LTHRP, MC — vérifier si à jour

## Branches en cours

- `redesign` — même état que master (mergé)
- `claude/check-open-interest-hardcoded-JasCQ` — mergé dans master
- `claude/show-data-value-changes-O9wEi` — mergé dans master
- `claude/locate-realized-price-kRPmF` — non mergé, à vérifier

## Problèmes connus

1. **OI sous-estimé** : ~$11-16B au lieu de ~$30-40B réels (CME absent, Bitget/Deribit parfois bloqués depuis CF Workers)
2. **ImagePlaceholder bug** : `position: 'relative'` inline override CSS pour card-bg variant
3. **Constantes hardcodées** : CVDD, RP, W200 etc. ne se mettent pas à jour automatiquement
4. **Worker auth** : `npx wrangler deploy` doit être lancé depuis le terminal local (pas depuis Claude Code, pas de CLOUDFLARE_API_TOKEN configuré)

## Deploy checklist

### Frontend
1. `npm run build`
2. Copier `dist/*` vers Hostinger (cryptoquant.fr)

### Worker
1. `cd worker && npx wrangler deploy` (depuis terminal local authentifié)

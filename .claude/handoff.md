# Handoff — BTC Cycle Dashboard

## Date : 15 fév 2026

## Branche active : `master` (prod)

## URL prod : https://cryptoquant.fr (Hostinger, copie manuelle de dist/)

## Worker URL : https://bg-proxy.sv9ch954y9.workers.dev

## Derniers commits (master)

- `7634166` docs: update CLAUDE.md and handoff with deploy info + rules
- `a916236` Merge remote-tracking branch 'origin/claude/locate-realized-price-kRPmF'
- `7f0336c` Merge branch 'claude/check-open-interest-hardcoded-JasCQ'
- `d7cfa95` fix(worker): improve OI aggregation with more exchanges + KV ID
- `ca46e36` feat: show data value changes (deltas) since last fetch
- `9383925` redesign(xotc-v2): panel images, hover effects, sidebar contrast boost

## État actuel

### Frontend
- Toutes les views ont des section banners avec images réelles (panel2-10.png)
- Hero dashboard avec panel2.png (brightness 0.35)
- Hover effects : satoshiramen.png (composite card) + pi.png (rainbow chart)
- Sidebar : image cycle.png, label "MIKE BRANT", contraste amélioré (gradient bg, accent logo, section dividers)
- Stat values responsive avec clamp() pour éviter overflow
- Deltas (↑↓ badges) sur toutes les StatCard/SignalCard/FearGreedCard
- 10 onglets : dashboard, onchain, price, rainbow, picycle, miners, derivatives, scenarios, connectors, tradingview

### Worker Cloudflare
- `/all` : 17 endpoints bitcoin-data.com en 2 batches (rotation 1h, 8 req/h free tier)
- `/oi` : OI agrégé depuis 9 sources (Binance USDT+coin, OKX×2, Bybit, Bitget, Deribit, Gate, Kraken)
- `/debug` : état du KV et test endpoint
- `terminal-price` ajouté au batch 1 pour dériver CVDD
- KV ID configuré : `95c1071197dc4afba419cd12fc6e8350`
- Cron trigger : toutes les heures (`0 * * * *`)
- Note : Bitget/Deribit retournent parfois 0 depuis CF Workers (géo-block). Total OI ~$11-16B (exclut CME ~$10-15B).

### Constantes hardcodées (`src/config/constants.js`)
- ATH = $126,198 (6 oct 2025)
- RP = $55,182 | CVDD = $46,261 | W200 = $57,926 | MC = $58,096
- STHRP = $72,000 | LTHRP = $38,000
- MA111 = $90,000 | MA2Y = $75,000
- SUPPLYTOTAL = 19,800,000 BTC

## Branches

| Branche | Statut |
|---|---|
| `master` | Branche prod active |
| `redesign` | Mergée dans master, en retard de 5 commits |
| `claude/check-open-interest-hardcoded-JasCQ` | Mergée dans master |
| `claude/show-data-value-changes-O9wEi` | Mergée dans master |
| `claude/locate-realized-price-kRPmF` | Mergée dans master |
| `agent-redesign` | NON mergée — ancien essai de thème light "Cool Studio", obsolète |

## Problèmes connus

1. **OI sous-estimé** : ~$11-16B au lieu de ~$30-40B réels (CME absent, Bitget/Deribit parfois bloqués depuis CF Workers)
2. **ImagePlaceholder bug** : `position: 'relative'` inline override CSS pour card-bg variant
3. **Constantes hardcodées** : les valeurs dans constants.js ne se mettent pas à jour automatiquement
4. **Worker auth** : `npx wrangler deploy` doit être lancé depuis le terminal local (pas depuis Claude Code, pas de CLOUDFLARE_API_TOKEN configuré)
5. **Branche redesign en retard** : doit être sync avec master avant d'y travailler

## Deploy checklist

### Frontend
1. `npm run build`
2. Copier `dist/*` vers Hostinger (cryptoquant.fr)

### Worker
1. `cd worker && npx wrangler deploy` (depuis terminal local authentifié)

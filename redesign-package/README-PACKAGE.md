# Package Redesign — BTC Cycle Dashboard

## 🎯 Objectif
Redesigner le dashboard Bitcoin selon les règles du `design-guidelines.md`.

## 📂 Contenu du package
- `BRIEF-REDESIGN.md` : Contexte, contraintes, direction souhaitée
- `design-guidelines.md` : Règles premium (typographie, couleurs, anti-patterns)
- `current-design/` : CSS et config actuels
- `components/` : Composants React à redesigner
- `screenshots/` : Rendus visuels actuels

## 🚀 Livrables attendus
1. Nouvelle palette de couleurs (CSS variables complètes)
2. Pairing typographique avec rationnels
3. CSS redesigné pour `.stat-card`, `.signal-card`, `.card`, `.sidebar`
4. Proposition de layout amélioré
5. Mockup visuel ou description détaillée des changements

## ⚠️ Contraintes
- Google Fonts uniquement
- WCAG AA minimum
- Éviter les polices interdites (cf. guidelines §2)
- Pas de blanc pur (#FFF) ni noir pur (#000)
- Pas de "AI cards" génériques (shadow-lg + border-radius)

## 📋 Direction
Style cible : **"Cinematic Dark + Swiss Grid"**
Inspirations : linear.app, vercel.com, nothing.tech

Merci de lire `BRIEF-REDESIGN.md` avant de commencer !

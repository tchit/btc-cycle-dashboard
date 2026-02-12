# Handoff — Redesign Contraste Max

## Date : 12 fév 2026

## Branche : `redesign`

## Objectif en cours
Boost contraste du Neon Wasteland : blanc pur, acid lime (#CCFF00), fonts V2 (Bricolage Grotesque + DM Sans).
Référence visuelle : design noir pur / blanc pur / lime acide (image fournie par user).

## État actuel
- 3 commits Neon Wasteland sur `redesign` (steps 1-10)
- Modifications non-commitées : Syne→Orbitron dans tokens.css/design.js/index.html (à écraser)
- Le build passe (`npm run build` OK)

## Ce qui reste à faire
1. **tokens.css** : palette contraste max (blanc #FFF, lime #CCFF00, text boosted), fonts V2, type scale up
2. **design.js** : DS + DSCard alignés sur nouvelle palette
3. **index.html** : Google Fonts → Bricolage Grotesque + DM Sans + JetBrains Mono
4. **JSX grep** : remplacer tous les #00FFC6 / rgba(0,255,198,...) hardcodés par lime
5. **Build + commit**

## Décisions prises
- Direction : Acid Lime + V2 fonts (Bricolage Grotesque display, DM Sans body)
- PAS de white cards (rester dark-on-dark mais avec plus de séparation)
- PAS de full V2 brief (pas de glassmorphism sidebar, pas d'ImageSlot)

## Fichiers clés
- `src/styles/tokens.css` — variables CSS
- `src/config/design.js` — DS/DSCard objets inline styles
- `index.html` — Google Fonts links
- `BRIEF-REDESIGN-V2.md` — brief de référence (sections 2-3 pour palette/typo)

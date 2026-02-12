# 📦 Composants Essentiels à Partager pour le Redesign

## 🎯 PACKAGE MINIMAL (OBLIGATOIRE)

### 1️⃣ Design System & Guidelines

**Fichiers à uploader :**
```
✅ design-guidelines.md          (règles de design premium)
✅ BRIEF-REDESIGN.md             (ce document de brief personnalisé)
✅ src/styles/tokens.css         (variables CSS actuelles)
✅ src/config/design.js          (config couleurs JS)
```

**Pourquoi** : L'agent doit connaître vos règles (polices interdites, anti-patterns) et votre palette actuelle pour proposer une évolution cohérente.

---

### 2️⃣ Structure & Layout

**Fichiers à uploader :**
```
✅ src/App.jsx                   (structure principale : sidebar + header + tabs)
✅ src/styles/layout.css         (sidebar, header, main-content, responsive)
✅ src/styles/components.css     (tous les composants : cards, stats, signals, etc.)
```

**Pourquoi** : Montre l'architecture actuelle (sidebar fixe 240px, header 72px, grilles) et les styles de base à réinventer.

---

### 3️⃣ Composants Clés (React)

**Fichiers à uploader :**
```
✅ src/components/StatCard.jsx        (les 4 cards en haut : Prix, MVRV, F&G, Distance ATH)
✅ src/components/SignalCard.jsx      (cards compactes avec badges BULL/BEAR)
✅ src/components/CompositeGauge.jsx  (gauge canvas animé avec needle)
✅ src/views/DashboardView.jsx        (vue principale avec disposition des composants)
```

**Pourquoi** : Ce sont les 4 composants les plus visibles et les plus critiques à redesigner.

---

### 4️⃣ Exemples de Vues Secondaires (optionnel mais utile)

**Fichiers à uploader (si vous voulez un redesign complet) :**
```
⚪ src/views/OnChainView.jsx         (vue On-Chain avec grilles de métriques)
⚪ src/views/PriceView.jsx           (historique prix + bands)
⚪ src/components/MiniGauge.jsx      (petites jauges sous le composite)
⚪ src/components/BottomScoreCard.jsx (décomposition du score bottom)
```

**Pourquoi** : Permet à l'agent de voir la variété des layouts et proposer des optimisations transversales.

---

## 📸 SCREENSHOTS (CRITIQUE !)

### Captures d'écran OBLIGATOIRES

**À prendre et inclure dans le package :**

1. **Dashboard complet (desktop)** : `screenshot-dashboard-desktop.png`
   → Vue d'ensemble avec les 4 stat cards + composite gauge + signal cards + charts

2. **Vue mobile/responsive** : `screenshot-dashboard-mobile.png`
   → Sidebar burger ouvert + grille stat cards en 1 colonne

3. **Détail composants** : `screenshot-composants-detail.png`
   → Zoom sur une stat card + une signal card côte à côte pour voir bordures/ombres/typo

4. **Sidebar & Navigation** : `screenshot-sidebar.png`
   → Sidebar complète avec logo, sections, items actifs, footer status

5. **Charts exemple** (optionnel) : `screenshot-charts.png`
   → Un exemple de chart (Rainbow, Price History, ou Pi Cycle) pour voir la palette

**Comment les prendre** :
- Ouvrir le dashboard en local (`npm run dev`)
- Fullscreen browser (F11)
- Captures haute résolution (pas de compression)
- Annoter les problèmes si besoin (Figma/Photoshop ou simplement des flèches)

---

## 🗂️ STRUCTURE DU DOSSIER À ZIPPER

**Créer ce dossier `redesign-package/` et l'envoyer à l'agent :**

```
redesign-package/
│
├── 📄 BRIEF-REDESIGN.md                    (brief détaillé)
├── 📄 design-guidelines.md                 (règles premium)
│
├── 📁 current-design/
│   ├── tokens.css                          (variables actuelles)
│   ├── layout.css                          (structure sidebar/header)
│   ├── components.css                      (tous les styles de composants)
│   ├── responsive.css                      (media queries)
│   └── design.js                           (config JS)
│
├── 📁 structure/
│   └── App.jsx                             (layout principal)
│
├── 📁 components/
│   ├── StatCard.jsx                        (card stat)
│   ├── SignalCard.jsx                      (card signal)
│   ├── CompositeGauge.jsx                  (gauge)
│   ├── MiniGauge.jsx                       (mini gauges)
│   ├── BottomScoreCard.jsx                 (score breakdown)
│   ├── InfoTip.jsx                         (tooltip)
│   └── FakeBadge.jsx                       (fallback indicator)
│
├── 📁 views/
│   ├── DashboardView.jsx                   (vue principale)
│   ├── OnChainView.jsx                     (exemple autre vue)
│   └── PriceView.jsx                       (exemple charts)
│
├── 📁 screenshots/
│   ├── screenshot-dashboard-desktop.png    (vue complète desktop)
│   ├── screenshot-dashboard-mobile.png     (responsive mobile)
│   ├── screenshot-composants-detail.png    (zoom cards)
│   ├── screenshot-sidebar.png              (navigation)
│   └── screenshot-charts.png               (graphiques)
│
└── 📄 README-PACKAGE.md                    (instructions pour l'agent)
```

**Taille estimée du ZIP** : 2-5 MB (avec screenshots haute résolution)

---

## ✍️ Contenu du README-PACKAGE.md

Créer un petit fichier `README-PACKAGE.md` dans le ZIP pour guider l'agent :

```markdown
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
```

---

## 🎨 PROMPT À ENVOYER À L'AGENT

**Copier/coller ce prompt avec le ZIP :**

```
Je veux un redesign complet de mon dashboard Bitcoin selon mes guidelines premium.

📦 FICHIERS FOURNIS :
- design-guidelines.md : mes règles de design (polices interdites, anti-patterns, thèmes)
- BRIEF-REDESIGN.md : contexte du projet, design actuel, objectifs, contraintes
- current-design/ : tokens.css, layout.css, components.css (styles actuels)
- components/ : StatCard, SignalCard, CompositeGauge, etc. (React)
- screenshots/ : 5 captures d'écran du rendu actuel

🎯 STYLE CIBLE : "Cinematic Dark + Swiss Grid"
Mood : Bloomberg Terminal moderne, NASA control room élégante, data-dense premium

🚀 LIVRABLES ATTENDUS :
1. Nouvelle palette de couleurs (CSS variables complètes avec rationnels)
2. Pairing typographique audacieux (Serif Display pour chiffres + Sans UI)
3. CSS redesigné pour :
   - .stat-card (les 4 cards en haut)
   - .signal-card (badges BULL/BEAR compacts)
   - .card (container principal)
   - .sidebar (navigation gauche)
4. Proposition de layout amélioré (gaps, spacing, micro-animations hover)
5. Mockup visuel (Figma/screenshot) OU description ultra-détaillée

🚫 CONTRAINTES CRITIQUES :
- Polices INTERDITES : Inter, Roboto, IBM Plex, Montserrat, Poppins (cf. guidelines §2)
- ÉVITER : blanc pur (#FFF), noir pur (#000), cards shadow-lg standard
- ACCESSIBILITÉ : WCAG AA minimum (contraste 4.5:1)
- BUDGET : Google Fonts uniquement

💡 QUESTIONS SI NÉCESSAIRE :
- Faut-il inverser light/dark (dark dominant) ?
- Accent orange (#F97316) : conserver ou proposer alternatives ?
- Sidebar : fixed pleine hauteur ou floater en "pill" ?

Merci de lire attentivement `design-guidelines.md` et `BRIEF-REDESIGN.md` avant de proposer !
Justifie chaque choix (pourquoi cette typo, pourquoi ces couleurs, pourquoi ces spacing).
```

---

## 📌 RÉCAPITULATIF

### Fichiers absolument obligatoires (12 fichiers)

**Documents :** (3)
1. `BRIEF-REDESIGN.md`
2. `design-guidelines.md`
3. `README-PACKAGE.md`

**Styles :** (4)
4. `tokens.css`
5. `layout.css`
6. `components.css`
7. `design.js`

**Composants :** (5)
8. `App.jsx`
9. `StatCard.jsx`
10. `SignalCard.jsx`
11. `CompositeGauge.jsx`
12. `DashboardView.jsx`

**Screenshots :** (minimum 3, idéal 5)
13-17. Dashboard desktop, mobile, détails, sidebar, charts

---

## ⚡ NEXT STEPS

1. ✅ Lire ce document
2. 📸 Prendre les screenshots du dashboard actuel
3. 📁 Créer le dossier `redesign-package/` avec la structure ci-dessus
4. 🗜️ Zipper le tout
5. 📤 Envoyer le ZIP + le prompt à l'agent (Claude, GPT, Perplexity Space, etc.)
6. ⏳ Attendre la proposition de redesign
7. ✍️ Itérer sur les ajustements (palette, typo, spacing)

---

*Document de référence pour le package de redesign — BTC Cycle Dashboard*

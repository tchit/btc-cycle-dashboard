# Rapport d'echec — Redesign "Degen Arcade" (Fevrier 2026)

## Mea Culpa

J'ai echoue a livrer le redesign demande. Le resultat etait un dark mode generique et casse, pas le "Electric Playground" promis par le brief. Je m'en excuse. Voici l'analyse honnete de ce qui s'est passe.

---

## Ce qui etait demande

Le brief BRIEF-REDESIGN-V2.md decrivait une transformation radicale :
- Dark mode navy-black (#0A0E1A) avec cartes blanches flottantes
- Trio d'accents polychromes (Electric Blue, Acid Lime, Coral Red)
- Sidebar glassmorphique flottante (dock arrondi, collapse/expand on hover)
- Gauge 320px avec arc SVG 270deg, gradient dynamique, spring animation
- Typographie massive (80px gauge, 56px prix, 40px titres)
- Key Signals en grille 2xN de tuiles colorees
- ImageSlot (art generatif SVG) en background de cartes
- Grain overlay, stagger animations, hover spring

Le tout devait donner l'impression d'un "pitch.com meets linear.app meets trading terminal" — un dashboard ou un enfant de 7 ans veut rester.

## Ce qui a ete livre

Un dark mode corporate avec des bugs visuels majeurs. Le resultat ressemblait a un theme sombre applique mecaniquement, sans ame ni "wow factor".

---

## Erreurs identifiees

### 1. Systeme de tokens dual (DS/DSCard) mal applique — CRITIQUE

**Le probleme** : La plus grosse erreur architecturale. J'ai cree un systeme dual `DS` (fond sombre) / `DSCard` (cartes blanches) pour gerer les deux contextes de couleur. Mais le CSS utilisait aussi des variables (`--text-primary`, `--border-light`) qui pointaient vers les valeurs dark par defaut. Il fallait les overrider via des selecteurs scopes dans components.css.

**La consequence** : Des composants entiers (KeySignals, tiles de signaux) avaient du texte blanc (#F0F2F7) affiche sur fond blanc (#FFFFFF). Les borders etaient invisibles (rgba blanc sur fond blanc). Les backgrounds de tiles utilisaient des couleurs navy sombres (#141B2E) a l'interieur de cartes blanches.

**Ce qui aurait du etre fait** : Tester visuellement chaque composant apres la migration. Verifier systematiquement que CHAQUE selecteur CSS qui utilise `--text-primary`, `--border-light`, `--bg-surface` a l'interieur d'une carte blanche avait ete scope correctement. J'ai scope `.card`, `.stat-card`, `.composite-card`, `.kpi-card`, `.signal-card` mais j'ai oublie `.key-signals`.

### 2. Migration DS->DSCard par batch automatise sans verification visuelle

**Le probleme** : J'ai lance 4 agents en parallele pour migrer ~27 fichiers de `DS.text` vers `DSCard.text`. Chaque agent a verifie que le `vite build` passait, mais AUCUN n'a verifie visuellement le rendu. Un build qui compile ne veut pas dire un design qui fonctionne.

**La consequence** : Les bugs de couleur ont ete introduits massivement et systematiquement. Le build passait (zero erreurs JS) mais le rendu visuel etait casse.

**Ce qui aurait du etre fait** : Apres chaque phase, lancer le dev server et verifier visuellement. Au minimum, prendre des screenshots et les analyser. La verification par `vite build` seul est insuffisante pour du travail de design.

### 3. ImageSlot sur carte hero sans controle d'opacite

**Le probleme** : Le composant ImageSlot (art generatif SVG) etait rendu dans la carte Prix Actuel (variant hero) sans prop `opacity`. Les blobs SVG internes avaient une opacite de 0.22, ce qui rendait le mesh gradient tres visible sur le fond blanc de la carte.

**La consequence** : La carte Prix Actuel avait un aspect "sale", avec un gradient colore qui genait la lisibilite du prix.

**Le brief disait** : "opacity={0.12} — 0.08 sur cartes blanches, 0.20 sur dark/glass". Cette spec n'a pas ete suivie.

### 4. Approche "big bang" au lieu d'incrementale

**Le probleme** : J'ai tente de tout transformer en une seule passe massive (7 phases, 30+ fichiers). Chaque phase dependait de la precedente, mais je n'ai jamais valide visuellement entre les phases.

**La consequence** : Les bugs se sont accumules. A la fin, le resultat etait si loin du brief qu'un simple "hotfix" ne suffisait plus.

**Ce qui aurait du etre fait** : Travailler par composant isole. D'abord la sidebar, la valider visuellement. Puis les stat cards. Puis la gauge. Etc. A chaque etape, comparer avec le brief.

### 5. Confusion entre "compile" et "fonctionne"

**Le probleme** : A chaque phase, la verification etait "le build passe". Ce n'est pas un critere de qualite pour du design.

**Ce qui aurait du etre fait** : Criteres de validation par phase :
- Phase tokens : body background est #0A0E1A ? Texte est lisible ?
- Phase layout : sidebar flotte ? Glassmorphism visible ? Collapse/expand marche ?
- Phase cards : cartes blanches sur dark ? Shadows visibles ? Scotch bars presentes ?
- Phase gauge : 320px ? Arc 270deg ? Gradient correct ? Spring animation ?
- Etc.

### 6. Le resultat ne "raconte pas une histoire"

Au-dela des bugs techniques, le design manquait d'ame. Le brief demandait "agence de comm meets trading firm meets crazy startup meets degens". Le resultat etait "dark mode corporate avec des variables CSS changees". Il n'y avait pas de:
- Hierarchie visuelle forte (le prix devrait SAUTER aux yeux)
- Contraste dramatique (les ombres etaient timides)
- Sensation de profondeur (les cartes ne "flottaient" pas)
- Element "wow" (la gauge etait correcte mais pas spectaculaire)

---

## Bilan chiffre

| Metrique | Valeur |
|----------|--------|
| Fichiers modifies | 31 |
| Fichiers crees | 4 |
| Lignes de CSS modifiees | ~800 |
| Composants migres DS->DSCard | 27 |
| Bugs visuels critiques identifies | 5 |
| Tests visuels effectues | 0 |
| Phases validees visuellement | 0/7 |

---

## Lecons pour la prochaine tentative

1. **Travailler par composant, pas par fichier** — Un composant = design + code + validation visuelle
2. **Valider visuellement apres CHAQUE changement** — Pas juste "build OK"
3. **Commencer par les elements les plus visibles** — Sidebar, Prix card, Gauge. Si ces 3 sont bons, le reste suit.
4. **Prototyper le systeme de couleurs AVANT de migrer** — Creer une page de test avec tous les contextes (dark bg, white card, glass card) et verifier que chaque variable rend correctement
5. **Ne pas paralleliser les migrations visuelles** — Le batch par agents est efficace pour du refactoring logique, pas pour du design ou chaque pixel compte
6. **Limiter la portee** — Mieux vaut 3 composants parfaits que 30 composants casses

---

## Etat actuel

Tous les fichiers ont ete restaures a la version `master` (Prism v2 light mode). Le brief BRIEF-REDESIGN-V2.md reste disponible comme reference pour une future tentative.

---

*Rapport redige le 12 fevrier 2026*

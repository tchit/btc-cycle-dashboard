@echo off
echo ========================================
echo Creation du package redesign
echo ========================================
echo.

REM Créer la structure de dossiers
mkdir redesign-package 2>nul
mkdir redesign-package\current-design 2>nul
mkdir redesign-package\structure 2>nul
mkdir redesign-package\components 2>nul
mkdir redesign-package\views 2>nul
mkdir redesign-package\screenshots 2>nul

echo [1/5] Copie des documents...
copy BRIEF-REDESIGN.md redesign-package\ >nul
copy design-guidelines.md redesign-package\ >nul
copy README-PACKAGE.md redesign-package\ >nul

echo [2/5] Copie des styles...
copy src\styles\tokens.css redesign-package\current-design\ >nul
copy src\styles\layout.css redesign-package\current-design\ >nul
copy src\styles\components.css redesign-package\current-design\ >nul
copy src\styles\responsive.css redesign-package\current-design\ >nul
copy src\config\design.js redesign-package\current-design\ >nul

echo [3/5] Copie de la structure...
copy src\App.jsx redesign-package\structure\ >nul

echo [4/5] Copie des composants...
copy src\components\StatCard.jsx redesign-package\components\ >nul
copy src\components\SignalCard.jsx redesign-package\components\ >nul
copy src\components\CompositeGauge.jsx redesign-package\components\ >nul
copy src\components\MiniGauge.jsx redesign-package\components\ >nul
copy src\components\BottomScoreCard.jsx redesign-package\components\ >nul
copy src\components\InfoTip.jsx redesign-package\components\ >nul
copy src\components\FakeBadge.jsx redesign-package\components\ >nul

echo [5/5] Copie des vues...
copy src\views\DashboardView.jsx redesign-package\views\ >nul
copy src\views\OnChainView.jsx redesign-package\views\ >nul
copy src\views\PriceView.jsx redesign-package\views\ >nul

echo.
echo ========================================
echo Package cree avec succes !
echo ========================================
echo.
echo Dossier : redesign-package\
echo.
echo PROCHAINES ETAPES :
echo 1. Prendre 5 screenshots et les placer dans redesign-package\screenshots\
echo    - screenshot-dashboard-desktop.png
echo    - screenshot-dashboard-mobile.png
echo    - screenshot-composants-detail.png
echo    - screenshot-sidebar.png
echo    - screenshot-charts.png
echo.
echo 2. Verifier le contenu du dossier redesign-package\
echo.
echo 3. Zipper le dossier redesign-package\ en redesign-package.zip
echo.
echo 4. Envoyer le ZIP + le prompt (voir COMPOSANTS-A-PARTAGER.md)
echo.
pause

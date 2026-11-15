# Dossier de soumission — Mission Architect

## 1. Le problème

Comprendre une mission spatiale demande de relier des contraintes qui s'opposent : masse, budget,
énergie, fiabilité et objectifs scientifiques. Un cours linéaire montre ces contraintes séparément ;
un jeu permet de les ressentir ensemble, avec des conséquences immédiates.

## 2. Notre solution

**Mission Architect** est un jeu navigateur où le joueur :

1. choisit une mission et un lanceur ;
2. assemble un satellite à partir de 9 modules aux caractéristiques réelles (masse, coût, énergie,
   capacité de batterie, observations, transmission, fiabilité) ;
3. arbitre pendant 30 jours entre production d'observations, économie d'énergie et transmission ;
4. découvre le score de sa conception et peut la corriger.

Le jeu ne récompense pas la performance d'arcade mais la **qualité de l'ingénierie** : un satellite
surdimensionné épuise le budget, un satellite trop léger manque d'énergie, une caméra trop gourmande
vide la batterie pendant les passages dans l'ombre.

## 3. Ce qui rend le projet solide

- **Modèle déterministe et testé** : logique pure séparée de l'UI, 54 tests automatisés (Vitest),
  y compris une simulation complète de 30 jours.
- **Pédagogie intégrée** : chaque blocage de construction est expliqué en langage clair, chaque
  échec produit un rapport de cause et des conseils.
- **Accessibilité** : navigation clavier, thèmes clair/sombre, trois tailles de texte, animations
  réductibles, sons contrôlables.
- **Zéro dépendance serveur** : le jeu fonctionne hors ligne après chargement et sauvegarde la
  progression localement.

## 4. Architecture technique

- React 18 + TypeScript strict, Vite 5, Tailwind CSS 3.
- Zustand avec persistance `localStorage` (`missionActive`, `options`).
- Routage client (11 routes) via React Router.
- Logique de jeu isolée dans `src/logic` : aucune dépendance au DOM, entièrement testable.
- Visualisation : SVG animé pour le satellite et l'orbite, Recharts pour le rapport final.
- Audio synthétisé à la volée en WebAudio (aucun asset sonore).

## 5. Validation

| Scénario | Résultat attendu |
| --- | --- |
| Configuration de référence | 165 kg, 40 M$ de modules, 8 M$ restants, +19,2 kWh/j, 25 obs/j |
| Lanceur léger | blocage « masse dépassée » |
| Lanceur lourd | blocage « budget dépassé » |
| Un seul panneau solaire | blocage « énergie insuffisante » |
| Batterie vide 2 jours | échec avec cause explicite |
| Mission de référence jouée en entier | réussite au jour 30, score 82/100 |

## 6. Limites et suite

- Une seule mission jouable sur les quatre proposées.
- Pas de sauvegarde multi-slots ni de classement en ligne.
- Pistes : nouvelles missions, tutoriel interactif, export du rapport en PDF, version anglaise.

## 7. Reproductibilité

```bash
npm install
npm test
npm run build
npm run dev
```

Node.js 18.19+ requis (Node 20 recommandé).

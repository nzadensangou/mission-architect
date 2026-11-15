# Mission Architect

Jeu éducatif de conception spatiale réalisé pour **NASA Space Apps Challenge 2026**. Le joueur
choisit une mission, sélectionne un lanceur, assemble un satellite module par module, puis gère
30 jours d'opérations : énergie, batterie, observations, transmission et événements imprévus.

- **Stack** : React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · Zustand · Framer Motion · Recharts
- **Langue** : français (interface et contenus)
- **Aucun backend** : la partie tourne entièrement dans le navigateur, la progression est
  conservée dans `localStorage`.

## Démarrage

Prérequis : **Node.js 18.19+** (Vite 5 / Tailwind 3 ; Node 20 recommandé).

```bash
npm install
npm run dev        # http://localhost:5173
```

Autres commandes :

```bash
npm run build      # typecheck (tsc -b) + build de production
npm run preview    # sert le build
npm test           # suite Vitest (54 tests)
npm run coverage   # couverture V8
npm run lint       # ESLint
```

## Parcours de jeu

1. **Accueil** — reprendre une mission, en créer une, ouvrir les options, quitter.
2. **Nouvelle mission** — 4 scénarios proposés, seul « Observer la Terre » est jouable (MVP).
3. **Briefing** — objectif, budget, durée, contraintes.
4. **Lanceur** — Léger (150 kg, 18 M$, 88 %), Moyen (400 kg, 32 M$, 94 %), Lourd (900 kg, 55 M$, 97 %).
5. **Construction** — 9 modules, limites par catégorie, validations masse / budget / énergie.
6. **Simulation** — 30 jours, vitesse réglable, pause, décisions d'événements, mode économie,
   caméra et antenne réglables, observation renforcée, réparations.
7. **Résultat** — score sur 100, rang, rapport détaillé, graphiques, relance ou nouvelle mission.

### Conditions d'échec

- santé du satellite à 0 % ;
- batterie vide **2 jours consécutifs** ;
- aucune transmission possible **3 jours consécutifs** ;
- objectif d'observations non atteint au jour 30.

## Modèle de simulation

Toutes les constantes sont centralisées dans `src/logic/config.ts`.

| Élément | Formule |
| --- | --- |
| Production effective | `production nominale × 0,6 × modificateurs` |
| Consommation effective | `somme des modules × modificateurs caméra/antenne × éco × événements` |
| Énergie nette | `(production − consommation) × 24` |
| Observations / jour | `capacité caméra × modificateur + bonus orientation`, puis événements et observation renforcée |
| Transmission / jour | `20 + capacité antenne`, × 0,5 si antenne réduite |
| Batterie | `10 kWh` par module, bornée entre 0 et la capacité |
| Fiabilité | `fiabilité lanceur − risques + 5 (orientation) + 6 (blindage)` |
| Score | `100 × (0,35·obs + 0,25·transmission + 0,20·budget + 0,20·fiabilité)` |

Rangs : **Architecte spatial** (≥ 85), **Commandeur de mission** (≥ 70), **Ingénieur de mission**
(≥ 50), **Cadet spatial** (sinon).

### Configuration de référence

Structure + 2 panneaux solaires + batterie + caméra standard + antenne standard + orientation,
lanceur Moyen, budget 80 M$ :

- masse **165 kg** (capacité 400 kg) ;
- coût modules **40 M$** + lanceur **32 M$** → **8 M$** restants ;
- énergie **+19,2 kWh/jour** ; fiabilité **99 %** ; observations **25/jour**.

## Écarts assumés par rapport au document de conception

1. **Formule énergétique** — le §18.5 proposait `production × 0,6 × 24 − consommation × 0,4 × 24`,
   qui ne reproduit aucun exemple chiffré. Nous utilisons `(production × 0,6 − consommation) × 24`,
   qui donne bien +19,2 kWh/jour pour la configuration de référence.
2. **Fiabilité** — le §18.8 (lanceur + orientation + blindage) est appliqué : 99 % au lieu des 94 %
   du §10.2 pour le même satellite.
3. **Score** — avec ces valeurs, l'exemple de référence obtient **82/100**, conforme au §10.2.
   Avec une fiabilité de 94 % le score serait de 81 : l'écart provient uniquement du point 2.
4. **Caméra forcée à l'arrêt** — quand la batterie tombe à 0, la caméra est coupée pour la journée
   puis **réactivée automatiquement** dès que l'énergie revient, afin de ne pas condamner la partie.
5. **Collision d'événements** — `ombre` et `opportunite-scientifique` tombent tous deux au jour 22.
   La file est triée et les deux événements sont joués successivement.
6. **Anglais** — le sélecteur de langue est présent mais désactivé (MVP francophone).

## Structure du projet

```
src/
  components/   layout · ui · home · mission · builder · simulation · result · options
  data/         missions, lanceurs, composants, événements, textes d'aide
  hooks/        useMission, useSimulation, useOptions, useLocalStorage
  logic/        logique pure et testable (énergie, batterie, score, simulation…)
  pages/        une page par route
  store/        Zustand + persistance localStorage
  types/        types partagés
  utils/        formatage, stockage, aléatoire, moteur audio WebAudio
tests/
  logic/        modèle de jeu
  store/        persistance et actions
  components/   parcours utilisateur (Testing Library)
```

## Accessibilité et confort

- navigation clavier complète, focus visibles, `aria-*` sur les contrôles composites ;
- thème sombre / clair, trois tailles de texte, réduction des animations via les options **et**
  `prefers-reduced-motion` ;
- sons synthétisés en WebAudio (aucun fichier audio) avec volume réglable et musicabilité optionnelle ;
- `lang`, `data-theme`, `data-text-size` et `data-animations` appliqués sur `<html>`.

## Licence

Projet pédagogique. Les données et le nom des agences cités appartiennent à leurs détenteurs.

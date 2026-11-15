import type { MissionDefinition } from '../types'

export const MISSIONS: MissionDefinition[] = [
  {
    id: 'observer-la-terre',
    title: 'Observer la Terre',
    icon: '🛰️',
    level: 'Initiation',
    budget: 80,
    durationDays: 30,
    observationGoal: 600,
    objective: 'Réaliser 600 observations en 30 jours',
    briefing:
      "Une équipe scientifique souhaite observer une région d'Afrique centrale afin de suivre la végétation, les zones agricoles et les changements du paysage.",
  },
  {
    id: 'cartographier-la-lune',
    title: 'Cartographier la Lune',
    icon: '🌙',
    level: 'Intermédiaire',
    budget: 95,
    durationDays: 30,
    observationGoal: 700,
    objective: 'Réaliser 700 observations en 30 jours',
    briefing:
      'Produire une carte haute résolution des régions polaires lunaires pour préparer une future mission habitée.',
  },
  {
    id: 'explorer-mars',
    title: 'Explorer Mars depuis l’orbite',
    icon: '🔴',
    level: 'Avancé',
    budget: 120,
    durationDays: 30,
    observationGoal: 800,
    objective: 'Réaliser 800 observations en 30 jours',
    briefing:
      "Survoler les vallées martiennes afin d'identifier des sites d'atterrissage pour un rover.",
  },
  {
    id: 'etudier-un-asteroide',
    title: 'Étudier un astéroïde',
    icon: '☄️',
    level: 'Expert',
    budget: 140,
    durationDays: 30,
    observationGoal: 900,
    objective: 'Réaliser 900 observations en 30 jours',
    briefing:
      "Analyser la composition d'un astéroïde géocroiseur pour mieux comprendre la formation du système solaire.",
  },
]

/** Seule la première mission est jouable dans le MVP (§7.2) */
export const PLAYABLE_MISSION_IDS: string[] = ['observer-la-terre']

export function getMissionDefinition(missionId: string): MissionDefinition | undefined {
  return MISSIONS.find((mission) => mission.id === missionId)
}

export function isMissionPlayable(missionId: string): boolean {
  return PLAYABLE_MISSION_IDS.includes(missionId)
}

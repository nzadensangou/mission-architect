import type { MissionEvent } from '../types'

/**
 * Événements du MVP — §11.7.
 * `energy_production` / `energy_consumption` / `observations` / `transmission`
 * portent un multiplicateur lorsqu’ils ont une `duration`, sinon un delta absolu.
 */
export const EVENTS: MissionEvent[] = [
  {
    id: 'ombre',
    title: 'Passage dans l’ombre',
    description:
      'Le satellite entre dans l’ombre de la Terre. Les panneaux ne produisent plus rien pendant que les modules continuent de consommer.',
    days: [2, 7, 12, 17, 22, 27],
    severity: 'warning',
    effects: [{ type: 'energy_production', value: 0.05, duration: 1 }],
    choices: [
      {
        id: 'economiser',
        label: 'Économiser',
        hint: 'Consommation −40 % pendant 1 jour',
        effects: [{ type: 'energy_consumption', value: 0.6, duration: 1 }],
      },
      {
        id: 'continuer',
        label: 'Continuer',
        hint: 'La batterie encaisse seule : −2 kWh',
        effects: [{ type: 'battery', value: -2 }],
      },
    ],
  },
  {
    id: 'baisse-solaire',
    title: 'Baisse solaire',
    description:
      'L’activité solaire faiblit. La production d’énergie baisse de 30 % pendant 2 jours.',
    day: 8,
    severity: 'warning',
    effects: [{ type: 'energy_production', value: 0.7, duration: 2 }],
    choices: [
      {
        id: 'eco',
        label: 'Mode économie',
        hint: 'Consommation −40 % pendant 2 jours',
        effects: [{ type: 'energy_consumption', value: 0.6, duration: 2 }],
      },
      {
        id: 'continuer',
        label: 'Continuer',
        hint: 'Aucune action',
        effects: [],
      },
    ],
  },
  {
    id: 'tempete-solaire',
    title: 'Tempête solaire',
    description:
      'Une éjection de masse coronale frappe la magnétosphère. La production chute de 50 % pendant 3 jours.',
    day: 16,
    severity: 'critical',
    effects: [{ type: 'energy_production', value: 0.5, duration: 3 }],
    choices: [
      {
        id: 'eco',
        label: 'Mode économie',
        hint: 'Consommation −50 % pendant 3 jours',
        effects: [{ type: 'energy_consumption', value: 0.5, duration: 3 }],
      },
      {
        id: 'reduire-camera',
        label: 'Réduire la caméra',
        hint: 'Observations divisées par 2, consommation de la caméra réduite',
        effects: [{ type: 'camera', value: 0.5 }],
      },
      {
        id: 'continuer',
        label: 'Ignorer',
        hint: 'La batterie encaisse : −4 kWh',
        effects: [{ type: 'battery', value: -4 }],
      },
    ],
  },
  {
    id: 'panne-camera',
    title: 'Panne de caméra',
    description:
      'Un composant de la caméra a été endommagé par un micrométéorite. Les observations sont divisées par 2 pendant 2 jours.',
    day: 20,
    severity: 'critical',
    effects: [
      { type: 'observations', value: 0.5, duration: 2 },
      { type: 'health', value: -5 },
    ],
    choices: [
      {
        id: 'reparer',
        label: 'Réparer',
        hint: '40 % de risque d’aggraver la panne (−10 santé)',
        risk: 40,
        effects: [{ type: 'camera', value: 1 }],
        failEffects: [{ type: 'health', value: -10 }],
      },
      {
        id: 'continuer',
        label: 'Continuer',
        hint: 'La caméra reste dégradée',
        effects: [],
      },
    ],
  },
  {
    id: 'opportunite-scientifique',
    title: 'Opportunité scientifique',
    description:
      'Un phénomène rare est observable : une éruption volcanique majeure en Afrique centrale. Une fenêtre de quelques heures seulement.',
    day: 22,
    severity: 'opportunity',
    effects: [],
    choices: [
      {
        id: 'observer',
        label: 'Observer',
        hint: '+80 observations, −15 % de batterie',
        effects: [
          { type: 'observations', value: 80 },
          { type: 'battery', value: -0.15 },
        ],
      },
      {
        id: 'ignorer',
        label: 'Ignorer',
        hint: 'Économise l’énergie',
        effects: [],
      },
    ],
  },
  {
    id: 'demande-transmission',
    title: 'Demande de transmission',
    description:
      'Une station au sol demande la priorité sur les données en attente : 40 unités supplémentaires à transmettre.',
    day: 26,
    severity: 'info',
    effects: [{ type: 'transmission', value: 40 }],
    choices: [
      {
        id: 'transmettre',
        label: 'Transmettre en priorité',
        hint: 'Coût : −1 kWh',
        effects: [{ type: 'battery', value: -1 }],
      },
      {
        id: 'ignorer',
        label: 'Ignorer',
        hint: 'Les données restent en attente',
        effects: [],
      },
    ],
  },
]

export const EVENT_MAP: Record<string, MissionEvent> = Object.fromEntries(
  EVENTS.map((event) => [event.id, event]),
)

export function getEvent(id: string): MissionEvent | undefined {
  return EVENT_MAP[id]
}

/** Construit la file d'événements d'une mission, triée par jour */
export function buildEventQueue(): string[] {
  const queue: string[] = []
  for (const event of EVENTS) {
    if (event.days) {
      for (const day of event.days) queue.push(`${event.id}@${day}`)
    } else if (event.day) {
      queue.push(`${event.id}@${event.day}`)
    }
  }
  return queue.sort((a, b) => Number(a.split('@')[1]) - Number(b.split('@')[1]))
}

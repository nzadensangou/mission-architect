export type EventSeverity = 'info' | 'warning' | 'critical' | 'opportunity'

/**
 * Types d'effets.
 * Les six premiers sont ceux du document (§17.4).
 * `camera` et `power_mode` sont des extensions nécessaires aux décisions
 * « Réduire la caméra » / « Mode économie » demandées au §11.8.
 */
export type EventEffectType =
  | 'energy_production'
  | 'energy_consumption'
  | 'battery'
  | 'observations'
  | 'transmission'
  | 'health'
  | 'reliability'
  | 'camera'
  | 'power_mode'

export interface EventEffect {
  type: EventEffectType
  value: number
  duration?: number
}

export interface EventChoice {
  id: string
  label: string
  effects: EventEffect[]
  /** Probabilité (0-100) que le choix échoue et applique `failEffects` */
  risk?: number
  failEffects?: EventEffect[]
  hint?: string
}

export interface MissionEvent {
  id: string
  title: string
  description: string
  /** Jour de déclenchement. `undefined` pour les événements récurrents. */
  day?: number
  /** Jours de déclenchement pour les événements récurrents. */
  days?: number[]
  severity: EventSeverity
  effects: EventEffect[]
  choices: EventChoice[]
}

/** Effet actif pendant N jours */
export interface ActiveEffect {
  id: string
  type: EventEffectType
  value: number
  daysLeft: number
  source: string
}

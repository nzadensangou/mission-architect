/**
 * Constantes de calibration du modèle de simulation.
 *
 * Le document (§18.5) proposait `production × 0,6 × 24 − consommation × 0,4 × 24`,
 * ce qui ne reproduisait aucun des exemples chiffrés du §10.2. La formule retenue
 * est `(production × 0,6 − consommation) × 24`, qui donne bien +19,2 kWh/jour pour
 * la configuration de référence (structure + 2 panneaux + batterie + caméra
 * standard + antenne standard + orientation). Voir README, « Écarts assumés ».
 */
export const SOLAR_BASE_FACTOR = 0.6
export const ECO_CONSUMPTION_FACTOR = 0.55
export const CAMERA_REDUCED_FACTOR = 0.5
export const ANTENNA_REDUCED_FACTOR = 0.5
export const REINFORCED_OBSERVATION_FACTOR = 1.5
export const REINFORCED_OBSERVATION_EXTRA_KW = 0.3
export const ORIENTATION_OBSERVATION_BONUS = 5
export const BASE_TRANSMISSION = 20
export const HOURS_PER_DAY = 24

export const START_HEALTH = 100
export const MAX_CONSECUTIVE_EMPTY_DAYS = 2
export const MAX_CONSECUTIVE_NO_TRANSMISSION_DAYS = 3

export const SPEEDS = [
  { id: 'normal', label: 'Normale', msPerDay: 8000 },
  { id: 'rapide', label: 'Rapide', msPerDay: 4000 },
  { id: 'tres-rapide', label: 'Très rapide', msPerDay: 2000 },
] as const

export type SpeedId = (typeof SPEEDS)[number]['id']

export function msPerDay(speed: SpeedId): number {
  return SPEEDS.find((entry) => entry.id === speed)?.msPerDay ?? 8000
}

export const RANKS = [
  { min: 85, label: 'Architecte spatial' },
  { min: 70, label: 'Commandeur de mission' },
  { min: 50, label: 'Ingénieur de mission' },
  { min: 0, label: 'Cadet spatial' },
] as const

export function rankForScore(score: number): string {
  return RANKS.find((rank) => score >= rank.min)?.label ?? 'Cadet spatial'
}

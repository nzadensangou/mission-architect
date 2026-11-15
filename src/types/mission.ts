import type { ActiveEffect } from './event'
import type { CameraStatus, AntennaStatus, PowerMode } from './options'

export type MissionStatus = 'en_cours' | 'reussie' | 'echouee' | 'abandonnee'

export type JournalTone = 'info' | 'good' | 'warn' | 'bad'

export interface JournalEntry {
  id: string
  day: number
  tone: JournalTone
  message: string
}

export interface DayRecord {
  day: number
  energyNet: number
  battery: number
  observations: number
  transmitted: number
}

export interface Mission {
  id: string
  missionId: string
  title: string
  status: MissionStatus
  launcherId: string
  /** Identifiants de composants, doublons autorisés (panneaux, batteries) */
  components: string[]

  budgetInitial: number
  budgetRestant: number
  capacityMass: number
  totalMass: number

  battery: number
  batteryCapacity: number
  energy: number

  observations: number
  observationGoal: number
  pendingData: number
  transmittedData: number

  currentDay: number
  totalDays: number

  reliability: number
  health: number

  cameraStatus: CameraStatus
  /** Caméra coupée automatiquement par une batterie vide (réactivée au retour d'énergie) */
  cameraForcedOff?: boolean
  antennaStatus: AntennaStatus
  powerMode: PowerMode

  journal: JournalEntry[]
  activeEventId?: string

  createdAt: string
  updatedAt: string

  /* --- Extensions de jeu (voir README, section « Écarts assumés ») --- */
  /** Événements récurrents restant à déclencher */
  eventQueue: string[]
  /** Événements déjà traités (évite les doublons) */
  resolvedEventIds: string[]
  /** Effets temporaires en cours */
  activeEffects: ActiveEffect[]
  /** Jours consécutifs terminés avec une batterie vide */
  emptyBatteryStreak: number
  /** Jours consécutifs sans transmission possible */
  noTransmissionStreak: number
  /** Observation renforcée active (décision du joueur) */
  reinforcedObservation: boolean
  /** Historique quotidien pour le rapport */
  history: DayRecord[]

  score?: number
  rank?: string
  failureReason?: string
}

export interface MissionDefinition {
  id: string
  title: string
  icon: string
  level: string
  budget: number
  durationDays: number
  observationGoal: number
  objective: string
  briefing: string
}

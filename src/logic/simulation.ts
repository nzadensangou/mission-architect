import { buildEventQueue, getEvent } from '../data/events'
import type {
  EventEffect,
  Mission,
  MissionDefinition,
  ActiveEffect,
  JournalEntry,
  JournalTone,
} from '../types'
import { applyDailyEnergy, clampBattery, isEmpty } from './battery'
import { remainingBudget } from './budget'
import { getLauncher } from '../data/launchers'
import { getComponent } from '../data/components'
import { transmissionCapacity, transmit } from './communication'
import { summarizeEnergy } from './energy'
import { observationsForDay } from './observations'
import { reliability } from './reliability'
import { computeScore, scoreBreakdown } from './score'
import {
  MAX_CONSECUTIVE_EMPTY_DAYS,
  MAX_CONSECUTIVE_NO_TRANSMISSION_DAYS,
  START_HEALTH,
} from './config'

let journalCounter = 0

/**
 * Les identifiants doivent rester uniques même après un rechargement de page
 * (le compteur repart de zéro alors que le journal est persisté).
 */
function journal(day: number, tone: JournalTone, message: string): JournalEntry {
  journalCounter += 1
  return {
    id: `${day}-${Date.now().toString(36)}-${journalCounter}`,
    day,
    tone,
    message,
  }
}

export function createMission(
  definition: MissionDefinition,
  launcherId: string,
  componentIds: string[],
): Mission {
  const launcher = getLauncher(launcherId)
  const capacityMass = launcher?.payloadCapacity ?? 0
  const capacity = componentIds.reduce(
    (sum, id) => sum + (getComponent(id)?.batteryCapacity ?? 0),
    0,
  )
  const now = new Date().toISOString()

  const base: Mission = {
    id: `mission-${Date.now()}`,
    missionId: definition.id,
    title: definition.title,
    status: 'en_cours',
    launcherId,
    components: [...componentIds],
    budgetInitial: definition.budget,
    budgetRestant: remainingBudget(definition.budget, launcher?.cost ?? 0, componentIds),
    capacityMass,
    totalMass: componentIds.reduce((sum, id) => sum + (getComponent(id)?.mass ?? 0), 0),
    battery: capacity,
    batteryCapacity: capacity,
    energy: 0,
    observations: 0,
    observationGoal: definition.observationGoal,
    pendingData: 0,
    transmittedData: 0,
    currentDay: 0,
    totalDays: definition.durationDays,
    reliability: reliability(launcherId, componentIds),
    health: START_HEALTH,
    cameraStatus: 'active',
    antennaStatus: 'active',
    powerMode: 'normal',
    journal: [journal(0, 'info', `Mission « ${definition.title} » initialisée. Lanceur prêt.`)],
    createdAt: now,
    updatedAt: now,
    eventQueue: buildEventQueue(),
    resolvedEventIds: [],
    activeEffects: [],
    emptyBatteryStreak: 0,
    noTransmissionStreak: 0,
    reinforcedObservation: false,
    history: [],
  }

  return refreshEnergy(base)
}

function refreshEnergy(mission: Mission): Mission {
  const summary = summarizeEnergy(mission.components, {
    cameraStatus: mission.cameraStatus,
    antennaStatus: mission.antennaStatus,
    powerMode: mission.powerMode,
    reinforcedObservation: mission.reinforcedObservation,
    effects: mission.activeEffects,
  })
  return { ...mission, energy: summary.netDaily }
}

export function nextEventKey(mission: Mission): string | null {
  const targetDay = mission.currentDay + 1
  let best: string | null = null
  let bestDay = Number.POSITIVE_INFINITY

  for (const key of mission.eventQueue) {
    const [eventId, rawDay] = key.split('@')
    const day = Number(rawDay)
    if (!eventId || Number.isNaN(day)) continue
    if (day <= targetDay && day < bestDay) {
      best = key
      bestDay = day
    }
  }

  return best
}

export function applyEffects(
  mission: Mission,
  effects: EventEffect[],
  source: string,
): Mission {
  let next = { ...mission, components: [...mission.components], activeEffects: [...mission.activeEffects] }

  for (const effect of effects) {
    if (effect.duration && effect.duration > 0) {
      next.activeEffects.push(toActiveEffect(effect, source))
      continue
    }
    next = applyInstant(next, effect)
  }

  return refreshEnergy(clampMission(next))
}

function toActiveEffect(effect: EventEffect, source: string): ActiveEffect {
  return {
    id: `${source}-${effect.type}-${Math.random().toString(36).slice(2, 8)}`,
    type: effect.type,
    value: effect.value,
    daysLeft: effect.duration ?? 1,
    source,
  }
}

function applyInstant(mission: Mission, effect: EventEffect): Mission {
  const next = { ...mission }

  switch (effect.type) {
    case 'battery': {
      const delta =
        Math.abs(effect.value) <= 1 ? mission.batteryCapacity * effect.value : effect.value
      next.battery = clampBattery(mission.battery + delta, mission.batteryCapacity)
      break
    }
    case 'observations': {
      const gained = Math.max(0, Math.round(effect.value))
      next.observations = mission.observations + gained
      next.pendingData = Math.max(0, mission.pendingData + gained)
      break
    }
    case 'transmission': {
      next.pendingData = Math.max(0, mission.pendingData + Math.round(effect.value))
      break
    }
    case 'health': {
      next.health = Math.max(0, Math.min(START_HEALTH, mission.health + effect.value))
      break
    }
    case 'reliability': {
      next.reliability = Math.max(0, Math.min(100, mission.reliability + effect.value))
      break
    }
    case 'camera': {
      next.cameraStatus = effect.value >= 1 ? 'active' : effect.value > 0 ? 'reduced' : 'off'
      next.cameraForcedOff = false
      break
    }
    case 'power_mode': {
      next.powerMode = effect.value >= 1 ? 'eco' : 'normal'
      break
    }
    default:
      break
  }

  return next
}

function clampMission(mission: Mission): Mission {
  return {
    ...mission,
    observations: Math.max(0, mission.observations),
    pendingData: Math.max(0, mission.pendingData),
    health: Math.max(0, mission.health),
  }
}

/** Déclenche l'événement prévu au début du jour suivant */
export function triggerScheduledEvent(mission: Mission, key: string): Mission {
  const [eventId, rawDay] = key.split('@')
  const event = getEvent(eventId)
  if (!event) {
    return { ...mission, eventQueue: mission.eventQueue.filter((entry) => entry !== key) }
  }

  const scheduledDay = Number(rawDay)
  const day = Number.isFinite(scheduledDay) ? scheduledDay : mission.currentDay + 1
  let next = applyEffects(
    { ...mission, eventQueue: mission.eventQueue.filter((entry) => entry !== key) },
    event.effects,
    event.id,
  )

  next = {
    ...next,
    activeEventId: event.id,
    journal: [
      ...next.journal,
      journal(day, event.severity === 'opportunity' ? 'good' : 'warn', `${event.title} — ${shortDescription(event.id)}`),
    ],
  }

  return { ...next, updatedAt: new Date().toISOString() }
}

function shortDescription(eventId: string): string {
  switch (eventId) {
    case 'ombre':
      return 'production solaire quasi nulle.'
    case 'baisse-solaire':
      return 'production −30 % pendant 2 jours.'
    case 'tempete-solaire':
      return 'production −50 % pendant 3 jours.'
    case 'panne-camera':
      return 'observations −50 % pendant 2 jours.'
    case 'opportunite-scientifique':
      return 'fenêtre d’observation exceptionnelle.'
    case 'demande-transmission':
      return '40 données supplémentaires à transmettre.'
    default:
      return ''
  }
}

export interface ChoiceOutcome {
  mission: Mission
  outcome: 'applied' | 'failed'
}

/** Applique le choix du joueur puis avance la journée */
export function applyChoice(mission: Mission, choiceId: string): ChoiceOutcome {
  const event = mission.activeEventId ? getEvent(mission.activeEventId) : undefined
  if (!event) return { mission, outcome: 'applied' }

  const choice = event.choices.find((entry) => entry.id === choiceId)
  if (!choice) return { mission, outcome: 'applied' }

  const day = mission.currentDay + 1
  let next = { ...mission }

  const failed = typeof choice.risk === 'number' && Math.random() * 100 < choice.risk
  const effects = failed ? (choice.failEffects ?? []) : choice.effects

  next = applyEffects(next, effects, `${event.id}-${choice.id}`)
  next = {
    ...next,
    activeEventId: undefined,
    resolvedEventIds: [...next.resolvedEventIds, event.id],
    journal: [
      ...next.journal,
      journal(
        day,
        failed ? 'bad' : 'info',
        failed
          ? `Décision « ${choice.label} » : échec. Conséquences aggravées.`
          : `Décision « ${choice.label} » appliquée.`,
      ),
    ],
  }

  next = advanceDay({ ...next, currentDay: day - 1 })
  return { mission: { ...next, updatedAt: new Date().toISOString() }, outcome: failed ? 'failed' : 'applied' }
}

/** Traite une journée complète (§11.6) */
export function advanceDay(mission: Mission): Mission {
  if (mission.status !== 'en_cours') return mission

  const day = mission.currentDay + 1
  const ctx = {
    cameraStatus: mission.cameraStatus,
    antennaStatus: mission.antennaStatus,
    powerMode: mission.powerMode,
    reinforcedObservation: mission.reinforcedObservation,
    effects: mission.activeEffects,
  }

  const summary = summarizeEnergy(mission.components, ctx)
  const batteryAfter = applyDailyEnergy(mission.battery, summary.netDaily, mission.batteryCapacity)
  const batteryEmpty = isEmpty(batteryAfter)

  const cameraStatus: Mission['cameraStatus'] = batteryEmpty
    ? 'off'
    : mission.cameraForcedOff
      ? 'active'
      : mission.cameraStatus
  const cameraForcedOff = batteryEmpty
  const observations = observationsForDay(mission.components, { ...ctx, cameraStatus })
  const capacity = transmissionCapacity(mission.components, mission.antennaStatus, mission.activeEffects)
  const { transmitted, pending } = transmit(mission.pendingData, observations, capacity)

  const entries: JournalEntry[] = [
    journal(
      day,
      summary.netDaily >= 0 ? 'good' : 'warn',
      `Énergie ${summary.netDaily >= 0 ? '+' : ''}${summary.netDaily} kWh — batterie ${batteryAfter}/${mission.batteryCapacity} kWh.`,
    ),
    journal(day, observations > 0 ? 'info' : 'warn', `${observations} observations produites, ${transmitted} transmises.`),
  ]

  if (batteryEmpty) {
    entries.push(journal(day, 'bad', 'Batterie vide : la caméra est arrêtée.'))
  }
  if (pending > 0) {
    entries.push(journal(day, 'warn', `${pending} données en attente de transmission.`))
  }

  let next: Mission = {
    ...mission,
    currentDay: day,
    battery: batteryAfter,
    energy: summary.netDaily,
    cameraStatus,
    cameraForcedOff,
    observations: mission.observations + observations,
    pendingData: pending,
    transmittedData: mission.transmittedData + transmitted,
    emptyBatteryStreak: batteryEmpty ? mission.emptyBatteryStreak + 1 : 0,
    noTransmissionStreak:
      capacity === 0 || transmitted === 0 ? mission.noTransmissionStreak + 1 : 0,
    activeEffects: tickEffects(mission.activeEffects),
    journal: [...mission.journal, ...entries],
    history: [
      ...mission.history,
      {
        day,
        energyNet: summary.netDaily,
        battery: batteryAfter,
        observations,
        transmitted,
      },
    ],
    updatedAt: new Date().toISOString(),
  }

  next = evaluateEnd(next)
  return refreshEnergy(next)
}

function tickEffects(effects: ActiveEffect[]): ActiveEffect[] {
  return effects
    .map((effect) => ({ ...effect, daysLeft: effect.daysLeft - 1 }))
    .filter((effect) => effect.daysLeft > 0)
}

/** Vérifie les conditions de fin de mission (§11.9 / §11.10) */
export function evaluateEnd(mission: Mission): Mission {
  if (mission.status !== 'en_cours') return mission

  const fail = (reason: string): Mission => finalize({ ...mission, status: 'echouee', failureReason: reason })

  if (mission.health <= 0) {
    return fail('Le satellite a été détruit (santé à 0 %).')
  }
  if (mission.emptyBatteryStreak >= MAX_CONSECUTIVE_EMPTY_DAYS) {
    return fail(
      `Batterie vide pendant ${MAX_CONSECUTIVE_EMPTY_DAYS} jours consécutifs (jour ${mission.currentDay}).`,
    )
  }
  if (mission.noTransmissionStreak >= MAX_CONSECUTIVE_NO_TRANSMISSION_DAYS) {
    return fail(
      `Plus aucune transmission possible depuis ${MAX_CONSECUTIVE_NO_TRANSMISSION_DAYS} jours (jour ${mission.currentDay}).`,
    )
  }
  if (mission.currentDay >= mission.totalDays) {
    if (mission.observations >= mission.observationGoal) {
      return finalize({ ...mission, status: 'reussie' })
    }
    return fail(
      `Objectif non atteint : ${mission.observations} observations sur ${mission.observationGoal}.`,
    )
  }

  return mission
}

function finalize(mission: Mission): Mission {
  const { total, rank } = scoreBreakdown(mission)
  return {
    ...mission,
    score: total,
    rank,
    updatedAt: new Date().toISOString(),
    journal: [
      ...mission.journal,
      journal(
        mission.currentDay,
        mission.status === 'reussie' ? 'good' : 'bad',
        mission.status === 'reussie'
          ? `Mission réussie. Score ${total}/100 — ${rank}.`
          : `Mission échouée. ${mission.failureReason ?? ''}`,
      ),
    ],
  }
}

export function abandonMission(mission: Mission): Mission {
  return finalize({ ...mission, status: 'abandonnee', failureReason: 'Mission abandonnée par le joueur.' })
}

/** Relance la simulation avec la même conception (§19.8 « Réessayer ») */
export function restartMission(mission: Mission): Mission {
  return {
    ...mission,
    status: 'en_cours',
    currentDay: 0,
    battery: mission.batteryCapacity,
    observations: 0,
    pendingData: 0,
    transmittedData: 0,
    health: START_HEALTH,
    cameraStatus: 'active',
    antennaStatus: 'active',
    powerMode: 'normal',
    reinforcedObservation: false,
    emptyBatteryStreak: 0,
    noTransmissionStreak: 0,
    activeEffects: [],
    resolvedEventIds: [],
    activeEventId: undefined,
    history: [],
    eventQueue: buildEventQueue(),
    score: undefined,
    rank: undefined,
    failureReason: undefined,
    journal: [
      journal(0, 'good', 'Nouvelle tentative : satellite relancé avec la même conception.'),
    ],
    updatedAt: new Date().toISOString(),
  }
}

/** Fait avancer la mission d'un cran (événement ou journée) */
export function step(mission: Mission): Mission {
  if (mission.status !== 'en_cours') return mission
  if (mission.activeEventId) return mission

  const key = nextEventKey(mission)
  if (key) return triggerScheduledEvent(mission, key)

  return advanceDay(mission)
}

export { computeScore }

import { getComponent } from '../data/components'
import type { ActiveEffect, AntennaStatus } from '../types'
import { BASE_TRANSMISSION } from './config'
import { antennaFactor, multiplierFor } from './energy'

export function antennaCapacity(componentIds: string[]): number {
  return componentIds.reduce(
    (sum, id) => sum + (getComponent(id)?.transmissionPerDay ?? 0),
    0,
  )
}

/** Capacité de transmission du jour (§18.7) */
export function transmissionCapacity(
  componentIds: string[],
  antennaStatus: AntennaStatus,
  effects: ActiveEffect[],
): number {
  if (antennaStatus === 'off') return 0
  const base = BASE_TRANSMISSION + antennaCapacity(componentIds)
  const eventModifier = multiplierFor(effects, 'transmission')
  return Math.max(0, Math.round(base * antennaFactor(antennaStatus) * eventModifier))
}

export interface TransmissionResult {
  transmitted: number
  pending: number
}

/** `donnéesTransmises = min(enAttente + produites, capacité)` */
export function transmit(
  pending: number,
  produced: number,
  capacity: number,
): TransmissionResult {
  const available = Math.max(0, pending + produced)
  const transmitted = Math.max(0, Math.min(available, capacity))
  return { transmitted, pending: available - transmitted }
}

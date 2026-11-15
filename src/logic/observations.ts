import { getComponent } from '../data/components'
import type { ActiveEffect, CameraStatus } from '../types'
import {
  ORIENTATION_OBSERVATION_BONUS,
  REINFORCED_OBSERVATION_FACTOR,
} from './config'
import { multiplierFor } from './energy'

export interface ObservationContext {
  cameraStatus: CameraStatus
  reinforcedObservation: boolean
  effects: ActiveEffect[]
}

export function cameraCapacity(componentIds: string[]): number {
  return componentIds.reduce((sum, id) => {
    const component = getComponent(id)
    if (!component || component.category !== 'camera') return sum
    return sum + component.observationsPerDay
  }, 0)
}

export function hasOrientation(componentIds: string[]): boolean {
  return componentIds.some((id) => getComponent(id)?.category === 'attitude')
}

/**
 * Observations produites dans la journée.
 * `capacité caméra × modificateur caméra + bonus orientation`, puis
 * multiplicateur d'événement et observation renforcée (§18.6).
 */
export function observationsForDay(
  componentIds: string[],
  ctx: ObservationContext,
): number {
  if (ctx.cameraStatus === 'off') return 0

  const capacity = cameraCapacity(componentIds)
  const cameraModifier = ctx.cameraStatus === 'reduced' ? 0.5 : 1
  const orientationBonus = hasOrientation(componentIds) ? ORIENTATION_OBSERVATION_BONUS : 0
  const eventModifier = multiplierFor(ctx.effects, 'observations')
  const reinforced = ctx.reinforcedObservation ? REINFORCED_OBSERVATION_FACTOR : 1

  return Math.max(
    0,
    Math.round((capacity * cameraModifier + orientationBonus) * eventModifier * reinforced),
  )
}

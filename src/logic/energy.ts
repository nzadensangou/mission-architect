import { getComponent } from '../data/components'
import type { ActiveEffect, AntennaStatus, CameraStatus, PowerMode } from '../types'
import {
  ANTENNA_REDUCED_FACTOR,
  CAMERA_REDUCED_FACTOR,
  ECO_CONSUMPTION_FACTOR,
  HOURS_PER_DAY,
  REINFORCED_OBSERVATION_EXTRA_KW,
  SOLAR_BASE_FACTOR,
} from './config'
import { round1 } from './budget'

/** Production nominale des panneaux, en kW */
export function solarProduction(componentIds: string[]): number {
  const total = componentIds.reduce(
    (sum, id) => sum + (getComponent(id)?.energyProduction ?? 0),
    0,
  )
  return round1(total)
}

/** Consommation nominale de tous les modules, en kW */
export function baseConsumption(componentIds: string[]): number {
  const total = componentIds.reduce(
    (sum, id) => sum + (getComponent(id)?.energyConsumption ?? 0),
    0,
  )
  return round1(total)
}

export function multiplierFor(
  effects: ActiveEffect[],
  type: ActiveEffect['type'],
): number {
  return effects
    .filter((effect) => effect.type === type && effect.daysLeft > 0)
    .reduce((factor, effect) => factor * effect.value, 1)
}

export function productionFactor(effects: ActiveEffect[]): number {
  return multiplierFor(effects, 'energy_production')
}

export function consumptionEffectFactor(effects: ActiveEffect[]): number {
  return multiplierFor(effects, 'energy_consumption')
}

export function cameraFactor(status: CameraStatus): number {
  if (status === 'off') return 0
  if (status === 'reduced') return CAMERA_REDUCED_FACTOR
  return 1
}

export function antennaFactor(status: AntennaStatus): number {
  if (status === 'off') return 0
  if (status === 'reduced') return ANTENNA_REDUCED_FACTOR
  return 1
}

export interface ConsumptionContext {
  cameraStatus: CameraStatus
  antennaStatus: AntennaStatus
  powerMode: PowerMode
  reinforcedObservation: boolean
  effects: ActiveEffect[]
}

/** Consommation effective, en kW (modificateurs caméra / antenne / éco / événements) */
export function effectiveConsumption(
  componentIds: string[],
  ctx: ConsumptionContext,
): number {
  const raw = componentIds.reduce((sum, id) => {
    const component = getComponent(id)
    if (!component) return sum
    let value = component.energyConsumption
    if (component.category === 'camera') value *= cameraFactor(ctx.cameraStatus)
    if (component.category === 'antenna') value *= antennaFactor(ctx.antennaStatus)
    return sum + value
  }, 0)

  const extra =
    ctx.reinforcedObservation && ctx.cameraStatus !== 'off' ? REINFORCED_OBSERVATION_EXTRA_KW : 0
  const eco = ctx.powerMode === 'eco' ? ECO_CONSUMPTION_FACTOR : 1

  return round1((raw + extra) * eco * consumptionEffectFactor(ctx.effects))
}

export function effectiveProduction(componentIds: string[], effects: ActiveEffect[]): number {
  return round1(solarProduction(componentIds) * SOLAR_BASE_FACTOR * productionFactor(effects))
}

/** Énergie nette journalière, en kWh */
export function netDailyEnergy(productionKw: number, consumptionKw: number): number {
  return round1((productionKw - consumptionKw) * HOURS_PER_DAY)
}

export interface EnergySummary {
  nominalProduction: number
  production: number
  consumption: number
  netDaily: number
}

export function summarizeEnergy(componentIds: string[], ctx: ConsumptionContext): EnergySummary {
  const nominalProduction = solarProduction(componentIds)
  const production = effectiveProduction(componentIds, ctx.effects)
  const consumption = effectiveConsumption(componentIds, ctx)
  return {
    nominalProduction,
    production,
    consumption,
    netDaily: netDailyEnergy(production, consumption),
  }
}

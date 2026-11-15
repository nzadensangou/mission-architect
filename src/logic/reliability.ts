import { getComponent } from '../data/components'
import { getLauncher } from '../data/launchers'

/** Bonus cumulés des modules (orientation + blindage) */
export function componentReliabilityBonus(componentIds: string[]): number {
  return componentIds.reduce(
    (sum, id) => sum + (getComponent(id)?.reliabilityBonus ?? 0),
    0,
  )
}

/**
 * Fiabilité (§18.8) :
 * `fiabilité lanceur − risques mission + bonus orientation + bonus blindage`,
 * bornée entre 0 et 100.
 */
export function reliability(
  launcherId: string,
  componentIds: string[],
  riskModifier = 0,
): number {
  const launcher = getLauncher(launcherId)
  if (!launcher) return 0
  const value = launcher.reliability - riskModifier + componentReliabilityBonus(componentIds)
  return Math.max(0, Math.min(100, Math.round(value)))
}

export { getLauncher }

import { getComponent } from '../data/components'

export function totalMass(componentIds: string[]): number {
  return componentIds.reduce((total, id) => total + (getComponent(id)?.mass ?? 0), 0)
}

export function isMassOk(componentIds: string[], capacityMass: number): boolean {
  return totalMass(componentIds) <= capacityMass
}

export function massUsage(componentIds: string[], capacityMass: number): number {
  if (capacityMass <= 0) return 0
  return totalMass(componentIds) / capacityMass
}

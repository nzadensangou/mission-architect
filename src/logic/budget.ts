import { COMPONENT_MAP, getComponent } from '../data/components'

function countByCategory(componentIds: string[], category: string): number {
  return componentIds.reduce((total, id) => {
    const component = COMPONENT_MAP[id]
    return component && component.category === category ? total + 1 : total
  }, 0)
}

export function componentsCost(componentIds: string[]): number {
  return componentIds.reduce((total, id) => total + (getComponent(id)?.cost ?? 0), 0)
}

export function remainingBudget(
  budgetInitial: number,
  launcherCost: number,
  componentIds: string[],
): number {
  return round1(budgetInitial - launcherCost - componentsCost(componentIds))
}

export function isBudgetOk(
  budgetInitial: number,
  launcherCost: number,
  componentIds: string[],
): boolean {
  return remainingBudget(budgetInitial, launcherCost, componentIds) >= 0
}

export function batteryCapacity(componentIds: string[]): number {
  return componentIds.reduce((total, id) => total + (getComponent(id)?.batteryCapacity ?? 0), 0)
}

export function spreadCount(componentIds: string[], category: string): number {
  return countByCategory(componentIds, category)
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10
}

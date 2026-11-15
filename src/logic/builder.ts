import { getComponent } from '../data/components'
import { getLauncher } from '../data/launchers'
import { BUILDER_HELP } from '../data/messages'
import { summarizeEnergy } from './energy'
import { isBudgetOk } from './budget'
import { isMassOk } from './mass'
import { reliability } from './reliability'

export type IssueCode = keyof typeof BUILDER_HELP

export interface BuildValidation {
  ok: boolean
  issues: IssueCode[]
  messages: string[]
}

function hasCategory(componentIds: string[], category: string): boolean {
  return componentIds.some((id) => getComponent(id)?.category === category)
}

export function validateBuild(
  componentIds: string[],
  launcherId: string,
  budgetInitial: number,
): BuildValidation {
  const issues: IssueCode[] = []
  const launcher = getLauncher(launcherId)

  if (!hasCategory(componentIds, 'structure')) issues.push('missingStructure')
  if (!hasCategory(componentIds, 'camera')) issues.push('missingCamera')
  if (!hasCategory(componentIds, 'antenna')) issues.push('missingAntenna')
  if (!hasCategory(componentIds, 'battery')) issues.push('missingBattery')
  if (!hasCategory(componentIds, 'energy')) issues.push('missingSolar')
  if (!hasCategory(componentIds, 'attitude')) issues.push('missingOrientation')

  if (launcher) {
    if (!isMassOk(componentIds, launcher.payloadCapacity)) issues.push('massExceeded')
    if (!isBudgetOk(budgetInitial, launcher.cost, componentIds)) issues.push('budgetExceeded')
  }

  const energy = summarizeEnergy(componentIds, {
    cameraStatus: 'active',
    antennaStatus: 'active',
    powerMode: 'normal',
    reinforcedObservation: false,
    effects: [],
  })
  if (energy.netDaily < 0) issues.push('energyInsufficient')

  return {
    ok: issues.length === 0,
    issues,
    messages: issues.map((code) => BUILDER_HELP[code]),
  }
}

export type AddBlockedReason = 'unknown' | 'limit' | 'replace'

export interface AddDecision {
  allowed: boolean
  reason?: AddBlockedReason
  replaces?: string
}

/** Vérifie si un composant peut être ajouté (limites et unicité de catégorie) */
export function canAddComponent(componentId: string, componentIds: string[]): AddDecision {
  const component = getComponent(componentId)
  if (!component) return { allowed: false, reason: 'unknown' }

  const count = componentIds.filter((id) => id === componentId).length
  if (count >= component.maxQuantity) return { allowed: false, reason: 'limit' }

  if (component.category === 'camera' || component.category === 'antenna') {
    const existing = componentIds.find(
      (id) => id !== componentId && getComponent(id)?.category === component.category,
    )
    if (existing) return { allowed: false, reason: 'replace', replaces: existing }
  }

  return { allowed: true }
}

export function designReliability(componentIds: string[], launcherId: string): number {
  return reliability(launcherId, componentIds)
}

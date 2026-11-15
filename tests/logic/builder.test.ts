import { describe, expect, it } from 'vitest'
import { canAddComponent, validateBuild } from '../../src/logic/builder'
import { totalMass } from '../../src/logic/mass'
import { remainingBudget } from '../../src/logic/budget'
import { REFERENCE_BUILD, LIGHT_BUILD } from '../fixtures'

describe('construction', () => {
  it('valide la configuration de référence (cloud 400 kg, budget 80 M$)', () => {
    const result = validateBuild(REFERENCE_BUILD, 'moyen', 80)
    expect(result.ok).toBe(true)
    expect(result.issues).toEqual([])
    expect(totalMass(REFERENCE_BUILD)).toBe(165)
    expect(remainingBudget(80, 32, REFERENCE_BUILD)).toBe(8)
  })

  it('détecte le dépassement de masse avec le lanceur léger', () => {
    const result = validateBuild(REFERENCE_BUILD, 'leger', 80)
    expect(result.ok).toBe(false)
    expect(result.issues).toContain('massExceeded')
  })

  it('détecte le dépassement de budget avec le lanceur lourd', () => {
    const result = validateBuild(REFERENCE_BUILD, 'lourd', 80)
    expect(result.ok).toBe(false)
    expect(result.issues).toContain('budgetExceeded')
  })

  it('détecte une production énergétique insuffisante', () => {
    const result = validateBuild(LIGHT_BUILD, 'moyen', 80)
    expect(result.issues).toContain('energyInsufficient')
  })

  it('signale tous les modules obligatoires manquants', () => {
    const result = validateBuild([], 'moyen', 80)
    expect(result.ok).toBe(false)
    expect(result.issues).toEqual(
      expect.arrayContaining([
        'missingStructure',
        'missingCamera',
        'missingAntenna',
        'missingBattery',
        'missingSolar',
        'missingOrientation',
      ]),
    )
  })

  it('refuse un quatrième panneau solaire', () => {
    const full = [...REFERENCE_BUILD, 'panneau-standard']
    expect(canAddComponent('panneau-standard', full)).toMatchObject({ allowed: false, reason: 'limit' })
  })

  it('propose le remplacement d’une caméra déjà installée', () => {
    expect(canAddComponent('camera-avancee', REFERENCE_BUILD)).toMatchObject({
      allowed: false,
      reason: 'replace',
      replaces: 'camera-standard',
    })
  })

  it('autorise l’ajout d’un blindage', () => {
    expect(canAddComponent('blindage', REFERENCE_BUILD).allowed).toBe(true)
  })
})

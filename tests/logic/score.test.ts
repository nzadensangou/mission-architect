import { describe, expect, it } from 'vitest'
import { createMission } from '../../src/logic/simulation'
import { computeScore, scoreBreakdown } from '../../src/logic/score'
import { getMissionDefinition } from '../../src/data/missions'
import { REFERENCE_BUILD } from '../fixtures'

const definition = getMissionDefinition('observer-la-terre')!

describe('score', () => {
  it('atteint 82/100 sur le scénario de référence du document', () => {
    const base = createMission(definition, 'moyen', REFERENCE_BUILD)
    const mission = {
      ...base,
      status: 'reussie' as const,
      currentDay: 30,
      observations: 600,
      transmittedData: 600,
      budgetRestant: 8,
    }
    expect(scoreBreakdown(mission).total).toBe(82)
    expect(computeScore(mission)).toBe(82)
    expect(scoreBreakdown(mission).rank).toBe('Commandeur de mission')
  })

  it('plafonne chaque composante à 1', () => {
    const base = createMission(definition, 'moyen', REFERENCE_BUILD)
    const mission = {
      ...base,
      observations: 9999,
      transmittedData: 9999,
      budgetRestant: 9999,
      reliability: 120,
    }
    const breakdown = scoreBreakdown(mission)
    expect(breakdown.observations).toBe(1)
    expect(breakdown.transmission).toBe(1)
    expect(breakdown.budget).toBe(1)
    expect(breakdown.reliability).toBe(1)
    expect(breakdown.total).toBe(100)
  })

  it('attribue les rangs attendus', () => {
    expect(scoreBreakdown({ ...createMission(definition, 'moyen', REFERENCE_BUILD), observations: 0, transmittedData: 0, budgetRestant: 0, reliability: 0 }).rank).toBe(
      'Cadet spatial',
    )
  })
})

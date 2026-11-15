import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import {
  advanceDay,
  applyChoice,
  createMission,
  nextEventKey,
  restartMission,
  step,
} from '../../src/logic/simulation'
import { getEvent } from '../../src/data/events'
import { getMissionDefinition } from '../../src/data/missions'
import { REFERENCE_BUILD } from '../fixtures'

const definition = getMissionDefinition('observer-la-terre')!

function play(mission: ReturnType<typeof createMission>, maxSteps = 400) {
  let current = mission
  for (let i = 0; i < maxSteps && current.status === 'en_cours'; i += 1) {
    if (current.activeEventId) {
      const event = getEvent(current.activeEventId)!
      current = applyChoice(current, event.choices[0].id).mission
    } else {
      current = step(current)
    }
  }
  return current
}

beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0.99)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('simulation', () => {
  it('termine les 30 jours avec la configuration de référence', () => {
    const mission = play(createMission(definition, 'moyen', REFERENCE_BUILD))
    expect(mission.status).toBe('reussie')
    expect(mission.currentDay).toBe(30)
    expect(mission.observations).toBeGreaterThanOrEqual(600)
    expect(mission.score).toBeGreaterThan(0)
    expect(mission.rank).toBeTruthy()
  })

  it('résout les deux événements du jour 22 (collision de file)', () => {
    const mission = play(createMission(definition, 'moyen', REFERENCE_BUILD))
    expect(mission.resolvedEventIds).toContain('ombre')
    expect(mission.resolvedEventIds).toContain('opportunite-scientifique')
    expect(mission.activeEventId).toBeUndefined()
  })

  it('force la caméra à l’arrêt quand la batterie est vide', () => {
    const base = createMission(definition, 'moyen', REFERENCE_BUILD)
    const strained = {
      ...base,
      battery: 0,
      activeEffects: [
        {
          id: 'test-eco',
          type: 'energy_consumption' as const,
          value: 2.5,
          daysLeft: 1,
          source: 'test',
        },
      ],
    }
    const next = advanceDay(strained)
    expect(next.battery).toBe(0)
    expect(next.cameraStatus).toBe('off')
    expect(next.history[0].observations).toBe(0)
    expect(next.journal.some((entry) => entry.message.includes('caméra est arrêtée'))).toBe(true)
  })

  it('échoue avec une cause explicite quand la batterie reste vide', () => {
    const noBattery = ['structure', 'panneau-standard', 'panneau-standard', 'camera-standard', 'antenne-standard', 'orientation']
    const mission = play(createMission(definition, 'moyen', noBattery))
    expect(mission.status).toBe('echouee')
    expect(mission.failureReason).toContain('Batterie vide')
    expect(mission.score).toBeDefined()
    expect(mission.journal.at(-1)?.tone).toBe('bad')
  })

  it('propose le premier événement planifié puis avance la journée', () => {
    const base = createMission(definition, 'moyen', REFERENCE_BUILD)
    expect(nextEventKey(base)).toBeNull()
    const day1 = advanceDay(base)
    expect(nextEventKey(day1)).toBe('ombre@2')
    const withEvent = step(day1)
    expect(withEvent.activeEventId).toBeTruthy()
    expect(withEvent.currentDay).toBe(1)
    const resolved = applyChoice(withEvent, withEvent.activeEventId === 'ombre' ? 'economiser' : 'continuer')
    expect(resolved.mission.activeEventId).toBeUndefined()
    expect(resolved.mission.currentDay).toBe(2)
  })

  it('relance une mission identique après échec', () => {
    const failed = { ...createMission(definition, 'moyen', REFERENCE_BUILD), status: 'echouee' as const, currentDay: 9, observations: 120 }
    const restarted = restartMission(failed)
    expect(restarted.status).toBe('en_cours')
    expect(restarted.currentDay).toBe(0)
    expect(restarted.observations).toBe(0)
    expect(restarted.battery).toBe(restarted.batteryCapacity)
    expect(restarted.eventQueue.length).toBeGreaterThan(0)
  })
})

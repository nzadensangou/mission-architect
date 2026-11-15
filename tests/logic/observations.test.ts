import { describe, expect, it } from 'vitest'
import { observationsForDay } from '../../src/logic/observations'
import { REFERENCE_BUILD } from '../fixtures'

const base = {
  cameraStatus: 'active' as const,
  reinforcedObservation: false,
  effects: [],
}

describe('observations', () => {
  it('produit 25 observations par jour avec caméra standard et orientation', () => {
    expect(observationsForDay(REFERENCE_BUILD, base)).toBe(25)
  })

  it('divise par deux avec une caméra réduite', () => {
    expect(observationsForDay(REFERENCE_BUILD, { ...base, cameraStatus: 'reduced' })).toBe(15)
  })

  it('ne produit rien caméra arrêtée', () => {
    expect(observationsForDay(REFERENCE_BUILD, { ...base, cameraStatus: 'off' })).toBe(0)
  })

  it('applique la pénalité de panne caméra', () => {
    const broken = observationsForDay(REFERENCE_BUILD, {
      ...base,
      effects: [{ id: 'panne', type: 'observations', value: 0.5, daysLeft: 2, source: 'panne-camera' }],
    })
    expect(broken).toBe(13)
  })

  it('applique l’observation renforcée', () => {
    expect(observationsForDay(REFERENCE_BUILD, { ...base, reinforcedObservation: true })).toBe(38)
  })
})

import { describe, expect, it } from 'vitest'
import { summarizeEnergy, summarizeEnergy as energySummary } from '../../src/logic/energy'
import { REFERENCE_BUILD, LIGHT_BUILD } from '../fixtures'

const context = {
  cameraStatus: 'active' as const,
  antennaStatus: 'active' as const,
  powerMode: 'normal' as const,
  reinforcedObservation: false,
  effects: [],
}

describe('énergie', () => {
  it('reproduit la configuration de référence du document (+19,2 kWh/jour)', () => {
    const summary = summarizeEnergy(REFERENCE_BUILD, context)
    expect(summary.nominalProduction).toBe(3)
    expect(summary.production).toBe(1.8)
    expect(summary.consumption).toBe(1)
    expect(summary.netDaily).toBe(19.2)
  })

  it('refuse un satellite sous-énergétique avec un seul panneau', () => {
    expect(energySummary(LIGHT_BUILD, context).netDaily).toBeLessThan(0)
  })

  it('applique le mode économie (−45 % de consommation)', () => {
    const eco = summarizeEnergy(REFERENCE_BUILD, { ...context, powerMode: 'eco' })
    expect(eco.consumption).toBe(0.6)
    expect(eco.netDaily).toBeGreaterThan(19.2)
  })

  it('applique un modificateur de production événementiel', () => {
    const storm = summarizeEnergy(REFERENCE_BUILD, {
      ...context,
      effects: [
        { id: 'storm', type: 'energy_production', value: 0.5, daysLeft: 3, source: 'tempete' },
      ],
    })
    expect(storm.production).toBe(0.9)
    expect(storm.netDaily).toBe(-2.4)
  })

  it('annule la consommation de la caméra lorsqu’elle est arrêtée', () => {
    const off = summarizeEnergy(REFERENCE_BUILD, { ...context, cameraStatus: 'off' })
    expect(off.consumption).toBe(0.6)
  })
})

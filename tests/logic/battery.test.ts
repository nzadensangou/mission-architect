import { describe, expect, it } from 'vitest'
import { applyDailyEnergy, batteryPercent, clampBattery, isEmpty } from '../../src/logic/battery'

describe('batterie', () => {
  it('borne la charge entre 0 et la capacité', () => {
    expect(clampBattery(15, 10)).toBe(10)
    expect(clampBattery(-4, 10)).toBe(0)
  })

  it('ajoute l’énergie nette journalière', () => {
    expect(applyDailyEnergy(5, 2.5, 10)).toBe(7.5)
  })

  it('détecte une batterie vide', () => {
    const empty = applyDailyEnergy(10, -20.4, 10)
    expect(empty).toBe(0)
    expect(isEmpty(empty)).toBe(true)
  })

  it('calcule le pourcentage affiché', () => {
    expect(batteryPercent(5, 10)).toBe(50)
  })
})

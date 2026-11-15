import { describe, expect, it } from 'vitest'
import { transmissionCapacity, transmit } from '../../src/logic/communication'

describe('communication', () => {
  it('transmet 70 données par jour avec l’antenne standard', () => {
    expect(transmissionCapacity(['antenne-standard'], 'active', [])).toBe(70)
  })

  it('transmet 110 données par jour avec l’antenne renforcée', () => {
    expect(transmissionCapacity(['antenne-renforcee'], 'active', [])).toBe(110)
  })

  it('divise la capacité par deux en mode réduit', () => {
    expect(transmissionCapacity(['antenne-standard'], 'reduced', [])).toBe(35)
  })

  it('ne transmet rien antenne éteinte', () => {
    expect(transmissionCapacity(['antenne-standard'], 'off', [])).toBe(0)
  })

  it('limite la transmission à la capacité et garde le surplus en attente', () => {
    expect(transmit(10, 25, 70)).toEqual({ transmitted: 35, pending: 0 })
    expect(transmit(50, 25, 70)).toEqual({ transmitted: 70, pending: 5 })
  })

  it('garde tout en attente si la capacité est nulle', () => {
    expect(transmit(30, 20, 0)).toEqual({ transmitted: 0, pending: 50 })
  })
})

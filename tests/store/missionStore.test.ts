import { beforeEach, describe, expect, it } from 'vitest'
import { useMissionStore } from '../../src/store/missionStore'
import { DEFAULT_OPTIONS, useOptionsStore } from '../../src/store/optionsStore'

function resetMissionStore() {
  useMissionStore.setState({ mission: null, running: false, lastOutcome: null, speed: 'normal' })
}

describe('missionStore', () => {
  beforeEach(() => {
    resetMissionStore()
    window.localStorage.clear()
  })

  it('crée une nouvelle mission avec le budget de la définition', () => {
    useMissionStore.getState().startNewMission('observer-la-terre')
    const mission = useMissionStore.getState().mission
    expect(mission?.budgetInitial).toBe(80)
    expect(mission?.components).toEqual([])
    expect(mission?.totalDays).toBe(30)
  })

  it('ajoute des composants et recalcule masse, budget et énergie', () => {
    const store = useMissionStore.getState()
    store.startNewMission('observer-la-terre')
    store.chooseLauncher('moyen')
    for (const id of ['structure', 'panneau-standard', 'panneau-standard', 'batterie-standard', 'camera-standard', 'antenne-standard', 'orientation']) {
      useMissionStore.getState().addComponent(id)
    }
    const mission = useMissionStore.getState().mission!
    expect(mission.totalMass).toBe(165)
    expect(mission.budgetRestant).toBe(8)
    expect(mission.energy).toBe(19.2)
    expect(mission.reliability).toBe(99)
    expect(mission.battery).toBe(10)
  })

  it('ignore un composant au-delà de sa limite', () => {
    const store = useMissionStore.getState()
    store.startNewMission('observer-la-terre')
    useMissionStore.getState().addComponent('batterie-standard')
    useMissionStore.getState().addComponent('batterie-standard')
    useMissionStore.getState().addComponent('batterie-standard')
    useMissionStore.getState().addComponent('batterie-standard')
    expect(useMissionStore.getState().mission!.components.filter((id) => id === 'batterie-standard')).toHaveLength(3)
  })

  it('remplace la caméra standard par la caméra avancée', () => {
    const store = useMissionStore.getState()
    store.startNewMission('observer-la-terre')
    useMissionStore.getState().addComponent('camera-standard')
    useMissionStore.getState().replaceComponent('camera-avancee')
    const components = useMissionStore.getState().mission!.components
    expect(components).toContain('camera-avancee')
    expect(components).not.toContain('camera-standard')
  })

  it('lance la mission en repartant d’une batterie pleine', () => {
    const store = useMissionStore.getState()
    store.startNewMission('observer-la-terre')
    useMissionStore.getState().chooseLauncher('moyen')
    for (const id of ['structure', 'panneau-standard', 'panneau-standard', 'batterie-standard', 'camera-standard', 'antenne-standard', 'orientation']) {
      useMissionStore.getState().addComponent(id)
    }
    useMissionStore.getState().launch()
    const state = useMissionStore.getState()
    expect(state.running).toBe(true)
    expect(state.mission!.status).toBe('en_cours')
    expect(state.mission!.battery).toBe(10)
    expect(state.mission!.observations).toBe(0)
  })

  it('conserve la mission dans localStorage', () => {
    useMissionStore.getState().startNewMission('observer-la-terre')
    const raw = window.localStorage.getItem('missionActive')
    expect(raw).toContain('observer-la-terre')
  })

  it('abandonne la mission avec un score', () => {
    useMissionStore.getState().startNewMission('observer-la-terre')
    useMissionStore.getState().abandon()
    const mission = useMissionStore.getState().mission!
    expect(mission.status).toBe('abandonnee')
    expect(mission.score).toBeDefined()
    expect(useMissionStore.getState().running).toBe(false)
  })
})

describe('optionsStore', () => {
  beforeEach(() => {
    useOptionsStore.setState({ options: DEFAULT_OPTIONS })
    window.localStorage.clear()
  })

  it('applique et persiste les options', () => {
    useOptionsStore.getState().setOption('theme', 'light')
    useOptionsStore.getState().setOption('textSize', 'large')
    expect(useOptionsStore.getState().options.theme).toBe('light')
    expect(useOptionsStore.getState().options.textSize).toBe('large')
    expect(window.localStorage.getItem('options')).toContain('"theme":"light"')
  })
})

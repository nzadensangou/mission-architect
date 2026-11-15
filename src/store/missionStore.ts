import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getComponent } from '../data/components'
import { getLauncher } from '../data/launchers'
import { getMissionDefinition } from '../data/missions'
import type { CameraStatus, AntennaStatus, Mission, PowerMode } from '../types'
import type { SpeedId } from '../logic/config'
import { remainingBudget } from '../logic/budget'
import { totalMass } from '../logic/mass'
import { reliability } from '../logic/reliability'
import { summarizeEnergy } from '../logic/energy'
import { abandonMission, applyChoice, createMission, restartMission, step } from '../logic/simulation'
import { canAddComponent } from '../logic/builder'

interface MissionState {
  mission: Mission | null
  speed: SpeedId
  running: boolean
  lastOutcome: 'applied' | 'failed' | null

  startNewMission: (missionId: string) => void
  chooseLauncher: (launcherId: string) => void
  addComponent: (componentId: string) => void
  replaceComponent: (componentId: string) => void
  removeComponent: (componentId: string) => void
  launch: () => void
  tick: () => void
  resolveEvent: (choiceId: string) => void
  abandon: () => void
  restart: () => void
  deleteMission: () => void
  setSpeed: (speed: SpeedId) => void
  setRunning: (running: boolean) => void
  togglePause: () => void
  setCameraStatus: (status: CameraStatus) => void
  setAntennaStatus: (status: AntennaStatus) => void
  setPowerMode: (mode: PowerMode) => void
  toggleReinforcedObservation: () => void
  attemptRepair: () => void
}

/**
 * Recalcule tous les indicateurs dérivés de la conception.
 * `resetBattery` remet la batterie à pleine capacité (avant lancement).
 */
function recomputeDesign(mission: Mission, options: { resetBattery?: boolean } = {}): Mission {
  const launcher = getLauncher(mission.launcherId)
  const components = mission.components
  const capacity = components.reduce(
    (sum, id) => sum + (getComponent(id)?.batteryCapacity ?? 0),
    0,
  )
  const energy = summarizeEnergy(components, {
    cameraStatus: mission.cameraStatus,
    antennaStatus: mission.antennaStatus,
    powerMode: mission.powerMode,
    reinforcedObservation: mission.reinforcedObservation,
    effects: mission.activeEffects,
  }).netDaily

  const batteryCapacity = capacity > 0 ? capacity : mission.batteryCapacity
  const battery = options.resetBattery
    ? batteryCapacity
    : Math.min(mission.battery, batteryCapacity)

  return {
    ...mission,
    capacityMass: launcher?.payloadCapacity ?? mission.capacityMass,
    totalMass: totalMass(components),
    budgetRestant: remainingBudget(mission.budgetInitial, launcher?.cost ?? 0, components),
    reliability: launcher ? reliability(launcher.id, components) : mission.reliability,
    batteryCapacity,
    battery,
    energy,
    updatedAt: new Date().toISOString(),
  }
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      mission: null,
      speed: 'normal',
      running: false,
      lastOutcome: null,

      startNewMission: (missionId) => {
        const definition = getMissionDefinition(missionId)
        if (!definition) return
        set({
          mission: createMission(definition, '', []),
          running: false,
          lastOutcome: null,
        })
      },

      chooseLauncher: (launcherId) => {
        const { mission } = get()
        if (!mission) return
        set({ mission: recomputeDesign({ ...mission, launcherId }, { resetBattery: true }) })
      },

      addComponent: (componentId) => {
        const { mission } = get()
        if (!mission) return
        if (!canAddComponent(componentId, mission.components).allowed) return
        set({
          mission: recomputeDesign(
            { ...mission, components: [...mission.components, componentId] },
            { resetBattery: true },
          ),
        })
      },

      replaceComponent: (componentId) => {
        const { mission } = get()
        if (!mission) return
        const component = getComponent(componentId)
        if (!component) return
        const components = mission.components.filter(
          (id) => getComponent(id)?.category !== component.category,
        )
        components.push(componentId)
        set({ mission: recomputeDesign({ ...mission, components }, { resetBattery: true }) })
      },

      removeComponent: (componentId) => {
        const { mission } = get()
        if (!mission) return
        const index = mission.components.lastIndexOf(componentId)
        if (index === -1) return
        const components = [...mission.components]
        components.splice(index, 1)
        set({ mission: recomputeDesign({ ...mission, components }, { resetBattery: true }) })
      },

      launch: () => {
        const { mission } = get()
        if (!mission) return
        const launched: Mission = {
          ...mission,
          status: 'en_cours',
          currentDay: 0,
          battery: mission.batteryCapacity,
          observations: 0,
          pendingData: 0,
          transmittedData: 0,
          health: 100,
          cameraStatus: 'active',
          antennaStatus: 'active',
          powerMode: 'normal',
          reinforcedObservation: false,
          emptyBatteryStreak: 0,
          noTransmissionStreak: 0,
          activeEffects: [],
          resolvedEventIds: [],
          activeEventId: undefined,
          history: [],
          score: undefined,
          rank: undefined,
          failureReason: undefined,
          journal: [
            ...mission.journal,
            {
              id: `launch-${Date.now()}`,
              day: 0,
              tone: 'good',
              message: 'Décollage. Satellite en orbite, mission engagée.',
            },
          ],
        }
        set({ mission: launched, running: true })
      },

      tick: () => {
        const { mission, running } = get()
        if (!mission || !running) return
        const next = step(mission)
        if (next !== mission) set({ mission: next })
      },

      resolveEvent: (choiceId) => {
        const { mission } = get()
        if (!mission) return
        const result = applyChoice(mission, choiceId)
        set({ mission: result.mission, lastOutcome: result.outcome })
      },

      abandon: () => {
        const { mission } = get()
        if (!mission) return
        set({ mission: abandonMission(mission), running: false })
      },

      deleteMission: () => set({ mission: null, running: false, lastOutcome: null }),

      restart: () => {
        const { mission } = get()
        if (!mission) return
        set({ mission: restartMission(mission), running: true, lastOutcome: null })
      },

      setSpeed: (speed) => set({ speed }),
      setRunning: (running) => set({ running }),
      togglePause: () => set((state) => ({ running: !state.running })),

      setCameraStatus: (status) => {
        const { mission } = get()
        if (!mission) return
        set({ mission: recomputeDesign({ ...mission, cameraStatus: status, cameraForcedOff: false }) })
      },

      setAntennaStatus: (status) => {
        const { mission } = get()
        if (!mission) return
        set({ mission: recomputeDesign({ ...mission, antennaStatus: status }) })
      },

      setPowerMode: (mode) => {
        const { mission } = get()
        if (!mission) return
        set({ mission: recomputeDesign({ ...mission, powerMode: mode }) })
      },

      toggleReinforcedObservation: () => {
        const { mission } = get()
        if (!mission) return
        set({
          mission: recomputeDesign({
            ...mission,
            reinforcedObservation: !mission.reinforcedObservation,
          }),
        })
      },

      attemptRepair: () => {
        const { mission } = get()
        if (!mission) return
        if (mission.health >= 100) return
        const success = Math.random() < 0.6
        const health = success
          ? Math.min(100, mission.health + 20)
          : Math.max(0, mission.health - 5)
        set({
          mission: {
            ...mission,
            health,
            journal: [
              ...mission.journal,
              {
                id: `repair-${Date.now()}`,
                day: mission.currentDay,
                tone: success ? 'good' : 'bad',
                message: success
                  ? 'Réparation réussie : santé +20 %.'
                  : 'Réparation échouée : santé −5 %.',
              },
            ],
          },
        })
      },
    }),
    {
      name: 'missionActive',
      partialize: (state) => ({ mission: state.mission, speed: state.speed }),
    },
  ),
)

import { useMissionStore } from '../store/missionStore'
import { getLauncher } from '../data/launchers'
import { getMissionDefinition } from '../data/missions'
import { batteryPercent } from '../logic/battery'
import { summarizeEnergy } from '../logic/energy'
import { transmissionCapacity } from '../logic/communication'
import { observationsForDay } from '../logic/observations'
import { validateBuild } from '../logic/builder'
import type { Mission } from '../types'

export function useMission(): Mission | null {
  return useMissionStore((state) => state.mission)
}

export interface MissionDerived {
  launcherName: string
  missionTitle: string
  batteryPercent: number
  energySummary: ReturnType<typeof summarizeEnergy>
  transmission: number
  observationsPerDay: number
  validation: ReturnType<typeof validateBuild>
}

export function useMissionDerived(mission: Mission | null): MissionDerived | null {
  if (!mission) return null

  const launcher = getLauncher(mission.launcherId)
  const definition = getMissionDefinition(mission.missionId)
  const energySummary = summarizeEnergy(mission.components, {
    cameraStatus: mission.cameraStatus,
    antennaStatus: mission.antennaStatus,
    powerMode: mission.powerMode,
    reinforcedObservation: mission.reinforcedObservation,
    effects: mission.activeEffects,
  })

  return {
    launcherName: launcher?.name ?? 'Aucun lanceur',
    missionTitle: definition?.title ?? mission.title,
    batteryPercent: batteryPercent(mission.battery, mission.batteryCapacity),
    energySummary,
    transmission: transmissionCapacity(
      mission.components,
      mission.antennaStatus,
      mission.activeEffects,
    ),
    observationsPerDay: observationsForDay(mission.components, {
      cameraStatus: mission.cameraStatus,
      reinforcedObservation: mission.reinforcedObservation,
      effects: mission.activeEffects,
    }),
    validation: validateBuild(mission.components, mission.launcherId, mission.budgetInitial),
  }
}

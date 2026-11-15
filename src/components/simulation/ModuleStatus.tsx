import { Camera, Radio, GaugeCircle } from 'lucide-react'
import type { Mission } from '../../types'
import { observationsForDay } from '../../logic/observations'
import { transmissionCapacity } from '../../logic/communication'
import { useMissionStore } from '../../store/missionStore'
import { audio } from '../../utils/audio'

const CAMERA_LABELS = { active: 'Activée', reduced: 'Réduite', off: 'Arrêtée' } as const
const ANTENNA_LABELS = { active: 'Activée', reduced: 'Réduite', off: 'Arrêtée' } as const

export function ModuleStatus({ mission }: { mission: Mission }) {
  const setCameraStatus = useMissionStore((state) => state.setCameraStatus)
  const setAntennaStatus = useMissionStore((state) => state.setAntennaStatus)
  const setPowerMode = useMissionStore((state) => state.setPowerMode)

  const observations = observationsForDay(mission.components, {
    cameraStatus: mission.cameraStatus,
    reinforcedObservation: mission.reinforcedObservation,
    effects: mission.activeEffects,
  })
  const capacity = transmissionCapacity(mission.components, mission.antennaStatus, mission.activeEffects)

  const cycle = <T extends string>(values: T[], current: T): T =>
    values[(values.indexOf(current) + 1) % values.length]

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-panel-alt/60 px-3 py-2.5">
        <span className="flex items-center gap-2 text-sm">
          <Camera className="h-4 w-4 text-primary" aria-hidden="true" />
          Caméra
          <span className="tag tag-muted">{CAMERA_LABELS[mission.cameraStatus]}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted">{observations}/j</span>
          <button
            type="button"
            className="btn btn-ghost px-2.5 py-1.5 text-xs"
            onClick={() => {
              audio.play('click')
              const next = cycle(['active', 'reduced', 'off'] as const, mission.cameraStatus)
              setCameraStatus(next)
            }}
          >
            Changer
          </button>
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-panel-alt/60 px-3 py-2.5">
        <span className="flex items-center gap-2 text-sm">
          <Radio className="h-4 w-4 text-accent" aria-hidden="true" />
          Antenne
          <span className="tag tag-muted">{ANTENNA_LABELS[mission.antennaStatus]}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted">{capacity}/j</span>
          <button
            type="button"
            className="btn btn-ghost px-2.5 py-1.5 text-xs"
            onClick={() => {
              audio.play('click')
              const next = cycle(['active', 'reduced', 'off'] as const, mission.antennaStatus)
              setAntennaStatus(next)
            }}
          >
            Changer
          </button>
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-panel-alt/60 px-3 py-2.5">
        <span className="flex items-center gap-2 text-sm">
          <GaugeCircle className="h-4 w-4 text-warning" aria-hidden="true" />
          Mode
          <span className={`tag ${mission.powerMode === 'eco' ? 'tag-ok' : 'tag-muted'}`}>
            {mission.powerMode === 'eco' ? 'Économie' : 'Normal'}
          </span>
        </span>
        <button
          type="button"
          className="btn btn-ghost px-2.5 py-1.5 text-xs"
          onClick={() => {
            audio.play('click')
            setPowerMode(mission.powerMode === 'eco' ? 'normal' : 'eco')
          }}
        >
          {mission.powerMode === 'eco' ? 'Mode normal' : 'Mode économie'}
        </button>
      </div>
    </div>
  )
}

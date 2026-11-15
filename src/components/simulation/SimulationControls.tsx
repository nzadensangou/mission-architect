import { Pause, Play, FastForward, Wrench, Telescope, Flag } from 'lucide-react'
import { SPEEDS, type SpeedId } from '../../logic/config'
import type { Mission } from '../../types'
import { useMissionStore } from '../../store/missionStore'
import { audio } from '../../utils/audio'
import { useState } from 'react'
import { Modal } from '../ui/Modal'

interface SimulationControlsProps {
  mission: Mission
}

export function SimulationControls({ mission }: SimulationControlsProps) {
  const running = useMissionStore((state) => state.running)
  const speed = useMissionStore((state) => state.speed)
  const setSpeed = useMissionStore((state) => state.setSpeed)
  const togglePause = useMissionStore((state) => state.togglePause)
  const toggleReinforced = useMissionStore((state) => state.toggleReinforcedObservation)
  const attemptRepair = useMissionStore((state) => state.attemptRepair)
  const abandon = useMissionStore((state) => state.abandon)

  const [abandonOpen, setAbandonOpen] = useState(false)

  const nextSpeed = (): SpeedId => {
    const index = SPEEDS.findIndex((entry) => entry.id === speed)
    return SPEEDS[(index + 1) % SPEEDS.length].id
  }

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn flex-1"
          onClick={() => {
            audio.play('click')
            togglePause()
          }}
          aria-pressed={!running}
        >
          {running ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          {running ? 'Pause' : 'Reprendre'}
        </button>

        <button
          type="button"
          className="btn flex-1"
          onClick={() => {
            audio.play('click')
            setSpeed(nextSpeed())
          }}
        >
          <FastForward className="h-4 w-4" aria-hidden="true" />
          {SPEEDS.find((entry) => entry.id === speed)?.label}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`btn flex-1 text-sm ${mission.reinforcedObservation ? 'btn-primary' : ''}`}
          onClick={() => {
            audio.play('click')
            toggleReinforced()
          }}
          aria-pressed={mission.reinforcedObservation}
        >
          <Telescope className="h-4 w-4" aria-hidden="true" />
          {mission.reinforcedObservation ? 'Observation renforcée' : 'Renforcer l’observation'}
        </button>

        <button
          type="button"
          className="btn flex-1 text-sm"
          onClick={() => {
            audio.play('click')
            attemptRepair()
          }}
          disabled={mission.health >= 100}
        >
          <Wrench className="h-4 w-4" aria-hidden="true" />
          Réparer
        </button>
      </div>

      <button type="button" className="btn btn-danger w-full text-sm" onClick={() => setAbandonOpen(true)}>
        <Flag className="h-4 w-4" aria-hidden="true" />
        Abandonner la mission
      </button>

      <Modal
        open={abandonOpen}
        title="Abandonner la mission ?"
        onClose={() => setAbandonOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setAbandonOpen(false)}>
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                abandon()
                setAbandonOpen(false)
              }}
            >
              Oui, abandonner
            </button>
          </>
        }
      >
        <p>La mission sera clôturée en échec et tu pourras consulter le rapport.</p>
      </Modal>
    </div>
  )
}

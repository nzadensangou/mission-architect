import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { OrbitView } from '../components/simulation/OrbitView'
import { SimulationHUD } from '../components/simulation/SimulationHUD'
import { ModuleStatus } from '../components/simulation/ModuleStatus'
import { MissionLog } from '../components/simulation/MissionLog'
import { EventCard } from '../components/simulation/EventCard'
import { SimulationControls } from '../components/simulation/SimulationControls'
import { useMissionStore } from '../store/missionStore'
import { getEvent } from '../data/events'
import { formatDay } from '../utils/format'
import { audio } from '../utils/audio'

export default function SimulationPage() {
  const { missionId = 'observer-la-terre' } = useParams()
  const navigate = useNavigate()
  const mission = useMissionStore((state) => state.mission)
  const running = useMissionStore((state) => state.running)
  const togglePause = useMissionStore((state) => state.togglePause)
  const resolveEvent = useMissionStore((state) => state.resolveEvent)
  const activeEventId = mission?.activeEventId
  const status = mission?.status

  useEffect(() => {
    if (!mission) {
      navigate('/mission-en-cours', { replace: true })
      return
    }
    if (mission.status !== 'en_cours') {
      navigate(`/resultat/${missionId}`, { replace: true })
    }
  }, [mission, missionId, navigate])

  useEffect(() => {
    if (!activeEventId) return
    audio.play('alert')
  }, [activeEventId])

  useEffect(() => {
    if (status === 'reussie') audio.play('success')
    if (status === 'echouee' || status === 'abandonnee') audio.play('fail')
  }, [status])

  if (!mission) return null

  const event = activeEventId ? getEvent(activeEventId) : undefined

  return (
    <div className="shell">
      <PageHeader
        eyebrow="Simulation"
        title={formatDay(mission.currentDay, mission.totalDays)}
        subtitle="Surveille l’énergie, la batterie et la transmission. Chaque décision a un coût."
        actions={
          <button
            type="button"
            className="btn"
            onClick={togglePause}
            aria-pressed={!running}
          >
            {running ? 'Pause' : 'Reprendre'}
          </button>
        }
      />

      {event ? (
        <div className="mb-4">
          <EventCard
            event={event}
            day={mission.currentDay + 1}
            onChoose={(choiceId) => {
              audio.play('click')
              resolveEvent(choiceId)
            }}
          />
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
        <div className="space-y-4">
          <section className="panel" aria-labelledby="orbit-title">
            <div className="panel-head">
              <h2 id="orbit-title" className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
                Vue orbitale
              </h2>
              <span className="font-mono text-[0.6875rem] text-muted">
                {mission.powerMode === 'eco' ? 'MODE ÉCO' : 'MODE NORMAL'} ·{' '}
                {mission.activeEffects.length} effet{mission.activeEffects.length > 1 ? 's' : ''} actif
                {mission.activeEffects.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="px-4 py-3">
              <OrbitView mission={mission} />
              {mission.activeEffects.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {mission.activeEffects.map((effect) => (
                    <li key={effect.id} className="tag tag-warn">
                      {effectLabel(effect.type)} {effect.daysLeft} j
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>

          <section className="panel" aria-labelledby="resources-title">
            <div className="panel-head">
              <h2 id="resources-title" className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
                Ressources
              </h2>
              <span className="font-mono text-[0.6875rem] text-muted">
                J{mission.currentDay}/{mission.totalDays}
              </span>
            </div>
            <div className="px-5 py-4">
              <SimulationHUD mission={mission} />
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="panel" aria-labelledby="modules-title">
            <div className="panel-head">
              <h2 id="modules-title" className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
                Modules
              </h2>
            </div>
            <div className="px-4 py-4">
              <ModuleStatus mission={mission} />
            </div>
          </section>

          <section className="panel" aria-labelledby="controls-title">
            <div className="panel-head">
              <h2 id="controls-title" className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
                Contrôles
              </h2>
            </div>
            <div className="px-4 py-4">
              <SimulationControls mission={mission} />
            </div>
          </section>

          <section className="panel">
            <MissionLog entries={mission.journal} />
          </section>
        </div>
      </div>
    </div>
  )
}

function effectLabel(type: string): string {
  switch (type) {
    case 'energy_production':
      return 'Production modifiée'
    case 'energy_consumption':
      return 'Consommation réduite'
    case 'observations':
      return 'Observations réduites'
    case 'transmission':
      return 'Transmission modifiée'
    default:
      return 'Effet'
  }
}

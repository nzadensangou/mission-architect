import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { MissionCard } from '../components/mission/MissionCard'
import { MISSIONS, isMissionPlayable } from '../data/missions'
import { useMissionStore } from '../store/missionStore'
import { audio } from '../utils/audio'

export default function NewMissionPage() {
  const navigate = useNavigate()
  const mission = useMissionStore((state) => state.mission)
  const startNewMission = useMissionStore((state) => state.startNewMission)

  const start = (missionId: string) => {
    audio.play('click')
    startNewMission(missionId)
    navigate(`/briefing/${missionId}`)
  }

  return (
    <div className="shell">
      <PageHeader
        eyebrow="Nouvelle mission"
        title="Choisis ta mission"
        subtitle="Une seule mission est disponible pour le moment. Les suivantes arriveront dans une prochaine version."
        backTo="/"
      />

      {mission ? (
        <div className="mb-5 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
          Une mission est déjà enregistrée. Démarrer une nouvelle mission la remplacera.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {MISSIONS.map((definition) => (
          <MissionCard
            key={definition.id}
            definition={definition}
            playable={isMissionPlayable(definition.id)}
            onStart={() => start(definition.id)}
          />
        ))}
      </div>
    </div>
  )
}

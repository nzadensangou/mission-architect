import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { MissionBriefing } from '../components/mission/MissionBriefing'
import { getMissionDefinition } from '../data/missions'
import { useMissionStore } from '../store/missionStore'
import { audio } from '../utils/audio'

export default function BriefingPage() {
  const { missionId = 'observer-la-terre' } = useParams()
  const navigate = useNavigate()
  const mission = useMissionStore((state) => state.mission)
  const startNewMission = useMissionStore((state) => state.startNewMission)
  const definition = getMissionDefinition(missionId)

  useEffect(() => {
    if (mission?.missionId !== missionId) startNewMission(missionId)
  }, [mission?.missionId, missionId, startNewMission])

  if (!definition) {
    navigate('/', { replace: true })
    return null
  }

  return (
    <div className="shell">
      <PageHeader
        eyebrow="Briefing"
        title="Avant de décoller"
        subtitle="Lis la mission, puis prépare ton satellite."
        backTo="/nouvelle-mission"
        backLabel="Nouvelle mission"
      />

      <div className="mx-auto max-w-3xl space-y-4">
        <MissionBriefing definition={definition} />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/nouvelle-mission')}>
            Retour
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              audio.play('click')
              navigate(`/lanceur/${missionId}`)
            }}
          >
            Commencer
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

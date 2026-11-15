import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { LauncherSelector } from '../components/mission/LauncherSelector'
import { useMissionStore } from '../store/missionStore'
import { formatMoney } from '../utils/format'
import { audio } from '../utils/audio'
import type { Launcher } from '../types'

export default function LauncherPage() {
  const { missionId = 'observer-la-terre' } = useParams()
  const navigate = useNavigate()
  const mission = useMissionStore((state) => state.mission)
  const chooseLauncher = useMissionStore((state) => state.chooseLauncher)

  if (!mission) return null

  const choose = (launcher: Launcher) => {
    audio.play('add')
    chooseLauncher(launcher.id)
    navigate(`/construction/${missionId}`)
  }

  return (
    <div className="shell">
      <PageHeader
        eyebrow="Étape 1 / 2 · Lanceur"
        title="Choisis ton lanceur"
        subtitle={`Budget disponible : ${formatMoney(mission.budgetInitial)}. Le coût du lanceur est déduit avant l’achat des modules.`}
        backTo={`/briefing/${missionId}`}
        backLabel="Briefing"
      />

      <LauncherSelector
        budget={mission.budgetInitial}
        selectedId={mission.launcherId}
        onChoose={choose}
      />

      <p className="mt-4 text-center text-xs text-muted">
        Le lanceur détermine la masse maximale embarquée et la fiabilité de base de la mission.
      </p>
    </div>
  )
}

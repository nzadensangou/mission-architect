import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Play, Trash2, PlusCircle } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Modal } from '../components/ui/Modal'
import { Stat } from '../components/ui/Stat'
import { useMissionStore } from '../store/missionStore'
import { useMissionDerived } from '../hooks/useMission'
import { formatKwh, formatMass, formatMoney } from '../utils/format'
import { audio } from '../utils/audio'

export default function ActiveMissionPage() {
  const navigate = useNavigate()
  const mission = useMissionStore((state) => state.mission)
  const derived = useMissionDerived(mission)
  const deleteMission = useMissionStore((state) => state.deleteMission)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const resumeTarget =
    mission && mission.launcherId && mission.components.length > 0
      ? `/simulation/${mission.missionId}`
      : `/construction/${mission?.missionId ?? 'observer-la-terre'}`

  if (!mission) {
    return (
      <div className="shell">
        <PageHeader title="Aucune mission en cours" backTo="/" backLabel="Retour" />
        <div className="panel mx-auto max-w-lg px-6 py-10 text-center">
          <p className="text-sm text-muted">
            Tu n’as pas encore de mission enregistrée. Crée-en une pour commencer.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/nouvelle-mission" className="btn btn-primary">
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Créer une nouvelle mission
            </Link>
            <Link to="/" className="btn btn-ghost">
              Retour
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="shell">
      <PageHeader
        eyebrow="Mission en cours"
        title={mission.title}
        subtitle="Reprends la mission là où tu l’as laissée. Toutes les données sont enregistrées sur cet appareil."
        backTo="/"
      />

      <div className="panel mx-auto max-w-3xl">
        <div className="panel-head">
          <span className="tag tag-info">
            {mission.status === 'en_cours' ? 'En cours' : mission.status}
          </span>
          <span className="font-mono text-xs text-muted">
            J{mission.currentDay} / {mission.totalDays}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 px-5 py-6 sm:grid-cols-4">
          <Stat label="Destination" value="Terre" hint="Satellite d’observation" />
          <Stat
            label="Budget"
            value={formatMoney(mission.budgetRestant)}
            hint={`sur ${formatMoney(mission.budgetInitial)}`}
            tone="primary"
          />
          <Stat
            label="Masse"
            value={formatMass(mission.totalMass)}
            hint={`sur ${formatMass(mission.capacityMass)}`}
          />
          <Stat
            label="Énergie"
            value={formatKwh(derived?.energySummary.netDaily ?? 0)}
            hint="par jour"
            tone={(derived?.energySummary.netDaily ?? 0) >= 0 ? 'success' : 'danger'}
          />
          <Stat
            label="Observations"
            value={mission.observations}
            hint={`sur ${mission.observationGoal}`}
          />
          <Stat label="Jour" value={`${mission.currentDay} / ${mission.totalDays}`} />
          <Stat label="Lanceur" value={derived?.launcherName ?? '—'} />
          <Stat
            label="Fiabilité"
            value={`${mission.reliability} %`}
            tone={mission.reliability >= 90 ? 'success' : 'warning'}
          />
        </dl>

        <div className="flex flex-col gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn btn-danger sm:order-1"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Supprimer la mission
          </button>
          <button
            type="button"
            className="btn btn-primary sm:order-2"
            onClick={() => {
              audio.play('click')
              navigate(resumeTarget)
            }}
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Reprendre
          </button>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        title="Supprimer cette mission ?"
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setConfirmOpen(false)}>
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                deleteMission()
                setConfirmOpen(false)
                navigate('/')
              }}
            >
              Oui, supprimer
            </button>
          </>
        }
      >
        <p>
          La progression de <strong className="text-ink">{mission.title}</strong> sera définitivement
          effacée de cet appareil.
        </p>
      </Modal>
    </div>
  )
}

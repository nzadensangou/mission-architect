import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Info } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { ComponentCatalog } from '../components/builder/ComponentCatalog'
import { SatelliteCanvas } from '../components/builder/SatelliteCanvas'
import { BuilderDashboard } from '../components/builder/BuilderDashboard'
import { Modal } from '../components/ui/Modal'
import { getComponent } from '../data/components'
import { canAddComponent, validateBuild } from '../logic/builder'
import { useMissionStore } from '../store/missionStore'
import { formatKwh, formatKw, formatMass, formatMoney } from '../utils/format'
import { audio } from '../utils/audio'

export default function BuilderPage() {
  const { missionId = 'observer-la-terre' } = useParams()
  const navigate = useNavigate()
  const mission = useMissionStore((state) => state.mission)
  const addComponent = useMissionStore((state) => state.addComponent)
  const replaceComponent = useMissionStore((state) => state.replaceComponent)
  const removeComponent = useMissionStore((state) => state.removeComponent)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pendingReplace, setPendingReplace] = useState<{ next: string; previous: string } | null>(null)

  const validation = useMemo(
    () => (mission ? validateBuild(mission.components, mission.launcherId, mission.budgetInitial) : null),
    [mission],
  )

  if (!mission) return null

  if (!mission.launcherId) {
    return (
      <div className="shell">
        <PageHeader title="Choisis d’abord un lanceur" backTo={`/lanceur/${missionId}`} />
        <div className="panel mx-auto max-w-lg px-6 py-10 text-center">
          <p className="text-sm text-muted">
            La construction du satellite commence après le choix du lanceur.
          </p>
          <button
            type="button"
            className="btn btn-primary mt-6"
            onClick={() => navigate(`/lanceur/${missionId}`)}
          >
            Choisir un lanceur
          </button>
        </div>
      </div>
    )
  }

  const handleAdd = (componentId: string) => {
    const decision = canAddComponent(componentId, mission.components)
    if (decision.allowed) {
      audio.play('add')
      addComponent(componentId)
      return
    }
    if (decision.reason === 'replace' && decision.replaces) {
      setPendingReplace({ next: componentId, previous: decision.replaces })
      return
    }
    if (decision.reason === 'limit') {
      audio.play('alert')
    }
  }

  const selected = selectedId ? getComponent(selectedId) : null

  return (
    <div className="shell">
      <PageHeader
        eyebrow="Étape 2 / 2 · Construction"
        title={mission.title}
        subtitle="Clique sur un composant pour l’ajouter. Clique sur un module installé pour le retirer."
        backTo={`/lanceur/${missionId}`}
        backLabel="Lanceur"
        actions={
          <span className="tag tag-info">
            <Info className="h-3 w-3" aria-hidden="true" />
            {mission.components.length} module{mission.components.length > 1 ? 's' : ''}
          </span>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <ComponentCatalog componentIds={mission.components} onAdd={handleAdd} />

        <section className="panel flex flex-col" aria-labelledby="satellite-title">
          <div className="panel-head">
            <h2
              id="satellite-title"
              className="font-display text-sm font-semibold uppercase tracking-[0.16em]"
            >
              Satellite en construction
            </h2>
            <span className="font-mono text-[0.6875rem] text-muted">
              {formatMass(mission.totalMass)} / {formatMass(mission.capacityMass)}
            </span>
          </div>

          <div className="flex min-h-[320px] flex-1 items-center justify-center px-3 py-2">
            <SatelliteCanvas
              componentIds={mission.components}
              onSelectComponent={(id) => {
                if (mission.components.includes(id)) setSelectedId(id)
              }}
            />
          </div>

          <div className="border-t border-line px-5 py-3">
            <p className="text-xs leading-relaxed text-muted">
              Modules installés :{' '}
              {mission.components.length === 0
                ? 'aucun'
                : mission.components
                    .map((id) => getComponent(id)?.name ?? id)
                    .join(' · ')}
            </p>
          </div>
        </section>
      </div>

      <div className="mt-4">
        <BuilderDashboard
          mission={mission}
          issues={validation?.messages ?? []}
          canLaunch={Boolean(validation?.ok)}
          onLaunch={() => {
            if (!validation?.ok) return
            audio.play('success')
            useMissionStore.getState().launch()
            navigate(`/simulation/${missionId}`)
          }}
        />
      </div>

      <Modal
        open={Boolean(selected)}
        title={selected?.name ?? ''}
        onClose={() => setSelectedId(null)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setSelectedId(null)}>
              Fermer
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                if (!selected) return
                audio.play('click')
                removeComponent(selected.id)
                setSelectedId(null)
              }}
            >
              Retirer
            </button>
          </>
        }
      >
        {selected ? (
          <div className="space-y-3">
            <p className="text-ink">{selected.description}</p>
            <dl className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="rounded-md border border-line bg-panel-alt px-3 py-2">
                <dt className="field-label">Effet</dt>
                <dd className="text-ink">{selected.effect}</dd>
              </div>
              <div className="rounded-md border border-line bg-panel-alt px-3 py-2">
                <dt className="field-label">Masse</dt>
                <dd className="text-ink">{formatMass(selected.mass)}</dd>
              </div>
              <div className="rounded-md border border-line bg-panel-alt px-3 py-2">
                <dt className="field-label">Coût</dt>
                <dd className="text-ink">{formatMoney(selected.cost)}</dd>
              </div>
              <div className="rounded-md border border-line bg-panel-alt px-3 py-2">
                <dt className="field-label">Énergie</dt>
                <dd className="text-ink">
                  {selected.energyProduction > 0
                    ? `+${formatKw(selected.energyProduction)}`
                    : selected.energyConsumption > 0
                      ? `−${formatKw(selected.energyConsumption)}`
                      : formatKwh(0)}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(pendingReplace)}
        title="Remplacer le composant ?"
        onClose={() => setPendingReplace(null)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setPendingReplace(null)}>
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (!pendingReplace) return
                audio.play('add')
                replaceComponent(pendingReplace.next)
                setPendingReplace(null)
              }}
            >
              Remplacer
            </button>
          </>
        }
      >
        <p>
          Remplacer <strong className="text-ink">{getComponent(pendingReplace?.previous ?? '')?.name}</strong>{' '}
          par <strong className="text-ink">{getComponent(pendingReplace?.next ?? '')?.name}</strong> ?
        </p>
      </Modal>
    </div>
  )
}

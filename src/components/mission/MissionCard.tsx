import { Lock, Rocket } from 'lucide-react'
import type { MissionDefinition } from '../../types'
import { formatMoney } from '../../utils/format'

interface MissionCardProps {
  definition: MissionDefinition
  playable: boolean
  onStart: () => void
}

export function MissionCard({ definition, playable, onStart }: MissionCardProps) {
  return (
    <article
      className={`panel flex flex-col overflow-hidden transition ${
        playable ? 'hover:border-primary/50 hover:shadow-glow' : 'opacity-60'
      }`}
      aria-labelledby={`mission-${definition.id}`}
    >
      <div className="panel-head">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="text-lg">
            {definition.icon}
          </span>
          <h2 id={`mission-${definition.id}`} className="font-display text-base font-semibold uppercase tracking-wide">
            {definition.title}
          </h2>
        </span>
        <span className={`tag ${playable ? 'tag-info' : 'tag-muted'}`}>
          {playable ? definition.level : 'Bientôt'}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
        <p className="text-sm leading-relaxed text-muted">{definition.briefing}</p>

        <dl className="grid grid-cols-3 gap-3 border-t border-line pt-4">
          <div>
            <dt className="field-label">Budget</dt>
            <dd className="stat-value text-base">{formatMoney(definition.budget)}</dd>
          </div>
          <div>
            <dt className="field-label">Durée</dt>
            <dd className="stat-value text-base">{definition.durationDays} j</dd>
          </div>
          <div>
            <dt className="field-label">Objectif</dt>
            <dd className="stat-value text-base">{definition.observationGoal}</dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-line px-5 py-4">
        <button
          type="button"
          className={`btn w-full ${playable ? 'btn-primary' : ''}`}
          onClick={onStart}
          disabled={!playable}
          aria-describedby={`mission-${definition.id}-hint`}
        >
          {playable ? (
            <>
              <Rocket className="h-4 w-4" aria-hidden="true" />
              Démarrer
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" aria-hidden="true" />
              Indisponible
            </>
          )}
        </button>
        <p id={`mission-${definition.id}-hint`} className="mt-2 text-center text-xs text-muted">
          {playable ? definition.objective : 'Mission prévue dans une prochaine version'}
        </p>
      </div>
    </article>
  )
}

import type { MissionDefinition } from '../../types'
import { formatMoney } from '../../utils/format'

export function MissionBriefing({ definition }: { definition: MissionDefinition }) {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-line bg-gradient-to-br from-primary/10 via-transparent to-accent/10 px-6 py-8">
        <p className="eyebrow mb-2">{definition.level}</p>
        <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-ink">
          {definition.icon} {definition.title}
        </h2>
      </div>

      <dl className="grid grid-cols-3 divide-x divide-line border-b border-line">
        <div className="px-5 py-4">
          <dt className="field-label">Objectif</dt>
          <dd className="stat-value">{definition.observationGoal}</dd>
          <p className="text-xs text-muted">observations</p>
        </div>
        <div className="px-5 py-4">
          <dt className="field-label">Budget</dt>
          <dd className="stat-value">{formatMoney(definition.budget)}</dd>
          <p className="text-xs text-muted">lanceur inclus</p>
        </div>
        <div className="px-5 py-4">
          <dt className="field-label">Durée</dt>
          <dd className="stat-value">{definition.durationDays}</dd>
          <p className="text-xs text-muted">jours simulés</p>
        </div>
      </dl>

      <div className="space-y-4 px-6 py-6">
        <p className="text-base leading-relaxed text-ink">{definition.briefing}</p>
        <p className="text-sm leading-relaxed text-muted">
          Tu vas choisir un lanceur, assembler un satellite module par module, puis gérer sa mission
          jour après jour : énergie, batterie, observations et transmission. Chaque décision a un
          coût.
        </p>
      </div>
    </div>
  )
}

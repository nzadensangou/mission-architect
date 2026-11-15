import type { Mission } from '../../types'
import { scoreBreakdown } from '../../logic/score'
import { ProgressBar } from '../ui/ProgressBar'

export function ScorePanel({ mission }: { mission: Mission }) {
  const breakdown = scoreBreakdown(mission)

  return (
    <section className="panel" aria-labelledby="score-title">
      <div className="panel-head">
        <h2 id="score-title" className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
          Score final
        </h2>
        <span className="tag tag-accent">{mission.rank}</span>
      </div>

      <div className="grid gap-6 px-5 py-5 sm:grid-cols-[160px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-panel-alt/60 px-4 py-5">
          <span className="font-mono text-5xl font-medium tabular-nums text-primary">
            {mission.score ?? 0}
          </span>
          <span className="field-label mt-1">sur 100</span>
        </div>

        <div className="space-y-3">
          <ProgressBar
            label="Observations · 35 %"
            value={breakdown.observations * 100}
            max={100}
            tone="success"
            display={`${Math.round(breakdown.observations * 100)} %`}
            hint={`${mission.observations} / ${mission.observationGoal}`}
          />
          <ProgressBar
            label="Transmission · 25 %"
            value={breakdown.transmission * 100}
            max={100}
            tone="primary"
            display={`${Math.round(breakdown.transmission * 100)} %`}
            hint={`${mission.transmittedData} données transmises`}
          />
          <ProgressBar
            label="Budget · 20 %"
            value={breakdown.budget * 100}
            max={100}
            tone="accent"
            display={`${Math.round(breakdown.budget * 100)} %`}
            hint={`${mission.budgetRestant} M$ restants`}
          />
          <ProgressBar
            label="Fiabilité · 20 %"
            value={breakdown.reliability * 100}
            max={100}
            tone="warning"
            display={`${Math.round(breakdown.reliability * 100)} %`}
            hint="fiabilité de conception"
          />
        </div>
      </div>
    </section>
  )
}

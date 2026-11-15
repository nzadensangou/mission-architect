import { CheckCircle2 } from 'lucide-react'
import type { Mission } from '../../types'
import { Stat } from '../ui/Stat'
import { formatMoney } from '../../utils/format'

export function ResultScreen({ mission }: { mission: Mission }) {
  return (
    <section className="panel border-success/40" aria-labelledby="success-title">
      <div className="panel-head">
        <h2
          id="success-title"
          className="flex items-center gap-2 font-display text-xl font-semibold uppercase tracking-wide text-success"
        >
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          Mission réussie
        </h2>
        <span className="tag tag-ok">J{mission.currentDay}</span>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 px-5 py-6 sm:grid-cols-4">
        <Stat
          label="Observations"
          value={`${mission.observations} / ${mission.observationGoal}`}
          tone="success"
        />
        <Stat
          label="Données transmises"
          value={`${mission.transmittedData} / ${mission.observations}`}
          tone="primary"
        />
        <Stat label="Budget restant" value={formatMoney(mission.budgetRestant)} tone="accent" />
        <Stat label="Fiabilité" value={`${mission.reliability} %`} />
      </dl>
    </section>
  )
}

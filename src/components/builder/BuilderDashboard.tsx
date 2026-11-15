import type { Mission } from '../../types'
import { ProgressBar } from '../ui/ProgressBar'
import { Stat } from '../ui/Stat'
import { formatKwh, formatMass, formatMoney } from '../../utils/format'
import { observationsForDay } from '../../logic/observations'
import { transmissionCapacity } from '../../logic/communication'
import { summarizeEnergy } from '../../logic/energy'
import { LaunchButton } from './LaunchButton'

interface BuilderDashboardProps {
  mission: Mission
  issues: string[]
  canLaunch: boolean
  onLaunch: () => void
}

export function BuilderDashboard({ mission, issues, canLaunch, onLaunch }: BuilderDashboardProps) {
  const energy = summarizeEnergy(mission.components, {
    cameraStatus: 'active',
    antennaStatus: 'active',
    powerMode: 'normal',
    reinforcedObservation: false,
    effects: [],
  })
  const observations = observationsForDay(mission.components, {
    cameraStatus: 'active',
    reinforcedObservation: false,
    effects: [],
  })
  const transmission = transmissionCapacity(mission.components, 'active', [])

  const budgetUsed = mission.budgetInitial - mission.budgetRestant

  return (
    <section className="panel" aria-labelledby="dashboard-title">
      <div className="panel-head">
        <h2 id="dashboard-title" className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
          Tableau de bord
        </h2>
        <span className={`tag ${canLaunch ? 'tag-ok' : 'tag-warn'}`}>
          {canLaunch ? 'Prêt au lancement' : 'Configuration incomplète'}
        </span>
      </div>

      <div className="grid gap-6 px-5 py-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <Stat
            label="Budget"
            value={formatMoney(mission.budgetRestant)}
            hint={`dépensé ${formatMoney(budgetUsed)}`}
            tone={mission.budgetRestant < 0 ? 'danger' : 'primary'}
          />
          <Stat
            label="Masse"
            value={formatMass(mission.totalMass)}
            hint={`capacité ${formatMass(mission.capacityMass)}`}
            tone={mission.totalMass > mission.capacityMass ? 'danger' : 'default'}
          />
          <Stat
            label="Énergie"
            value={formatKwh(energy.netDaily)}
            hint="nette / jour"
            tone={energy.netDaily < 0 ? 'danger' : 'success'}
          />
          <Stat label="Observations" value={`${observations} / jour`} tone="accent" />
          <Stat label="Communication" value={`${transmission} / jour`} tone="accent" />
          <Stat
            label="Fiabilité"
            value={`${mission.reliability} %`}
            tone={mission.reliability >= 90 ? 'success' : mission.reliability >= 70 ? 'warning' : 'danger'}
          />
        </div>

        <div className="space-y-4">
          <ProgressBar
            label="Budget"
            value={budgetUsed}
            max={mission.budgetInitial}
            tone="primary"
            display={`${formatMoney(budgetUsed)} / ${formatMoney(mission.budgetInitial)}`}
          />
          <ProgressBar
            label="Masse"
            value={mission.totalMass}
            max={mission.capacityMass || 1}
            tone={mission.totalMass > mission.capacityMass ? 'danger' : 'accent'}
            display={`${formatMass(mission.totalMass)} / ${formatMass(mission.capacityMass)}`}
          />
          <ProgressBar
            label="Observations"
            value={observations}
            max={60}
            tone="success"
            display={`${observations} / jour`}
          />
        </div>
      </div>

      <div className="border-t border-line px-5 py-4">
        <LaunchButton disabled={!canLaunch} onLaunch={onLaunch} reasons={issues} />
      </div>
    </section>
  )
}

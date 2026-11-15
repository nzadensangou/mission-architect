import { BatteryCharging, Camera, Radio, Signal, Zap } from 'lucide-react'
import type { Mission } from '../../types'
import { batteryPercent } from '../../logic/battery'
import { ResourceBar } from './ResourceBar'
import { formatKwh } from '../../utils/format'
import { transmissionCapacity } from '../../logic/communication'

export function SimulationHUD({ mission }: { mission: Mission }) {
  const battery = batteryPercent(mission.battery, mission.batteryCapacity)
  const energyPercent = mission.energy >= 0 ? 100 : Math.max(0, 100 + mission.energy * 4)
  const healthTone = mission.health > 60 ? 'success' : mission.health > 30 ? 'warning' : 'danger'
  const batteryTone = battery > 50 ? 'success' : battery > 20 ? 'warning' : 'danger'
  const capacity = transmissionCapacity(mission.components, mission.antennaStatus, mission.activeEffects)
  const observationPercent = Math.min(100, (mission.observations / mission.observationGoal) * 100)

  return (
    <div className="space-y-4" aria-label="Ressources de la mission">
      <ResourceBar
        icon={<Zap className="h-4 w-4" />}
        label="Énergie nette"
        percent={energyPercent}
        display={formatKwh(mission.energy)}
        tone={mission.energy >= 0 ? 'primary' : 'danger'}
        alert={mission.energy < 0}
      />
      <ResourceBar
        icon={<BatteryCharging className="h-4 w-4" />}
        label="Batterie"
        percent={battery}
        display={`${battery} % · ${mission.battery}/${mission.batteryCapacity} kWh`}
        tone={batteryTone}
        alert={battery <= 20}
      />
      <ResourceBar
        icon={<Signal className="h-4 w-4" />}
        label="Données en attente"
        percent={Math.min(100, (mission.pendingData / 120) * 100)}
        display={`${mission.pendingData} · ${capacity}/j`}
        tone={mission.pendingData > 80 ? 'warning' : 'accent'}
      />
      <ResourceBar
        icon={<Radio className="h-4 w-4" />}
        label="Santé du satellite"
        percent={mission.health}
        display={`${mission.health} %`}
        tone={healthTone}
        alert={mission.health <= 30}
      />
      <ResourceBar
        icon={<Camera className="h-4 w-4" />}
        label="Observations"
        percent={observationPercent}
        display={`${mission.observations} / ${mission.observationGoal}`}
        tone="success"
      />
    </div>
  )
}

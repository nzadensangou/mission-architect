import { Battery, Camera, Compass, PanelTop, Radio, Shield, Boxes } from 'lucide-react'
import type { ComponentCategory, SatelliteComponent } from '../../types'
import { formatKw, formatMass, formatMoney } from '../../utils/format'

const CATEGORY_ICON: Record<ComponentCategory, typeof Camera> = {
  structure: Boxes,
  energy: PanelTop,
  battery: Battery,
  camera: Camera,
  antenna: Radio,
  attitude: Compass,
  shield: Shield,
}

interface ComponentCardProps {
  component: SatelliteComponent
  installed: number
  disabled?: boolean
  disabledReason?: string
  onAdd: () => void
}

export function ComponentCard({
  component,
  installed,
  disabled,
  disabledReason,
  onAdd,
}: ComponentCardProps) {
  const Icon = CATEGORY_ICON[component.category]
  const atLimit = installed >= component.maxQuantity

  return (
    <button
      type="button"
      className="group flex w-full items-start gap-3 rounded-lg border border-line bg-panel-alt/60 px-3 py-3 text-left transition hover:border-primary/50 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-line disabled:hover:bg-panel-alt/60"
      onClick={onAdd}
      disabled={disabled || atLimit}
      aria-label={`Ajouter ${component.name}`}
      aria-describedby={disabledReason ? `hint-${component.id}` : undefined}
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-panel">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-ink">{component.name}</span>
          {installed > 0 ? (
            <span className="tag tag-ok shrink-0">{installed}/{component.maxQuantity}</span>
          ) : component.required ? (
            <span className="tag tag-warn shrink-0">Requis</span>
          ) : null}
        </span>

        <span className="mt-0.5 block text-xs text-muted">{component.effect}</span>

        <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] text-muted">
          <span>{formatMass(component.mass)}</span>
          <span>{formatMoney(component.cost)}</span>
          {component.energyProduction > 0 ? (
            <span className="text-success">+{formatKw(component.energyProduction)}</span>
          ) : null}
          {component.energyConsumption > 0 ? (
            <span className="text-warning">−{formatKw(component.energyConsumption)}</span>
          ) : null}
          {component.batteryCapacity > 0 ? <span>+{component.batteryCapacity} kWh</span> : null}
        </span>

        {disabledReason ? (
          <span id={`hint-${component.id}`} className="mt-1 block text-[0.6875rem] text-warning">
            {disabledReason}
          </span>
        ) : null}
      </span>
    </button>
  )
}

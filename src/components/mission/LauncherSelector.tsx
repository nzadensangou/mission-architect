import { LAUNCHERS } from '../../data/launchers'
import type { Launcher } from '../../types'
import { LauncherCard } from './LauncherCard'

interface LauncherSelectorProps {
  budget: number
  selectedId: string
  onChoose: (launcher: Launcher) => void
}

export function LauncherSelector({ budget, selectedId, onChoose }: LauncherSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {LAUNCHERS.map((launcher) => (
        <LauncherCard
          key={launcher.id}
          launcher={launcher}
          available={launcher.cost <= budget}
          selected={launcher.id === selectedId}
          onChoose={() => onChoose(launcher)}
        />
      ))}
    </div>
  )
}

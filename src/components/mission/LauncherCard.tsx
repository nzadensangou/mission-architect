import { Check, Rocket } from 'lucide-react'
import type { Launcher } from '../../types'
import { formatMass, formatMoney } from '../../utils/format'

interface LauncherCardProps {
  launcher: Launcher
  available: boolean
  selected: boolean
  onChoose: () => void
}

export function LauncherCard({ launcher, available, selected, onChoose }: LauncherCardProps) {
  return (
    <article
      className={`panel flex flex-col overflow-hidden transition ${
        selected ? 'border-primary/70 shadow-glow' : 'hover:border-primary/40'
      } ${available ? '' : 'opacity-60'}`}
      aria-labelledby={`launcher-${launcher.id}`}
    >
      <div className="panel-head">
        <h2
          id={`launcher-${launcher.id}`}
          className="flex items-center gap-2 font-display text-base font-semibold uppercase tracking-wide"
        >
          <Rocket className="h-4 w-4 text-primary" aria-hidden="true" />
          {launcher.name}
        </h2>
        {selected ? (
          <span className="tag tag-ok">
            <Check className="h-3 w-3" aria-hidden="true" />
            Choisi
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
        <p className="text-sm leading-relaxed text-muted">{launcher.description}</p>

        <dl className="grid grid-cols-3 gap-3 border-t border-line pt-4">
          <div>
            <dt className="field-label">Capacité</dt>
            <dd className="stat-value text-base">{formatMass(launcher.payloadCapacity)}</dd>
          </div>
          <div>
            <dt className="field-label">Coût</dt>
            <dd className="stat-value text-base">{formatMoney(launcher.cost)}</dd>
          </div>
          <div>
            <dt className="field-label">Fiabilité</dt>
            <dd className="stat-value text-base">{launcher.reliability} %</dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-line px-5 py-4">
        <button
          type="button"
          className={`btn w-full ${available ? 'btn-primary' : ''}`}
          disabled={!available}
          onClick={onChoose}
        >
          {available ? 'Choisir' : 'Budget insuffisant'}
        </button>
      </div>
    </article>
  )
}

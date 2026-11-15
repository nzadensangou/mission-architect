import { AlertTriangle, Sparkles, Info, ShieldAlert } from 'lucide-react'
import type { MissionEvent } from '../../types'
import { DecisionButtons } from './DecisionButtons'

const SEVERITY = {
  info: { tag: 'tag-info', Icon: Info, label: 'Information' },
  warning: { tag: 'tag-warn', Icon: AlertTriangle, label: 'Avertissement' },
  critical: { tag: 'tag-danger', Icon: ShieldAlert, label: 'Critique' },
  opportunity: { tag: 'tag-accent', Icon: Sparkles, label: 'Opportunité' },
} as const

interface EventCardProps {
  event: MissionEvent
  day: number
  onChoose: (choiceId: string) => void
}

export function EventCard({ event, day, onChoose }: EventCardProps) {
  const { tag, Icon, label } = SEVERITY[event.severity]

  return (
    <section
      className="panel border-warning/50 bg-gradient-to-br from-warning/10 via-panel to-panel"
      aria-labelledby="event-title"
      role="alertdialog"
      aria-live="assertive"
    >
      <div className="panel-head">
        <span className={`tag ${tag}`}>
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {label}
        </span>
        <span className="font-mono text-xs text-muted">JOUR {day}</span>
      </div>

      <div className="space-y-3 px-5 py-4">
        <h2 id="event-title" className="font-display text-xl font-semibold text-ink">
          {event.title}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{event.description}</p>
        <p className="font-mono text-[0.6875rem] uppercase tracking-wider text-warning">
          Décision requise pour continuer
        </p>
        <DecisionButtons choices={event.choices} onChoose={onChoose} />
      </div>
    </section>
  )
}

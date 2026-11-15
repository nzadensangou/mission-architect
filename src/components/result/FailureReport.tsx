import { AlertTriangle, Lightbulb } from 'lucide-react'
import type { Mission } from '../../types'
import { getComponent } from '../../data/components'

interface FailureReportProps {
  mission: Mission
}

function buildAdvice(mission: Mission): string[] {
  const advice: string[] = []
  const count = (category: string) =>
    mission.components.filter((id) => getComponent(id)?.category === category).length

  if (count('battery') < 2) advice.push('Ajoute une deuxième batterie pour absorber les passages dans l’ombre.')
  if (count('energy') < 3) advice.push('Ajoute un panneau solaire supplémentaire pour augmenter la production.')
  if (mission.cameraStatus !== 'active') advice.push('Garde la caméra active et utilise le mode économie plutôt que de l’arrêter.')
  if (mission.health < 60) advice.push('Installe le blindage léger pour limiter les dégâts et tenter les réparations plus tôt.')
  if (mission.reliability < 90) advice.push('Choisis un lanceur plus fiable ou ajoute le système d’orientation et le blindage.')

  if (advice.length === 0) {
    advice.push('Réduis la consommation en mode économie dès qu’un événement solaire est annoncé.')
  }

  return advice
}

export function FailureReport({ mission }: FailureReportProps) {
  const keyMoments = mission.journal.filter((entry) => entry.tone === 'bad' || entry.tone === 'warn').slice(-4)

  return (
    <section className="panel border-danger/40" aria-labelledby="failure-title">
      <div className="panel-head">
        <h2 id="failure-title" className="font-display text-xl font-semibold uppercase tracking-wide text-danger">
          Mission échouée
        </h2>
        <span className="tag tag-danger">J{mission.currentDay}</span>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
          <div>
            <p className="field-label">Cause</p>
            <p className="text-sm text-ink">{mission.failureReason ?? 'La mission n’a pas atteint ses objectifs.'}</p>
          </div>
        </div>

        {keyMoments.length > 0 ? (
          <div>
            <p className="field-label mb-2">Ce qui s’est passé</p>
            <ul className="space-y-1 text-sm text-muted">
              {keyMoments.map((entry) => (
                <li key={entry.id} className="flex gap-2">
                  <span className="font-mono text-xs text-muted/80">J{entry.day}</span>
                  <span>{entry.message}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="rounded-lg border border-warning/30 bg-warning/5 px-4 py-3">
          <p className="field-label mb-2 flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
            Conseil
          </p>
          <ul className="space-y-1 text-sm text-muted">
            {buildAdvice(mission).map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-warning">
                  ▸
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

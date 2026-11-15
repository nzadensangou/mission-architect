import { Link } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'

export default function SessionEndedPage() {
  return (
    <div className="shell flex min-h-[calc(100vh-4.5rem)] items-center justify-center">
      <div className="panel w-full max-w-md px-6 py-10 text-center">
        <p className="eyebrow mb-3">Session terminée</p>
        <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-ink">
          Merci d’avoir utilisé Mission Architect
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Tu peux fermer cet onglet. Ta progression reste enregistrée sur cet appareil.
        </p>
        <Link to="/" className="btn btn-primary mt-7 w-full">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Relancer l’application
        </Link>
      </div>
    </div>
  )
}

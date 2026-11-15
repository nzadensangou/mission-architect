import { Rocket } from 'lucide-react'

interface LaunchButtonProps {
  disabled: boolean
  onLaunch: () => void
  reasons: string[]
}

export function LaunchButton({ disabled, onLaunch, reasons }: LaunchButtonProps) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        className="btn btn-primary btn-lg w-full"
        disabled={disabled}
        onClick={onLaunch}
        aria-describedby={disabled ? 'launch-reasons' : undefined}
      >
        <Rocket className="h-5 w-5" aria-hidden="true" />
        Lancer la mission
      </button>

      {disabled && reasons.length > 0 ? (
        <ul id="launch-reasons" className="space-y-1 text-xs text-warning" aria-live="polite">
          {reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-1.5">
              <span aria-hidden="true">▸</span>
              {reason}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-xs text-muted">
          Toutes les conditions sont réunies. Le décollage est imminent.
        </p>
      )}
    </div>
  )
}

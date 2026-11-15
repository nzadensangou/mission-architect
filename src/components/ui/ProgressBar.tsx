interface ProgressBarProps {
  value: number
  max: number
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'accent'
  label: string
  hint?: string
  /** Affiche la valeur à droite du libellé */
  display?: string
}

const TONE_CLASS: Record<NonNullable<ProgressBarProps['tone']>, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  accent: 'bg-accent',
}

export function ProgressBar({ value, max, tone = 'primary', label, hint, display }: ProgressBarProps) {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  const percent = Math.round(ratio * 100)

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="field-label">{label}</span>
        <span className="font-mono text-sm tabular-nums text-ink">{display ?? `${percent} %`}</span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-panel-alt"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${TONE_CLASS[tone]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  )
}

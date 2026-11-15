import type { ReactNode } from 'react'

interface ResourceBarProps {
  icon: ReactNode
  label: string
  percent: number
  display: string
  tone: 'primary' | 'success' | 'warning' | 'danger' | 'accent'
  alert?: boolean
}

const TONE_BAR: Record<ResourceBarProps['tone'], string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  accent: 'bg-accent',
}

const TONE_TEXT: Record<ResourceBarProps['tone'], string> = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  accent: 'text-accent',
}

export function ResourceBar({ icon, label, percent, display, tone, alert }: ResourceBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)))
  return (
    <div className={alert ? 'animate-pulse-alert rounded-lg' : ''}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm text-ink">
          <span className={TONE_TEXT[tone]} aria-hidden="true">
            {icon}
          </span>
          {label}
        </span>
        <span className="font-mono text-sm tabular-nums text-muted">{display}</span>
      </div>
      <div
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-panel-alt"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${TONE_BAR[tone]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}

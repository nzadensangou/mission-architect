import type { ReactNode } from 'react'

interface StatProps {
  label: string
  value: ReactNode
  hint?: string
  tone?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'accent'
}

const TONE: Record<NonNullable<StatProps['tone']>, string> = {
  default: 'text-ink',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  accent: 'text-accent',
}

export function Stat({ label, value, hint, tone = 'default' }: StatProps) {
  return (
    <div className="min-w-0">
      <p className="field-label truncate">{label}</p>
      <p className={`stat-value ${TONE[tone]}`}>{value}</p>
      {hint ? <p className="mt-0.5 truncate text-xs text-muted">{hint}</p> : null}
    </div>
  )
}

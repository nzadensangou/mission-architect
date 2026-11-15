import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  eyebrow?: string
  subtitle?: string
  backTo?: string
  backLabel?: string
  actions?: ReactNode
}

export function PageHeader({
  title,
  eyebrow,
  subtitle,
  backTo,
  backLabel = 'Retour',
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-6">
      {backTo ? (
        <Link to={backTo} className="link-back mb-4">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
          <h1 className="text-title font-semibold text-ink">{title}</h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}

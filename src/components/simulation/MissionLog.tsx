import { useEffect, useRef } from 'react'
import type { JournalEntry } from '../../types'

const TONE = {
  info: 'border-l-line text-muted',
  good: 'border-l-success text-success',
  warn: 'border-l-warning text-warning',
  bad: 'border-l-danger text-danger',
} as const

export function MissionLog({ entries }: { entries: JournalEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lastId = entries.at(-1)?.id

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })
  }, [lastId])

  const visible = entries.slice(-60)

  return (
    <div className="flex h-full flex-col">
      <div className="panel-head">
        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em]">Journal</h2>
        <span className="font-mono text-[0.6875rem] text-muted">{entries.length} entrées</span>
      </div>

      <div
        ref={containerRef}
        className="max-h-[280px] flex-1 space-y-1.5 overflow-y-auto px-4 py-3"
        aria-live="polite"
        aria-label="Journal de mission"
      >
        {visible.map((entry) => (
          <div
            key={entry.id}
            className={`border-l-2 pl-3 font-mono text-xs leading-relaxed ${TONE[entry.tone]}`}
          >
            <span className="text-muted/80">J{String(entry.day).padStart(2, '0')}</span>{' '}
            <span className="text-ink/90">{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
  labelledBy?: string
}

/** Boîte de dialogue accessible : Échap ferme, focus déplacé à l'ouverture */
export function Modal({ open, title, children, footer, onClose, labelledBy }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previous?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-4 backdrop-blur-sm sm:items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy ?? 'modal-title'}
        tabIndex={-1}
        className="panel w-full max-w-lg outline-none"
      >
        <div className="panel-head">
          <h2 id={labelledBy ?? 'modal-title'} className="text-lg font-semibold">
            {title}
          </h2>
        </div>
        <div className="space-y-3 px-5 py-5 text-sm leading-relaxed text-muted">{children}</div>
        {footer ? (
          <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

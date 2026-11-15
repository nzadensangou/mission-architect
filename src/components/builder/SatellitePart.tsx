import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SatellitePartProps {
  present: boolean
  label: string
  onSelect?: () => void
  children: ReactNode
  /** Position verticale de départ de l'animation */
  from?: number
}

/** Calque animé du schéma satellite : apparition / disparition à l'ajout et au retrait */
export function SatellitePart({ present, label, onSelect, children, from = 6 }: SatellitePartProps) {
  const interactive = Boolean(onSelect)

  return (
    <AnimatePresence>
      {present ? (
        <motion.g
          initial={{ opacity: 0, y: from }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -from }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          onClick={onSelect}
          onKeyDown={
            interactive
              ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onSelect?.()
                  }
                }
              : undefined
          }
          tabIndex={interactive ? 0 : undefined}
          role={interactive ? 'button' : undefined}
          aria-label={interactive ? `${label} — voir les détails` : undefined}
          className={interactive ? 'cursor-pointer outline-none [&:focus-visible>*]:stroke-primary' : ''}
        >
          <title>{label}</title>
          {children}
        </motion.g>
      ) : null}
    </AnimatePresence>
  )
}

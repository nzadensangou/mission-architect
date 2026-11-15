import { motion } from 'framer-motion'
import type { Mission } from '../../types'
import { transmissionCapacity } from '../../logic/communication'

interface OrbitViewProps {
  mission: Mission
}

/** Vue orbitale 2D : le satellite progresse autour de la Terre au fil des jours */
export function OrbitView({ mission }: OrbitViewProps) {
  const progress = mission.totalDays > 0 ? mission.currentDay / mission.totalDays : 0
  const angle = -90 + progress * 360
  const radius = 96
  const center = 130
  const x = center + radius * Math.cos((angle * Math.PI) / 180)
  const y = center + radius * Math.sin((angle * Math.PI) / 180)
  const capacity = transmissionCapacity(mission.components, mission.antennaStatus, mission.activeEffects)
  const transmitting = capacity > 0 && mission.pendingData > 0

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 260 260" className="h-full w-full max-w-[280px]" role="img" aria-label={`Orbite — jour ${mission.currentDay} sur ${mission.totalDays}`}>
        <defs>
          <radialGradient id="planet" cx="34%" cy="30%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
            <stop offset="52%" stopColor="#0E7490" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#082F49" stopOpacity="0.9" />
          </radialGradient>
          <linearGradient id="trail" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--c-primary))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="rgb(var(--c-primary))" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <g opacity="0.35">
          {[116, 84, 52].map((ring) => (
            <circle key={ring} cx={center} cy={center} r={ring} fill="none" stroke="rgb(var(--c-line))" strokeDasharray="2 8" />
          ))}
        </g>

        <circle cx={center} cy={center} r="44" fill="url(#planet)" />
        <circle cx={center} cy={center} r="44" fill="none" stroke="rgb(var(--c-primary))" strokeOpacity="0.35" />
        <ellipse cx={center - 12} cy={center - 14} rx="16" ry="9" fill="rgb(255 255 255 / 0.12)" />
        <ellipse cx={center + 14} cy={center + 16} rx="11" ry="6" fill="rgb(255 255 255 / 0.08)" />

        <circle cx={center} cy={center} r={radius} fill="none" stroke="url(#trail)" strokeWidth="1.5" strokeDasharray="3 5" />

        <motion.g
          animate={{ x, y }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          {transmitting ? (
            <motion.circle
              r="8"
              initial={{ r: 8, opacity: 0.7 }}
              fill="none"
              stroke="rgb(var(--c-accent))"
              strokeOpacity="0.6"
              animate={{ r: [8, 20], opacity: [0.7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
          ) : null}
          <rect x="-9" y="-7" width="18" height="14" rx="2" fill="rgb(var(--c-panel))" stroke="rgb(var(--c-primary))" strokeWidth="1.4" />
          <rect x="-16" y="-4" width="6" height="8" rx="1" fill="rgb(var(--c-primary))" fillOpacity="0.5" />
          <rect x="10" y="-4" width="6" height="8" rx="1" fill="rgb(var(--c-primary))" fillOpacity="0.5" />
          <circle cx="0" cy="0" r="2" fill="rgb(var(--c-primary))" />
        </motion.g>
      </svg>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <span className="tag tag-muted bg-bg/70 backdrop-blur">
          {mission.cameraStatus === 'off' ? 'CAMÉRA OFF' : mission.cameraStatus === 'reduced' ? 'CAMÉRA RÉDUITE' : 'CAMÉRA ACTIVE'}
        </span>
      </div>
    </div>
  )
}

import { getComponent } from '../../data/components'
import { SatellitePart } from './SatellitePart'

interface SatelliteCanvasProps {
  componentIds: string[]
  onSelectComponent?: (componentId: string) => void
  compact?: boolean
}

const PANEL_POSITIONS = [
  { x: 48, y: 148, w: 120, h: 48 },
  { x: 272, y: 148, w: 120, h: 48 },
  { x: 190, y: 92, w: 60, h: 20 },
]

export function SatelliteCanvas({ componentIds, onSelectComponent, compact }: SatelliteCanvasProps) {
  const count = (id: string) => componentIds.filter((entry) => entry === id).length
  const hasCategory = (category: string) =>
    componentIds.some((id) => getComponent(id)?.category === category)

  const panels = count('panneau-standard')
  const batteries = count('batterie-standard')
  const hasStructure = hasCategory('structure')
  const camera = count('camera-avancee') > 0 ? 'camera-avancee' : hasCategory('camera') ? 'camera-standard' : null
  const antenna = count('antenne-renforcee') > 0 ? 'antenne-renforcee' : hasCategory('antenna') ? 'antenne-standard' : null
  const hasOrientation = hasCategory('attitude')
  const hasShield = hasCategory('shield')

  const select = (componentId: string | null) => {
    if (!componentId || !onSelectComponent) return undefined
    return () => onSelectComponent(componentId)
  }

  return (
    <svg
      viewBox="0 0 440 330"
      className={`h-full w-full ${compact ? 'max-h-64' : ''}`}
      role="img"
      aria-label="Schéma du satellite en construction"
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--c-panel-alt))" />
          <stop offset="100%" stopColor="rgb(var(--c-panel))" />
        </linearGradient>
        <linearGradient id="panelGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(var(--c-primary))" stopOpacity="0.32" />
          <stop offset="100%" stopColor="rgb(var(--c-primary))" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="lensGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="rgb(var(--c-ink))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="rgb(var(--c-primary))" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      {/* Repères de fond */}
      <g aria-hidden="true" stroke="rgb(var(--c-line))" strokeWidth="1" strokeDasharray="2 6" opacity="0.5">
        <line x1="220" y1="20" x2="220" y2="310" />
        <line x1="40" y1="170" x2="400" y2="170" />
      </g>

      {/* Panneaux solaires */}
      {PANEL_POSITIONS.map((panel, index) => (
        <SatellitePart
          key={`panel-${index}`}
          present={panels > index}
          label={`Panneau solaire ${index + 1}`}
          from={index === 0 ? 0 : index === 1 ? 0 : -8}
          onSelect={select(panels > index ? 'panneau-standard' : null)}
        >
          <rect
            x={panel.x}
            y={panel.y}
            width={panel.w}
            height={panel.h}
            rx="3"
            fill="url(#panelGrad)"
            stroke="rgb(var(--c-primary))"
            strokeOpacity="0.65"
          />
          <g stroke="rgb(var(--c-primary))" strokeOpacity="0.35" strokeWidth="1">
            <line x1={panel.x + panel.w / 4} y1={panel.y} x2={panel.x + panel.w / 4} y2={panel.y + panel.h} />
            <line x1={panel.x + panel.w / 2} y1={panel.y} x2={panel.x + panel.w / 2} y2={panel.y + panel.h} />
            <line x1={panel.x + (panel.w * 3) / 4} y1={panel.y} x2={panel.x + (panel.w * 3) / 4} y2={panel.y + panel.h} />
          </g>
        </SatellitePart>
      ))}

      {/* Bras de liaison panneaux */}
      {panels > 0 ? (
        <line x1="168" y1="172" x2="184" y2="172" stroke="rgb(var(--c-muted))" strokeWidth="2" />
      ) : null}
      {panels > 1 ? (
        <line x1="256" y1="172" x2="272" y2="172" stroke="rgb(var(--c-muted))" strokeWidth="2" />
      ) : null}

      {/* Structure / corps */}
      <SatellitePart
        present={hasStructure}
        label="Structure de base"
        from={0}
        onSelect={select(hasStructure ? 'structure' : null)}
      >
        <rect
          x="182"
          y="126"
          width="76"
          height="88"
          rx="6"
          fill="url(#bodyGrad)"
          stroke="rgb(var(--c-line))"
          strokeWidth="1.5"
        />
        <rect x="190" y="136" width="60" height="10" rx="2" fill="rgb(var(--c-primary))" fillOpacity="0.18" />
        <text
          x="220"
          y="144"
          textAnchor="middle"
          fontSize="7"
          letterSpacing="1.6"
          fill="rgb(var(--c-primary))"
          fontFamily="JetBrains Mono, monospace"
        >
          MA-01
        </text>
      </SatellitePart>

      {/* Batteries */}
      <SatellitePart present={batteries > 0} label="Batteries" from={0}>
        {Array.from({ length: batteries }).map((_, index) => (
          <rect
            key={`battery-${index}`}
            x={192 + index * 18}
            y={186}
            width="14"
            height="9"
            rx="1.5"
            fill="rgb(var(--c-success))"
            fillOpacity="0.55"
            stroke="rgb(var(--c-success))"
            strokeOpacity="0.8"
          />
        ))}
      </SatellitePart>

      {/* Système d'orientation */}
      <SatellitePart
        present={hasOrientation}
        label="Système d’orientation"
        onSelect={select(hasOrientation ? 'orientation' : null)}
      >
        <circle cx="240" cy="162" r="9" fill="none" stroke="rgb(var(--c-accent))" strokeWidth="1.5" />
        <line x1="233" y1="162" x2="247" y2="162" stroke="rgb(var(--c-accent))" strokeWidth="1.2" />
        <line x1="240" y1="155" x2="240" y2="169" stroke="rgb(var(--c-accent))" strokeWidth="1.2" />
        <circle cx="240" cy="162" r="2" fill="rgb(var(--c-accent))" />
      </SatellitePart>

      {/* Caméra */}
      <SatellitePart
        present={Boolean(camera)}
        label="Caméra"
        from={10}
        onSelect={select(camera)}
      >
        <line x1="220" y1="214" x2="220" y2="220" stroke="rgb(var(--c-muted))" strokeWidth="3" />
        <circle
          cx="220"
          cy="236"
          r={camera === 'camera-avancee' ? 17 : 14}
          fill="rgb(var(--c-panel-alt))"
          stroke="rgb(var(--c-primary))"
          strokeWidth="1.5"
        />
        <circle cx="220" cy="236" r={camera === 'camera-avancee' ? 9 : 7} fill="url(#lensGrad)" />
        <circle cx="217" cy="233" r="2" fill="rgb(var(--c-ink))" fillOpacity="0.8" />
      </SatellitePart>

      {/* Antenne */}
      <SatellitePart
        present={Boolean(antenna)}
        label="Antenne"
        from={8}
        onSelect={select(antenna)}
      >
        <line x1="188" y1="212" x2="152" y2="252" stroke="rgb(var(--c-muted))" strokeWidth="2" />
        <ellipse
          cx="148"
          cy="258"
          rx={antenna === 'antenne-renforcee' ? 20 : 15}
          ry={antenna === 'antenne-renforcee' ? 13 : 10}
          fill="rgb(var(--c-accent))"
          fillOpacity="0.18"
          stroke="rgb(var(--c-accent))"
          strokeWidth="1.5"
          transform="rotate(-38 148 258)"
        />
        <circle cx="148" cy="258" r="2" fill="rgb(var(--c-accent))" />
        <g stroke="rgb(var(--c-accent))" strokeOpacity="0.45" strokeWidth="1" fill="none">
          <path d="M132 246 q12 -10 24 0" />
          <path d="M126 240 q18 -15 36 0" />
        </g>
      </SatellitePart>

      {/* Blindage */}
      <SatellitePart
        present={hasShield}
        label="Blindage"
        onSelect={select(hasShield ? 'blindage' : null)}
      >
        <rect
          x="172"
          y="116"
          width="96"
          height="108"
          rx="12"
          fill="none"
          stroke="rgb(var(--c-warning))"
          strokeOpacity="0.75"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
      </SatellitePart>

      {!hasStructure && panels === 0 && !camera && !antenna ? (
        <text
          x="220"
          y="176"
          textAnchor="middle"
          fontSize="10"
          fill="rgb(var(--c-muted))"
          fontFamily="JetBrains Mono, monospace"
          letterSpacing="2"
        >
          AJOUTE DES COMPOSANTS
        </text>
      ) : null}
    </svg>
  )
}

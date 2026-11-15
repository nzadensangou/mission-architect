import { HomeMenu } from '../components/home/HomeMenu'
import { useMissionStore } from '../store/missionStore'

export default function HomePage() {
  const mission = useMissionStore((state) => state.mission)

  return (
    <div className="shell flex min-h-[calc(100vh-4.5rem)] flex-col justify-center py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="relative mx-auto mb-6 h-24 w-24">
            <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden="true">
              <defs>
                <radialGradient id="earth" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
                  <stop offset="55%" stopColor="#0E7490" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#0B1120" stopOpacity="0.2" />
                </radialGradient>
              </defs>
              <ellipse
                cx="48"
                cy="48"
                rx="44"
                ry="18"
                fill="none"
                stroke="rgb(148 163 184 / 0.45)"
                strokeWidth="1"
                strokeDasharray="3 5"
                transform="rotate(-28 48 48)"
              />
              <circle cx="48" cy="48" r="26" fill="url(#earth)" />
              <circle cx="48" cy="48" r="26" fill="none" stroke="#22D3EE" strokeOpacity="0.5" />
              <g className="animate-drift" style={{ transformOrigin: '48px 48px' }}>
                <circle cx="20" cy="30" r="3" fill="#F8FAFC" />
                <rect x="16.5" y="26" width="3" height="3" rx="0.6" fill="#8B5CF6" />
                <rect x="20.5" y="31" width="3" height="3" rx="0.6" fill="#8B5CF6" />
              </g>
            </svg>
          </div>

          <p className="eyebrow mb-3">NASA Space Apps · 2026</p>
          <h1 className="font-display text-4xl font-bold uppercase leading-none tracking-[0.08em] text-ink sm:text-5xl">
            Mission
            <br />
            <span className="text-primary">Architect</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Conçois, lance et réussis ta mission spatiale.
          </p>
        </div>

        <HomeMenu />

        <div className="mt-10 flex items-center justify-between border-t border-line pt-4">
          <span className="tag tag-muted">
            <span
              className={`h-1.5 w-1.5 rounded-full ${mission ? 'bg-success' : 'bg-muted'}`}
              aria-hidden="true"
            />
            {mission ? `Mission : ${mission.title}` : 'Aucune mission'}
          </span>
          <span className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted">
            v1.0
          </span>
        </div>
      </div>
    </div>
  )
}

import { useEffect, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Satellite } from 'lucide-react'
import { useApplyOptions } from '../../hooks/useOptions'
import { useSimulation } from '../../hooks/useSimulation'
import { useMissionStore } from '../../store/missionStore'
import { audio } from '../../utils/audio'

export function AppLayout({ children }: { children: ReactNode }) {
  useApplyOptions()
  useSimulation()

  const location = useLocation()
  const mission = useMissionStore((state) => state.mission)
  const clear = useMissionStore((state) => state.deleteMission)

  useEffect(() => {
    const unlock = () => audio.unlock()
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="starfield relative min-h-full">
      <header className="relative z-10 border-b border-line/70 bg-bg/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="group flex items-center gap-2.5" aria-label="Mission Architect — accueil">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/10">
              <Satellite className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <span className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-ink transition group-hover:text-primary">
              Mission Architect
            </span>
          </Link>

          {mission ? (
            <button
              type="button"
              className="tag tag-muted hidden sm:inline-flex"
              onClick={() => {
                if (window.confirm('Supprimer la mission en cours ?')) clear()
              }}
              title="Supprimer la mission enregistrée"
            >
              {mission.title} · J{mission.currentDay}/{mission.totalDays}
            </button>
          ) : (
            <span className="tag tag-muted hidden sm:inline-flex">Aucune mission</span>
          )}
        </div>
      </header>

      <main className="relative z-10">{children}</main>
    </div>
  )
}

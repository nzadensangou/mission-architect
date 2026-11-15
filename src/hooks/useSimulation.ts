import { msPerDay } from '../logic/config'
import { useMissionStore } from '../store/missionStore'
import { useEffect } from 'react'

/** Boucle de simulation : un jour toutes les N millisecondes (§11.2) */
export function useSimulation(): void {
  const running = useMissionStore((state) => state.running)
  const speed = useMissionStore((state) => state.speed)
  const status = useMissionStore((state) => state.mission?.status)
  const activeEventId = useMissionStore((state) => state.mission?.activeEventId)
  const tick = useMissionStore((state) => state.tick)

  useEffect(() => {
    if (!running || status !== 'en_cours' || activeEventId) return
    const id = window.setInterval(() => tick(), msPerDay(speed))
    return () => window.clearInterval(id)
  }, [running, speed, status, activeEventId, tick])
}

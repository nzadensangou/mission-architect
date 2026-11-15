import { useEffect } from 'react'
import { useOptionsStore } from '../store/optionsStore'
import { audio } from '../utils/audio'

/** Applique les options d'affichage et l'audio au document (§13.3) */
export function useApplyOptions(): void {
  const options = useOptionsStore((state) => state.options)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = options.theme
    root.dataset.textSize = options.textSize
    root.dataset.animations = options.animations ? 'on' : 'off'
    root.lang = options.language
    document.body.style.background = ''
    audio.configure({
      volume: options.volume,
      soundEffects: options.soundEffects,
      music: options.music,
    })
  }, [options])
}

export function useOptions() {
  return useOptionsStore((state) => state.options)
}

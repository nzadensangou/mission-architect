import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Options } from '../types'

export const DEFAULT_OPTIONS: Options = {
  theme: 'dark',
  language: 'fr',
  textSize: 'normal',
  animations: true,
  volume: 70,
  soundEffects: true,
  music: false,
}

interface OptionsState {
  options: Options
  setOption: <K extends keyof Options>(key: K, value: Options[K]) => void
  reset: () => void
}

export const useOptionsStore = create<OptionsState>()(
  persist(
    (set) => ({
      options: DEFAULT_OPTIONS,
      setOption: (key, value) =>
        set((state) => ({ options: { ...state.options, [key]: value } })),
      reset: () => set({ options: DEFAULT_OPTIONS }),
    }),
    { name: 'options' },
  ),
)

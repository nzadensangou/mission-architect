import { Volume2 } from 'lucide-react'
import { useOptionsStore } from '../../store/optionsStore'
import { audio } from '../../utils/audio'

interface VolumeControlProps {
  label: string
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function VolumeControl({ label, value, onChange, disabled }: VolumeControlProps) {
  return (
    <div className={disabled ? 'opacity-50' : ''}>
      <div className="flex items-center justify-between">
        <label htmlFor={`volume-${label}`} className="field-label flex items-center gap-1.5">
          <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
          {label}
        </label>
        <span className="font-mono text-xs text-muted">{value} %</span>
      </div>
      <input
        id={`volume-${label}`}
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        disabled={disabled}
        className="range mt-2"
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}

export function GeneralVolume() {
  const volume = useOptionsStore((state) => state.options.volume)
  const setOption = useOptionsStore((state) => state.setOption)

  return (
    <VolumeControl
      label="Volume général"
      value={volume}
      onChange={(value) => {
        setOption('volume', value)
        audio.configure({
          volume: value,
          soundEffects: useOptionsStore.getState().options.soundEffects,
          music: useOptionsStore.getState().options.music,
        })
        audio.play('click')
      }}
    />
  )
}

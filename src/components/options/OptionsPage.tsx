import { ThemeSelector } from './ThemeSelector'
import { LanguageSelector } from './LanguageSelector'
import { TextSizeSelector } from './TextSizeSelector'
import { GeneralVolume, VolumeControl } from './VolumeControl'
import { useOptionsStore } from '../../store/optionsStore'
import { audio } from '../../utils/audio'

function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className={`flex items-start justify-between gap-4 ${disabled ? 'opacity-50' : ''}`}>
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className="switch"
        data-on={checked}
        disabled={disabled}
        onClick={() => {
          audio.play('click')
          onChange(!checked)
        }}
      >
        <span className="switch-knob" />
      </button>
    </div>
  )
}

export function OptionsPage() {
  const options = useOptionsStore((state) => state.options)
  const setOption = useOptionsStore((state) => state.setOption)

  return (
    <div className="space-y-4">
      <section className="panel" aria-labelledby="display-title">
        <div className="panel-head">
          <h2 id="display-title" className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
            Affichage
          </h2>
        </div>
        <div className="space-y-5 px-5 py-5">
          <ThemeSelector />
          <div className="divider" />
          <LanguageSelector />
          <div className="divider" />
          <TextSizeSelector />
          <div className="divider" />
          <Toggle
            label="Animations"
            description="Désactive les mouvements et transitions de l’interface."
            checked={options.animations}
            onChange={(value) => setOption('animations', value)}
          />
        </div>
      </section>

      <section className="panel" aria-labelledby="audio-title">
        <div className="panel-head">
          <h2 id="audio-title" className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
            Audio
          </h2>
        </div>
        <div className="space-y-5 px-5 py-5">
          <GeneralVolume />
          <div className="divider" />
          <Toggle
            label="Effets sonores"
            description="Clics, ajouts de composants, alertes, succès et échecs."
            checked={options.soundEffects}
            onChange={(value) => {
              setOption('soundEffects', value)
              audio.configure({ ...options, soundEffects: value })
            }}
          />
          <div className="divider" />
          <Toggle
            label="Musique de fond"
            description="Nappe sonore discrète générée en temps réel."
            checked={options.music}
            onChange={(value) => {
              setOption('music', value)
              audio.configure({ ...options, music: value })
            }}
          />
          <div className="divider" />
          <VolumeControl
            label="Volume des effets"
            value={options.soundEffects ? options.volume : 0}
            onChange={(value) => setOption('volume', value)}
            disabled={!options.soundEffects}
          />
        </div>
      </section>
    </div>
  )
}

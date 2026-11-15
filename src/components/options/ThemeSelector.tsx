import { Segmented } from '../ui/Segmented'
import { useOptionsStore } from '../../store/optionsStore'
import { audio } from '../../utils/audio'

export function ThemeSelector() {
  const theme = useOptionsStore((state) => state.options.theme)
  const setOption = useOptionsStore((state) => state.setOption)

  return (
    <Segmented
      name="theme"
      label="Thème"
      value={theme}
      onChange={(value) => {
        audio.play('click')
        setOption('theme', value)
      }}
      options={[
        { value: 'dark', label: 'Sombre' },
        { value: 'light', label: 'Clair' },
      ]}
    />
  )
}

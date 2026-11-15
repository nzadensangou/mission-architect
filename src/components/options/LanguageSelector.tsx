import { Segmented } from '../ui/Segmented'
import { useOptionsStore } from '../../store/optionsStore'

export function LanguageSelector() {
  const language = useOptionsStore((state) => state.options.language)
  const setOption = useOptionsStore((state) => state.setOption)

  return (
    <Segmented
      name="language"
      label="Langue"
      value={language}
      onChange={(value) => setOption('language', value)}
      options={[
        { value: 'fr', label: 'Français' },
        { value: 'en', label: 'English', disabled: true },
      ]}
    />
  )
}

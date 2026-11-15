import { Segmented } from '../ui/Segmented'
import { useOptionsStore } from '../../store/optionsStore'

export function TextSizeSelector() {
  const textSize = useOptionsStore((state) => state.options.textSize)
  const setOption = useOptionsStore((state) => state.setOption)

  return (
    <Segmented
      name="textSize"
      label="Taille du texte"
      value={textSize}
      onChange={(value) => setOption('textSize', value)}
      options={[
        { value: 'small', label: 'Petit' },
        { value: 'normal', label: 'Normal' },
        { value: 'large', label: 'Grand' },
      ]}
    />
  )
}

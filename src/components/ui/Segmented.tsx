interface SegmentedProps<T extends string> {
  label: string
  value: T
  options: { value: T; label: string; disabled?: boolean }[]
  onChange: (value: T) => void
  name: string
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  name,
}: SegmentedProps<T>) {
  return (
    <fieldset className="space-y-2">
      <legend className="field-label">{label}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const selected = option.value === value
          return (
            <label
              key={option.value}
              className={`cursor-pointer select-none rounded-lg border px-3.5 py-2 text-sm transition ${
                selected
                  ? 'border-primary/70 bg-primary/15 text-primary'
                  : 'border-line bg-panel-alt text-muted hover:border-primary/40 hover:text-ink'
              } ${option.disabled ? 'pointer-events-none opacity-40' : ''}`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                disabled={option.disabled}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

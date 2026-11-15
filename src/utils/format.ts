export function formatMoney(value: number): string {
  return `${formatNumber(value)} M$`
}

export function formatMass(value: number): string {
  return `${formatNumber(value)} kg`
}

export function formatKwh(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${formatNumber(value)} kWh`
}

export function formatKw(value: number): string {
  return `${formatNumber(value)} kW`
}

export function formatPercent(value: number): string {
  return `${Math.round(value)} %`
}

export function formatNumber(value: number): string {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace('.', ',')
}

export function formatDay(day: number, total: number): string {
  return `JOUR ${Math.min(day, total)} / ${total}`
}

export function plural(value: number, singular: string, pluralForm?: string): string {
  return `${formatNumber(value)} ${value > 1 ? (pluralForm ?? `${singular}s`) : singular}`
}

export type ComponentCategory =
  | 'structure'
  | 'energy'
  | 'battery'
  | 'camera'
  | 'antenna'
  | 'attitude'
  | 'shield'

export interface SatelliteComponent {
  id: string
  name: string
  category: ComponentCategory
  required: boolean
  maxQuantity: number
  mass: number
  cost: number
  energyProduction: number
  energyConsumption: number
  batteryCapacity: number
  observationsPerDay: number
  transmissionPerDay: number
  reliabilityBonus: number
  description: string
  /** Résumé lisible de l'effet, affiché dans le catalogue */
  effect: string
}

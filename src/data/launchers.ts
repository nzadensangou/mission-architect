import type { Launcher } from '../types'

export const LAUNCHERS: Launcher[] = [
  {
    id: 'leger',
    name: 'Lanceur Léger',
    payloadCapacity: 150,
    cost: 18,
    reliability: 88,
    description: 'Économique et rapide. Pour les satellites compacts, sans marge d’erreur.',
  },
  {
    id: 'moyen',
    name: 'Lanceur Moyen',
    payloadCapacity: 400,
    cost: 32,
    reliability: 94,
    description: 'Le bon compromis : masse confortable, fiabilité élevée, coût maîtrisé.',
  },
  {
    id: 'lourd',
    name: 'Lanceur Lourd',
    payloadCapacity: 900,
    cost: 55,
    reliability: 97,
    description: 'Fiabilité maximale et grande capacité. Il consomme la moitié du budget.',
  },
]

export function getLauncher(id: string): Launcher | undefined {
  return LAUNCHERS.find((launcher) => launcher.id === id)
}

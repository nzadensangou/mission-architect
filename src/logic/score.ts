import type { Mission } from '../types'
import { rankForScore } from './config'

export interface ScoreBreakdown {
  observations: number
  transmission: number
  budget: number
  reliability: number
  total: number
  rank: string
}

/**
 * Score (§12.3 / §18.9) :
 *  0,35 × obs          (observations / objectif, plafonné à 1)
 *  0,25 × transmission (données transmises / observations, plafonné à 1)
 *  0,20 × budget       (budget restant / budget initial)
 *  0,20 × fiabilité    (fiabilité / 100)
 */
export function scoreBreakdown(mission: Mission): ScoreBreakdown {
  const observations = clamp01(
    mission.observationGoal > 0 ? mission.observations / mission.observationGoal : 0,
  )
  const transmission = clamp01(
    mission.observations > 0 ? mission.transmittedData / mission.observations : 0,
  )
  const budget = clamp01(
    mission.budgetInitial > 0 ? mission.budgetRestant / mission.budgetInitial : 0,
  )
  const reliability = clamp01(mission.reliability / 100)

  const total = Math.round(
    100 * (0.35 * observations + 0.25 * transmission + 0.2 * budget + 0.2 * reliability),
  )

  return {
    observations,
    transmission,
    budget,
    reliability,
    total,
    rank: rankForScore(total),
  }
}

export function computeScore(mission: Mission): number {
  return scoreBreakdown(mission).total
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

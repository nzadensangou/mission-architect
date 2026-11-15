import { round1 } from './budget'

export function clampBattery(value: number, capacity: number): number {
  if (capacity <= 0) return 0
  return round1(Math.min(capacity, Math.max(0, value)))
}

export function batteryPercent(battery: number, capacity: number): number {
  if (capacity <= 0) return 0
  return Math.round((battery / capacity) * 100)
}

export function applyDailyEnergy(battery: number, netDaily: number, capacity: number): number {
  return clampBattery(battery + netDaily, capacity)
}

export function isEmpty(battery: number): boolean {
  return battery <= 0.05
}

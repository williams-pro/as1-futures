import { PERFORMANCE_COLOR_CONSTANTS, PerformanceLevel } from '@/app/(private)/players/[playerId]/_constants/performance-colors'

export const PERFORMANCE_COLORS = PERFORMANCE_COLOR_CONSTANTS.COLORS

export function getPerformanceLevel(percentile: number): PerformanceLevel {
  if (percentile >= PERFORMANCE_COLOR_CONSTANTS.THRESHOLDS.HIGH_MIN) return PERFORMANCE_COLOR_CONSTANTS.LEVELS.HIGH as PerformanceLevel
  if (percentile >= PERFORMANCE_COLOR_CONSTANTS.THRESHOLDS.MEDIUM_MIN) return PERFORMANCE_COLOR_CONSTANTS.LEVELS.MEDIUM as PerformanceLevel
  return PERFORMANCE_COLOR_CONSTANTS.LEVELS.LOW as PerformanceLevel
}

export function getPerformanceColor(percentile: number) {
  const level = getPerformanceLevel(percentile)
  return PERFORMANCE_COLORS[level]
}

export const PERFORMANCE_COLOR_CONSTANTS = {
  LEVELS: {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
  },
  THRESHOLDS: {
    HIGH_MIN: 71,
    MEDIUM_MIN: 51,
    LOW_MAX: 50
  },
  COLORS: {
    LOW: {
      bg: 'bg-red-500',
      text: 'text-red-600',
      border: 'border-red-200',
      icon: '🔴'
    },
    MEDIUM: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-600',
      border: 'border-yellow-200',
      icon: '🟡'
    },
    HIGH: {
      bg: 'bg-green-500',
      text: 'text-green-600',
      border: 'border-green-200',
      icon: '🟢'
    }
  }
} as const

export type PerformanceLevel = keyof typeof PERFORMANCE_COLOR_CONSTANTS.COLORS
export type PerformanceColorConstants = typeof PERFORMANCE_COLOR_CONSTANTS

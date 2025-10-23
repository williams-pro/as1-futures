export const CATEGORY_ICON_CONSTANTS = {
  ICON_MAP: {
    'Target': 'Target',
    'Zap': 'Zap',
    'Shield': 'Shield',
    'Activity': 'Activity',
    'Crosshair': 'Crosshair',
    'Wind': 'Wind',
    'ArrowRight': 'ArrowRight',
    'Move': 'Move',
    'Circle': 'Circle',
    'Swords': 'Swords',
    'BarChart3': 'BarChart3',
    'Sword': 'Sword', // Para ATTACKING
    'Goal': 'Goal', // Para GOALKEEPING
    'Flag': 'Flag' // Para SET PIECES
  },
  DEFAULTS: {
    ICON: 'BarChart3',
    CLASS_NAME: 'h-4 w-4',
    COLORED: true
  }
} as const

export type CategoryIconConstants = typeof CATEGORY_ICON_CONSTANTS
export type IconName = keyof typeof CATEGORY_ICON_CONSTANTS.ICON_MAP

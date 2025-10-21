export const STAT_FORMATTER_CONSTANTS = {
  CATEGORY_TRANSLATIONS: {
    'Goals': 'Goles',
    'Passing': 'Pases', 
    'Defense': 'Defensa',
    'Physical': 'Físico',
    'Shooting': 'Remates',
    'Aerial': 'Aéreo',
    'Crossing': 'Centros',
    'Dribbling': 'Regates',
    'Possession': 'Posesión',
    'Duels': 'Duelos'
  },
  CATEGORY_ICONS: {
    'Goals': 'Target',
    'Passing': 'Zap',
    'Defense': 'Shield', 
    'Physical': 'Activity',
    'Shooting': 'Crosshair',
    'Aerial': 'Wind',
    'Crossing': 'ArrowRight',
    'Dribbling': 'Move',
    'Possession': 'Circle',
    'Duels': 'Swords'
  },
  CATEGORY_COLORS: {
    'Goals': 'text-green-600',
    'Passing': 'text-blue-600',
    'Defense': 'text-red-600',
    'Physical': 'text-purple-600', 
    'Shooting': 'text-yellow-600',
    'Aerial': 'text-indigo-600',
    'Crossing': 'text-cyan-600',
    'Dribbling': 'text-pink-600',
    'Possession': 'text-orange-600',
    'Duels': 'text-gray-600'
  },
  CATEGORY_ICON_COLORS: {
    'Goals': 'text-green-500',
    'Passing': 'text-blue-500',
    'Defense': 'text-red-500',
    'Physical': 'text-purple-500', 
    'Shooting': 'text-yellow-500',
    'Aerial': 'text-indigo-500',
    'Crossing': 'text-cyan-500',
    'Dribbling': 'text-pink-500',
    'Possession': 'text-orange-500',
    'Duels': 'text-gray-500'
  },
  CATEGORY_BACKGROUND_COLORS: {
    'Goals': 'bg-green-50 dark:bg-green-950/20',
    'Passing': 'bg-blue-50 dark:bg-blue-950/20',
    'Defense': 'bg-red-50 dark:bg-red-950/20',
    'Physical': 'bg-purple-50 dark:bg-purple-950/20', 
    'Shooting': 'bg-yellow-50 dark:bg-yellow-950/20',
    'Aerial': 'bg-indigo-50 dark:bg-indigo-950/20',
    'Crossing': 'bg-cyan-50 dark:bg-cyan-950/20',
    'Dribbling': 'bg-pink-50 dark:bg-pink-950/20',
    'Possession': 'bg-orange-50 dark:bg-orange-950/20',
    'Duels': 'bg-gray-50 dark:bg-gray-950/20'
  },
  DEFAULTS: {
    ICON: 'BarChart3',
    COLOR: 'text-gray-600',
    ICON_COLOR: 'text-gray-500',
    BACKGROUND_COLOR: 'bg-gray-50 dark:bg-gray-950/20'
  }
} as const

export type StatFormatterConstants = typeof STAT_FORMATTER_CONSTANTS

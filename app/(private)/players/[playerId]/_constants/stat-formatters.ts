export const STAT_FORMATTER_CONSTANTS = {
  CATEGORY_TRANSLATIONS: {
    'ATTACKING': 'Attacking',
    'PASSING': 'Passing', 
    'DEFENSIVE': 'Defensive',
    'POSSESSION': 'Possession',
    'GOALKEEPING': 'Goalkeeping',
    'SET PIECES': 'Set Pieces'
  },
  CATEGORY_ICONS: {
    'ATTACKING': 'Sword', // Representa ataque, goles, tiros
    'PASSING': 'Zap', // Representa pases rápidos y precisos
    'DEFENSIVE': 'Shield', // Representa defensa y protección
    'POSSESSION': 'Circle', // Representa control del balón
    'GOALKEEPING': 'Goal', // Representa portería y paradas
    'SET PIECES': 'Flag' // Representa tiros libres, córners, penales
  },
  CATEGORY_COLORS: {
    'ATTACKING': 'text-red-600', // Rojo para ataque y goles
    'PASSING': 'text-blue-600', // Azul para pases y distribución
    'DEFENSIVE': 'text-green-600', // Verde para defensa y recuperación
    'POSSESSION': 'text-orange-600', // Naranja para posesión y control
    'GOALKEEPING': 'text-purple-600', // Púrpura para portería
    'SET PIECES': 'text-yellow-600' // Amarillo para jugadas a balón parado
  },
  CATEGORY_ICON_COLORS: {
    'ATTACKING': 'text-red-500', // Rojo para ataque y goles
    'PASSING': 'text-blue-500', // Azul para pases y distribución
    'DEFENSIVE': 'text-green-500', // Verde para defensa y recuperación
    'POSSESSION': 'text-orange-500', // Naranja para posesión y control
    'GOALKEEPING': 'text-purple-500', // Púrpura para portería
    'SET PIECES': 'text-yellow-500' // Amarillo para jugadas a balón parado
  },
  CATEGORY_BACKGROUND_COLORS: {
    'ATTACKING': 'bg-red-50 dark:bg-red-950/20', // Fondo rojo suave para ataque
    'PASSING': 'bg-blue-50 dark:bg-blue-950/20', // Fondo azul suave para pases
    'DEFENSIVE': 'bg-green-50 dark:bg-green-950/20', // Fondo verde suave para defensa
    'POSSESSION': 'bg-orange-50 dark:bg-orange-950/20', // Fondo naranja suave para posesión
    'GOALKEEPING': 'bg-purple-50 dark:bg-purple-950/20', // Fondo púrpura suave para portería
    'SET PIECES': 'bg-yellow-50 dark:bg-yellow-950/20' // Fondo amarillo suave para jugadas a balón parado
  },
  DEFAULTS: {
    ICON: 'BarChart3',
    COLOR: 'text-gray-600',
    ICON_COLOR: 'text-gray-500',
    BACKGROUND_COLOR: 'bg-gray-50 dark:bg-gray-950/20'
  }
} as const

export type StatFormatterConstants = typeof STAT_FORMATTER_CONSTANTS

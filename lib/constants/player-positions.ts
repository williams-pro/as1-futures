// Player positions based on actual database values
export const PLAYER_POSITIONS = [
  'GOALKEEPER',
  'CENTRAL BACK',
  'RIGHT BACK',
  'LEFT BACK',
  'D.MIDFIELDER',
  'WINGER',
  'MIDFIELDER',
  'STRIKER'
] as const

export type PlayerPosition = typeof PLAYER_POSITIONS[number]

// Position categories for better organization
export const POSITION_CATEGORIES = {
  GOALKEEPER: ['GOALKEEPER'],
  DEFENDERS: ['CENTRAL BACK', 'RIGHT BACK', 'LEFT BACK'],
  MIDFIELDERS: ['D.MIDFIELDER', 'WINGER', 'MIDFIELDER'],
  FORWARDS: ['STRIKER']
} as const

// Position display names (more user-friendly)
export const POSITION_DISPLAY_NAMES: Record<PlayerPosition, string> = {
  'GOALKEEPER': 'Goalkeeper',
  'CENTRAL BACK': 'Central Back',
  'RIGHT BACK': 'Right Back',
  'LEFT BACK': 'Left Back',
  'D.MIDFIELDER': 'Defensive Midfielder',
  'WINGER': 'Winger',
  'MIDFIELDER': 'Midfielder',
  'STRIKER': 'Striker'
} as const

import { z } from 'zod'

// =====================================================
// TOURNAMENT TYPES
// =====================================================

export const TournamentStatus = z.enum(['draft', 'active', 'completed', 'archived'])
export const TournamentSeason = z.enum(['Spring', 'Summer', 'Fall', 'Winter', 'Annual'])

const BaseTournamentSchema = z.object({
  name: z.string().min(3, 'Tournament name must be at least 3 characters'),
  year: z.number().int().min(2020).max(2030),
  season: TournamentSeason,
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  description: z.string().optional(),
  max_groups: z.number().int().min(1).max(10).default(2),
  teams_per_group: z.number().int().min(3).max(10).default(5),
})

export const CreateTournamentSchema = BaseTournamentSchema.refine(
  (data) => new Date(data.end_date) > new Date(data.start_date),
  {
    message: "End date must be after start date",
    path: ["end_date"],
  }
)

export const UpdateTournamentSchema = BaseTournamentSchema.partial().extend({
  status: TournamentStatus.optional(),
})

export type TournamentStatusType = z.infer<typeof TournamentStatus>
export type TournamentSeasonType = z.infer<typeof TournamentSeason>
export type CreateTournamentData = z.infer<typeof CreateTournamentSchema>
export type UpdateTournamentData = z.infer<typeof UpdateTournamentSchema>

export interface Tournament {
  id: string
  name: string
  year: number
  season: TournamentSeasonType
  start_date: string
  end_date: string
  status: TournamentStatusType
  description?: string
  max_groups: number
  teams_per_group: number
  created_by?: string
  created_at: string
  updated_at: string
}

// =====================================================
// TOURNAMENT GROUP TYPES
// =====================================================

const BaseTournamentGroupSchema = z.object({
  tournament_id: z.string().uuid(),
  code: z.string().regex(/^[A-Z]$/, 'Code must be a single uppercase letter'),
  name: z.string().min(1, 'Group name is required'),
  display_order: z.number().int().min(1),
  is_active: z.boolean().default(true),
})

export const CreateTournamentGroupSchema = BaseTournamentGroupSchema

export const UpdateTournamentGroupSchema = BaseTournamentGroupSchema.partial().omit({ tournament_id: true })

export type CreateTournamentGroupData = z.infer<typeof CreateTournamentGroupSchema>
export type UpdateTournamentGroupData = z.infer<typeof UpdateTournamentGroupSchema>

export interface TournamentGroup {
  id: string
  tournament_id: string
  code: string
  name: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// =====================================================
// TEAM TYPES
// =====================================================

const BaseTeamSchema = z.object({
  tournament_id: z.string().uuid(),
  team_code: z.string().min(2, 'Team code must be at least 2 characters'),
  name: z.string().min(3, 'Team name must be at least 3 characters'),
  group_id: z.string().uuid(),
  logo_url: z.string().url().optional().or(z.literal('')).or(z.null()).optional(),
  is_as1_team: z.boolean().default(false),
})

export const CreateTeamSchema = BaseTeamSchema

export const UpdateTeamSchema = BaseTeamSchema.partial().omit({ tournament_id: true })

export type CreateTeamData = z.infer<typeof CreateTeamSchema>
export type UpdateTeamData = z.infer<typeof UpdateTeamSchema>

export interface Team {
  id: string
  tournament_id: string
  team_code: string
  name: string
  group_id: string
  logo_url?: string
  is_as1_team: boolean
  created_at: string
  updated_at: string
  group?: TournamentGroup
}

// =====================================================
// PLAYER TYPES
// =====================================================

export const PlayerPosition = z.enum([
  'Goalkeeper', 'Defender', 'Midfielder', 'Forward'
])

export const DominantFoot = z.enum(['Left', 'Right', 'Both'])

const BasePlayerSchema = z.object({
  tournament_id: z.string().uuid(),
  team_id: z.string().uuid(),
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  jersey_number: z.number().int().min(1).max(99),
  position: PlayerPosition,
  dominant_foot: DominantFoot,
  height_cm: z.number().int().min(150).max(220),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  photo_url: z.string().url().optional().or(z.literal('')).or(z.null()).optional(),
})

export const CreatePlayerSchema = BasePlayerSchema

export const UpdatePlayerSchema = BasePlayerSchema.partial().omit({ tournament_id: true, team_id: true })

export type PlayerPositionType = z.infer<typeof PlayerPosition>
export type DominantFootType = z.infer<typeof DominantFoot>
export type CreatePlayerData = z.infer<typeof CreatePlayerSchema>
export type UpdatePlayerData = z.infer<typeof UpdatePlayerSchema>

export interface Player {
  id: string
  tournament_id: string
  team_id: string
  first_name: string
  last_name: string
  full_name: string
  jersey_number: number
  position: PlayerPositionType
  dominant_foot: DominantFootType
  height_cm: number
  date_of_birth: string
  photo_url?: string
  created_at: string
  updated_at: string
  team?: Team
}

// =====================================================
// MATCH TYPES
// =====================================================

const BaseMatchSchema = z.object({
  tournament_id: z.string().uuid(),
  match_code: z.string().min(3, 'Match code must be at least 3 characters'),
  group_id: z.string().uuid(),
  home_team_id: z.string().uuid(),
  away_team_id: z.string().uuid(),
  match_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  match_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Invalid time format (HH:MM:SS)'),
  video_url: z.string().url().optional().or(z.literal('')).or(z.null()).optional(),
})

export const CreateMatchSchema = BaseMatchSchema.refine(
  (data) => data.home_team_id !== data.away_team_id,
  {
    message: "Home team and away team must be different",
    path: ["away_team_id"],
  }
)

export const UpdateMatchSchema = BaseMatchSchema.partial().omit({ tournament_id: true })

export type CreateMatchData = z.infer<typeof CreateMatchSchema>
export type UpdateMatchData = z.infer<typeof UpdateMatchSchema>

export interface Match {
  id: string
  tournament_id: string
  match_code: string
  group_id: string
  home_team_id: string
  away_team_id: string
  match_date: string
  match_time: string
  video_url?: string
  created_at: string
  updated_at: string
  home_team?: Team
  away_team?: Team
  group?: TournamentGroup
}

// =====================================================
// FILE UPLOAD TYPES
// =====================================================

export interface FileUploadResult {
  success: boolean
  url?: string
  error?: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

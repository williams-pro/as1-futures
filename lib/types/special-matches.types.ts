export interface SpecialMatch {
  id: string
  tournament_id: string
  match_code: string
  match_type: string // "Semifinal", "Final", "Quarterfinal", etc.
  match_date: string
  match_time: string
  video_url?: string
  home_team_id?: string
  away_team_id?: string
  home_team_display?: string
  away_team_display?: string
  created_at: string
  updated_at: string
}

export interface SpecialMatchWithTeams extends SpecialMatch {
  home_team?: {
    id: string
    name: string
    team_code: string
    logo_url?: string
  }
  away_team?: {
    id: string
    name: string
    team_code: string
    logo_url?: string
  }
}

export interface CreateSpecialMatchData {
  tournament_id: string
  match_code: string
  match_type: string
  match_date: string
  match_time: string
  video_url?: string
  home_team_id?: string
  away_team_id?: string
  home_team_display?: string
  away_team_display?: string
}

export interface UpdateSpecialMatchData extends Partial<CreateSpecialMatchData> {
  id: string
}

export const COMMON_MATCH_TYPES = [
  "Semifinal",
  "Final", 
  "Quarterfinal",
  "Round of 16",
  "Third Place",
  "Friendly",
  "Exhibition"
] as const

export type MatchType = typeof COMMON_MATCH_TYPES[number]

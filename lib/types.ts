// Core domain types for AS1 Futures

export type UserRole = "scout" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}

export type GroupType = "A" | "B"

export interface Team {
  id: string
  name: string
  group: GroupType
  isAS1Team: boolean
  logoUrl?: string
  description?: string
}

export interface Player {
  id: string
  firstName: string
  lastName: string
  jerseyNumber: number
  position: string
  teamId: string
  photoUrl?: string
  videoUrl?: string
  birthDate: string
  height?: number
  weight?: number
  nationality: string
  stats?: PlayerStats
}

export interface PlayerStats {
  gamesPlayed: number
  goals?: number
  assists?: number
  yellowCards?: number
  redCards?: number
  minutesPlayed?: number
}

export interface Match {
  id: string
  homeTeamId: string
  awayTeamId: string
  date: string
  time: string
  venue: string
  videoUrl?: string
  videoProvider?: "youtube" | "veo"
  status: "scheduled" | "live" | "finished"
  score?: {
    home: number
    away: number
  }
}

export interface Favorite {
  playerId: string
  scoutId: string
  createdAt: string
  isExclusive: boolean
  order?: number
}

export interface ScoutMetrics {
  scoutId: string
  totalFavorites: number
  totalExclusives: number
  lastActivity: string
}

export interface CSVImportResult {
  success: boolean
  recordsImported: number
  errors?: CSVError[]
}

export interface CSVError {
  line: number
  column: string
  value: string
  error: string
}

export interface Scout {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  isActive: boolean
  lastLogin?: string
  favoritesCount: number
  exclusivesCount: number
  createdAt: string
}

export interface ImportHistory {
  id: string
  type: "teams" | "players" | "matches" | "scouts"
  fileName: string
  recordsImported: number
  status: "success" | "failed"
  errors?: CSVError[]
  importedBy: string
  importedAt: string
}

export interface PlayerMetric {
  playerId: string
  playerName: string
  teamName: string
  favoritesCount: number
  exclusivesCount: number
  totalMarks: number
  scoutCount: number
  scouts?: string[]
  avgTimeOnPage?: number
}

export interface TeamMetric {
  teamId: string
  teamName: string
  group: GroupType
  totalPlayers: number
  markedPlayers: number
  discoveryRate: number
}

export interface ScoutActivityMetric {
  scoutId: string
  scoutName: string
  email: string
  loginCount: number
  lastLogin?: string
  playersViewed: number
  favoritesAdded: number
  exclusivesAdded: number
  timeOnPlatform: number
}

export interface DailyActivitySummary {
  date: string
  activeScouts: number
  playersViewed: number
  favoritesAdded: number
  favoritesRemoved: number
  exclusivesAdded: number
  exclusivesRemoved: number
  topPlayers: PlayerMetric[]
  topScouts: ScoutActivityMetric[]
}

export type ReportType = "daily-activity" | "scout-activity" | "player-popularity" | "team-discovery"

export interface ReportFilter {
  startDate: string
  endDate: string
  group?: GroupType
  teamId?: string
  scoutId?: string
}

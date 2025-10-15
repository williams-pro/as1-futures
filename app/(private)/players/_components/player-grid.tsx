"use client"

import { PlayerListItem } from "@/components/shared/player-list-item"
import { Users } from "lucide-react"

interface Player {
  id: string
  first_name: string
  last_name: string
  jersey_number: number
  position: string
  team: {
    id: string
    name: string
    team_code: string
    group: string
  }
  tournament_group: {
    name: string
  }
  photo_url?: string
  video_url?: string
  is_favorite?: boolean
  is_exclusive?: boolean
}

interface PlayerGridProps {
  players: Player[]
}

export function PlayerGrid({ players }: PlayerGridProps) {
  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-6">
          <Users className="h-12 w-12 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">No players found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    )
  }

  // Convert Supabase data to the format expected by PlayerListItem
  const adaptedPlayers = players.map((player) => ({
    id: player.id,
    firstName: player.first_name,
    lastName: player.last_name,
    jerseyNumber: player.jersey_number,
    position: player.position,
    teamId: player.team.id,
    teamName: player.team.name,
    teamCode: player.team.team_code,
    group: player.tournament_group.name,
    photoUrl: player.photo_url,
    videoUrl: player.video_url,
    isFavorite: player.is_favorite || false,
    isExclusive: player.is_exclusive || false,
    // Add default values for required fields
    birthDate: new Date().toISOString().split('T')[0], // Default to today
    height: 175, // Default height
    dominantFoot: 'Right' as const,
    nationality: 'Unknown',
    stats: {
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      minutesPlayed: 0,
    }
  }))

  return (
    <div className="space-y-2">
      {adaptedPlayers.map((player) => (
        <PlayerListItem key={player.id} player={player} />
      ))}
    </div>
  )
}

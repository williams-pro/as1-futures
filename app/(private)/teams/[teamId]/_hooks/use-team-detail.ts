"use client"

import { useTeamDetailsSupabase } from "./use-team-details-supabase"

export function useTeamDetail(teamId: string) {
  const { teamDetails, loading, error } = useTeamDetailsSupabase(teamId)

  // Mapear datos para compatibilidad con componentes existentes
  const team = teamDetails ? {
    id: teamDetails.id,
    team_code: teamDetails.team_code,
    name: teamDetails.name,
    logoUrl: teamDetails.logoUrl,
    isAS1Team: teamDetails.isAS1Team,
    group: teamDetails.group as "A" | "B",
    description: undefined
  } : null

  const players = teamDetails?.players.map(player => ({
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    jerseyNumber: player.jerseyNumber,
    position: player.position,
    teamId: teamDetails.id,
    photoUrl: player.photoUrl,
    videoUrl: undefined, // Not available in team details
    birthDate: player.birthDate,
    height: player.height,
    dominantFoot: player.dominantFoot as "left" | "right" | "both",
    stats: undefined
  })) || []

  return { 
    team, 
    players, 
    loading, 
    error 
  }
}

"use client"

import { usePlayerDetailsSupabase } from "./use-player-details-supabase"
import { usePlayerActions } from "@/hooks/use-player-actions"

export function usePlayerDetail(playerId: string) {
  const { playerDetails, loading, error } = usePlayerDetailsSupabase(playerId)

  // Mapear datos para compatibilidad con componentes existentes
  const player = playerDetails ? {
    id: playerDetails.id,
    firstName: playerDetails.firstName,
    lastName: playerDetails.lastName,
    jerseyNumber: playerDetails.jerseyNumber,
    position: playerDetails.position,
    photoUrl: playerDetails.photoUrl,
    dominantFoot: playerDetails.dominantFoot as "left" | "right" | "both",
    height: playerDetails.height,
    birthDate: playerDetails.birthDate,
    teamId: playerDetails.teamId,
    stats: undefined
  } : null

  const team = playerDetails?.team ? {
    id: playerDetails.team.id,
    team_code: playerDetails.team.team_code,
    name: playerDetails.team.name,
    logoUrl: playerDetails.team.logoUrl,
    isAS1Team: playerDetails.team.isAS1Team,
    group: playerDetails.team.group as "A" | "B",
    description: undefined
  } : null

  const user = { role: "scout" as const } // Mock user for now
  
  const playerActions = usePlayerActions({ 
    playerId, 
    showConfirmationDialogs: true 
  })

  return {
    player,
    team,
    user,
    loading,
    error,
    ...playerActions,
  }
}

"use client"

import { getPlayerById, getTeamById } from "@/lib/mock-data"
import { usePlayerActions } from "@/hooks/use-player-actions"
import { useMemo } from "react"

export function usePlayerDetail(playerId: string) {
  const player = useMemo(() => getPlayerById(playerId), [playerId])
  const team = useMemo(() => (player ? getTeamById(player.teamId) : null), [player])
  
  const playerActions = usePlayerActions({ 
    playerId, 
    showConfirmationDialogs: true 
  })

  return {
    player,
    team,
    ...playerActions,
  }
}

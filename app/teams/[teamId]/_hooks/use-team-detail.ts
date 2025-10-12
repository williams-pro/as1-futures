"use client"

import { getTeamById, getPlayersByTeam } from "@/lib/mock-data"
import { useMemo } from "react"

export function useTeamDetail(teamId: string) {
  const team = useMemo(() => getTeamById(teamId), [teamId])
  const players = useMemo(() => (team ? getPlayersByTeam(team.id) : []), [team])

  return { team, players }
}

import { getTeamsByGroup, getPlayersByTeam } from "@/lib/mock-data"
import type { GroupType } from "@/lib/types"

export function useTeamData(group: GroupType) {
  const teams = getTeamsByGroup(group)

  const teamsWithPlayerCount = teams.map((team) => ({
    ...team,
    playerCount: getPlayersByTeam(team.id).length,
  }))

  return { teams: teamsWithPlayerCount }
}

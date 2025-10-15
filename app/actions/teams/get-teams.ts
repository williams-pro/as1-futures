"use server"

import { createServerClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"
import { ApiResponse } from "@/lib/supabase/types"

export interface TeamWithGroup {
  id: string
  team_code: string
  name: string
  logo_url: string | null
  is_as1_team: boolean
  group: {
    id: string
    code: string
    name: string
  }
  created_at: string
  updated_at: string
}

export async function getTeams(tournamentId: string): Promise<ApiResponse<TeamWithGroup[]>> {
  try {
    const supabase = await createServerClient()
    
    logger.data("GET_TEAMS", "Fetching teams for tournament", { tournamentId })
    
    const { data: teams, error } = await supabase
      .from('teams')
      .select(`
        id,
        team_code,
        name,
        logo_url,
        is_as1_team,
        created_at,
        updated_at,
        tournament_groups!inner(
          id,
          code,
          name
        )
      `)
      .eq('tournament_id', tournamentId)
      .order('tournament_groups.display_order')
      .order('name')
    
    if (error) {
      logger.dataError("GET_TEAMS", "Failed to fetch teams", { tournamentId }, error)
      return {
        success: false,
        error: "Failed to fetch teams",
        data: null
      }
    }
    
    // Transform data to match interface
    const transformedTeams: TeamWithGroup[] = teams.map(team => ({
      id: team.id,
      team_code: team.team_code,
      name: team.name,
      logo_url: team.logo_url,
      is_as1_team: team.is_as1_team,
      group: {
        id: team.tournament_groups.id,
        code: team.tournament_groups.code,
        name: team.tournament_groups.name
      },
      created_at: team.created_at,
      updated_at: team.updated_at
    }))
    
    logger.data("GET_TEAMS", "Teams fetched successfully", { 
      tournamentId, 
      count: transformedTeams.length 
    })
    
    return {
      success: true,
      data: transformedTeams,
      error: null
    }
    
  } catch (error) {
    logger.dataError("GET_TEAMS", "Unexpected error fetching teams", { tournamentId }, error)
    return {
      success: false,
      error: "Unexpected error fetching teams",
      data: null
    }
  }
}


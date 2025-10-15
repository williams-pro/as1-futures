'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'

export async function getTeamsByGroup(group?: string): Promise<ApiResponse> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'GET_TEAMS_BY_GROUP')

    // 2. Construir query base
    let query = supabase
      .from('teams')
      .select(`
        id,
        team_code,
        name,
        logo_url,
        is_as1_team,
        group_id,
        group:tournament_groups(
          id,
          name,
          code
        )
      `)
      .order('is_as1_team', { ascending: false })
      .order('name', { ascending: true })

    // 3. Filtrar por grupo si se especifica
    if (group && group !== 'all') {
      // Primero necesitamos obtener el group_id del grupo
      const { data: groupData } = await supabase
        .from('tournament_groups')
        .select('id')
        .eq('code', group)
        .single()
      
      if (groupData?.id) {
        query = query.eq('group_id', groupData.id)
        logger.database('GET_TEAMS_BY_GROUP', `Filtering by group_id: ${groupData.id} for group: ${group}`, user.id)
      }
    }

    // 4. Ejecutar query
    const { data: teams, error } = await query

    if (error) {
      logger.databaseError('GET_TEAMS_BY_GROUP', 'Failed to fetch teams', user.id, error)
      return createErrorResponseFromSupabase(error, 'GET_TEAMS_BY_GROUP')
    }

    // 5. Obtener conteo de jugadores para cada equipo
    const teamsWithPlayerCount = await Promise.all(
      (teams || []).map(async (team) => {
        const { count: playerCount } = await supabase
          .from('players')
          .select('*', { count: 'exact', head: true })
          .eq('team_id', team.id)

        return {
          ...team,
          playerCount: playerCount || 0,
        }
      })
    )

    logger.database('GET_TEAMS_BY_GROUP', `Teams fetched successfully for group: ${group || 'all'}, count: ${teamsWithPlayerCount.length}`, user.id)
    
    // Debug: Log de equipos por grupo
    if (group && group !== 'all') {
      const groupTeams = teamsWithPlayerCount.filter(team => team.group && 'code' in team.group && team.group.code === group)
      logger.database('GET_TEAMS_BY_GROUP', `Teams for group ${group}: ${groupTeams.map(t => t.name).join(', ')}`, user.id)
    }
    
    return createSuccessResponse(teamsWithPlayerCount)
  } catch (error) {
    logger.error('Unexpected error', { operation: 'GET_TEAMS_BY_GROUP' })
    return createErrorResponseFromSupabase(error, 'GET_TEAMS_BY_GROUP')
  }
}

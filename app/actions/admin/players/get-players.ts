'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { Player } from '@/lib/types/admin.types'

export async function getPlayers(tournamentId?: string, teamId?: string): Promise<ApiResponse<Player[]>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'GET_PLAYERS')

    // 2. Construir query
    let query = supabase
      .from('players')
      .select(`
        *,
        team:teams(id, name, team_code, group_id)
      `)
      .order('last_name', { ascending: true })

    if (tournamentId) {
      query = query.eq('tournament_id', tournamentId)
    }

    if (teamId) {
      query = query.eq('team_id', teamId)
    }

    // 3. Operación en DB
    const { data, error } = await query

    if (error) {
      logger.databaseError('GET_PLAYERS', 'Failed to fetch players', user.id, error)
      return createErrorResponseFromSupabase(error, 'GET_PLAYERS')
    }

    logger.database('GET_PLAYERS', `Successfully fetched ${data?.length || 0} players`, user.id, { tournamentId, teamId })
    return createSuccessResponse(data || [])
  } catch (error) {
    logger.error('GET_PLAYERS', 'Unexpected error', { operation: 'GET_PLAYERS' }, error)
    return createErrorResponseFromSupabase(error, 'GET_PLAYERS')
  }
}


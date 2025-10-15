'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { Team } from '@/lib/types/admin.types'

export async function getTeams(tournamentId?: string): Promise<ApiResponse<Team[]>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'GET_TEAMS')

    // 2. Construir query
    let query = supabase
      .from('teams')
      .select(`
        *,
        group:tournament_groups(id, name, code, tournament_id)
      `)
      .order('name', { ascending: true })

    if (tournamentId) {
      query = query.eq('tournament_id', tournamentId)
    }

    // 3. Operación en DB
    const { data, error } = await query

    if (error) {
      logger.databaseError('GET_TEAMS', 'Failed to fetch teams', user.id, error)
      return createErrorResponseFromSupabase(error, 'GET_TEAMS')
    }

    logger.database('GET_TEAMS', `Successfully fetched ${data?.length || 0} teams`, user.id, { tournamentId })
    return createSuccessResponse(data || [])
  } catch (error) {
    logger.error('GET_TEAMS', 'Unexpected error', { operation: 'GET_TEAMS' }, error)
    return createErrorResponseFromSupabase(error, 'GET_TEAMS')
  }
}


'use server'

import { createServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase } from '@/lib/supabase/utils'
import { logger } from '@/lib/logger'

/**
 * Get favorite players for a tournament (for debugging purposes)
 * This function is mainly used for debugging and testing
 */
export async function getFavoritePlayers(tournamentId: string) {
  try {
    const supabase = await createServerClient()
    
    // Check if we have a valid session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      return createErrorResponseFromSupabase(sessionError, 'GET_FAVORITE_PLAYERS')
    }
    
    if (!session) {
      return createErrorResponseFromSupabase({ message: 'No session found' }, 'GET_FAVORITE_PLAYERS')
    }
    
    logger.database('GET_FAVORITE_PLAYERS', 'Fetching favorite players for tournament', tournamentId)

    // Get favorites using the same query as the context
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        player_id,
        scout_id,
        tournament_id,
        is_favorite,
        is_exclusive,
        display_order,
        created_at,
        updated_at
      `)
      .eq('tournament_id', tournamentId)
      .eq('is_favorite', true)

    if (error) {
      logger.databaseError('GET_FAVORITE_PLAYERS', 'Supabase error fetching favorite players', tournamentId, error)
      return createErrorResponseFromSupabase(error, 'GET_FAVORITE_PLAYERS')
    }

    logger.database('GET_FAVORITE_PLAYERS', `Successfully fetched ${data?.length || 0} favorite players`, tournamentId)

    return createSuccessResponse({
      players: data || []
    })
  } catch (error) {
    logger.databaseError('GET_FAVORITE_PLAYERS', 'Unexpected error fetching favorite players', tournamentId, error instanceof Error ? error : new Error(String(error)))
    return createErrorResponseFromSupabase(error, 'GET_FAVORITE_PLAYERS')
  }
}

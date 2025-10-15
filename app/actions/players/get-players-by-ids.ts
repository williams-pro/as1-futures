'use server'

import { createServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase } from '@/lib/supabase/utils'
import { logger } from '@/lib/logger'

/**
 * Get players by their IDs with complete information including team data
 * @param playerIds - Array of player IDs to fetch
 * @returns Promise with players data or error
 */
export async function getPlayersByIds(playerIds: string[]) {
  try {
    const supabase = await createServerClient()
    
    // Check if we have a valid session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      return createErrorResponseFromSupabase(sessionError, 'GET_PLAYERS_BY_IDS')
    }
    
    if (!session) {
      return createErrorResponseFromSupabase({ message: 'No session found' }, 'GET_PLAYERS_BY_IDS')
    }

    if (playerIds.length === 0) {
      return createSuccessResponse({ players: [] })
    }

    logger.database('GET_PLAYERS_BY_IDS', `Fetching ${playerIds.length} players`, undefined)

    const { data, error } = await supabase
      .from('players')
      .select(`
        id,
        first_name,
        last_name,
        jersey_number,
        position,
        team_id,
        photo_url,
        video_url,
        birth_date,
        height,
        weight,
        nationality,
        dominant_foot,
        teams (
          id,
          name,
          logo_url
        )
      `)
      .in('id', playerIds)

    if (error) {
      logger.databaseError('GET_PLAYERS_BY_IDS', 'Supabase error fetching players', undefined, error)
      return createErrorResponseFromSupabase(error, 'GET_PLAYERS_BY_IDS')
    }

    logger.database('GET_PLAYERS_BY_IDS', `Successfully fetched ${data?.length || 0} players`, undefined)

    return createSuccessResponse({
      players: data || []
    } as { players: any[] })
  } catch (error) {
    logger.databaseError('GET_PLAYERS_BY_IDS', 'Unexpected error fetching players', undefined, error instanceof Error ? error : new Error(String(error)))
    return createErrorResponseFromSupabase(error, 'GET_PLAYERS_BY_IDS')
  }
}

"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"
import type { SpecialMatchWithTeams } from "@/lib/types/special-matches.types"

export async function getSpecialMatches(tournamentId?: string) {
  try {
    const supabase = await getSupabaseServerClient()
    
    let query = supabase
      .from('special_matches')
      .select(`
        *,
        home_team:teams!home_team_id(id, name, team_code, logo_url),
        away_team:teams!away_team_id(id, name, team_code, logo_url)
      `)
      .order('match_date', { ascending: true })
      .order('match_time', { ascending: true })

    if (tournamentId) {
      query = query.eq('tournament_id', tournamentId)
    }

    const { data, error } = await query

    if (error) {
      logger.error('Failed to fetch special matches', { 
        operation: 'GET_SPECIAL_MATCHES',
        metadata: { tournamentId }
      }, error)
      return { success: false, error: 'Failed to fetch special matches' }
    }

    logger.info('Special matches fetched successfully', { 
      operation: 'GET_SPECIAL_MATCHES',
      metadata: { count: data?.length || 0 }
    })

    return { success: true, matches: data as SpecialMatchWithTeams[] }
  } catch (error) {
    logger.error('Error fetching special matches', { 
      operation: 'GET_SPECIAL_MATCHES' 
    }, error as Error)
    return { success: false, error: 'Internal server error' }
  }
}

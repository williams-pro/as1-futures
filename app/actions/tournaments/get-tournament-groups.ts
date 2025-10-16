'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function getTournamentGroups() {
  const supabase = await getSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const { data, error } = await supabase
      .from('tournament_groups')
      .select(`
        id,
        name,
        code,
        tournament_id,
        tournament:tournaments!tournament_id(
          id,
          name,
          status
        )
      `)
      .eq('tournament.status', 'active')
      .order('code', { ascending: true })

    if (error) {
      logger.databaseError('GET_TOURNAMENT_GROUPS', 'Failed to fetch tournament groups', user.id, error)
      throw error
    }

    logger.database('GET_TOURNAMENT_GROUPS', 'Tournament groups fetched successfully', user.id)

    return { success: true, groups: data || [] }
  } catch (error) {
    logger.error('Error fetching tournament groups', { operation: 'GET_TOURNAMENT_GROUPS', userId: user.id }, error as Error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: `Failed to fetch tournament groups: ${errorMessage}` }
  }
}




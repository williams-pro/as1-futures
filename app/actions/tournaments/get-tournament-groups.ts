'use server'

import { createServerClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function getTournamentGroups() {
  const supabase = await createServerClient()
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
      logger.databaseError('GET_TOURNAMENT_GROUPS', 'Failed to fetch tournament groups', error)
      throw error
    }

    logger.database('GET_TOURNAMENT_GROUPS', 'Tournament groups fetched successfully', user.id, {
      metadata: { count: data?.length || 0 }
    })

    return { success: true, groups: data || [] }
  } catch (error) {
    logger.error('GET_TOURNAMENT_GROUPS', 'Error fetching tournament groups', { userId: user.id }, error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: `Failed to fetch tournament groups: ${errorMessage}` }
  }
}


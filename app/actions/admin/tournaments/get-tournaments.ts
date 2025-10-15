'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { Tournament } from '@/lib/types/admin.types'

export async function getTournaments(): Promise<ApiResponse<Tournament[]>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'GET_TOURNAMENTS')

    // 2. Operación en DB
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      logger.databaseError('GET_TOURNAMENTS', 'Failed to fetch tournaments', user.id, error)
      return createErrorResponseFromSupabase(error, 'GET_TOURNAMENTS')
    }

    logger.database('GET_TOURNAMENTS', `Successfully fetched ${data?.length || 0} tournaments`, user.id)
    return createSuccessResponse(data || [])
  } catch (error) {
    logger.error('GET_TOURNAMENTS', 'Unexpected error', { operation: 'GET_TOURNAMENTS' }, error)
    return createErrorResponseFromSupabase(error, 'GET_TOURNAMENTS')
  }
}


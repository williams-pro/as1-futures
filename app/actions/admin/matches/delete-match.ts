'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const DeleteMatchSchema = z.object({
  id: z.string().uuid('Invalid match ID')
})

export async function deleteMatch(formData: FormData): Promise<ApiResponse<{ id: string }>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'DELETE_MATCH')

    // 2. Validación
    const data = DeleteMatchSchema.parse({
      id: formData.get('id')
    })

    // 3. Obtener información del match antes de eliminar
    const { data: match, error: fetchError } = await supabase
      .from('matches')
      .select('id, match_code, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)')
      .eq('id', data.id)
      .single()

    if (fetchError || !match) {
      logger.databaseError('DELETE_MATCH', 'Match not found', user.id, fetchError)
      return {
        success: false,
        error: 'Match not found',
        data: undefined
      }
    }

    // 4. Eliminar el match
    const { error: deleteError } = await supabase
      .from('matches')
      .delete()
      .eq('id', data.id)

    if (deleteError) {
      logger.databaseError('DELETE_MATCH', 'Failed to delete match', user.id, deleteError)
      return createErrorResponseFromSupabase(deleteError, 'DELETE_MATCH')
    }

    logger.database('DELETE_MATCH', 'Match deleted successfully', user.id, {
      matchId: match.id,
      matchCode: match.match_code,
      homeTeam: match.home_team?.name,
      awayTeam: match.away_team?.name
    })

    // 5. Revalidar cache
    revalidatePath('/admin')

    return createSuccessResponse({
      id: match.id
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error',
        data: undefined,
        errors: error.flatten().fieldErrors
      }
    }
    
    logger.error('DELETE_MATCH', 'Unexpected error', { operation: 'DELETE_MATCH' }, error)
    return createErrorResponseFromSupabase(error, 'DELETE_MATCH')
  }
}




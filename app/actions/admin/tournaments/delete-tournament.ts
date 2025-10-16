'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'

const DeleteTournamentSchema = z.object({
  id: z.string().uuid(),
})

export async function deleteTournament(formData: FormData): Promise<ApiResponse> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'DELETE_TOURNAMENT')

    // 2. Validación
    const result = DeleteTournamentSchema.safeParse({
      id: formData.get('id'),
    })
    
    if (!result.success) {
      logger.authError('DELETE_TOURNAMENT', 'Invalid tournament ID', user.id, result.error)
      return createErrorResponseFromSupabase(result.error, 'DELETE_TOURNAMENT')
    }

    // 3. Verificar que el torneo existe
    const { data: tournament, error: fetchError } = await supabase
      .from('tournaments')
      .select('id, name')
      .eq('id', result.data.id)
      .single()

    if (fetchError || !tournament) {
      logger.databaseError('DELETE_TOURNAMENT', 'Tournament not found', user.id, fetchError)
      return createErrorResponseFromSupabase(fetchError || new Error('Tournament not found'), 'DELETE_TOURNAMENT')
    }

    // 4. Operación en DB (CASCADE eliminará grupos, equipos, jugadores, etc.)
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', result.data.id)

    if (error) {
      logger.databaseError('DELETE_TOURNAMENT', 'Failed to delete tournament', user.id, error)
      return createErrorResponseFromSupabase(error, 'DELETE_TOURNAMENT')
    }

    // 5. Revalidar cache
    revalidatePath('/admin')
    revalidatePath('/admin/tournaments')
    
    logger.database('DELETE_TOURNAMENT', 'Tournament deleted successfully', user.id, { tournamentId: result.data.id, tournamentName: tournament.name })
    return createSuccessResponse({ id: result.data.id, name: tournament.name })
  } catch (error) {
    logger.error('DELETE_TOURNAMENT', 'Unexpected error', { operation: 'DELETE_TOURNAMENT' }, error)
    return createErrorResponseFromSupabase(error, 'DELETE_TOURNAMENT')
  }
}




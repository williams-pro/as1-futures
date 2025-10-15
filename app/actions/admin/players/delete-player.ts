'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'

const DeletePlayerSchema = z.object({
  id: z.string().uuid(),
})

export async function deletePlayer(formData: FormData): Promise<ApiResponse> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'DELETE_PLAYER')

    // 2. Validación
    const result = DeletePlayerSchema.safeParse({
      id: formData.get('id'),
    })
    
    if (!result.success) {
      logger.authError('DELETE_PLAYER', 'Invalid player ID', user.id, result.error)
      return createErrorResponseFromSupabase(result.error, 'DELETE_PLAYER')
    }

    // 3. Verificar que el jugador existe
    const { data: player, error: fetchError } = await supabase
      .from('players')
      .select('id, first_name, last_name, team_id, tournament_id')
      .eq('id', result.data.id)
      .single()

    if (fetchError || !player) {
      logger.databaseError('DELETE_PLAYER', 'Player not found', user.id, fetchError)
      return createErrorResponseFromSupabase(fetchError || new Error('Player not found'), 'DELETE_PLAYER')
    }

    // 4. Operación en DB (CASCADE eliminará favoritos, estadísticas, etc.)
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', result.data.id)

    if (error) {
      logger.databaseError('DELETE_PLAYER', 'Failed to delete player', user.id, error)
      return createErrorResponseFromSupabase(error, 'DELETE_PLAYER')
    }

    // 5. Revalidar cache
    revalidatePath('/admin')
    revalidatePath('/admin/players')
    revalidatePath(`/admin/tournaments/${player.tournament_id}`)
    revalidatePath(`/admin/teams/${player.team_id}`)
    
    logger.database('DELETE_PLAYER', 'Player deleted successfully', user.id, { 
      playerId: result.data.id, 
      playerName: `${player.first_name} ${player.last_name}`,
      teamId: player.team_id 
    })
    return createSuccessResponse({ 
      id: result.data.id, 
      name: `${player.first_name} ${player.last_name}` 
    })
  } catch (error) {
    logger.error('DELETE_PLAYER', 'Unexpected error', { operation: 'DELETE_PLAYER' }, error)
    return createErrorResponseFromSupabase(error, 'DELETE_PLAYER')
  }
}


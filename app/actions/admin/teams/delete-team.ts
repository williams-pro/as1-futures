'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'

const DeleteTeamSchema = z.object({
  id: z.string().uuid(),
})

export async function deleteTeam(formData: FormData): Promise<ApiResponse> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'DELETE_TEAM')

    // 2. Validación
    const result = DeleteTeamSchema.safeParse({
      id: formData.get('id'),
    })
    
    if (!result.success) {
      logger.authError('DELETE_TEAM', 'Invalid team ID', user.id, result.error)
      return createErrorResponseFromSupabase(result.error, 'DELETE_TEAM')
    }

    // 3. Verificar que el equipo existe
    const { data: team, error: fetchError } = await supabase
      .from('teams')
      .select('id, name, tournament_id')
      .eq('id', result.data.id)
      .single()

    if (fetchError || !team) {
      logger.databaseError('DELETE_TEAM', 'Team not found', user.id, fetchError)
      return createErrorResponseFromSupabase(fetchError || new Error('Team not found'), 'DELETE_TEAM')
    }

    // 4. Operación en DB (CASCADE eliminará jugadores, partidos, etc.)
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', result.data.id)

    if (error) {
      logger.databaseError('DELETE_TEAM', 'Failed to delete team', user.id, error)
      return createErrorResponseFromSupabase(error, 'DELETE_TEAM')
    }

    // 5. Revalidar cache
    revalidatePath('/admin')
    revalidatePath('/admin/teams')
    revalidatePath(`/admin/tournaments/${team.tournament_id}`)
    
    logger.database('DELETE_TEAM', 'Team deleted successfully', user.id, { 
      teamId: result.data.id, 
      teamName: team.name 
    })
    return createSuccessResponse({ id: result.data.id, name: team.name })
  } catch (error) {
    logger.error('DELETE_TEAM', 'Unexpected error', { operation: 'DELETE_TEAM' }, error)
    return createErrorResponseFromSupabase(error, 'DELETE_TEAM')
  }
}


'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { UpdateTournamentSchema } from '@/lib/types/admin.types'

const UpdateTournamentParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function updateTournament(formData: FormData): Promise<ApiResponse> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'UPDATE_TOURNAMENT')

    // 2. Validación de parámetros
    const paramsResult = UpdateTournamentParamsSchema.safeParse({
      id: formData.get('id'),
    })
    
    if (!paramsResult.success) {
      logger.authError('UPDATE_TOURNAMENT', 'Invalid tournament ID', user.id, paramsResult.error)
      return createErrorResponseFromSupabase(paramsResult.error, 'UPDATE_TOURNAMENT')
    }

    // 3. Validación de datos
    const dataResult = UpdateTournamentSchema.safeParse({
      name: formData.get('name'),
      year: formData.get('year') ? Number(formData.get('year')) : undefined,
      season: formData.get('season'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      description: formData.get('description'),
      max_groups: formData.get('max_groups') ? Number(formData.get('max_groups')) : undefined,
      teams_per_group: formData.get('teams_per_group') ? Number(formData.get('teams_per_group')) : undefined,
      status: formData.get('status'),
    })
    
    if (!dataResult.success) {
      logger.authError('UPDATE_TOURNAMENT', 'Validation failed', user.id, dataResult.error)
      return createErrorResponseFromSupabase(dataResult.error, 'UPDATE_TOURNAMENT')
    }

    // 4. Operación en DB
    const { data, error } = await supabase
      .from('tournaments')
      .update({
        ...dataResult.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paramsResult.data.id)
      .select()
      .single()

    if (error) {
      logger.databaseError('UPDATE_TOURNAMENT', 'Failed to update tournament', user.id, error)
      return createErrorResponseFromSupabase(error, 'UPDATE_TOURNAMENT')
    }

    // 5. Revalidar cache
    revalidatePath('/admin')
    revalidatePath('/admin/tournaments')
    revalidatePath(`/admin/tournaments/${paramsResult.data.id}`)
    
    logger.database('UPDATE_TOURNAMENT', 'Tournament updated successfully', user.id, { tournamentId: paramsResult.data.id })
    return createSuccessResponse(data)
  } catch (error) {
    logger.error('UPDATE_TOURNAMENT', 'Unexpected error', { operation: 'UPDATE_TOURNAMENT' }, error)
    return createErrorResponseFromSupabase(error, 'UPDATE_TOURNAMENT')
  }
}




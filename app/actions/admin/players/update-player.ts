'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { UpdatePlayerSchema } from '@/lib/types/admin.types'

const UpdatePlayerParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function updatePlayer(formData: FormData): Promise<ApiResponse> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'UPDATE_PLAYER')

    // 2. Validación de parámetros
    const paramsResult = UpdatePlayerParamsSchema.safeParse({
      id: formData.get('id'),
    })
    
    if (!paramsResult.success) {
      logger.authError('UPDATE_PLAYER', 'Invalid player ID', user.id, paramsResult.error)
      return createErrorResponseFromSupabase(paramsResult.error, 'UPDATE_PLAYER')
    }

    // 3. Validación de datos
    const photoUrl = formData.get('photo_url') as string
    const dataResult = UpdatePlayerSchema.safeParse({
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      jersey_number: formData.get('jersey_number') ? Number(formData.get('jersey_number')) : undefined,
      position: formData.get('position'),
      dominant_foot: formData.get('dominant_foot'),
      height_cm: formData.get('height_cm') ? Number(formData.get('height_cm')) : undefined,
      date_of_birth: formData.get('date_of_birth'),
      photo_url: photoUrl === '' ? null : photoUrl,
    })
    
    if (!dataResult.success) {
      logger.authError('UPDATE_PLAYER', 'Validation failed', user.id, dataResult.error)
      return createErrorResponseFromSupabase(dataResult.error, 'UPDATE_PLAYER')
    }

    // 4. Verificar que el jugador existe
    const { data: existingPlayer, error: fetchError } = await supabase
      .from('players')
      .select('id, team_id, tournament_id, first_name, last_name, jersey_number')
      .eq('id', paramsResult.data.id)
      .single()

    if (fetchError || !existingPlayer) {
      logger.databaseError('UPDATE_PLAYER', 'Player not found', user.id, fetchError)
      return createErrorResponseFromSupabase(fetchError || new Error('Player not found'), 'UPDATE_PLAYER')
    }

    // 5. Si se está cambiando el número de camiseta, verificar que no esté en uso
    if (dataResult.data.jersey_number && dataResult.data.jersey_number !== existingPlayer.jersey_number) {
      const { data: conflictingPlayer, error: jerseyError } = await supabase
        .from('players')
        .select('id, first_name, last_name')
        .eq('team_id', existingPlayer.team_id)
        .eq('jersey_number', dataResult.data.jersey_number)
        .neq('id', paramsResult.data.id)
        .single()

      if (conflictingPlayer) {
        logger.databaseError('UPDATE_PLAYER', 'Jersey number already in use', user.id, new Error('Jersey number conflict'))
        return createErrorResponseFromSupabase(
          new Error(`Jersey number ${dataResult.data.jersey_number} is already used by ${conflictingPlayer.first_name} ${conflictingPlayer.last_name}`),
          'UPDATE_PLAYER'
        )
      }
    }

    // 6. Preparar datos para actualización
    const updateData: any = {
      ...dataResult.data,
      updated_at: new Date().toISOString(),
    }

    // No incluir full_name ya que es una columna generada
    delete updateData.full_name

    // 7. Operación en DB
    const { data, error } = await supabase
      .from('players')
      .update(updateData)
      .eq('id', paramsResult.data.id)
      .select(`
        *,
        team:teams(id, name, team_code, group_id)
      `)
      .single()

    if (error) {
      logger.databaseError('UPDATE_PLAYER', 'Failed to update player', user.id, error)
      return createErrorResponseFromSupabase(error, 'UPDATE_PLAYER')
    }

    // 8. Revalidar cache
    revalidatePath('/admin')
    revalidatePath('/admin/players')
    revalidatePath(`/admin/tournaments/${existingPlayer.tournament_id}`)
    revalidatePath(`/admin/teams/${existingPlayer.team_id}`)
    
    logger.database('UPDATE_PLAYER', 'Player updated successfully', user.id, { 
      playerId: paramsResult.data.id, 
      playerName: data.full_name,
      teamId: existingPlayer.team_id 
    })
    return createSuccessResponse(data)
  } catch (error) {
    logger.error('UPDATE_PLAYER', 'Unexpected error', { operation: 'UPDATE_PLAYER' }, error)
    return createErrorResponseFromSupabase(error, 'UPDATE_PLAYER')
  }
}

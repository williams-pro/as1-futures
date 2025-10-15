'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { UpdateTeamSchema } from '@/lib/types/admin.types'

const UpdateTeamParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function updateTeam(formData: FormData): Promise<ApiResponse> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'UPDATE_TEAM')

    // 2. Validación de parámetros
    const paramsResult = UpdateTeamParamsSchema.safeParse({
      id: formData.get('id'),
    })
    
    if (!paramsResult.success) {
      logger.authError('UPDATE_TEAM', 'Invalid team ID', user.id, paramsResult.error)
      return createErrorResponseFromSupabase(paramsResult.error, 'UPDATE_TEAM')
    }

    // 3. Validación de datos
    const logoUrl = formData.get('logo_url') as string
    const dataResult = UpdateTeamSchema.safeParse({
      team_code: formData.get('team_code'),
      name: formData.get('name'),
      group_id: formData.get('group_id'),
      logo_url: logoUrl === '' ? null : logoUrl,
      is_as1_team: formData.get('is_as1_team') === 'true',
    })
    
    if (!dataResult.success) {
      logger.authError('UPDATE_TEAM', 'Validation failed', user.id, dataResult.error)
      return createErrorResponseFromSupabase(dataResult.error, 'UPDATE_TEAM')
    }

    // 4. Verificar que el equipo existe
    const { data: existingTeam, error: fetchError } = await supabase
      .from('teams')
      .select('id, tournament_id, name')
      .eq('id', paramsResult.data.id)
      .single()

    if (fetchError || !existingTeam) {
      logger.databaseError('UPDATE_TEAM', 'Team not found', user.id, fetchError)
      return createErrorResponseFromSupabase(fetchError || new Error('Team not found'), 'UPDATE_TEAM')
    }

    // 5. Si se está cambiando el grupo, verificar que existe
    if (dataResult.data.group_id) {
      const { data: group, error: groupError } = await supabase
        .from('tournament_groups')
        .select('id, name, tournament_id')
        .eq('id', dataResult.data.group_id)
        .eq('tournament_id', existingTeam.tournament_id)
        .single()

      if (groupError || !group) {
        logger.databaseError('UPDATE_TEAM', 'Group not found or does not belong to tournament', user.id, groupError)
        return createErrorResponseFromSupabase(groupError || new Error('Group not found'), 'UPDATE_TEAM')
      }
    }

    // 6. Operación en DB
    const { data, error } = await supabase
      .from('teams')
      .update({
        ...dataResult.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paramsResult.data.id)
      .select(`
        *,
        group:tournament_groups(id, name, code, tournament_id)
      `)
      .single()

    if (error) {
      logger.databaseError('UPDATE_TEAM', 'Failed to update team', user.id, error)
      return createErrorResponseFromSupabase(error, 'UPDATE_TEAM')
    }

    // 7. Revalidar cache
    revalidatePath('/admin')
    revalidatePath('/admin/teams')
    revalidatePath(`/admin/tournaments/${existingTeam.tournament_id}`)
    
    logger.database('UPDATE_TEAM', 'Team updated successfully', user.id, { 
      teamId: paramsResult.data.id, 
      teamName: data.name 
    })
    return createSuccessResponse(data)
  } catch (error) {
    logger.error('UPDATE_TEAM', 'Unexpected error', { operation: 'UPDATE_TEAM' }, error)
    return createErrorResponseFromSupabase(error, 'UPDATE_TEAM')
  }
}

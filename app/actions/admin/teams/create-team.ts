'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { CreateTeamSchema } from '@/lib/types/admin.types'

export async function createTeam(formData: FormData): Promise<ApiResponse> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'CREATE_TEAM')

    // 2. Validación
    const result = CreateTeamSchema.safeParse({
      tournament_id: formData.get('tournament_id'),
      team_code: formData.get('team_code'),
      name: formData.get('name'),
      group_id: formData.get('group_id'),
      logo_url: formData.get('logo_url') || undefined,
      is_as1_team: formData.get('is_as1_team') === 'true',
    })
    
    if (!result.success) {
      logger.authError('CREATE_TEAM', 'Validation failed', user.id, result.error)
      return createErrorResponseFromSupabase(result.error, 'CREATE_TEAM')
    }

    // 3. Verificar que el torneo y grupo existen
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('id, name')
      .eq('id', result.data.tournament_id)
      .single()

    if (tournamentError || !tournament) {
      logger.databaseError('CREATE_TEAM', 'Tournament not found', user.id, tournamentError)
      return createErrorResponseFromSupabase(tournamentError || new Error('Tournament not found'), 'CREATE_TEAM')
    }

    const { data: group, error: groupError } = await supabase
      .from('tournament_groups')
      .select('id, name, tournament_id')
      .eq('id', result.data.group_id)
      .eq('tournament_id', result.data.tournament_id)
      .single()

    if (groupError || !group) {
      logger.databaseError('CREATE_TEAM', 'Group not found or does not belong to tournament', user.id, groupError)
      return createErrorResponseFromSupabase(groupError || new Error('Group not found'), 'CREATE_TEAM')
    }

    // 4. Operación en DB
    const { data, error } = await supabase
      .from('teams')
      .insert(result.data)
      .select(`
        *,
        group:tournament_groups(id, name, code)
      `)
      .single()

    if (error) {
      logger.databaseError('CREATE_TEAM', 'Failed to create team', user.id, error)
      return createErrorResponseFromSupabase(error, 'CREATE_TEAM')
    }

    // 5. Revalidar cache
    revalidatePath('/admin')
    revalidatePath('/admin/teams')
    revalidatePath(`/admin/tournaments/${result.data.tournament_id}`)
    
    logger.database('CREATE_TEAM', 'Team created successfully', user.id, { teamId: data.id, teamName: data.name })
    return createSuccessResponse(data)
  } catch (error) {
    logger.error('CREATE_TEAM', 'Unexpected error', { operation: 'CREATE_TEAM' }, error)
    return createErrorResponseFromSupabase(error, 'CREATE_TEAM')
  }
}




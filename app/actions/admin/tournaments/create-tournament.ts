'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { CreateTournamentSchema } from '@/lib/types/admin.types'

export async function createTournament(formData: FormData): Promise<ApiResponse> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'CREATE_TOURNAMENT')

    // 2. Validación
    const result = CreateTournamentSchema.safeParse({
      name: formData.get('name'),
      year: Number(formData.get('year')),
      season: formData.get('season'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      description: formData.get('description') || undefined,
      max_groups: Number(formData.get('max_groups')) || 2,
      teams_per_group: Number(formData.get('teams_per_group')) || 5,
    })
    
    if (!result.success) {
      logger.authError('CREATE_TOURNAMENT', 'Validation failed', user.id, result.error)
      return createErrorResponseFromSupabase(result.error, 'CREATE_TOURNAMENT')
    }

    // 3. Operación en DB
    const { data, error } = await supabase
      .from('tournaments')
      .insert({
        ...result.data,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      logger.databaseError('CREATE_TOURNAMENT', 'Failed to create tournament', user.id, error)
      return createErrorResponseFromSupabase(error, 'CREATE_TOURNAMENT')
    }

    // 4. Revalidar cache
    revalidatePath('/admin')
    revalidatePath('/admin/tournaments')
    
    logger.database('CREATE_TOURNAMENT', 'Tournament created successfully', user.id)
    return createSuccessResponse(data)
  } catch (error) {
    logger.databaseError('CREATE_TOURNAMENT', 'Unexpected error', undefined, error instanceof Error ? error : new Error(String(error)))
    return createErrorResponseFromSupabase(error, 'CREATE_TOURNAMENT')
  }
}

'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const UpdateMatchSchema = z.object({
  id: z.string().uuid('Invalid match ID'),
  match_code: z.string().min(3, 'Match code must be at least 3 characters').optional(),
  tournament_id: z.string().uuid('Invalid tournament ID').optional(),
  group_id: z.string().uuid('Invalid group ID').optional(),
  home_team_id: z.string().uuid('Invalid home team ID').optional(),
  away_team_id: z.string().uuid('Invalid away team ID').optional(),
  match_date: z.string()
    .min(1, 'Match date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  match_time: z.string()
    .min(1, 'Match time is required')
    .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format')
    .optional(),
  video_url: z.string().url('Invalid video URL').optional().or(z.literal(''))
})

export async function updateMatch(formData: FormData): Promise<ApiResponse<{ id: string; match_code: string }>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'UPDATE_MATCH')

    // 2. Validación
    const videoUrl = formData.get('video_url')
    const rawData = {
      id: formData.get('id'),
      match_code: formData.get('match_code'),
      tournament_id: formData.get('tournament_id'),
      group_id: formData.get('group_id'),
      home_team_id: formData.get('home_team_id'),
      away_team_id: formData.get('away_team_id'),
      match_date: formData.get('match_date'),
      match_time: formData.get('match_time'),
      video_url: videoUrl ? videoUrl.toString() : ''
    }
    
    const data = UpdateMatchSchema.parse(rawData)

    // 3. Obtener match actual
    const { data: currentMatch, error: fetchError } = await supabase
      .from('matches')
      .select('id, match_code, home_team_id, away_team_id, group_id')
      .eq('id', data.id)
      .single()

    if (fetchError || !currentMatch) {
      logger.databaseError('UPDATE_MATCH', 'Match not found', user.id, fetchError)
      return {
        success: false,
        error: 'Match not found',
        data: undefined
      }
    }

    // 4. Validar que los equipos sean diferentes si se están actualizando
    if (data.home_team_id && data.away_team_id && data.home_team_id === data.away_team_id) {
      return {
        success: false,
        error: 'Home team and away team must be different',
        data: undefined
      }
    }

    // 5. Validar que los equipos pertenezcan al grupo seleccionado si se están actualizando
    if (data.home_team_id || data.away_team_id || data.group_id) {
      const homeTeamId = data.home_team_id || currentMatch.home_team_id
      const awayTeamId = data.away_team_id || currentMatch.away_team_id
      const groupId = data.group_id || currentMatch.group_id

      const { data: homeTeam, error: homeTeamError } = await supabase
        .from('teams')
        .select('id, group_id')
        .eq('id', homeTeamId)
        .single()

      const { data: awayTeam, error: awayTeamError } = await supabase
        .from('teams')
        .select('id, group_id')
        .eq('id', awayTeamId)
        .single()

      if (homeTeamError || !homeTeam) {
        return {
          success: false,
          error: 'Home team not found',
          data: undefined
        }
      }

      if (awayTeamError || !awayTeam) {
        return {
          success: false,
          error: 'Away team not found',
          data: undefined
        }
      }

      if (homeTeam.group_id !== groupId || awayTeam.group_id !== groupId) {
        return {
          success: false,
          error: 'Both teams must belong to the selected group',
          data: undefined
        }
      }
    }

    // 6. Actualizar el match
    const updateData: any = {}
    if (data.match_code !== undefined) updateData.match_code = data.match_code
    if (data.tournament_id !== undefined) updateData.tournament_id = data.tournament_id
    if (data.group_id !== undefined) updateData.group_id = data.group_id
    if (data.home_team_id !== undefined) updateData.home_team_id = data.home_team_id
    if (data.away_team_id !== undefined) updateData.away_team_id = data.away_team_id
    
    // Convert date from YYYY-MM-DD to ISO format for database
    if (data.match_date !== undefined) {
      try {
        const date = new Date(data.match_date + 'T00:00:00.000Z')
        updateData.match_date = date.toISOString()
      } catch (error) {
        return {
          success: false,
          error: 'Invalid date format',
          data: undefined
        }
      }
    }
    
    if (data.match_time !== undefined) updateData.match_time = data.match_time
    if (data.video_url !== undefined) {
      updateData.video_url = data.video_url && data.video_url.trim() !== '' ? data.video_url : null
    }

    const { data: updatedMatch, error: updateError } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', data.id)
      .select()
      .single()

    if (updateError) {
      logger.databaseError('UPDATE_MATCH', 'Failed to update match', user.id, updateError)
      return createErrorResponseFromSupabase(updateError, 'UPDATE_MATCH')
    }

    logger.database('UPDATE_MATCH', 'Match updated successfully', user.id, {
      matchId: updatedMatch.id,
      matchCode: updatedMatch.match_code,
      changes: Object.keys(updateData)
    })

    // 7. Revalidar cache
    revalidatePath('/admin')

    return createSuccessResponse({
      id: updatedMatch.id,
      match_code: updatedMatch.match_code
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
    
    logger.error('UPDATE_MATCH', 'Unexpected error', { operation: 'UPDATE_MATCH' }, error)
    return createErrorResponseFromSupabase(error, 'UPDATE_MATCH')
  }
}



